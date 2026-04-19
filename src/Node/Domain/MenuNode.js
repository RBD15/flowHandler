const Node = require('./Node')

class MenuNode extends Node {

    #writeInterface

    constructor(id, data) {
        super(id, data)
        this._type = 'menu'
    }

    setWriteInterface(writeInterface) {
        this.#writeInterface = writeInterface
    }

    getMaxRetries() {
        const maxRetries = Number(this._data?.maxRetries)
        if (Number.isFinite(maxRetries) && maxRetries > 0) {
            return maxRetries
        }
        return 3
    }

    _resolveInputValue(variables) {
        const rawInput = variables.get('inter_input');
        if (rawInput === null || rawInput === undefined) return '';

        if (typeof rawInput === 'string' || typeof rawInput === 'number') {
            return String(rawInput).trim();
        }

        if (typeof rawInput === 'object') {
            const prioritizedKeys = ['inter_input', 'msg', 'input', 'dtmf', 'DTMF', 'digit', 'Digit'];
            
            for (const key of prioritizedKeys) {
                if (rawInput[key] !== undefined && rawInput[key] !== null) {
                    if (typeof rawInput[key] === 'object') {
                        const nested = rawInput[key];
                        const nestedKeys = ['dtmf', 'DTMF', 'digit', 'Digit'];
                        for (const nKey of nestedKeys) {
                            if (nested[nKey] !== undefined && nested[nKey] !== null) {
                                return String(nested[nKey]).trim();
                            }
                        }
                    } else {
                        return String(rawInput[key]).trim();
                    }
                }
            }
        }
        return '';
    }

    _setRetries(variables, retries) {
        variables.set(`menu_retries_${this._id}`, retries)
    }

    _getRetries(variables) {
        const current = Number(variables.get(`menu_retries_${this._id}`))
        if (Number.isFinite(current) && current >= 0) {
            return current
        }
        return 0
    }

    matchingEdgeRoute(edges, selectedOption) {
        const exactEdge = edges.find((edge) => String(edge.label) === String(selectedOption))
        if (exactEdge) {
            return exactEdge.target
        }

        if (String(selectedOption).toUpperCase() === 'END') {
            throw new Error('No END route configured for MenuNode')
        }

        const invalidEdge = edges.find((edge) => String(edge.label).toUpperCase() === 'INVALID')
        if (invalidEdge) {
            return invalidEdge.target
        }

        throw new Error(`No matching menu route for option ${selectedOption}`)
    }

    hasEdge(edges, label) {
        return Boolean(edges.find((edge) => String(edge.label).toUpperCase() === String(label).toUpperCase()))
    }

    async _resolveOptionFromWriteInterface(variables) {
        if (!this.#writeInterface || typeof this.#writeInterface.askMenu !== 'function') {
            return ''
        }

        const audioFile = String(this._data?.audioFile || '').trim()
        const selectedOption = await this.#writeInterface.askMenu(audioFile, {
            maxRetries: this.getMaxRetries(),
            nodeId: this._id
        })

        const normalized = String(selectedOption || '').trim()
        if (normalized) {
            variables.set('inter_input', normalized)
        }

        return normalized
    }

    async run(edges, variables) {
        console.log('MenuNode')
        try {
            if (!Array.isArray(edges)) {
                throw new Error(`Bad Edge Format for ${edges}`)
            }

            let selectedOption = this._resolveInputValue(variables)

            const hasInteractiveMenu =
                this.#writeInterface &&
                typeof this.#writeInterface.askMenu === 'function' &&
                String(this._data?.audioFile || '').trim() !== ''

            if (!selectedOption && hasInteractiveMenu) {
                const maxRetries = this.getMaxRetries()
                for (let attempt = 0; attempt < maxRetries && !selectedOption; attempt += 1) {
                    selectedOption = await this._resolveOptionFromWriteInterface(variables)
                    this._setRetries(variables, attempt + 1)
                }
            } else if (!selectedOption) {
                const retries = this._getRetries(variables) + 1
                this._setRetries(variables, retries)
            }

            if (selectedOption) {
                this._setRetries(variables, 0)

                if (this.hasEdge(edges, selectedOption)) {
                    return this.matchingEdgeRoute(edges, selectedOption)
                }

                if (this.hasEdge(edges, 'INVALID')) {
                    return this.matchingEdgeRoute(edges, 'INVALID')
                }

                throw new Error(`No matching menu route for option ${selectedOption}`)
            }

            const retries = this._getRetries(variables)

            if (retries >= this.getMaxRetries()) {
                return this.matchingEdgeRoute(edges, 'END')
            }

            if (this.hasEdge(edges, 'INVALID')) {
                return this.matchingEdgeRoute(edges, 'INVALID')
            }

            throw new Error('No menu input received after max retries')
        } catch (err) {
            throw new Error(`MenuNode execution error: ${err}`)
        }
    }
}

module.exports = MenuNode
