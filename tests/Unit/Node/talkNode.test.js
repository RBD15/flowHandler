const TalkNode = require('../../../src/Node/Domain/TalkNode')

describe('TalkNode', () => {
    test('passes text and voiceModel to ask and returns target', async () => {
        const node = new TalkNode('1', {
            text: 'Hola #{name}',
            voiceModel: 'default'
        })

        const writeInterface = {
            ask: jest.fn().mockResolvedValue(undefined)
        }

        node.setWriteInterface(writeInterface)

        const variables = new Map()
        variables.set('name', 'Juan')

        const next = await node.run({ target: '2' }, variables)

        expect(next).toBe('2')
        expect(writeInterface.ask).toHaveBeenCalledWith('Hola Juan', 'default')
    })

    test('throws when writeInterface is missing', async () => {
        const node = new TalkNode('1', {
            text: 'Hola',
            voiceModel: 'default'
        })

        const variables = new Map()

        await expect(node.run({ target: '2' }, variables)).rejects.toThrow('TalkNode writeInterface is not configured')
    })
})
