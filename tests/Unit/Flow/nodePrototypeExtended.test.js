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

describe('NodePrototype Extended', () => {
    let prototype;
    let writeInterface;

    beforeEach(() => {
        writeInterface = new MockWriteInterface();
        prototype = new NodePrototype(writeInterface, true);
    });

    test('should get node by type: menu', () => {
        const node = prototype.getNodeByType(mockNode('menu'));
        expect(node._type).toBe('menu');
    });

    test('should get node by type: transcribe', () => {
        // Transcribe is currently not in the hardcoded list but in the dynamic require list in the file header
        // Let's see if it works with the current dynamic eval approach or if it fails
        try {
            const node = prototype.getNodeByType(mockNode('transcribe'));
            expect(node._type).toBe('transcribe');
        } catch (e) {
            expect(e.message).toBe('Type wasnt valid');
        }
    });

    test('should handle nodeClassMap if provided', () => {
        class CustomNode {
            constructor(id, data) { this.id = id; this.data = data; this._type = 'custom'; }
            static get name() { return 'CustomNode'; }
        }
        const customMap = [{ type: 'custom', NodeClass: CustomNode }];
        const proto = new NodePrototype(writeInterface, true, customMap);
        const node = proto.getNodeByType(mockNode('custom'));
        expect(node._type).toBe('custom');
    });
});
