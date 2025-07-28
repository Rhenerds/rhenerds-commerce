<script lang="ts">
	import * as config from '$lib/config'

	let { data } = $props()
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<h1>Catalog</h1>
{#if data.searchTerm != ''}
<div class="SearchInfo">
    <p class="SearchText">Showing search results for '{data.searchTerm}'</p>
    <a class="SearchTextLink" href="/catalog">Clear search</a>
</div>
{/if}
<div class="ProdView">
    {#each data.posts as post}
        <a href="/catalog/{post.slug}?refer=catalog" class="ProdItem">
            <div class="ProdImg">
                <img src="{post.images[0]}" alt="{post.title} product image" style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px">
            </div>
            <div class="ProdInfo">
            <p class="ProdText">{post.title}</p>
            <p class="ProdText" style="font-weight: 420;">{post.price}</p>
            {#if post.linkstate === 'PO'}
                {#if Number(post.stock) <= 0 }
                <p class="ProdText">Sold Out</p>
                {:else}
                <p class="ProdText">PO Available: {post.stock}</p>
                {/if}
            {/if}
            {#if post.linkstate === 'OTS'}
                {#if Number(post.stock) <= 0 }
                <p class="ProdText">Sold Out</p>
                {:else}
                <p class="ProdText">OTS Available: {post.stock}</p>
                {/if}
            {/if}
            {#if post.linkstate === 'SO'}
                <p class="ProdText">Sold Out</p>
            {/if}
            {#if post.linkstate === 'U'}
                <p class="ProdText">Unavailable</p>
            {/if}
            </div>
        </a>
    {/each}
</div>

<style>
    h1 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 64px;
        font-style: normal;
        font-weight: 600;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
        margin-bottom: 90px;
    }

    .ProdView {
        width: 100%;
        height: fit-content;
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        justify-content: left;
    }
    .ProdItem {
         border-radius: 10px;
         background-color: #E4E4E4;
         width: 170px;
         height: 280px;
    }
    .ProdImg {
        border-radius: 10px;
        background-color: #545454;
        width: 170px;
        height: 170px;
    }

    .ProdInfo {
        width: 100%;
        height: 110px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .ProdText {
        font-family: 'Roboto Flex';
        margin: 5px;
        width: auto;
        text-align: center;
        color: #000;
        font-size: 20px;
        font-style: normal;
        font-weight: 300;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
    }

    .SearchInfo {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
    }

    .SearchText {
        font-family: 'Roboto Flex';
        margin-right: 5px;
        width: auto;
        text-align: center;
        color: #000;
        font-size: 20px;
        font-style: normal;
        font-weight: 300;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
    }

    .SearchTextLink {
        font-family: 'Roboto Flex';
        margin-right: 5px;
        width: auto;
        text-align: center;
        color: #004488;
        font-size: 20px;
        font-style: normal;
        font-weight: 300;
        line-height: 90%; /* 18px */
        letter-spacing: -0.6px;
    }

    .SearchTextLink:hover {
        text-decoration: underline 2px;
    }
</style>
