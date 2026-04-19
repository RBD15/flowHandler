const Node = require('../../../src/Node/Domain/Node');

class TestNode extends Node {
    async run() { return 'next'; }
}

describe('Node base class', () => {
    test('constructs with id and data', () => {
        const data = { foo: 'bar' };
        const node = new TestNode('id1', data);
        expect(node.getId()).toBe('id1');
        expect(node.getData()).toBe(data);
    });

    test('default log method', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const node = new TestNode('id1', {});
        node.log();
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    test('default execute method calls run', async () => {
        const node = new TestNode('id1', {});
        const result = await node.execute({});
        expect(result).toBe('next');
    });
});
