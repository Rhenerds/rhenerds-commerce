import { Redis } from "@upstash/redis"
import { REDIS_READONLY } from "$env/static/private"
import { json } from "@sveltejs/kit"

const redis = new Redis({
  url: "https://glorious-mantis-30704.upstash.io",
  token: REDIS_READONLY,
})

async function queryKey(key: string) {
    var statusCode:number = 200
    var serror:string = ""
    var data: string | null = null

    try {
        data = await redis.get(key);
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

        // When an error occurs, data should generally be considered unavailable or an error state
        // Setting it to "0" here is specific to your requirement, but null or undefined might be more standard for error cases.
        data = "0"; 
    }

    // Handle the case where the key is not found (data is null)
    if (data === null) {
        statusCode = 404; // Not Found - Key does not exist in Redis
        data = "0"; // Set to "0" as per your requirement for not found
        serror = `Key "${key}" not found in Redis.`; // Provide a specific message for 404
    }

    return json(
        {
            "value" : data,
            "error" : serror
        },
        {
            "status" : statusCode
        }
    )
}

export async function POST({request}) {
    const {key} = await request.json()
    const redisresponse = await queryKey(key)
    return redisresponse
}