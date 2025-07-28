// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

// Define the simplified structure of a cart item
interface CartItem {
  slug: string; // Using slug instead of id
  quantity: number;
}

// Key for the cart cookie
const CART_COOKIE_NAME = 'user_cart';

// Extend the Locals interface to include cart
declare global {
  namespace App {
    interface Locals {
      cart: CartItem[];
    }
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  let cart: CartItem[] = [];
  const cartCookie = event.cookies.get(CART_COOKIE_NAME);

  if (cartCookie) {
    try {
      // Parse the JSON string from the cookie
      cart = JSON.parse(cartCookie);
      // Basic validation: ensure parsed cart is an array
      if (!Array.isArray(cart)) {
        console.error('Parsed cart cookie is not an array, initializing empty cart.');
        cart = [];
      }
    } catch (e) {
      console.error('Failed to parse cart cookie in hooks.server.ts:', e);
      // If parsing fails, treat the cart as empty
      cart = [];
    }
  } else {
    // If the cookie doesn't exist, initialize it as an empty array
    // and set it immediately so it's available for the current request's response
    event.cookies.set(CART_COOKIE_NAME, JSON.stringify([]), {
      path: '/', // Make the cookie available across the entire site
      maxAge: 60 * 60 * 24 * 30, // Cookie expires in 30 days
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      sameSite: 'lax', // Recommended for CSRF protection
      // secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
    });
  }

  // Make the cart data available in `event.locals` for `+page.server.ts` and API routes
  event.locals.cart = cart;

  // Resolve the request, allowing it to proceed to the page or API route
  const response = await resolve(event);
  return response;
};
