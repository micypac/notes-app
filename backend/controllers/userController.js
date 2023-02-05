const bcrypt = require("bcrypt");
const User = require("../models/User");
const Note = require("../models/Note");

const getAllUsers = async (req, res) => {
  // select() specifies which fields to include or exclude.
  // lean() return documents POJO; no save method, getters/setters, etc.
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

const createNewUser = async (req, res) => {
  const { username, password, roles } = req.body;

  // confirm fields from request body. Roles has default "Employee" in the model.
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if duplicate user exist
  const dupUser = await User.findOne({ username: username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (dupUser) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // hash password provided
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: passwordHash }
      : { username, password: passwordHash, roles };

  // const newUser = await User.create({
  //   username,
  //   password: passwordHash,
  //   roles,
  // });

  const newUser = await User.create(userObject);

  if (newUser) {
    // res.status(201).json(newUser);
    res.status(201).json({ message: `New user ${newUser.username} created` });
  } else {
    res.status(400).json({ messsage: "Invalid user data received" });
  }
};

const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // confirm fields from request body
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if user exist
  const foundUser = await User.findById(id).exec();

  if (!foundUser) {
    return res.status(400).json({ message: "User not found" });
  }

  // check if duplicate user exist
  const dupUser = await User.findOne({ username: username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (dupUser && dupUser._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  foundUser.username = username;
  foundUser.roles = roles;
  foundUser.active = active;

  if (password) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    foundUser.password = passwordHash;
  }

  const updatedUser = await foundUser.save();

  res.json({ message: `User ${updatedUser.username} updated` });
};

const deleteUser = async (req, res) => {
  const { id } = req.body;

  // confirm id from request
  if (!id) {
    res.status(400).json({ message: "User ID is required" });
  }

  // check if user exist
  const foundUser = await User.findById(id).exec();

  if (!foundUser) {
    return res.status(400).json({ message: "User not found" });
  }

  // check if user has outstanding notes
  const note = await Note.findOne({ user: id }).lean().exec();

  if (note) {
    return res.status(400).json({ message: "User has assigned note/s" });
  }

  const deletedUser = await foundUser.deleteOne();

  res.json({
    message: `User ${deletedUser.username} with ID ${deletedUser._id} deleted`,
  });
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
