const MenuNode = require('../../../src/Node/Domain/MenuNode')

describe('MenuNode', () => {
    test('routes by inter_input exact match', async () => {
        const node = new MenuNode('1', { maxRetries: 3 })
        const variables = new Map()
        variables.set('inter_input', '1')

        const edges = [
            { label: '1', target: '2' },
            { label: 'INVALID', target: '3' },
            { label: 'END', target: '9' }
        ]

        const next = await node.run(edges, variables)
        expect(next).toBe('2')
        expect(variables.get('menu_retries_1')).toBe(0)
    })

    test('routes to INVALID when input does not match any option', async () => {
        const node = new MenuNode('1', { maxRetries: 3 })
        const variables = new Map()
        variables.set('inter_input', 'X')

        const edges = [
            { label: '1', target: '2' },
            { label: 'INVALID', target: '3' },
            { label: 'END', target: '9' }
        ]

        const next = await node.run(edges, variables)
        expect(next).toBe('3')
    })

    test('routes to END when no input and maxRetries is reached', async () => {
        const node = new MenuNode('1', { maxRetries: 1 })
        const variables = new Map()

        const edges = [
            { label: '1', target: '2' },
            { label: 'INVALID', target: '3' },
            { label: 'END', target: '99' }
        ]

        const first = await node.run(edges, variables)

        expect(first).toBe('99')
        expect(variables.get('menu_retries_1')).toBe(1)
    })

    test('supports object inter_input payload', async () => {
        const node = new MenuNode('99', { maxRetries: 3 })
        const variables = new Map()
        variables.set('inter_input', { msg: '#' })

        const edges = [
            { label: '#', target: '10' },
            { label: 'INVALID', target: '11' },
            { label: 'END', target: '12' }
        ]

        const next = await node.run(edges, variables)
        expect(next).toBe('10')
    })

    test('supports dtmf field in inter_input payload', async () => {
        const node = new MenuNode('77', { maxRetries: 3 })
        const variables = new Map()
        variables.set('inter_input', { dtmf: '5' })

        const edges = [
            { label: '5', target: '20' },
            { label: 'INVALID', target: '21' },
            { label: 'END', target: '22' }
        ]

        const next = await node.run(edges, variables)
        expect(next).toBe('20')
    })

    test('supports nested inter_input.dtmf payload', async () => {
        const node = new MenuNode('88', { maxRetries: 3 })
        const variables = new Map()
        variables.set('inter_input', { inter_input: { dtmf: '8' }, caller: '1001' })

        const edges = [
            { label: '8', target: '30' },
            { label: 'INVALID', target: '31' },
            { label: 'END', target: '32' }
        ]

        const next = await node.run(edges, variables)
        expect(next).toBe('30')
    })

    test('throws error when maxRetries is reached and END route is missing', async () => {
        const node = new MenuNode('55', { maxRetries: 1 })
        const variables = new Map()

        const edges = [
            { label: '1', target: '2' },
            { label: 'INVALID', target: '3' }
        ]

        await expect(node.run(edges, variables)).rejects.toThrow('No END route configured for MenuNode')
    })
})
