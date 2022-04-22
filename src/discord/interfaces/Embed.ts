export interface Embed {
    title?: string,
    type?: string,
    description?: string,
    url?: string,
    timestamp?: string,
    color?: number,
    footer?: {
        text?: string,
        icon_url?: string
    },
    image?: {
        url?: string
    },
    thumbnail?: {
        url?: string
    },
    video?: {
        url?: string
    },
    provider?: {
        name?: string,
        url?: string
    },
    author?: {
        name?: string,
        url?: string,
        icon_url?: string
    },
    fields?: {
        name: string,
        value: string,
        inline?: boolean
    }[]
}