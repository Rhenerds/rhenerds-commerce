import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
    // --- Logic from the first +page.ts (loading product content) ---
    let postContent = null;
    let postMeta = null;
    try {
        const post = await import(`../../../products/${params.slug}.md`);
        postContent = post.default;
        postMeta = post.metadata;
    } catch (e) {
        error(404, `Could not find ${params.slug}`);
    }

    // --- Logic from the second +page.ts (determining 'source') ---
    const fromWhichPage = url.searchParams.get('refer');
    let source: string = '';
    if (fromWhichPage === 'home') {
        source = 'h';
    } else if (fromWhichPage === 'catalog') {
        source = 'c';
    } else {
        source = 'h'; // Default to 'h' if 'refer' is not 'home' or 'catalog'
    }

    const stockresponse = await fetch(
        '/api/stock/get',
        {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"key":params.slug
			})
		}
    )

    const stockresponsejson: { 
		error: string; 
		value: string; 
	} = await stockresponse.json();

    const stockvalue = stockresponsejson.value

    // --- Combine and return all data ---
    return {
        content: postContent,
        meta: postMeta,
        source: source,
        slug: params.slug,
        stock: stockvalue,
    };
};