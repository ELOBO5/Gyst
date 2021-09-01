const pg = require('pg');

const Habit = require('../../../models/habit.js');
const db = require('../../../dbConfig/init.js');

jest.mock('pg');

describe('Habit', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('static get all', () => {
        test('returns all habits on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}, {}] });
            
            const all = await Habit.all;

            expect(all.length).toEqual(4);
        })

        test('returns error notifying failure of retrieval on unsuccessful db query', async () => {
            try {
                jest.spyOn(db, 'query').mockRejectedValueOnce(Error());
                await Habit.all;
            } catch (err) {
                expect(err).toContain('Error retrieving habits:');
            }
        })
    })

    describe('static findByHabitId', () => {
        test('returns habit with particular id on successful db query', async () => {
            const habitData = {id: 35, habit: 'Sleep', frequency: 'monthly', has_priority: true, created_at: '2020-02-24', user_id: 3};
            const id = habitData.id;
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [habitData] });
            
            const habit = await Habit.findByHabitId(id);

            expect(habit).toBeInstanceOf(Habit);
            expect(habit.id).toEqual(35);
            expect(habit.habit).toEqual('Sleep');
            expect(habit.frequency).toEqual('monthly');
            expect(habit.has_priority).toEqual(true);
            expect(habit.created_at).toEqual('2020-02-24');
            expect(habit.user_id).toEqual(3);
        })

        test('returns error notifying failure of retrieval on unsuccessful db query', async () => {
            const habitData = {id: 35, habit: 'Sleep', frequency: 'monthly', has_priority: true, created_at: '2020-02-24', user_id: 3};
            const id = habitData.id;

            try {
                jest.spyOn(db, 'query').mockRejectedValueOnce(Error());
                await Habit.findByHabitId(id);
            } catch (err) {
                expect(err).toEqual('Habit not found');
            }
        })
    })

    describe('static findByUserId', () => {
        test('returns all habits of a user, given the user_id', async () => {
            const user_id = 66;
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}, {}, {}, {}, {}, {}] });

            const userHabits = await Habit.findByUserId(user_id);

            expect(userHabits.length).toEqual(8);
        })

        test('returns error notifying failure of retrieval on unsuccessful db query', async () => {
            const user_id = 66;

            try {
                jest.spyOn(db, 'query').mockRejectedValueOnce(Error());
                await Habit.findByUserId(user_id);
            } catch (err) {
                expect(err).toEqual('User not found');
            }
        })
    })

    describe('static create', () => {
        test('creates new habit on successful db query', async () => {
            const newHabitData = {habit: 'Exercise', frequency: 'weekly', has_priority: false, user_id: 4};
            const newHabitDataWithAllInfo = {...newHabitData, id: 12, created_at: '2020-05-05', habit_count: 0, habit_streak: 0, completed: false};
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [newHabitDataWithAllInfo] });

            const newHabit = await Habit.create(newHabitData);

            expect(newHabit).toBeInstanceOf(Habit);
            expect(newHabit).toEqual({id: 12, habit: 'Exercise', frequency: 'weekly', has_priority: false, created_at: '2020-05-05', habit_count: 0, habit_streak: 0, completed: false, user_id: 4});
        })

        test('returns error notifying failure of creation on unsuccessful db query', async () => {
            const newHabitData = {habit: 'Exercise', frequency: 'weekly', has_priority: false, user_id: 4};

            try {
                jest.spyOn(db, 'query').mockRejectedValueOnce(Error());
                await Habit.create(newHabitData);
            } catch (err) {
                expect(err).toEqual('Habit could not be created');
            }
        })
    })

    describe('updateInfo', () => {
        test('updates habit, frequency and has_priority on successful db query', async () => {
            const habitData = {id: 15, habit: 'Exercise', frequency: 'monthly', has_priority: true, created_at: '2020-05-05', habit_count: 0, habit_streak: 0, completed: false, user_id: 48};
            const updates = {habit: 'Sleep', frequency: 'daily', has_priority: true};
            let updatedHabitData = habitData;
            updatedHabitData.habit = updates.habit;
            updatedHabitData.frequency = updates.frequency;
            updatedHabitData.has_priority = updates.has_priority;
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [updatedHabitData] });
            
            const habit = new Habit(habitData);
            const updatedHabit = await habit.updateInfo(updates);

            expect(updatedHabit).toBeInstanceOf(Habit);
            expect(updatedHabit.habit).toEqual('Sleep');
            expect(updatedHabit.frequency).toEqual('daily');
            expect(updatedHabit.has_priority).toEqual(true);
        })

        test('returns error notifying failure of update on unsuccessful db query', async () => {
            const habitData = {id: 15, habit: 'Exercise', frequency: 'monthly', has_priority: true, created_at: '2020-05-05', habit_count: 0, habit_streak: 0, completed: false, user_id: 48};
            const updates = {habit: 'Sleep', frequency: 'daily', has_priority: true};

            const habit = new Habit(habitData);

            try {
                jest.spyOn(db, 'query').mockRejectedValueOnce(Error());
                await habit.updateInfo(updates);
            } catch (err) {
                expect(err).toEqual('Habit could not be updated');
            }
        })
    })

    describe('toggleCompleted', () => {
        test('updates completed and habit_streak on successful db query', async () => {
            const habitData = {id: 16, habit: 'Exercise a bit', frequency: 'daily', has_priority: false, created_at: '2020-06-30', habit_count: 0, habit_streak: 0, completed: false, user_id: 49};
            const updates = {completed: true, habit_streak: 1};
            let updatedHabitData = habitData;
            updatedHabitData.completed = updates.completed;
            updatedHabitData.habit_streak = updates.habit_streak;
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [updatedHabitData] });
            
            const habit = new Habit(habitData);
            const updatedHabit = await habit.toggleCompleted(updates);

            expect(updatedHabit).toBeInstanceOf(Habit);
            expect(updatedHabit.completed).toEqual(true);
            expect(updatedHabit.habit_streak).toEqual(1);
        })

        test('returns error notifying failure of toggle on unsuccessful db query', async () => {
            const habitData = {id: 16, habit: 'Exercise a bit', frequency: 'daily', has_priority: false, created_at: '2020-06-30', habit_count: 0, habit_streak: 0, completed: false, user_id: 49};
            const updates = {completed: true, habit_streak: 1};

            const habit = new Habit(habitData);

            try {
                jest.spyOn(db, 'query').mockRejectedValueOnce(Error());
                await habit.toggleCompleted(updates);
            } catch (err) {
                expect(err).toEqual('Habit completed could not be toggled');
            }
        })
    })

    describe('dailyReset', () => {
        test('updates habit_streak, habit_count and completed on successful db query', async () => {
            const habitData = {id: 17, habit: 'Exercise a bit more', frequency: 'weekly', has_priority: true, created_at: '2020-07-28', habit_count: 5, habit_streak: 3, completed: true, user_id: 50};
            const updates = {habit_streak: 4};
            let updatedHabitData = habitData;
            updatedHabitData.habit_streak = updates.habit_streak;
            updatedHabitData.completed = false;
            updatedHabitData.habit_count = ++habitData.habit_count;
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [updatedHabitData] });
            
            const habit = new Habit(habitData);
            const updatedHabit = await habit.toggleCompleted(updates);

            expect(updatedHabit).toBeInstanceOf(Habit);
            expect(updatedHabit.completed).toEqual(false);
            expect(updatedHabit.habit_streak).toEqual(4);
            expect(updatedHabit.habit_count).toEqual(6);
        })

        test('returns error notifying failure of reset on unsuccessful db query', async () => {
            const habitData = {id: 17, habit: 'Exercise a bit more', frequency: 'weekly', has_priority: true, created_at: '2020-07-28', habit_count: 5, habit_streak: 3, completed: true, user_id: 50};
            const updates = {habit_streak: 4};

            const habit = new Habit(habitData);

            try {
                jest.spyOn(db, 'query').mockRejectedValueOnce(Error());
                await habit.dailyReset(updates);
            } catch (err) {
                expect(err).toEqual('Habit could not be reset');
            }
        })
    })
})
