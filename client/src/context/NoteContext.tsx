import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';

interface Note {
  _id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface NoteContextType {
  notes: Note[];
  fetchNotes: () => void;
  createNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
}

export const NoteContext = createContext<NoteContextType>({
  notes: [],
  fetchNotes: () => {},
  createNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
});

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { user } = useContext(AuthContext);

  const fetchNotes = async () => {
    if (!user) return;
    try {
      const res = await fetch('https://smartdash-project-backend.onrender.com/api/notes', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) setNotes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createNote = async (title: string, content: string) => {
    if (!user) return;
    try {
      const res = await fetch('https://smartdash-project-backend.onrender.com/api/notes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ title, content })
      });
      const data = await res.json();
      if (res.ok) setNotes([data, ...notes]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    if (!user) return;
    try {
      const res = await fetch(`https://smartdash-project-backend.onrender.com/api/notes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify({ title, content })
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(notes.map(n => n._id === id ? data : n));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`https://smartdash-project-backend.onrender.com/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) setNotes(notes.filter(n => n._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) fetchNotes();
    else setNotes([]);
  }, [user]);

  return (
    <NoteContext.Provider value={{ notes, fetchNotes, createNote, updateNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};
