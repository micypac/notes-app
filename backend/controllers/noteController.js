const asyncHandler = require("express-async-handler");
const Note = require("../models/Note");
const User = require("../models/User");

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().populate("user", { username: 1 }).lean();

  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  res.json(notes);
});

const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  // confirm fields from request body
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if duplicate note exist
  const dupNote = await Note.findOne({ title }).lean().exec();

  if (dupNote) {
    return res.status(409).json({ message: "Duplicate note exist" });
  }

  // create new note
  const newNote = await Note.create({
    user,
    title,
    text,
  });

  if (newNote) {
    res.status(201).json({
      message: `New note ${newNote.ticket} assigned to ${newNote.user}`,
    });
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check note if exist
  const foundNote = await Note.findById(id).exec();

  if (!foundNote) {
    return res.status(400).json({ message: "Note not found" });
  }

  // check for duplicate title
  const dupNote = await Note.findOne({ title }).lean().exec();

  if (dupNote && dupNote._id.toString() !== id) {
    return res.status(409).json({ message: "Dupicate note title" });
  }

  foundNote.user = user;
  foundNote.title = title;
  foundNote.text = text;
  foundNote.completed = completed;

  const updatedNote = await foundNote.save();

  res.json({ message: `${updatedNote.title} updated` });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "Note ID required" });

  // check note if exist
  const foundNote = await Note.findById(id).exec();

  if (!foundNote) {
    return res.status(400).json({ message: "Note not found" });
  }

  const deletedNote = await foundNote.deleteOne();

  res.json({
    message: `Note ${deletedNote.title} with ID ${deletedNote._id} deleted`,
  });
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
