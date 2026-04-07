
const FlowCode = require('../../../src/Flow/Domain/FlowCode')

describe('FlowCode optimization readiness and contracts', () => {
    const nodePrototype = {
        getNodeByType: (node) => ({
            run: jest.fn().mockImplementation(async (edges, vars) => {
                if (Array.isArray(edges)) {
                    // Simular comportamiento de nodo de decisión
                    return edges[0] ? edges[0].target : null
                }
                // Simular comportamiento de nodo simple
                return edges ? edges.target : null
            })
        })
    }

    test('getState() returns unique object instances for mutable data (variables, visitedNodesId)', () => {
        const nodes = [{ id: '1', type: 'init', data: {} }]
        const flow = new FlowCode(nodes, [], {}, nodePrototype)
        
        const state1 = flow.getState()
        const state2 = flow.getState()
        
        expect(state1).not.toBe(state2)
        // Definición (referencia compartida por performance)
        expect(state1.nodes).toBe(state2.nodes)
        // Estado mutable (copias profundas necesarias)
        expect(state1.variables).not.toBe(state2.variables)
        expect(state1.visitedNodesId).not.toBe(state2.visitedNodesId)
    })

    test('nextStep() runs until it finds a print node or end', async () => {
        const nodes = [
            { id: 'start', type: 'init' },
            { id: 'step2', type: 'print' },
            { id: 'menu', type: 'menu' },
            { id: 'opt1', type: 'print' },
            { id: 'opt2', type: 'print' }
        ]
        const edges = [
            { id: 'e1', source: 'start', target: 'step2' },
            { id: 'e2', source: 'step2', target: 'menu' },
            { id: 'e3', source: 'menu', target: 'opt1', data: { value: '1' } },
            { id: 'e4', source: 'menu', target: 'opt2', data: { value: '2' } }
        ]

        const flow = new FlowCode(nodes, edges, {}, nodePrototype)
        
        expect(flow.getState().currentNodeId).toBe('start')

        // Ejecuta desde start (init) -> step2 (print) y para.
        await flow.nextStep()
        expect(flow.getState().currentNodeId).toBe('menu')
        
        // Ejecuta desde step2 -> menu (decision, no para) -> opt1 (print) y para.
        await flow.nextStep()
        expect(flow.getState().currentNodeId).toBe(null)
    })

    test('setState() recovers complex state structure', () => {
        const flow = new FlowCode([], [], {}, nodePrototype)
        const complexState = {
            nodes: [{ id: 'a', type: 'init' }],
            edges: [{ source: 'a', target: 'b' }],
            variables: { user: { name: 'test' } },
            visitedNodesId: ['prev1'],
            currentNodeId: 'a',
            ended: false,
            toAgent: false
        }

        flow.setState(complexState)
        const state = flow.getState()
        
        expect(state.currentNodeId).toBe('a')
        expect(state.variables.user.name).toBe('test')
        expect(state.visitedNodesId).toContain('prev1')
    })

    test('reuses prewarmed template indices', () => {
        const nodes = [{ id: '1', type: 'init' }]
        const edges = [{ source: '1', target: '2' }]
        const template = FlowCode.createTemplate(nodes, edges, {})
        
        const flow = new FlowCode(template, null, null, nodePrototype)
        
        expect(flow.getNodes()).toBe(nodes)
        expect(flow.getEdges()).toBe(edges)
        expect(flow.getFirstNode()).toBe('1')
        
        // El estado debe ser independiente
        flow.setInput({ foo: 'bar' })
        const flow2 = new FlowCode(template, null, null, nodePrototype)
        expect(flow2.getInput()).toEqual({})
    })
})
