const request = require("supertest");

const app = require("../app");
const { User } = require("../models");

const { userOne, userOneId, setupDatabase } = require("./fixtures/db");
beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  await request(app)
    .post("/api/users/signup/")
    .attach("image", "tests/fixtures/profilepic.jpeg")
    .field({
      name: "Shiva Adhikari",
      email: userOne.email,
      password: userOne.password,
    })
    .expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/api/users/login/")
    .send({
      email: "shivaadhikari110@gmail.com",
      password: "Syangja123#",
    })
    .expect(200);
});

test("Should not login in non existing user", async () => {
  await request(app)
    .post("/api/users/login/")
    .send({
      email: "shivaadhikari49@gmail.com",
      password: "Syangja123#",
    })
    .expect(403);
});

test("Should delete account of the user", async () => {
  await request(app)
    .delete("/api/users/")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(204);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/api/users/").send().expect(403);
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/api/users/")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Bishnu",
      email: "bishnu@gmail.com",
      password: "Sasto2345#",
    })
    .expect(200);
});
