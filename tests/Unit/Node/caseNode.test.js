const CaseNode = require('../../../src/Node/Domain/CaseNode')

describe('CaseNode', () => {
    test('routes by variable name match', async () => {
        const node = new CaseNode('1', { inputVar: 'status' })
        const variables = new Map()
        variables.set('status', 'APPROVED')

        const edges = [
            { label: 'APPROVED', target: '2' },
            { label: 'DEFAULT', target: '3' }
        ]

        const next = await node.run(edges, variables)
        expect(next).toBe('2')
    })

    test('routes by #{var} replacement', async () => {
        const node = new CaseNode('1', { inputVar: '#{status}' })
        const variables = new Map()
        variables.set('status', 'REJECTED')

        const edges = [
            { label: 'REJECTED', target: '2' },
            { label: 'DEFAULT', target: '3' }
        ]

        const next = await node.run(edges, variables)
        expect(next).toBe('2')
    })

    test('falls back to DEFAULT when no match', async () => {
        const node = new CaseNode('1', { inputVar: 'status' })
        const variables = new Map()
        variables.set('status', 'UNKNOWN')

        const edges = [
            { label: 'APPROVED', target: '2' },
            { label: 'DEFAULT', target: '3' }
        ]

        const next = await node.run(edges, variables)
        expect(next).toBe('3')
    })
})
