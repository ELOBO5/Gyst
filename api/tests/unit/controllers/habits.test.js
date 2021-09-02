const habitsController = require('../../../controllers/habits.js');
const Habit = require('../../../models/habit.js');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({send: mockSend, json: mockJson}));
const mockRes = {status: mockStatus};

describe('Habits Controller', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('index controller', () => {
        test('returns all habits with a 200 status code', async () => {
            jest.spyOn(Habit, 'all', 'get')
                .mockResolvedValueOnce(['habit1', 'habit2']);

            await habitsController.index(null, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['habit1', 'habit2']);
        })

        test('returns error with a 500 status code', async () => {
            try {
                jest.spyOn(Habit, 'all', 'get').mockRejectedValueOnce('index error test');
                await habitsController.index(null, mockRes);
            } catch (err) {

            }

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'index error test'}));
        })
    })

    describe('show controller', () => {
        test('returns a habit with a 200 status code', async () => {
            const testHabitData = {
                id: 554, habit: 'Sleep', frequency: 'daily', has_priority: true, created_at: '2020-04-22',
                habit_count: 0, habit_streak: 0, completed: false, user_id: 6
            }
            jest.spyOn(Habit, 'findByHabitId')
                .mockResolvedValueOnce(new Habit(testHabitData));
            const mockReq = { params: {id: 554} };

            await habitsController.show(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Habit(testHabitData));
        })

        test('returns error with a 404 status code', async () => {
            const mockReq = { params: {id: 554} };

            try {
                jest.spyOn(Habit, 'findByHabitId').mockRejectedValueOnce('show error test');
                await habitsController.show(mockReq, mockRes);
            } catch (err) {

            }

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({err: 'show error test'}));
        })
    })
})
