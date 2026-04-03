import { Check, Trash2 } from 'lucide-react';

const TaskCard = ({ title, status }: { title: string, status: string }) => {
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="icon-btn" style={{ border: '2px solid var(--border)', padding: '0.2rem' }}>
          <Check size={16} style={{ opacity: status === 'completed' ? 1 : 0 }} />
        </button>
        <span style={{ textDecoration: status === 'completed' ? 'line-through' : 'none', color: status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)', fontSize: '1.05rem' }}>
          {title}
        </span>
      </div>
      <button className="icon-btn text-muted">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskCard;
