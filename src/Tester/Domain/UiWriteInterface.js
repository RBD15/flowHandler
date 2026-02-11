const WriteInterface = require('../../shared/WriteInterface');

class UiWriteInterface extends WriteInterface{
  _resolver
  _onPrompt

  constructor(onPrompt){
    super()
    this._resolver = null
    this._onPrompt = onPrompt
  }

  setPromptHandler(onPrompt){
    this._onPrompt = onPrompt
  }

  async ask(msg) {
    if (typeof this._onPrompt === 'function') {
      this._onPrompt(msg)
    }
    return new Promise((resolve) => {
      this._resolver = resolve
    })
  }

  provideInput(input){
    if (!this._resolver) {
      throw new Error('No prompt is waiting for input')
    }
    const resolver = this._resolver
    this._resolver = null
    resolver(input)
  }
}

module.exports = UiWriteInterface
