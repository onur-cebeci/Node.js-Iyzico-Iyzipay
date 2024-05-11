import iyzipay from "../connection/iyzipay.js";

export const checkInstallment = (data)=>{
    return new Promise((resolve,reject)=>{
iyzipay.installmentInfo.retrieve(data,(err,result)=>{

    if(err){
        reject(err);
    }else{
        resolve(result);
    }
});
    });
}