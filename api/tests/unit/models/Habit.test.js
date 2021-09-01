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
})
