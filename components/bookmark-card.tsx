"use client"

import type React from "react"

import { useState } from "react"
import type { Bookmark } from "@/types/bookmark"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Star, ExternalLink, Trash2, Plus, X, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookmarkCardProps {
  bookmark: Bookmark
  onToggleFavorite: (id: string) => void
  onAddTag: (id: string, tag: string) => void
  onRemoveTag: (id: string, tag: string) => void
  onDelete: (id: string) => void
}

export function BookmarkCard({ bookmark, onToggleFavorite, onAddTag, onRemoveTag, onDelete }: BookmarkCardProps) {
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMenuOptions, setShowMenuOptions] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(bookmark.id, newTag.trim())
      setNewTag("")
      setShowTagInput(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag()
    } else if (e.key === "Escape") {
      setShowTagInput(false)
      setNewTag("")
    }
  }

  const handleDeleteConfirm = () => {
    onDelete(bookmark.id)
    setShowDeleteDialog(false)
  }

  const handleCardClick = () => {
    if (bookmark.platform === "youtube") {
      window.open(bookmark.url, "_blank")
    }
  }

  // Website layout - horizontal row with minimal height
  if (bookmark.platform === "website") {
    return (
      <>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <img
                  src={bookmark.image || "/placeholder.svg?height=24&width=24&query=website-icon"}
                  alt="Favicon"
                  className="w-6 h-6 rounded"
                  onError={(e) => {
                    e.currentTarget.src = "/website-icon.jpg"
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate text-balance">{bookmark.title}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {new URL(bookmark.url).hostname.replace("www.", "")}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(bookmark.id)}
                  className={cn("h-7 w-7 p-0", bookmark.favorite && "text-yellow-500")}
                >
                  <Star className="h-3.5 w-3.5" fill={bookmark.favorite ? "currentColor" : "none"} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(bookmark.url, "_blank")}
                  className="h-7 w-7 p-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Tags - only show if there are tags or tag input is active */}
            {(bookmark.tags.length > 0 || showTagInput) && (
              <div className="flex flex-wrap gap-1 mt-2">
                {bookmark.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs h-5">
                    {tag}
                    <button onClick={() => onRemoveTag(bookmark.id, tag)} className="ml-1 hover:text-destructive">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                {showTagInput ? (
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={() => setShowTagInput(false)}
                    placeholder="Add tag..."
                    className="h-5 w-16 text-xs"
                    autoFocus
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTagInput(true)}
                    className="h-5 px-2 text-xs"
                  >
                    <Plus className="h-2.5 w-2.5 mr-1" />
                    Tag
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete confirmation dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this bookmark? This action cannot be undone and will permanently remove
                it from your storage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <>
      <Card className={cn("hover:shadow-md transition-shadow relative", "z-0")}>
        <CardContent className="p-3">
          {bookmark.image && (
            <div 
              className="aspect-video mb-2 overflow-hidden rounded-md bg-muted cursor-pointer relative"
              onClick={bookmark.platform === "youtube" ? handleCardClick : undefined}
              style={{ zIndex: 1 }}
            >
              <img
                src={bookmark.image || "/placeholder.svg"}
                alt={bookmark.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/preview-image.jpg"
                }}
              />
            </div>
          )}

          <div className="space-y-2">
            <div>
              <h3 
                className={cn(
                  "font-medium text-sm line-clamp-2 text-balance",
                  bookmark.platform === "youtube" && "cursor-pointer hover:text-blue-600"
                )}
                onClick={bookmark.platform === "youtube" ? handleCardClick : undefined}
              >
                {bookmark.title}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{new URL(bookmark.url).hostname.replace("www.", "")}</p>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenuOptions(!showMenuOptions)
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Inline menu options */}
              {showMenuOptions && (
                <div className="mt-2 p-2 bg-gray-50 rounded border space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(bookmark.id)
                      setShowMenuOptions(false)
                    }}
                  >
                    <Star
                      className={cn("h-3 w-3 mr-2", bookmark.favorite && "text-yellow-500")}
                      fill={bookmark.favorite ? "currentColor" : "none"}
                    />
                    {bookmark.favorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(bookmark.url, "_blank")
                      setShowMenuOptions(false)
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Visit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTagInput(true)
                      setShowMenuOptions(false)
                    }}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    Add Tag
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteDialog(true)
                      setShowMenuOptions(false)
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Tags - only show if there are tags or tag input is active */}
            {(bookmark.tags.length > 0 || showTagInput) && (
              <div className="flex flex-wrap gap-1">
                {bookmark.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs h-5">
                    {tag}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveTag(bookmark.id, tag)
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                {showTagInput && (
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={() => setShowTagInput(false)}
                    placeholder="Add tag..."
                    className="h-5 w-16 text-xs"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bookmark? This action cannot be undone and will permanently remove it
              from your storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}