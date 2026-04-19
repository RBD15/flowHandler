const PrintNode = require('../../../src/Node/Domain/PrintNode');
const VariableResolver = require('../../../src/Node/Domain/VariableResolver');

describe('PrintNode', () => {
    test('run replaces references and returns target', async () => {
        const node = new PrintNode('id1', { content: 'Value: #{var1}' });
        const variables = new Map([['var1', 'foo']]);
        const mockWrite = { ask: jest.fn().mockResolvedValue('user input') };
        node.setWriteInterface(mockWrite);
        
        const next = await node.run({ target: 'next_id' }, variables);
        
        expect(next).toBe('next_id');
        expect(mockWrite.ask).toHaveBeenCalledWith('Value: foo');
    });

    test('run handles missing variables', async () => {
        const node = new PrintNode('id1', { content: 'Value: #{missing}' });
        const variables = new Map();
        const mockWrite = { ask: jest.fn().mockResolvedValue('user input') };
        node.setWriteInterface(mockWrite);
        
        await node.run({ target: 'next_id' }, variables);
        
        expect(mockWrite.ask).toHaveBeenCalledWith('Value: undefined');
    });
});
