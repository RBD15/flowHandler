const FlowCode = require('../../../src/Flow/Domain/FlowCode')

describe('FlowCode indexed node map', () => {
    const nodePrototype = {
        getNodeByType: () => ({
            run: jest.fn().mockResolvedValue('101')
        })
    }

    test('uses init node from indexed map', () => {
        const nodes = [
            { id: '10', type: 'print', data: {} },
            { id: '20', type: 'init', data: {} },
            { id: '30', type: 'end', data: {} }
        ]

        const flow = new FlowCode(nodes, [], {}, nodePrototype)

        expect(flow.getState().currentNodeId).toBe('20')
    })

    test('rebuilds node index when state nodes change', async () => {
        const initialNodes = [
            { id: '1', type: 'init', data: {} },
            { id: '2', type: 'end', data: {} }
        ]

        const flow = new FlowCode(initialNodes, [{ source: '1', target: '2', id: 'e1' }], {}, nodePrototype)

        flow.setState({
            nodes: [
                { id: '100', type: 'init', data: {} },
                { id: '101', type: 'end', data: {} }
            ],
            edges: [{ source: '100', target: '101', id: 'e2' }],
            settings: {},
            variables: { inter_input: 'go' },
            visitedNodesId: [],
            currentNodeId: '100',
            ended: false,
            toAgent: false,
            transferQueue: null
        })

        await flow.nextStep()

        expect(flow.getState().visitedNodesId).toContain('100')
    })
})
