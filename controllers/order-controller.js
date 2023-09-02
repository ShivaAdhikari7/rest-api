const { validationResult } = require("express-validator");
const HttpError = require("../utils/http-error");
const { User, Order } = require("../models");

const createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, phone } = req.body;

  const createdOrder = new Order({
    name,
    email,
    phone,
    userId: req.userData.userId,
  });

  let user;
  try {
    user = await User.findByPk(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating Order failed , please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    await createdOrder.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Order failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Order: createdOrder });
};

const getOrderByUserId = async (req, res, next) => {
  let userId = req.params.userId;

  let user;
  try {
    user = await User.findByPk(userId, { include: [Order] });
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

const getOrderById = async (req, res, next) => {
  const Id = req.params.orderId;

  let order;
  try {
    order = await Order.findByPk(Id);
  } catch (err) {
    const error = new HttpError(
      "Fetching order failed, please try again later",
      500
    );
    return next(error);
  }
  if (!order) {
    const error = new HttpError("Could not found order for the given id", 404);
    return next(error);
  }
  res.status(200).send({ order });
};

module.exports = { createOrder, getOrderByUserId, getOrderById };
