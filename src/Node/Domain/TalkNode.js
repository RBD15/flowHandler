const Node = require('./Node')
const VariableResolver = require('./VariableResolver')

class TalkNode extends Node {

    #writeInterface

    constructor(id, data) {
        super(id, data)
        this._type = 'talk'
    }

    setWriteInterface(writeInterface) {
        this.#writeInterface = writeInterface
    }

    async run(edges, variables) {
        console.log('TalkNode')
        try {
            const text = VariableResolver.replaceReferences(this._data?.text || '', variables)
            const voiceModel = VariableResolver.replaceReferences(this._data?.voiceModel || 'default', variables)

            if (!this.#writeInterface || typeof this.#writeInterface.ask !== 'function') {
                throw new Error('TalkNode writeInterface is not configured')
            }

            await this.#writeInterface.ask(text, voiceModel)
            return edges.target
        } catch (err) {
            throw new Error(`TalkNode execution error: ${err}`)
        }
    }
}

module.exports = TalkNode
