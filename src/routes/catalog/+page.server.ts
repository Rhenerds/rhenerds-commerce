import type { Post } from '$lib/types'; // Your Post type definition
import type { PageServerLoad } from './$types'; // SvelteKit's type for load function in +page.server.ts

export const load: PageServerLoad = async ({ fetch, url }) => {
    // 1. Fetch all posts from your API endpoint
    const response = await fetch('/api/productquery');
    let preposts: Post[] = await response.json(); // Use 'let' because we might reassign it after filtering

    const slugs = preposts.map(item => item.slug)

    // 2. Get the search term from the URL's query parameters
    const searchTerm = url.searchParams.get('q');

    // 3. Apply filtering if a search term exists
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        preposts = preposts.filter(post => {
            // Check if the search term is present in any of the specified fields:
            // title, description, fandom, type.
            // Using optional chaining (`?.`) and nullish coalescing (`?? ''`) for robustness
            // in case a property is missing on a 'Post' object.
            return (
                (post.title?.toLowerCase() ?? '').includes(lowerCaseSearchTerm) ||
                (post.description?.toLowerCase() ?? '').includes(lowerCaseSearchTerm) ||
                (post.fandom?.toLowerCase() ?? '').includes(lowerCaseSearchTerm) ||
                (post.type?.toLowerCase() ?? '').includes(lowerCaseSearchTerm)
            );
        });
    }

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

    // 4. Return the filtered (or unfiltered) posts and the search term to the +page.svelte component
    return { 
        posts: posts,
        searchTerm: searchTerm || '' // Pass the search term (or an empty string if none)
    };
};