import Link from "next/link"
import Image from "next/image" // Import Image component
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Calendar, Bell, MessageSquare, Target, Clock, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            {/* Replaced Brain icon and h1 with logo and new text */}
            <div className="flex flex-col items-center justify-center mb-6">
              <Image src="/plannerlogo.png" alt="Apex Planner Logo" width={100} height={100} className="mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                ApexPlanner-AI
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">Smarter Study, Faster Progress</p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your learning journey with AI-powered planning, personalized schedules, and intelligent progress
              tracking.
            </p>
          </div>

          <Link href="/planner">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full">
              Try It Now
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Smarter Learning</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to plan, track, and achieve your learning goals with the power of artificial
              intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Goal Planner */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 card-hover">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">AI Goal Planner</CardTitle>
                <CardDescription className="text-base">
                  Get your long-term goals broken into weekly study plans with intelligent scheduling and progress
                  tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Smart goal decomposition</li>
                  <li>• Weekly milestone planning</li>
                  <li>• Adaptive scheduling</li>
                </ul>
              </CardContent>
            </Card>

            {/* Daily Task Generator */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 card-hover">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Daily Task Generator</CardTitle>
                <CardDescription className="text-base">
                  Automatically build a focused daily schedule optimized for your learning style and available time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personalized daily schedules</li>
                  <li>• Time-optimized task allocation</li>
                  <li>• Focus session planning</li>
                </ul>
              </CardContent>
            </Card>

            {/* Personalized Notifications */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 card-hover">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Notifications</CardTitle>
                <CardDescription className="text-base">
                  Receive intelligent reminders based on your learning patterns and optimal study times.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Pattern-based reminders</li>
                  <li>• Optimal timing suggestions</li>
                  <li>• Progress notifications</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <Card className="p-6 card-hover">
              <div className="flex items-center space-x-4 mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">AI Chat Assistant</h3>
                  <p className="text-muted-foreground">Get instant help and guidance</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Ask questions, get study tips, and receive personalized advice from our intelligent assistant.
              </p>
            </Card>

            <Card className="p-6 card-hover">
              <div className="flex items-center space-x-4 mb-4">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">Progress Tracking</h3>
                  <p className="text-muted-foreground">Monitor your learning journey</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Track your progress, identify patterns, and optimize your study schedule for maximum efficiency.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have accelerated their progress with Apex Planner's AI-powered study system.
          </p>
          <Link href="/planner">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full">
              Start Planning Now
              <Brain className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
