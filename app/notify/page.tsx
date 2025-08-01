import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Clock, BookOpen, Target, CheckCircle, AlertCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "reminder",
    title: "SQL Basics Review",
    message: "You'll be reminded to review 'SQL Basics' tomorrow at 10AM.",
    time: "Tomorrow, 10:00 AM",
    priority: "high",
    icon: BookOpen,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "goal",
    title: "Weekly Goal Check",
    message: "Time to review your progress on 'Java Fundamentals' - you're 80% complete!",
    time: "Today, 6:00 PM",
    priority: "medium",
    icon: Target,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "study",
    title: "Study Session",
    message: "Your next Java practice session is scheduled for 2:00 PM today.",
    time: "Today, 2:00 PM",
    priority: "high",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    id: 4,
    type: "achievement",
    title: "Milestone Reached!",
    message: "Congratulations! You've completed Week 2 of your learning plan.",
    time: "2 hours ago",
    priority: "low",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 5,
    type: "warning",
    title: "Study Streak Alert",
    message: "You haven't studied for 2 days. Don't break your streak!",
    time: "1 hour ago",
    priority: "high",
    icon: AlertCircle,
    color: "text-red-600",
  },
]

const upcomingReminders = [
  {
    subject: "Object-Oriented Programming",
    time: "Tomorrow, 9:00 AM",
    type: "Study Session",
  },
  {
    subject: "SQL Joins Practice",
    time: "Friday, 3:00 PM",
    type: "Practice",
  },
  {
    subject: "Week 3 Assessment",
    time: "Sunday, 7:00 PM",
    type: "Assessment",
  },
]

export default function NotifyPage() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
          <Bell className="mr-3 h-8 w-8 text-primary" />
          Notifications
        </h1>
        <p className="text-lg text-muted-foreground">Stay on track with personalized reminders and progress updates.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Notifications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Notifications</h2>
            <Button variant="outline" size="sm">
              Mark All Read
            </Button>
          </div>

          {notifications.map((notification) => {
            const IconComponent = notification.icon
            return (
              <Card key={notification.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full bg-primary/10`}>
                        <IconComponent className={`h-5 w-5 ${notification.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{notification.time}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm">{notification.message}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 py-2">
                  <h4 className="font-medium text-sm">{reminder.subject}</h4>
                  <p className="text-xs text-muted-foreground">{reminder.time}</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {reminder.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Bell className="mr-2 h-4 w-4" />
                Notification Preferences
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Clock className="mr-2 h-4 w-4" />
                Study Schedule
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Target className="mr-2 h-4 w-4" />
                Goal Settings
              </Button>
            </CardContent>
          </Card>

          {/* Study Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Study Sessions</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hours Studied</span>
                <Badge variant="secondary">18h</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Goals Completed</span>
                <Badge variant="secondary">3/5</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
