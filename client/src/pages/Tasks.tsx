import { useState, useContext, useMemo } from 'react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Check, Trash2, Plus, Search, X as CloseIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ConfirmState {
  open: boolean;
  taskId: string;
  taskTitle: string;
}

const Tasks = () => {
  const { tasks, addTask, deleteTask, toggleTaskStatus } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false, taskId: '', taskTitle: '' });
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Please log in to view your tasks</h2>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    );
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask(newTask);
    setNewTask('');
    showToast('Task added successfully!', 'success');
  };

  const requestDelete = (taskId: string, taskTitle: string) => {
    setConfirm({ open: true, taskId, taskTitle });
  };

  const confirmDelete = () => {
    deleteTask(confirm.taskId);
    showToast('Task deleted.', 'info');
    setConfirm({ open: false, taskId: '', taskTitle: '' });
  };

  const cancelDelete = () => {
    setConfirm({ open: false, taskId: '', taskTitle: '' });
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filter === 'completed') result = tasks.filter(t => t.status === 'completed');
    if (filter === 'pending') result = tasks.filter(t => t.status === 'pending');
    
    if (searchQuery.trim()) {
      result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return result;
  }, [tasks, filter, searchQuery]);

  return (
    <>
      {/* Confirm Delete Dialog */}
      {confirm.open && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h4>Delete Task?</h4>
            <p>Are you sure you want to delete "<strong>{confirm.taskTitle}</strong>"? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Task Manager</h2>
        
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Add a new task..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ flexGrow: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem' }}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!newTask.trim()}
            style={{ display: 'flex', gap: '0.5rem', opacity: !newTask.trim() ? 0.6 : 1, cursor: !newTask.trim() ? 'not-allowed' : 'pointer' }}
          >
            <Plus size={20} /> Add Task
          </button>
        </form>

        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem' }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>All</button>
          <button className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('pending')}>Pending</button>
          <button className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTasks.length === 0 ? (
            <p className="text-muted" style={{ textAlign: 'center', padding: '2rem', fontStyle: 'italic' }}>No tasks found for the current filter.</p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', transition: 'var(--transition)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    className="icon-btn" 
                    onClick={() => toggleTaskStatus(task._id, task.status)}
                    style={{ border: `2px solid ${task.status === 'completed' ? 'var(--primary)' : 'var(--text-muted)'}`, padding: '0.2rem', backgroundColor: task.status === 'completed' ? 'var(--primary)' : 'transparent', color: task.status === 'completed' ? 'white' : 'transparent', borderRadius: '50%' }}
                  >
                    <Check size={14} />
                  </button>
                  <span style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)', fontSize: '1.05rem', fontWeight: 500 }}>
                    {task.title}
                  </span>
                </div>
                <button className="icon-btn" onClick={() => requestDelete(task._id, task.title)} style={{ color: '#ef4444' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Tasks;
