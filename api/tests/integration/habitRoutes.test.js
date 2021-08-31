describe('Habit Endpoints', () => {
    let api;
    
    beforeAll(() => {
        api = server.listen(5000, () => console.log('Test server running on port 5000'));
    })
    
    beforeEach(async () => {
        await resetTestDB();
    })
    
    afterAll(done => {
        console.log('Stopping test server');
        api.close(done);
    })

    test('returns list of all habits', async () => {
        const res = await request(api).get('/habits');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(5);
    })
})
