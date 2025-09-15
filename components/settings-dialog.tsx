"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Settings, Download, Upload, Trash2, Eye, ChevronDown, Copy, FileUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

interface SettingsDialogProps {
  onExport: () => string
  onImport: (data: string) => { success: boolean; stats?: { total: number; new: number; duplicates: number } }
  onClearAll: () => void
}

export function SettingsDialog({ onExport, onImport, onClearAll }: SettingsDialogProps) {
  const [importData, setImportData] = useState("")
  const [open, setOpen] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"text" | "file">("text")
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const router = useRouter()

  const exampleData = JSON.stringify(
    [
      {
        id: "example-1",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        title: "Example YouTube Video",
        platform: "youtube",
        image: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        favorite: false,
        tags: ["music", "classic"],
        createdAt: 1705315800000,
      },
      {
        id: "example-2",
        url: "https://example.com",
        title: "Example Website",
        platform: "website",
        image: "https://example.com/favicon.ico",
        favorite: true,
        tags: ["reference"],
        createdAt: 1705317600000,
      },
    ],
    null,
    2,
  )

  const handleExport = () => {
    const data = onExport()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bookmarks-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: "Your bookmarks have been exported to a JSON file.",
    })
  }

  const handleImport = () => {
    if (!importData.trim()) {
      toast({
        title: "Import failed",
        description: "Please paste your bookmark data first.",
        variant: "destructive",
      })
      return
    }

    const result = onImport(importData)
    if (result.success) {
      const { stats } = result
      if (stats) {
        const message = stats.new > 0 
          ? `${stats.new} new bookmarks added to your collection.${stats.duplicates > 0 ? ` ${stats.duplicates} duplicates were skipped.` : ''}`
          : "No new bookmarks were added. All bookmarks already exist in your collection."
        
        toast({
          title: "Import successful",
          description: message,
        })
      } else {
        toast({
          title: "Import successful",
          description: "Bookmarks have been added to your collection.",
        })
      }
      setImportData("")
      setOpen(false)
    } else {
      toast({
        title: "Import failed",
        description: "Invalid JSON data. Please check your file and try again.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      toast({
        title: "Invalid file type",
        description: "Please select a JSON file.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (content) {
        setImportData(content)
        const result = onImport(content)
        if (result.success) {
          const { stats } = result
          if (stats) {
            const message = stats.new > 0 
              ? `${stats.new} new bookmarks added from file.${stats.duplicates > 0 ? ` ${stats.duplicates} duplicates were skipped.` : ''}`
              : "No new bookmarks were added. All bookmarks from the file already exist in your collection."
            
            toast({
              title: "Import successful",
              description: message,
            })
          } else {
            toast({
              title: "Import successful",
              description: "Bookmarks have been added from file to your collection.",
            })
          }
          setImportData("")
          setOpen(false)
        } else {
          toast({
            title: "Import failed",
            description: "Invalid JSON format in the uploaded file.",
            variant: "destructive",
          })
        }
      }
    }
    reader.onerror = () => {
      toast({
        title: "File read error",
        description: "Failed to read the selected file.",
        variant: "destructive",
      })
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all bookmarks? This action cannot be undone.")) {
      onClearAll()
      toast({
        title: "All bookmarks cleared",
        description: "Your bookmark collection has been cleared.",
      })
      setOpen(false)
    }
  }

  const handleViewSample = () => {
    router.push("/sample")
  }

  const handleCopyExample = async () => {
    try {
      await navigator.clipboard.writeText(exampleData)
      toast({
        title: "Copied!",
        description: "Example JSON format copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please copy manually.",
        variant: "destructive",
      })
    }
  }

  const SettingsContent = () => (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Export Bookmarks</h4>
        <Button onClick={handleExport} className="w-full" size={isMobile ? "lg" : "default"}>
          <Download className="h-4 w-4 mr-2" />
          Export to JSON
        </Button>
      </div>

      {/* Import Section */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3">
          <div>
            <h4 className="text-sm font-medium">Import Bookmarks</h4>
            <p className="text-xs text-muted-foreground mt-1">
              📥 Import will <strong>add</strong> new bookmarks to your existing collection without removing any current bookmarks.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Collapsible open={showExample} onOpenChange={setShowExample}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size={isMobile ? "lg" : "sm"} className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  View JSON Format
                  <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showExample ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
        
        <Collapsible open={showExample} onOpenChange={setShowExample}>
          <CollapsibleContent>
            <div className="p-4 bg-muted rounded-lg mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Example JSON format:</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyExample}
                  className="h-8"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="bg-background p-3 rounded border">
                <pre className="text-xs leading-relaxed">{exampleData}</pre>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Upload Method Toggle */}
        <div className="flex gap-2 border rounded-lg p-1">
          <Button 
            variant={uploadMethod === "text" ? "default" : "ghost"}
            size="sm"
            onClick={() => setUploadMethod("text")}
            className="flex-1 h-8"
          >
            Paste Text
          </Button>
          <Button 
            variant={uploadMethod === "file" ? "default" : "ghost"}
            size="sm"
            onClick={() => setUploadMethod("file")}
            className="flex-1 h-8"
          >
            Upload File
          </Button>
        </div>
        
        {uploadMethod === "text" ? (
          <>
            <Textarea
              placeholder="Paste your bookmark JSON data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className={`${isMobile ? "min-h-[120px] text-base" : "min-h-[100px] text-sm"}`}
            />
            <Button onClick={handleImport} className="w-full" size={isMobile ? "lg" : "default"}>
              <Upload className="h-4 w-4 mr-2" />
              Import from Text
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">Select a JSON file to import</p>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
                id="json-file-input"
              />
              <label htmlFor="json-file-input">
                <Button 
                  variant="outline" 
                  size={isMobile ? "lg" : "default"}
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    <FileUp className="h-4 w-4 mr-2" />
                    Choose JSON File
                  </span>
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Clear All Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Clear All Data</h4>
        <Button 
          onClick={handleClearAll} 
          variant="destructive" 
          className="w-full" 
          size={isMobile ? "lg" : "default"}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Bookmarks
        </Button>
      </div>
    </div>
  )

  // Mobile-first responsive design
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] p-6">
          <SheetHeader className="space-y-2 pb-4">
            <SheetTitle className="text-left">Bookmark Settings</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-full pb-6">
            <SettingsContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop version
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bookmark Settings</DialogTitle>
        </DialogHeader>
        <SettingsContent />
      </DialogContent>
    </Dialog>
  )
}