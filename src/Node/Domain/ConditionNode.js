const Node = require('../Domain/Node')
const VariableResolver = require('./VariableResolver')

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
                const value = VariableResolver.resolveValue(this._data.name, variables)
                const compareTo = VariableResolver.resolveValue(this._data.value, variables)
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
}

module.exports = ConditionNode