import type { PageServerLoad } from "../$types";


export const load: PageServerLoad = async ({ fetch, url }) => {
    const pinvoice = url.searchParams.get('inv')
    const invoice = decodeURI(pinvoice ?? "NoInvoice")

    var trstatus: string = ''

    if (invoice !== "NoInvoice") {
        const statusresponse = await fetch(
            '/api/trstat',
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                body: JSON.stringify({
                    invoice
                })
            }
        )

        if (statusresponse.ok) {
            const Resp = await statusresponse.json()
            console.log(Resp.result)
            trstatus = Resp.result
        } else {
            const Resp = await statusresponse.json()
            console.log(Resp.result)
            if (Resp.result === "NotFound") {
                trstatus = 'NotFound'
            } else {
                trstatus = 'ERROR'
            }
        }
    } else {
        trstatus = "NoInvoice"
    }

    return {
        "trstatus": trstatus
    }
}