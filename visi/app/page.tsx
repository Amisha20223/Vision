"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  Heart,
  Star,
  Plus,
  Trash2,
  Download,
  Zap,
  Crown,
  Gem,
  Rocket,
  Wand2,
  CheckCircle,
  Target,
  TrendingUp,
  Calendar,
  Eye,
  Brain,
  Lightbulb,
  Trophy,
  Clock,
  BarChart3,
  Flame,
} from "lucide-react"
import { generateImage } from "./actions/ai-image"
import { generateFree } from "./actions/free-ai"

interface VisionItem {
  id: string
  title: string
  description: string
  imageUrl?: string
  category: "career" | "health" | "relationships" | "travel" | "personal" | "financial"
  isGenerating?: boolean
  createdAt: Date
  isManifested: boolean
  manifestationSteps: ManifestationStep[]
  targetDate?: Date
  priority: "low" | "medium" | "high"
  visualizationCount: number
  lastVisualized?: Date
}

interface ManifestationStep {
  id: string
  title: string
  completed: boolean
  completedAt?: Date
}

const categories = [
  {
    value: "career",
    label: "Career",
    icon: Rocket,
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    textColor: "text-white",
  },
  {
    value: "health",
    label: "Health",
    icon: Heart,
    color: "bg-gradient-to-r from-green-500 to-emerald-600",
    textColor: "text-white",
  },
  {
    value: "relationships",
    label: "Love",
    icon: Heart,
    color: "bg-gradient-to-r from-pink-500 to-rose-600",
    textColor: "text-white",
  },
  {
    value: "travel",
    label: "Adventure",
    icon: Star,
    color: "bg-gradient-to-r from-purple-500 to-indigo-600",
    textColor: "text-white",
  },
  {
    value: "personal",
    label: "Growth",
    icon: Wand2,
    color: "bg-gradient-to-r from-yellow-500 to-orange-600",
    textColor: "text-white",
  },
  {
    value: "financial",
    label: "Wealth",
    icon: Crown,
    color: "bg-gradient-to-r from-emerald-500 to-teal-600",
    textColor: "text-white",
  },
]

const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
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
          {i % 3 === 0 ? (
            <Sparkles className="h-4 w-4 text-purple-400" />
          ) : i % 3 === 1 ? (
            <Star className="h-3 w-3 text-pink-400" />
          ) : (
            <Gem className="h-3 w-3 text-blue-400" />
          )}
        </div>
      ))}
    </div>
  )
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-900/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        />
      </div>
    </div>
  )
}

export default function VisiApp() {
  const [visionItems, setVisionItems] = useState<VisionItem[]>([])
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "personal" as VisionItem["category"],
    priority: "medium" as "low" | "medium" | "high",
    targetDate: "",
    steps: [""] as string[],
  })
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [useFreeAI, setUseFreeAI] = useState(true)
  const [activeTab, setActiveTab] = useState("create")

  useEffect(() => {
    setMounted(true)
    // Load from localStorage
    const saved = localStorage.getItem("visi-data")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setVisionItems(
          parsed.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            targetDate: item.targetDate ? new Date(item.targetDate) : undefined,
            lastVisualized: item.lastVisualized ? new Date(item.lastVisualized) : undefined,
          })),
        )
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Save to localStorage
    if (mounted && visionItems.length > 0) {
      localStorage.setItem("visi-data", JSON.stringify(visionItems))
    }
  }, [visionItems, mounted])

  const addVisionItem = async () => {
    if (!newItem.title || !newItem.description) return

    const manifestationSteps: ManifestationStep[] = newItem.steps
      .filter((step) => step.trim())
      .map((step, index) => ({
        id: `${Date.now()}-${index}`,
        title: step.trim(),
        completed: false,
      }))

    const item: VisionItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      priority: newItem.priority,
      targetDate: newItem.targetDate ? new Date(newItem.targetDate) : undefined,
      manifestationSteps,
      isGenerating: true,
      createdAt: new Date(),
      isManifested: false,
      visualizationCount: 0,
    }

    setVisionItems((prev) => [...prev, item])
    setNewItem({
      title: "",
      description: "",
      category: "personal",
      priority: "medium",
      targetDate: "",
      steps: [""],
    })
    setIsAddingItem(false)

    try {
      console.log("Starting image generation for:", newItem.description)

      // Try multiple fallback approaches for image generation
      let imageUrl: string

      try {
        imageUrl = useFreeAI ? await generateFree(newItem.description) : await generateImage(newItem.description)
      } catch (error) {
        console.error("Primary AI failed, using fallback:", error)
        // Fallback to a more reliable placeholder
        const width = 512
        const height = 512
        const encodedPrompt = encodeURIComponent(newItem.title)
        imageUrl = `https://via.placeholder.com/${width}x${height}/1f2937/ffffff?text=${encodedPrompt}`
      }

      console.log("Image generation completed")
      setVisionItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, imageUrl, isGenerating: false } : i)))
    } catch (error) {
      console.error("Failed to generate image:", error)
      setVisionItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isGenerating: false } : i)))
    }
  }

  const removeVisionItem = (id: string) => {
    setVisionItems((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleManifested = (id: string) => {
    setVisionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isManifested: !item.isManifested } : item)),
    )
  }

  const toggleStep = (visionId: string, stepId: string) => {
    setVisionItems((prev) =>
      prev.map((item) =>
        item.id === visionId
          ? {
              ...item,
              manifestationSteps: item.manifestationSteps.map((step) =>
                step.id === stepId
                  ? {
                      ...step,
                      completed: !step.completed,
                      completedAt: !step.completed ? new Date() : undefined,
                    }
                  : step,
              ),
            }
          : item,
      ),
    )
  }

  const addVisualization = (id: string) => {
    setVisionItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              visualizationCount: item.visualizationCount + 1,
              lastVisualized: new Date(),
            }
          : item,
      ),
    )
  }

  const getCategoryInfo = (category: VisionItem["category"]) => {
    return categories.find((cat) => cat.value === category) || categories[0]
  }

  const getCompletionPercentage = (item: VisionItem) => {
    if (item.manifestationSteps.length === 0) return 0
    const completed = item.manifestationSteps.filter((step) => step.completed).length
    return Math.round((completed / item.manifestationSteps.length) * 100)
  }

  const addStep = () => {
    setNewItem((prev) => ({ ...prev, steps: [...prev.steps, ""] }))
  }

  const updateStep = (index: number, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? value : step)),
    }))
  }

  const removeStep = (index: number) => {
    setNewItem((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }))
  }

  const downloadVisionBoard = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      canvas.width = 1200
      canvas.height = 800

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#1f2937")
      gradient.addColorStop(1, "#000000")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("✨ My Visi Manifestation Board ✨", canvas.width / 2, 80)

      const link = document.createElement("a")
      link.download = "my-visi-board.png"
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  if (!mounted) return null

  const manifestedCount = visionItems.filter((item) => item.isManifested).length
  const totalVisualizations = visionItems.reduce((sum, item) => sum + item.visualizationCount, 0)
  const averageCompletion =
    visionItems.length > 0
      ? Math.round(visionItems.reduce((sum, item) => sum + getCompletionPercentage(item), 0) / visionItems.length)
      : 0

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <AnimatedBackground />
      <FloatingParticles />

      {/* Header */}
      <header className="relative z-20 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Eye className="h-10 w-10 text-purple-400 animate-pulse" />
                <div className="absolute inset-0 h-10 w-10 bg-purple-400/20 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x leading-tight">
                  Visi
                </h1>
                <p className="text-sm text-gray-400 font-medium">Complete Dream Manifestation Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setUseFreeAI(!useFreeAI)}
                variant="outline"
                className="bg-gray-800 backdrop-blur-sm border-gray-700 text-white hover:bg-gray-700 transition-all duration-300"
              >
                {useFreeAI ? "Free AI" : "HF AI"}
              </Button>
              <Button
                onClick={downloadVisionBoard}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Trophy,
              label: "Dreams Manifested",
              value: manifestedCount,
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: Eye,
              label: "Total Visualizations",
              value: totalVisualizations,
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: Target,
              label: "Average Progress",
              value: `${averageCompletion}%`,
              color: "from-green-500 to-emerald-500",
            },
            { icon: Flame, label: "Active Visions", value: visionItems.length, color: "from-blue-500 to-indigo-500" },
          ].map((stat, index) => (
            <Card
              key={stat.label}
              className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:bg-gray-800/50 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 backdrop-blur-xl border-gray-800">
            <TabsTrigger value="create" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </TabsTrigger>
            <TabsTrigger value="visions" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Eye className="h-4 w-4 mr-2" />
              My Visions
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="manifested"
              className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Manifested
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="mt-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border-2 border-dashed border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-3 text-white">
                  <div className="relative">
                    <Brain className="h-6 w-6 animate-pulse" />
                    <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Create New Vision
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Design your dream with detailed manifestation steps and AI-powered visualization ✨
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <Input
                        placeholder="✨ Vision Title (e.g., 'Dream Home', 'Perfect Career')"
                        value={newItem.title}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
                        className="h-14 text-lg bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/50"
                      />
                      <Lightbulb className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    </div>

                    <div className="relative">
                      <Input
                        type="date"
                        value={newItem.targetDate}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, targetDate: e.target.value }))}
                        className="h-14 text-lg bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white focus:border-purple-400 focus:ring-purple-400/50"
                      />
                      <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    </div>
                  </div>

                  <div className="relative">
                    <Textarea
                      placeholder="🌟 Describe your vision in vivid detail... Include colors, emotions, surroundings, and every aspect that makes your heart sing. The more detailed, the better the AI visualization!"
                      value={newItem.description}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      className="text-lg bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-400 resize-none focus:border-purple-400 focus:ring-purple-400/50"
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
                              : "bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white hover:bg-gray-700/50"
                          }`}
                        >
                          <category.icon className="h-4 w-4 mr-2" />
                          <span className="font-medium">{category.label}</span>
                          {isSelected && <Star className="h-3 w-3 ml-2 animate-pulse" />}
                        </Button>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {["low", "medium", "high"].map((priority) => (
                      <Button
                        key={priority}
                        variant="outline"
                        onClick={() => setNewItem((prev) => ({ ...prev, priority: priority as any }))}
                        className={`${
                          newItem.priority === priority
                            ? priority === "high"
                              ? "bg-red-500 text-white border-red-500"
                              : priority === "medium"
                                ? "bg-yellow-500 text-black border-yellow-500"
                                : "bg-green-500 text-white border-green-500"
                            : "bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white hover:bg-gray-700/50"
                        }`}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                      </Button>
                    ))}
                  </div>

                  {/* Manifestation Steps */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">Manifestation Steps</h3>
                    </div>
                    {newItem.steps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Step ${index + 1}: What action will bring you closer?`}
                          value={step}
                          onChange={(e) => updateStep(index, e.target.value)}
                          className="flex-1 bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-400"
                        />
                        {newItem.steps.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeStep(index)}
                            className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addStep}
                      className="w-full bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white hover:bg-gray-700/50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>

                  <Button
                    onClick={addVisionItem}
                    disabled={!newItem.title || !newItem.description}
                    className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Rocket className="h-5 w-5 mr-2" />
                    <span>Create & Manifest Vision</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visions Tab */}
          <TabsContent value="visions" className="mt-8">
            {visionItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visionItems
                  .filter((item) => !item.isManifested)
                  .map((item, index) => {
                    const categoryInfo = getCategoryInfo(item.category)
                    const completionPercentage = getCompletionPercentage(item)

                    return (
                      <Card
                        key={item.id}
                        className="group relative overflow-hidden bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:bg-gray-800/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3"
                      >
                        <div className="relative z-10">
                          <div className="relative overflow-hidden rounded-t-lg">
                            {item.isGenerating ? (
                              <div className="h-56 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                                <div className="text-center z-10">
                                  <div className="relative mb-4">
                                    <Brain className="h-12 w-12 text-purple-400 mx-auto animate-spin-slow" />
                                    <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping" />
                                  </div>
                                  <p className="text-white/80 font-medium">Creating your vision...</p>
                                </div>
                              </div>
                            ) : item.imageUrl ? (
                              <div className="relative group/image">
                                <img
                                  src={item.imageUrl || "/placeholder.svg"}
                                  alt={item.title}
                                  className="w-full h-56 object-cover transition-transform duration-700 group-hover/image:scale-110"
                                  crossOrigin="anonymous"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Visualization Button */}
                                <Button
                                  onClick={() => addVisualization(item.id)}
                                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-purple-500/80 backdrop-blur-sm hover:bg-purple-600 border-0"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualize
                                </Button>
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
                              className="absolute top-3 right-3 h-8 w-8 p-0 bg-red-500/80 backdrop-blur-sm hover:bg-red-600 border-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                              onClick={() => removeVisionItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-white group-hover:text-purple-200 transition-colors flex items-center space-x-2">
                                <span>{item.title}</span>
                                <Badge
                                  className={`ml-2 ${
                                    item.priority === "high"
                                      ? "bg-red-500"
                                      : item.priority === "medium"
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                >
                                  {item.priority}
                                </Badge>
                              </CardTitle>
                              <Badge className={`${categoryInfo.color} ${categoryInfo.textColor} shadow-lg`}>
                                <categoryInfo.icon className="h-3 w-3 mr-1" />
                                {categoryInfo.label}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>Progress</span>
                                <span>{completionPercentage}%</span>
                              </div>
                              <Progress value={completionPercentage} className="h-2" />
                            </div>
                          </CardHeader>

                          <CardContent>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">{item.description}</p>

                            {/* Manifestation Steps */}
                            <div className="space-y-2 mb-4">
                              <h4 className="text-sm font-semibold text-white flex items-center">
                                <Target className="h-4 w-4 mr-2" />
                                Steps to Manifest
                              </h4>
                              {item.manifestationSteps.map((step) => (
                                <div key={step.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={step.completed}
                                    onCheckedChange={() => toggleStep(item.id, step.id)}
                                    className="border-gray-600"
                                  />
                                  <span
                                    className={`text-sm ${step.completed ? "line-through text-gray-500" : "text-gray-300"}`}
                                  >
                                    {step.title}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                              <span>Visualized {item.visualizationCount} times</span>
                              {item.targetDate && <span>Target: {item.targetDate.toLocaleDateString()}</span>}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={item.isManifested}
                                onCheckedChange={() => toggleManifested(item.id)}
                                className="border-gray-600"
                              />
                              <span className="text-sm text-gray-300">Mark as Manifested</span>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Eye className="h-20 w-20 text-purple-400 mx-auto mb-8 animate-float" />
                <h3 className="text-3xl font-bold text-white mb-4">No Visions Yet</h3>
                <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
                  Create your first vision and start your manifestation journey ✨
                </p>
                <Button
                  onClick={() => setActiveTab("create")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Vision
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="tracking" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Progress Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {visionItems.map((item) => {
                      const completion = getCompletionPercentage(item)
                      const categoryInfo = getCategoryInfo(item.category)

                      return (
                        <div key={item.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <categoryInfo.icon className="h-4 w-4 text-purple-400" />
                              <span className="text-white font-medium">{item.title}</span>
                            </div>
                            <span className="text-gray-400">{completion}%</span>
                          </div>
                          <Progress value={completion} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visionItems
                      .filter((item) => item.lastVisualized)
                      .sort((a, b) => (b.lastVisualized?.getTime() || 0) - (a.lastVisualized?.getTime() || 0))
                      .slice(0, 5)
                      .map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                          <Eye className="h-4 w-4 text-purple-400" />
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.title}</p>
                            <p className="text-gray-400 text-sm">
                              Visualized {item.lastVisualized?.toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                            {item.visualizationCount}x
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Manifested Tab */}
          <TabsContent value="manifested" className="mt-8">
            {manifestedCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visionItems
                  .filter((item) => item.isManifested)
                  .map((item) => {
                    const categoryInfo = getCategoryInfo(item.category)

                    return (
                      <Card
                        key={item.id}
                        className="group relative overflow-hidden bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl border-green-700/50 hover:border-green-600/70 transition-all duration-500"
                      >
                        <div className="absolute top-4 right-4">
                          <Trophy className="h-6 w-6 text-yellow-400 animate-bounce" />
                        </div>

                        <div className="relative z-10">
                          {item.imageUrl && (
                            <div className="relative overflow-hidden rounded-t-lg">
                              <img
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.title}
                                className="w-full h-56 object-cover"
                                crossOrigin="anonymous"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent" />
                            </div>
                          )}

                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-white flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <span>{item.title}</span>
                              </CardTitle>
                              <Badge className={`${categoryInfo.color} ${categoryInfo.textColor}`}>
                                <categoryInfo.icon className="h-3 w-3 mr-1" />
                                {categoryInfo.label}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Manifested! 🎉</span>
                              <span>Visualized {item.visualizationCount} times</span>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-8 animate-bounce" />
                <h3 className="text-3xl font-bold text-white mb-4">No Manifestations Yet</h3>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                  Keep visualizing and working on your visions. Your first manifestation is coming! ✨
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
