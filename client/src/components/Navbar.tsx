import { useContext, useState } from 'react';
import { Search, Bell, Moon, Sun, Menu, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsDropdownOpen(false);
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
          <div className="dropdown-container">
            <button 
              className="avatar-btn" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            >
              <div className="avatar">
                <img src={avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <ChevronDown size={16} className={`text-muted transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{user.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{user.email}</p>
                </div>
                <button className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}>
                  <UserIcon size={16} /> Profile
                </button>
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
