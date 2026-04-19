const VariableNode = require('../../Node/Domain/VariableNode');
const ConditionNode = require('../../Node/Domain/ConditionNode');
const InitNode = require('../../Node/Domain/InitNode');
const EndNode = require('../../Node/Domain/EndNode');
const PrintNode = require('../../Node/Domain/PrintNode');
const QueueNode = require('../../Node/Domain/QueueNode');
const ApiNode = require('../../Node/Domain/ApiNode');
const TalkNode = require('../../Node/Domain/TalkNode');
const MenuNode = require('../../Node/Domain/MenuNode');
const CaseNode = require('../../Node/Domain/CaseNode');

class NodePrototype{

    #nodes
    #nodeTypes
    #writeInterface
    #debug
    #nodeClassList
    #nodeClassMap
    #staticClassMap
    constructor(writeInterface,debug=false,nodeClasses=null){
        this.#nodes = new Set()
        this.#nodeTypes = new Map()
        this.#writeInterface = writeInterface
        this.#nodeClassList = nodeClasses
        this.#nodeClassMap = new Map()
        this.#staticClassMap = new Map([
            ['variable', VariableNode],
            ['condition', ConditionNode],
            ['init', InitNode],
            ['end', EndNode],
            ['print', PrintNode],
            ['queue', QueueNode],
            ['api', ApiNode],
            ['talk', TalkNode],
            ['menu', MenuNode],
            ['case', CaseNode]
        ])
        this.#init()
        this.#debug = debug
    }

    #init(){
        if (Array.isArray(this.#nodeClassList) && this.#nodeClassList.length > 0) {
            this.#nodeClassList.forEach((entry) => {
                if (entry && typeof entry === 'object' && entry.type && entry.NodeClass) {
                    const normalizedType = String(entry.type).toLowerCase()     
                    this.#nodeClassMap.set(normalizedType, entry.NodeClass)     
                    return
                }

                const cls = entry
                if (cls?.name && cls.name !== 'Node') {
                    this.#nodeClassMap.set(this.#removeSubString(cls.name,'Node',true), cls)
                }
            })
        }
    }

    #removeSubString(cadena, textoAEliminar,lowCase=false) {
        if (cadena.endsWith(textoAEliminar)) {
            cadena = cadena.slice(0, -textoAEliminar.length); // Elimina el texto final
        }
        if(lowCase)
            return cadena.toLowerCase();
        return cadena
    }

    getNodeByType(node){
        let interNode
        const {type,id,data} = node
        
        const nodeType = String(type || '').toLowerCase()

        // 1. Prioritize nodeClassMap (custom classes from constructor)
        if (this.#nodeClassMap.has(nodeType)) {
            const NodeClass = this.#nodeClassMap.get(nodeType)
            interNode = new NodeClass(id,data)
        } 
        // 2. Use Static Map (safe removal of eval)
        else if (this.#staticClassMap.has(nodeType)) {
            const NodeClass = this.#staticClassMap.get(nodeType)
            interNode = new NodeClass(id,data)
        }
        
        if (interNode) {
            if(['print', 'talk', 'menu'].includes(nodeType)){
                interNode.setWriteInterface(this.#writeInterface)
            }
            if(nodeType === 'print'){
                interNode.setDebug(this.#debug)
            }
            return interNode
        }

        // 3. Fallback to dynamic discovery (Legacy/Eval - Commented as reference)
        /*
        const currentType = this.#nodeTypes.get(type)
        if(currentType){
            // RCE vulnerability: dynamic instantiation via eval
            interNode = eval('new ' + currentType + '(' + id + ',' + JSON.stringify(data) + ')');
            if(interNode) return interNode
        }
        */

        throw new Error('Type wasnt valid')
    }

}

module.exports = NodePrototype
