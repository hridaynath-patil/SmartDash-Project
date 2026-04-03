import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { Search, Film, Star } from 'lucide-react';

const Movies = () => {
  const [query, setQuery] = useState('coding');
  const [searchTerm, setSearchTerm] = useState('coding');
  // TVMaze API is free and doesn't require an API key
  const url = `https://api.tvmaze.com/search/shows?q=${searchTerm}`;
  const { data, loading, error } = useFetch<any[]>(url);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchTerm(query);
  };

  return (
    <div>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Show Finder</h2>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: '600px' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search for shows..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem' }}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>Searching...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {data && data.length === 0 && !loading && (
          <p className="text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No results found for "{searchTerm}".</p>
        )}
        {data && data.map((item) => (
          <div key={item.show.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '300px', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {item.show.image?.medium ? (
                <img src={item.show.image.medium} alt={item.show.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Film size={48} className="text-muted" />
              )}
            </div>
            <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', flexGrow: 1 }}>{item.show.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <span className="text-muted">{item.show.premiered ? item.show.premiered.substring(0, 4) : 'N/A'}</span>
                {item.show.rating?.average && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 600 }}>
                    <Star size={14} fill="#f59e0b" /> {item.show.rating.average}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
