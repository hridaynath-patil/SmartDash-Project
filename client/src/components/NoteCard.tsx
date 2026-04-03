import { Edit2, Trash2 } from 'lucide-react';

const NoteCard = ({ title, content, date }: { title: string, content: string, date: string }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3>{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="icon-btn"><Edit2 size={16} /></button>
          <button className="icon-btn"><Trash2 size={16} /></button>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
        {content}
      </p>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        {date}
      </div>
    </div>
  );
};

export default NoteCard;
