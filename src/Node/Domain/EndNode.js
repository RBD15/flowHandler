const Node = require('../Domain/Node')

class EndNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'end'
    }

    run(edges,variables){
        
    }

}

module.exports = EndNode