import { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import type { Category } from '../context/FinanceContext';
import { Plus, Edit2, X, Search, Heart, Coffee, Car, Briefcase, Smile } from 'lucide-react';

// Common Emojis grouped by categories
const emojiData = [
  { category: 'Smileys', tab: 'smile', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😉', '😊', '😇', '😍', '😘', '😜', '😎', '🥳', '🤓', '🧐', '😴', '🙄'] },
  { category: 'Money & Work', tab: 'briefcase', emojis: ['💸', '💰', '💳', '💵', '🪙', '💼', '📈', '📊', '🖥️', '✉️', '📦', '🖊️', '🗓️', '🧾', '🔨', '🔑'] },
  { category: 'Food & Dining', tab: 'coffee', emojis: ['🍔', '🍕', '🌮', '🍣', '🍎', '🍓', '🍩', '🍪', '🍫', '🍿', '🥤', '🍺', '🍷', '☕', '🥛', '🍽️'] },
  { category: 'Travel & Transport', tab: 'car', emojis: ['🚗', '🚕', '🚙', '🚌', '🏎️', '🏍️', '🚲', '✈️', '🚂', '🚢', '🗺️', '🌍', '🏠', '🏢', '🏨', '🏖️'] },
  { category: 'Activities & Objects', tab: 'heart', emojis: ['❤️', '🎉', '🎁', '🎈', '🎬', '🎮', '⚽', '🏀', '👕', '🛍️', '🎸', '🎨', '📚', '💊', '🧼', '🚩'] }
];

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useContext(FinanceContext);
  
  // State variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Form states
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<'income' | 'expense'>('income');
  const [catIcon, setCatIcon] = useState('💸');

  // Emoji picker popover states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [activeEmojiTab, setActiveEmojiTab] = useState('all');

  // Open modal for adding
  const handleOpenAdd = () => {
    setModalMode('add');
    setCatName('');
    setCatType('income');
    setCatIcon('💸');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setCatName(category.name);
    setCatType(category.type);
    setCatIcon(category.icon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setShowEmojiPicker(false);
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (modalMode === 'add') {
      await addCategory(catName, catType, catIcon);
    } else if (modalMode === 'edit' && selectedCategory) {
      await updateCategory(selectedCategory._id, catName, catType, catIcon);
    }

    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? All transactions in this category will also be deleted.')) {
      await deleteCategory(id);
    }
  };

  // Emojis filtering based on search and tab
  const filteredEmojis = useMemo(() => {
    let list: string[] = [];
    
    if (activeEmojiTab === 'all') {
      emojiData.forEach(cat => list.push(...cat.emojis));
    } else {
      const match = emojiData.find(cat => cat.tab === activeEmojiTab);
      if (match) list.push(...match.emojis);
    }

    if (emojiSearch.trim()) {
      // Very basic keyword matching, since emojis are raw characters, search usually matches name (simulated here)
      // For simple search, let's keep all containing or return matching sublist.
      // Emojis don't have descriptions in raw text, so let's filter based on typical associations:
      const searchLower = emojiSearch.toLowerCase();
      if (searchLower.includes('money') || searchLower.includes('cash') || searchLower.includes('salary') || searchLower.includes('pay')) {
        return ['💸', '💰', '💵', '🪙', '💳'];
      }
      if (searchLower.includes('food') || searchLower.includes('eat') || searchLower.includes('drink') || searchLower.includes('dine')) {
        return ['🍔', '🍕', '🌮', '🍩', '☕', '🍺', '🍽️'];
      }
      if (searchLower.includes('car') || searchLower.includes('drive') || searchLower.includes('travel') || searchLower.includes('trip')) {
        return ['🚗', '🚙', '✈️', '🏖️', '🌍'];
      }
      if (searchLower.includes('home') || searchLower.includes('rent') || searchLower.includes('house')) {
        return ['🏠', '🏢', '🔑'];
      }
      if (searchLower.includes('fun') || searchLower.includes('play') || searchLower.includes('game')) {
        return ['🎮', '🎬', '⚽', '🎸', '🎉'];
      }
    }

    return list;
  }, [activeEmojiTab, emojiSearch]);

  const renderTabIcon = (tabName: string) => {
    switch (tabName) {
      case 'smile': return <Smile size={16} />;
      case 'briefcase': return <Briefcase size={16} />;
      case 'coffee': return <Coffee size={16} />;
      case 'car': return <Car size={16} />;
      case 'heart': return <Heart size={16} />;
      default: return <Smile size={16} />;
    }
  };

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>All Categories</h2>
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
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Main Container Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Category Sources</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {categories.map((category) => (
            <div 
              key={category._id} 
              className="category-card"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '1rem 1.5rem', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--surface)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                  {category.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>{category.name}</h4>
                  <p className="text-muted" style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                    {category.type}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="category-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleOpenEdit(category)}
                  className="icon-btn" 
                  style={{ color: 'var(--text-muted)' }}
                  title="Edit Category"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(category._id)}
                  className="icon-btn" 
                  style={{ color: '#ef4444' }}
                  title="Delete Category"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: Add/Edit Category */}
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
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>
                {modalMode === 'add' ? 'Add Category' : 'Edit Category'}
              </h3>
              <button onClick={handleCloseModal} className="icon-btn">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Icon Picker Area */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '12px', 
                      backgroundColor: 'rgba(124, 58, 237, 0.1)', 
                      border: '1.5px dashed #7c3aed', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '2rem',
                      cursor: 'pointer'
                    }}
                  >
                    {catIcon}
                  </button>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>Category Icon</p>
                    <button 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--primary)', 
                        fontSize: '0.85rem', 
                        fontWeight: 500, 
                        padding: 0, 
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      {showEmojiPicker ? 'Close Picker' : 'Change icon'}
                    </button>
                  </div>
                </div>

                {/* Emoji Picker Popover */}
                {showEmojiPicker && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '70px', 
                    left: 0, 
                    width: '100%', 
                    backgroundColor: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-lg)', 
                    boxShadow: 'var(--shadow-lg)', 
                    zIndex: 1010, 
                    padding: '1rem',
                    maxHeight: '340px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {/* Popover Header search */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.8rem', backgroundColor: 'var(--bg-color)' }}>
                      <Search size={16} className="text-muted" />
                      <input 
                        type="text" 
                        placeholder="Search emojis (e.g. food, money, travel...)" 
                        value={emojiSearch}
                        onChange={(e) => setEmojiSearch(e.target.value)}
                        style={{ border: 'none', background: 'none', width: '100%', outline: 'none', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                      {emojiSearch && <X size={14} style={{ cursor: 'pointer' }} onClick={() => setEmojiSearch('')} />}
                    </div>

                    {/* Popover category tabs */}
                    <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.25rem', borderBottom: '1px solid var(--border)' }}>
                      <button 
                        type="button" 
                        onClick={() => { setActiveEmojiTab('all'); setEmojiSearch(''); }}
                        className={`btn-emoji-tab ${activeEmojiTab === 'all' ? 'active' : ''}`}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: activeEmojiTab === 'all' ? 'var(--primary)' : 'rgba(0,0,0,0.05)', color: activeEmojiTab === 'all' ? 'white' : 'var(--text-main)' }}
                      >
                        All
                      </button>
                      {emojiData.map(group => (
                        <button
                          key={group.category}
                          type="button"
                          onClick={() => { setActiveEmojiTab(group.tab); setEmojiSearch(''); }}
                          className={`btn-emoji-tab ${activeEmojiTab === group.tab ? 'active' : ''}`}
                          style={{ padding: '0.3rem 0.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: activeEmojiTab === group.tab ? 'var(--primary)' : 'rgba(0,0,0,0.05)', color: activeEmojiTab === group.tab ? 'white' : 'var(--text-main)' }}
                          title={group.category}
                        >
                          {renderTabIcon(group.tab)}
                        </button>
                      ))}
                    </div>

                    {/* Emojis Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', overflowY: 'auto', maxHeight: '180px', padding: '0.2rem' }}>
                      {filteredEmojis.map((emoji, index) => (
                        <button
                          key={`${emoji}-${index}`}
                          type="button"
                          onClick={() => {
                            setCatIcon(emoji);
                            setShowEmojiPicker(false);
                          }}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            fontSize: '1.5rem', 
                            cursor: 'pointer', 
                            padding: '0.2rem',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.1s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {emoji}
                        </button>
                      ))}
                      {filteredEmojis.length === 0 && (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No matches found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Name Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Freelance, Salary, Groceries" 
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border)', 
                    background: 'var(--bg-color)', 
                    color: 'var(--text-main)', 
                    outline: 'none', 
                    fontSize: '0.95rem' 
                  }}
                />
              </div>

              {/* Category Type Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Category Type</label>
                <select 
                  value={catType}
                  onChange={(e) => setCatType(e.target.value as 'income' | 'expense')}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border)', 
                    background: 'var(--bg-color)', 
                    color: 'var(--text-main)', 
                    outline: 'none', 
                    fontSize: '0.95rem',
                    cursor: 'pointer' 
                  }}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="btn" 
                  style={{ flexGrow: 1, backgroundColor: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flexGrow: 1 }}
                >
                  {modalMode === 'add' ? 'Add Category' : 'Save Category'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Global CSS style updates for hover effect and transitions */}
      <style>{`
        .category-card:hover {
          background-color: var(--border) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .category-actions {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .category-card:hover .category-actions {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Categories;
