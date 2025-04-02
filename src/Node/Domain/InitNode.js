const Node = require('../Domain/Node')

class InitNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'init'
    }

    async run(edges,variables){
        return edges.target
    }

}

module.exports = InitNode