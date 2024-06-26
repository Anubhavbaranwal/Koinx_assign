import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    utctime: {
        type:Date,
        required:true,
    },
    operation: {
        type:String,
        
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    amount: {
        type:Number,
        required:true,
    },
    basecoin: {
        type:String,
        required:true,
    },
    quotecoin: {
        type:String,
        required:true,
    }
});

export const Trade = mongoose.model("Trade", tradeSchema);

