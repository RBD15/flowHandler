const Node = require('./Node')
const VariableResolver = require('./VariableResolver')

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
                value = VariableResolver.replaceReferences(inputVarName, variables)
            }else{
                value = variables.get(inputVarName) || ''
            }
            return this.matchingEdgeRoute(edges, value)
        }catch(err){
            throw new Error(`CaseNode execution error: ${err}`)
        }
    }

    matchingEdgeRoute(edges, value){
        // find exact label match first
        const nextEdge = edges.find((edge) => edge.label === value)
        if(nextEdge)
            return nextEdge.target
        // fallback to DEFAULT label
        const defaultEdge = edges.find((edge) => edge.label === 'DEFAULT')
        if(defaultEdge)
            return defaultEdge.target
        throw new Error(`No matching case for value ${value}`)
    }

}

module.exports = CaseNode
