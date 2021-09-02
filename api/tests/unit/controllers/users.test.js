const usersController = require('../../../controllers/users.js');
const User = require('../../../models/user.js');
const Habit = require('../../../models/habit.js');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();
const mockStatus = jest.fn(() => ({send: mockSend, json: mockJson, end: mockEnd}));
const mockRes = {status: mockStatus};

describe('Users Controller', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('index controller', () => {
        test('returns all users with a 200 status code', async () => {
            jest.spyOn(User, 'all', 'get')
                .mockResolvedValueOnce(['user1', 'user2']);

            await usersController.index(null, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['user1', 'user2']);
        })

        test('returns error with a 500 status code', async () => {
            try {
                jest.spyOn(User, 'all', 'get').mockRejectedValueOnce('index error test');
                await usersController.index(null, mockRes);
            } catch (err) {

            }

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'index error test'}));
        })
    })

    describe('getHabitsForUser controller', () => {
        test('returns all the habits of a particular user with a 200 status code', async () => {
            jest.spyOn(Habit, 'findByUserId')
                .mockResolvedValueOnce(['habit1', 'habit2', 'habit3'])
            const mockReq = { params: {id: 6789} };
            
            await usersController.getHabitsForUser(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['habit1', 'habit2', 'habit3'])
        })

        test('returns error with a 500 status code', async () => {
            const mockReq = { params: {id: 6789} };

            try {
                jest.spyOn(Habit, 'findByUserId').mockRejectedValueOnce('getHabitsForUser error test');
                await usersController.getHabitsForUser(mockReq, mockRes);
            } catch (err) {
                
            }

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'getHabitsForUser error test'}))
        })
    })

    describe('show controller', () => {
        test('returns a user with a 200 status code', async () => {
            const testUserData = {id: 554, username: 'test user', email: 'testuseremail@email.com', password: 'password999'}
            jest.spyOn(User, 'findByEmail')
                .mockResolvedValueOnce(new User(testUserData));
            const mockReq = { params: {email: 'testuseremail@email.com'} };

            await usersController.show(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new User(testUserData));
        })

        test('returns error with a 404 status code', async () => {
            const mockReq = { params: {email: 'testuseremail@email.com'} };

            try {
                jest.spyOn(User, 'findByEmail').mockRejectedValueOnce('show error test');
                await usersController.show(mockReq, mockRes);
            } catch (err) {

            }

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'show error test'}));
        })
    })

    describe('create controller', () => {
        test('returns a new user with a 201 status code', async () => {
            const newUserData = {id: 5544, username: 'test username', email: 'testusername@email.com', password: 'passw0rds'}
            jest.spyOn(User, 'create')
                .mockResolvedValueOnce(new User(newUserData));
            const mockReq = {body: newUserData};

            await usersController.create(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(new User(newUserData));
        })

        test('returns error with a 422 status code', async () => {
            const newUserData = {id: 5544, username: 'test username', email: 'testusername@email.com', password: 'passw0rds'}
            const mockReq = {body: newUserData}

            try {
                jest.spyOn(User, 'create').mockRejectedValueOnce('create error test');
                await usersController.create(mockReq, mockRes);
            } catch (err) {

            }

            expect(mockStatus).toHaveBeenCalledWith(422);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'create error test'}));
        })
    })
})
