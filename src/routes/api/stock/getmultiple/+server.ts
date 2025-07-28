import { Redis } from "@upstash/redis/cloudflare"
import { env } from "$env/dynamic/private"
import { json } from "@sveltejs/kit"

const redis = new Redis({
  url: "https://glorious-mantis-30704.upstash.io",
  token: env.REDIS_READONLY,
})

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

  return json(
    {
      "values" : resultDict, // This will be the key-value map or null
      "error" : serror
    },
    {
      "status" : statusCode
    }
  );
}

export async function POST({request}) {
  const {keys} = await request.json(); // keys is an array of strings from the request body
  const redisResponse = await queryKeys(keys);
  return redisResponse;
}