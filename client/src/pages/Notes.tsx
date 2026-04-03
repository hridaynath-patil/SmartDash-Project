import { useState, useContext } from 'react';
import { NoteContext } from '../context/NoteContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit2, Plus, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const { notes, createNote, updateNote, deleteNote } = useContext(NoteContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!user) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Please log in to view your notes</h2>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    );
  }

  const openEditor = (note: any = null) => {
    if (note) {
      setCurrentId(note._id);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setCurrentId(null);
      setTitle('');
      setContent('');
    }
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setContent('');
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    if (currentId) {
      updateNote(currentId, title, content);
    } else {
      createNote(title, content);
    }
    closeEditor();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem' }}>My Notes</h2>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => openEditor()} style={{ display: 'flex', gap: '0.5rem' }}>
            <Plus size={20} /> New Note
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem' }}>{currentId ? 'Edit Note' : 'Create Note'}</h3>
            <button className="icon-btn" onClick={closeEditor}><X size={24} /></button>
          </div>
          <input 
            type="text" 
            placeholder="Note Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', fontWeight: 600, border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)', outline: 'none', marginBottom: '1rem' }}
          />
          <textarea 
            placeholder="Write your note here..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', minHeight: '300px', padding: '1rem', fontSize: '1rem', border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', resize: 'vertical', lineHeight: '1.6' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', gap: '0.5rem' }}>
              <Save size={20} /> Save Note
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {notes.length === 0 ? (
            <p className="text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              You don't have any notes yet. Click 'New Note' to create one!
            </p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, wordBreak: 'break-word', paddingRight: '1rem' }}>{note.title}</h3>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="icon-btn" onClick={() => openEditor(note)}><Edit2 size={16} /></button>
                    <button className="icon-btn" onClick={() => deleteNote(note._id)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', flexGrow: 1, whiteSpace: 'pre-wrap', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}>
                  {note.content}
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
