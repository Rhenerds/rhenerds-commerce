<script lang="ts">
	import { formatDate } from '$lib/utils/date.js'

	let { data } = $props()
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<a class="BackLink" href="/announcements">Back to Announcements</a>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
		<p>Published at {formatDate(data.meta.date)}</p>
	</hgroup>

	<div class="tags">
		{#each data.meta.categories as category}
			<span class="surface-4">&num;{category}</span>
		{/each}
	</div>

	<div class="prose">
		<data.content />
	</div>
</article>

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

	article {
		max-inline-size: var(--size-content-3);
		margin-inline: auto;
    width: 100%;

		h1 {
			text-transform: capitalize;
      font-family: "Roboto Flex";
      font-size: 40px;
		}

		h1 + p {
			margin-top: var(--size-2);
			color: var(--text-2);
      font-family: "Roboto Flex";
		}

		.tags {
			display: flex;
			gap: var(--size-3);
			margin-top: var(--size-7);
      font-family: "Roboto Flex";

			> * {
				padding: var(--size-2) var(--size-3);
				border-radius: var(--radius-round);
			}
		}

    .prose {
      margin-top: 40px;
    }
	}
</style>