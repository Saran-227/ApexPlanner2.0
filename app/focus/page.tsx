"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FocusTimer } from "@/components/focus-timer"
import { Clock } from "lucide-react"

export default function FocusPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gradient-text">
          <Clock className="mr-3 h-8 w-8 text-primary" />
          Focus Zone
        </h1>
        <p className="text-lg text-muted-foreground">
          Set your study timer, use the Pomodoro Technique, and stay focused on your goals.
        </p>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Study Timer
          </CardTitle>
          <CardDescription>Configure your focus sessions for optimal productivity.</CardDescription>
        </CardHeader>
        <CardContent>
          <FocusTimer />
        </CardContent>
      </Card>
    </div>
  )
}
