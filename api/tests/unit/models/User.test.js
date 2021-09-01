const pg = require('pg');

const User = require('../../../models/user.js');
const db = require('../../../dbConfig/init.js');

jest.mock('pg');


describe('User', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('static get all', () => {
        test('returns all users on successful db query', async () => {
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [{}, {}, {}, {}, {}]});
            
            const all = await User.all;
            expect(all.length).toEqual(5);
        })
    })
})
