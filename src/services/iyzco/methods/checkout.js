import iyzipay from "../connection/iyzipay.js";


export const initialize=(data)=>{
    return new Promise((reolve,reject)=>{
        iyzipay.checkoutFormInitialize.create(data,(err,result)=>{
            if(err){
                reject(err)
            }else{
                reolve(result)
            }
        })
    })
}


export const getFormPayment = (data)=>{
    return new Promise((resolve,reject)=>{
        iyzipay.checkoutForm.retrieve(data,(err,result)=>{
            if(err){
                reject(er)
            }else{
                resolve(result);
            }
        })
    })
}