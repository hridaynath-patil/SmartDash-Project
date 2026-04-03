import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { TaskContext } from '../context/TaskContext';
import { NoteContext } from '../context/NoteContext';
import { User, Mail, Calendar, Settings, LogOut, Moon, Sun, Edit3, Shield, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, avatar, updateAvatar } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { tasks } = useContext(TaskContext);
  const { notes } = useContext(NoteContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Please log in to view your profile</h2>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Profile</h2>
      
      <div className="profile-layout">
        
        {/* Sidebar for Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
            <div 
              style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1rem', overflow: 'hidden', border: '4px solid var(--primary)', cursor: 'pointer', position: 'relative' }}
              onClick={() => fileInputRef.current?.click()}
              title="Click to update profile picture"
            >
              <img src={avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=100`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', color: 'white', padding: '0.25rem', display: 'flex', justifyContent: 'center' }}>
                 <Camera size={16} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{user.name}</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user.email}</p>
            <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`} 
                style={{ justifyContent: 'flex-start', background: activeTab !== 'overview' ? 'transparent' : '', color: activeTab !== 'overview' ? 'var(--text-main)' : '', boxShadow: 'none' }}
                onClick={() => setActiveTab('overview')}
              >
                <User size={18} style={{ marginRight: '0.75rem' }} /> Overview
              </button>
              <button 
                className={`btn ${activeTab === 'settings' ? 'btn-primary' : ''}`} 
                style={{ justifyContent: 'flex-start', background: activeTab !== 'settings' ? 'transparent' : '', color: activeTab !== 'settings' ? 'var(--text-main)' : '', boxShadow: 'none' }}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} style={{ marginRight: '0.75rem' }} /> Preferences
              </button>
              <button 
                className={`btn ${activeTab === 'security' ? 'btn-primary' : ''}`} 
                style={{ justifyContent: 'flex-start', background: activeTab !== 'security' ? 'transparent' : '', color: activeTab !== 'security' ? 'var(--text-main)' : '', boxShadow: 'none' }}
                onClick={() => setActiveTab('security')}
              >
                <Shield size={18} style={{ marginRight: '0.75rem' }} /> Security
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="card" style={{ padding: '2rem' }}>
          {activeTab === 'overview' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Account Details</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '50%', color: 'var(--text-muted)' }}><User size={20} /></div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Full Name</p>
                    <p style={{ fontWeight: 500 }}>{user.name}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '50%', color: 'var(--text-muted)' }}><Mail size={20} /></div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Email Address</p>
                    <p style={{ fontWeight: 500 }}>{user.email}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '50%', color: 'var(--text-muted)' }}><Calendar size={20} /></div>
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Account Status</p>
                    <p style={{ fontWeight: 500, color: '#10b981' }}>Active Member</p>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Platform Stats</h3>
              <div className="stats-layout">
                <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>{tasks.length}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Tasks</p>
                </div>
                <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', marginBottom: '0.25rem' }}>{completedTasks}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tasks Done</p>
                </div>
                <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.25rem' }}>{notes.length}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure Notes</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Preferences</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Appearance Theme</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Toggle between light and dark mode across the app.</p>
                </div>
                <button className="btn" style={{ background: 'var(--bg-color)', border: '1px solid var(--border)', display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', color: 'var(--text-main)' }} onClick={toggleTheme}>
                  {theme === 'light' ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} /> Light Mode</>}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email Notifications</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Receive updates about your tasks and features.</p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} defaultChecked />
                </label>
              </div>

              <div style={{ marginTop: '3rem' }}>
                <button className="btn" style={{ color: '#ef4444', border: '1px solid #ef4444', background: 'transparent' }} onClick={handleLogout}>
                  <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout of all devices
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Security Settings</h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Change Password</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                  <input type="password" placeholder="Current Password" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }} />
                  <input type="password" placeholder="New Password" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }} />
                  <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Update Password</button>
                </div>
              </div>

              <div style={{ padding: '1.5rem', border: '1px solid #ef4444', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.05)' }}>
                <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Danger Zone</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="btn" style={{ color: 'white', background: '#ef4444' }}>Delete Account</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
