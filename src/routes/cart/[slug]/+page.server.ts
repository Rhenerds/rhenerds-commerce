// src/routes/add-to-cart/[slug]/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit'; // Removed redirect as we are not redirecting from load

// Define the simplified structure of a cart item
interface CartItem {
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
  linkstate: string;
  images: string[];
  slug: string;
}

// Key for the cart cookie
const CART_COOKIE_NAME = 'user_cart';

/**
 * Helper function to parse the cart from the cookie.
 * @param {string | undefined} cartCookie - The raw cookie string.
 * @returns {CartItem[]} The parsed cart array.
 */
function parseCartCookie(cartCookie: string | undefined): CartItem[] {
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
 * Server-side load function for the add-to-cart page.
 * This function now handles the entire add-to-cart logic immediately on page visit.
 */
export const load: PageServerLoad = async ({ params, locals, cookies, fetch }) => {
  const productSlug = params.slug; // Get the slug from the URL parameter

  // Basic validation for the slug from URL
  if (!productSlug) {
    throw fail(400, { message: 'Product slug is missing from URL.' });
  }

  const stockresponse = await fetch(
    '/api/stock/get',
    {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"key":productSlug
			})
		}
  )

  const stockresponsejson: { 
		error: string; 
		value: string; 
	} = await stockresponse.json();

  const stockvalue = Number(stockresponsejson.value)

  // --- Validate slug against internal API ---
  let products: ApiProduct[] = [];
  try {
    const apiResponse = await fetch('/api/productquery');
    if (!apiResponse.ok) {
      console.error(`Failed to fetch product data from API: ${apiResponse.status} ${apiResponse.statusText}`);
      throw fail(500, { message: 'Failed to validate product. Please try again.' });
    }
    products = await apiResponse.json();
  } catch (error) {
    console.error('Error fetching product data from API:', error);
    throw fail(500, { message: 'An error occurred while validating product.' });
  }

  const productDetails = products.find(product => product.slug === productSlug);

  if (!productDetails) {
    throw fail(404, { message: `Product with slug "${productSlug}" not found or is invalid.` });
  }
  // --- End of Validation ---

  // Get the current cart from locals (already parsed by hooks.server.ts)
  let cart: CartItem[] = locals.cart;

  const existingItemIndex = cart.findIndex(item => item.slug === productSlug);

  if ((existingItemIndex !== -1) && (cart[existingItemIndex].quantity < stockvalue)) {
    // Product already in cart, increment quantity
    cart[existingItemIndex].quantity += 1;
  } else if((existingItemIndex === -1) && (stockvalue != 0)) {
    // Product not in cart, add new item with slug and quantity 1
      cart.push({ slug: productSlug, quantity: 1 });
  }

  // Set the updated cart back into the cookie
  cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    path: '/', // Make the cookie available across the entire site
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: 'lax', // Protects against CSRF attacks
  });

  // Return success message and product details directly for the page to render
  const addedProduct = cart.find(item => item.slug === productSlug);
  return {
    success: true,
    message: `"${productDetails.title}" has been added to your cart! Current quantity: ${addedProduct?.quantity || 1}.`,
    productSlug: productSlug, // Return slug for confirmation context
    newQuantity: addedProduct?.quantity || 1, // Return new quantity
    productTitle: productDetails.title, // Return product title for confirmation message
    productDescription: productDetails.description, // Return product description
    productPrice: productDetails.price, // Return product price
    productImage: productDetails.images[0] || null, // Return the first image URL
  };
};

// Actions are no longer needed as the load function handles the add-to-cart logic
export const actions: Actions = {}; // Keep an empty actions export to satisfy TypeScript
