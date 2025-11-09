<script lang="ts">
    let { data } = $props()

    function formatNumberToRupiah(num: number): string {
        if (isNaN(num) || !isFinite(num)) {
            return "Rp 0,00"; // Handle invalid numbers gracefully
        }

        // Ensure two decimal places, using toFixed for consistent rounding
        const parts = num.toFixed(2).split('.');
        let integerPart = parts[0];
        const decimalPart = parts.length > 1 ? parts[1] : '00';

        // Add thousands separators (dots) to the integer part
        let formattedIntegerPart = '';
        for (let i = integerPart.length - 1; i >= 0; i--) {
            formattedIntegerPart = integerPart[i] + formattedIntegerPart;
            if (i > 0 && (integerPart.length - i) % 3 === 0) {
            formattedIntegerPart = '.' + formattedIntegerPart;
            }
        }

        return `Rp ${formattedIntegerPart},${decimalPart}`;
    }
</script>

<a href="/cart" class="BackLink">Return to cart to edit order</a>
<h1>Checkout</h1>
<div class="checkoutview">
    <div class="productview">
        {#each data.cart as product}
            <div class="oneproduct">
                <img class="prodimg" alt="{product.title} image" src="{product.imageUrl}">
                <div class="prodinfo">
                    <p class="prodtext">{product.title}</p>
                    <p class="prodtext">{product.quantity} x {product.price}</p>
                    <p class="prodtext">{product.type} - {product.fandom}</p>
                </div>
            </div>
            <div class="barrier"></div>
        {/each}
    </div>
    <div class="infoview">
        <p class="checkouttext">Amount Due:</p>
        <p class="checkouttext">{formatNumberToRupiah(data.totalPrice)}</p>
        {#if data.cart.length > 0}
            <p class="checkouttext">Biodata:</p>
            <form method="POST" action="?/checkout">
                <label for="nick">Nickname (required):</label>
                <input type="text" id="nick" name="nick" placeholder="eg: John Doe" required/>
                <label for="phone">Phone number (required):</label>
                <input type="tel" id="phone" name="phone" placeholder="eg: 6287812345678" required/>
                <label for="email">Email (required): </label>
                <input type="email" id="email" name="email" placeholder="eg: johndoe@email.com" required/>
                <button type="submit">Payment (DOKU)</button>
            </form>
        {:else}
            <p class="checkouttext">Make sure to have items in your cart</p>
        {/if}
        {#if data.errStatus === "erlink"}
            <p class="errtext">Failed to get payment page from Doku, check if your contact information is valid. If problem persists please contact us.</p>
        {/if}
        {#if data.errStatus === "erserv"}
            <p class="errtext">Nerds Commerce backend failed to generate proper response. Please contact us.</p>
        {/if}
        {#if data.errStatus === "ercart"}
            <p class="errtext">Your cart contains an item or more, which it's in-cart quantity is more than the available stock.</p>
        {/if}
        {#if data.errStatus === "existingcheckout"}
            <p class="errtext">Please avoid clicking on checkout again if you've returned from the Doku checkout page. To edit your order, contact us to void your unpaid invoice, then submit another checkout request.</p>
        {/if}
        <img src="/assets/doku.png" alt="Secure payment by Doku" />
        <p class="notice">By proceeding to payment, you acknowledge and agree to our <a class="Link" href="/legal" target="_blank">legal terms and notices</a>. Your personal information is encrypted using ssl/tls during transport.</p>
    </div>
</div>

<style>
    button {
        margin-top: 10px;
        color: #000;
        font-family: "Roboto Flex";
        font-size: 23px;
        font-style: normal;
        font-weight: 340;
        line-height: 107%; /* 18px */
        letter-spacing: -0.6px;
        width: 100%;
        background-color: #ee82ee;
        height: 50px;
        border-radius: 5px;
        margin-top: 20px;
    }

    .checkouttext {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 30px;
        font-style: normal;
        font-weight: 400;
        line-height: 107%; /* 18px */
        letter-spacing: -0.6px;
        margin-bottom: 20px;
    }

    label, input {
        display: block;
    }

    label {
        margin-top: 10px;
        color: #000;
        font-family: "Roboto Flex";
        font-size: 23px;
        font-style: normal;
        font-weight: 340;
        line-height: 107%; /* 18px */
        letter-spacing: -0.6px;
    }

    .notice {
        margin-top: 10px;
        color: #000;
        font-family: "Roboto Flex";
        font-size: 18px;
        font-style: normal;
        font-weight: 340;
        line-height: 107%; /* 18px */
        letter-spacing: -0.6px;
    }

    .errtext {
        margin-top: 10px;
        color: #000;
        font-family: "Roboto Flex";
        font-size: 23px;
        font-style: normal;
        font-weight: 340;
        line-height: 107%; /* 18px */
        letter-spacing: -0.6px;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input {
        width: 100%;
        -moz-appearance: textfield;
        color: #000;
        font-family: "Roboto Flex";
        font-size: 23px;
        font-style: normal;
        font-weight: 340;
        line-height: 107%; /* 18px */
        letter-spacing: -0.6px;
        border-radius: 5px;
    }

    .prodtext {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 23px;
        font-style: normal;
        font-weight: 340;
        line-height: 107%; /* 18px */
        letter-spacing: -0.6px;
    }

    .prodimg {
        background-color: #AAA;
        border-radius: 5px;
        width: 75px;
        height: 75px;
        object-fit: contain;
    }

    .prodinfo {
        padding-left: 20px;
    }

    .BackLink {
		color: #000158;
		text-align: left;
		font-family: "Roboto Flex";
		font-size: 20px;
		font-style: normal;
		font-weight: 300;
		line-height: 90%; /* 18px */
		letter-spacing: -0.6px;
		margin-bottom: 10px;
	}

	.BackLink:hover {
		text-decoration: underline 2px;
	}

    .Link {
		color: #000158;
	}

    .Link:hover {
		text-decoration: underline 2px;
	}

    h1 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 64px;
        font-style: normal;
        font-weight: 600;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
        margin-bottom: 90px;
    }

    .checkoutview {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
    }

    .productview {
        width: calc(100% - 350px);
        height: fit-content;
        padding-left: 20px;
    }

    .infoview {
        width: 330px;
        margin-left: 20px;
        height: fit-content;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 16px;
		border: 3px solid #00000020;
		border-radius: 20px;
        padding: 20px;
    }

    .oneproduct {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
    }

    .barrier {
        width: 100%;
        height: 2px;
        border-radius: 1px;
        background-color: #666;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .barrier:last-child {
        display: none;
    }
</style>