// src/routes/+layout.server.ts

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
    const cartCookieValue = cookies.get('user_cart');

    console.log('SERVER: New cart cookie value read:', cartCookieValue); 

    return {
        // Pass the cookie value to the client-side layout component
        cartCookie: cartCookieValue || 'error'
    };
};