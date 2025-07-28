import type { Post } from '$lib/types'

// iv - there's probably a better place to put this but for neow it's okay
const fandoms = ['Zachz Winner', 'YonKaGor', 'Vocaloid UTAU', 'DELTARUNE', 'Fabulous Beast / YouShouYan', 'Forsaken', 'Public Transit', 'Beastars', 'Ena Dream BBQ', 'Arknights']

export async function load({ fetch }) {
	const response = await fetch('/api/productquery')
	const posts: Post[] = await response.json()
	return { posts, fandoms }
}
