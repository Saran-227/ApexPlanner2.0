import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json()

    if (!goal) {
      return NextResponse.json({ error: "Learning goal is required" }, { status: 400 })
    }

    const prompt = `Based on the learning goal "${goal}", suggest the best types of study materials and general platforms or approaches to find them. Do NOT provide specific URLs or links, as these can become outdated and AI models do not have real-time web access. Instead, focus on categories of resources and reputable places to search.

For example, if the goal is "Learn Python":
- Online Courses: Coursera, Udemy, edX (search for "Python for Beginners", "Advanced Python")
- Books: "Python Crash Course", "Automate the Boring Stuff with Python" (search on Amazon, O'Reilly)
- Documentation: Official Python Docs
- Practice Platforms: LeetCode, HackerRank, Codecademy

Now, for the goal "${goal}", provide suggestions in a similar format. Be concise and provide practical, actionable advice for finding resources. If the goal is very broad, provide general categories. If it's specific, provide more tailored suggestions.`

    const { text } = await generateText({
      model: cohere("command-r-plus", {
        apiKey: "w0hEVmnrWfVM8JmNmwhG7YCMSDp68uMvMGbAQJkE", // Using the provided Cohere API key
      }),
      prompt,
      maxTokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({ suggestions: text })
  } catch (error) {
    console.error("Suggest materials API error:", error)
    // Provide a robust fallback message that is always helpful
    const fallbackSuggestions = `I'm sorry, I couldn't generate specific suggestions right now. However, for your goal, consider these general approaches:
- **Online Courses**: Look for structured courses on platforms like Coursera, Udemy, edX, or Khan Academy. Search for "[Your Goal] for Beginners" or "Advanced [Your Goal]".
- **Books**: Find highly-rated textbooks or practical guides on Amazon, O'Reilly, or local libraries.
- **Official Documentation**: Many technologies have excellent official documentation or tutorials (e.g., MDN Web Docs for web development, Python's official tutorial).
- **Practice Platforms**: Websites like LeetCode, HackerRank, Codecademy, or freeCodeCamp offer interactive exercises and projects.
- **YouTube Tutorials**: Search for video series from reputable educators or channels.
- **Community Forums**: Join online communities (e.g., Stack Overflow, Reddit communities like r/learnprogramming) for discussions and help.`
    return NextResponse.json(
      {
        error: "Failed to generate material suggestions.",
        suggestions: fallbackSuggestions,
      },
      { status: 500 },
    )
  }
}
