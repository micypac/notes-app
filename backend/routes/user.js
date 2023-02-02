const userRouter = require("express").Router();
const {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

userRouter.use(verifyJWT);

userRouter
  .route("/")
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;
