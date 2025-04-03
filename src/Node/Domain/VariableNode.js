const Node = require('../Domain/Node')

class VariableNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'variable'
    }

    async run(edges,variables){
        const value = this.#replaceVariableReference(this._data.value, variables)
        variables.set(this._data.name,value)
        return edges.target
    }

    #replaceVariableReference(inputString, variables) {
        return inputString.replace(/#\{(\w+)\}/g, (match, key) => {
          return variables.get(key) || '';
        });
    }

}

module.exports = VariableNode