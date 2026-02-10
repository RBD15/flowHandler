const Node = require('./Node')

class CaseNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'case'
    }

    async run(edges,variables){
        console.log("CaseNode");
        try{
            if(!Array.isArray(edges)){
                throw new Error(`Bad Edge Format for ${edges}`)
            }
            const inputVarName = this._data.inputVar
            let value = ''
            if(typeof inputVarName === 'string' && inputVarName.includes('#{')){
                value = this._replaceVariableReference(inputVarName, variables)
            }else{
                value = variables.get(inputVarName) || ''
            }
            // find exact label match first
            const nextEdge = edges.find((edge) => edge.label === value)
            if(nextEdge)
                return nextEdge.target
            // fallback to DEFAULT label
            const defaultEdge = edges.find((edge) => edge.label === 'DEFAULT')
            if(defaultEdge)
                return defaultEdge.target
            throw new Error(`No matching case for value ${value}`)
        }catch(err){
            throw new Error(`CaseNode execution error: ${err}`)
        }
    }

    _replaceVariableReference(inputString, variables){
        if(!inputString) return ''
        if(typeof inputString !== 'string') return ''
        return inputString.replace(/#\{(\w+)\}/g, (match, key) => {
            return variables.get(key) || ''
        })
    }

}

module.exports = CaseNode
