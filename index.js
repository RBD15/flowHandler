const FlowHandler = require("./src/Flow/Application/FlowHandler");
const DbClient = require("./src/shared/DBClient");
const FileClient = require("./src/shared/FileClient");

async function run(){

    let client
    try {
        const uri = 'mongodb://localhost:27017/test'
        client = new DbClient(uri)
        await client.connect()
        
        const dirPath = '/src/data.json'
        //client = new FileClient(dirPath)
    } catch (error) {
        console.log("Error",error);
    }

    const flow = await client.getData()
    console.log("Flow",flow);
    
    try {
        let ended = false
        const flowHandler = new FlowHandler(flow)
        const initState = flowHandler.getFlowState()
    
        await flowHandler.exec()
        flowHandler.setFlow(initState)
        while (!ended) {
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

