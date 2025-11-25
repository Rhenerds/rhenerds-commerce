// src/lib/utils/cart.ts
import { invalidate } from '$app/navigation';
import { browser } from '$app/environment';
import { cartAmountStore } from '$lib/stores/cartStore'; // Import the store

type SvelteKitFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function updateCartCookie(
    fetchInstance: SvelteKitFetch, 
    newCartData: string,
    // 🔑 Change: Accept the new calculated total from the component logic
    newTotalAmount: number
): Promise<void> {
    
    // 1. Perform the server action
    const formData = new FormData();
    formData.append('cart_data', newCartData);

    await fetchInstance('/?/updateCartCookie', {
        method: 'POST',
        body: formData,
    });
    
    // 2. 🔑 OPTIMISTIC UPDATE: Update the client store immediately
    cartAmountStore.set(newTotalAmount);

    // 3. Keep invalidate for eventual server data synchronization
    if (browser) {
        await invalidate('data:layout');
    }
}