import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"

export async function POST(req: NextRequest) {
  try {
    const { goal, deadline, hoursPerDay, selectedDays, mood } = await req.json()

    if (!goal || !mood) {
      return NextResponse.json({ error: "Goal and mood are required" }, { status: 400 })
    }

    const intensityMap = {
      motivated: "high",
      moderate: "medium",
      low: "light",
    }

    const intensity = intensityMap[mood as keyof typeof intensityMap] || "medium"
    const baseHours = intensity === "high" ? 3 : intensity === "medium" ? 2 : 1

    // Get current date for realistic scheduling
    const startDate = new Date()
    const nextMonday = new Date(startDate)
    nextMonday.setDate(startDate.getDate() + ((1 - startDate.getDay() + 7) % 7))

    const prompt = `Create a detailed 8-week study plan for: "${goal}"

Student details:
- Motivation level: ${mood}
- Task intensity: ${intensity}
- Hours per day: ${hoursPerDay || baseHours}
- Preferred days: ${selectedDays.join(", ") || "Monday, Wednesday, Friday"}
- Deadline: ${deadline || "Flexible"}
- Start date: ${nextMonday.toISOString().split("T")[0]}

Create a comprehensive learning plan with specific daily tasks. For each week, provide:
1. Week title and main focus
2. Topics to cover
3. Specific daily tasks with realistic dates
4. Appropriate difficulty based on motivation level

Adjust task complexity based on intensity:
- High intensity: 3-4 tasks per day, advanced topics, longer sessions
- Medium intensity: 2-3 tasks per day, balanced approach, moderate sessions  
- Light intensity: 1-2 tasks per day, gentle learning curve, shorter sessions

Return ONLY a valid JSON object with this exact structure:
{
  "goal": "${goal}",
  "mood": "${mood}",
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "topics": ["topic1", "topic2", "topic3"],
      "duration": "X hours",
      "days": ["Monday", "Wednesday", "Friday"],
      "dailyTasks": [
        {
          "date": "2024-01-15",
          "tasks": ["specific task 1", "specific task 2"],
          "duration": "${baseHours} hours",
          "intensity": "${intensity}"
        }
      ]
    }
  ]
}

Make the plan realistic, achievable, and progressive. Include specific dates starting from the next Monday.`

    const { text } = await generateText({
      model: cohere("command-r-plus", {
        apiKey: "w0hEVmnrWfVM8JmNmwhG7YCMSDp68uMvMGbAQJkE",
      }),
      prompt,
      maxTokens: 3000,
      temperature: 0.7,
    })

    // Try to parse the AI response as JSON
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const planData = JSON.parse(jsonMatch[0])
        return NextResponse.json(planData)
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      // Return a structured fallback
      const fallbackPlan = generateFallbackPlan(goal, mood, intensity, baseHours, nextMonday)
      return NextResponse.json(fallbackPlan)
    }
  } catch (error) {
    console.error("Generate plan API error:", error)

    // Return fallback plan on any error
    const startDate = new Date()
    const nextMonday = new Date(startDate)
    nextMonday.setDate(startDate.getDate() + ((1 - startDate.getDay() + 7) % 7))

    const fallbackPlan = generateFallbackPlan("Learn Programming", "moderate", "medium", 2, nextMonday)
    return NextResponse.json(fallbackPlan)
  }
}

function generateFallbackPlan(goal: string, mood: string, intensity: string, baseHours: number, startDate: Date) {
  const addDays = (date: Date, days: number) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result.toISOString().split("T")[0]
  }

  return {
    goal,
    mood,
    weeks: [
      {
        week: 1,
        title: "Foundation & Setup",
        topics: ["Environment Setup", "Basic Concepts", "Getting Started"],
        duration: `${baseHours * 3} hours`,
        days: ["Monday", "Wednesday", "Friday"],
        dailyTasks: [
          {
            date: addDays(startDate, 0),
            tasks:
              intensity === "high"
                ? [
                    "Complete development environment setup",
                    "Study fundamental concepts",
                    "Practice basic syntax",
                    "Complete 5 exercises",
                  ]
                : intensity === "medium"
                  ? ["Complete development environment setup", "Study fundamental concepts", "Practice basic syntax"]
                  : ["Complete development environment setup", "Study basic concepts"],
            duration: `${baseHours} hours`,
            intensity,
          },
          {
            date: addDays(startDate, 2),
            tasks:
              intensity === "high"
                ? [
                    "Deep dive into data types",
                    "Practice variables and constants",
                    "Complete tutorial exercises",
                    "Build first mini project",
                  ]
                : intensity === "medium"
                  ? ["Learn data types", "Practice variables", "Complete tutorial"]
                  : ["Learn data types", "Practice variables"],
            duration: `${baseHours} hours`,
            intensity,
          },
          {
            date: addDays(startDate, 4),
            tasks:
              intensity === "high"
                ? [
                    "Master control structures",
                    "Practice loops and conditions",
                    "Solve complex problems",
                    "Code review session",
                  ]
                : intensity === "medium"
                  ? ["Learn control structures", "Practice loops", "Solve problems"]
                  : ["Learn control structures", "Basic loop practice"],
            duration: `${baseHours} hours`,
            intensity,
          },
        ],
      },
      {
        week: 2,
        title: "Building Core Skills",
        topics: ["Functions", "Data Structures", "Problem Solving"],
        duration: `${baseHours * 4} hours`,
        days: ["Monday", "Wednesday", "Friday", "Saturday"],
        dailyTasks: [
          {
            date: addDays(startDate, 7),
            tasks:
              intensity === "high"
                ? [
                    "Master function concepts",
                    "Practice parameter passing",
                    "Learn return values",
                    "Build function library",
                  ]
                : intensity === "medium"
                  ? ["Learn functions", "Practice parameters", "Understand return values"]
                  : ["Basic function concepts", "Simple examples"],
            duration: `${baseHours} hours`,
            intensity,
          },
          {
            date: addDays(startDate, 9),
            tasks:
              intensity === "high"
                ? ["Explore data structures", "Practice arrays and lists", "Learn algorithms", "Implement sorting"]
                : intensity === "medium"
                  ? ["Learn data structures", "Practice arrays", "Basic algorithms"]
                  : ["Introduction to arrays", "Simple data handling"],
            duration: `${baseHours} hours`,
            intensity,
          },
          {
            date: addDays(startDate, 11),
            tasks:
              intensity === "high"
                ? ["Advanced problem solving", "Complex algorithms", "Optimization techniques", "Performance analysis"]
                : intensity === "medium"
                  ? ["Problem solving practice", "Algorithm basics", "Code optimization"]
                  : ["Simple problem solving", "Basic algorithms"],
            duration: `${baseHours} hours`,
            intensity,
          },
          {
            date: addDays(startDate, 12),
            tasks:
              intensity === "high"
                ? ["Project development", "Code integration", "Testing and debugging", "Documentation"]
                : intensity === "medium"
                  ? ["Small project work", "Testing basics", "Code review"]
                  : ["Simple project", "Basic testing"],
            duration: `${baseHours} hours`,
            intensity,
          },
        ],
      },
    ],
  }
}
