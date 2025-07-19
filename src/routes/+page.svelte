<script lang="ts">
	import * as config from '$lib/config'

	let { data } = $props()
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<h1>Welcome to our catalog site</h1>
<p class="TopText">Preorders coming soon...</p>

<h2>Zachz Winner Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'Zachz Winner'}
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
</div>

<h2>YonKaGor Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'YonKaGor'}
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
</div>

<h2>Vocaloid / UTAU Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'Vocaloid UTAU'}
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
</div>

<h2>DELTARUNE Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'DELTARUNE'}
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
</div>

<h2>Fabulous Beast / 有兽焉 Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'Fabulous Beast YouShouYan'}
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
</div>

<h2>Forsaken Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'Forsaken'}
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
</div>

<h2>Public Transit Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'Public Transit'}
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
</div>

<h2>Beastars Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'Beastars'}
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
</div>

<h2>Ena Dream BBQ Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'Ena Dream BBQ'}
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
</div>

<h2>Arknights Merch</h2>
<div class="ProdView">
    {#each data.posts as post}
    {#if post.fandom === 'Arknights'}
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
