const VariableResolver = require('../../../src/Node/Domain/VariableResolver');

describe('VariableResolver Bug Reproduction', () => {
    test('should resolve name variable when directly in Map', () => {
        const variables = new Map();
        variables.set('name', 'Roberto');
        
        const input = 'Hola, #{name}';
        const output = VariableResolver.replaceReferences(input, variables);
        
        expect(output).toBe('Hola, Roberto');
    });

    test('should resolve inter_input variable when directly in Map', () => {
        const variables = new Map();
        variables.set('inter_input', 'Juan');
        
        const input = 'Hola, #{inter_input}';
        const output = VariableResolver.replaceReferences(input, variables);
        
        expect(output).toBe('Hola, Juan');
    });
});
