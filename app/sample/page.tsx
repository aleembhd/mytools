"use client"

import { SampleView } from "@/components/sample-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SamplePage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Sample Bookmarks</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Preview of bookmark collection
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <SampleView onBack={handleBack} className="min-h-[calc(100vh-120px)]" />
      </main>
    </div>
  )
}