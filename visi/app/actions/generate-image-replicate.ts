"use server"

export async function generateVisionImageReplicate(prompt: string): Promise<string> {
  try {
    const enhancedPrompt = `Vision board style: ${prompt}, beautiful, inspirational, high quality, cinematic, vibrant colors, professional photography`

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        input: {
          prompt: enhancedPrompt,
          width: 512,
          height: 512,
          num_outputs: 1,
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const prediction = await response.json()

    // Poll for completion
    let result = prediction
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      })
      result = await pollResponse.json()
    }

    if (result.status === "succeeded" && result.output && result.output[0]) {
      return result.output[0]
    }

    throw new Error("Image generation failed")
  } catch (error) {
    console.error("Error generating image:", error)

    // Fallback to placeholder
    const width = 512
    const height = 512
    const encodedPrompt = encodeURIComponent(prompt.slice(0, 30))
    return `/placeholder.svg?height=${height}&width=${width}&text=${encodedPrompt}`
  }
}
