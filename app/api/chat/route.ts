import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation context
    const conversationHistory =
      history
        ?.slice(-5) // Keep last 5 messages for context
        ?.map((msg: any) => `${msg.role === "user" ? "Human" : "Apex"}: ${msg.content}`)
        ?.join("\n") || ""

    const systemPrompt = `You are Apex, an intelligent AI learning assistant for the Apex Planner app. You help students with:

🎯 Study Planning & Goal Setting
- Creating realistic study schedules
- Breaking down complex learning goals
- Time management strategies
- Motivation and productivity techniques

📚 Learning Strategies
- Effective study methods (active recall, spaced repetition, etc.)
- Different learning styles and approaches
- Memory techniques and retention strategies
- Test preparation and exam strategies

💻 Technical Subjects
- Programming languages (Java, Python, JavaScript, etc.)
- Database concepts and SQL
- Web development
- Computer science fundamentals

🧠 Psychology & Motivation
- Overcoming procrastination
- Building study habits
- Managing stress and anxiety
- Maintaining motivation

Always provide practical, actionable advice with an encouraging tone. Keep responses concise but helpful (2-3 paragraphs max).

Previous conversation:
${conversationHistory}

Current user message: ${message}`

    const { text } = await generateText({
      model: google("gemini-1.5-flash", {
        apiKey: "AIzaSyDdDK4ADE3XDtk1XkU7uiWwzV6tKAOQVvE", // Using the provided Gemini API key
      }),
      prompt: systemPrompt,
      maxTokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Chat API error:", error)

    // Provide a helpful fallback response
    const fallbackResponse = `I'm having trouble connecting right now, but I'm here to help! Here are some quick tips:

📚 **Study Tips**: Break your learning into 25-minute focused sessions with 5-minute breaks (Pomodoro Technique). This helps maintain concentration and prevents burnout.

🎯 **Goal Setting**: Make your goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Instead of "learn programming," try "complete 3 Java tutorials this week."

💪 **Stay Motivated**: Track your progress daily, celebrate small wins, and remember that consistency beats perfection. Every expert was once a beginner!

What specific topic would you like help with? I'll do my best to assist you!`

    return NextResponse.json({ message: fallbackResponse })
  }
}
