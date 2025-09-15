"use client"

import { useState, useEffect } from "react"
import type { Bookmark } from "@/types/bookmark"
import { bookmarkStorage } from "@/lib/bookmark-storage"
import {
  detectPlatform,
  fetchLinkPreview,
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  getFaviconUrl,
} from "@/lib/link-detector"

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setBookmarks(bookmarkStorage.getAll())
  }, [])

  const addBookmark = async (url: string) => {
    setLoading(true)
    try {
      const platform = detectPlatform(url)
      const preview = await fetchLinkPreview(url)

      let image = preview.image
      const title = preview.title || new URL(url).hostname

      // Handle YouTube thumbnails
      if (platform === "youtube") {
        const videoId = extractYouTubeVideoId(url)
        if (videoId && !image) {
          image = getYouTubeThumbnail(videoId)
        }
      }

      // Handle website favicons
      if (platform === "website" && !image) {
        image = getFaviconUrl(url)
      }

      const bookmark: Bookmark = {
        id: Date.now().toString(),
        url,
        platform,
        title,
        image,
        tags: [],
        favorite: false,
        createdAt: Date.now(),
        rawPreview: preview,
      }

      bookmarkStorage.add(bookmark)
      setBookmarks(bookmarkStorage.getAll())
    } catch (error) {
      console.error("Error adding bookmark:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    bookmarkStorage.update(id, updates)
    setBookmarks(bookmarkStorage.getAll())
  }

  const deleteBookmark = (id: string) => {
    bookmarkStorage.delete(id)
    setBookmarks(bookmarkStorage.getAll())
  }

  const toggleFavorite = (id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id)
    if (bookmark) {
      updateBookmark(id, { favorite: !bookmark.favorite })
    }
  }

  const addTag = (id: string, tag: string) => {
    const bookmark = bookmarks.find((b) => b.id === id)
    if (bookmark && !bookmark.tags.includes(tag)) {
      updateBookmark(id, { tags: [...bookmark.tags, tag] })
    }
  }

  const removeTag = (id: string, tag: string) => {
    const bookmark = bookmarks.find((b) => b.id === id)
    if (bookmark) {
      updateBookmark(id, { tags: bookmark.tags.filter((t) => t !== tag) })
    }
  }

  const clearAll = () => {
    bookmarkStorage.clear()
    setBookmarks([])
  }

  const exportData = () => {
    return bookmarkStorage.export()
  }

  const importData = (data: string): { success: boolean; stats?: { total: number; new: number; duplicates: number } } => {
    const stats = bookmarkStorage.getImportStats(data)
    const success = bookmarkStorage.import(data)
    
    if (success) {
      setBookmarks(bookmarkStorage.getAll())
      return { success: true, stats: stats || undefined }
    }
    return { success: false }
  }

  return {
    bookmarks,
    loading,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    addTag,
    removeTag,
    clearAll,
    exportData,
    importData,
  }
}
