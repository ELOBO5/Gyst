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
        let habitData = await db.query(`SELECT * FROM habits WHERE id = $1;`, [
          id,
        ]);
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
          `SELECT * FROM habits WHERE user_id = $1;`,
          [user_id]
        );
        let habit = new Habit(habitData.rows[0]);
        resolve(habit);
      } catch (err) {
        reject("User not found");
      }
    });
  }

  static create(habitData) {
    return new Promise(async (resolve, reject) => {
      try {
        let created_at = new Date().toISOString().slice(0, 10);
        let result = await db.query(
          `INSERT INTO habits (habit, frequency, has_priority, created_at, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
          [
            habitData.habit,
            habitData.frequency,
            habitData.has_priority,
            created_at,
            habitData.user_id,
          ]
        );

        resolve(result.rows[0]);
      } catch (err) {
        reject("Habit could not be created");
      }
    });
  }

  destroy() {
    return new Promise(async (res, rej) => {
      try {
        await db.query("DELETE FROM habits WHERE id = $1;", [this.id]);
        res("Habit was deleted");
      } catch (err) {
        rej("Habit could not be deleted");
      }
    });
  }
}

module.exports = Habit;
