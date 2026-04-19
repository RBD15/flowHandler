const Node = require('../Domain/Node')
const VariableResolver = require('./VariableResolver')

class ConditionNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'condition'
    }

    async run(edges,variables){
        console.log("ConditionNode");
        try {
            if(Array.isArray(edges)){
                const value = VariableResolver.resolveValue(this._data.name, variables)
                const compareTo = VariableResolver.resolveValue(this._data.value, variables)
                
                let result = false
                const operator = this._data.condition
                
                // Functional replacement for eval
                switch (operator) {
                    case '===':
                    case '==':
                        result = value == compareTo; break;
                    case '!==':
                    case '!=':
                        result = value != compareTo; break;
                    case '>':
                        result = value > compareTo; break;
                    case '<':
                        result = value < compareTo; break;
                    case '>=':
                        result = value >= compareTo; break;
                    case '<=':
                        result = value <= compareTo; break;
                    default:
                        /* 
                        // Referencia eval original (RCE Risk): 
                        result = eval(`${value}${this._data.condition}${compareTo}`); 
                        */
                        throw new Error(`Unsupported operator: ${operator}`);
                }

                return this.matchingEdgeRoute(edges, result)
            }else{
                throw new Error(`Bad Edge Format for ${edges}`);
            }
        } catch (error) {
            throw new Error(`Condition variable wasnt founded ${error}`);
        }
    }

    matchingEdgeRoute(edges, result){
        const routeLabel = result ? 'THEN' : 'ELSE'
        const nextEdge = edges.find((edge)=> edge.label === routeLabel)
        return nextEdge.target
    }
}

module.exports = ConditionNode