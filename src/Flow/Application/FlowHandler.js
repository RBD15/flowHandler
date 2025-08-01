const NodePrototype = require("./NodePrototype")
const Flow = require("./../Domain/Flow")

class FlowHandler{
    #data
    #nodePrototype
    #flow
    constructor(data){
        this.#data = data
        this.#nodePrototype = new NodePrototype()
        this.#flow = new Flow(this.#data.nodes,this.#data.edges,{},this.#nodePrototype)
    }

    setFlow(flowState){
        this.#flow.setState(flowState)
        return this
    }

    getFlowState(){
        return this.#flow.getState()
    }

    isFlowEnded(){
        return this.#flow.isEnded()
    }

    async exec(){
        await this.#flow.nextStep()
        console.log(this.#flow.getInput());
        return
    }

}

module.exports = FlowHandler