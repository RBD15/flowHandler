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
                const value = this.#replaceVariableReference(this._data.name, variables)
                result = eval(
                    `${value}${this._data.condition}${this._data.value}`
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
}

module.exports = ConditionNode