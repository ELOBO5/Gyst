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

    describe('static create', () => {
        test('creates new user on successful db query', async () => {
            const newUserData = {username: 'New User', email: 'new@email.com', password: 'password123'};
            const newUserDataWithId = {...newUserData, id: 9};
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [newUserDataWithId]});
            
            const newUser = await User.create(newUserData);

            expect(newUser).toBeInstanceOf(User);
            expect(newUser.id).toEqual(9);
            expect(newUser.username).toEqual('New User');
            expect(newUser.email).toEqual('new@email.com');
            expect(newUser.password).toEqual('password123');
        })
    })
})
