const { loadFlow } = require("../Flow/Application/FlowLoader")
const path = require('path');

class FileClient {
    #fileDir
    constructor(filePath) {
        this.#fileDir = path.resolve(__dirname)+'/../../'+filePath
    }

    async getData(){
        const data = loadFlow(this.#fileDir)
        return data
    }
}

module.exports = FileClient