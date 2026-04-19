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
        const mockClient = {
            request: jest.fn().mockResolvedValue({ data: { ok: true } })
        }
        node.setApiClient(mockClient)
        
        const next = await node.run({ target: '2' }, variables)

        expect(next).toBe('2')
        expect(variables.get('api_result')).toBe(JSON.stringify({ ok: true }))
    })

    test('handles request error gracefully', async () => {
        const node = new ApiNode('1', {
            url: 'https://invalid.com',
            responseVar: 'api_error'
        })
        const variables = new Map()
        const mockClient = {
            request: jest.fn().mockRejectedValue(new Error('Network error'))
        }
        node.setApiClient(mockClient)

        await expect(node.run({ target: 'b' }, variables)).rejects.toThrow('ApiNode execution error')
    })

    test('handles malformed JSON in headers or body', async () => {
        const node = new ApiNode('1', {
            url: 'http://test.com',
            headers: '{malformed}',
            body: '{invalid}',
            responseVar: 'res'
        })
        const variables = new Map()
        const mockClient = {
            request: jest.fn().mockResolvedValue({ data: { ok: true } })
        }
        node.setApiClient(mockClient)

        await node.run({ target: '2' }, variables)
        expect(mockClient.request).toHaveBeenCalledWith(expect.objectContaining({
            headers: {},
            body: '{invalid}'
        }))
    })
})
