import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';

interface Task {
  _id: string;
  title: string;
  status: string;
}

interface TaskContextType {
  tasks: Task[];
  fetchTasks: () => void;
  addTask: (title: string) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string, status: string) => void;
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  fetchTasks: () => {},
  addTask: () => {},
  deleteTask: () => {},
  toggleTaskStatus: () => {},
});

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const res = await fetch('https://smartdash-project-backend.onrender.com/api/tasks', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (title: string) => {
    if (!user) return;
    try {
      const res = await fetch('https://smartdash-project-backend.onrender.com/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ title })
      });
      const data = await res.json();
      if (res.ok) setTasks([...tasks, data]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`https://smartdash-project-backend.onrender.com/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    if (!user) return;
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch(`https://smartdash-project-backend.onrender.com/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.map(t => t._id === id ? data : t));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
    else setTasks([]);
  }, [user]);

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, addTask, deleteTask, toggleTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};
