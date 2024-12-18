import mongoose from "mongoose";

const fundSchema = mongoose.Schema({
    email: { 
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    plan: {
       type: String,
       required: true
    },
},{ 
    timestamps: true
});

const fundModel = mongoose.model("FundModel", fundSchema)

export default fundModel;