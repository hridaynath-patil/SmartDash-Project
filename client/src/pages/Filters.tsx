import { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Search, Calendar, Trash2 } from 'lucide-react';

const Filters = () => {
  const { transactions, deleteTransaction } = useContext(FinanceContext);

  // Filter States
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'all'>('income');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Trigger search execution
  const [isApplied, setIsApplied] = useState(false);

  // States frozen for search execution
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    type: 'income',
    startDate: '',
    endDate: '',
    sortField: 'date',
    sortOrder: 'asc'
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      type,
      startDate,
      endDate,
      sortField,
      sortOrder
    });
    setIsApplied(true);
  };

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    if (!isApplied) return [];

    let result = [...transactions];

    // Transaction Type
    if (appliedFilters.type !== 'all') {
      result = result.filter(t => t.type === appliedFilters.type);
    }

    // Date Range
    if (appliedFilters.startDate) {
      const start = new Date(appliedFilters.startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(t => new Date(t.date) >= start);
    }
    if (appliedFilters.endDate) {
      const end = new Date(appliedFilters.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.date) <= end);
    }

    // Text Search
    if (appliedFilters.search.trim()) {
      const q = appliedFilters.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.category?.name && t.category.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (appliedFilters.sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return appliedFilters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, isApplied, appliedFilters]);

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
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>Filter Transactions</h2>
      </div>

      {/* Filters Control Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Select the filters
        </h3>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'flex-end', 
          gap: '1rem' 
        }}>
          
          {/* Type Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="all">All</option>
            </select>
          </div>

          {/* Start Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Start Date</label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          {/* End Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>End Date</label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          {/* Sort Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Sort Field</label>
            <select 
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          {/* Sort Order */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Sort Order</label>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              style={{ width: '100%', padding: '0.7rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Search bar + Purple apply button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: '2 1 250px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Search</label>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flexGrow: 1, padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem' }}
              />
              <button 
                type="button" 
                onClick={handleApplyFilters}
                style={{ 
                  backgroundColor: '#6320d4', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  width: '42px', 
                  height: '42px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f16b0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6320d4'}
              >
                <Search size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Transactions Container */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Transactions</h3>

        {!isApplied ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Select the filters and click apply to filter the transactions
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
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
