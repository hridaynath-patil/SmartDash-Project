import { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Plus, X, Trash2, Calendar, CreditCard } from 'lucide-react';

const Expense = () => {
  const { transactions, categories, addTransaction, deleteTransaction, loadingTransactions } = useContext(FinanceContext);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  // Filter categories to only expense
  const expenseCategories = useMemo(() => {
    return categories.filter(c => c.type === 'expense');
  }, [categories]);

  // Filter transactions to only expense
  const expenseTransactions = useMemo(() => {
    return transactions.filter(t => t.type === 'expense');
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return expenseTransactions.reduce((acc, t) => acc + t.amount, 0);
  }, [expenseTransactions]);

  const handleOpenAdd = () => {
    setTitle('');
    setAmount('');
    // Default to first expense category if available
    setCategory(expenseCategories[0]?._id || '');
    setDate(new Date().toISOString().substring(0, 10));
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!title.trim() || isNaN(amt) || amt <= 0 || !category) return;
    
    await addTransaction(title, amt, 'expense', category, date);
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this expense record?')) {
      await deleteTransaction(id);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>Expense Management</h2>
          <p className="text-muted" style={{ margin: '0.25rem 0 0 0' }}>Log and track all cash outflows</p>
        </div>
        <button onClick={handleOpenAdd} className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none' }}>
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Summary Stat Card */}
      <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CreditCard size={24} />
        </div>
        <div>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>Total Expense Logged</p>
          <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>
            ₹{totalExpense.toLocaleString('en-IN')}
          </h2>
        </div>
      </div>

      {/* Expense List Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 700 }}>Expense Records</h3>
        
        {loadingTransactions ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading records...</div>
        ) : expenseTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
            No expense transactions logged. Click "Add Expense" to create one!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Expense/Title</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '1rem 0.5rem', fontWeight: 600, textAlign: 'center', width: '80px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenseTransactions.map((tx) => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 500, color: 'var(--text-main)' }}>{tx.title}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                        <span>{tx.category?.icon || '💸'}</span>
                        <span>{tx.category?.name || 'Expense'}</span>
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} /> {formatDate(tx.date)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: '#ef4444', textAlign: 'right', fontSize: '1rem' }}>
                      -₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                      <button onClick={() => handleDelete(tx._id)} className="icon-btn" style={{ color: '#ef4444' }} title="Delete record">
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

      {/* MODAL: Add Expense */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.4)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2rem', animation: 'fadeInUp 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>Add Expense Transaction</h3>
              <button onClick={handleClose} className="icon-btn"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Description/Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rent, Grocery shopping, Electric bill" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1500" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    step="any"
                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="" disabled>Select a category</option>
                  {expenseCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
                {expenseCategories.length === 0 && (
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#ef4444' }}>
                    No expense categories found. Create one first!
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={handleClose} className="btn" style={{ flexGrow: 1, backgroundColor: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, backgroundColor: '#ef4444', borderColor: '#ef4444' }} disabled={expenseCategories.length === 0}>Add Expense</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;
