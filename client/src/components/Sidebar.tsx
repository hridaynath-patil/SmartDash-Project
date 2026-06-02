import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, CheckSquare, StickyNote, User, X, PiggyBank, List, ArrowUpCircle, ArrowDownCircle, Filter } from 'lucide-react';
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
  const location = useLocation();
  
  if (!user) return null;

  const isMoneyPage = location.pathname.startsWith('/money');

  const links = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Notes', path: '/notes', icon: <StickyNote size={20} /> },
    
    // Money Manager Section
    { name: 'Money Dash', path: '/money-dash', icon: <PiggyBank size={20} /> },
    { name: 'Category', path: '/money-categories', icon: <List size={20} /> },
    { name: 'Income', path: '/money-income', icon: <ArrowUpCircle size={20} /> },
    { name: 'Expense', path: '/money-expense', icon: <ArrowDownCircle size={20} /> },
    { name: 'Filters', path: '/money-filters', icon: <Filter size={20} /> },
    
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)}></div>}
      <div className={`sidebar ${isOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        
        {/* Sidebar Header */}
        <div className="sidebar-header" style={{ padding: isCollapsed ? '1rem' : '1.5rem', marginBottom: '0.5rem', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isMoneyPage && <PiggyBank size={24} style={{ color: 'var(--primary)' }} />}
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{isMoneyPage ? 'Money Manager' : 'SmartDash'}</h2>
            </div>
          )}
          {isCollapsed && (
            <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isMoneyPage ? <PiggyBank size={20} /> : 'S'}
            </div>
          )}
          <button className="icon-btn mobile-close-btn" onClick={() => setIsOpen(false)} style={{ position: 'absolute', right: '1rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* User Profile Info Card (matches photo) */}
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.5rem 0 1.5rem 0', gap: '0.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.2rem' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name || 'Bushan'}`} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{user.name || 'User'}</span>
          </div>
        )}

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
