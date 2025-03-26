const NodePrototype = require("./src/Flow/Application/NodePrototype")
const Flow = require("./src/Flow/Domain/Flow")

const data = {
    nodes: [
        {
            "id": "1",
            "type": "init",
            "position": {
                "x": 150,
                "y": 75
            },
            "data": {
                "label": "init node"
            },
            "measured": {
                "width": 47,
                "height": 49
            },
            "selected": false,
            "dragging": false
        },
        {
            "id": "2",
            "type": "variable",
            "position": {
                "x": 255,
                "y": 45
            },
            "data": {
                "label": "variable node",
                "name": "age",
                "value": "25"
            },
            "measured": {
                "width": 381,
                "height": 66
            },
            "selected": false,
            "dragging": false
        },
        {
            "id": "3",
            "type": "condition",
            "position": {
                "x": 240,
                "y": 210
            },
            "data": {
                "label": "condition node",
                "thenConnection": true,
                "elseConnection": true,
                "condition": ">",
                "name": "age",
                "value": "20"
            },
            "measured": {
                "width": 423,
                "height": 80
            },
            "selected": false,
            "dragging": false
        },
        {
            "id": "4",
            "type": "print",
            "position": {
                "x": 735,
                "y": 180
            },
            "data": {
                "label": "result node",
                "code": "Hola #{name}, tienes #{age}. Eres mayor de 20"
            },
            "measured": {
                "width": 102,
                "height": 36
            }
        },
        {
            "id": "5",
            "type": "print",
            "position": {
                "x": 765,
                "y": 270
            },
            "data": {
                "label": "result node",
                "code": "Hola #{name}, tienes #{age}. Eres menor de 20"
            },
            "measured": {
                "width": 102,
                "height": 36
            }
        },
        {
            "id": "6",
            "type": "end",
            "position": {
                "x": 900,
                "y": 225
            },
            "data": {
                "label": "end node"
            },
            "measured": {
                "width": 47,
                "height": 49
            }
        }
    ],
    edges: [
        {
            "source": "1",
            "target": "2",
            "id": "xy-edge__1-2"
        },
        {
            "source": "2",
            "target": "3",
            "id": "xy-edge__2-3"
        },
        {
            "source": "3",
            "target": "5",
            "id": "xy-edge__3-5",
            "label": "ELSE",
            "type": "condition"
        },
        {
            "source": "3",
            "target": "4",
            "id": "xy-edge__3-4",
            "label": "THEN",
            "type": "condition"
        },
        {
            "source": "4",
            "target": "6",
            "id": "xy-edge__4-6"
        },
        {
            "source": "5",
            "target": "6",
            "id": "xy-edge__5-6"
        }
    ]
}

const nodePrototype = new NodePrototype()
const flow = new Flow(data.nodes,data.edges,{},nodePrototype)
flow.nextStep()