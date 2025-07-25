// src/routes/cart/+page.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

interface CartItemCookie {
  slug: string;
  quantity: number;
}

interface EnrichedCartItem {
  title: string;
  imageUrl: string;
  slug: string;
  quantity: number;
  price: string; // Include price for display/total calculation
  linkstate: string; // Added linkstate to EnrichedCartItem
  fandom: string;
  type: string;
}

// Define the structure of a product from the API response
interface ApiProduct {
  title: string;
  description: string;
  fandom: string;
  type: string;
  published: boolean;
  price: string;
  link: string;
  linkstate: string; // linkstate is available in ApiProduct
  images: string[];
  slug: string;
}

const CART_COOKIE_NAME = 'user_cart'

function calculateTotalPrice(enrichedCart: EnrichedCartItem[]): number {
  let total = 0;
  for (const item of enrichedCart) {
    if (item.linkstate === 'PO') { // Only include 'PO' products in total
      const priceAsNumber = parseRupiahToNumber(item.price);
      total += priceAsNumber * item.quantity;
    }
  }
  return total;
}

function parseRupiahToNumber(rupiahString: string): number {
  if (!rupiahString) {
    return 0;
  }
  // Remove "Rp ", remove thousands separators (.), replace decimal comma (,) with a dot (.)
  const cleanedString = rupiahString.replace('Rp ', '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedString);
}

function enrichCart(rawCart: CartItemCookie[], productsFromApi: ApiProduct[]): EnrichedCartItem[] {
  // First, map the raw cart items to enriched items, providing fallbacks for missing products.
  // Then, filter this mapped array to only include products that are found AND have 'PO' linkstate.
    return rawCart
        .map(cartItem => {
            const productDetails = productsFromApi.find(apiProduct => apiProduct.slug === cartItem.slug);

        // Return the enriched item or a temporary placeholder if not found/not 'PO'
        // We will filter these out in the next step.
            return {
                title: productDetails ? productDetails.title : '', // Empty string for title if not found, will be filtered
                imageUrl: (productDetails && productDetails.images && productDetails.images[0]) ? productDetails.images[0] : 'https://placehold.co/150x150/cccccc/333333?text=No+Image',
                slug: cartItem.slug,
                quantity: cartItem.quantity,
                price: productDetails ? productDetails.price : 'Rp 0,00', // Default price if not found
                linkstate: productDetails ? productDetails.linkstate : '', // Empty string for linkstate if not found, will be filtered
                fandom: productDetails ? productDetails.fandom : '',
                type: productDetails ? productDetails.type : '',
            };
        })
        .filter(enrichedItem => {
            // Filter out items that are not found or do not have 'PO' linkstate
            return enrichedItem.linkstate === 'PO';
        });
}

// ... (your existing type definitions, parseRupiahToNumber, enrichCart, calculateTotalPrice) ...

// The load function for your checkout page
export const load: PageServerLoad = async ({ fetch, locals, cookies, url }) => {
  // Access the cart data that was parsed and attached by hooks.server.ts
  let rawCart: CartItemCookie[] = locals.cart || []; // Initialize with locals.cart
  const errStatus = url.searchParams.get('r');

  // If locals.cart is empty or null/undefined, try to get from 'user_cart' cookie
  if (!rawCart || rawCart.length === 0) {
    const userCartCookie = cookies.get(CART_COOKIE_NAME);
    if (userCartCookie) {
      try {
        const parsedUserCart: CartItemCookie[] = JSON.parse(userCartCookie);
        // Basic validation for the parsed cookie content
        if (Array.isArray(parsedUserCart) && parsedUserCart.every(item => typeof item === 'object' && item !== null && 'slug' in item && 'quantity' in item)) {
          rawCart = parsedUserCart;
          console.log('Cart loaded from user_cart cookie:', rawCart);
        } else {
          console.warn('Invalid user_cart cookie format, ignoring:', userCartCookie);
          cookies.delete('user_cart', { path: '/' }); // Optionally clear invalid cookie
        }
      } catch (e) {
        console.error('Error parsing user_cart cookie:', e);
        cookies.delete('user_cart', { path: '/' }); // Optionally clear invalid cookie
      }
    }
  }

  // Fetch products from API (as you already have)
  let productsFromApi: ApiProduct[] = [];
  try {
    const apiResponse = await fetch('/api/productquery');
    if (apiResponse.ok) {
      productsFromApi = await apiResponse.json();
    } else {
      console.error('Failed to fetch products:', apiResponse.statusText);
    }
  } catch (error) {
    console.error('Error fetching product data in load function:', error);
  }

  // Enrich the cart with product details (using your existing function)
  const enrichedCart = enrichCart(rawCart, productsFromApi);

  // Calculate total price (using your existing function)
  const totalPrice = calculateTotalPrice(enrichedCart);

  // Return the data. This data becomes the `data` prop in +page.svelte
  return {
    cart: enrichedCart, // This is the cart content you want in +page.svelte
    totalPrice: totalPrice,
    errStatus: errStatus,
  };
};

export const actions: Actions = {
// Placeholder for checkout logic
  checkout: async ({ request, cookies, locals, fetch }) => { // Added fetch here
    const data = await request.formData();

    const nick = data.get('nick') as string
    const num = data.get('phone') as string
    const email = data.get('email') as string

    var redirlink: string

    let rawCart: CartItemCookie[] = locals.cart || []; // Initialize with locals.cart

    // If locals.cart is empty or null/undefined, try to get from 'user_cart' cookie
    if (!rawCart || rawCart.length === 0) {
      const userCartCookie = cookies.get(CART_COOKIE_NAME);
      if (userCartCookie) {
        try {
          const parsedUserCart: CartItemCookie[] = JSON.parse(userCartCookie);
          // Basic validation for the parsed cookie content
          if (Array.isArray(parsedUserCart) && parsedUserCart.every(item => typeof item === 'object' && item !== null && 'slug' in item && 'quantity' in item)) {
            rawCart = parsedUserCart;
            console.log('Cart loaded from user_cart cookie:', rawCart);
          } else {
            console.warn('Invalid user_cart cookie format, ignoring:', userCartCookie);
            cookies.delete('user_cart', { path: '/' }); // Optionally clear invalid cookie
          }
        } catch (e) {
          console.error('Error parsing user_cart cookie:', e);
          cookies.delete('user_cart', { path: '/' }); // Optionally clear invalid cookie
        }
      }
    }

    // Fetch products from API (as you already have)
    let productsFromApi: ApiProduct[] = [];
    try {
      const apiResponse = await fetch('/api/productquery');
      if (apiResponse.ok) {
        productsFromApi = await apiResponse.json();
      } else {
        console.error('Failed to fetch products:', apiResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching product data in load function:', error);
    }

    // Enrich the cart with product details (using your existing function)
    const enrichedCart = enrichCart(rawCart, productsFromApi);

    // Calculate total price (using your existing function)
    const totalPrice = calculateTotalPrice(enrichedCart);

    const cartJson = JSON.stringify(enrichedCart);

    const response = await fetch(
      '/api/checkout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nick,
          num,
          email,
          cartJson,
          totalPrice
        })
      }
    )

    if (response.ok) {
      const responseData = await response.json()
      console.log(responseData)
      if (responseData.result === "SUCCESS") {
        redirlink = responseData.link
      } else {
        redirlink = "/cart/checkout?r=erlink"
      }
    } else {
      redirlink = "/cart/checkout?r=erserv"
    }

    return redirect(303, redirlink)
  }
  
};