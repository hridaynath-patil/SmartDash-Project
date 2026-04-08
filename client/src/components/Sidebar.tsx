import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, CheckSquare, StickyNote, CloudRain, Film, User, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed?: boolean;
}

const Sidebar = ({ isOpen, setIsOpen, isCollapsed }: SidebarProps) => {
  const { user } = useContext(AuthContext);
  if (!user) return null;

  const links = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Notes', path: '/notes', icon: <StickyNote size={20} /> },
    { name: 'Weather', path: '/weather', icon: <CloudRain size={20} /> },
    { name: 'Movies', path: '/movies', icon: <Film size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>}
      <div className={`sidebar ${isOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" style={{ padding: isCollapsed ? '1rem' : '1.5rem', marginBottom: '1rem', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          {!isCollapsed && <h2 style={{ margin: 0 }}>SmartDash</h2>}
          {isCollapsed && <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>S</div>}
          <button className="icon-btn mobile-close-btn" onClick={() => setIsOpen(false)} style={{ position: 'absolute', right: '1rem' }}>
            <X size={20} />
          </button>
        </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            to={link.path} 
            key={link.name} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? link.name : ''}
          >
            {link.icon}
            {!isCollapsed && <span>{link.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
    </>
  );
};

export default Sidebar;
