import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios'

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get('/api/tasks', {
        headers: { 'x-auth-token': token },
      })
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/tasks', newTask, {
        headers: { 'x-auth-token': token },
      })
      setNewTask({ title: '', description: '' })
      fetchTasks()
      toast({
        title: "Task Added",
        description: "Your new task has been successfully added.",
      })
    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const completeTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/tasks/${id}`, { completed: true }, {
        headers: { 'x-auth-token': token },
      })
      fetchTasks()
      toast({
        title: "Task Completed",
        description: "The task has been marked as completed.",
      })
    } catch (error) {
      console.error('Error completing task:', error)
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/users/logout', {}, {
        headers: { 'x-auth-token': token },
      })
      localStorage.removeItem('token')
      router.push('/')
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error('Error logging out:', error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Tracker</h1>
          <Button onClick={logout}>Log Out</Button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={addTask} className="mb-8">
          <div className="flex space-x-4">
            <Input 
              type="text" 
              placeholder="Task title" 
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required 
            />
            <Input 
              type="text" 
              placeholder="Task description" 
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <Button type="submit">Add Task</Button>
          </div>
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task._id} className={task.completed ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <h3 className={`font-bold ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
                <p className={task.completed ? 'line-through' : ''}>{task.description}</p>
                {!task.completed && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="mt-4">Complete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will mark the task as completed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => completeTask(task._id)}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}