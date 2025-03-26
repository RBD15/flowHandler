const Node = require('../Domain/Node')

class InitNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'init'
    }

    run(edges,variables){
        // console.log(`Visitando nodo: ${this._data.label}`);
        return edges.target
    }

}

module.exports = InitNode