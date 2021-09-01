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
})
