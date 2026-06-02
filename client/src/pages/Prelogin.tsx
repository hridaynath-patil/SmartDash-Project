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
        maxWidth: '650px',
        padding: '3.5rem 2.5rem',
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
          fontSize: '3rem',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, var(--text-main), var(--primary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Smart Dash
        </h1>

        {/* 3-4 Line Product Feature Description */}
        <p style={{
          fontSize: '1.15rem',
          lineHeight: '1.8',
          color: 'var(--text-muted)',
          maxWidth: '540px',
          margin: '0 auto 2.5rem auto',
          fontWeight: 400
        }}>
          Smart Dash is your all-in-one productivity and financial companion. Seamlessly manage your day-to-day workflow with our advanced Task Manager and rich-text Notes editor. Concurrently, take complete control of your finances with Money Dash, featuring interactive income & expense trackers, custom category tags, and smart data filters.
        </p>

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
