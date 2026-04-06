const FlowCode = require('../../../src/Flow/Domain/FlowCode')
const NodePrototype = require('../../../src/Flow/Application/NodePrototype')

describe('FlowHandler Bug Reproduction - Flow 1010', () => {
    let nodePrototype;
    let mockWriteInterface;

    beforeEach(() => {
        mockWriteInterface = {
            ask: jest.fn().mockResolvedValue('Some Input')
        };
        nodePrototype = new NodePrototype(mockWriteInterface, false);
    });

    const flowData = {
        "nodes": [
            { "id": "4", "type": "init", "data": { "label": "init node" } },
            { "id": "1", "type": "print", "data": { "label": "print node", "code": "Hola, indicanos tu nombre" } },
            { "id": "2", "type": "queue", "data": { "label": "queue node", "queueID": "10006" } },
            { "id": "3", "type": "end", "data": { "label": "end node" } },
            { "id": "5", "type": "variable", "data": { "label": "variable node", "name": "name", "value": "#{inter_input}" } },
            { "id": "6", "type": "print", "data": { "label": "print node", "code": "#{name}, cual es tu edad" } },
            { "id": "7", "type": "variable", "data": { "label": "variable node", "name": "age", "value": "#{inter_input}" } },
            { "id": "8", "type": "condition", "data": { "label": "condition node", "condition": ">=", "name": "#{age}", "value": "18" } },
            { "id": "9", "type": "print", "data": { "label": "print node", "code": "#{name}, eres mayor de edad" } },
            { "id": "10", "type": "print", "data": { "label": "print node", "code": "#{name}, eres menor de edad" } }
        ],
        "edges": [
            { "source": "1", "target": "5", "id": "xy-edge__1-5" },
            { "source": "5", "target": "6", "id": "xy-edge__5-6" },
            { "source": "6", "target": "7", "id": "xy-edge__6-7" },
            { "source": "7", "target": "8", "id": "xy-edge__7-8" },
            { "source": "8", "target": "9", "id": "xy-edge__8-9", "label": "THEN", "type": "THEN" },
            { "source": "8", "target": "10", "id": "xy-edge__8-10", "label": "ELSE", "type": "ELSE" },
            { "source": "4", "target": "1", "id": "xy-edge__4-1" },
            { "source": "10", "target": "2", "id": "xy-edge__10-2" },
            { "source": "9", "target": "2", "id": "xy-edge__9-2" },
            { "source": "2", "target": "3", "id": "xy-edge__2-3" }
        ]
    };

    test('Variable "name" should persist throughout the flow', async () => {
        const flow = new FlowCode(flowData.nodes, flowData.edges, {}, nodePrototype);
        
        // 1. Start flow (Init -> Print 1)
        await flow.nextStep(); 
        expect(mockWriteInterface.ask).toHaveBeenCalledWith("Hola, indicanos tu nombre");

        // 2. User provides name
        flow.setInput("Roberto");
        
        // 3. Next step (Print 1 -> Variable 5 -> Print 6)
        // Variable 5 should set 'name' = 'Roberto'
        // Print 6 should say "Roberto, cual es tu edad"
        await flow.nextStep();
        expect(mockWriteInterface.ask).toHaveBeenCalledWith("Roberto, cual es tu edad");

        // 4. User provides age
        flow.setInput("25");

        // 5. Next step (Print 6 -> Variable 7 -> Condition 8 -> Print 9)
        // Variable 7 sets 'age' = '25'
        // Condition 8 evaluates 25 >= 18 (THEN)
        // Print 9 should say "Roberto, eres mayor de edad"
        await flow.nextStep();
        
        // BUG REPORTED: User sees "undefined, eres mayor de edad"
        expect(mockWriteInterface.ask).toHaveBeenLastCalledWith("Roberto, eres mayor de edad");
    });
});
