import Iyzipay from "iyzipay";
import ApiError from "../error/api_error.js";
import Session from "../middlewares/session.js";
import * as RefundPayments from "../services/iyzco/methods/refund_paymet.js";
import nanoid from "../utils/nanoid.js";
import PaymentSuccess from "../db/payment_succes.js";


const reasonEnum = ["double_payment","buyer_request","fraud","other"];


export default (router)=>{


    router.post("/payments/:paymentTransactionId/refund",Session,async(req,res)=>{

        const {paymentTransactionId} = req.params;
        const reasonObj = {};
        const {reason,description} = req.body;
        
        if(!paymentTransactionId){

            throw new ApiError("PaymentTransactionId is required",400,"paymentTransactionIdRequired");
        }


        if(reason && description){
        if(!reasonEnum.includes(reason)){
             throw new ApiError("Invalid cancel payment reason",400,"inivalidCancelPaymentReason");
        }
        reasonObj.reason = reason;
        reasonObj.description = description;
    }

        const payment = await PaymentSuccess.findOne({
            //Bir obje arrayi içerisinde bir key aramak istiyorsak obje noticeyonu ile bulabiliriz
            "itemTransactions.paymentTransactionId":paymentTransactionId
    
    });

    const currentItemTransaction = payment.itemTransactions.find((itemTransaction,index)=>{
        return itemTransaction.paymentTransactionId === paymentTransactionId
    });

    const result = await RefundPayments.refundPayment({

        locale:req.user?.locale,
        conversationId:nanoid(),
        paymentTransactionId: currentItemTransaction?.paymentTransactionId,
        price:req.body?.refundPrice || currentItemTransaction?.paidPrice,
        currency:Iyzipay.CURRENCY.TRY,
        ip:req.user?.ip,
        ...reasonObj
    })

    res.json(result);

    })


}

