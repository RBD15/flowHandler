
const Node = require('./Node')
const ApiClient = require('./ApiClient')
const VariableResolver = require('./VariableResolver')

class ApiNode extends Node{

    constructor(id,data){
        super(id,data)
        this._type = 'api'
        this._apiClient = new ApiClient()
    }

    async run(edges,variables){
        console.log("ApiNode");
        try{
            const method = (this._data.method || 'GET').toLowerCase()
            let url = VariableResolver.replaceReferences(this._data.url || '', variables)
            let headers = {}
            if(this._data.headers){
                // headers expected as JSON string or object; replace variables inside the string
                const rawHeaders = VariableResolver.replaceReferences(this._data.headers, variables)
                try{
                    headers = typeof rawHeaders === 'string' ? JSON.parse(rawHeaders) : rawHeaders
                }catch(e){
                    headers = {}
                }
            }

            let body = null
            if(this._data.body){
                const rawBody = VariableResolver.replaceReferences(this._data.body, variables)
                // try parse JSON, fallback to raw string
                try{
                    body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody
                }catch(e){
                    body = rawBody
                }
            }

            const response = await this._apiClient.request({ method, url, headers, body })

            const responseVar = this._data.responseVar
            if(responseVar){
                const responseData = response?.data
                if(typeof responseData === 'object' && responseData !== null){
                    variables.set(responseVar, JSON.stringify(responseData))
                }else{
                    variables.set(responseVar, responseData)
                }
            }

            return edges.target
        }catch(err){
            throw new Error(`ApiNode execution error: ${err}`)
        }
    }

}

module.exports = ApiNode
