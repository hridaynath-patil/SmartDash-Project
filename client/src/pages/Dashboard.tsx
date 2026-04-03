import { useContext, useMemo } from 'react';
import { TaskContext } from '../context/TaskContext';
import { NoteContext } from '../context/NoteContext';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, StickyNote, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { tasks } = useContext(TaskContext);
  const { notes } = useContext(NoteContext);
  const { user } = useContext(AuthContext);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const productivityScore = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Mock chart data based on live tasks stat
  const chartData = useMemo(() => {
    return [
      { name: 'Mon', completed: Math.max(0, completedTasks - 5), added: Math.max(0, totalTasks - 3) },
      { name: 'Tue', completed: Math.max(0, completedTasks - 3), added: Math.max(0, totalTasks - 2) },
      { name: 'Wed', completed: Math.max(0, completedTasks - 2), added: Math.max(0, totalTasks - 1) },
      { name: 'Thu', completed: Math.max(0, completedTasks - 1), added: totalTasks },
      { name: 'Fri', completed: Math.max(0, completedTasks - 1), added: totalTasks },
      { name: 'Sat', completed: completedTasks, added: totalTasks },
      { name: 'Sun', completed: completedTasks, added: totalTasks },
    ];
  }, [completedTasks, totalTasks]);

  const recentTasks = [...tasks].reverse().slice(0, 5);

  if (!user) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Welcome to SmartDash</h2>
        <p style={{ marginBottom: '2rem' }}>Please log in to view your personalized dashboard.</p>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, {user?.name || 'User'}!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Here is what's happening today.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%' }}>
            <CheckSquare size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{completedTasks} / {totalTasks}</h3>
            <p className="text-muted">Tasks Completed</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '50%' }}>
            <StickyNote size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{notes.length}</h3>
            <p className="text-muted">Total Notes</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '1rem', borderRadius: '50%' }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{productivityScore}%</h3>
            <p className="text-muted">Productivity Score</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Weekly Activity</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="added" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', background: 'var(--surface)' }}
                  cursor={{ stroke: 'var(--border)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Recent Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentTasks.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                No recent activity.
              </div>
            ) : (
              recentTasks.map((task: any) => (
                <div key={task._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: task.status === 'completed' ? '#10b981' : 'var(--primary)' }}></div>
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontWeight: 500, textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)' }}>{task.title}</p>
                  </div>
                </div>
              ))
            )}
            {tasks.length > 5 && (
              <Link to="/tasks" style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 500, marginTop: '0.5rem', display: 'block' }}>View all tasks</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
