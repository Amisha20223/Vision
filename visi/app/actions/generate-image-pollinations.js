"use server"

export async function generateVisionImagePollinations(prompt: string): Promise<string> {
  try {
   
    const enhancedPrompt = `Beautiful vision board: ${prompt}, high quality, inspirational, dreamy, cinematic lighting, vibrant colors, professional photography, 4K`


    const encodedPrompt = encodeURIComponent(enhancedPrompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}`

    
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error("Failed to generate image")
    }

    return imageUrl
  } catch (error) {
    console.error("Error generating image:", error)

    const width = 512
    const height = 512
    const encodedPrompt = encodeURIComponent(prompt.slice(0, 30))
    return `/placeholder.svg?height=${height}&width=${width}&text=${encodedPrompt}`
  }
}
