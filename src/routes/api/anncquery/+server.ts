import { json } from '@sveltejs/kit'
import type { AnPost } from '$lib/types'

async function getPosts() {
	let posts: AnPost[] = []

	const paths = import.meta.glob('/src/anncposts/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<AnPost, 'slug'>
			const post = { ...metadata, slug } satisfies AnPost
			post.published && posts.push(post)
		}
	}

	posts = posts.sort((first, second) =>
    new Date(second.date).getTime() - new Date(first.date).getTime()
	)

	return posts
}

export async function GET() {
	const posts = await getPosts()
	return json(posts)
}