const readline = require('readline');

class ReadInterface{
  #readInterface
  constructor(){
    this.#readInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
  }

  async ask(msg) {
    return new Promise((resolve) => {
      this.#readInterface.question(msg, (input) => {
        resolve(input);
      });
    });
  }
}

module.exports = ReadInterface