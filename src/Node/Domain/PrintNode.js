const Node = require('../Domain/Node')

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
    const msg = this.#replaceVariableReference(this._data.code, variables)
    if(this.#debug){
      const input =  await this.#writeInterface.ask(msg); 
      variables.set('inter_input',input)
    }else{
      await this.#writeInterface.ask(msg);
    }
    return edges.target
  }

  #replaceVariableReference(inputString, variables) {
    return inputString.replace(/#\{(\w+)\}/g, (match, key) => {
      return variables.get(key) || '';
    });
  }
      
}

module.exports = PrintNode