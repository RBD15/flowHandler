const readline = require('readline');
const WriteInterface = require('../../shared/WriteInterface');

class ConsoleWriteInterface extends WriteInterface{
  _writeInterface
  constructor(){
    super()
    this._writeInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
  }

  async ask(msg) {
    return new Promise((resolve) => {
      this._writeInterface.question(msg, (input) => {
        resolve(input);
      });
    });
  }
}

module.exports = ConsoleWriteInterface