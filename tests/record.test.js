const request = require("supertest");

const app = require("../app");
const { Record } = require("../models");
const {
  userOne,
  userOneId,
  setupDatabase,
  userTwoId,
  recordOne,
  recordTwo,
  recordThree,
  userTwo,
} = require("./fixtures/db");

beforeEach(setupDatabase);
test("Should create a record for the user", async () => {
  const response = await request(app)
    .post("/api/records/")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Shiva",
      email: "shivaadhikari499@gmail.com",
      phone: "9864159195",
    })
    .expect(201);

  const record = await Record.findByPk(response.body.id);
  expect(record).not.toBeNull();
});

test("Should fetch user records", async () => {
  await request(app).get("/api/records").send().expect(200);
});

test("Should not delete other users record", async () => {
  await request(app)
    .delete(`/api/records/${recordOne.id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(403);

  const record = await Record.findByPk(recordOne.id);
  expect(record).not.toBeNull();
});

test("Should not update other users record", async () => {
  const response = await request(app)
    .patch(`/api/records/${recordOne.id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      name: "Shiva Adhikari",
      email: "shivaadhikariii@gmail.com",
      phone: "9876654556566",
    })
    .expect(403);
});
test("Should  update own  record", async () => {
  const response = await request(app)
    .patch(`/api/records/${recordOne.id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Shiva Adhikari",
      email: "shivaadhikariii@gmail.com",
      phone: "9876654556566",
    })
    .expect(200);
});

test("Should delete own record", async () => {
  const response = await request(app)
    .delete(`/api/records/${recordOne.id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(204);
  const record = await Record.findByPk(recordOne.id);
  expect(record).toBeNull();
});

test("Should get the record by unique identifier", async () => {
  await request(app).get(`/api/records/${recordOne.id}`).send().expect(200);
});
