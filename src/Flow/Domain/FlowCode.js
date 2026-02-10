class FlowCode{

    _nodes
    _edges
    _settings
    _currentNodeId
    _visitedNodesId
    _nodePrototype
    _variables
    _ended
    _toAgent
    _transferQueue

    constructor(nodes,edges,settings,nodePrototype){
        this._edges = edges
        this._nodes = nodes
        this._settings = settings
        this._nodePrototype = nodePrototype
        this._variables = new Map()
        this._variables.set('inter_input',{})
        this._currentNodeId = this.getFirstNode()
        this._visitedNodesId = new Set();
        this._ended = false;   
        this._toAgent = false;  
        this._transferQueue = null   
    }

    getFirstNode(){
        const initNode = this._nodes.find((node) => node.type === 'init')
        return initNode.id
    }

    setInput(input){
        this._variables.set('inter_input',input)        
    }

    getInput(){
        return this._variables
    }

    getState(){
        const state = {
            edges: this._edges,
            nodes: this._nodes,
            settings: this._settings,
            variables: new Map(this._variables),
            currentNodeId: this._currentNodeId,
            visitedNodesId: new Set(this._visitedNodesId),
            ended: this._ended,
            toAgent: this._toAgent,
            transferQueue: this._transferQueue
        } 
        return JSON.parse(JSON.stringify(state))
    }

    setState(state){
        this._edges = state.edges
        this._nodes = state.nodes
        this._settings = state.settings
        // console.log("Setting state",state);
        // console.log("Setting state variables",this._variables);
        this._variables = new Map()
        if (state.variables && Object.keys(state.variables).length > 0){
            for (const key in state.variables) {
                if (state.variables.hasOwnProperty(key)) {
                    this._variables.set(key, state.variables[key]);
                }
            }
        }

        if (state.visitedNodesId.size){
            this._visitedNodesId = new Set()
        }else{
            this._visitedNodesId = new Set(Object.values(state.visitedNodesId));
        }

        this._currentNodeId = state.currentNodeId
        this._ended = state.ended 
        this._toAgent = state.toAgent
        this._transferQueue = state.transferQueue
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
            if (this._visitedNodesId.has(this._currentNodeId)) {
                console.log("Se detectó un ciclo, deteniendo la ejecución.");
                return;
            }
        
            while(!stopped){
                
                const currentNode = this._nodes.find(node => node.id === this._currentNodeId);
    
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
                    this._transferQueue = currentNode.getQueueID()
                    return
                }
                
                const nextEdges = this._edges.filter(edge => edge.source === this._currentNodeId);
                this._visitedNodesId.add(this._currentNodeId);
                const tempNode = this._nodePrototype.getNodeByType(currentNode)
    
                if(currentNode.type === 'print')
                    stopped = true
                
                if(this._isDecisionNode(currentNode.type)){
                    this._currentNodeId = await tempNode.run(nextEdges,this._variables)
                }else{
                    this._currentNodeId = await tempNode.run(nextEdges[0],this._variables)
                }
                
            }
            
        } catch (error){
            console.log("Error runing nextStep",error);
        }
    }

    getInput(){
        return this._variables.get('inter_input')
    }

    _isDecisionNode(type){
        return type === 'condition' || type === 'switch' || type === 'intent' || type === 'case'
    }

    
}

module.exports = FlowCode