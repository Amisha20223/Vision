"use server"

async function query(data: { sync_mode: boolean; prompt: string }) {
  const response = await fetch("https://router.huggingface.co/fal-ai/fal-ai/qwen-image", {
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.blob()
  return result
}

export async function generateVisionImageHF(prompt: string): Promise<string> {
  try {
    // Enhanced prompt for better vision board images
    const enhancedPrompt = `Beautiful vision board style image: ${prompt}. High quality, inspirational, dreamy, cinematic lighting, vibrant colors, professional photography, 4K, motivational, success visualization, manifestation energy, ethereal glow`

    console.log("Generating image with prompt:", enhancedPrompt)

    // Call the Hugging Face API
    const imageBlob = await query({
      sync_mode: true,
      prompt: enhancedPrompt,
    })

    // Convert blob to base64 data URL
    const imageBuffer = await imageBlob.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")
    const dataUrl = `data:image/jpeg;base64,${base64Image}`

    console.log("Image generated successfully")
    return dataUrl
  } catch (error) {
    console.error("Error generating image with Hugging Face:", error)

    // Fallback to placeholder
    const width = 512
    const height = 512
    const encodedPrompt = encodeURIComponent(prompt.slice(0, 30))
    return `/placeholder.svg?height=${height}&width=${width}&text=${encodedPrompt}`
  }
}
