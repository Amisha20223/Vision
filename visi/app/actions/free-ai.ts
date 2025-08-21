"use server"

export async function generateFree(prompt: string): Promise<string> {
  try {
    // Enhanced prompt for better vision board images
    const enhancedPrompt = `Beautiful vision board: ${prompt}, high quality, inspirational, dreamy, cinematic lighting, vibrant colors, professional photography, 4K`

    // Using Pollinations AI (Completely free, no API key needed)
    const encodedPrompt = encodeURIComponent(enhancedPrompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}`

    // Fetch the image to ensure it's generated
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error("Failed to generate image")
    }

    return imageUrl
  } catch (error) {
    console.error("Error generating image:", error)

    // Fallback to placeholder
    const width = 512
    const height = 512
    const encodedPrompt = encodeURIComponent(prompt.slice(0, 30))
    return `/placeholder.svg?height=${height}&width=${width}&text=${encodedPrompt}`
  }
}
