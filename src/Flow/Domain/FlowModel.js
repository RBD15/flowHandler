const { default: mongoose } = require("mongoose");

const flowSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true 
    }
});


const flowModel = mongoose.model('flow', flowSchema);

module.exports = flowModel