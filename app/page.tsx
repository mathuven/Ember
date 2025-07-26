"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Shuffle, Heart, Zap, Waves, Laugh, Flame, Loader2 } from "lucide-react"

const categories = {
  spice: {
    name: "Spice",
    icon: Flame,
    emoji: "🌶️",
    color: "from-orange-300 to-red-300",
    description: "Hot takes & unpopular opinions",
  },
  chuckle: {
    name: "Chuckle",
    icon: Laugh,
    emoji: "😂",
    color: "from-yellow-300 to-orange-300",
    description: "Ridiculous, meme-worthy debates",
  },
  drift: {
    name: "Drift",
    icon: Waves,
    emoji: "🌊",
    color: "from-blue-300 to-purple-300",
    description: "Deep, thoughtful, late-night energy",
  },
  edge: {
    name: "Edge",
    icon: Zap,
    emoji: "⚡",
    color: "from-purple-300 to-pink-300",
    description: "Controversial & bold",
  },
  glow: {
    name: "Glow",
    icon: Heart,
    emoji: "💗",
    color: "from-pink-300 to-rose-300",
    description: "Wholesome, affirming, and soft",
  },
  flip: {
    name: "Flip",
    icon: Shuffle,
    emoji: "🔀",
    color: "from-indigo-300 to-cyan-300",
    description: "Random picks across all vibes",
  },
}

export default function EmberApp() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [isFlipped, setIsFlipped] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateQuestion = async (category: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate question")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data
    } catch (err) {
      setError("Oops! Failed to generate a question. Try again?")
      console.error("Error:", err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySelect = async (categoryKey: string) => {
    setSelectedCategory(categoryKey)
    setIsFlipped(false)
    setCurrentQuestion("")

    const result = await generateQuestion(categoryKey)
    if (result) {
      setTimeout(() => {
        setCurrentQuestion(result.question)
        setIsFlipped(true)
      }, 300)
    }
  }

  const getNewQuestion = async () => {
    if (!selectedCategory) return

    setIsFlipped(false)
    const result = await generateQuestion(selectedCategory)
    if (result) {
      setTimeout(() => {
        setCurrentQuestion(result.question)
        setIsFlipped(true)
      }, 300)
    }
  }

  const selectedCat = selectedCategory ? categories[selectedCategory as keyof typeof categories] : null

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-full ${
                darkMode ? "text-yellow-300 hover:bg-slate-800" : "text-orange-600 hover:bg-orange-100"
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <h1 className={`text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>✨ Ember ✨</h1>
          <p className={`text-xl mb-2 ${darkMode ? "text-purple-200" : "text-slate-600"}`}>
            A Warm Space for Hot Takes & Cool Conversations
          </p>
          <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
            🧠 Built for thinkers. Loved by overthinkers.
          </p>
        </div>

        {!selectedCategory ? (
          /* Category Selection */
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl font-semibold text-center mb-8 ${darkMode ? "text-white" : "text-slate-700"}`}>
              🎭 Explore the Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categories).map(([key, category]) => {
                const IconComponent = category.icon
                return (
                  <Card
                    key={key}
                    className={`cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-gradient-to-br ${category.color} ${
                      darkMode ? "opacity-90" : ""
                    }`}
                    onClick={() => handleCategorySelect(key)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{category.emoji}</div>
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm">{category.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          /* Question Display */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Badge className={`text-lg px-4 py-2 bg-gradient-to-r ${selectedCat?.color} text-white border-0 mb-4`}>
                {selectedCat?.emoji} {selectedCat?.name}
              </Badge>
              <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{selectedCat?.description}</p>
            </div>

            <Card
              className={`transform transition-all duration-500 border-0 shadow-2xl ${
                isFlipped ? "scale-100 opacity-100" : "scale-95 opacity-70"
              } ${
                darkMode ? "bg-gradient-to-br from-slate-800 to-slate-700" : "bg-gradient-to-br from-white to-gray-50"
              }`}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-6">
                  {isLoading ? <Loader2 className="h-16 w-16 animate-spin mx-auto text-gray-400" /> : "💭"}
                </div>

                {error ? (
                  <div className="mb-8">
                    <p className={`text-lg mb-4 ${darkMode ? "text-red-300" : "text-red-600"}`}>{error}</p>
                  </div>
                ) : (
                  <p
                    className={`text-xl leading-relaxed mb-8 min-h-[3rem] ${darkMode ? "text-white" : "text-slate-700"}`}
                  >
                    {isLoading ? "Crafting the perfect question..." : currentQuestion || "Generating your question..."}
                  </p>
                )}

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={getNewQuestion}
                    className={`bg-gradient-to-r ${selectedCat?.color} text-white border-0 hover:scale-105 transition-transform`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Shuffle className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? "Generating..." : "New Question"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(null)}
                    className={darkMode ? "border-slate-600 text-slate-300 hover:bg-slate-800" : ""}
                    disabled={isLoading}
                  >
                    Back to Categories
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                📲 Perfect for sharing in your group chats ✨
              </p>
              <p className={`text-xs mt-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                ✨ Questions curated for great conversations!
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Because every great convo starts with a spark 🔥
          </p>
        </div>
      </div>
    </div>
  )
}
