const FlowCode = require('../../../src/Flow/Domain/FlowCode');

describe('FlowCode constructor and getters', () => {
    test('constructs and finds first node', () => {
        const nodes = [{ id: 'n1', type: 'init' }];
        const flow = new FlowCode(nodes, [], {});
        expect(flow.getFirstNode()).toBe('n1');
    });

    test('static createTemplate works', () => {
        const nodes = [{ id: 'n1', type: 'init' }];
        const edges = [{ source: 'n1', target: 'n2' }];
        const template = FlowCode.createTemplate(nodes, edges, {});
        expect(template._isTemplate).toBe(true);
        expect(template.nodes).toBe(nodes);
        expect(template.edges).toBe(edges);
    });

    test('setInput/getInput works', () => {
        const flow = new FlowCode([], [], {});
        const input = { key: 'val' };
        flow.setInput(input);
        expect(flow.getVariables().get('inter_input')).toBe(input);
    });
});
