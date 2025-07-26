<script lang="ts">
    let { data } = $props()
    data.trstatus
</script>

{#if data.trstatus === 'SUCCESS'}
    <h1>Transaction Success!</h1>
    <p>We've received your order. See you there at Comifuro for pickup!</p>
{:else if data.trstatus === 'FAILURE'}
    <h1>Transaction Failed...</h1>
    <p>Aw shucks, payment didn't go through. Try again?</p>
{:else if data.trstatus === 'PENDING'}
    <h1>Transaction Pending</h1>
    <p>We're still processing your payment, wait a bit then refresh this page!</p>
{:else if data.trstatus === 'NoInvoice'}
    <h1>Invalid invoice</h1>
    <p>Are you sure that's an invoice number?</p>
{:else if data.trstatus === 'NotFound'}
    <h1>Invoice Not Found</h1>
    <p>P.S. If you've already paid by QRIS, you may need to wait a while and refresh. If this problem persists, mind forward this to our team?</p>
{:else if data.trstatus === 'ERROR'}
    <h1>Backend Error</h1>
    <p>Couldn't get proper response from our invoice checking api. Mind forwarding this to our team?</p>
{:else}
    <h1>Frontend Error</h1>
    <p>This isn't suppose to happen... Mind forwarding this to our team?</p>
{/if}