<script lang="ts">
	import { formatDate } from '$lib/utils/date.js'

	let { data } = $props()
</script>


<h1>Announcements</h1>
<ul>
    {#each data.posts as post}
    <li>
        <a href="/announcements/{post.slug}">
            <h2 class="Link">{post.title}</h2>
            <p>{post.description}</p>
            <p>{formatDate(post.date)}</p>
        </a>
    </li>
    {/each}
</ul>

<style>
    h1 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 64px;
        font-style: normal;
        font-weight: 600;
        line-height: 90%; /* 57.6px */
        letter-spacing: -1.92px;
        margin-bottom: 45px;
    }

    h2 {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 30px;
        font-style: normal;
        font-weight: 470;
        line-height: 90%; /* 36px */
        letter-spacing: -1.2px;
        margin-bottom: 10px;
    }

    p {
        color: #000;
        font-family: "Roboto Flex";
        font-size: 20px;
        font-style: normal;
        font-weight: 300;
        line-height: 98%; /* 18px */
        letter-spacing: -0.6px;
        margin-top: 5px;
    }

    li {
        margin-bottom: 20px;
    }

    .Link {
		color: #000158;
	}

    .Link:hover {
		text-decoration: underline 2px;
	}
</style>