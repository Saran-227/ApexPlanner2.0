"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, StopCircle, Play, Pause, Trash2, Folder, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceNote {
  id: string
  topic: string
  audioData: string // Base64 encoded audio
  timestamp: string
  duration: number // in seconds
}

const LOCAL_STORAGE_KEY = "apexPlannerVoiceNotes"

export default function VoiceNotesPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  const [currentTopic, setCurrentTopic] = useState("General")
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedNotes) {
      setVoiceNotes(JSON.parse(savedNotes))
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(voiceNotes))
  }, [voiceNotes])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      setRecorder(mediaRecorder)
      setAudioChunks([])

      mediaRecorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data])
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = () => {
          const base64data = reader.result as string
          const duration = Math.round(audioBlob.size / 10000) // Rough estimate, can be improved
          const newNote: VoiceNote = {
            id: Date.now().toString(),
            topic: currentTopic.trim() || "General",
            audioData: base64data,
            timestamp: new Date().toLocaleString(),
            duration,
          }
          setVoiceNotes((prev) => [...prev, newNote])
          toast({
            title: "Voice Note Saved!",
            description: `Note for topic "${newNote.topic}" recorded.`,
          })
        }
        stream.getTracks().forEach((track) => track.stop()) // Stop microphone
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast({
        title: "Recording Started",
        description: "Speak now to record your voice note.",
      })
    } catch (err) {
      console.error("Error accessing microphone:", err)
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record voice notes.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (recorder && isRecording) {
      recorder.stop()
      setIsRecording(false)
      toast({
        title: "Recording Stopped",
        description: "Your voice note is being processed.",
      })
    }
  }

  const playNote = (note: VoiceNote) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = note.audioData
      audioRef.current.play()
      setCurrentPlayingId(note.id)
      audioRef.current.onended = () => setCurrentPlayingId(null)
    } else {
      const audio = new Audio(note.audioData)
      audio.play()
      setCurrentPlayingId(note.id)
      audio.onended = () => setCurrentPlayingId(null)
    }
  }

  const pauseNote = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setCurrentPlayingId(null)
    }
  }

  const deleteNote = (id: string) => {
    setVoiceNotes((prev) => prev.filter((note) => note.id !== id))
    if (currentPlayingId === id && audioRef.current) {
      audioRef.current.pause()
      setCurrentPlayingId(null)
    }
    toast({
      title: "Voice Note Deleted",
      description: "The selected voice note has been removed.",
    })
  }

  const groupedNotes = voiceNotes.reduce(
    (acc, note) => {
      ;(acc[note.topic] = acc[note.topic] || []).push(note)
      return acc
    },
    {} as Record<string, VoiceNote[]>,
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gradient-text">
          <Volume2 className="mr-3 h-8 w-8 text-primary" />
          Voice Notes
        </h1>
        <p className="text-lg text-muted-foreground">
          Record and organize your thoughts, ideas, and study notes by topic.
        </p>
      </div>

      <Card className="card-hover mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="mr-2 h-5 w-5" />
            Record New Voice Note
          </CardTitle>
          <CardDescription>Capture your thoughts instantly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic / Folder</Label>
            <Input
              id="topic"
              placeholder="e.g., Java Concepts, Meeting Notes"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              disabled={isRecording}
            />
          </div>
          <div className="flex gap-4">
            <Button onClick={startRecording} disabled={isRecording} className="flex-1 bg-green-600 hover:bg-green-700">
              <Mic className="mr-2 h-4 w-4" />
              {isRecording ? "Recording..." : "Start Recording"}
            </Button>
            <Button onClick={stopRecording} disabled={!isRecording} className="flex-1 bg-red-600 hover:bg-red-700">
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          </div>
          {isRecording && (
            <p className="text-sm text-muted-foreground text-center animate-pulse">Recording in progress...</p>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Folder className="mr-2 h-5 w-5" />
            Your Voice Notes
          </CardTitle>
          <CardDescription>Organized by topic.</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedNotes).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Volume2 className="h-12 w-12 mx-auto mb-4" />
              <p>No voice notes yet. Start recording one!</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] scrollbar-thin pr-4">
              {Object.entries(groupedNotes).map(([topic, notes]) => (
                <div key={topic} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Folder className="mr-2 h-5 w-5 text-primary" />
                    {topic}
                  </h3>
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/10"
                      >
                        <div className="flex-1 mr-4">
                          <p className="text-sm font-medium">Note from {note.timestamp}</p>
                          <p className="text-xs text-muted-foreground">Duration: {note.duration}s</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {currentPlayingId === note.id ? (
                            <Button variant="outline" size="icon" onClick={pauseNote}>
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="icon" onClick={() => playNote(note)}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="destructive" size="icon" onClick={() => deleteNote(note.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
          <audio ref={audioRef} className="hidden" />
        </CardContent>
      </Card>
      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-4">
        **Note:** Voice notes are stored directly in your browser's local storage. For very long recordings or many
        notes, this might consume significant browser storage.
      </p>
    </div>
  )
}
