const FlowHandler = require("./src/Flow/Application/FlowHandler");
const NodePrototype = require("./src/Flow/Application/NodePrototype");
const FlowCode = require("./src/Flow/Domain/FlowCode");
const DbClient = require("./src/shared/DBClient");
const FileClient = require("./src/shared/FileClient");
const ReadInterface = require("./src/Tester/Domain/ReadInterface");

async function run(){

    let client
    try {
        const uri = 'mongodb+srv://chat-real-time-v1:q8pWLlVeRQdJFlq8@testing.a0y02c4.mongodb.net/testv2'
        client = new DbClient(uri)
        await client.connect()
        
        const dirPath = '/src/data.json'
        //client = new FileClient(dirPath)
    } catch (error) {
        console.log("Error",error);
    }

    const flowData = await client.getData()
    console.log("flowData",flowData);
    
    try {
        let ended = false
        const writeInterface = new ReadInterface()
        const nodePrototype = new NodePrototype(writeInterface,true)
        const flowCode = new FlowCode(flowData.nodes,flowData.edges,{},nodePrototype)
        
        const flowHandler = new FlowHandler(flowCode)
        const initState = flowHandler.getFlowState()
    
        await flowHandler.exec()
        // flowCode.setInput(event.getMsg())
        // flowHandler.setFlow(initState)
        while (!ended) {
            flowHandler.setFlow(flowCode)
            await flowHandler.exec()
            ended = flowHandler.isFlowEnded()
        }
        console.log("Flow ending");
        return

    } catch (error) {
        console.log("Error",error);
    }
} 

run()

