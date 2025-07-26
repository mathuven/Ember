import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Fallback questions for when API is unavailable
const fallbackQuestions = {
  spice: [
    "Is cereal actually soup?",
    "Pineapple on pizza is actually genius - change my mind",
    "Social media has made us lonelier, not more connected",
    "Tipping culture has gone too far",
    "Books will always be better than their movie adaptations",
    "Hot dogs are sandwiches and I'll die on this hill",
    "Influencers shouldn't be considered real celebrities",
    "We should normalize wearing pajamas in public",
  ],
  chuckle: [
    "Would you rather fight 100 duck-sized horses or 1 horse-sized duck?",
    "If animals could talk, which species would be the rudest?",
    "What's the weirdest thing you've ever Googled at 3 AM?",
    "If you could only communicate through movie quotes, which movie would you choose?",
    "What would be the worst superpower to have?",
    "If your life had a theme song that played every time you entered a room, what would it be?",
    "What's the most useless talent you have?",
    "If you were a ghost, how would you haunt people?",
  ],
  drift: [
    "Do we choose who we become, or does life choose for us?",
    "What's a belief you held strongly that completely changed?",
    "If you could know the absolute truth about one thing, what would it be?",
    "What's the most beautiful thing about being human?",
    "Do you think we're living in the best or worst time in history?",
    "What would you tell your younger self if you could?",
    "Is there a difference between being alone and being lonely?",
    "What does it mean to live a meaningful life?",
  ],
  edge: [
    "Should pineapple be banned from pizza forever?",
    "Is it okay to lie to spare someone's feelings?",
    "Should social media require age verification?",
    "Is cancel culture helping or hurting society?",
    "Should we colonize Mars or fix Earth first?",
    "Is it ethical to eat meat in 2024?",
    "Should billionaires exist?",
    "Is privacy dead in the digital age?",
  ],
  glow: [
    "What compliment still sticks with you years later?",
    "What's the kindest thing a stranger has ever done for you?",
    "What small act of love do you do for yourself regularly?",
    "What's your favorite thing about your best friend?",
    "What's a simple pleasure that never gets old?",
    "What's the best advice you've ever received?",
    "What makes you feel most grateful?",
    "What's your favorite way to show someone you care?",
  ],
  flip: [], // Will be populated from other categories
}

// Populate flip category with random questions from all other categories
fallbackQuestions.flip = [
  ...fallbackQuestions.spice.slice(0, 2),
  ...fallbackQuestions.chuckle.slice(0, 2),
  ...fallbackQuestions.drift.slice(0, 2),
  ...fallbackQuestions.edge.slice(0, 2),
  ...fallbackQuestions.glow.slice(0, 2),
]

export async function POST(request: Request) {
  try {
    const { category } = await request.json()

    // Check if OpenAI API key is available
    const hasApiKey = process.env.OPENAI_API_KEY

    if (!hasApiKey) {
      // Use fallback questions when API key is missing
      const categoryQuestions = fallbackQuestions[category as keyof typeof fallbackQuestions] || fallbackQuestions.flip
      const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)]

      return Response.json({
        question: randomQuestion,
        isAiGenerated: false,
      })
    }

    // Try to use OpenAI API
    const categoryPrompts = {
      spice: `Generate a spicy, controversial question that would spark debate. Think hot takes, unpopular opinions, or polarizing topics. Make it thought-provoking but not offensive. Examples: "Is cereal actually soup?" or "Social media has made us lonelier, not more connected". Return just the question, no quotes.`,

      chuckle: `Generate a funny, ridiculous question that would make people laugh and debate silly things. Think meme-worthy, absurd scenarios, or playful "would you rather" questions. Examples: "Would you rather fight 100 duck-sized horses or 1 horse-sized duck?" or "If animals could talk, which species would be the rudest?". Return just the question, no quotes.`,

      drift: `Generate a deep, philosophical question perfect for late-night conversations. Think existential, introspective, or meaningful topics that make people reflect on life. Examples: "Do we choose who we become, or does life choose for us?" or "What's the most beautiful thing about being human?". Return just the question, no quotes.`,

      edge: `Generate a bold, edgy question that pushes boundaries but stays respectful. Think controversial topics, moral dilemmas, or polarizing debates. Examples: "Should pineapple be banned from pizza forever?" or "Is it okay to lie to spare someone's feelings?". Return just the question, no quotes.`,

      glow: `Generate a wholesome, heartwarming question that brings out positive emotions and affirming thoughts. Think gratitude, kindness, self-love, or beautiful memories. Examples: "What compliment still sticks with you years later?" or "What's the kindest thing a stranger has ever done for you?". Return just the question, no quotes.`,

      flip: `Generate a random question that could fit any mood - funny, deep, controversial, wholesome, or silly. Mix up the vibe and surprise me! Return just the question, no quotes.`,
    }

    const prompt = categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.flip

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 100,
    })

    return Response.json({
      question: text.trim(),
      isAiGenerated: true,
    })
  } catch (error) {
    console.error("Error generating question:", error)

    // Fallback to static questions on any error
    const { category } = await request.json()
    const categoryQuestions = fallbackQuestions[category as keyof typeof fallbackQuestions] || fallbackQuestions.flip
    const randomQuestion = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)]

    return Response.json({
      question: randomQuestion,
      isAiGenerated: false,
    })
  }
}
