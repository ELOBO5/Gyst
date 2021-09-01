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
                .mockResolvedValueOnce({ rows: [{}, {}, {}, {}, {}] });
            
            const all = await User.all;

            expect(all.length).toEqual(5);
        })
    })

    describe('static create', () => {
        test('creates new user on successful db query', async () => {
            const newUserData = {username: 'New User', email: 'new@email.com', password: 'password123'};
            const newUserDataWithId = {...newUserData, id: 9};
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [newUserDataWithId] });
            
            const newUser = await User.create(newUserData);

            expect(newUser).toBeInstanceOf(User);
            expect(newUser.id).toEqual(9);
            expect(newUser.username).toEqual('New User');
            expect(newUser.email).toEqual('new@email.com');
            expect(newUser.password).toEqual('password123');
        })
    })

    describe('static findByEmail', () => {
        test('returns user with particular email on successful db query', async () => {
            const userData = {id: 42, username: 'User Name', email: 'user@email.com', password: 'userpass321'};
            const email = userData.email;
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({ rows: [userData] });
            
            const user = await User.findByEmail(email);

            expect(user).toBeInstanceOf(User);
            expect(user.id).toEqual(42);
            expect(user.username).toEqual('User Name');
            expect(user.email).toEqual(email);
            expect(user.password).toEqual('userpass321');
        })
    })

    describe('destroy', () => {
        test('returns message notifying success of deletion on successful db query', async () => {
            const delUser = new User({id: 9901, username: 'To Be Deleted', email: 'byebye@email.com', password: 'goneforever'});
            jest.spyOn(db, 'query')
                .mockResolvedValueOnce({id: 9901});

            const result = await delUser.destroy();

            expect(result).toEqual('User 9901 was deleted');
        })

        test('returns error notifying failure of deletion on unsuccessful db query', async () => {
            const delUser = new User({id: 9901, username: 'To Be Deleted', email: 'byebye@email.com', password: 'goneforever'});
            try {
                jest.spyOn(db, 'query').mockRejectedValueOnce(Error());
                await delUser.destroy();
            } catch (err) {
                expect(err).toEqual('User could not be deleted');
            }
        })
    })
})
