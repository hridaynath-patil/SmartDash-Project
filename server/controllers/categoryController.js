const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

const getCategories = async (req, res) => {
  try {
    let categories = await Category.find({ user: req.user.id });
    if (categories.length === 0) {
      // Seed default categories for a new user
      const defaults = [
        { name: 'Salary', type: 'income', icon: '💸', user: req.user.id },
        { name: 'Utilities', type: 'expense', icon: '🔌', user: req.user.id },
        { name: 'Rent', type: 'expense', icon: '🏠', user: req.user.id },
        { name: 'Bonus', type: 'income', icon: '💰', user: req.user.id }
      ];
      categories = await Category.insertMany(defaults);
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name, type, icon } = req.body;
  if (!name || !type || !icon) {
    return res.status(400).json({ message: 'Please add all required fields' });
  }
  try {
    const category = await Category.create({
      name,
      type,
      icon,
      user: req.user.id
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { name, type, icon } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    category.name = name || category.name;
    category.type = type || category.type;
    category.icon = icon || category.icon;
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await category.deleteOne();
    
    // Clean up associated transactions
    await Transaction.deleteMany({ category: req.params.id, user: req.user.id });
    
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
