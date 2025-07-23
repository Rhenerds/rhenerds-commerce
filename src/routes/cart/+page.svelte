<script lang="ts">
    interface CartItemCookie {
    slug: string;
    quantity: number;
  }

  interface EnrichedCartItem extends CartItemCookie {
    title: string; // Changed from name to title based on template usage
    price: string; // Price is a string "Rp ..." in the template
    imageUrl: string;
    linkstate: string; // Added based on template usage
    // Add other enriched product properties
  }

    let { data, form } = $props();

    let cartItems: EnrichedCartItem[] = $state(data?.cart || []);
    let updatedPrice: number = $state(data?.totalPrice || 0)

    $effect(() => {
    if (form?.success && form?.cart !== undefined) {
        cartItems = form.cart;
        // Directly update totalPrice from the form data returned by the action
        if (form?.totalPrice !== undefined) {
            updatedPrice = form.totalPrice;
        }
        }
    });

    function parseRupiahToNumber(rupiahString: string): number {
    if (!rupiahString) {
      return 0;
    }
    // Remove "Rp ", remove thousands separators (.), replace decimal comma (,) with a dot (.)
    const cleanedString = rupiahString.replace('Rp ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanedString);

  }

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

  function handleQuantityChange(event: Event) {
    const input = event.target as HTMLInputElement;
    // Find the closest form element
    const form = input.closest('form');
    if (form) {
      // Programmatically submit the form
      // requestSubmit() is preferred as it mimics a button click, triggering validation etc.
      form.requestSubmit();
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Prevent default form submission on Enter to avoid double submission
      // or page reload if not handled by SvelteKit's enhance
      event.preventDefault();
      handleQuantityChange(event);
    }
  }
</script>

<h1>Cart</h1>

<div class="pageview">
    <div class="cartview">
        {#if cartItems.length != 0}
            {#each cartItems as cartproduct}
            <div class="cartitem">
                <img class="prodimage" src="{cartproduct.imageUrl}" alt="{cartproduct.title} image">
                <div class="prodinfo">
                    {#if cartproduct.linkstate === 'PO'}
                        <p class="prodtext"><a target="_blank" href="/catalog/{cartproduct.slug}">{cartproduct.title}</a></p>
                    {/if}
                    {#if cartproduct.linkstate != 'PO'}
                        <p class="prodtext"><a target="_blank" style="text-decoration: line-through;" href="/catalog/{cartproduct.slug}">{cartproduct.title}</a></p>
                    {/if}
                    <p class="prodprice">{cartproduct.price} x {cartproduct.quantity}</p>
                    {#if cartproduct.linkstate != 'PO'}
                        <p style="font-size: 20px;" class="prodtextnu">Can't process non-preorder products! This wont proceed to checkout.</p>
                    {/if}
                </div>
                <div class="prodcontrolc">
                    <div class="spacing"></div>
                    <div class="proddelete">
                        <form method="POST" action="?/removeItem">
                            <input type="hidden" name="slug" value={cartproduct.slug} />
                            <button
                                type="submit"
                                class="prodtext"
                                aria-label="Remove item"
                                style="color: #FFF; text-align: center; height: 100%; width: 100%"
                            >
                                Remove
                            </button>
                        </form>
                    </div>
                    <div class="prodcontrol">
                        <div class="controldiv">
                            <form method="POST" action="?/decrementQuantity" class="inline-block">
                                <input type="hidden" name="slug" value={cartproduct.slug} />
                                <button
                                    type="submit"
                                    class="plusminus"
                                    aria-label="Increment quantity"
                                >
                                    -
                                </button>
                            </form>
                        </div>
                        <div class="controldiv">
                            <label for="quantity{cartproduct.slug}">Search</label>
                            <form method="POST" action="?/editQuantity" class="flex items-center space-x-2">
                                <input type="hidden" name="slug" value={cartproduct.slug} />
                                <label style="display: none;" for="quantity-{cartproduct.slug}"></label>
                                <input
                                    type="number"
                                    name="quantity"
                                    id="quantity-{cartproduct.slug}"
                                    value={cartproduct.quantity}
                                    min="0"
                                    onblur={handleQuantityChange}
                                    onkeydown={handleKeyPress}
                                    required
                                    placeholder="##"
                                />
                            </form>
                        </div>
                        <div class="controldiv">
                            <form method="POST" action="?/incrementQuantity" class="inline-block">
                                <input type="hidden" name="slug" value={cartproduct.slug} />
                                <button
                                    type="submit"
                                    class="plusminus"
                                    aria-label="Increment quantity"
                                >
                                    +
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/each}
            <div class="clearbar">
            <div class="clearspace"></div>
                <form method="POST" action="?/clearCart" style="width: fit-content;">
                    <button
                        type="submit"
                        aria-label="Clear cart"
                        class="clearbutton clearbuttonhover"
                    >
                        Clear cart
                    </button>
                </form>
            </div>
        {:else}
            <p class="empty">Cart is empty</p>
        {/if}
    </div>
    <div class="checkout">
        <h2>Shopping summary</h2>
        <p class="totalprice">Total: {formatNumberToRupiah(updatedPrice)}</p>
        <a href="/cart/checkout" class="checkoutbutton">Checkout</a>
    </div>
</div>

<style>
    .checkoutbutton {
        margin-top: 10px;
        color: #000;
        font-family: "Roboto Flex";
        font-size: 23px;
        font-style: normal;
        font-weight: 340;
        line-height: 107%; /* 18px */
        letter-spacing: -0.6px;
        width: calc(100% - 40px);
        background-color: #ee82ee;
        height: 50px;
        border-radius: 5px;
        display: flex;
        margin: 20px;
        text-align: center;
        justify-content: center;
        align-items: center;
    }

    .clearspace {
        width: calc(100% - 120px);
    }

    .clearbutton {
        width: 120px;
        height: 40px;
        background-color: #D00;
        color: #FFF;
        border-radius: 5px;
        margin: 5px;

        font-family: "Roboto Flex";
        font-size: 18px;
        font-style: normal;
        font-weight: 380;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
    }

    .clearbuttonhover:hover {
        background-color: #A00;
    }

    .clearbar {
        background-color: #AAA;
        border-radius: 10px;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        margin-top: 10px;
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

    h2 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 24px;
        font-style: normal;
        font-weight: 450;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
        margin: 20px;
    }

    .pageview{
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
    }

    .cartview {
        width: 75%;
        height: fit-content;
        padding-right: 20px;
        display: flex;
        flex-direction: column;
    }

    .cartitem {
        background-color: #AAA;
        border-radius: 10px;
        width: 100%;
        height: 150px;
        display: flex;
        flex-direction: row;
        margin-bottom: 15px;
    }

    .checkout {
        width: 25%;
        height: fit-content;
        background-color: #AAA;
        border-radius: 10px;
    }

    .prodimage {
        margin: 5px;
        height: 140px;
        width: 140px;
        object-fit: contain;
        background-color: #999;
        border-radius: 5px;
    }

    .prodinfo {
        display: flex;
        flex-direction: column;
        width: calc(100% - 350px);
        height: 100%;
        justify-content: center;
    }

    .prodtext {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 25px;
        font-style: normal;
        font-weight: 340;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
    }

    .prodtextnu {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 25px;
        font-style: normal;
        font-weight: 340;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
    }

    .prodtext:hover {
        text-decoration: underline 2px;
    }

    .empty {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 25px;
        font-style: normal;
        font-weight: 340;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
        width: 100%;
        text-align: center;
    }

    .prodprice {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 30px;
        font-style: normal;
        font-weight: 380;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
        margin-top: 10px;
    }

    .totalprice {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 30px;
        font-style: normal;
        font-weight: 380;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
        margin: 20px;
        margin-top: 10px;
    }

    .prodcontrolc {
        width: 190px;
        height: 100%;
    }

    .prodcontrol {
        width: 100%;
        height: 30%;
        background-color: #FFF;
        margin-bottom: 5px;
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        padding: 2px;
    }

    .controldiv {
        height: 100%;
        width: calc(33% - 1.3333px);
    }

    .controldiv:not(:last-child) {
        margin-right: 2px;
    }

    label {
		display: none;
	}

    form {
        height: 100%;
        width: 100%;
    }

    input[type="number"] {
        width: 100%;
        height: 100%;
        margin: 0;
        border: 0px;
        border-radius:1px;
        line-height: 1.5;
        color: #333;
        box-sizing: border-box;
        transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        background: transparent;
        text-align: center;
        font-size: 20px;
        font-family: 'Roboto Flex';
        -moz-appearance: textfield;

	}

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

	input[type="number"]:focus , input[type="number"]:hover {
        border-color: #000000;
        box-shadow: 0 0 0 3px rgba(59, 59, 59, 0.25);
        outline: none;
	}

    .plusminus {
        height: 100%;
        width: 100%;
        color: #000;
        font-family: "Roboto Flex";
        font-size: 30px;
        font-style: normal;
        font-weight: 380;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
        text-align: center;
    }

    .plusminus:hover {
        border-color: #000000;
        box-shadow: 0 0 0 3px rgba(59, 59, 59, 0.25);
        outline: none;
    }

    .proddelete {
        width: 100%;
        height: 30%;
        background-color: #D00;
        border-radius: 5px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .spacing {
        height: calc(40% - 20px);
    }
</style>