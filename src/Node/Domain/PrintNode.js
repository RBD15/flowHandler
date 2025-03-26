const Node = require('../Domain/Node')

class PrintNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'print'
    }

    run(edges,variables){
        const msg = this.#replacePlaceholders(this._data.code, variables)
        console.log(msg);
        return edges.target
    }

    #replacePlaceholders(inputString, variables) {
        return inputString.replace(/#\{(\w+)\}/g, (match, key) => {
          return variables.get(key) || '';
        });
      }
      
}

module.exports = PrintNode