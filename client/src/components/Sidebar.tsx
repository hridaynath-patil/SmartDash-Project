import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, StickyNote, User, X, PiggyBank, List, ArrowUpCircle, ArrowDownCircle, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed?: boolean;
}

const Sidebar = ({ isOpen, setIsOpen, isCollapsed }: SidebarProps) => {
  const { user, avatar } = useContext(AuthContext);
  const location = useLocation();

  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(
    location.pathname === '/dashboard' || location.pathname === '/tasks' || location.pathname === '/notes'
  );

  // Auto-expand Task Manager dropdown if we are on any of its child pages
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/tasks' || location.pathname === '/notes') {
      setIsTaskManagerOpen(true);
    }
  }, [location.pathname]);
  
  if (!user) return null;

  const isMoneyPage = location.pathname.startsWith('/money');

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
                src={avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=6366f1&color=fff&size=100`} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{user.name || 'User'}</span>
          </div>
        )}

        <nav className="sidebar-nav">
          {/* Task Manager Dropdown Group */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', width: '100%' }}
              onClick={() => setIsTaskManagerOpen(!isTaskManagerOpen)}
            >
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                style={{ flexGrow: 1, paddingRight: '2rem' }}
              >
                <LayoutDashboard size={20} />
                {!isCollapsed && <span>Task Manager</span>}
              </NavLink>

              {!isCollapsed && (
                <div style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                  {isTaskManagerOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              )}
            </div>

            {/* Nested dropdown items */}
            {isTaskManagerOpen && !isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '1.2rem', marginTop: '0.35rem', borderLeft: '2px solid var(--border)', marginLeft: '1.5rem' }}>
                <NavLink 
                  to="/tasks" 
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                >
                  <CheckSquare size={18} />
                  <span>Tasks</span>
                </NavLink>
                <NavLink 
                  to="/notes" 
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  style={{ padding: '0.6rem 0.8rem', fontSize: '0.9rem' }}
                >
                  <StickyNote size={18} />
                  <span>Notes</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Money Manager Sections */}
          <NavLink 
            to="/money-dash" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? 'Money Dash' : ''}
          >
            <PiggyBank size={20} />
            {!isCollapsed && <span>Money Dash</span>}
          </NavLink>

          <NavLink 
            to="/money-categories" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? 'Category' : ''}
          >
            <List size={20} />
            {!isCollapsed && <span>Category</span>}
          </NavLink>

          <NavLink 
            to="/money-income" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? 'Income' : ''}
          >
            <ArrowUpCircle size={20} />
            {!isCollapsed && <span>Income</span>}
          </NavLink>

          <NavLink 
            to="/money-expense" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? 'Expense' : ''}
          >
            <ArrowDownCircle size={20} />
            {!isCollapsed && <span>Expense</span>}
          </NavLink>

          <NavLink 
            to="/money-filters" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? 'Filters' : ''}
          >
            <Filter size={20} />
            {!isCollapsed && <span>Filters</span>}
          </NavLink>

          {/* Account Profile Section */}
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? 'Profile' : ''}
          >
            <User size={20} />
            {!isCollapsed && <span>Profile</span>}
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
