import { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Search, Calendar, Sliders, Trash2 } from 'lucide-react';

const Filters = () => {
  const { transactions, categories, deleteTransaction } = useContext(FinanceContext);

  // Filter States
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
  const [category, setCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }

    // Transaction Type
    if (type !== 'all') {
      result = result.filter(t => t.type === type);
    }

    // Category
    if (category !== 'all') {
      result = result.filter(t => t.category?._id === category);
    }

    // Date Range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0,0,0,0);
      result = result.filter(t => new Date(t.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23,59,59,999);
      result = result.filter(t => new Date(t.date) <= end);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      } else if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [transactions, search, type, category, startDate, endDate, sortBy]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>Transaction Filters</h2>
        <p className="text-muted" style={{ margin: '0.25rem 0 0 0' }}>Search, slice, and sort your financial logs</p>
      </div>

      {/* Filters Control Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
          <Sliders size={18} className="text-muted" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Filter Controls</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* Text Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Search Description</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Transaction Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as 'all' | 'income' | 'expense')}
              style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              <option value="all">All Types</option>
              <option value="income">Incomes only</option>
              <option value="expense">Expenses only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sort By</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              <option value="date-desc">Date: Newest first</option>
              <option value="date-asc">Date: Oldest first</option>
              <option value="amount-desc">Amount: Highest first</option>
              <option value="amount-asc">Amount: Lowest first</option>
            </select>
          </div>

        </div>

        {/* Date Filters Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Start Date</label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>End Date</label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          {/* Reset Filters Button */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={() => {
                setSearch('');
                setType('all');
                setCategory('all');
                setStartDate('');
                setEndDate('');
                setSortBy('date-desc');
              }}
              className="btn btn-outline"
              style={{ width: '100%', padding: '0.55rem 1rem', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-main)' }}
            >
              Reset Filters
            </button>
          </div>

          {/* Blank space to balance grid */}
          <div />

        </div>
      </div>

      {/* Transaction List Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 700 }}>Filtered Results ({filteredTransactions.length})</h3>

        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
            No transactions match the selected filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Description</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'center', width: '80px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>{tx.title}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                        <span>{tx.category?.icon || '💰'}</span>
                        <span>{tx.category?.name || 'Uncategorized'}</span>
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {tx.type === 'income' ? (
                        <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>income</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>expense</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} /> {formatDate(tx.date)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: tx.type === 'income' ? '#10b981' : '#ef4444', textAlign: 'right', fontSize: '1rem' }}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(tx._id)} className="icon-btn" style={{ color: '#ef4444' }} title="Delete transaction">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
