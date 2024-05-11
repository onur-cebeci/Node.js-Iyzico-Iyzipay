import mongoose from "mongoose";
import nanoid from '../utils/nanoid.js';

const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const ItemTransectionSchema = new Schema({

uid:{
        type:String,
        default:nanoid(),
        unique:true,
        required:true,
    },

    itemId:{
        type:ObjectId,
        ref:"Products",
        required:true,
    },
    paymentTransactionId:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    paidPrice:{
        type:Number,
        required:true,
    },


});


const PaymentSuccesSchema = new Schema({
uid:{
        type:String,
        default:nanoid(),
        unique:true,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:["success"]
    },
    cartId:{
        type:ObjectId,
        ref:"Carts",
        required:true
    },
    conversationId:{
        type:String,
        required:true,
    },
    currency:{
        type:String,
        required:true,
        enum:["TRY","USD","EUR"]
    },
    paymentId:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true,
    },
    paidPrice:{
        type:Number,
        required:true,
    },

    itemTransactions:{
        type:[ItemTransectionSchema],
    },
    log:{
        type:Schema.Types.Mixed,
        required:true
    }


},{

        //Mongodb de otomatik id oluşturmasını istiyorum
    _id:true,
    collection:"payments-success",
    timestamps:true,
    toJSON:{

        transform:(doc,ret)=>{
            delete ret.__v;
            return {
                ...ret
            }
        }
    }

})

const PaymentSuccess = mongoose.model("PaymentSuccess",PaymentSuccesSchema);

export default PaymentSuccess;
