import { useContext } from 'react';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  toggleSidebar?: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout, avatar } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass">
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn mobile-menu-btn" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
          <div className="navbar-search">
            <Search size={20} className="text-muted" />
            <input type="text" placeholder="Search anything..." />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>SmartDash</h2>
        </div>
      )}
      <div className="navbar-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        {user && (
          <button className="icon-btn">
            <Bell size={20} />
          </button>
        )}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="avatar" title={user.name}>
              <img src={avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--border)', background: 'var(--surface)' }} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
