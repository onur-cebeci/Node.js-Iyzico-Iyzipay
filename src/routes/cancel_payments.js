import {Types} from "mongoose";
import  nanoid  from "../utils/nanoid";
import ApiError from "../error/api_error.js";
import Session from "../middlewares/session.js";
import * as CancelPayments from "../services/iyzco/methods/cancel_payment.js";
import PaymentSuccess from "../db/payment_succes.js";


const {ObjectId} = Types;

const reasonEnum = ["double_payment","buyer_request","fraud","other"];

export default (router)=>{

    //Cancel Whole Payment
router.post("/payments/:paymentSuccessId/cancel",Session,async (req,res)=>{
    
    const {reason,description} = req.body;
    const {paymentSuccessId} = req.params;
    const reasonObj = {};

    if(!paymentSuccessId){
        throw new ApiError("PaymentSuccessId is Required",400,"paymentSuccessIdRequered");
    }

    if(reason && description){
        if(!reasonEnum.includes(reason)){
             throw new ApiError("Invalid cancel payment reason",400,"inivalidCancelPaymentReason");
        }
        reasonObj.reason = reason;
        reasonObj.description = description;
    }

    const payment = await PaymentSuccess.findOne({_id: new ObjectId(paymentSuccessId)});
    const result = await CancelPayments.cancelPayment({

        locale:req.user?.locale,
        conversationId:nanoid(),
        paymentId:payment?.paymentId,
        ip:req.user?.ip,
        //reasonObj içerisindeki her key buraya aktarılmış oluyo
        ...reasonObj
    });

        res.json(result);

})

} 