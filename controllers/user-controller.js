const fs = require("fs");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../utils/http-error");
const { User, Record } = require("../models");

// SignUp Functionality:
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Input data are invalid, Please check your data", 422)
    );
  }
  const { name, email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ where: { email } });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (user) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    imgUrl: req.file.path,
    password: hashedPassword,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed here..., please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

// Login Functionality
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ where: { email } });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

// Function to fetch all the users from database:
const getAllUsers = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const whereClause = { ...queryObj };

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const offset = (page - 1) * limit;

    const users = await User.findAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: { exclude: ["password"] },
      include: [Record],
    });

    if (users.length === 0) {
      const error = new HttpError("No records found", 404);
      return next(error);
    }

    const totalRecords = await User.count({ where: whereClause });

    res.status(200).json({ users, totalRecords });
  } catch (err) {
    const error = new HttpError(
      "Fetching records failed, please try again later.",
      500
    );

    return next(error);
  }
};

// let users;
// try {
//   users = await User.findAll({
//     attributes: { exclude: ["password"] },
//     include: [Record],
//   });
// } catch (err) {
//   const error = new HttpError(
//     "Fetching users failed, please try again later.",
//     500
//   );
//   return next(error);
// }
// res.json({ users });
// };

// Function to update the user:
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { name, email, password } = req.body;
  let user;
  try {
    user = await User.findByPk(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Could not delete the user", 500);
    throw next(error);
  }

  user.name = name;
  user.email = email;
  user.phone = password;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user });
};
// Function to delete the user:
const deleteUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findByPk(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Could not delete the user", 500);
    throw next(error);
  }
  console.log(user);
  const imagePath = user.imgUrl;

  try {
    await Record.destroy({ where: { userId: req.userData.userId } });
  } catch (err) {
    const error = new HttpError("Could not delete the user", 500);
    throw next(error);
  }

  try {
    await User.destroy({ where: { id: req.userData.userId } });
  } catch (err) {
    const error = new HttpError("Could not delete the user", 500);
    throw next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(204).send({});
};

// Function to get the data of single user:
const getUser = async (req, res, next) => {
  let userId = req.params.userId;

  let user;
  try {
    user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError("No user found for this id", 404);
    return next(error);
  }
  res.json({ user });
};
module.exports = {
  signup,
  login,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
};
