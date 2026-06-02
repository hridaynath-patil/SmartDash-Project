import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';

export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
}

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  date: string;
}

interface FinanceContextType {
  categories: Category[];
  transactions: Transaction[];
  loadingCategories: boolean;
  loadingTransactions: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string, type: 'income' | 'expense', icon: string) => Promise<void>;
  updateCategory: (id: string, name: string, type: 'income' | 'expense', icon: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (title: string, amount: number, type: 'income' | 'expense', categoryId: string, date?: string) => Promise<void>;
  updateTransaction: (id: string, title: string, amount: number, type: 'income' | 'expense', categoryId: string, date?: string) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const getApiUrl = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://smartdash-project-backend.onrender.com/api';
};

export const FinanceContext = createContext<FinanceContextType>({
  categories: [],
  transactions: [],
  loadingCategories: false,
  loadingTransactions: false,
  fetchCategories: async () => {},
  addCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  fetchTransactions: async () => {},
  addTransaction: async () => {},
  updateTransaction: async () => {},
  deleteTransaction: async () => {},
});

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCategories = async () => {
    if (!user) return;
    setLoadingCategories(true);
    try {
      const res = await fetch(`${getApiUrl()}/categories`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const addCategory = async (name: string, type: 'income' | 'expense', icon: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${getApiUrl()}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, type, icon }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id: string, name: string, type: 'income' | 'expense', icon: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${getApiUrl()}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, type, icon }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(prev => prev.map(cat => cat._id === id ? data : cat));
        // Refresh transactions to show updated category info
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${getApiUrl()}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setCategories(prev => prev.filter(cat => cat._id !== id));
        // Refresh transactions since transactions under deleted category are cascades deleted
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    setLoadingTransactions(true);
    try {
      const res = await fetch(`${getApiUrl()}/transactions`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const addTransaction = async (
    title: string,
    amount: number,
    type: 'income' | 'expense',
    categoryId: string,
    date?: string
  ) => {
    if (!user) return;
    try {
      const res = await fetch(`${getApiUrl()}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, amount, type, category: categoryId, date }),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const updateTransaction = async (
    id: string,
    title: string,
    amount: number,
    type: 'income' | 'expense',
    categoryId: string,
    date?: string
  ) => {
    if (!user) return;
    try {
      const res = await fetch(`${getApiUrl()}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, amount, type, category: categoryId, date }),
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(prev => prev.map(tx => tx._id === id ? data : tx));
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    try {
      const res = await fetch(`${getApiUrl()}/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setTransactions(prev => prev.filter(tx => tx._id !== id));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchTransactions();
    } else {
      setCategories([]);
      setTransactions([]);
    }
  }, [user]);

  return (
    <FinanceContext.Provider
      value={{
        categories,
        transactions,
        loadingCategories,
        loadingTransactions,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
