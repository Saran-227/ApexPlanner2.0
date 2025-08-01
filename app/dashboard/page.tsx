"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Trophy,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Zap,
  Star,
  GraduationCap,
  MapPin,
  BookOpen,
  Pencil,
} from "lucide-react"

interface Task {
  id: string
  title: string
  date: string
  completed: boolean
  points: number
  difficulty: "easy" | "medium" | "hard"
}

interface UserStats {
  totalPoints: number
  completedTasks: number
  pendingTasks: number
  weeklyProgress: number
  currentStreak: number
  level: number
}

interface UserProfile {
  name: string
  education: string
  location: string
  joinDate: string
  currentGoal: string
  avatar: string | null
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    education: "Computer Science Student",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    currentGoal: "Master Full-Stack Development",
    avatar: null, // Will be set from localStorage or file upload
  })

  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 1250,
    completedTasks: 23,
    pendingTasks: 8,
    weeklyProgress: 75,
    currentStreak: 5,
    level: 3,
  })

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete Java Variables Tutorial",
      date: "2024-01-15",
      completed: false,
      points: 50,
      difficulty: "easy",
    },
    {
      id: "2",
      title: "Practice SQL Joins",
      date: "2024-01-15",
      completed: true,
      points: 75,
      difficulty: "medium",
    },
    {
      id: "3",
      title: "Build Mini Calculator Project",
      date: "2024-01-16",
      completed: false,
      points: 100,
      difficulty: "hard",
    },
    {
      id: "4",
      title: "Review Object-Oriented Concepts",
      date: "2024-01-16",
      completed: false,
      points: 60,
      difficulty: "medium",
    },
    {
      id: "5",
      title: "Complete Database Design Exercise",
      date: "2024-01-17",
      completed: false,
      points: 80,
      difficulty: "medium",
    },
  ])

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile)

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("apexPlannerUserProfile")
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
      setTempProfile(JSON.parse(savedProfile)) // Initialize tempProfile as well
    }
  }, [])

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("apexPlannerUserProfile", JSON.stringify(userProfile))
  }, [userProfile])

  const completeTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))

    const task = tasks.find((t) => t.id === taskId)
    if (task && !task.completed) {
      setUserStats((prev) => ({
        ...prev,
        totalPoints: prev.totalPoints + task.points,
        completedTasks: prev.completedTasks + 1,
        pendingTasks: prev.pendingTasks - 1,
      }))
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const handleEditClick = () => {
    setTempProfile(userProfile) // Load current profile into temp state
    setIsEditingProfile(true)
  }

  const handleSaveProfile = () => {
    setUserProfile(tempProfile)
    setIsEditingProfile(false)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempProfile((prev) => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasksToday = tasks.filter((task) => task.completed && task.date === "2024-01-15")

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gradient-text">
          <Trophy className="mr-3 h-8 w-8 text-primary" />
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">Track your progress, manage tasks, and earn Apex points!</p>
      </div>

      {/* User Profile Section */}
      <Card className="mb-8 card-hover gradient-border">
        <div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-20 w-20 profile-glow">
                <AvatarImage
                  src={userProfile.avatar || "/placeholder.svg?height=80&width=80&query=user profile avatar"}
                  alt={userProfile.name}
                />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">{userProfile.name}</h2>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 text-muted-foreground">
                  <div className="flex items-center justify-center md:justify-start">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>{userProfile.education}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {userProfile.joinDate}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Target className="h-3 w-3 mr-1" />
                    {userProfile.currentGoal}
                  </Badge>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary points-glow">{userStats.totalPoints}</div>
                <div className="text-sm text-muted-foreground">Apex Points</div>
                <Badge className="mt-2" variant="outline">
                  Level {userStats.level}
                </Badge>
                <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={handleEditClick}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="education" className="text-right">
                Education
              </Label>
              <Input
                id="education"
                value={tempProfile.education}
                onChange={(e) => setTempProfile({ ...tempProfile, education: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={tempProfile.location}
                onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal" className="text-right">
                Current Goal
              </Label>
              <Input
                id="goal"
                value={tempProfile.currentGoal}
                onChange={(e) => setTempProfile({ ...tempProfile, currentGoal: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Profile Picture
              </Label>
              <Input id="avatar" type="file" accept="image/*" onChange={handleImageUpload} className="col-span-3" />
            </div>
            {tempProfile.avatar && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1"></div>
                <Avatar className="h-20 w-20 profile-glow col-span-3">
                  <AvatarImage src={tempProfile.avatar || "/placeholder.svg"} alt="Preview" />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {tempProfile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Apex Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">{userStats.totalPoints}</div>
                <p className="text-xs text-muted-foreground">Level {userStats.level}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{userStats.completedTasks}</div>
                <p className="text-xs text-muted-foreground">Total completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-400">{userStats.pendingTasks}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">{userStats.currentStreak}</div>
                <p className="text-xs text-muted-foreground">Days in a row</p>
              </div>
              <Star className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pending Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Pending Tasks
              </CardTitle>
              <CardDescription>Complete these tasks to earn Apex points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/30 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{task.date}</span>
                      <Badge className={getDifficultyColor(task.difficulty)} variant="secondary">
                        {task.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">+{task.points} pts</div>
                    </div>
                    <Button size="sm" onClick={() => completeTask(task.id)} className="bg-primary hover:bg-primary/90">
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Weekly Progress
              </CardTitle>
              <CardDescription>Your learning progress this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{userStats.weeklyProgress}%</span>
                  </div>
                  <Progress value={userStats.weeklyProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="text-2xl font-bold text-primary">{completedTasksToday.length}</div>
                    <div className="text-sm text-muted-foreground">Tasks Today</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">18h</div>
                    <div className="text-sm text-muted-foreground">Study Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievement */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                Recent Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-yellow-400/20">
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
                <h4 className="font-medium">Week Warrior!</h4>
                <p className="text-sm text-muted-foreground mt-1">Completed 5 days in a row</p>
                <Badge className="mt-2 bg-primary/10 text-primary" variant="secondary">
                  +100 Apex Points
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">This Week</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  5/7 days
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Score</span>
                <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                  87%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Best Subject</span>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
                  Java
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Next Level</span>
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-400">
                  250 pts
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Motivational Quote */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Daily Motivation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-sm italic text-muted-foreground">
                "The expert in anything was once a beginner. Keep pushing forward!"
              </blockquote>
              <p className="text-xs text-muted-foreground mt-2">- Apex AI</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
