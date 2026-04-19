const NodePrototype = require('../../../src/Flow/Application/NodePrototype');

class MockWriteInterface {
    ask() {}
    log() {}
}

const mockNode = (type, data = {}) => ({
    id: 'test-id',
    type,
    data
});

describe('NodePrototype', () => {
    let prototype;
    let writeInterface;

    beforeEach(() => {
        writeInterface = new MockWriteInterface();
        prototype = new NodePrototype(writeInterface, true);
    });

    test('should get node by type: init', () => {
        const node = prototype.getNodeByType(mockNode('init'));
        expect(node._type).toBe('init');
    });

    test('should get node by type: end', () => {
        const node = prototype.getNodeByType(mockNode('end'));
        expect(node._type).toBe('end');
    });

    test('should get node by type: variable', () => {
        const node = prototype.getNodeByType(mockNode('variable'));
        expect(node._type).toBe('variable');
    });

    test('should get node by type: condition', () => {
        const node = prototype.getNodeByType(mockNode('condition'));
        expect(node._type).toBe('condition');
    });

    test('should get node by type: print', () => {
        const node = prototype.getNodeByType(mockNode('print'));
        expect(node._type).toBe('print');
    });

    test('should get node by type: api', () => {
        const node = prototype.getNodeByType(mockNode('api'));
        expect(node._type).toBe('api');
    });

    test('should get node by type: talk', () => {
        const node = prototype.getNodeByType(mockNode('talk'));
        expect(node._type).toBe('talk');
    });

    test('should throw error for unknown type', () => {
        expect(() => prototype.getNodeByType(mockNode('unknown'))).toThrow('Type wasnt valid');
    });
});
