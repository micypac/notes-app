const noteRouter = require("express").Router();
const {
  gelAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
  getAllNotes,
} = require("../controllers/noteController");
const verifyJWT = require("../middleware/verifyJWT");

noteRouter.use(verifyJWT);

noteRouter
  .route("/")
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

module.exports = noteRouter;
