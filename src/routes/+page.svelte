<script lang="ts">
	import ProductView from '$lib/components/ProductView.svelte';
	import * as config from '$lib/config'

	let { data } = $props()
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="annc">
    <p class="TopText">Latest Announcement : Text Here</p>
</div>

{#each data.fandoms as fandom}
    <h2>{fandom}</h2>
    <ProductView {fandom} {data} />
{/each}

<style>
    .TopLink {
        color: #070f69;
    }

    .TopLink:hover {
        text-decoration: underline 2px;
    }

    h1 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 64px;
        font-style: normal;
        font-weight: 600;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
    }

    h2 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 40px;
        font-style: normal;
        font-weight: 500;
        line-height: 90%; /* 36px */
        letter-spacing: -1.2px;
        margin-top: 35px;
        margin-bottom: 10px;
    }

    .TopText {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 25px;
        font-style: normal;
        font-weight: 320;
        line-height: 90%; /* 36px */
        letter-spacing: -1.2px;
        margin-bottom: 45px;
        width: 100%;
        text-align: center;
        transform: translateY(-50px)
    }

    .annc {
        width: calc(100% + 120px);
        border-top-left-radius: 60px;
        border-top-right-radius: 60px;
        background-color: #fff;
        box-shadow: 0 -16px 16px 0 rgba(0, 0, 0, 0.25);
        height: 50px;
        transform: translateX(-60px) translateY(15px);
    }
</style>
