const Node = require('../Domain/Node')

class PrintNode extends Node{

  #readInterface
  constructor(id,data){
    super(id,data)
    this._type = 'print'
  }

  setReadInterface(readInterface){
    this.#readInterface = readInterface
  }

  async run(edges,variables){
    console.log("PrintNode");
    const msg = this.#replaceVariableReference(this._data.code, variables)
    const input =  await this.#readInterface.ask(msg); 
    variables.set('inter_input',input)
    return edges.target
  }

  #replaceVariableReference(inputString, variables) {
    return inputString.replace(/#\{(\w+)\}/g, (match, key) => {
      return variables.get(key) || '';
    });
  }
      
}

module.exports = PrintNode