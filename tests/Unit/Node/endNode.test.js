const EndNode = require('../../../src/Node/Domain/EndNode');

describe('EndNode', () => {
    test('run returns target and logs', async () => {
        const node = new EndNode('id1', {});
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const edges = { target: 'end_target' };
        
        const result = await node.run(edges, new Map());
        
        expect(result).toBe('end_target');
        expect(consoleSpy).toHaveBeenCalledWith('EndNode');
        consoleSpy.mockRestore();
    });
});
