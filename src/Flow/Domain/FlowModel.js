const { default: mongoose } = require("mongoose");

const flowSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: Object,
        required: true 
    }
}, { collection: 'flows' });


const flowModel = mongoose.model('Flow', flowSchema);

module.exports = flowModel