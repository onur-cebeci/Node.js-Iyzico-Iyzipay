import iyzipay from "../connection/iyzipay.js";


export const refundPayment= (data)=>{

    return new Promise((resolve,rejct)=>{
        iyzipay.refund.create(data,(err,result)=>{

            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}