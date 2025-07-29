<script lang="ts">
    // Assuming 'data' is passed as a prop from a load function or parent
    let { data } = $props() // Or `export let data;` if not using $props()

	let index = $state(0);

    import { Carousel, Controls, CarouselIndicators, Thumbnails } from "flowbite-svelte";

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
    const images = (data?.meta?.images ?? []).map((url: string) => {
        const name = getImageName(url); // Get the clean name from the URL string
        return {
            alt: name,   // Set alt to the clean name
            src: url,    // The src is the original URL string
            title: name  // Set title to the clean name
        };
    });
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

{#if data.source === "h"}
	<a class="BackLink" href="/">Back to home</a>
{/if}
{#if data.source === "c"}
	<a class="BackLink" href="/catalog">Back to catalog</a>
{/if}

<div class="ProductEnv">

	<div class="ProductSlide">
		<Carousel {images} imgClass="object-contain h-full w-fit rounded-xs" bind:index>
		<Controls class="items-center pt-4 text-red-400 dark:text-green-400 p-8" />
		<CarouselIndicators class="p-4" position="withThumbnails" />
		<Thumbnails {images} imgClass="object-contain h-[100px] w-[100px] rounded-xs" bind:index />
	</Carousel>
	</div>

	<article class="ProductSlide" style="padding-left: 20px;">
		<hgroup>
			<h1>{data.meta.title}</h1>
		</hgroup>

		<p class="ProdPrice">{data.meta.price}</p>

		<div class="InfoBarrier"></div>

		<div class="prose">
			<data.content />
		</div>
	</article>

	<div class="PriceSlide">
		<p class="ProdText">Purchasing Information:</p>
		{#if data.meta.linkstate === 'PO' && Number(data.stock) > 0}
			<p class="ProdText">Preorder Available</p>
			<p class="ProdText">Available stock: {data.stock}</p>
		{:else if data.meta.linkstate === 'OTS' && Number(data.stock) > 0}
			<p class="ProdText">On The Spot Only</p>
			<p class="ProdText">Available stock: {data.stock}</p>
		{:else if data.meta.linkstate === 'PO' && Number(data.stock) <= 0}
			<p class="ProdText">Preorder Stock Ran Out</p>
		{:else if data.meta.linkstate === 'OTS' && Number(data.stock) <= 0}
			<p class="ProdText">On The Spot Stock Ran Out</p>
		{:else if data.meta.linkstate === 'U'}
			<p class="ProdText">Unavailable</p>
		{:else if data.meta.linkstate === 'SO'}
			<p class="ProdText">Stock Ran Out</p>
		{/if}
		<div class="InfoBarrier" style="background-color: #FFF;"></div>
		<p class="ProdText">Subtotal: {data.meta.price}</p>
			{#if data.meta.linkstate === 'PO'}
				{#if Number(data.stock) > 0}
					<div class="BuyButton">
						<a class="BuyText" href="/cart/{data.slug}">Add to cart</a>
					</div>
				{:else}
					<div class="DarkButton">
						<p class="DarkText">Ran Out</p>
					</div>
				{/if}
			{/if}
			{#if data.meta.linkstate === 'OTS' || data.meta.linkstate === "OTSP"}
				{#if Number(data.stock) > 0}
					<div class="DarkButton">
						<p class="DarkText">OTS Only</p>
					</div>
				{:else}
					<div class="DarkButton">
						<p class="DarkText">Ran Out</p>
					</div>
				{/if}
			{/if}
			{#if data.meta.linkstate === 'U'}
				<div class="DarkButton">
					<p class="DarkText">Unavailable</p>
				</div>
			{/if}
			{#if data.meta.linkstate === 'SO'}
			<div class="DarkButton">
				<p class="DarkText">Ran Out</p>
			</div>
			{/if}
	</div>
</div>

<style>
	.BackLink {
		color: #000158;
		text-align: left;
		font-family: "Roboto Flex";
		font-size: 20px;
		font-style: normal;
		font-weight: 300;
		line-height: 90%; /* 18px */
		letter-spacing: -0.6px;
		margin-bottom: 10px;
	}

	.BackLink:hover {
		text-decoration: underline 2px;
	}

	h1 {
		color: #000;
		font-family: "Roboto Flex";
		font-size: 38px;
		font-style: normal;
		font-weight: 400;
		line-height: 90%; /* 28.8px */
		letter-spacing: -0.96px;
	}

	.ProdPrice {
		color: #000;
		font-family: "Roboto Flex";
		font-size: 45px;
		font-style: normal;
		font-weight: 430;
		line-height: 90%; /* 28.8px */
		letter-spacing: -0.96px;
		margin-top: 20px;
		margin-bottom: 30px;
	}

	.ProductEnv {
		width: 100%;
		height: fit-content;
		display: flex;
		flex-direction: row;
	}

	.ProductSlide {
		height: fit-content;
		width: 40%;
	}

	.PriceSlide {
		height: fit-content;
		width: 20%;
		background-color: #DDD;
		border-radius: 22px;
		padding: 15px;
		margin-left: 20px;
	}

	.InfoBarrier {
		width: 100%;
		background-color: #DDD;
		height: 4px;
		border-radius: 2px;
		margin-bottom: 30px;
	}

	.ProdText {
		color: #000;
		text-align: left;
		font-family: "Roboto Flex";
		font-size: 20px;
		font-style: normal;
		font-weight: 300;
		line-height: 90%; /* 18px */
		letter-spacing: -0.6px;
		margin-bottom: 10px;
	}

	.BuyButton {
		background-color: #009029;
		width: 100%;
		height: fit-content;
		border-radius: 10px;
		padding: 10px;
	}

	.DarkButton {
		background-color: #555;
		width: 100%;
		height: fit-content;
		border-radius: 10px;
		padding: 10px;
	}

	.BuyText {
		width: 100%;
		color: #ffffff;
		text-align: center;
		font-family: "Roboto Flex";
		font-size: 20px;
		font-style: normal;
		font-weight: 400;
		line-height: 90%; /* 18px */
		letter-spacing: -0.6px;
		display: block;
	}

	.DarkText {
		width: 100%;
		color: #ffffff;
		text-align: center;
		font-family: "Roboto Flex";
		font-size: 20px;
		font-style: normal;
		font-weight: 400;
		line-height: 90%; /* 18px */
		letter-spacing: -0.6px;
		display: block;
	}
</style>
