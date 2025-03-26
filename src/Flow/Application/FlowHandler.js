class FlowHandler{

    constructor(){

    }

    run(node,edges){
        if(edges[0].type === "JUMP_TO_START") {
            console.log("Saltando al nodo inicial.");
            this.#currentNodeId = nodes.find(node => node.type === "init").id;
        }else if(edges[0].type === "condition"){
            if()

            this.#currentNodeId = edges.target;
        }else{
            this.#currentNodeId = edges[0].target;
        }
    }

}

module.exports = FlowHandler