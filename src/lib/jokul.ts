// src/lib/jokul-checkout-ts.ts

// --- 1. Type Definitions for Global Functions ---

// Declare the loadJokulCheckout function globally for clarity,
// though we will export and use the function directly below.
declare global {
    interface Window {
        loadJokulCheckout: (url: string) => void;
        closeJokul: () => void;
        receive: (event: MessageEvent<any>) => void;

        // --- FIX IS HERE ---
        // Change the parameter type from 'string' to 'MessageData'
        alertMyMessage: (data: MessageData) => void;

        // Retain the index signature for dynamic function calls
        [key: string]: any;
    }
}


// --- 2. Core Checkout Logic (Initialization) ---

/**
 * Initializes the DOKU Jokul Checkout script by dynamically loading the CSS
 * and setting up the global message listeners.
 */
export function initializeJokulCheckout() {
    // A. Load CSS
    const cssUrl = 'https://jokul.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.css';
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const cssJokul = document.createElement('link');
        cssJokul.setAttribute('rel', 'stylesheet');
        cssJokul.setAttribute('href', cssUrl);
        document.head.appendChild(cssJokul);
    }

    // B. Setup Global Message Listener
    // The original script sets a global handler 'receive' to process messages
    // from the iframe. We define it here and attach it to the window.
    if (typeof window.receive !== 'function') {
        if (window.addEventListener) {
            window.addEventListener("message", receive, false);
        } else if (window.attachEvent) {
            // Note: attachEvent is for older IE browsers, modern TS/JS rarely needs this.
            window.attachEvent("onmessage", receive as any);
        }
    }
}


// --- 3. Global Modal Control Functions ---

const MODAL_ID = 'jokul_checkout_modal';

/**
 * Opens the checkout modal with the specified DOKU payment URL.
 * @param url The full payment URL retrieved from the backend.
 */
export function loadJokulCheckout(url: string): void {
    const token = url + "?view=iframe";
    let modal = document.getElementById(MODAL_ID) as HTMLDivElement | null;

    if (!modal) {
        // Create the modal if it doesn't exist
        modal = document.createElement("div");
        modal.setAttribute('class', 'jokul-modal');
        modal.setAttribute('id', MODAL_ID);
        document.body.appendChild(modal);

        // Attach the window click handler (for preventing closure on outside click)
        window.onclick = function (event: MouseEvent) {
            if (event.target === modal) {
                // The original logic keeps the modal open when clicking outside.
                (modal as HTMLDivElement).style.display = "block";
            }
        };
    }

    // Update the iframe content
    modal.innerHTML = `
        <div class="jokul-content">
            <iframe src="${token}"></iframe>
        </div>
    `;

    // Show the modal
    modal.style.display = "block";

    // Attach to global window for external access if needed (matching original JS)
    window.loadJokulCheckout = loadJokulCheckout;
}

/**
 * Closes the Jokul checkout modal.
 */
export function closeJokul(): void {
    const modal = document.getElementById(MODAL_ID) as HTMLDivElement | null;
    if (modal) {
        modal.style.display = "none";
    }

    // Attach to global window for external access if needed (matching original JS)
    window.closeJokul = closeJokul;
}


// --- 4. Message Handler and Callback Functions ---

interface MessageData {
    func: string; // The name of the function to call (e.g., 'alertMyMessage')
    msg: string;  // Data payload (e.g., 'Payment Success')
    // Add other expected properties here
    [key: string]: any;
}

/**
 * Handles messages received from the Jokul iframe (postMessage API).
 * It calls a global function specified in the message data.
 */
export function receive(event: MessageEvent<MessageData>): void {
    const data = event.data;

    // Type check to ensure the function name is a string and the function exists on window
    if (typeof data === 'object' && data !== null && typeof data.func === "string" && typeof window[data.func] === "function") {
        // Call the target function on the window object with the received data
        (window[data.func] as Function).call(null, data);
    }

    // Attach to global window for external access if needed (matching original JS)
    window.receive = receive;
}

/**
 * Example callback function that the iframe might call via the 'receive' handler.
 */
export function alertMyMessage(data: MessageData): void {
    alert(`Jokul Message: ${data.msg || JSON.stringify(data)}`);

    // Attach to global window for external access if needed (matching original JS)
    window.alertMyMessage = alertMyMessage;
}