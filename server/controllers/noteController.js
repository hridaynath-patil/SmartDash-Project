const Note = require('../models/Note');

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNote = async (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ message: 'Please add a title and content' });
  }

  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      user: req.user.id
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
