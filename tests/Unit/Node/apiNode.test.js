jest.mock('../../../src/Node/Domain/ApiClient', () => {
    return jest.fn().mockImplementation(() => ({
        request: jest.fn().mockResolvedValue({ data: { ok: true } })
    }))
})

const ApiNode = require('../../../src/Node/Domain/ApiNode')


describe('ApiNode', () => {
    test('stores response in responseVar and returns target', async () => {
        const node = new ApiNode('1', {
            method: 'GET',
            url: 'https://example.com/api',
            responseVar: 'api_result'
        })
        const variables = new Map()
        const next = await node.run({ target: '2' }, variables)

        expect(next).toBe('2')
        expect(variables.get('api_result')).toBe(JSON.stringify({ ok: true }))
    })
})
