"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, ExternalLink, Heart, Tag, Youtube, Globe, Linkedin, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Bookmark } from "@/types/bookmark"

interface SampleViewProps {
  onBack: () => void
  className?: string
}

export function SampleView({ onBack, className }: SampleViewProps) {
  const sampleBookmarks: Bookmark[] = [
    {
      id: "sample-1",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Amazing React Tutorial - Complete Guide",
      platform: "youtube",
      image: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      favorite: true,
      tags: ["react", "tutorial", "frontend"],
      createdAt: Date.now() - 86400000, // 1 day ago
    },
    {
      id: "sample-2",
      url: "https://example.com/blog/web-development",
      title: "Modern Web Development Best Practices",
      platform: "website",
      image: "/api/placeholder/400/200",
      favorite: false,
      tags: ["web-dev", "best-practices", "guide"],
      createdAt: Date.now() - 172800000, // 2 days ago
    },
    {
      id: "sample-3",
      url: "https://linkedin.com/in/example-profile",
      title: "John Doe - Senior Frontend Developer",
      platform: "linkedin",
      image: "/api/placeholder/400/200",
      favorite: true,
      tags: ["networking", "career", "frontend"],
      createdAt: Date.now() - 259200000, // 3 days ago
    },
    {
      id: "sample-4",
      url: "https://twitter.com/example/status/123456789",
      title: "Interesting thread about TypeScript tips",
      platform: "twitter",
      image: "/api/placeholder/400/200",
      favorite: false,
      tags: ["typescript", "tips", "thread"],
      createdAt: Date.now() - 345600000, // 4 days ago
    },
    {
      id: "sample-5",
      url: "https://docs.example.com/api-reference",
      title: "API Documentation - Getting Started",
      platform: "website",
      image: "/api/placeholder/400/200",
      favorite: false,
      tags: ["api", "documentation", "reference"],
      createdAt: Date.now() - 432000000, // 5 days ago
    },
  ]

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />
      case "linkedin":
        return <Linkedin className="h-4 w-4 text-blue-600" />
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-400" />
      default:
        return <Globe className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Tag className="h-3 w-3" />
              <span>Sample collection contains {sampleBookmarks.length} bookmarks</span>
            </div>
            <Separator />
          </div>

          <div className="space-y-4">
            {sampleBookmarks.map((bookmark, index) => (
              <Card key={bookmark.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getPlatformIcon(bookmark.platform)}
                        <span className="text-xs font-medium text-muted-foreground capitalize">
                          {bookmark.platform}
                        </span>
                        {bookmark.favorite && (
                          <Heart className="h-3 w-3 text-red-500 fill-current" />
                        )}
                      </div>
                      <h3 className="font-medium text-sm leading-tight">
                        {bookmark.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {bookmark.url}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                      <ExternalLink className="h-3 w-3" />
                      <span className="sr-only">Open link</span>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {bookmark.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                      {bookmark.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          +{bookmark.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(bookmark.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Collection Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Total Bookmarks:</span>
                <span className="ml-1 font-medium">{sampleBookmarks.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Favorites:</span>
                <span className="ml-1 font-medium">
                  {sampleBookmarks.filter((b) => b.favorite).length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Platforms:</span>
                <span className="ml-1 font-medium">
                  {new Set(sampleBookmarks.map((b) => b.platform)).size}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Tags:</span>
                <span className="ml-1 font-medium">
                  {new Set(sampleBookmarks.flatMap((b) => b.tags)).size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}