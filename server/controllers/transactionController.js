const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const getTransactions = async (req, res) => {
  try {
    let transactions = await Transaction.find({ user: req.user.id }).populate('category');
    
    // Seed default transactions if empty
    if (transactions.length === 0) {
      // Make sure we have categories to link to
      let categories = await Category.find({ user: req.user.id });
      if (categories.length === 0) {
        // Seed default categories first
        const defaults = [
          { name: 'Salary', type: 'income', icon: '💸', user: req.user.id },
          { name: 'Utilities', type: 'expense', icon: '🔌', user: req.user.id },
          { name: 'Rent', type: 'expense', icon: '🏠', user: req.user.id },
          { name: 'Bonus', type: 'income', icon: '💰', user: req.user.id }
        ];
        categories = await Category.insertMany(defaults);
      }

      const salaryCat = categories.find(c => c.name === 'Salary') || categories[0];
      const utilitiesCat = categories.find(c => c.name === 'Utilities') || categories[0];
      const rentCat = categories.find(c => c.name === 'Rent') || categories[0];
      const bonusCat = categories.find(c => c.name === 'Bonus') || categories[0];

      // Create defaults
      const defaultTx = [
        {
          title: 'Freelance',
          amount: 8000,
          type: 'income',
          category: salaryCat._id,
          date: new Date('2025-07-13'),
          user: req.user.id
        },
        {
          title: 'Uber',
          amount: 300,
          type: 'expense',
          category: utilitiesCat._id,
          date: new Date('2025-07-12'),
          user: req.user.id
        },
        {
          title: 'Extra tip',
          amount: 4000,
          type: 'income',
          category: bonusCat._id,
          date: new Date('2025-07-12'),
          user: req.user.id
        },
        {
          title: 'mid year bonus',
          amount: 50000,
          type: 'income',
          category: bonusCat._id,
          date: new Date('2025-07-12'),
          user: req.user.id
        },
        {
          title: 'Europe trip',
          amount: 100000,
          type: 'expense',
          category: rentCat._id, // or utilities
          date: new Date('2025-07-10'),
          user: req.user.id
        }
      ];

      await Transaction.insertMany(defaultTx);
      transactions = await Transaction.find({ user: req.user.id }).populate('category');
    }

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  const { title, amount, type, category, date } = req.body;
  if (!title || !amount || !type || !category) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }
  try {
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date: date || new Date(),
      user: req.user.id
    });
    const populated = await Transaction.findById(transaction._id).populate('category');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  const { title, amount, type, category, date } = req.body;
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    transaction.title = title || transaction.title;
    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.date = date || transaction.date;
    
    await transaction.save();
    const populated = await Transaction.findById(transaction._id).populate('category');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };
