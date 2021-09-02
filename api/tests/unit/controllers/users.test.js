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
})
