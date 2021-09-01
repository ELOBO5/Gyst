const db = require("../dbConfig/init");

class Habit {
  constructor(data) {
    this.id = data.id;
    this.habit = data.habit;
    this.frequency = data.frequency;
    this.has_priority = data.has_priority;
    this.created_at = data.created_at;
    this.habit_count = data.habit_count || 0;
    this.habit_streak = data.habit_streak || 0;
    this.completed = data.completed;
    this.completed_counter = data.completed_counter || 0;
    this.user_id = data.user_id;
  }

  static get all() {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await db.query(`SELECT * FROM habits ORDER BY id ASC;`);
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
          id
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
        let habit = habitData.rows.map((r) => new Habit(r));
        resolve(habit);
      } catch (err) {
        reject("User not found");
      }
    });
  }

  static create(habitData) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await db.query(
          `INSERT INTO habits (habit, frequency, has_priority, user_id) VALUES ($1, $2, $3, $4) RETURNING *;`,
          [
            habitData.habit,
            habitData.frequency,
            habitData.has_priority,
            habitData.user_id
          ]
        );
        let habit = new Habit(result.rows[0]);
        resolve(habit);
      } catch (err) {
        reject("Habit could not be created");
      }
    });
  }

  updateInfo(body) {
    return new Promise(async (resolve, reject) => {
      try {
        const { habit, frequency, has_priority } = body;
        const data = await db.query(
          `UPDATE habits SET habit = $1, frequency = $2, has_priority = $3 WHERE id = $4 RETURNING *;`,
          [habit, frequency, has_priority, this.id]
        );
        const updatedHabit = new Habit(data.rows[0]);
        resolve(updatedHabit);
      } catch (error) {
        reject("Habit could not be updated");
      }
    });
  }

  toggleCompleted(body) {
    return new Promise(async (resolve, reject) => {
      try {
        const { completed, habit_streak, completed_counter } = body;
        const data = await db.query(
          `UPDATE habits SET completed = $1, habit_streak = $2, completed_counter = $4 WHERE id = $3 RETURNING *;`,
          [completed, habit_streak, this.id, completed_counter]
        );
        const updatedHabit = new Habit(data.rows[0]);
        resolve(updatedHabit);
      } catch (error) {
        reject("Habit completed could not be toggled");
      }
    });
  }

  dailyReset(body) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await db.query(
          `UPDATE habits SET habit_streak = $1, habit_count = habit_count + 1, completed = false WHERE id = $2 RETURNING *;`,
          [body.habit_streak, this.id]
        );
        const updatedHabit = new Habit(data.rows[0]);
        resolve(updatedHabit);
      } catch (error) {
        reject("Habit could not be reset");
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
