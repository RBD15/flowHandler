const FlowHandler = require("./src/Flow/Application/FlowHandler");
const NodePrototype = require("./src/Flow/Application/NodePrototype");
const FlowCode = require("./src/Flow/Domain/FlowCode");
const DbClient = require("./src/shared/DBClient");
const FileClient = require("./src/shared/FileClient");
const ConsoleWriteInterface = require("./src/Tester/Domain/ConsoleWriteInterface");
const path = require('path');
require('dotenv').config();

let client;

async function gracefulShutdown() {
    console.log('\nShutting down gracefully...');
    if (client && typeof client.closeConnection === 'function') {
        await client.closeConnection();
    }
    process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

async function run(){

    try {
        const uri = process.env.DB_URI
        if (uri) {
            client = new DbClient(uri)
            await client.connect()
        } else {
            console.warn('DB_URI is missing. Falling back to FileClient.');
            const dataPath = path.join(__dirname, 'src', 'data.json');
            client = new FileClient(dataPath);
        }
    } catch (error) {
        console.error("Bootstrap error, attempting FileClient fallback:", error.message);
        const dataPath = path.join(__dirname, 'src', 'data.json');
        client = new FileClient(dataPath);
    }

    let flowData;
    try {
        flowData = await client.getData();
        if (!flowData) throw new Error("No flow data received");
    } catch (e) {
        console.error("Critical: Could not load flow data:", e.message);
        process.exit(1);
    }
    
    try {
        let ended = false
        const debug = true
        const writeInterface = new ConsoleWriteInterface()
        const nodePrototype = new NodePrototype(writeInterface, debug)
        const flowCode = new FlowCode(flowData.nodes, flowData.edges, {}, nodePrototype)
        
        const flowHandler = new FlowHandler(flowCode)

        while (!ended) {
            await flowHandler.exec()
            ended = flowHandler.isFlowEnded()
        }
        console.log("Flow execution completed successfully");
        
        if (client && typeof client.closeConnection === 'function') {
            await client.closeConnection();
        }

    } catch (error) {
        console.error("Execution error:", error);
        process.exit(1);
    }
} 

run()

