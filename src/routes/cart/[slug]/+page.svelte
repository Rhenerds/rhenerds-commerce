<!-- src/routes/add-to-cart/[slug]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types'; // No ActionData needed as no form actions
  import { goto } from '$app/navigation'; // Import goto for navigation

  
  interface Props {
    // Props passed from +page.server.ts (data)
    data: PageData;
  }

  let { data }: Props = $props();

  // Extract data directly from the loaded data prop
  const productTitle = data.productTitle;
  const productDescription = data.productDescription;
  const productPrice = data.productPrice;
  const productImage = data.productImage || 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
  const isSuccess = data.success; // Use the success status from load data

  // Function to navigate to the cart page (assuming /cart route exists)
  function checkCart() {
    goto('/cart');
  }

  // Function to return to the main product catalog (assuming /catalog route exists)
  function returnToShopping() {
    goto('/catalog');
  }

  // Function to go back to the previous page in history
  function goBack() {
    history.back();
  }

  /**
   * Handles image loading errors by setting a placeholder image.
   * @param {Event} event - The error event.
   */
  function handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.onerror = null; // Prevent infinite loop if placeholder also fails
    imgElement.src = 'https://placehold.co/150x150/cccccc/333333?text=No+Image';
  }
</script>

<div class="flex flex-col items-center justify-center p-4 font-sans text-gray-900">
  <div class="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full">

    <!-- Display confirmation/error message and product info immediately -->
    <h1 class="bulletText text-4xl font-extrabold {isSuccess ? 'text-green-700' : 'text-red-700'} mb-6 bulletText">
      Product Added!
    </h1>
    <div class="flex flex-col items-center mb-6">
      <img src={productImage} alt={productTitle} class="w-32 h-32 object-cover rounded-lg shadow-md mb-4" onerror="{handleImageError}" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">{productTitle}</h2>
      <p class="text-lg text-gray-700 mb-1">{productDescription}</p>
      <p class="text-xl font-bold text-gray-800">{productPrice}</p>
      <p class="text-xl font-bold text-gray-800">Quantity in cart: {data.newQuantity}</p>
    </div>

    <div class="flex flex-col space-y-4">
      <button
        onclick={checkCart}
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Check Cart
      </button>
      <button
        onclick={returnToShopping}
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
      >
        Return to Shopping
      </button>
      <button
        onclick={goBack}
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Back to Products
      </button>
    </div>
  </div>
</div>

<style>
    h1 {
        font-family: "Roboto Flex";
        font-style: normal;
        font-weight: 600;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
    }
    h2 {
        font-family: "Roboto Flex";
        font-style: normal;
        font-weight: 400;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
    }
    p, button {
        font-family: "Roboto Flex";
        font-style: normal;
        font-weight: 300;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1px;
        font-size: 25px;
    }
</style>
