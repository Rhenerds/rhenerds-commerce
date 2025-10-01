// src/routes/+layout.server.ts

import type { LayoutServerLoad } from './$types';
import { browser } from '$app/environment';

export const load: LayoutServerLoad = ({ cookies }) => {
    const cartCookieValue = cookies.get('user_cart');

    if (browser) {console.log('SERVER: New cart cookie value read:', cartCookieValue); }

    return {
        // Pass the cookie value to the client-side layout component
        cartCookie: cartCookieValue || 'error'
    };
};