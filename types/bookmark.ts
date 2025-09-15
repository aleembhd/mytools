export interface Bookmark {
  id: string
  url: string
  platform: "youtube" | "twitter" | "linkedin" | "website" | "other"
  title: string
  image?: string
  tags: string[]
  favorite: boolean
  createdAt: number
  rawPreview?: any
}

export interface LinkPreviewResponse {
  title?: string
  description?: string
  image?: string
  url?: string
  domain?: string
}
