const Node = require('./Node')

class QueueNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'queue'
    }

    getQueueID(){
        return this._data.queueID
    }

    async run(edges,variables){
        console.log("QueueNode");
        return edges.target
    }

}

module.exports = QueueNode