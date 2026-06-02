import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, PiggyBank } from 'lucide-react';

const Prelogin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigation = (targetPath: string) => {
    if (user) {
      navigate(targetPath);
    } else {
      navigate('/login', { state: { from: targetPath } });
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1rem'
    }}>
      {/* Background Decorative Glowing Orbs */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '25%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.15)',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '25%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(192, 132, 252, 0.15)',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* Main Glassmorphic Card Container */}
      <div className="card" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '540px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        background: 'var(--surface)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 1,
        borderRadius: '24px'
      }}>
        {/* App Logo Indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--primary), #818cf8)',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
        }}>
          SD
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, var(--text-main), var(--primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Smart Dash
        </h1>

        {/* 3 Bullet Points Feature Description */}
        <ul style={{
          listStyleType: 'none',
          padding: 0,
          margin: '0 auto 2rem auto',
          maxWidth: '440px',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          color: 'var(--text-muted)'
        }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem', marginTop: '0.1rem', flexShrink: 0 }}>🎯</span>
            <span><strong>Task Manager:</strong> Plan, organize, and prioritize your daily workflow.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem', marginTop: '0.1rem', flexShrink: 0 }}>📝</span>
            <span><strong>Rich Notes:</strong> Capture ideas and plans with a rich-text editor.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.2rem', marginTop: '0.1rem', flexShrink: 0 }}>💰</span>
            <span><strong>Money Dash:</strong> Track transactions and budgets with custom categories and filters.</span>
          </li>
        </ul>

        {/* Navigation Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="btn btn-primary"
            style={{
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              borderRadius: '14px',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.25)',
              transition: 'var(--transition)',
              cursor: 'pointer'
            }}
          >
            <LayoutDashboard size={20} />
            Task Manager
          </button>

          <button
            onClick={() => handleNavigation('/money-dash')}
            className="btn btn-outline"
            style={{
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-main)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
              transition: 'var(--transition)',
              cursor: 'pointer'
            }}
          >
            <PiggyBank size={20} style={{ color: 'var(--primary)' }} />
            Money Dash
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prelogin;
