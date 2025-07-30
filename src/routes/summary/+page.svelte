<script lang="ts">
    let { data } = $props()
    data.trstatus
</script>

{#if data.trstatus === 'SUCCESS'}
    <img src="/assets/statuspage/success.png" style="image-rendering: crisp-edges;" alt="A drawing of two fish approving a package, your order went through!">
    <h1>Transaction Success!</h1>
    <p>We've received your order. See you there at Comifuro for pickup! Thank you for ordering :3</p>
    <p>Make sure you've received your 'Order Complete' invoice in your email inbox for pickup.</p>
    <p>We'll also add your phone number to a WhatsApp group for better pickup communications</p>
    <p>Invoice Number: {data.invoice}</p>
    <div class="links">
        <a class="link" href="/">To Home</a>
    </div>
{:else if data.trstatus === 'FAILURE'}
    <img src="/assets/statuspage/failed.png" alt="A drawing of a fish being shocked a package exploded, your order most likely failed">
    <h1>Transaction Failed...</h1>
    <p>Aw shucks, payment didn't go through. Try again?</p>
    <div class="links">
        <a class="link" href="/cart/checkout">Retry</a>
        <a class="link" href="/">To Home</a>
    </div>
{:else if data.trstatus === 'PENDING'}
    <img src="/assets/statuspage/pending.png" alt="A drawing of fishes, with one carrying it accross a globe, your order is pending">
    <h1>Transaction Pending</h1>
    <p>We're still processing your payment, wait a bit then refresh this page!</p>
    <div class="links">
        <a class="link" href=".">Refresh</a>
        <a class="link" href="/">To Home</a>
    </div>
{:else if data.trstatus === 'NoInvoice'}
    <img src="/assets/statuspage/failed.png" alt="A drawing of a fish being shocked a package exploded, your order most likely failed">
    <h1>Invalid invoice</h1>
    <p>Are you sure that's an invoice number?</p>
    <div class="links">
        <a class="link" href=".">Refresh</a>
        <a class="link" href="/">To Home</a>
    </div>
{:else if data.trstatus === 'NotFound'}
    <img src="/assets/statuspage/failed.png" alt="A drawing of a fish being shocked a package exploded, your order most likely failed">
    <h1>Invoice Not Found</h1>
    <p>P.S. If you've already paid by QRIS, you may need to wait a while and refresh. If this problem persists, mind forward this to our team?</p>
    <div class="links">
        <a class="link" href=".">Refresh</a>
        <a class="link" href="/">To Home</a>
    </div>
{:else if data.trstatus === 'ERROR'}
    <img src="/assets/statuspage/failed.png" alt="A drawing of a fish being shocked a package exploded, your order most likely failed">
    <h1>Backend Error</h1>
    <p>Couldn't get proper response from our invoice checking api. Mind forwarding this to our team?</p>
    <div class="links">
        <a class="link" href=".">Refresh</a>
        <a class="link" href="/about">Contact Us</a>
        <a class="link" href="/">To Home</a>
    </div>
{:else}
    <img src="/assets/statuspage/failed.png" alt="A drawing of a fish being shocked a package exploded, your order most likely failed">
    <h1>Frontend Error</h1>
    <p>This isn't suppose to happen... Mind forwarding this to our team?</p>
    <div class="links">
        <a class="link" href=".">Refresh</a>
        <a class="link" href="/about">Contact Us</a>
        <a class="link" href="/">To Home</a>
    </div>
{/if}

<style>
    h1 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 64px;
        font-style: normal;
        font-weight: 600;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
        width: 100%;
        text-align: center;
    }

    p {
        font-family: 'Roboto Flex';
        margin: 5px;
        width: 100%;
        text-align: center;
        color: #000;
        font-size: 25px;
        font-style: normal;
        font-weight: 300;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
    }

    img {
        width: 100%;
        height: 500px;
        object-fit: contain;
        margin-bottom: 20px;
    }

    .links {
        display: flex;
        flex-direction: row;
        gap: 40px;
        justify-content: center;
        width: 100%;
        height: fit-content;
        margin-top: 20px;
    }

    .link {
        color: #002b88;
        text-align: center;
        font-family: "Roboto Flex";
        font-size: 30px;
        font-style: normal;
        font-weight: 300;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
        width: 200px;
    }
</style>