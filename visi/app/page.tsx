"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, Star, Plus, Trash2, Download, Zap, Crown, Gem, Rocket, Wand2 } from "lucide-react"
import { generateVisionImage } from "./actions/generate-image"

interface VisionItem {
  id: string
  title: string
  description: string
  imageUrl?: string
  category: "career" | "health" | "relationships" | "travel" | "personal" | "financial"
  isGenerating?: boolean
  createdAt: Date
}

const categories = [
  {
    value: "career",
    label: "Career",
    icon: Rocket,
    color: "bg-gradient-to-r from-blue-400 to-blue-600",
    textColor: "text-white",
  },
  {
    value: "health",
    label: "Health",
    icon: Heart,
    color: "bg-gradient-to-r from-green-400 to-emerald-600",
    textColor: "text-white",
  },
  {
    value: "relationships",
    label: "Love",
    icon: Heart,
    color: "bg-gradient-to-r from-pink-400 to-rose-600",
    textColor: "text-white",
  },
  {
    value: "travel",
    label: "Adventure",
    icon: Star,
    color: "bg-gradient-to-r from-purple-400 to-indigo-600",
    textColor: "text-white",
  },
  {
    value: "personal",
    label: "Growth",
    icon: Wand2,
    color: "bg-gradient-to-r from-yellow-400 to-orange-600",
    textColor: "text-white",
  },
  {
    value: "financial",
    label: "Wealth",
    icon: Crown,
    color: "bg-gradient-to-r from-emerald-400 to-teal-600",
    textColor: "text-white",
  },
]

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
        </div>
      ))}
    </div>
  )
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        />
      </div>
    </div>
  )
}

export default function VisionBoardApp() {
  const [visionItems, setVisionItems] = useState<VisionItem[]>([])
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "personal" as VisionItem["category"],
  })
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addVisionItem = async () => {
    if (!newItem.title || !newItem.description) return

    const item: VisionItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      isGenerating: true,
      createdAt: new Date(),
    }

    setVisionItems((prev) => [...prev, item])
    setNewItem({ title: "", description: "", category: "personal" })
    setIsAddingItem(false)

    try {
      const imageUrl = await generateVisionImage(newItem.description)
      setVisionItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, imageUrl, isGenerating: false } : i)))
    } catch (error) {
      console.error("Failed to generate image:", error)
      setVisionItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isGenerating: false } : i)))
    }
  }

  const removeVisionItem = (id: string) => {
    setVisionItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getCategoryInfo = (category: VisionItem["category"]) => {
    return categories.find((cat) => cat.value === category) || categories[0]
  }

  const downloadVisionBoard = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      canvas.width = 1200
      canvas.height = 800

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#667eea")
      gradient.addColorStop(1, "#764ba2")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("✨ My Vision Board ✨", canvas.width / 2, 80)

      const link = document.createElement("a")
      link.download = "my-vision-board.png"
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />

      {/* Header */}
      <header className="relative z-20 bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Gem className="h-10 w-10 text-purple-400 animate-spin-slow" />
                <div className="absolute inset-0 h-10 w-10 bg-purple-400/20 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x leading-tight">
                  DreamBoard
                </h1>
                <p className="text-sm text-white/60 font-medium">Manifest Your Reality</p>
              </div>
            </div>
            <Button
              onClick={downloadVisionBoard}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Download className="h-4 w-4 mr-2" />
              <span>Download Magic</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="relative inline-block mb-6">
            <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x leading-tight">
              Manifest Dreams
            </h2>
            <div className="absolute -top-4 -right-4 animate-bounce">
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
            Transform your deepest desires into stunning visual reality with the power of AI magic ✨
          </p>

          {/* Animated Stats */}
          <div className="flex justify-center space-x-8 mb-12">
            {[
              { icon: Star, label: "Dreams Created", value: "10K+" },
              { icon: Zap, label: "Manifestations", value: "5K+" },
              { icon: Heart, label: "Happy Dreamers", value: "2K+" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center group cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative mb-2">
                  <stat.icon className="h-8 w-8 text-purple-400 mx-auto group-hover:scale-125 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping group-hover:animate-pulse" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* How It Works - Enhanced */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              {
                step: "1",
                title: "Dream It",
                description: "Pour your heart into words and watch magic unfold",
                icon: Wand2,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "2",
                title: "AI Creates",
                description: "Our mystical AI brings your visions to stunning life",
                icon: Sparkles,
                color: "from-pink-500 to-blue-500",
              },
              {
                step: "3",
                title: "Manifest",
                description: "Visualize daily and watch reality bend to your will",
                icon: Crown,
                color: "from-blue-500 to-purple-500",
              },
            ].map((step, index) => (
              <Card
                key={step.step}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                <CardHeader className="text-center relative z-10">
                  <div className="relative mx-auto w-16 h-16 mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full animate-pulse`} />
                    <div className="relative w-full h-full bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                      {step.step}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-purple-200 transition-colors">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 group-hover:text-white/90 transition-colors">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add New Vision Item - Enhanced */}
        <Card className="mb-12 relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-dashed border-purple-300/50 hover:border-purple-300 transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center space-x-3 text-white">
              <div className="relative">
                <Plus className="h-6 w-6 animate-pulse" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping" />
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create New Vision
              </span>
            </CardTitle>
            <CardDescription className="text-white/70">
              Describe your deepest desires and watch them materialize into beautiful reality ✨
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            {!isAddingItem ? (
              <Button
                onClick={() => setIsAddingItem(true)}
                className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="h-5 w-5 mr-3 animate-spin-slow" />
                <span>Begin Your Manifestation Journey</span>
                <Wand2 className="h-5 w-5 ml-3" />
              </Button>
            ) : (
              <div className="space-y-6 animate-fade-in-up">
                <div className="relative">
                  <Input
                    placeholder="✨ Name your vision (e.g., 'Dream Home', 'Soul Mate', 'Perfect Career')"
                    value={newItem.title}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
                    className="h-14 text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/50"
                  />
                  <Gem className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                </div>

                <div className="relative">
                  <Textarea
                    placeholder="🌟 Paint your vision with words... Be specific, be bold, be magical! Describe colors, feelings, surroundings, and every detail that makes your heart sing."
                    value={newItem.description}
                    onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                    rows={5}
                    className="text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 resize-none focus:border-purple-400 focus:ring-purple-400/50"
                  />
                  <Sparkles className="absolute right-4 top-4 h-5 w-5 text-purple-400 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => {
                    const isSelected = newItem.category === category.value
                    return (
                      <Button
                        key={category.value}
                        variant="outline"
                        size="lg"
                        onClick={() =>
                          setNewItem((prev) => ({ ...prev, category: category.value as VisionItem["category"] }))
                        }
                        className={`relative overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                          isSelected
                            ? `${category.color} ${category.textColor} border-transparent shadow-lg`
                            : "bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 ${category.color} opacity-0 hover:opacity-20 transition-opacity duration-300`}
                        />
                        <category.icon className="h-4 w-4 mr-2" />
                        <span className="font-medium">{category.label}</span>
                        {isSelected && <Star className="h-3 w-3 ml-2 animate-pulse" />}
                      </Button>
                    )
                  })}
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={addVisionItem}
                    disabled={!newItem.title || !newItem.description}
                    className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Rocket className="h-5 w-5 mr-2" />
                    <span>Manifest This Vision</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingItem(false)}
                    className="px-8 h-14 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vision Board Grid - Enhanced */}
        {visionItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {visionItems.map((item, index) => {
              const categoryInfo = getCategoryInfo(item.category)
              return (
                <Card
                  key={item.id}
                  className="group relative overflow-hidden bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 hover:rotate-1 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Animated border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px] rounded-lg">
                    <div className="w-full h-full bg-gray-900 rounded-lg" />
                  </div>

                  <div className="relative z-10">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {item.isGenerating ? (
                        <div className="h-56 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-blue-900/50 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                          <div className="text-center z-10">
                            <div className="relative mb-4">
                              <Sparkles className="h-12 w-12 text-purple-400 mx-auto animate-spin-slow" />
                              <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping" />
                            </div>
                            <p className="text-white/80 font-medium">Manifesting your vision...</p>
                            <div className="mt-2 flex justify-center space-x-1">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                  style={{ animationDelay: `${i * 0.2}s` }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : item.imageUrl ? (
                        <div className="relative group/image">
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-56 object-cover transition-transform duration-700 group-hover/image:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                              <Sparkles className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs text-white font-medium">AI Generated</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-center">
                            <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Vision creation failed</p>
                          </div>
                        </div>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-3 right-3 h-8 w-8 p-0 bg-red-500/80 backdrop-blur-sm hover:bg-red-600 border-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 hover:scale-100"
                        onClick={() => removeVisionItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white group-hover:text-purple-200 transition-colors flex items-center space-x-2">
                          <span>{item.title}</span>
                          <Star className="h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </CardTitle>
                        <Badge
                          className={`${categoryInfo.color} ${categoryInfo.textColor} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                        >
                          <categoryInfo.icon className="h-3 w-3 mr-1" />
                          {categoryInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                        {item.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                        <span>Created {item.createdAt.toLocaleDateString()}</span>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>Manifesting</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {visionItems.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping" />
              <Gem className="h-20 w-20 text-purple-400 mx-auto animate-float" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Magical Journey Begins Here
            </h3>
            <p className="text-white/60 text-lg max-w-md mx-auto">
              Create your first vision and watch the universe conspire to make it reality ✨
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
