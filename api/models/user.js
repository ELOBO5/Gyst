const db = require("../dbConfig/init");

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
  }

  static get all() {
    return new Promise(async (res, rej) => {
      try {
        let result = await db.query(`SELECT * FROM users;`);
        let users = result.rows.map((r) => new User(r));
        res(users);
      } catch (err) {
        rej(`Error retrieving users: ${err}`);
      }
    });
  }

  static create({ username, email, password }) {
    return new Promise(async (res, rej) => {
      try {
        let result =
          await db.query(`INSERT INTO users (username, email, password)
                                                VALUES (${username}, ${email}, ${password}) RETURNING *;`);
        let user = new User(result.rows[0]);
        res(user);
      } catch (err) {
        rej(`Error creating user: ${err}`);
      }
    });
  }

  static findByEmail(email) {
    return new Promise(async (res, rej) => {
      try {
        let result = await db.query(`SELECT * FROM users
                                                WHERE email = ${email};`);
        let user = new User(result.rows[0]);
        res(user);
      } catch (err) {
        rej(`Error retrieving user: ${err}`);
      }
    });
  }
}

module.exports = User;
