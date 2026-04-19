const NodePrototype = require('../../src/Flow/Application/NodePrototype');
const ConditionNode = require('../../src/Node/Domain/ConditionNode');
const ApiClient = require('../../src/Node/Domain/ApiClient');

describe('Security Validation (P3)', () => {
    
    describe('NodePrototype Security', () => {
        test('should not instantiate arbitrary classes (RCE Protection)', () => {
            const proto = new NodePrototype(null);
            // Before, this might have tried to instantiate via eval if the type matched a class name
            expect(() => proto.getNodeByType({ type: 'Object', id: '1', data: {} })).toThrow('Type wasnt valid');
        });
    });

    describe('ConditionNode Security', () => {
        test('should not execute arbitrary code via eval in conditions', async () => {
            const node = new ConditionNode('1', { 
                name: 'var1', 
                condition: '); { console.log("pwned") }; (', 
                value: 'val1' 
            });
            const variables = new Map([['var1', 'a'], ['val1', 'a']]);
            const edges = [{ label: 'THEN', target: '2' }, { label: 'ELSE', target: '3' }];
            
            // Should throw error or fail safely instead of executing the injected code
            await expect(node.run(edges, variables)).rejects.toThrow('Unsupported operator');
        });
    });

    describe('ApiClient SSRF Protection', () => {
        const client = new ApiClient();

        test('should block localhost and 127.0.0.1', async () => {
            await expect(client.request({ url: 'http://localhost/admin' }))
                .rejects.toThrow('Access to internal address blocked');
            await expect(client.request({ url: 'http://127.0.0.1:27017' }))
                .rejects.toThrow('Access to internal address blocked');
        });

        test('should block private IP ranges (SSRF)', async () => {
            await expect(client.request({ url: 'http://192.168.1.1/config' }))
                .rejects.toThrow('Access to internal address blocked');
            await expect(client.request({ url: 'http://10.0.0.1' }))
                .rejects.toThrow('Access to internal address blocked');
            await expect(client.request({ url: 'http://172.16.0.1' }))
                .rejects.toThrow('Access to internal address blocked');
        });

        test('should block invalid protocols', async () => {
            await expect(client.request({ url: 'file:///etc/passwd' }))
                .rejects.toThrow('Invalid protocol');
            await expect(client.request({ url: 'gopher://attack.com' }))
                .rejects.toThrow('Invalid protocol');
        });
    });
});
