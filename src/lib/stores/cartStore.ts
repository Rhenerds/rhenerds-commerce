// src/lib/stores/cartStore.ts
import { writable } from 'svelte/store';

// Store to hold the current number of items in the cart
export const cartAmountStore = writable(0);