<script lang="ts">
	import type { Post } from "$lib/types";

    export let fandom: string = '';
    export let data: { posts: Post[] } = {
        posts: []
    };

</script>

<main class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === fandom}
        <a href="/catalog/{post.slug}?refer=home" class="ProdItem">
            <div class="ProdImg">
                <img src="{post.images[0]}" alt="{post.title} product image" style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px">
            </div>
            <div class="ProdInfo">
            <p class="ProdText">{post.title}</p>
            <p class="ProdText" style="font-weight: 420;">{post.price}</p>
            {#if post.linkstate === 'PO'}
                <p class="ProdText">Preorder Open</p>
            {/if}
            {#if post.linkstate === 'OTS'}
                <p class="ProdText">On The Spot</p>
            {/if}
            {#if post.linkstate === 'SO'}
                <p class="ProdText">Sold Out</p>
            {/if}
            {#if post.linkstate === 'U'}
                <p class="ProdText">Unavailable</p>
            {/if}
            </div>
        </a>
    {/if}
    {/each}
</main>

<style>
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
</style>