import { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const MoneyDash = () => {
  const { transactions, loadingTransactions } = useContext(FinanceContext);

  // Calculations
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [transactions]);

  // Chart Data
  const chartData = useMemo(() => {
    return [
      { name: 'Total Balance', value: Math.max(0, totals.balance), color: '#7c3aed' },
      { name: 'Total Expenses', value: totals.expense, color: '#ef4444' },
      { name: 'Total Income', value: totals.income, color: '#10b981' }
    ].filter(item => item.value > 0); // Recharts complains if value <= 0
  }, [totals]);

  const recentTransactions = useMemo(() => {
    return [...transactions].slice(0, 5);
  }, [transactions]);

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    
    // Get ordinal suffix
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';

    return `${day}${suffix} ${month} ${year}`;
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Upper cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Total Balance Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2rem' }}>
          <div style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', padding: '1.2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>Total Balance</p>
            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {formatCurrency(totals.balance)}
            </h2>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1.2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>Total Income</p>
            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
              {formatCurrency(totals.income)}
            </h2>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2rem' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1.2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingDown size={28} />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>Total Expense</p>
            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>
              {formatCurrency(totals.expense)}
            </h2>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Transactions + Financial Overview Chart */}
      <div className="dashboard-grid">
        
        {/* Recent Transactions Column */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Recent Transactions</h3>
            <Link to="/money-filters" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 1rem', fontSize: '0.9rem', border: '1px solid var(--border)' }}>
              More →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
            {loadingTransactions ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
            ) : recentTransactions.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                No recent transactions. Go to Income or Expense page to add some!
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      {tx.category?.icon || '💰'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{tx.title}</h4>
                      <p className="text-muted" style={{ margin: '0.1rem 0 0 0', fontSize: '0.8rem' }}>{formatDate(tx.date)}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {tx.type === 'income' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.9rem' }}>
                        +{formatCurrency(tx.amount)} <ArrowUpRight size={14} />
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.9rem' }}>
                        -{formatCurrency(tx.amount)} <ArrowDownRight size={14} />
                      </span>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial Overview Column */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '2rem', minHeight: '400px' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700 }}>Financial Overview</h3>
          
          <div style={{ position: 'relative', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {chartData.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No data to display</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Label */}
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Balance</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-main)' }}>
                    {formatCurrency(totals.balance)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: 'auto', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#7c3aed' }} />
              <span className="text-muted">Total Balance</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span className="text-muted">Total Expenses</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span className="text-muted">Total Income</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MoneyDash;
