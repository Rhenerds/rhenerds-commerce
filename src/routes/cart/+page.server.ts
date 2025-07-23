// src/routes/cart/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

// Define the simplified structure of a cart item as stored in the cookie
interface CartItemCookie {
  slug: string;
  quantity: number;
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

// Define the structure of an enriched cart item for the client-side
interface EnrichedCartItem {
  title: string;
  imageUrl: string;
  slug: string;
  quantity: number;
  price: string; // Include price for display/total calculation
  linkstate: string; // Added linkstate to EnrichedCartItem
}

// Key for the cart cookie
const CART_COOKIE_NAME = 'user_cart';

function parseRupiahToNumber(rupiahString: string): number {
  if (!rupiahString) {
    return 0;
  }
  // Remove "Rp ", remove thousands separators (.), replace decimal comma (,) with a dot (.)
  const cleanedString = rupiahString.replace('Rp ', '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedString);
}

/**
 * Helper function to parse the cart from the cookie.
 * (Copied from previous examples for self-containment, can be a shared utility)
 * @param {string | undefined} cartCookie - The raw cookie string.
 * @returns {CartItemCookie[]} The parsed cart array.
 */
function parseCartCookie(cartCookie: string | undefined): CartItemCookie[] {
  if (cartCookie) {
    try {
      const parsedCart = JSON.parse(cartCookie);
      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }
      console.error('Parsed cart cookie is not an array, returning empty cart.');
    } catch (e) {
      console.error('Failed to parse cart cookie:', e);
    }
  }
  return [];
}

/**
 * Helper function to enrich cart items with product details for the client.
 * @param {CartItemCookie[]} rawCart - The simplified cart array from the cookie.
 * @param {ApiProduct[]} productsFromApi - The full product data from the API.
 * @returns {EnrichedCartItem[]} The enriched cart.
 */
function enrichCart(rawCart: CartItemCookie[], productsFromApi: ApiProduct[]): EnrichedCartItem[] {
  return rawCart.map(cartItem => {
    const productDetails = productsFromApi.find(apiProduct => apiProduct.slug === cartItem.slug);

    // If product details are found, use them. Otherwise, provide fallback data.
    return {
      title: productDetails ? productDetails.title : `Unknown Product (${cartItem.slug})`,
      imageUrl: (productDetails && productDetails.images[0]) ? productDetails.images[0] : 'https://placehold.co/150x150/cccccc/333333?text=No+Image',
      slug: cartItem.slug,
      quantity: cartItem.quantity,
      price: productDetails ? productDetails.price : 'N/A', // Use price from API
      linkstate: productDetails ? productDetails.linkstate : 'N/A', // Added linkstate from productDetails
    };
  });
}

/**
 * Server-side load function for the cart page.
 * Reads the cart cookie, fetches product details, and forms an enriched array.
 */
export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get the raw cart data from locals (parsed by hooks.server.ts)
  const rawCart: CartItemCookie[] = locals.cart;

  let productsFromApi: ApiProduct[] = [];
  try {
    const apiResponse = await fetch('/api/productquery');
    if (!apiResponse.ok) {
      console.error(`Failed to fetch product data from API: ${apiResponse.status} ${apiResponse.statusText}`);
      throw fail(500, { message: 'Failed to load product details for cart. Please try again.' });
    }
    productsFromApi = await apiResponse.json();
  } catch (error) {
    console.error('Error fetching product data from API for cart:', error);
    throw fail(500, { message: 'An error occurred while loading cart details.' });
  }

  // Form the enriched cart array
  const enrichedCart: EnrichedCartItem[] = enrichCart(rawCart, productsFromApi);

  let totalPrice = 0;
  for (const item of enrichedCart) {
    if (item.linkstate === 'PO') {
      const priceAsNumber = parseRupiahToNumber(item.price);
      totalPrice += priceAsNumber * item.quantity;
    }
  }

  return {
    cart: enrichedCart,
    totalPrice: totalPrice
  };
};


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
/**
 * Server-side actions to handle cart modifications.
 */
export const actions: Actions = {
  // Action to increment a product's quantity in the cart
  incrementQuantity: async ({ request, cookies, locals, fetch }) => {
    const data = await request.formData();
    const productSlug = data.get('slug') as string;

    if (!productSlug) {
      return fail(400, { message: 'Product slug is required.' });
    }

    let cart: CartItemCookie[] = locals.cart;
    const itemIndex = cart.findIndex(item => item.slug === productSlug);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity += 1;
    } else {
      // If trying to increment a non-existent item, add it with quantity 1
      cart.push({ slug: productSlug, quantity: 1 });
    }

    cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });

    // Re-fetch product data to enrich the cart for the client response
    let productsFromApi: ApiProduct[] = [];
    try {
      const apiResponse = await fetch('/api/productquery');
      if (apiResponse.ok) {
        productsFromApi = await apiResponse.json();
      }
    } catch (error) {
      console.error('Error fetching product data for increment action:', error);
    }
    const enrichedCart = enrichCart(cart, productsFromApi);
    const totalPrice = calculateTotalPrice(enrichedCart); // Calculate total price

    return { success: true, cart: enrichedCart, totalPrice: totalPrice };
  },

  // Action to decrement a product's quantity in the cart
  decrementQuantity: async ({ request, cookies, locals, fetch }) => {
    const data = await request.formData();
    const productSlug = data.get('slug') as string;

    if (!productSlug) {
      return fail(400, { message: 'Product slug is required.' });
    }

    let cart: CartItemCookie[] = locals.cart;
    const itemIndex = cart.findIndex(item => item.slug === productSlug);

    if (itemIndex !== -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      } else {
        // If quantity becomes 0, remove the item
        cart = cart.filter(item => item.slug !== productSlug);
      }
    }

    cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });

    // Re-fetch product data to enrich the cart for the client response
    let productsFromApi: ApiProduct[] = [];
    try {
      const apiResponse = await fetch('/api/productquery');
      if (apiResponse.ok) {
        productsFromApi = await apiResponse.json();
      }
    } catch (error) {
      console.error('Error fetching product data for decrement action:', error);
    }
    const enrichedCart = enrichCart(cart, productsFromApi);
    const totalPrice = calculateTotalPrice(enrichedCart); // Calculate total price

    return { success: true, cart: enrichedCart, totalPrice: totalPrice };
  },

  // Action to remove a product completely from the cart
  removeItem: async ({ request, cookies, locals, fetch }) => {
    const data = await request.formData();
    const productSlug = data.get('slug') as string;

    if (!productSlug) {
      return fail(400, { message: 'Product slug is required.' });
    }

    let cart: CartItemCookie[] = locals.cart;
    cart = cart.filter(item => item.slug !== productSlug);

    cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });

    // Re-fetch product data to enrich the cart for the client response
    let productsFromApi: ApiProduct[] = [];
    try {
      const apiResponse = await fetch('/api/productquery');
      if (apiResponse.ok) {
        productsFromApi = await apiResponse.json();
      }
    } catch (error) {
      console.error('Error fetching product data for remove action:', error);
    }
    const enrichedCart = enrichCart(cart, productsFromApi);
    const totalPrice = calculateTotalPrice(enrichedCart); // Calculate total price

    return { success: true, cart: enrichedCart, totalPrice: totalPrice };
  },

  // Action to edit a product's quantity to a specific value
  editQuantity: async ({ request, cookies, locals, fetch }) => {
    const data = await request.formData();
    const productSlug = data.get('slug') as string;
    const newQuantityString = data.get('quantity') as string;
    const newQuantity = parseInt(newQuantityString, 10);

    if (!productSlug || isNaN(newQuantity) || newQuantity < 0) {
      return fail(400, { message: 'Invalid slug or quantity.' });
    }

    let cart: CartItemCookie[] = locals.cart;
    const itemIndex = cart.findIndex(item => item.slug === productSlug);

    if (itemIndex !== -1) {
      if (newQuantity === 0) {
        // If new quantity is 0, remove the item
        cart = cart.filter(item => item.slug !== productSlug);
      } else {
        // Otherwise, update the quantity
        cart[itemIndex].quantity = newQuantity;
      }
    } else if (newQuantity > 0) {
      // If item not found but new quantity is > 0, add it
      cart.push({ slug: productSlug, quantity: newQuantity });
    }
    // If item not found and new quantity is 0, do nothing

    cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });

    // Re-fetch product data to enrich the cart for the client response
    let productsFromApi: ApiProduct[] = [];
    try {
      const apiResponse = await fetch('/api/productquery');
      if (apiResponse.ok) {
        productsFromApi = await apiResponse.json();
      }
    } catch (error) {
      console.error('Error fetching product data for edit action:', error);
    }
    const enrichedCart = enrichCart(cart, productsFromApi);
    const totalPrice = calculateTotalPrice(enrichedCart); // Calculate total price

    return { success: true, cart: enrichedCart, totalPrice: totalPrice };
  },

  // Action to clear the entire cart
  clearCart: async ({ cookies, fetch }) => { // Added fetch here to get products for enrichment
    // Set the cookie to an empty array
    cookies.set(CART_COOKIE_NAME, JSON.stringify([]), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
    });

    // Even though cart is empty, enrich it to get correct structure for client
    let productsFromApi: ApiProduct[] = [];
    try {
      const apiResponse = await fetch('/api/productquery');
      if (apiResponse.ok) {
        productsFromApi = await apiResponse.json();
      }
    } catch (error) {
      console.error('Error fetching product data for clearCart action:', error);
    }
    const enrichedCart = enrichCart([], productsFromApi); // Enrich empty cart
    const totalPrice = calculateTotalPrice(enrichedCart); // Will be 0

    return { success: true, cart: enrichedCart, totalPrice: totalPrice };
  },

};