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
		
		<div class="InfoBarrier"></div>

		<div class="ArtistCard">
			<img 
				src={`/artists/${data.meta.artistname}.png`} 
				alt={data.meta.artistname} 
				class="ArtistProfilePic"
			/>
			<div class="ArtistInfo">
				<p>Art drawn by</p>
				<p class="ArtistName">{data.meta.artistname}</p>
				<p class="SmallText">{data.meta.artistpronouns}</p>
				<p class="ArtistDescription">{data.meta.artistdescription}</p>
				{#if data.meta.artistsocials}
					<div class="ArtistSocials">
						{#each data.meta.artistsocials as social}
							<a 
								href={social.link} 
								target="_blank" 
								rel="noopener noreferrer" 
								class="ArtistSocialLink"
							>
								<img src="/icons/{social.name}.svg" class="Icon" alt={social.name} />
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</article>

	<div class="PriceSlide">
		{#if data.meta.linkstate === 'PO' && Number(data.stock) > 0}
			<span class="prod-chip" style="background-color: var(--po-open-color);">Preorder Available</span>
			<div class="InfoBarrier"></div>
			<p class="ProdText">Total Stock: <span style="font-weight:bold">{data.stock} left</span></p>
		{:else if data.meta.linkstate === 'OTS' && Number(data.stock) > 0}
			<span class="prod-chip" style="background-color: var(--ots-open-color);">On The Spot Only</span>
			<div class="InfoBarrier"></div>
			<p class="ProdText">Total Stock: <span style="font-weight:bold">{data.stock} left</span></p>
		{:else if data.meta.linkstate === 'PO' && Number(data.stock) <= 0}
			<span class="prod-chip" style="background-color: var(--sold-out-color);">Preorder Stock Ran Out</span>
		{:else if data.meta.linkstate === 'OTS' && Number(data.stock) <= 0}
			<span class="prod-chip" style="background-color: var(--sold-out-color);">On The Spot Stock Ran Out</span>
		{:else if data.meta.linkstate === 'U'}
			<span class="prod-chip" style="background-color: var(--unavailable-color);">Unavailable</span>
		{:else if data.meta.linkstate === 'SO'}
			<span class="prod-chip" style="background-color: var(--sold-out-color);">Stock Ran Out</span>
		{/if}
		<div class="InfoBarrier"></div>
		<div style="display: flex; width:100%; justify-content: space-between; align-items: center; margin-bottom:4px">
			<p class="ProdText">Subtotal:</p>
			<p class="ProdText" style="font-weight: bold; font-size: 1.5rem;">{data.meta.price}</p>
		</div>
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
	.Icon {
		height: 20px;
		color: #000;
	}
	.ArtistCard {
		display: flex;
		align-items: top;
		gap: 20px;
		margin-top: 15px;
		padding: 15px;
		background-color: #00000000;
		border-radius: 10px;
	}
	.ArtistProfilePic {
		margin-top: 24px;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #0000004d;
	}
	.ArtistInfo {
		flex: 1;
	}
	.ArtistName {
		font-weight: 500;
		font-size: 22px;
		color: #000;
		font-family: "Roboto Flex";
	}
	.ArtistDescription {
		font-size: 16px;
		color: #333;
		margin-bottom: 8px;
		font-family: "Roboto Flex";
	}
	.ArtistSocials {
		margin-top: 6px;
		display: flex;
	}
	.SmallText {
		color: #0000004d; 
		line-height: 0.5;
		margin-bottom: 8px;
	}
	.ArtistSocialLink {
		margin-right: 10px;
		color: #000158;
		font-weight: 400;
		text-decoration: underline;
		font-family: "Roboto Flex";
		font-size: 15px;
	}
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
		margin-top: 15px;
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
		box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 16px;
		border: 3px solid #00000020;
		border-radius: 22px;
		padding: 15px;
		margin-left: 20px;
	}

	.InfoBarrier {
		width: 100%;
		background-color: #00000010;
		height: 2px;
		margin-bottom: 15px;
		margin-top: 15px;
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
