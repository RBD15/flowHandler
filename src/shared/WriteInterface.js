class WriteInterface{
  _writeInterface
  constructor(){
    if(this.constructor === WriteInterface)
      throw new Error("FYI: Instance of Abstract class cannot be instantiated")
  }

  async ask(msg) {
    if(this.constructor === WriteInterface)
      throw new Error("FYI: Instance of Abstract class cannot be instantiated")
  }
}

module.exports = WriteInterface