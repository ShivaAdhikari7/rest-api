const { validationResult } = require("express-validator");
const HttpError = require("../utils/http-error");
const { User, Record } = require("../models");

//Function to Create new Record

const createRecord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, phone } = req.body;

  const createdRecord = new Record({
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
      "Creating Record failed , please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    await createdRecord.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Record failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Record: createdRecord });
};

// Function to get a record of all users:

const getRecordByUserId = async (req, res, next) => {
  let userId = req.params.userId;

  let user;
  try {
    user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [Record],
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

// Function to get a single record by its unique identifier:

const getRecordById = async (req, res, next) => {
  const Id = req.params.recordId;

  let record;
  try {
    record = await Record.findByPk(Id);
  } catch (err) {
    const error = new HttpError(
      "Fetching record failed, please try again later",
      500
    );
    return next(error);
  }
  if (!record) {
    const error = new HttpError("Could not found record for the given id", 404);
    return next(error);
  }
  res.status(200).send({ record });
};

// Function to get the all records:

const getAllRecords = async (req, res, next) => {
  let records;
  try {
    records = await Record.findAll();
  } catch (err) {
    const error = new HttpError(
      "Fetching records failed please try again later.",
      500
    );
    return next(error);
  }
  if (!records) {
    const error = new HttpError("No records found", 404);
    return next(error);
  }
  res.status(200).send({ records });
};

//Function to delete the record

const deleteRecord = async (req, res, next) => {
  const recordId = req.params.recordId;

  let record;
  try {
    record = await Record.findByPk(recordId);
  } catch (err) {
    const error = new HttpError(
      "Could not delete the Record for the given id, Please try again.",
      500
    );
    return next(error);
  }

  if (!record) {
    const error = new HttpError("Could not find Record for the given id", 404);
    return next(error);
  }

  if (req.userData.userId !== record.userId) {
    const error = new HttpError(
      "You are not allowed to delete the record",
      403
    );
    return next(error);
  }

  try {
    Record.destroy({ where: { id: recordId } });
  } catch (err) {
    const error = new HttpError(
      "Could not delete the Record for the given id, Please try again.",
      500
    );
    return next(error);
  }

  res.status(204).send({});
};

// Function to update the Record:

const updateRecord = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { name, email, phone } = req.body;

  const recordId = req.params.recordId;

  let record;
  try {
    record = await Record.findByPk(recordId);
  } catch (err) {
    const error = new HttpError(
      "Could not update the Record for the given id, Please try again.",
      500
    );
    return next(error);
  }

  if (!record) {
    const error = new HttpError("Could not find Record for the given id", 404);
    return next(error);
  }
  console.log(req.userData.userId, record.userId);
  if (req.userData.userId !== record.userId) {
    const error = new HttpError(
      "You are not allowed to update the record",
      403
    );
    return next(error);
  }

  record.name = name;
  record.email = email;
  record.phone = phone;

  try {
    await record.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update record.",
      500
    );
    return next(error);
  }

  res.status(200).json({ record });
};

module.exports = {
  createRecord,
  getRecordByUserId,
  getRecordById,
  getAllRecords,
  deleteRecord,
  updateRecord,
};
