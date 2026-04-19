const VARIABLE_REFERENCE_REGEX = /#\{([^{}]+)\}(?:\.([a-zA-Z0-9_.]+))?/g

class VariableResolver {

    static replaceReferences(input, variables){
        if(input === undefined || input === null) return input
        if(typeof input !== 'string') return input

        return input.replace(VARIABLE_REFERENCE_REGEX, (match, keyPath, trailingPath) => {
            const fullPath = trailingPath ? `${keyPath}.${trailingPath}` : keyPath
            const value = VariableResolver.resolvePath(fullPath, variables)
            return VariableResolver.toStringValue(value)
        })
    }

    static resolveValue(input, variables){
        if(typeof input !== 'string') return input
        
        // Single variable case: "#{var}"
        if(input.startsWith('#{') && input.endsWith('}') && (input.match(/#\{/g) || []).length === 1){
            const path = input.substring(2, input.length - 1)
            const val = this.resolvePath(path, variables)
            return val
        }

        return this.replaceReferences(input, variables)
    }

    static resolvePath(fullPath, variables){
        const parts = String(fullPath || '').split('.').filter(Boolean)
        if(!parts.length) return undefined

        let value = variables.get(parts[0])

        if (parts.length > 1 && typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
            try {
                value = JSON.parse(value)
            } catch (e) {
                // ignore invalid json values
            }
        }

        for (let i = 1; i < parts.length; i += 1) {
            if (value == null) return undefined
            value = value[parts[i]]
        }

        return value
    }

    static resolveValue(input, variables){
        if(input === undefined || input === null) return ''
        if(typeof input !== 'string') return input

        if(input.includes('#{')){
            return VariableResolver.replaceReferences(input, variables)
        }

        const stored = variables.get(input)
        return stored !== undefined ? stored : input
    }

    static toStringValue(value){
        if(value === undefined || value === null) return 'undefined'
        if(typeof value === 'object') return JSON.stringify(value)
        return String(value)
    }
}

module.exports = VariableResolver
