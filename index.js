const { loadFlow } = require("./src/Flow/Application/FlowLoader")
const NodePrototype = require("./src/Flow/Application/NodePrototype")
const Flow = require("./src/Flow/Domain/Flow")

const data = loadFlow()

const nodePrototype = new NodePrototype()
const flow = new Flow(data.nodes,data.edges,{},nodePrototype)
flow.nextStep()