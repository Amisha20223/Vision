"use server"

export async function generateVisionImage(prompt: string): Promise<string> {
  try {
    // Enhanced prompt for better vision board images
    const enhancedPrompt = `Beautiful vision board style image: ${prompt}. High quality, inspirational, dreamy, cinematic lighting, vibrant colors, professional photography, 4K, motivational, success visualization, manifestation energy`

    // Using Hugging Face Inference API (Free)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy",
            num_inference_steps: 20,
            guidance_scale: 7.5,
            width: 512,
            height: 512,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const imageBlob = await response.blob()
    const imageBuffer = await imageBlob.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")

    return `data:image/jpeg;base64,${base64Image}`
  } catch (error) {
    console.error("Error generating image:", error)

    // Fallback to placeholder
    const width = 512
    const height = 512
    const encodedPrompt = encodeURIComponent(prompt.slice(0, 30))
    return `/placeholder.svg?height=${height}&width=${width}&text=${encodedPrompt}`
  }
}
