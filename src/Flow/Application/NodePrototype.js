const VariableNode = require('../../Node/Domain/VariableNode');
const ConditionNode = require('../../Node/Domain/ConditionNode');
const InitNode = require('../../Node/Domain/InitNode');
const EndNode = require('../../Node/Domain/EndNode');
const PrintNode = require('../../Node/Domain/PrintNode');
const QueueNode = require('../../Node/Domain/QueueNode');
const ApiNode = require('../../Node/Domain/ApiNode');
const CaseNode = require('../../Node/Domain/CaseNode');

class NodePrototype{

    #nodes
    #nodeTypes
    #writeInterface
    #debug
    #nodeClassList
    #nodeClassMap
    constructor(writeInterface,debug=false,nodeClasses=null){
        this.#nodes = new Set()
        this.#nodeTypes = new Map()
        this.#writeInterface = writeInterface
        this.#nodeClassList = nodeClasses
        this.#nodeClassMap = new Map()
        this.#init()
        this.#debug = debug
    }

    #init(){
        if (Array.isArray(this.#nodeClassList) && this.#nodeClassList.length > 0) {
            const names = []
            this.#nodeClassList.forEach((entry) => {
                if (entry && typeof entry === 'object' && entry.type && entry.NodeClass) {
                    const normalizedType = String(entry.type).toLowerCase()
                    this.#nodeClassMap.set(normalizedType, entry.NodeClass)
                    names.push(entry.NodeClass?.name || `${entry.type}Node`)
                    return
                }

                const cls = entry
                if (cls?.name && cls.name !== 'Node') {
                    this.#nodeClassMap.set(this.#removeSubString(cls.name,'Node',true), cls)
                    names.push(cls.name)
                }
            })
            this.#recordNodesType(names)
            return
        }
        const fs = require('fs');
        const path = require('path');
        // Ruta del directorio que deseas analizar
        const directoryPath = path.resolve(__dirname)+'../../../Node/Domain';        
        const nodeClasses = this.#getNodeClasses(directoryPath);  
        this.#recordNodesType(nodeClasses)
    }

    // Función para encontrar clases en el contenido del archivo
    #extractClasses(fileContent) {
        const classRegex = /class\s+([A-Za-z0-9_]+)/g;
        const classes = [];
        let match;
        while ((match = classRegex.exec(fileContent)) !== null) {
            classes.push(match[1]); // Nombre de la clase
        }         
        return classes[0];
    }
  
    // Función principal para analizar archivos en un directorio
    #getNodeClasses(directoryPath) {   
        try {
            const fs = require('fs');
            const path = require('path');
            const files = fs.readdirSync(directoryPath)            
            return files.map((file) => {
                const fullPath = path.join(directoryPath, file);                
                if (path.extname(fullPath) === '.js') {
                    try {
                        const content = fs.readFileSync(fullPath, 'utf-8')                           
                        return this.#extractClasses(content);
                    }catch(error){
                        console.error(`Error al leer el archivo ${file}:`, error);
                    }
                }
            });
        } catch (error) {
            console.error('Error al leer el directorio:', error);
        }     
        return classes
    }

    #recordNodesType(nodeClasses){
        if (nodeClasses.length > 0) {
            nodeClasses.forEach((cls) => {
                if(cls !== 'Node')
                    this.#nodeTypes.set(this.#removeSubString(cls,'Node',true),cls)
            });
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
        if (this.#nodeClassMap.size > 0) {
            const nodeType = String(type || '').toLowerCase()
            const NodeClass = this.#nodeClassMap.get(nodeType)
            if (!NodeClass) {
                throw new Error('Type wasnt valid')
            }
            interNode = new NodeClass(id,data)
            if(nodeType === 'print'){
                interNode.setDebug(this.#debug)
                interNode.setWriteInterface(this.#writeInterface)
            }
            if(nodeType === 'talk'){
                interNode.setWriteInterface(this.#writeInterface)
            }
            if(nodeType === 'menu'){
                interNode.setWriteInterface(this.#writeInterface)
            }
            return interNode
        }
        const currentType = this.#nodeTypes.get(type)
        if(currentType){
            interNode = eval(`new ${currentType}(${id},${JSON.stringify(data)})`);
            if(currentType === 'PrintNode'){
                interNode.setDebug(this.#debug)
                interNode.setWriteInterface(this.#writeInterface)
            }
            if(currentType === 'TalkNode'){
                interNode.setWriteInterface(this.#writeInterface)
            }
            if(currentType === 'MenuNode'){
                interNode.setWriteInterface(this.#writeInterface)
            }
            return interNode
        }else{
            throw new Error('Type wasnt valid')
        }
    }

}

module.exports = NodePrototype