const habitsController = require('../../../controllers/habits.js');
const Habit = require('../../../models/habit.js');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(() => ({send: mockSend, json: mockJson}));
const mockRes = {status: mockStatus};

describe('Habits Controller', () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        test('returns all habits with a 200 status code', async () => {
            jest.spyOn(Habit, 'all', 'get')
                .mockResolvedValueOnce(['habit1', 'habit2']);

            await habitsController.index(null, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(['habit1', 'habit2']);
        })
    })
})
