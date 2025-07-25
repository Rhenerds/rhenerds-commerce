import { CLIENTID, SECRET } from "$env/static/private"
import { randomUUID, createHash, createHmac } from 'crypto'
import { url } from "$lib/config"

const clientid = CLIENTID

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
    const jsoncart: EnrichedCartItem[] = JSON.parse(cart)

    const processedjson = mapEnrichedCartToDokuLineItems(jsoncart, url)
    
    const truuid = randomUUID()
    const pisoTimestamp: string = new Date().toISOString();
    const isoTimestamp: string = pisoTimestamp.substring(0, pisoTimestamp.indexOf('.')) + 'Z';

    const invoice_number = "INV-" + isoTimestamp

    const reqbody = {
        "order": {
            "amount": price,
            "invoice_number": invoice_number,
            "currency": "IDR",
            "callback_url_result": url + "summary/",
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
                "QRIS"
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

    console.log(hdigest)

    const signpayload = "Client-Id:"+ clientid +"\nRequest-Id:"+ truuid +"\nRequest-Timestamp:"+ isoTimestamp +"\nRequest-Target:"+ apitarget +"\nDigest:"+ hdigest

    const signature = createHmac('sha256', SECRET)
    .update(signpayload)
    .digest('base64')

    console.log(signature)

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

        // ... (rest of your success handling) ...

    } else {
        const errorData = await apiresponse.json();
        console.error('Doku API error response (JSON):', apiresponse.status, errorData); // Log the parsed JSON error object

        // ... (rest of your error handling) ...
    }

    

}

export async function POST( {request}) {
    const { nick, num, email, cartJson, totalPrice }  = await request.json()
    const apiresponse = await processCheckout(cartJson, totalPrice, nick, num, email)


}