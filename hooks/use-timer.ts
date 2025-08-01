"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface UseTimerOptions {
  onComplete?: () => void
}

const POMODORO_STUDY_DURATION = 25 * 60 * 1000 // 25 minutes
const POMODORO_SHORT_BREAK_DURATION = 5 * 60 * 1000 // 5 minutes
const POMODORO_LONG_BREAK_DURATION = 15 * 60 * 1000 // 15 minutes
const POMODORO_CYCLES_BEFORE_LONG_BREAK = 4

export function useTimer(options?: UseTimerOptions) {
  const { toast } = useToast()
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [initialDuration, setInitialDuration] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [pomodoroPhase, setPomodoroPhase] = useState<"idle" | "study" | "break" | "long-break">("idle")
  const [pomodoroCycle, setPomodoroCycle] = useState(0)
  const totalPomodoroCycles = POMODORO_CYCLES_BEFORE_LONG_BREAK

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef(0)
  const pauseTimeRef = useRef(0)

  const startTimer = useCallback(
    (duration: number) => {
      if (isRunning && timeRemaining > 0) return // Already running
      if (intervalRef.current) clearInterval(intervalRef.current)

      if (timeRemaining === 0 || isPaused) {
        // Starting fresh or resuming
        startTimeRef.current = Date.now() - (initialDuration - timeRemaining)
      } else {
        // Starting a new timer
        setInitialDuration(duration)
        startTimeRef.current = Date.now()
      }

      setIsRunning(true)
      setIsPaused(false)
      setPomodoroPhase("idle") // Ensure idle for custom timer

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const remaining = duration - elapsed
        setTimeRemaining(Math.max(0, remaining))

        if (remaining <= 0) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          setTimeRemaining(0)
          options?.onComplete?.()
          toast({
            title: "Time's Up! 🎉",
            description: "Your custom timer has finished.",
          })
        }
      }, 100) // Update every 100ms for smoother countdown
    },
    [isRunning, timeRemaining, initialDuration, isPaused, options, toast],
  )

  const pauseTimer = useCallback(() => {
    if (!isRunning) return
    clearInterval(intervalRef.current!)
    setIsRunning(false)
    setIsPaused(true)
    pauseTimeRef.current = Date.now()
  }, [isRunning])

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimeRemaining(0)
    setInitialDuration(0)
    setIsRunning(false)
    setIsPaused(false)
    setPomodoroPhase("idle")
    setPomodoroCycle(0)
    startTimeRef.current = 0
    pauseTimeRef.current = 0
  }, [])

  const startPomodoroPhase = useCallback(
    (phase: "study" | "break" | "long-break") => {
      let duration = 0
      let toastTitle = ""
      let toastDescription = ""

      if (phase === "study") {
        duration = POMODORO_STUDY_DURATION
        toastTitle = "Focus Time! 📚"
        toastDescription = "Time to concentrate on your studies."
      } else if (phase === "break") {
        duration = POMODORO_SHORT_BREAK_DURATION
        toastTitle = "Short Break! ☕"
        toastDescription = "Take a quick rest before the next session."
      } else if (phase === "long-break") {
        duration = POMODORO_LONG_BREAK_DURATION
        toastTitle = "Long Break! 🧘‍♀️"
        toastDescription = "You've earned a longer rest. Recharge!"
      }

      setInitialDuration(duration)
      setTimeRemaining(duration)
      setIsRunning(true)
      setIsPaused(false)
      setPomodoroPhase(phase)
      startTimeRef.current = Date.now()

      if (intervalRef.current) clearInterval(intervalRef.current)

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const remaining = duration - elapsed
        setTimeRemaining(Math.max(0, remaining))

        if (remaining <= 0) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          setTimeRemaining(0)
          toast({ title: toastTitle, description: toastDescription })
          handlePomodoroPhaseComplete()
        }
      }, 100)
    },
    [toast],
  )

  const handlePomodoroPhaseComplete = useCallback(() => {
    if (pomodoroPhase === "study") {
      const nextCycle = pomodoroCycle + 1
      setPomodoroCycle(nextCycle)
      if (nextCycle % POMODORO_CYCLES_BEFORE_LONG_BREAK === 0) {
        startPomodoroPhase("long-break")
      } else {
        startPomodoroPhase("break")
      }
    } else if (pomodoroPhase === "break" || pomodoroPhase === "long-break") {
      startPomodoroPhase("study")
    }
  }, [pomodoroPhase, pomodoroCycle, startPomodoroPhase])

  const startPomodoro = useCallback(() => {
    if (isRunning && pomodoroPhase !== "idle") return // Pomodoro already running
    setPomodoroCycle(0)
    startPomodoroPhase("study")
  }, [isRunning, pomodoroPhase, startPomodoroPhase])

  const skipPomodoroPhase = useCallback(() => {
    if (pomodoroPhase === "idle") return
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimeRemaining(0) // Force completion
    setIsRunning(false)
    handlePomodoroPhaseComplete()
  }, [pomodoroPhase, handlePomodoroPhaseComplete])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const progress = initialDuration > 0 ? ((initialDuration - timeRemaining) / initialDuration) * 100 : 0

  return {
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
    totalPomodoroCycles: POMODORO_CYCLES_BEFORE_LONG_BREAK,
    progress,
  }
}
