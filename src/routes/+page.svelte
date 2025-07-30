<script lang="ts">
	import ProductView from '$lib/components/ProductView.svelte';
	import * as config from '$lib/config'

	let { data } = $props()
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<h1>Welcome to our catalog site</h1>
<p class="TopText">Preorders coming soon... <a class="TopLink" href="/legal/preordering">Preorder Notice</a></p>

{#each data.fandoms as fandom}
    <h2>{fandom} Merch</h2>
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
        font-size: 40px;
        font-style: normal;
        font-weight: 320;
        line-height: 90%; /* 36px */
        letter-spacing: -1.2px;
        margin-bottom: 45px;
    }
</style>
