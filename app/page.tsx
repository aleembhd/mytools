"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { BookmarkCard } from "@/components/bookmark-card"
import { SettingsDialog } from "@/components/settings-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, Search, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BookmarkingApp() {
  const {
    bookmarks,
    loading,
    addBookmark,
    toggleFavorite,
    addTag,
    removeTag,
    deleteBookmark,
    clearAll,
    exportData,
    importData,
  } = useBookmarks()

  const [urlInput, setUrlInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "favorites") {
        filtered = filtered.filter((b) => b.favorite)
      } else {
        filtered = filtered.filter((b) => b.platform === selectedCategory)
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          b.url.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [bookmarks, selectedCategory, searchQuery])

  const handleAddBookmark = async () => {
    if (!urlInput.trim()) return

    try {
      new URL(urlInput) // Validate URL
      await addBookmark(urlInput)
      setUrlInput("")
    } catch {
      alert("Please enter a valid URL")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddBookmark()
    }
  }

  const getCategoryCount = (category: string) => {
    if (category === "all") return bookmarks.length
    if (category === "favorites") return bookmarks.filter((b) => b.favorite).length
    return bookmarks.filter((b) => b.platform === category).length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-balance">Personal Bookmarks</h1>
            </div>
            <div className="ml-auto">
              <SettingsDialog onExport={exportData} onImport={importData} onClearAll={clearAll} />
            </div>
          </div>

          {/* Add URL Input */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Paste a URL to save..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-10"
              />
              <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={handleAddBookmark} disabled={loading || !urlInput.trim()} className="px-6">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>

          {/* Search and Filter Row */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({getCategoryCount("all")})</SelectItem>
                <SelectItem value="youtube">YouTube ({getCategoryCount("youtube")})</SelectItem>
                <SelectItem value="linkedin">LinkedIn ({getCategoryCount("linkedin")})</SelectItem>
                <SelectItem value="twitter">Twitter ({getCategoryCount("twitter")})</SelectItem>
                <SelectItem value="website">Websites ({getCategoryCount("website")})</SelectItem>
                <SelectItem value="favorites">Favorites ({getCategoryCount("favorites")})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchQuery ? "No bookmarks found" : "No bookmarks yet"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start by pasting a URL above to save your first bookmark"}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-4",
              selectedCategory === "website"
                ? "grid-cols-1"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onToggleFavorite={toggleFavorite}
                onAddTag={addTag}
                onRemoveTag={removeTag}
                onDelete={deleteBookmark}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
