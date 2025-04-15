const FlowHandler = require("./src/Flow/Application/FlowHandler")
const { loadFlow } = require("./src/Flow/Application/FlowLoader")
const path = require('path');

const fileDir = path.resolve(__dirname)+'/src/data.json'
const data = loadFlow(fileDir)

async function process(){
    const flowHandler = new FlowHandler(data)
    const initState = flowHandler.getFlowState()
    await flowHandler.exec()
   flowHandler.setFlow(initState)
    await flowHandler.exec()
    await flowHandler.exec()
} 

process()
