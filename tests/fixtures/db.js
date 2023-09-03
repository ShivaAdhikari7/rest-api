const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const { Record } = require("../../models");

const userOneId = uuidv4();
const userOne = {
  id: userOneId,
  name: "Shiva Adhikari",
  email: "imshiv97@gmail.com",
  imgUrl: null,
  password: "Shiva110#",
  tokens: [
    {
      token: jwt.sign({ id: userOneId }, "MY_SECRET_CODE"),
    },
  ],
};
const userTwoId = uuidv4();
const userTwo = {
  id: userOneId,
  name: "Bishnu Adhikari",
  email: "shivaadhikari444@gmail.com",
  imgUrl: null,
  password: "Shiva110#",
  tokens: [
    {
      token: jwt.sign({ id: userTwoId }, "MY_SECRET_CODE"),
    },
  ],
};
const recordOne = {
  id: uuidv4(),
  name: "Shiva Adhikari",
  email: "Hello@gmail.com",
  phone: "987654456677777",
  userId: userOne.id,
};
const recordTwo = {
  id: uuidv4(),
  name: "Shyam Adhikari",
  email: "Helloshyam@gmail.com",
  phone: "987654456677777",
  userId: userOne.id,
};
const recordThree = {
  id: uuidv4(),
  name: "Narayan Adhikari",
  email: "Hellonaran@gmail.com",
  phone: "98765445667",
  userId: userTwo.id,
};
const setupDatabase = async () => {
  await User.destroy({
    where: {},
  });

  await Record.destroy({
    where: {},
  });

  await new User(userOne).save();
  await new User(userTwo).save();
  await new Record(recordOne).save();
  await new Record(recordTwo).save();
  await new Record(recordThree).save();
};

module.exports = {
  setupDatabase,
  userOne,
  userOneId,
  userTwoId,
  recordOne,
  recordTwo,
  recordThree,
};
