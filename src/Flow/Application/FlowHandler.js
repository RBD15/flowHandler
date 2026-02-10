// const NodePrototype = require("./NodePrototype")
// const Flow = require("./../Domain/Flow")

class FlowHandler{

    #flow

    constructor(flow){
        this.#flow = flow
    }

    setFlow(flow){
        this.#flow = flow
    }

    getCurrentInput(){
        this.#flow.getInput()
    }

    setInput(input){
        if(!this.#flow)
            throw new Error("Flow isnt setup");
        this.#flow.setInput(input)
    }

    getFlowState(){
        return this.#flow.getState()
    }

    isFlowEnded(){
        return this.#flow.isEnded()
    }

    async exec(){
        if(!this.#flow)
            throw new Error("Flow wasnt setup");

        await this.#flow.nextStep()
        console.log(this.#flow.getInput());
        return
    }

}

module.exports = FlowHandler