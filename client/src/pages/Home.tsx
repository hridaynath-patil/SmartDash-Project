const Home = () => {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
      <div style={{ display: 'inline-flex', marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '20px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
          SD
        </div>
      </div>
      <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '1rem', letterSpacing: '-1px' }}>
        Smart Productivity Dashboard
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
        Manage your tasks, write notes, monitor the weather, and search for movies, all in one sleek interface.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a href="/dashboard" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>
          Go to Dashboard
        </a>
        <a href="/tasks" className="btn" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', background: 'var(--bg-color)', border: '1px solid var(--border)' }}>
          Start Planning
        </a>
      </div>
    </div>
  );
};

export default Home;
