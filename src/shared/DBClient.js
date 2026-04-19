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
                 serverSelectionTimeoutMS: 5000,
                 connectTimeoutMS: 10000,
                 useNewUrlParser: true,
                 useUnifiedTopology: true
             });

            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('MongoDB disconnected');
            });

            console.log('Successfully connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error; // Rethrow to allow bootstrap fallback
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