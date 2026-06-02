import { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Plus, X, Trash2, Mail, Download, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Simple Emoji Picker data
const commonEmojis = ['💸', '💰', '💳', '💵', '🪙', '💼', '📈', '📊', '🛍️', '🏠', '🎁', '🎉', '❤️'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="card" style={{ 
        padding: '0.75rem 1rem', 
        border: '1px solid var(--border)', 
        backgroundColor: 'var(--surface)', 
        borderRadius: '8px', 
        boxShadow: 'var(--shadow-md)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.25rem',
        minWidth: '140px'
      }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{data.dateLabel}</p>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#7c3aed' }}>
          Total: ₹{data.amount.toLocaleString('en-IN')}
        </p>
        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-main)', marginTop: '0.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.25rem' }}>
          Details:<br />
          <span style={{ color: 'var(--text-muted)' }}>{data.categoryName}:</span> ₹{data.amount.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const Income = () => {
  const { transactions, categories, addTransaction, deleteTransaction, updateCategory, loadingTransactions } = useContext(FinanceContext);
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Filter categories to only income
  const incomeCategories = useMemo(() => {
    return categories.filter(c => c.type === 'income');
  }, [categories]);

  // Filter transactions to only income
  const incomeTransactions = useMemo(() => {
    return transactions.filter(t => t.type === 'income');
  }, [transactions]);

  // Group transactions for Recharts AreaChart
  const chartData = useMemo(() => {
    const groups: { [key: string]: { date: Date, amount: number, categories: string[] } } = {};
    
    incomeTransactions.forEach(tx => {
      const d = new Date(tx.date);
      const dateKey = d.toISOString().substring(0, 10);
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: d,
          amount: 0,
          categories: []
        };
      }
      groups[dateKey].amount += tx.amount;
      if (tx.category?.name && !groups[dateKey].categories.includes(tx.category.name)) {
        groups[dateKey].categories.push(tx.category.name);
      }
    });

    return Object.keys(groups)
      .map(key => {
        const d = new Date(key);
        const day = d.getDate();
        const month = d.toLocaleString('en-US', { month: 'short' });
        
        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) suffix = 'st';
        else if (day === 2 || day === 22) suffix = 'nd';
        else if (day === 3 || day === 23) suffix = 'rd';

        return {
          dateKey: key,
          dateLabel: `${day}${suffix} ${month}`,
          amount: groups[key].amount,
          categoryName: groups[key].categories.join(', ') || 'Income',
          dateObj: groups[key].date
        };
      })
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  }, [incomeTransactions]);

  // Selected Category Icon display inside Modal
  const selectedCat = useMemo(() => {
    return incomeCategories.find(c => c._id === categoryId);
  }, [categoryId, incomeCategories]);

  const handleOpenAdd = () => {
    setTitle('');
    setAmount('');
    setCategoryId(incomeCategories[0]?._id || '');
    setDate(new Date().toISOString().substring(0, 10));
    setShowEmojiPicker(false);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!title.trim() || isNaN(amt) || amt <= 0 || !categoryId) return;
    
    await addTransaction(title, amt, 'income', categoryId, date);
    handleClose();

    // Trigger Success Toast
    setToastMsg('Income added successfully');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this income record?')) {
      await deleteTransaction(id);
    }
  };

  const handleChangeEmoji = async (emoji: string) => {
    if (selectedCat) {
      await updateCategory(selectedCat._id, selectedCat.name, selectedCat.type, emoji);
      setShowEmojiPicker(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <div style={{ paddingBottom: '2rem', position: 'relative' }}>
      
      {/* Toast Notification Container */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: '30px',
          padding: '0.6rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 1100,
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          <div style={{ backgroundColor: '#10b981', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={12} strokeWidth={3} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{toastMsg}</span>
        </div>
      )}

      {/* Header section (matches image 4) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>Income Overview</h2>
          <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
            Track your earnings over time and analyze your income trends.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd} 
          className="btn" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: '#e8fbf3', 
            color: '#10b981', 
            border: 'none', 
            fontWeight: 600, 
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} /> Add Income
        </button>
      </div>

      {/* Recharts AreaChart Area */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', minHeight: '340px' }}>
        {incomeTransactions.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '280px', color: 'var(--text-muted)' }}>
            No transaction records available.
          </div>
        ) : (
          <div style={{ height: '285px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="dateLabel" 
                  stroke="var(--text-muted)" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  style={{ fontSize: '0.85rem' }} 
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  style={{ fontSize: '0.85rem' }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(124, 58, 237, 0.2)', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#7c3aed" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  dot={{ r: 5, fill: '#7c3aed', stroke: '#7c3aed', strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#7c3aed', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Income list section (matches image 4) */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Income Sources</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', fontSize: '0.85rem', padding: '0.45rem 1rem', background: 'var(--surface)' }}>
              <Mail size={16} /> Email
            </button>
            <button className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border)', fontSize: '0.85rem', padding: '0.45rem 1rem', background: 'var(--surface)' }}>
              <Download size={16} /> Download
            </button>
          </div>
        </div>

        {loadingTransactions ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
        ) : incomeTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
            No income transactions logged. Click "Add Income" to create one!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {incomeTransactions.map((tx) => (
              <div 
                key={tx._id} 
                className="income-card"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1.1rem 1.5rem', 
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--surface)',
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
                  <div style={{ 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--bg-color)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {tx.category?.icon || '💰'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>{tx.title}</h4>
                    <p className="text-muted" style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem' }}>
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.25rem', 
                    color: '#10b981', 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                    padding: '0.35rem 0.75rem', 
                    borderRadius: '20px', 
                    fontWeight: 600, 
                    fontSize: '0.9rem' 
                  }}>
                    +₹{tx.amount.toLocaleString('en-IN')} ↗
                  </span>

                  {/* Actions */}
                  <div className="income-delete-btn" style={{ opacity: 0, transition: 'opacity 0.2s' }}>
                    <button 
                      onClick={() => handleDelete(tx._id)}
                      className="icon-btn" 
                      style={{ color: '#ef4444', padding: '0.25rem' }}
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Add Income (matches image 5) */}
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
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ 
            width: '100%', 
            maxWidth: '480px', 
            padding: '2rem', 
            position: 'relative', 
            boxShadow: 'var(--shadow-xl)',
            animation: 'fadeInUp 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Add Income
              </h3>
              <button onClick={handleClose} className="icon-btn">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Icon / Change icon picker */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{selectedCat?.icon || '💸'}</span>
                  <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-main)', 
                      fontSize: '0.9rem', 
                      fontWeight: 500, 
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Change icon
                  </button>
                </div>

                {/* Emoji Popover */}
                {showEmojiPicker && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '50px', 
                    left: 0, 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px', 
                    boxShadow: 'var(--shadow-lg)', 
                    zIndex: 1010, 
                    padding: '0.6rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '0.35rem'
                  }}>
                    {commonEmojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleChangeEmoji(emoji)}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Income Source Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Income Source</label>
                <input 
                  type="text" 
                  placeholder="e.g. Job, Project Freelance" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)', 
                    background: 'var(--bg-color)', 
                    color: 'var(--text-main)', 
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Category Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Category</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)', 
                    background: 'var(--bg-color)', 
                    color: 'var(--text-main)', 
                    outline: 'none',
                    fontSize: '0.95rem',
                    cursor: 'pointer' 
                  }}
                >
                  <option value="" disabled>Select category</option>
                  {incomeCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Amount Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Amount</label>
                <input 
                  type="number" 
                  placeholder="e.g., 100000" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  step="any"
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)', 
                    background: 'var(--bg-color)', 
                    color: 'var(--text-main)', 
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Date Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ 
                    padding: '0.65rem 1rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)', 
                    background: 'var(--bg-color)', 
                    color: 'var(--text-main)', 
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ 
                    backgroundColor: '#7c3aed', 
                    borderColor: '#7c3aed', 
                    color: 'white', 
                    padding: '0.7rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  disabled={incomeCategories.length === 0}
                >
                  Add Income
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Page Styles */}
      <style>{`
        .income-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .income-card:hover .income-delete-btn {
          opacity: 1 !important;
        }
      `}</style>

    </div>
  );
};

export default Income;
