import type { Post } from '$lib/types'

// iv - there's probably a better place to put this but for neow it's okay
const fandoms = ['Zachz Winner', 'YonKaGor', 'Vocaloid UTAU', 'DELTARUNE', 'Fabulous Beast / YouShouYan', 'Forsaken', 'Public Transit', 'Beastars', 'Ena Dream BBQ', 'Arknights']

export async function load({ fetch }) {
	const response = await fetch('/api/productquery')
	const preposts: Post[] = await response.json()

	const slugs = preposts.map(item => item.slug)

	console.log(slugs)

	const stocksresponse = await fetch(
		'/api/stock/getmultiple',
		{
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"keys":slugs
			})
		}
	)

	const stockjson: { 
		error: string; 
		values: { [key: string]: string | null } | null; 
	} = await stocksresponse.json();

	const posts = preposts.map(item => {
		if (item.slug) {
			const stock = stockjson.values ? stockjson.values[item.slug] : null
			return { ...item, stock: stock }
		}
		return item
	})

	return { posts, fandoms }
}
