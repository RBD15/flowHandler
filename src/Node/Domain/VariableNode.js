const Node = require('../Domain/Node')
const VariableResolver = require('./VariableResolver')

class VariableNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'variable'
    }

    async run(edges,variables){
        console.log("VariableNode");
      const value = VariableResolver.replaceReferences(this._data.value, variables)
        variables.set(this._data.name,value)
        return edges.target
    }

}

module.exports = VariableNode