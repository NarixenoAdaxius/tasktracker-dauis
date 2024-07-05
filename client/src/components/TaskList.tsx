import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/tasks', {
        headers: { 'x-auth-token': token },
      });
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/tasks', newTask, {
        headers: { 'x-auth-token': token },
      });
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const task = tasks.find((t) => t._id === id);
      if (task) {
        await axios.put(
          `/api/tasks/${id}`,
          { ...task, completed: !task.completed },
          { headers: { 'x-auth-token': token } }
        );
        fetchTasks();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${id}`, {
        headers: { 'x-auth-token': token },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addTask} className="space-y-2">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task title"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
          Add Task
        </button>
      </form>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task._id} className="flex items-center justify-between p-2 border rounded">
            <span className={task.completed ? 'line-through' : ''}>
              {task.title} - {task.description}
            </span>
            <div>
              <button
                onClick={() => toggleTask(task._id)}
                className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
              >
                Toggle
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;