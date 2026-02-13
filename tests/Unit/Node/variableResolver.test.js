const VariableResolver = require('../../../src/Node/Domain/VariableResolver')

describe('VariableResolver', () => {
    test('resolves object properties with arbitrary names', () => {
        const propNames = ['count', 'total_items', 'statusCode', 'x1y2z3', 'meta_value']

        propNames.forEach((propName, index) => {
            const variables = new Map()
            variables.set('results', { [propName]: index + 1 })

            const output = VariableResolver.replaceReferences(`#{results}.${propName}`, variables)
            expect(output).toBe(String(index + 1))
        })
    })

    test('resolves nested object properties with arbitrary names', () => {
        const firstLevelProp = 'response_payload'
        const secondLevelProp = 'custom_metric_42'

        const variables = new Map()
        variables.set('results', {
            [firstLevelProp]: {
                [secondLevelProp]: 99
            }
        })

        const output = VariableResolver.replaceReferences(
            `#{results}.${firstLevelProp}.${secondLevelProp}`,
            variables
        )

        expect(output).toBe('99')
    })

    test('resolves properties when object is stored as JSON string', () => {
        const dynamicProp = 'anyPropertyName'

        const variables = new Map()
        variables.set('results', JSON.stringify({ [dynamicProp]: 'OK' }))

        const output = VariableResolver.replaceReferences(`#{results}.${dynamicProp}`, variables)
        expect(output).toBe('OK')
    })
})
