const DbClient = require("./src/shared/listeners/DBClient");
const FlowHandler = require("./src/Flow/Application/FlowHandler");
const flowModel = require("./src/Flow/Domain/FlowModel");
// const { loadFlow } = require("./src/Flow/Application/FlowLoader")
// const path = require('path');

// const fileDir = path.resolve(__dirname)+'/src/data.json'
// const data = loadFlow(fileDir)

const dbClient = new DbClient()

async function process(flow){
    const flowHandler = new FlowHandler(flow)
    const initState = flowHandler.getFlowState()
    await flowHandler.exec()
    flowHandler.setFlow(initState)
    await flowHandler.exec()
    await flowHandler.exec()
} 

async function run(){
    try {
        const flow = await flowModel.find({id:"1010"});
        await process(flow[0].data)
        await dbClient.closeConnection()
    } catch (error) {
        console.log("Error",error);
    }
}

run()

