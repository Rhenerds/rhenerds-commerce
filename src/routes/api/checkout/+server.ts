import { env } from "$env/dynamic/private"
import { randomUUID, createHash, createHmac } from 'crypto'
import { url } from "$lib/config"
import { json } from "@sveltejs/kit"
import { Redis } from "@upstash/redis"
import { REDIS_READWRITE } from "$env/static/private"

const redis = new Redis({
  url: "https://glorious-mantis-30704.upstash.io",
  token: REDIS_READWRITE,
})


const clientid = env.CLIENTID

const apiurl = "https://api.doku.com/checkout/v1/payment"
const apitarget = "/checkout/v1/payment"

interface EnrichedCartItem {
  title: string;
  imageUrl: string;
  slug: string;
  quantity: number;
  price: string; // Include price for display/total calculation
  linkstate: string; // Added linkstate to EnrichedCartItem
  fandom: string;
  type: string;
}

interface deductCartItem {
  slug: string;
  quantity: number;
}

async function handleDecrement(cart: deductCartItem[], stock: { [key: string]: string | null }) {
  var newStock: { [key: string]: string }= {}

  for (const item of cart) {
    newStock[item.slug] = String(Number(stock[item.slug] ?? "0") - item.quantity)
  }

  const response = await redis.mset(newStock)
  return response
}

async function queryKeys(keys: string[]) {
  let statusCode: number = 200;
  let serror: string = "";
  // Initialize rawValues as an empty array of string | null
  let rawValues: (string | null)[] = []; 
  // Initialize resultDict to be populated on success, null on error
  let resultDict: { [key: string]: string | null } | null = null; 

  try {
    // Correctly call mget with spread operator and explicit type parameter
    rawValues = await redis.mget<string>(...keys); 

    // Pair the rawValues into the dictionary ONLY if the try block was successful
    const tempDict: { [key: string]: string | null } = {};
    keys.forEach((key, index) => {
      tempDict[key] = rawValues[index]; // rawValues[index] will be string or null
    });
    resultDict = tempDict; // Assign the successfully paired data
    
  } catch (error) {
    if (error instanceof Error) {
      serror = error.message;

      // --- Assign status codes based on specific error messages ---
      if (
        serror.includes("getaddrinfo ENOTFOUND") ||
        serror.includes("ECONNRESET") ||
        serror.includes("Connection closed by server") ||
        serror.includes("Socket closed unexpectedly")
      ) {
        statusCode = 502; // Bad Gateway - issue connecting to Upstash
      } else if (serror.includes("WRONGPASS invalid or missing auth token") || serror.includes("NOAUTH Authentication required")) {
        statusCode = 401; // Unauthorized - authentication failed
      } else if (serror.includes("ERR max concurrent connections exceeded")) {
        statusCode = 503; // Service Unavailable - Redis capacity exceeded
      } else if (serror.includes("ERR max requests limit exceeded") || serror.includes("ERR max daily request limit exceeded")) {
        statusCode = 429; // Too Many Requests - Rate limit exceeded
      } else if (serror.includes("ERR max request size exceeded")) {
        statusCode = 413; // Payload Too Large - Data sent was too big
      } else if (
        serror.includes("ERR wrong number of arguments for") ||
        serror.includes("ERR syntax error")
      ) {
        statusCode = 400; // Bad Request - Invalid Redis command (likely due to bad input)
      } else if (
        serror.includes("[Upstash Redis] The 'url' property is missing") ||
        serror.includes("ReferenceError: fetch is not defined")
      ) {
        statusCode = 500; // Internal Server Error - Application config or environment issue
      } else {
        // Default catch-all for any other unexpected Error
        statusCode = 500;
        console.error("Unhandled Redis Error Message:", serror); 
      }
    } else {
      // For errors that are not instances of Error (rare but good to handle)
      serror = String(error);
      statusCode = 500;
      console.error("Unknown Error Type:", error);
    }

    // In case of error, set resultDict to null to clearly indicate no data was retrieved
    resultDict = null; 
  }

  return {
      "values" : resultDict, // This will be the key-value map or null
      "error" : serror
    }
}

function parseRupiahToNumber(rupiahString: string): number {
  if (!rupiahString) {
    return 0;
  }
  // Remove "Rp ", remove thousands separators (.), replace decimal comma (,) with a dot (.)
  const cleanedString = rupiahString.replace('Rp ', '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedString);
}

function mapEnrichedCartToDokuLineItems(
  enrichedCart: Record<string, any>[], // Input is a list of dictionaries
  baseUrl: string
): Record<string, any>[] { // Output is also a list of dictionaries
  return enrichedCart.map(item => {
    // Convert price string to number.
    // Doku often expects integer amount for IDR, so if your 'price' field
    // includes decimals (e.g., "10.50") and Doku needs the smallest currency unit (e.g., "1050"),
    // you might need to adjust `numericPrice * 100` or similar based on their specific requirements.
    const numericPrice = parseRupiahToNumber(item.price);

    return {
      "id": item.slug,
      "name": item.title,
      "quantity": item.quantity,
      "price": numericPrice, // Use the parsed numeric price
      "category": item.fandom,
      "url": `${baseUrl}catalog/${item.slug}`, // Concatenate base URL with catalog path and slug
      "image_url": item.imageUrl,
      "type": item.type
    };
  });
}

async function processCheckout(cart:string, price: string, name: string, phone: string, email: string) {
  var result: string, link: string, statuscode: number

  const jsoncart: EnrichedCartItem[] = JSON.parse(cart)
  const cartforstockverify: string[] = jsoncart
  .map(item => item.slug);

  const stockdata = await queryKeys(cartforstockverify)

  var flagCantProcess = false

  for (const cartItem of jsoncart) {
    const stockValue = stockdata.values ? stockdata.values[cartItem.slug] : 0;
    if (cartItem.quantity > Number(stockValue) || Number(stockValue) === 0) {
      flagCantProcess = true
    }
  }

  if (flagCantProcess === false) {
    const cartforstockdecrement: deductCartItem[] = jsoncart
    .map(item => ({
      slug: item.slug,
      quantity: item.quantity
    }));

    await handleDecrement(cartforstockdecrement, stockdata.values ?? {})

    const processedjson = mapEnrichedCartToDokuLineItems(jsoncart, url)
    
    const truuid = randomUUID()
    const pisoTimestamp: string = new Date().toISOString();
    const isoTimestamp: string = pisoTimestamp.substring(0, pisoTimestamp.indexOf('.')) + 'Z';
    const forInvoice:string = isoTimestamp.replace(/:/g, "")

    const invoice_number = "INV-" + forInvoice

    const reqbody = {
        "order": {
            "amount": price,
            "invoice_number": invoice_number,
            "currency": "IDR",
            "callback_url_result": url + "summary?inv=" + invoice_number + "&refer=checkout",
            "callback_url": url + "cart/checkout/",
            "language":"EN",
            "auto_redirect":true,
            "disable_retry_payment" :true,
            "recover_abandoned_cart": true,
            "expired_recovered_cart":2,
            "line_items": processedjson
        },
        "payment": {
            "payment_due_date": 60,
            "type" : "SALE",
            "payment_method_types": [
                "EMONEY_SHOPEEPAY",
                "EMONEY_OVO",
                "EMONEY_DANA",
                "EMONEY_DOKU",
                "EMONEY_LINKAJA",
                "QRIS",
                "VIRTUAL_ACCOUNT_DOKU"
            ]
        },
        "customer":{
            "name":name,
            "phone":phone,
            "email": email
        }
    }

    const stringreqbody = JSON.stringify(reqbody)
    console.log(stringreqbody)

    const hdigest = createHash('sha256') // Uses createHash, not createHmac
    .update(JSON.stringify(reqbody))
    .digest('base64');

    const signpayload = "Client-Id:"+ clientid +"\nRequest-Id:"+ truuid +"\nRequest-Timestamp:"+ isoTimestamp +"\nRequest-Target:"+ apitarget +"\nDigest:"+ hdigest

    const signature = createHmac('sha256', env.SECRET)
    .update(signpayload)
    .digest('base64')

    const apiresponse = await fetch(
        apiurl, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Client-Id': clientid,
                'Request-Id': truuid,
                'Request-Timestamp': isoTimestamp,
                'Signature': 'HMACSHA256='+signature
            },
            body: JSON.stringify(reqbody)
        }
    )

    if (apiresponse.ok) {
        const responseData = await apiresponse.json();
        console.log('Doku API success response (JSON):', responseData); // Log the parsed JSON object
        if (responseData.message[0] === 'SUCCESS') {
          result = "SUCCESS"
          link = responseData.response.payment.url
          statuscode = 200
        } else {
          result = "FAILURE"
          link = "NONE"
          statuscode = 500
        }

    } else {
        const errorData = await apiresponse.json();
        console.error('Doku API error response (JSON):', apiresponse.status, errorData); // Log the parsed JSON error object
        result = "FAILURE"
        link = "NONE"
        statuscode = 500

    }
  } else {
    result = "CARTISSUE"
    link = "NONE"
    statuscode = 400
  }

  return json( {"result": result, "link": link}, {"status": statuscode} )    

}

export async function POST( {request}) {
  const { nick, num, email, cartJson, totalPrice }  = await request.json()
  const apiresponse = await processCheckout(cartJson, totalPrice, nick, num, email)
  return apiresponse

}