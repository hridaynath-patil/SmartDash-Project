import { useState, useContext, useRef, useCallback } from 'react';
import { NoteContext } from '../context/NoteContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trash2, Edit2, Plus, X, Save, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConfirmState {
  open: boolean;
  noteId: string;
  noteTitle: string;
}

const Notes = () => {
  const { notes, createNote, updateNote, deleteNote } = useContext(NoteContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false, noteId: '', noteTitle: '' });
  const editorRef = useRef<HTMLDivElement>(null);

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
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = note.content || '';
        }
      }, 0);
    } else {
      setCurrentId(null);
      setTitle('');
      setTimeout(() => {
        if (editorRef.current) editorRef.current.innerHTML = '';
      }, 0);
    }
    setTitleError('');
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setTitleError('');
    if (editorRef.current) editorRef.current.innerHTML = '';
  };

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || '';
    const trimmedTitle = title.trim();

    if (!trimmedTitle || !content.trim()) {
      showToast('Title and content are required.', 'warning');
      return;
    }

    // Unique title validation
    const duplicate = notes.find(
      (n) => n.title.trim().toLowerCase() === trimmedTitle.toLowerCase() && n._id !== currentId
    );
    if (duplicate) {
      setTitleError(`A note with the title "${trimmedTitle}" already exists. Please use a different title.`);
      return;
    }
    setTitleError('');

    if (currentId) {
      updateNote(currentId, trimmedTitle, content);
      showToast('Note updated successfully!', 'success');
    } else {
      createNote(trimmedTitle, content);
      showToast('Note saved successfully!', 'success');
    }
    closeEditor();
  };

  const execFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const requestDelete = (noteId: string, noteTitle: string) => {
    setConfirm({ open: true, noteId, noteTitle });
  };

  const confirmDelete = () => {
    deleteNote(confirm.noteId);
    showToast('Note deleted.', 'info');
    setConfirm({ open: false, noteId: '', noteTitle: '' });
  };

  const cancelDelete = () => {
    setConfirm({ open: false, noteId: '', noteTitle: '' });
  };

  return (
    <>
      {/* Confirm Delete Dialog */}
      {confirm.open && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h4>Delete Note?</h4>
            <p>Are you sure you want to delete "<strong>{confirm.noteTitle}</strong>"? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

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
          <div className="card" style={{ maxWidth: '860px', margin: '0 auto', padding: 0, overflow: 'hidden', animation: 'fadeIn 0.3s' }}>
            {/* Editor Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem' }}>{currentId ? 'Edit Note' : 'New Note'}</h3>
              <button className="icon-btn" onClick={closeEditor}><X size={22} /></button>
            </div>

            {/* Title Input */}
            <div style={{ padding: '1rem 1.5rem 0' }}>
              <input 
                type="text" 
                placeholder="Note title…" 
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
                style={{ width: '100%', padding: '0.75rem 0', fontSize: '1.3rem', fontWeight: 700, border: 'none', borderBottom: `1px solid ${titleError ? '#ef4444' : 'var(--border)'}`, background: 'transparent', color: 'var(--text-main)', outline: 'none' }}
              />
              {titleError && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.4rem' }}>{titleError}</p>
              )}
            </div>

            {/* Rich Text Toolbar */}
            <div className="rte-toolbar" style={{ padding: '0.5rem 1rem' }}>
              <button type="button" className="rte-btn" title="Bold" onMouseDown={(e) => { e.preventDefault(); execFormat('bold'); }}>
                <Bold size={14} />
              </button>
              <button type="button" className="rte-btn" title="Italic" onMouseDown={(e) => { e.preventDefault(); execFormat('italic'); }}>
                <Italic size={14} />
              </button>
              <button type="button" className="rte-btn" title="Underline" onMouseDown={(e) => { e.preventDefault(); execFormat('underline'); }}>
                <Underline size={14} />
              </button>
              <div style={{ width: '1px', background: 'var(--border)', margin: '0 0.25rem' }} />
              <button type="button" className="rte-btn" title="Bullet List" onMouseDown={(e) => { e.preventDefault(); execFormat('insertUnorderedList'); }}>
                <List size={14} />
              </button>
              <button type="button" className="rte-btn" title="Numbered List" onMouseDown={(e) => { e.preventDefault(); execFormat('insertOrderedList'); }}>
                <ListOrdered size={14} />
              </button>
              <div style={{ width: '1px', background: 'var(--border)', margin: '0 0.25rem' }} />
              <button type="button" className="rte-btn" title="Heading" style={{ fontVariant: 'small-caps', fontSize: '0.8rem', letterSpacing: '0.03em' }} onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'h3'); }}>
                H3
              </button>
              <button type="button" className="rte-btn" title="Normal text" style={{ fontSize: '0.8rem' }} onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'p'); }}>
                ¶
              </button>
            </div>

            {/* Editor Area */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="rte-editor"
              data-placeholder="Write your note here…"
              style={{ minHeight: '280px', maxHeight: '480px', padding: '1rem 1.5rem', overflow: 'auto' }}
            />

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', gap: '0.75rem' }}>
              <button className="btn btn-ghost" onClick={closeEditor}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', gap: '0.5rem' }}>
                <Save size={18} /> Save Note
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
                <div key={note._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'default' }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, wordBreak: 'break-word', paddingRight: '0.5rem', lineHeight: 1.3 }}>{note.title}</h3>
                    <div style={{ display: 'flex', gap: '0.1rem', flexShrink: 0 }}>
                      <button className="icon-btn" onClick={() => openEditor(note)} title="Edit note"><Edit2 size={15} /></button>
                      <button className="icon-btn" onClick={() => requestDelete(note._id, note.title)} style={{ color: '#ef4444' }} title="Delete note"><Trash2 size={15} /></button>
                    </div>
                  </div>

                  {/* Card Content Preview — renders HTML from rich text */}
                  <div
                    className="text-muted"
                    style={{ flexGrow: 1, fontSize: '0.9rem', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', marginBottom: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />

                  {/* Card Footer */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => openEditor(note)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Notes;
