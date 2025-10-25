<script lang="ts">
	import '../app.css'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { cartAmountStore } from '$lib/stores/cartStore';
	import { Carousel, Controls, ControlButton, CarouselIndicators} from "flowbite-svelte";
	import { onMount } from 'svelte';

	let carouselImages = [
		"/productmedia/CoralGlassesKeychainMockup.png",
		"/productmedia/CoralGlassesKeychainMockup.png",
		"/productmedia/CoralGlassesKeychainMockup.png",
	]

	let { children, data } = $props()
	let searchTerm: string = ''
	let isInputActive = $state(false)
	let enableTransition = $state(false)
	let anotherEnableTransition = $state(false)
	let cartHover = $state(false)
	let cartAmount = $state(0);

	let index = $state(0);

	function getImageName(src: string | undefined | null): string {
        // Safeguard against undefined/null/non-string src
        if (typeof src !== 'string' || !src) {
            console.warn("getImageName received invalid or missing src:", src);
            return 'unknown-image';
        }

        // Get the last part of the URL (the filename with extension)
        const filenameWithExtension = src.split('/').pop();

        // Safeguard against cases where pop() might return undefined (e.g., src is just "/")
        if (!filenameWithExtension) {
            console.warn("Could not extract filename from src:", src);
            return 'unknown-image';
        }

        // Remove the file extension
        const filenameWithoutExtension = filenameWithExtension.split('.').slice(0, -1).join('.');

        // Remove common suffixes like "-<hash>-unsplash" or "-unsplash" if they exist
        // Adjust this regex if your URLs have different naming conventions
        const cleanName = filenameWithoutExtension.replace(/(-[a-zA-Z0-9]{7,12})?-unsplash$/, '');

        // Replace hyphens with spaces for better readability in alt/title
        return cleanName.replace(/-/g, ' ');
    }

    // --- Transform the array of URL strings into the desired JSON object structure ---
    // Ensure data.meta.images is an array before mapping.
    // data.meta.images is expected to be an array of strings like ["/productimages/smth.png", ...]
    const images = (carouselImages ?? []).map((url: string) => {
        const name = getImageName(url); // Get the clean name from the URL string
        return {
            alt: name,   // Set alt to the clean name
            src: url,    // The src is the original URL string
            title: name  // Set title to the clean name
        };
    });

    // 1. 🔑 FIX: DECLARE $derived in the root script scope
    // This variable is now reactive and tracks $page.url.pathname changes.
    // NOTE: If you are getting an error about '$page' not being defined, you
    // must import it with an alias for this to work, see Alternative below.
    const currentSearchQuery = $derived(page.url.pathname + page.url.search);

    $effect(() => {
        // 2. 🔑 FIX: Reference the reactive variable 'currentSearchQuery'.
        // This effect runs whenever the path OR the query parameters change.
        const query = currentSearchQuery;

        // This is the cleanup logic you want to run on every URL change
        if (searchTerm.length > 0) {
            searchTerm = '';
            isInputActive = false;
        }

		const searchInput = document.getElementById('SearchBar') as HTMLInputElement;

		if (searchInput) {
			// Ensure the DOM value is immediately set to an empty string
			searchInput.value = '';
			// Force it to lose any residual focus/active state
			searchInput.blur();
			console.log("DOM input element successfully cleared.");
		}

        // Log the change for debugging (optional)
        console.log(`Navigation detected. Query: ${query}. Search term cleared.`);
    });

    $effect(() => {
        // The store's subscribe method returns an unsubscribe function.
        const unsubscribe = cartAmountStore.subscribe((value) => {
            // Update the reactive state variable whenever the store changes
            cartAmount = value;
            console.log("CLIENT: cartAmount updated via manual store subscription (from layout):", cartAmount);
        });

        // The return function runs on cleanup (component unmount/destroy)
        return () => unsubscribe();
    });

    // 🔑 INITIALIZATION & SYNCHRONIZATION: Use server data to initialize the store
    $effect(() => {
        if (data.cartCookie && data.cartCookie !== 'error') {
            try {
                const cartItems = JSON.parse(data.cartCookie);
                const newCartAmount = cartItems.reduce(
                    (sum: number, item: { quantity: number }) => sum + item.quantity,
                    0
                );
                // Initialize/synchronize the store with the server's value
                cartAmountStore.set(newCartAmount);
            } catch (e) {
                console.error("Layout error parsing cart cookie:", e);
                cartAmountStore.set(0);
            }
        }
    });

	function handleSearch() {
        if (searchTerm.trim()) {
            const encodedSearchTerm = encodeURIComponent(searchTerm.trim())
            goto(`/catalog/?q=${encodedSearchTerm}`)
        }
	}

	function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleSearch();
        }
	}

	function handleMouseEnter() {
		cartHover = true
		anotherEnableTransition = true
	}

	function handleMouseLeave() {
		cartHover = false
	}

	function handleFocus() {
        console.log('Input is now focused: setting to true');
        isInputActive = true;
		enableTransition = true;
    }

    function handleBlur() {
        console.log('Input is now blurred: setting to false');
        isInputActive = false;
    }

	const isHomePage = $derived(page.url.pathname === '/')

	const homeClass = $derived(isHomePage ? 'is-homepage' : '');

	const className = 'shrunk';

    // The $effect rune handles the DOM manipulation
	$effect(() => {
			if (isHomePage) {
					// Add the class when on the home page
					document.body.classList.add(className);
			} else {
					// Remove the class when navigating away
					document.body.classList.remove(className);
			}
	});

	let calculatedHeight = '0px';

	/**
	 * Finds the header and footer, calculates the vertical distance between them,
	 * and sets the global CSS variable.
	 */
	const setContentHeight = () => {
			// Use a slight delay to ensure all DOM updates and layouts are complete.
			// This helps prevent incorrect measurements if called immediately after a content change.
			setTimeout(() => {
					const header = document.querySelector('header');
					const footer = document.querySelector('footer');

					if (!header || !footer) {
							console.error("Header or Footer element not found. Falling back to 100vh.");
							document.documentElement.style.setProperty('--html-height', '100vh');
							calculatedHeight = '100vh (Fallback)';
							return;
					}

					// Get the top edge of the header and the bottom edge of the footer
					// relative to the viewport.
					const headerTop = header.getBoundingClientRect().top;
					const footerBottom = footer.getBoundingClientRect().bottom;

					// Calculate the vertical distance.
					const height = footerBottom - headerTop + 200;
					const heightString = `${height}px`;

					// 1. Set the CSS variable globally on the <html> element.
					document.documentElement.style.setProperty('--html-height', heightString);

					// 2. Update Svelte state for display.
					calculatedHeight = heightString;

					console.log(`Updated --html-height to: ${heightString}`);
			}, 500); // 50ms delay to allow DOM reflow
	};

	onMount(() => {
			// Initial call
			setContentHeight();

			// --- 1. Window Resize Listener (Handles viewport size changes) ---
			window.addEventListener('resize', setContentHeight);

			// --- 2. Mutation Observer (Handles content changes like images loading, dynamic elements) ---
			const targetNode = document.body; // Watch the entire body for layout changes
			const observerConfig = {
					attributes: true,
					childList: true,
					subtree: true,
					characterData: true
					// If you only care about size changes, you might also look into ResizeObserver,
					// but MutationObserver is better for general layout stability after content load/change.
			};

			const observer = new MutationObserver(setContentHeight);
			observer.observe(targetNode, observerConfig);

			// Cleanup function runs when the component is destroyed
			return () => {
					window.removeEventListener('resize', setContentHeight);
					observer.disconnect();
			};
	});

</script>

<header>
	<div class="mainheader" class:mainheader_homepage={isHomePage}>
		<a class="HeaderBox" href="/">
			<img class="LogoImg" src="/assets/nerdscatalog.webp" alt="Logo of Nerds Catalog">
		</a>
		<div class="spacer"></div>
		<nav class="NavBox">
			<div class="NavBar">
				<div class="NavChoice" class:expandSearchDiv={isInputActive} class:shrinkSearchDiv={ (!isInputActive && enableTransition) } aria-label="Search button">
					<label for="SearchBar">Search</label>
						<input class="inputsmth" type="text" id="SearchBar" placeholder="Search Here" bind:value={searchTerm} onkeyup={handleKeyPress} onfocus={handleFocus} onblur={handleBlur}>
					<svg class:hideSearchIcon={isInputActive} class:showSearchIcon={ (!isInputActive && enableTransition) } viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clip-path="url(#clip0_353_107)">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M10.7812 6.5625C10.7812 7.11651 10.6721 7.6651 10.46 8.17694C10.248 8.68879 9.93726 9.15385 9.54557 9.54562C9.15379 9.93731 8.68873 10.2481 8.17688 10.4602C7.66504 10.6721 7.11645 10.7812 6.56244 10.7812C6.00842 10.7812 5.45984 10.6721 4.94799 10.4602C4.43615 10.2481 3.97108 9.93731 3.57933 9.54562C3.18758 9.15385 2.87684 8.68879 2.66482 8.17694C2.4528 7.6651 2.34369 7.11651 2.34369 6.5625C2.34369 5.44361 2.78816 4.37056 3.57933 3.57939C4.3705 2.78822 5.44355 2.34375 6.56244 2.34375C7.68132 2.34375 8.75437 2.78822 9.54557 3.57939C10.3367 4.37056 10.7812 5.44361 10.7812 6.5625ZM10.0124 11.0062C8.88217 11.8837 7.45997 12.2975 6.03538 12.1632C4.61078 12.0291 3.29088 11.357 2.34439 10.2838C1.39789 9.21067 0.895954 7.81715 0.940748 6.38695C0.985551 4.95675 1.57372 3.59737 2.58552 2.58558C3.59732 1.57378 4.95669 0.985612 6.38689 0.940809C7.81709 0.896013 9.2106 1.39795 10.2838 2.34445C11.3569 3.29094 12.029 4.61084 12.1632 6.03544C12.2974 7.46002 11.8837 8.88222 11.0062 10.0125L13.8562 12.8625C13.9253 12.9269 13.9807 13.0045 14.0191 13.0908C14.0576 13.177 14.0782 13.2701 14.0799 13.3645C14.0816 13.4589 14.0641 13.5527 14.0288 13.6402C13.9934 13.7278 13.9408 13.8073 13.874 13.8741C13.8073 13.9409 13.7278 13.9935 13.6402 14.0288C13.5526 14.0642 13.4589 14.0816 13.3645 14.0799C13.2701 14.0782 13.1769 14.0576 13.0907 14.0192C13.0045 13.9808 12.9269 13.9253 12.8624 13.8562L10.0124 11.0062Z" fill="#1F2328"/>
						</g>
						<defs>
							<clipPath id="clip0_353_107">
							<rect width="15" height="15" fill="white"/>
							</clipPath>
						</defs>
					</svg>
				</div>
				<a onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave} href="/cart" class="NavChoice"  class:expandCartDiv={cartHover} class:shrinkCartDiv={(!cartHover && anotherEnableTransition)} aria-label="Cart navigation button">
					<svg class:svgPop={cartHover} width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6.34055 11.292C5.77383 11.292 5.33969 11.1343 5.03813 10.8189C4.73657 10.5036 4.54419 10.0738 4.46101 9.5295L3.21317 1.15209H0.577123C0.421144 1.15209 0.285962 1.09613 0.171577 0.984232C0.0571924 0.867243 0 0.729908 0 0.572228C0 0.419634 0.0571924 0.287386 0.171577 0.175483C0.285962 0.0584944 0.421144 0 0.577123 0H3.31456C3.7149 0 3.98527 0.0737538 4.12565 0.221261C4.27123 0.368769 4.36482 0.59003 4.40641 0.885046L5.68544 9.37691C5.71664 9.61088 5.79983 9.79908 5.93501 9.94151C6.07539 10.0788 6.25477 10.1475 6.47314 10.1475H15.4419C15.5927 10.1475 15.7253 10.2035 15.8397 10.3154C15.9541 10.4222 16.0113 10.557 16.0113 10.7197C16.0113 10.8825 15.9541 11.0198 15.8397 11.1317C15.7253 11.2386 15.5927 11.292 15.4419 11.292H6.34055ZM4.90555 8.57579L4.88995 7.43133L15.3406 7.4237C15.5693 7.4237 15.7487 7.35504 15.8787 7.2177C16.0087 7.08037 16.0893 6.89471 16.1205 6.66073L16.6742 3.0061H4.23484L4.22704 1.85402H17.2903C17.5035 1.85402 17.675 1.91251 17.805 2.0295C17.935 2.1414 18 2.28891 18 2.47202C18 2.50763 17.9974 2.55341 17.9922 2.60936C17.987 2.66022 17.9792 2.71109 17.9688 2.76195L17.3449 6.79807C17.2617 7.34741 17.0693 7.7823 16.7678 8.10275C16.4662 8.41811 16.0295 8.57579 15.4575 8.57579H4.90555ZM6.95667 15C6.7175 15 6.50173 14.944 6.30936 14.8321C6.12218 14.7253 5.9714 14.5778 5.85702 14.3896C5.74263 14.2014 5.68544 13.9929 5.68544 13.764C5.68544 13.5351 5.74263 13.3266 5.85702 13.1384C5.9714 12.9502 6.12218 12.8001 6.30936 12.6882C6.50173 12.5814 6.7175 12.528 6.95667 12.528C7.19064 12.528 7.40121 12.5814 7.58839 12.6882C7.78076 12.8001 7.93414 12.9502 8.04853 13.1384C8.16291 13.3266 8.2201 13.5351 8.2201 13.764C8.2201 14.1099 8.09532 14.4023 7.84575 14.6414C7.60139 14.8805 7.30503 15 6.95667 15ZM14.2487 15C14.0147 15 13.8016 14.944 13.6092 14.8321C13.4168 14.7253 13.2634 14.5778 13.149 14.3896C13.0347 14.2014 12.9775 13.9929 12.9775 13.764C12.9775 13.5351 13.0347 13.3266 13.149 13.1384C13.2634 12.9502 13.4168 12.8001 13.6092 12.6882C13.8016 12.5814 14.0147 12.528 14.2487 12.528C14.4879 12.528 14.701 12.5814 14.8882 12.6882C15.0806 12.8001 15.234 12.9502 15.3484 13.1384C15.4627 13.3266 15.5199 13.5351 15.5199 13.764C15.5199 14.1099 15.3951 14.4023 15.1456 14.6414C14.9012 14.8805 14.6023 15 14.2487 15Z" fill="black"/>
					</svg>
					<p class="cartText" class:showCartText={cartHover} class:hideCartText={(!cartHover && anotherEnableTransition)}>{cartAmount}</p>
				</a>
				<a href="/announcements" class="NavChoice" aria-label="Announcements navigation button">
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clip-path="url(#clip0_396_80)">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 0C4.91117 0 2.8125 2.09867 2.8125 4.6875V7.45052C2.8125 7.49679 2.7988 7.54203 2.77313 7.58053L1.17645 9.97556C1.02064 10.2093 0.9375 10.4839 0.9375 10.7647C0.9375 11.5506 1.57448 12.1875 2.36024 12.1875H12.6397C13.4256 12.1875 14.0625 11.5506 14.0625 10.7647C14.0625 10.4839 13.9793 10.2093 13.8235 9.97556L12.2269 7.58053C12.2012 7.54203 12.1875 7.49679 12.1875 7.45052V4.6875C12.1875 2.09867 10.0888 0 7.5 0ZM4.21875 4.6875C4.21875 2.87531 5.68781 1.40625 7.5 1.40625C9.31219 1.40625 10.7812 2.87531 10.7812 4.6875V7.45052C10.7812 7.77443 10.8772 8.09107 11.0568 8.36058L12.6534 10.7556C12.6553 10.7583 12.6562 10.7615 12.6562 10.7647C12.6562 10.7669 12.6558 10.7693 12.6558 10.7693L12.6552 10.7709C12.6552 10.7709 12.6534 10.7744 12.6514 10.7764C12.6494 10.7784 12.6459 10.7802 12.6459 10.7802C12.6459 10.7802 12.6433 10.7812 12.6397 10.7812H2.36024C2.35667 10.7812 2.35403 10.7802 2.35403 10.7802C2.35403 10.7802 2.35058 10.7784 2.34858 10.7764C2.34658 10.7744 2.34475 10.7709 2.34475 10.7709C2.34475 10.7709 2.34375 10.7683 2.34375 10.7647C2.34375 10.7615 2.34472 10.7583 2.34652 10.7556L3.94321 8.36058C4.12287 8.09107 4.21875 7.77443 4.21875 7.45052V4.6875Z" fill="#1F2328"/>
							<path d="M9.36055 13.3589C9.24541 14.284 8.45632 15 7.49999 15C6.54367 15 5.75457 14.284 5.63944 13.3589C5.62346 13.2305 5.72993 13.125 5.85937 13.125H9.14062C9.27006 13.125 9.37649 13.2305 9.36055 13.3589Z" fill="#1F2328"/>
						</g>
						<defs>
							<clipPath id="clip0_396_80">
							<rect width="15" height="15" fill="white"/>
							</clipPath>
						</defs>
					</svg>
				</a>
			</div>
		</nav>
	</div>
	<div class:show-fade={isHomePage}></div>
</header>
<div class="frontCarousel w-full h-64 md:h-96 lg:h-[500px] {homeClass}" class:frontCarousel_homepage={isHomePage}>
	<Carousel {images} class="w-full h-100%" imgClass="object-contain h-full w-fit rounded-xs" bind:index duration={3000}>
			<Controls class="items-center text-black-400 dark:text-white-400 p-15">
				{#snippet children(changeSlide)}
				<ControlButton class="text-black-400 !w-[55px] !h-[55px] !bg-white !opacity-100 !m-[55px] !top-1/2 !rounded-full" name="Previous" forward={false} onclick={() => changeSlide(false)}/>
				<ControlButton class="text-black-400 !w-[55px] !h-[55px] !bg-white !opacity-100 !m-[55px] !top-1/2 !rounded-full" name="Next" forward={true} onclick={() => changeSlide(true)}/>
				{/snippet}
			</Controls>
			<CarouselIndicators class="p-4" position="withThumbnails" />
	</Carousel>
</div>
<main class="MainBox" class:main_homepage={isHomePage}>
	{@render children()}
</main>
<footer class:footer_homepage={isHomePage}>
	<div class="FooterBar">
		<a class="FooterLink" href="https://github.com/Rhenerds/rhenerds-commerce">Source Code</a>
		<a class="FooterLink" href="/legal/privacy">Privacy Policy</a>
		<a class="FooterLink" href="/legal/tos">Terms of Service</a>
	</div>
	<div class="FooterBar">
		<p class="FooterText">©2025 Rhendra</p>
	</div>
</footer>


<style>
	@import url('/assets/roboto.css');
	@import url('/assets/inter.css');

	.mainheader {
		display: flex;
		flex-direction: row;
		padding: 60px 60px 0 60px;
	}

	.mainheader_homepage {
		z-index: 2;
		position: absolute;
		width: 100%;
		height: fit-content;
	}

	.show-fade {
		background: url("/assets/CarouselFade.webp") no-repeat center;
		background-size: 100% 100%;
		position: relative;
		z-index: 1;
		width: 100%;
		height: 280px;
	}

	.frontCarousel {
		display: none;
		position: relative;
		transform: translateY(-180px);
		z-index: 0;
		height: 600px;
	}

	.frontCarousel_homepage {
		display: block;
	}

	.main_homepage {
		transform: translateY(-260px);
	}

	.spacer {
		width: calc(100% - 825px);
	}

	.LogoImg {
		width: 325px;
		object-fit:contain;
	}

	.HeaderBox {
		display: flex;
		flex-direction:row;
		width: fit-content;
	}

	.NavBox {
		width: 500px;
		height:auto;
		flex-shrink: 0;
		justify-content:flex-end;
		display: flex;
		flex-direction: row;
	}

	.NavBar {
		margin-top: auto;
		margin-bottom: auto;
		display: flex;
		flex-direction: row;
	}

	.NavChoice {
		background-color: #FFF;
		filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.25));
		border-radius: 50%;
		width: 55px;
		height: 55px;
		margin-left: 25px;
		align-items: center;
		justify-content: center;
		display: flex;
		overflow: visible;
	}

	a svg {
		margin: auto;
		width: calc(55px / 2);
		height: calc(55px / 2);
	}

	.NavBar a {
		text-decoration: none !important;
	}

	a svg g {
		width: 100%;
		height: 100%;
	}

	div svg {
		margin: auto;
		width: 50%;
		height: 50%;
	}

	.svgPop {
		margin-right: 5px;
		margin-left: 8px;
	}

	@keyframes searchexpand {
		0% { width: 55px; border-radius: calc(55px / 2); }
		8% { width: 55px; border-radius: calc(55px / 2); }
		10% { width: 55px; border-radius: calc(55px / 2); }
		18% { width: 51.95px; border-radius: calc(55px / 2); } /* Undershoot */
		20% { width: 55px; border-radius: calc(55px / 2); }
		28% { width: 61.1px; border-radius: calc(55px / 2); }
		30% { width: 61.1px; border-radius: calc(55px / 2); }
		38% { width: 27.55px; border-radius: calc(55px / 2); } /* Undershoot */
		40% { width: 18.4px; border-radius: calc(55px / 2); } /* MAX Undershoot */
		60% { width: 397.6px; border-radius: calc(55px / 2); } /* MAX Overshoot */
		62% { width: 387.45px; border-radius: calc(55px / 2); } /* Overshoot */
		70% { width: 354.9px; border-radius: calc(55px / 2); }
		72% { width: 354.9px; border-radius: calc(55px / 2); }
		80% { width: 360px; border-radius: calc(55px / 2); }
		82% { width: 363.05px; border-radius: calc(55px / 2); } /* Overshoot */
		92% { width: 360px; border-radius: calc(55px / 2); }
		96% { width: 360px; border-radius: calc(55px / 2); }
		99% { width: 360px; border-radius: calc(55px / 2); }
		100% { width: 360px; border-radius: calc(55px / 2); }
	}

	@keyframes searchshrink {
		0% { width: 360px; border-radius: calc(55px / 2); }
		4% { width: 360px; border-radius: calc(55px / 2); }
		8% { width: 360px; border-radius: calc(55px / 2); }
		18% { width: 363.05px; border-radius: calc(55px / 2); } /* Overshoot */
		20% { width: 360px; border-radius: calc(55px / 2); }
		28% { width: 354.9px; border-radius: calc(55px / 2); }
		30% { width: 354.9px; border-radius: calc(55px / 2); }
		38% { width: 387.45px; border-radius: calc(55px / 2); } /* Overshoot */
		40% { width: 397.6px; border-radius: calc(55px / 2); } /* MAX Overshoot */
		60% { width: 18.4px; border-radius: calc(55px / 2); } /* Undershoot */
		62% { width: 27.55px; border-radius: calc(55px / 2); } /* Undershoot */
		70% { width: 61.1px; border-radius: calc(55px / 2); }
		72% { width: 61.1px; border-radius: calc(55px / 2); }
		80% { width: 55px; border-radius: calc(55px / 2); }
		82% { width: 51.95px; border-radius: calc(55px / 2); } /* Undershoot */
		90% { width: 55px; border-radius: calc(55px / 2); }
		92% { width: 55px; border-radius: calc(55px / 2); }
		100% { width: 55px; border-radius: 50%; } /* Final state radius */
	}

	@keyframes cartexpand {
		0% { width: 55px; border-radius: calc(55px / 2); }

		/* Using 1.01 scale for width */
		18% { width: 55px + (80px - 55px) * 1.01; } /* 55 + 25 * 1.01 = 80.25px */

		28% { width: 55px + (80px - 55px) * 0.98; } /* 55 + 25 * 0.98 = 79.5px */
		38% { width: 55px + (80px - 55px) * 1.09; } /* 55 + 25 * 1.09 = 82.25px */
		40% { width: 55px + (80px - 55px) * 1.12; } /* 55 + 25 * 1.12 = 83px */

		/* The 60%-90% scales were zero/negative; we reset to an elastic return */
		60% { width: 55px + (80px - 55px) * 0.85; } /* Smallest shrink: 55 + 25 * 0.85 = 76.25px */
		80% { width: 55px + (80px - 55px) * 1.05; } /* Overshoot: 55 + 25 * 1.05 = 81.25px */

		90% { width: 55px + (80px - 55px) * 0.99; } /* Slight undershoot: 55 + 25 * 0.99 = 79.75px */

		100% { width: 80px; border-radius: calc(55px / 2); }
	}

	@keyframes cartshrink {
		0% { width: 80px; border-radius: calc(55px / 2); }

		/* The scale is inverted now: we shrink from 80px towards 55px */
		/* If scale is 1.01, it means we undershoot the target 55px */

		18% { width: 80px - (80px - 55px) * (1 - 1.01); } /* 80 - 25 * -0.01 = 80.25px (Slight increase) */

		28% { width: 80px - (80px - 55px) * (1 - 0.98); } /* 80 - 25 * 0.02 = 79.5px */
		38% { width: 80px - (80px - 55px) * (1 - 1.09); } /* 80 - 25 * -0.09 = 82.25px (Overshoot) */
		40% { width: 80px - (80px - 55px) * (1 - 1.12); } /* 80 - 25 * -0.12 = 83px (Max Overshoot) */

		/* The 60%-90% scales were zero/negative; we drive it to the target 55px with a bounce */
		60% { width: 55px + (80px - 55px) * 0.15; } /* Overshoot: 55 + 25 * 0.15 = 58.75px */
		80% { width: 55px - (80px - 55px) * 0.02; } /* Undershoot: 55 - 25 * 0.02 = 54.5px */

		90% { width: 55px + (80px - 55px) * 0.005; } /* Slight overshoot: 55 + 25 * 0.005 = 55.125px */

		100% { width: 55px; border-radius: 50%; }
	}

	@keyframes opacitydown {
		0% {opacity: 1;}

		4% {opacity: 1;}

		8% {
			opacity: 1;
		}

		18% {
			opacity: 1.01;
		}

		20% {
			opacity: 1;
		}

		28% {
			opacity: 0.98;
		}

		30% {
			opacity: 0.98;
		}

		38% {
			opacity: 1.09;
		}

		40% {
			opacity: 1.12;
		}

		60% {
			opacity: -0.12;
		}

		62% {
			opacity: -0.09;
		}

		70% {
			opacity: 0.02;
		}

		72% {
			opacity: 0.02;
		}

		80% {
			opacity: 0;
		}

		82% {
			opacity: -0.01;
		}

		90% {
			opacity: 0;
		}

		92% {
			opacity: 0;
		}

		99% {
			opacity: 0;
		}

		100% {opacity: 0; display: none;}
	}

	@keyframes opacityup {
		0% {
			opacity: 0; display: block;
		}
		8% {
			opacity: 0;
		}
		10% {
			opacity: 0;
		}
		18% {
			opacity: -0.01;
		}
		20% {
			opacity: 0;
		}
		28% {
			opacity: 0.02;
		}
		30% {
			opacity: 0.02;
		}
		38% {
			opacity: -0.09;
		}
		40% {
			opacity: -0.12;
		}
		60% {
			opacity: 1.12;
		}
		62% {
			opacity: 1.09;
		}
		70% {
			opacity: 0.98;
		}
		72% {
			opacity: 0.98;
		}
		80% {
			opacity: 1;
		}
		82% {
			opacity: 1.01;
		}
		92% {
			opacity: 1;
		}
		96% {
			opacity: 1;
		}
		100% {
			opacity: 1;
		}
	}

	.NavChoice:hover {
		text-decoration: underline 3px #000000;
	}

	.SearchBar {
		width: 292px;
		height: 58px;
		flex-shrink: 0;
		border-radius: 50px;
		background: #E4E4E4;
		margin-top: auto;
		margin-bottom: auto;
		margin-left: auto;
		margin-right: 45px;
	}

	input[type="text"] {
		width: 100%;
		height: 100%;
		margin: 0;
		border: 0px;
		border-radius:50px;
		line-height: 1.5;
		color: #333;
		box-sizing: border-box;
		transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
		background: transparent;
		text-align: center;
		font-size: 20px;
		font-family: 'Roboto Flex';
		z-index: 1;
		position: absolute;
		text-align: left;
	}

	.inputsmth::placeholder {
		opacity: 0;
	}

	.inputsmth::placeholder:focus {
		opacity: 1;
	}

	input[type="text"]:focus {
		border-color: #000000;
		box-shadow: 0 0 0 3px rgba(59, 59, 59, 0.25);
		outline: none;
	}

	.expandSearchDiv {
		border-radius: calc(55px / 2);
		animation: searchexpand 0.5s ease-in-out 1 alternate both;
	}

	.shrinkSearchDiv {
		animation: searchshrink 0.5s ease-in-out 1 alternate both;
	}

	.hideSearchIcon {
		animation: opacitydown 0.5s ease-in-out 1 alternate both;
		opacity: 0;
	}

	.showSearchIcon {
		animation: opacityup 0.5s ease-in-out 1 alternate both;
		opacity: 1;
	}

	.cartText {
		color: #000000;
		text-align: center;
		font-family: "Roboto Flex";
		font-size: 24px;
		font-style: normal;
		font-weight: 600;
		line-height: 90%; /* 21.6px */
		letter-spacing: -0.72px;
		text-align: center;
		display: none;
		margin-right: auto;
		text-decoration: none !important;
	}

	.cartText:hover {
		text-decoration: none !important;
	}

	.showCartText {
		animation: opacityup 0.5s ease-in-out 1 alternate both;
		opacity: 1;
		display: block;
	}

	.hideCartText {
		animation: opacitydown 0.5s ease-in-out 1 alternate both;
	}

	.expandCartDiv {
		animation: cartexpand 0.2s ease-in-out 1 alternate both;
	}

	.shrinkCartDiv {
		animation: cartshrink 0.2s ease-in-out 1 alternate both;
	}

	.MainBox {
		margin-top: 22px;
		margin-bottom: 22px;
		padding: 60px;
		width: 100%;
		height: fit-content;
		flex-shrink: 0;
		border-radius: 60px;
		background: #FFF;
		justify-content:flex-start;
		display: flex;
		flex-direction: column;
	}

	.FooterBar {
		justify-content: center;
		text-align: center;
		margin-top: 75px;
		margin-bottom: 75px;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: fit-content;
	}

	.FooterLink {
		color: #FFF;
		text-align: center;
		font-family: "Roboto Flex";
		font-size: 24px;
		font-style: normal;
		font-weight: 600;
		line-height: 90%; /* 21.6px */
		letter-spacing: -0.72px;
		width: 300px;
		text-align: center;
	}

	.FooterLink:not(:last-child){
		margin-right: 80px;
	}

	.FooterLink:hover {
		text-decoration: underline 3px #FFF;
	}

	.FooterText {
		color: #FFF;
		text-align: center;
		font-family: "Roboto Flex";
		font-size: 20px;
		font-style: normal;
		font-weight: 600;
		line-height: 90%; /* 21.6px */
		letter-spacing: -0.72px;
		width: 300px;
		text-align: center;
	}

	label {
		display: none;
	}

	.footer_homepage {
		transform: translateY(-270px);
	}
</style>