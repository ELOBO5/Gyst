const db = require("../dbConfig/init");

class Habit {
  constructor(data) {
    this.id = data.id;
    this.habit = data.habit;
    this.frequency = data.frequency;
    this.has_priority = data.has_priority;
    this.created_at = data.created_at;
    this.habit_count = 0;
    this.habit_streak = 0;
    this.user_id = data.user_id;
  }

  static get all() {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await db.query(`SELECT * FROM habits;`);
        let habits = result.rows.map((r) => new Habit(r));
        resolve(habits);
      } catch (err) {
        reject(`Error retrieving habits: ${err}`);
      }
    });
  }

  static findByHabitId(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let habitData = await db.query(
          `SELECT * FROM habits WHERE id = ${id};`,
          [id]
        );
        let habit = new Habit(habitData.rows[0]);
        resolve(habit);
      } catch (err) {
        reject("Habit not found");
      }
    });
  }

  static findByUserId(user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let habitData = await db.query(
          `SELECT * FROM habits WHERE user_id = ${user_id};`,
          [user_id]
        );
        let habit = new Habit(habitData.rows[0]);
        resolve(habit);
      } catch (err) {
        reject("User not found");
      }
    });
  }

  static create(habit, frequency, has_priority, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let created_at = new Date().toISOString().slice(0, 10);
        let result = await db.query(
          `INSERT INTO habits (habit, frequency, has_priority, created_at, user_id) VALUES ($1, $2, $3, ${created_at}, $5) RETURNING *;`,
          [habit, frequency, has_priority, user_id]
        );

        resolve(result.rows[0]);
      } catch (err) {
        reject("Habit could not be created");
      }
    });
  }
}

module.exports = Habit;
