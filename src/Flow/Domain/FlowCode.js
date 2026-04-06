class FlowCode{

    _nodes
    _nodesById
    _firstNodeId
    _edges
    _settings
    _currentNodeId
    _visitedNodesId
    _nodePrototype
    _variables
    _ended
    _toAgent
    _transferQueue
    _onNodeVisit

    constructor(nodes,edges,settings,nodePrototype){
        this._edges = edges
        this._nodes = nodes
        this.#rebuildNodesIndex()
        this._settings = settings
        this._nodePrototype = nodePrototype
        this._variables = new Map()
        this._variables.set('inter_input',{})
        this._currentNodeId = this.getFirstNode()
        this._visitedNodesId = new Set();
        this._ended = false;   
        this._toAgent = false;  
        this._transferQueue = null   
        this._onNodeVisit = null
    }

    #rebuildNodesIndex() {
        this._nodesById = new Map()
        this._firstNodeId = null

        for (const node of this._nodes || []) {
            this._nodesById.set(node.id, node)
            if (!this._firstNodeId && node.type === 'init') {
                this._firstNodeId = node.id
            }
        }
    }

    #getNodeById(nodeId) {
        return this._nodesById.get(nodeId)
    }

    getFirstNode(){
        return this._firstNodeId
    }

    setInput(input){
        this._variables.set('inter_input',input)        
    }

    getInput(){
        return this._variables
    }

    #cloneValue(value) {
        if (value instanceof Map) {
            const obj = {}
            for (const [key, mapValue] of value.entries()) {
                obj[key] = this.#cloneValue(mapValue)
            }
            return obj
        }

        if (value instanceof Set) {
            return Array.from(value).map(item => this.#cloneValue(item))
        }

        if (Array.isArray(value)) {
            return value.map((item) => this.#cloneValue(item))
        }

        if (value && typeof value === 'object') {
            try {
                return JSON.parse(JSON.stringify(value))
            } catch (e) {
                return value
            }
        }
        return value
    }

    getState() {
        return {
            nodes: this.#cloneValue(this._nodes),
            edges: this.#cloneValue(this._edges),
            settings: this.#cloneValue(this._settings),
            currentNodeId: this._currentNodeId,
            variables: this.#cloneValue(this._variables),
            visitedNodesId: this.#cloneValue(this._visitedNodesId),
            ended: this._ended,
            toAgent: this._toAgent,
            transferQueue: this.#cloneValue(this._transferQueue)
        }
    }

    setState(state) {
        if (state.edges) this._edges = state.edges
        if (state.nodes) this._nodes = state.nodes
        this.#rebuildNodesIndex()
        if (state.settings) this._settings = state.settings
        
        this._variables = new Map()
        if (state.variables instanceof Map) {
            this._variables = new Map(state.variables)
        } else if (state.variables && typeof state.variables === 'object') {
            for (const key of Object.keys(state.variables)) {
                this._variables.set(key, state.variables[key])
            }
        }

        if (state.visitedNodesId instanceof Set) {
            this._visitedNodesId = new Set(state.visitedNodesId)
        } else if (Array.isArray(state.visitedNodesId)) {
            this._visitedNodesId = new Set(state.visitedNodesId)
        } else if (state.visitedNodesId && typeof state.visitedNodesId === 'object') {
            this._visitedNodesId = new Set(Object.values(state.visitedNodesId))
        } else {
            this._visitedNodesId = new Set()
        }

        this._currentNodeId = state.currentNodeId
        this._ended = state.ended
        this._toAgent = state.toAgent
        this._transferQueue = state.transferQueue
    }

    setOnNodeVisit(callback){
        this._onNodeVisit = callback
    }

    getNodes(){
        return this._nodes
    }

    getEdges(){
        return this._edges
    }

    getSettings(){
        return this._settings
    }
    
    isEnded(){
        return this._ended
    }

    isToAgent(){
        return this._toAgent
    }
    
    async nextStep() {
        let stopped = false
        try {
            if (!this._currentNodeId) {
                this._ended = true
                return
            }

            if (this._visitedNodesId.has(this._currentNodeId)) {
                console.log("Se detectó un ciclo, deteniendo la ejecución.");
                return;
            }
        
            while(!stopped){
                
                const currentNode = this.#getNodeById(this._currentNodeId);

                if (!currentNode) {
                    console.log("Current node was not found, ending flow execution", this._currentNodeId)
                    this._currentNodeId = null
                    this._ended = true
                    return
                }

                if (this._onNodeVisit) {
                    try {
                        this._onNodeVisit(currentNode)
                    } catch (e) {
                        // ignore callback errors
                    }
                }
    
                if(currentNode.type === 'end'){
                    stopped = true
                    this._currentNodeId = null
                    this._ended= true;
                    return
                }
    
                if(currentNode.type === 'queue'){
                    stopped = true
                    this._currentNodeId = null
                    this._ended= true
                    this._toAgent= true
                    this._transferQueue = currentNode.data.queueID
                    return
                }
                
                const nextEdges = this._edges.filter(edge => edge.source === this._currentNodeId);
                this._visitedNodesId.add(this._currentNodeId);
                const tempNode = this._nodePrototype.getNodeByType(currentNode)
    
                if(currentNode.type === 'print')
                    stopped = true
                
                // console.log("Variables previous execution",this._variables);
                
                if(this._isDecisionNode(currentNode.type)){
                    this._currentNodeId = await tempNode.run(nextEdges,this._variables)
                }else{
                    this._currentNodeId = await tempNode.run(nextEdges[0],this._variables)
                }
                // console.log("Variables post execution",this._variables);

            }
            
        } catch (error){
            console.log("Error runing nextStep",error);
            throw error
        }
    }

    getInput(){
        return this._variables.get('inter_input')
    }

    _isDecisionNode(type){
        return type === 'condition' || type === 'switch' || type === 'intent' || type === 'case' || type === 'menu'
    }

    
}

module.exports = FlowCode