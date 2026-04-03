import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NoteProvider } from './context/NoteContext';
import { ThemeProvider } from './context/ThemeContext';

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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <NoteProvider>
            <Router>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="page-content">
                    <Suspense fallback={<Loader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Signup />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/notes" element={<Notes />} />
                        <Route path="/weather" element={<Weather />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </Suspense>
                  </div>
                </div>
              </div>
            </Router>
          </NoteProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
