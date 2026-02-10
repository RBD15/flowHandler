const { default: mongoose } = require("mongoose");
const { FLOW_TYPES_LIST, FLOW_TYPES } = require("../../models/flowEnums");

const flowSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    code:{
        type:Number,
        require:true
    },
    type: {
        type: String,
        require: true,
        enum:FLOW_TYPES_LIST,
        default: FLOW_TYPES.CHAT
    },
    data:{
        type: Object,
        require:true
    }
});


const flowModel = mongoose.model('flow', flowSchema);

module.exports = flowModel