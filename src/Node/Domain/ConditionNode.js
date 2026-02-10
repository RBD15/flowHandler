const Node = require('../Domain/Node')

class ConditionNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'condition'
    }

    async run(edges,variables){
        console.log("ConditionNode");
        let result
        try {
            if(Array.isArray(edges)){
                const value = this.#resolveValue(this._data.name, variables)
                const compareTo = this.#resolveValue(this._data.value, variables)
                result = eval(
                    `${value}${this._data.condition}${compareTo}`
                );                
                if(result){
                    result = 'THEN'
                }else{
                    result = 'ELSE'
                }
                const nextEdge = edges.find((edge)=> edge.label === result)
                return nextEdge.target
            }else{
                throw new Error(`Bad Edge Format for ${edges}`);
            }
        } catch (error) {
            throw new Error(`Condition variable wasnt founded ${error}`);
        }
    }

    #replaceVariableReference(inputString, variables) {
        return inputString.replace(/#\{(\w+)\}/g, (match, key) => {
          return variables.get(key) || '';
        });
    }

    #resolveValue(input, variables) {
        if(input === undefined || input === null) return ''
        if(typeof input !== 'string') return input
        if(input.includes('#{')){
            return this.#replaceVariableReference(input, variables)
        }
        const stored = variables.get(input)
        return stored !== undefined ? stored : input
    }
}

module.exports = ConditionNode