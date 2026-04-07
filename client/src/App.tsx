import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NoteProvider } from './context/NoteContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages for optimization
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Notes = lazy(() => import('./pages/Notes'));
const Weather = lazy(() => import('./pages/Weather'));
const Movies = lazy(() => import('./pages/Movies'));
const Profile = lazy(() => import('./pages/Profile'));

// Fallback loader
const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <div className="text-muted">Loading components...</div>
  </div>
);

import MainLayout from './components/MainLayout';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <NoteProvider>
              <Router>
                <div className="app-container-root">
                  <Suspense fallback={<Loader />}>
                    <Routes>
                      {/* Public routes inside layout context but without Sidebar/Navbar */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Signup />} />

                      {/* Protected routes wrapped in MainLayout */}
                      <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
                        <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
                        <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      </Route>
                    </Routes>
                  </Suspense>
                </div>
              </Router>
            </NoteProvider>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
