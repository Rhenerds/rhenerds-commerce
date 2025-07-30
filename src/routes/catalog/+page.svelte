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
            <p class="ProdText" style="font-weight: 600;">{post.price}</p>
            {#if post.linkstate === 'OTSP'}
                <span class="prod-chip" style="background-color: var(--ots-open-color);">OTS Only</span>
            {:else if post.linkstate === 'U' || post.stock === null}
                <span class="prod-chip" style="background-color: var(--unavailable-color);">Unavailable</span>
            {:else if Number(post.stock) <= 0 || post.linkstate === 'SO'}
                <span class="prod-chip" style="background-color: var(--sold-out-color);">Sold Out</span>
            {:else if post.linkstate === 'PO'}
                <span class="prod-chip" style="background-color: var(--po-open-color);">PO Open: {post.stock} Available</span>
            {:else if post.linkstate === 'OTS'}
                <span class="prod-chip" style="background-color: var(--ots-open-color);">OTS Open: {post.stock} Available</span>
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
        background-color: #ffffff;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 4px;
        width: 170px;
        height: 280px;
    }
    .ProdImg {
        border-radius: 10px 10px 0 0;
        background-color: #545454;
        width: 170px;
        height: 170px;
    }

    .ProdInfo {
        width: 100%;
        height: 110px;
        display: flex;
        flex-direction: column;
        margin: 8px;
    }

    .ProdText {
        font-family: 'Inter';
        margin: 5px;
        width: auto;
        text-align: left;
        color: #000;
        font-size: 1rem; /* 16px */
        font-style: normal;
        font-weight: 350;
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

    .prod-chip {
        color: white;
        padding: 2px 10px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
        margin: 4px 2px;
        cursor: default;
        width: fit-content;
        border-radius: 12px;
    }

    :root {
        --unavailable-color: #f44336;  
        --sold-out-color: #e91e63;     
        --po-open-color: #4caf50;      
        --ots-open-color: #2196f3;    
    }
</style>
