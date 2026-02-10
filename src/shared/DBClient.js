const { default: mongoose } = require("mongoose");
const flowModel = require("../Flow/Domain/FlowModel");

class DbClient {
    #uri
    constructor(uri) {
        this.#uri  = uri
    }

    async connect(){
        try {
            await mongoose.connect(this.#uri, {
                 authSource: "admin",
                //  user: "root",
                //  pass: "12345678",
                 useNewUrlParser: true,
                 useUnifiedTopology: true
             });
            console.log('Conexión exitosa a MongoDB en localhost');
        } catch (error) {
            console.error('Error al conectarse o al obtener datos:', error);
        }
    }

    async closeConnection(){
        await mongoose.connection.close();
        console.log('Conexión cerrada');
    }

    async getData(idFlow="2000"){
        const flow = await flowModel.find({code:idFlow});
        console.log("Flow from DB",flow);
        return flow[0].data
    }
}

module.exports = DbClient