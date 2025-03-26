const Node = require('../Domain/Node')

class VariableNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'variable'
    }

    run(edges,variables){
        variables.set(this._data.name,this._data.value)
        return edges.target
    }

}

module.exports = VariableNode