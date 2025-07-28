import type { Post } from '$lib/types'

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

	return { posts }
}
