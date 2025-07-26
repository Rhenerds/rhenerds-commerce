import type { PageServerLoad } from "../$types";

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
  fandom?: string;
  type?: string;
}

// Key for the cart cookie - this should be consistent across your application
const CART_COOKIE_NAME = 'user_cart';

function parseRupiahToNumber(rupiahString: string): number {
  if (!rupiahString) {
    return 0;
  }
  const cleanedString = rupiahString.replace('Rp ', '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanedString);
}

function parseCartCookie(cartCookie: string | undefined): CartItemCookie[] {
  if (cartCookie) {
    try {
      const parsedCart = JSON.parse(cartCookie);
      if (Array.isArray(parsedCart) && parsedCart.every(item => typeof item === 'object' && item !== null && 'slug' in item && 'quantity' in item)) {
        return parsedCart;
      }
      console.error('Parsed cart cookie is not an array or invalid format, returning empty cart.');
    } catch (e) {
      console.error('Failed to parse cart cookie:', e);
    }
  }
  return [];
}

function enrichCart(rawCart: CartItemCookie[], productsFromApi: ApiProduct[]): EnrichedCartItem[] {
  return rawCart.map(cartItem => {
    const productDetails = productsFromApi.find(apiProduct => apiProduct.slug === cartItem.slug);

    return {
      title: productDetails ? productDetails.title : `Unknown Product (${cartItem.slug})`,
      imageUrl: (productDetails && productDetails.images[0]) ? productDetails.images[0] : 'https://placehold.co/150x150/cccccc/333333?text=No+Image',
      slug: cartItem.slug,
      quantity: cartItem.quantity,
      price: productDetails ? productDetails.price : 'N/A',
      linkstate: productDetails ? productDetails.linkstate : 'N/A',
      fandom: productDetails ? productDetails.fandom : undefined,
      type: productDetails ? productDetails.type : undefined,
    };
  });
}

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

export const load: PageServerLoad = async ({ fetch, url, cookies, locals }) => {
    const pinvoice = url.searchParams.get('inv')
    const refer = url.searchParams.get('refer')
    const invoice = decodeURI(pinvoice ?? "NoInvoice")

    var trstatus: string = ''

    if (invoice !== "NoInvoice") {
        const statusresponse = await fetch(
            '/api/trstat',
            {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                body: JSON.stringify({
                    invoice
                })
            }
        )

        if (statusresponse.ok) {
            const Resp = await statusresponse.json()
            console.log(Resp.result)
            trstatus = Resp.result
        } else {
            const Resp = await statusresponse.json()
            console.log(Resp.result)
            if (Resp.result === "NotFound") {
                trstatus = 'NotFound'
            } else {
                trstatus = 'ERROR'
            }
        }
    } else {
        trstatus = "NoInvoice"
    }

        if (trstatus === "SUCCESS" && refer === "checkout") {
        // --- Start of inlined processAndFilterCart logic ---

        // Get raw cart from locals, with cookie fallback
        let rawCart: CartItemCookie[] = locals.cart;
        if (!rawCart || rawCart.length === 0) {
            const cartCookie = cookies.get(CART_COOKIE_NAME);
            rawCart = parseCartCookie(cartCookie);
            if (cartCookie && rawCart.length === 0) {
                cookies.delete(CART_COOKIE_NAME, { path: '/' });
            }
        }

        let productsFromApi: ApiProduct[] = [];
        try {
            const apiResponse = await fetch('/api/productquery');
            if (apiResponse.ok) {
                productsFromApi = await apiResponse.json();
            } else {
                console.error('Failed to fetch products for cart processing:', apiResponse.statusText);
                // Decide how to handle this error in the load function context
                // You might want to throw fail(500) here, or continue with an uncleaned cart
                // For now, we'll proceed with potentially stale data if product fetch fails.
            }
        } catch (error) {
            console.error('Error fetching product data for cart processing:', error);
            // Same as above, decide error handling strategy.
        }

        // First, enrich the current raw cart so we can filter by linkstate
        const enrichedCurrentCart = enrichCart(rawCart, productsFromApi);

        // Filter out items where linkstate is 'PO'
        const cartAfterRemovingPO = enrichedCurrentCart.filter(item => item.linkstate !== 'PO');

        // Convert the filtered enriched cart back to CartItemCookie[] format for cookie storage
        const rawCartToStore: CartItemCookie[] = cartAfterRemovingPO.map(item => ({
            slug: item.slug,
            quantity: item.quantity
        }));

        // Update the cookie with the cleaned raw cart
        cookies.set(CART_COOKIE_NAME, JSON.stringify(rawCartToStore), {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            sameSite: 'lax',
        });

    }

    return {
        "trstatus": trstatus,
        "invoice": invoice
    }
}