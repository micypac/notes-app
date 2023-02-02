const authRouter = require("express").Router();
const loginLimiter = require("../middleware/loginLimiter");
const { login, refresh, logout } = require("../controllers/authController");

authRouter.route("/").post(loginLimiter, login);

authRouter.route("/refresh").get(refresh);

authRouter.route("/logout").post(logout);

module.exports = authRouter;
