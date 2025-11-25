import type { AnPost } from '$lib/types'

export async function load({ fetch }) {
	const response = await fetch('/api/anncquery')
	const posts: AnPost[] = await response.json()
	return { posts }
}