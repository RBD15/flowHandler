class Flow{

    #nodes
    #edges
    #settings
    #currentNodeId
    #visitedNodesId
    #nodePrototype
    #variables
    #ended

    constructor(nodes,edges,settings,nodePrototype){
        this.#edges = edges
        this.#nodes = nodes
        this.#settings = settings
        this.#nodePrototype = nodePrototype
        this.#variables = new Map()
        this.#currentNodeId = "1"
        this.#visitedNodesId = new Set();
        this.#ended = false;        
    }

    getNodes(){
        return this.#nodes
    }

    getEdges(){
        return this.#edges
    }

    getSettings(){
        return this.#settings
    }

    async nextStep(input) {
        this.#variables.set('inter_input',input)
        let stopped = false

        if (this.#visitedNodesId.has(this.#currentNodeId)) {
            console.log("Se detectó un ciclo, deteniendo la ejecución.");
            return;
        }
    
        while(!stopped){
            
            const currentNode = this.#nodes.find(node => node.id === this.#currentNodeId);
            if(currentNode.type === 'end'){
                stopped = true
                this.#currentNodeId = null
                this.#ended= true;
                return
            }
            
            const nextEdges = this.#edges.filter(edge => edge.source === this.#currentNodeId);
            this.#visitedNodesId.add(this.#currentNodeId);
            const tempNode = this.#nodePrototype.getNodeByType(currentNode)

            if(this.#isDecisionNode(currentNode.type)){
                this.#currentNodeId = await tempNode.run(nextEdges,this.#variables)
            }else{
                this.#currentNodeId = await tempNode.run(nextEdges[0],this.#variables)
            }
        }
        console.log("Terminando");
    }

    getInput(){
        return this.#variables.get('inter_input')
    }

    #isDecisionNode(type){
        return type === 'condition' || type === 'switch' || type === 'intent'
    }

    isEnded(){
        return this.#ended
    }
    
}

module.exports = Flow