const fs = require('fs');
const path = require('path');
const VariableNode = require('../../Node/Domain/VariableNode');
const ConditionNode = require('../../Node/Domain/ConditionNode');
const InitNode = require('../../Node/Domain/InitNode');
const EndNode = require('../../Node/Domain/EndNode');
const PrintNode = require('../../Node/Domain/PrintNode');
const ReadInterface = require('../../Tester/Domain/ReadInterface');
const QueueNode = require('../../Node/Domain/QueueNode');

class NodePrototype{

    #nodes
    #nodeTypes
    #readInterface
    constructor(){
        this.#nodes = new Set()
        this.#nodeTypes = new Map()
        this.#init()
        //TODO: PrintNode needs a readInterface
        this.#readInterface = new ReadInterface()
    }

    #init(){
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
        const currentType = this.#nodeTypes.get(type)
        if(currentType){
            interNode = eval(`new ${currentType}(${id},${JSON.stringify(data)})`);
            if(currentType === 'PrintNode')
                interNode.setReadInterface(this.#readInterface)
            return interNode
        }else{
            throw new Error('Type wasnt valid')
        }
    }

}

module.exports = NodePrototype