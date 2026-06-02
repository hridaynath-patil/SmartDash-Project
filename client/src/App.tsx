import { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NoteProvider } from './context/NoteContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FinanceProvider } from './context/FinanceContext';

// Lazy load pages for optimization
const Prelogin = lazy(() => import('./pages/Prelogin'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Notes = lazy(() => import('./pages/Notes'));
const MoneyDash = lazy(() => import('./pages/MoneyDash'));
const Categories = lazy(() => import('./pages/Categories'));
const Income = lazy(() => import('./pages/Income'));
const Expense = lazy(() => import('./pages/Expense'));
const Filters = lazy(() => import('./pages/Filters'));
const Profile = lazy(() => import('./pages/Profile'));

// Fallback loader
const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <div className="text-muted">Loading components...</div>
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <FinanceProvider>
            <TaskProvider>
              <NoteProvider>
                <Router>
                <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                  <Sidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                    isCollapsed={isSidebarCollapsed}
                  />
                  <div className="main-content">
                    <Navbar toggleSidebar={toggleSidebar} />
                    <div className="page-content">
                      <Suspense fallback={<Loader />}>
                        <Routes>
                          <Route path="/" element={<Prelogin />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Signup />} />
                          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                          <Route path="/money-dash" element={<ProtectedRoute><MoneyDash /></ProtectedRoute>} />
                          <Route path="/money-categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                          <Route path="/money-income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
                          <Route path="/money-expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
                          <Route path="/money-filters" element={<ProtectedRoute><Filters /></ProtectedRoute>} />
                          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        </Routes>
                      </Suspense>
                    </div>
                  </div>
                </div>
              </Router>
            </NoteProvider>
          </TaskProvider>
          </FinanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
