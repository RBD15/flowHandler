const FlowHandler = require("./src/Flow/Application/FlowHandler");
const NodePrototype = require("./src/Flow/Application/NodePrototype");
const FlowCode = require("./src/Flow/Domain/FlowCode");
const DbClient = require("./src/shared/DBClient");
const FileClient = require("./src/shared/FileClient");
const ConsoleWriteInterface = require("./src/Tester/Domain/ConsoleWriteInterface");
require('dotenv').config();

async function run(){

    let client
    try {
        const uri = process.env.DB_URI
        if (uri) {
            client = new DbClient(uri)
            await client.connect()
        } else {
            console.log('DB_URI is missing. Using local file data instead.');
            // const dirPath = '/src/data.json'
            // client = new FileClient(dirPath)
            return
        }
    } catch (error) {
        console.log("Error",error);
    }

    const flowData = await client.getData()
    console.log("flowData",flowData);
    
    try {
        let ended = false
        const debug= true
        const writeInterface = new ConsoleWriteInterface()
        const nodePrototype = new NodePrototype(writeInterface,debug)
        const flowCode = new FlowCode(flowData.nodes,flowData.edges,{},nodePrototype)
        
        const flowHandler = new FlowHandler(flowCode)
        // const initState = flowHandler.getFlowState()
    
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

