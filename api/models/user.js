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

  static create(userData) {
    return new Promise(async (res, rej) => {
      try {
        const { username, email, password } = userData;
        let result = await db.query(
          `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
          [username, email, password]
        );
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
        let result = await db.query(
          `SELECT email FROM users WHERE email = $1;`,
          [email]
        );
        let user = new User(result.rows[0]);
        res(user);
      } catch (err) {
        rej(`Error retrieving user: ${err}`);
      }
    });
  }

  destroy() {
    return new Promise(async (res, rej) => {
      try {
        await db.query("DELETE FROM users WHERE id = $1;", [this.id]);
        res("User was deleted");
      } catch (err) {
        rej("User could not be deleted");
      }
    });
  }
}

module.exports = User;
