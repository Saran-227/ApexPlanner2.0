"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Target, BookOpen, CheckCircle, Download, Smile, Meh, Frown, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { StudyCalendar } from "@/components/study-calendar"

interface StudyPlan {
  goal: string
  mood: string
  weeks: Array<{
    week: number
    title: string
    topics: string[]
    duration: string
    days: string[]
    dailyTasks: Array<{
      date: string
      tasks: string[]
      duration: string
      intensity: string
      completed?: boolean
    }>
  }>
}

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

const moodOptions = [
  {
    id: "motivated",
    label: "Highly Motivated",
    icon: Smile,
    color: "text-green-600",
    intensity: "high",
    description: "Ready for intensive learning sessions",
  },
  {
    id: "moderate",
    label: "Moderately Motivated",
    icon: Meh,
    color: "text-yellow-600",
    intensity: "medium",
    description: "Balanced approach with steady progress",
  },
  {
    id: "low",
    label: "Low Energy",
    icon: Frown,
    color: "text-red-600",
    intensity: "light",
    description: "Gentle learning with shorter sessions",
  },
]

export default function PlannerPage() {
  const [goal, setGoal] = useState("")
  const [deadline, setDeadline] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedMood, setSelectedMood] = useState("")
  const [showPlan, setShowPlan] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null)
  const [suggestedMaterials, setSuggestedMaterials] = useState<string | null>(null)
  const [isSuggestingMaterials, setIsSuggestingMaterials] = useState(false)
  const { toast } = useToast()

  const handleDayToggle = (dayId: string) => {
    setSelectedDays((prev) => (prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]))
  }

  const fetchMaterialSuggestions = async (currentGoal: string) => {
    setIsSuggestingMaterials(true)
    try {
      const response = await fetch("/api/suggest-materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: currentGoal }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch material suggestions")
      }

      const data = await response.json()
      setSuggestedMaterials(data.suggestions)
    } catch (error) {
      console.error("Error fetching material suggestions:", error)
      setSuggestedMaterials(
        "Could not load material suggestions. Please try again later or search manually for resources related to your goal.",
      )
    } finally {
      setIsSuggestingMaterials(false)
    }
  }

  const generatePlan = async () => {
    if (!goal.trim()) {
      toast({
        title: "Goal Required",
        description: "Please enter your learning goal to generate a plan.",
        variant: "destructive",
      })
      return
    }

    if (!selectedMood) {
      toast({
        title: "Mood Required",
        description: "Please select your current motivation level.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setSuggestedMaterials(null) // Clear previous suggestions

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          deadline,
          hoursPerDay,
          selectedDays,
          mood: selectedMood,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate plan")
      }

      const plan = await response.json()
      setGeneratedPlan(plan)
      setShowPlan(true)

      toast({
        title: "Plan Generated!",
        description: "Your personalized learning plan is ready.",
      })

      // Fetch material suggestions after plan is generated
      fetchMaterialSuggestions(goal)
    } catch (error) {
      console.error("Error generating plan:", error)

      // Fallback with sample data based on mood
      const moodConfig = moodOptions.find((m) => m.id === selectedMood)
      const intensity = moodConfig?.intensity || "medium"

      const samplePlan = generateSamplePlan(goal, selectedMood, intensity)
      setGeneratedPlan(samplePlan)
      setShowPlan(true)

      toast({
        title: "Plan Generated!",
        description: "Your personalized learning plan is ready (using sample data).",
      })

      // Fetch material suggestions even on fallback
      fetchMaterialSuggestions(goal)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSamplePlan = (goal: string, mood: string, intensity: string): StudyPlan => {
    const baseHours = intensity === "high" ? 3 : intensity === "medium" ? 2 : 1
    const sessionsPerDay = intensity === "high" ? 2 : 1

    const addDays = (date: Date, days: number) => {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result.toISOString().split("T")[0]
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() + ((1 - startDate.getDay() + 7) % 7)) // Next Monday

    return {
      goal,
      mood,
      weeks: [
        {
          week: 1,
          title: "Fundamentals & Setup",
          topics: ["Environment Setup", "Basic Concepts", "First Examples"],
          duration: `${baseHours * 5} hours`,
          days: ["Monday", "Wednesday", "Friday"],
          dailyTasks: [
            {
              date: addDays(startDate, 0),
              tasks:
                intensity === "high"
                  ? ["Install development environment", "Complete setup tutorial", "Practice basic syntax"]
                  : ["Install development environment", "Basic setup tutorial"],
              duration: `${baseHours} hours`,
              intensity,
            },
            {
              date: addDays(startDate, 2),
              tasks:
                intensity === "high"
                  ? ["Learn data types", "Practice variables", "Complete exercises 1-10"]
                  : ["Learn data types", "Practice variables"],
              duration: `${baseHours} hours`,
              intensity,
            },
            {
              date: addDays(startDate, 4),
              tasks:
                intensity === "high"
                  ? ["Control structures", "Loops practice", "Build mini project"]
                  : ["Control structures", "Basic loops"],
              duration: `${baseHours} hours`,
              intensity,
            },
          ],
        },
        {
          week: 2,
          title: "Core Concepts",
          topics: ["Advanced Topics", "Practical Applications", "Problem Solving"],
          duration: `${baseHours * 6} hours`,
          days: ["Monday", "Wednesday", "Friday", "Saturday"],
          dailyTasks: [
            {
              date: addDays(startDate, 7),
              tasks:
                intensity === "high"
                  ? ["Functions deep dive", "Parameter passing", "Return values", "Practice problems"]
                  : ["Functions basics", "Simple examples"],
              duration: `${baseHours} hours`,
              intensity,
            },
            {
              date: addDays(startDate, 9),
              tasks:
                intensity === "high"
                  ? ["Object-oriented concepts", "Classes and objects", "Inheritance examples"]
                  : ["Basic OOP concepts", "Simple class creation"],
              duration: `${baseHours} hours`,
              intensity,
            },
            {
              date: addDays(startDate, 11),
              tasks:
                intensity === "high"
                  ? ["Error handling", "Debugging techniques", "Best practices"]
                  : ["Basic error handling", "Simple debugging"],
              duration: `${baseHours} hours`,
              intensity,
            },
            {
              date: addDays(startDate, 12),
              tasks:
                intensity === "high"
                  ? ["Project work", "Code review", "Optimization techniques"]
                  : ["Small project", "Code review"],
              duration: `${baseHours} hours`,
              intensity,
            },
          ],
        },
      ],
    }
  }

  const downloadPlanAsText = () => {
    if (generatedPlan) {
      const planText = `
APEX PLANNER - STUDY SCHEDULE
=============================

Goal: ${generatedPlan.goal}
Motivation Level: ${generatedPlan.mood}

${generatedPlan.weeks
  .map(
    (week) => `
WEEK ${week.week}: ${week.title}
Duration: ${week.duration}
Topics: ${week.topics.join(", ")}
Study Days: ${week.days.join(", ")}

Daily Tasks:
${week.dailyTasks
  .map(
    (task) => `
Date: ${task.date}
Duration: ${task.duration}
Intensity: ${task.intensity}
Tasks:
${task.tasks.map((t) => `- ${t}`).join("\n")}
`,
  )
  .join("\n")}
`,
  )
  .join("\n")}

Generated by Apex Planner
    `.trim()

      const blob = new Blob([planText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `apex-study-plan-${generatedPlan.goal.replace(/\s+/g, "-").toLowerCase()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Plan Downloaded!",
        description: "Your study plan has been downloaded as a text file.",
      })
    }
  }

  const selectedMoodOption = moodOptions.find((m) => m.id === selectedMood)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gradient-text">
          <Target className="mr-3 h-8 w-8 text-primary" />
          AI Learning Planner
        </h1>
        <p className="text-lg text-muted-foreground">
          Let AI create a personalized study plan tailored to your goals, schedule, and motivation level.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Plan Configuration
            </CardTitle>
            <CardDescription>Tell us about your learning goals and current state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal">What is your learning goal? *</Label>
              <Textarea
                id="goal"
                placeholder="e.g., Learn Java and SQL in 2 months"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Mood Selection */}
            <div className="space-y-3">
              <Label>How motivated are you feeling today? *</Label>
              <div className="grid gap-3">
                {moodOptions.map((mood) => {
                  const IconComponent = mood.icon
                  return (
                    <div
                      key={mood.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMood === mood.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedMood(mood.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-6 w-6 ${mood.color}`} />
                        <div className="flex-1">
                          <h4 className="font-medium">{mood.label}</h4>
                          <p className="text-sm text-muted-foreground">{mood.description}</p>
                        </div>
                        <Badge variant={selectedMood === mood.id ? "default" : "secondary"}>
                          {mood.intensity} intensity
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (optional)</Label>
                <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Hours per day</Label>
                <Select value={hoursPerDay} onValueChange={setHoursPerDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="5">5+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Preferred study days</Label>
              <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={selectedDays.includes(day.id)}
                      onCheckedChange={() => handleDayToggle(day.id)}
                    />
                    <Label htmlFor={day.id} className="text-sm font-normal">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={generatePlan} className="w-full" size="lg" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Generate Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Plan & Suggestions */}
        <div className="space-y-6">
          {showPlan && generatedPlan ? (
            <>
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Plan Generated Successfully!
                      </CardTitle>
                      <CardDescription>
                        Goal: {generatedPlan.goal}
                        {selectedMoodOption && (
                          <Badge className="ml-2" variant="secondary">
                            {selectedMoodOption.label}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    <Button onClick={downloadPlanAsText} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Plan
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
                {generatedPlan.weeks.map((week) => (
                  <Card key={week.week} className="border-l-4 border-l-primary card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Week {week.week}: {week.title}
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {week.duration}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Topics to Cover:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {week.topics.map((topic, index) => (
                              <li key={index}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Study Days:</h4>
                          <div className="flex flex-wrap gap-2">
                            {week.days.map((day) => (
                              <span key={day} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Material Suggestions */}
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                    AI Study Material Suggestions
                  </CardTitle>
                  <CardDescription>
                    Based on your goal, here are some types of resources and where to find them.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSuggestingMaterials ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2" />
                      <p className="text-muted-foreground">Generating suggestions...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-wrap text-muted-foreground">{suggestedMaterials}</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-4">
                        **Disclaimer:** AI models do not have real-time web access. These are general suggestions for
                        resource types and platforms. Always verify information and links independently.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-[400px] flex items-center justify-center card-hover">
              <CardContent className="text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Your Plan Will Appear Here</h3>
                <p className="text-muted-foreground">
                  Fill out the form and click "Generate Plan" to see your personalized learning schedule.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Calendar View */}
      {showPlan && generatedPlan && (
        <div className="mt-12">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Study Calendar
              </CardTitle>
              <CardDescription>Click on any date to see your scheduled tasks and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyCalendar studyPlan={generatedPlan} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
