import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, CheckSquare, StickyNote, CloudRain, Film, User } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
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
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SmartDash</h2>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            to={link.path} 
            key={link.name} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
