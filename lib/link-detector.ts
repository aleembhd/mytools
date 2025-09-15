import type { LinkPreviewResponse } from "@/types/bookmark"

export const detectPlatform = (url: string): "youtube" | "twitter" | "linkedin" | "website" | "other" => {
  const domain = new URL(url).hostname.toLowerCase()

  if (domain.includes("youtube.com") || domain.includes("youtu.be")) {
    return "youtube"
  }
  if (domain.includes("twitter.com") || domain.includes("x.com")) {
    return "twitter"
  }
  if (domain.includes("linkedin.com")) {
    return "linkedin"
  }
  if (domain.includes(".")) {
    return "website"
  }
  return "other"
}

export const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export const fetchLinkPreview = async (url: string): Promise<LinkPreviewResponse> => {
  try {
    const apiUrl = `https://api.linkpreview.net/?key=f69c5ba5851cc913f4644f92a205ee24&q=${encodeURIComponent(url)}`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch preview")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching link preview:", error)
    return {
      title: new URL(url).hostname,
      url: url,
    }
  }
}

export const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return "/website-icon.jpg"
  }
}
