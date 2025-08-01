"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Timer, Coffee, BookOpen, SkipForward } from "lucide-react"
import { useTimer } from "@/hooks/use-timer"
import { formatTime } from "@/lib/utils" // Reusing existing formatTime

export function FocusTimer() {
  const [customMinutes, setCustomMinutes] = React.useState("25")
  const [mode, setMode] = React.useState<"custom" | "pomodoro">("custom")

  const {
    timeRemaining,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    startPomodoro,
    skipPomodoroPhase,
    pomodoroPhase,
    pomodoroCycle,
    totalPomodoroCycles,
    progress,
  } = useTimer()

  const handleCustomStart = () => {
    const minutes = Number.parseInt(customMinutes, 10)
    if (isNaN(minutes) || minutes <= 0) return
    startTimer(minutes * 60 * 1000) // Convert minutes to milliseconds
    setMode("custom")
  }

  const handlePomodoroStart = () => {
    startPomodoro()
    setMode("pomodoro")
  }

  const handleReset = () => {
    resetTimer()
    setCustomMinutes("25") // Reset custom input
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center">
        <div className="text-7xl md:text-8xl font-bold tabular-nums text-primary">{formatTime(timeRemaining)}</div>
      </div>

      <Progress value={progress} className="h-3" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Custom Timer Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-semibold flex items-center">
            <Timer className="mr-2 h-5 w-5" />
            Custom Timer
          </h3>
          <div className="space-y-2">
            <Label htmlFor="custom-minutes">Set Study Time (minutes)</Label>
            <Input
              id="custom-minutes"
              type="number"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              min="1"
              placeholder="e.g., 30"
              disabled={isRunning || isPaused}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCustomStart} disabled={isRunning && mode === "custom"} className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Start Custom
            </Button>
            <Button
              onClick={pauseTimer}
              disabled={!isRunning || mode !== "custom"}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          </div>
        </div>

        {/* Pomodoro Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-semibold flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Pomodoro Technique
          </h3>
          <div className="space-y-2">
            <Label>Current Phase:</Label>
            <div className="flex items-center space-x-2">
              {pomodoroPhase === "study" && <BookOpen className="h-5 w-5 text-primary" />}
              {pomodoroPhase === "break" && <Coffee className="h-5 w-5 text-green-500" />}
              {pomodoroPhase === "long-break" && <Coffee className="h-5 w-5 text-green-500" />}
              <span className="text-lg font-medium capitalize">
                {pomodoroPhase === "idle" ? "Ready" : pomodoroPhase.replace("-", " ")}
              </span>
            </div>
            {mode === "pomodoro" && pomodoroPhase !== "idle" && (
              <p className="text-sm text-muted-foreground">
                Cycle: {pomodoroCycle} / {totalPomodoroCycles}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePomodoroStart} disabled={isRunning && mode === "pomodoro"} className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Start Pomodoro
            </Button>
            <Button
              onClick={skipPomodoroPhase}
              disabled={!isRunning || mode !== "pomodoro" || pomodoroPhase === "idle"}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip Phase
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleReset}
          variant="destructive"
          disabled={!isRunning && timeRemaining === 0 && mode === "custom" && pomodoroPhase === "idle"}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset All
        </Button>
      </div>
    </div>
  )
}
