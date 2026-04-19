const Node = require('../Domain/Node')
const VariableResolver = require('./VariableResolver')

class PrintNode extends Node{

  #writeInterface
  #debug
  constructor(id,data){
    super(id,data)
    this._type = 'print'
    this.#debug = false
  }

  setDebug(debug){
    this.#debug = debug
  }

  setWriteInterface(writeInterface){
    this.#writeInterface = writeInterface
  }

  async run(edges,variables){
    console.log("PrintNode");
    const msg = VariableResolver.replaceReferences(this._data.content || this._data.code || '', variables)
    if(this.#debug && this.#writeInterface){
      const input =  await this.#writeInterface.ask(msg); 
      variables.set('inter_input',input)
    }else if(this.#writeInterface){
      await this.#writeInterface.ask(msg);
    }
    return edges.target
  }
      
}

module.exports = PrintNode