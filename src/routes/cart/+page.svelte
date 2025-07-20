<script lang="ts">
    let { data } = $props();

    function parseRupiahToNumber(rupiahString: string): number {
    if (!rupiahString) {
      return 0;
    }
    // Remove "Rp ", remove thousands separators (.), replace decimal comma (,) with a dot (.)
    const cleanedString = rupiahString.replace('Rp ', '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanedString);

  }
</script>

<h1>Cart</h1>

<div class="pageview">
    <div class="cartview">
        {#each data.cart as cartproduct}
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
            </div>
            <div class="prodcontrolc">
                <div class="prodcontrol">
                    <div class="controldiv">-</div>
                    <div class="controldiv">
                        <label for="quantity{cartproduct.slug}">Search</label>
  			            <input type="text" id="quantity{cartproduct.slug}" placeholder="...">
                    </div>
                    <div class="controldiv">+</div>
                </div>
            </div>
        </div>
        {/each}
    </div>
    <div class="checkout">

    </div>
</div>

<style>
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
        width: calc(100% - 300px);
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

    .prodtext:hover {
        text-decoration: underline 2px;
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

    .prodcontrolc {
        width: 140px;
        height: 100%;
        position: relative;
    }

    .prodcontrol {
        width: 100%;
        height: 40%;
        background-color: #FFF;
        position: absolute;
        bottom: 5px;
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

    input[type="text"] {
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
	}

	input[type="text"]:focus {
        border-color: #000000;
        box-shadow: 0 0 0 3px rgba(59, 59, 59, 0.25);
        outline: none;
	}
</style>