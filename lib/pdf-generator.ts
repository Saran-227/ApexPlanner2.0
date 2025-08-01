import jsPDF from "jspdf"
import "jspdf-autotable"

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
    }>
  }>
}

export const generatePDF = (studyPlan: StudyPlan) => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text(`Study Plan for: ${studyPlan.goal}`, 10, 10)

  doc.setFontSize(12)
  doc.text(`Mood: ${studyPlan.mood}`, 10, 20)

  let currentY = 30

  studyPlan.weeks.forEach((week, weekIndex) => {
    doc.setFontSize(16)
    doc.text(`Week ${week.week}: ${week.title}`, 10, currentY)
    currentY += 10

    doc.setFontSize(12)
    doc.text(`Topics: ${week.topics.join(", ")}`, 10, currentY)
    currentY += 10

    doc.text(`Duration: ${week.duration}`, 10, currentY)
    currentY += 10

    doc.text(`Days: ${week.days.join(", ")}`, 10, currentY)
    currentY += 10

    // Daily tasks table
    const taskData = week.dailyTasks.map((task) => [task.date, task.tasks.join(", "), task.duration, task.intensity])
    ;(doc as any).autoTable({
      head: [["Date", "Tasks", "Duration", "Intensity"]],
      body: taskData,
      startY: currentY,
      margin: { horizontal: 10 },
    })

    currentY = (doc as any).autoTable.previous.finalY + 10
  })

  doc.save(`study-plan-${studyPlan.goal.replace(/\s+/g, "-").toLowerCase()}.pdf`)
}
