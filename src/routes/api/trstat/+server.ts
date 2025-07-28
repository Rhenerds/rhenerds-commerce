import { env } from "$env/dynamic/private"
import { randomUUID, createHmac } from 'crypto'
import { json } from "@sveltejs/kit"

const clientid = env.CLIENTID

async function getStatus(invoice_number:string) {
    var result: string
    var status: number

    console.log("now checking: ", decodeURI(invoice_number))
    const apiurl = "https://api.doku.com/orders/v1/status/" + invoice_number
    const apitarget = "/orders/v1/status/" + invoice_number

    const truuid = randomUUID()
    const pisoTimestamp: string = new Date().toISOString();
    const isoTimestamp: string = pisoTimestamp.substring(0, pisoTimestamp.indexOf('.')) + 'Z';

    const signpayload = "Client-Id:"+ clientid +"\nRequest-Id:"+ truuid +"\nRequest-Timestamp:"+ isoTimestamp +"\nRequest-Target:"+ apitarget

    const signature = createHmac('sha256', env.SECRET)
    .update(signpayload)
    .digest('base64')

    const apiresponse = await fetch(
        apiurl, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Client-Id': clientid,
                'Request-Id': truuid,
                'Request-Timestamp': isoTimestamp,
                'Signature': 'HMACSHA256='+signature
            }
        }
    )

    if (apiresponse.ok) {
        const responseData = await apiresponse.json();
        console.log('Doku API success response (JSON):', responseData); // Log the parsed JSON object
        if (responseData.transaction.status === 'SUCCESS') {
            result = "SUCCESS"
            console.log("YAYYYY")
        } else if(responseData.transaction.status === 'PENDING') {
            result = "PENDING"
        } else {
            result = "FAILURE"
        }
        status = 200

    } else {
        const errorData = await apiresponse.json();
        console.error('Doku API error response (JSON):', apiresponse.status, errorData); // Log the parsed JSON error object
        if (errorData.error.code === "data_not_found") {
            result = "NotFound"
            status = 404
            console.log("most likely we haven't received it")
        } else {
            result = "FAILURE"
            status = 500
            console.log("big oof")
        }

    }

    return json( {"result": result}, {"status": status})
    
}

export async function POST( {request}) {
  const { invoice }  = await request.json()
  const apiresponse = await getStatus(invoice)
  return apiresponse

}