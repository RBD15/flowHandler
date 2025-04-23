const { default: mongoose } = require("mongoose");

class DbClient {
    #uri
    constructor() {
        this.#uri  = 'mongodb://localhost:27016/test'
        this.#init()
    }

    async #init(){
        try {
            await mongoose.connect(this.#uri, { authSource: "admin", user: "root", pass: "12345678", useNewUrlParser: true, useUnifiedTopology: true });
            console.log('Conexión exitosa a MongoDB en localhost');
        } catch (error) {
            console.error('Error al conectarse o al obtener datos:', error);
        }
    }

    async closeConnection(){
        await mongoose.connection.close();
        console.log('Conexión cerrada');
    }
}

module.exports = DbClient