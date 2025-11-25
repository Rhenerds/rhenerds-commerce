export type Categories = string

export type Post = {
	title: string
	slug: string
	description: string
	fandom: string
    type: string
	published: boolean
    price: string
    link: string
    linkstate: 'PO' | 'OTS' | 'SO' | 'U' | 'OTSP'
    images: Categories[]
    stock: number | null
}

export type AnPost = {
	title: string
	slug: string
	description: string
	date: string
	categories: Categories[]
	published: boolean
}