const noteRouter = require("express").Router();
const {
  gelAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
  getAllNotes,
} = require("../controllers/noteController");

noteRouter
  .route("/")
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

module.exports = noteRouter;
