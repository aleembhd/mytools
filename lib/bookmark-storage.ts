import type { Bookmark } from "@/types/bookmark"

const STORAGE_KEY = "bookmarks"

export const bookmarkStorage = {
  getAll: (): Bookmark[] => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  save: (bookmarks: Bookmark[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  },

  add: (bookmark: Bookmark): void => {
    const bookmarks = bookmarkStorage.getAll()
    bookmarks.unshift(bookmark)
    bookmarkStorage.save(bookmarks)
  },

  update: (id: string, updates: Partial<Bookmark>): void => {
    const bookmarks = bookmarkStorage.getAll()
    const index = bookmarks.findIndex((b) => b.id === id)
    if (index !== -1) {
      bookmarks[index] = { ...bookmarks[index], ...updates }
      bookmarkStorage.save(bookmarks)
    }
  },

  delete: (id: string): void => {
    const bookmarks = bookmarkStorage.getAll()
    const filtered = bookmarks.filter((b) => b.id !== id)
    bookmarkStorage.save(filtered)
  },

  clear: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },

  export: (): string => {
    return JSON.stringify(bookmarkStorage.getAll(), null, 2)
  },

  import: (data: string): boolean => {
    try {
      const importedBookmarks = JSON.parse(data)
      if (Array.isArray(importedBookmarks)) {
        // Get existing bookmarks
        const existingBookmarks = bookmarkStorage.getAll()
        
        // Create a Set of existing IDs to avoid duplicates
        const existingIds = new Set(existingBookmarks.map(b => b.id))
        
        // Filter out duplicates and add new bookmarks
        const newBookmarks = importedBookmarks.filter((bookmark: Bookmark) => {
          // Validate bookmark structure
          if (!bookmark.id || !bookmark.url || !bookmark.title) {
            return false
          }
          // Avoid duplicates based on ID
          return !existingIds.has(bookmark.id)
        })
        
        // Generate new IDs for bookmarks that might have conflicting IDs
        const processedNewBookmarks = newBookmarks.map((bookmark: Bookmark) => ({
          ...bookmark,
          // Ensure we have a unique ID and proper timestamp
          id: bookmark.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: bookmark.createdAt || Date.now()
        }))
        
        // Merge existing + new bookmarks (new ones at the beginning)
        const mergedBookmarks = [...processedNewBookmarks, ...existingBookmarks]
        
        // Save the merged collection
        bookmarkStorage.save(mergedBookmarks)
        return true
      }
      return false
    } catch {
      return false
    }
  },

  // Get import statistics for user feedback
  getImportStats: (data: string): { total: number; new: number; duplicates: number } | null => {
    try {
      const importedBookmarks = JSON.parse(data)
      if (Array.isArray(importedBookmarks)) {
        const existingBookmarks = bookmarkStorage.getAll()
        const existingIds = new Set(existingBookmarks.map(b => b.id))
        
        const validBookmarks = importedBookmarks.filter((bookmark: Bookmark) => 
          bookmark.id && bookmark.url && bookmark.title
        )
        
        const newBookmarks = validBookmarks.filter((bookmark: Bookmark) => 
          !existingIds.has(bookmark.id)
        )
        
        return {
          total: validBookmarks.length,
          new: newBookmarks.length,
          duplicates: validBookmarks.length - newBookmarks.length
        }
      }
      return null
    } catch {
      return null
    }
  },
}
