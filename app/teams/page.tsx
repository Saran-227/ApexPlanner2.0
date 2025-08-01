"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Users, Plus, LogIn, Share2, MessageSquare, CalendarCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TeamsPage() {
  const [roomCode, setRoomCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null)
  const { toast } = useToast()

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setGeneratedCode(code)
    toast({
      title: "Room Code Generated!",
      description: "Share this code with your teammates.",
    })
  }

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      setJoinedRoom(roomCode.trim())
      toast({
        title: "Joined Room!",
        description: `You have joined room: ${roomCode.trim()}`,
      })
      setRoomCode("")
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a room code to join.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard!",
      description: "Room code copied successfully.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gradient-text">
          <Users className="mr-3 h-8 w-8 text-primary" />
          Team Planning (Collab Mode)
        </h1>
        <p className="text-lg text-muted-foreground">
          Create shared goals, collaborate on tasks, and study together with friends or teammates.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Create Room */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Create a Study Room
            </CardTitle>
            <CardDescription>Generate a unique code to invite your team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={generateRoomCode} className="w-full">
              Generate Room Code
            </Button>
            {generatedCode && (
              <div className="flex items-center space-x-2">
                <Input value={generatedCode} readOnly className="font-mono text-lg" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedCode)}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Share this code with your teammates. They can use it to join your collaborative study space.
            </p>
          </CardContent>
        </Card>

        {/* Join Room */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LogIn className="mr-2 h-5 w-5" />
              Join a Study Room
            </CardTitle>
            <CardDescription>Enter a room code to join an existing team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-code">Room Code</Label>
              <Input
                id="room-code"
                placeholder="Enter code (e.g., ABC123)"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              />
            </div>
            <Button onClick={handleJoinRoom} className="w-full">
              Join Room
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Collaboration Features Placeholder */}
      {joinedRoom && (
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="mr-2 h-5 w-5" />
              Collaborative Space: {joinedRoom}
            </CardTitle>
            <CardDescription>
              This section would display shared goals, task boards, and real-time updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/10">
              <CalendarCheck className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-medium">Shared Task Board</h4>
                <p className="text-sm text-muted-foreground">See and edit tasks assigned to your team in real-time.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/10">
              <MessageSquare className="h-6 w-6 text-primary" />
              <div>
                <h4 className="font-medium">Group Chat & Updates</h4>
                <p className="text-sm text-muted-foreground">Communicate with your team and receive notifications.</p>
              </div>
            </div>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              **Note:** Full real-time collaboration, user authentication, and persistent data storage for team features
              require a dedicated backend (e.g., Node.js with WebSockets, a database like Supabase/PostgreSQL). This is
              a UI demonstration within the current environment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
