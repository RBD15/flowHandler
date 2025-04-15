const fs = require('fs');

function loadFlow(fileDir){
    try {
        const data = fs.readFileSync(fileDir, 'utf8')
        if (!data) {
            // console.error('Error al leer el archivo JSON:', err);
            return;
        }
        return JSON.parse(data);
    } catch (parseError) {
        console.error('Error al analizar el archivo JSON:', parseError);
    }
}

module.exports = {loadFlow}
