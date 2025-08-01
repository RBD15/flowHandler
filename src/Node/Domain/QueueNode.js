const Node = require('./Node')

class QueueNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'queue'
    }

    async run(edges,variables){
        console.log("QueueNode");
        return edges.target
    }

}

module.exports = QueueNode