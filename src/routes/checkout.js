import moment from "moment";
import Carts from "../db/carts.js";
import ApiError from "../error/api_error.js";
import Session from "../middlewares/session.js";
import * as Checkout from "../services/iyzco/methods/checkout.js";
import * as Cards from "../services/iyzco/methods/cards";
import Users from "../db/users.js";
import nanoid from "../utils/nanoid.js";
import {CompletePayment} from "../utils/payments.js";
import Iyzipay from "iyzipay";




export default (router)=>{

    //Checkout From Complete payment
    router.post("/checout/complete/payment",async(req,res)=>{

        let result = await Checkout.getFormPayment({
                locale:"tr",
                conversationId:nanoid(),
                token:req.body.token,
        });

        await CompletePayment(result);
        res.json(result);
    });



    //Checkout From Initialize

    router.post("/checkout/:cartId",Session,async(req,res)=>{



        if(!req.user?.cardUserKey){
          throw new ApiError("No registered card available",400,"cardNotAvalable");
        }

        
 

        if(!req.params?.cartId){
          throw new ApiError("Card id is required",400,"cardIdRequired");
        }

        const cart = await Carts.findOne({_id:req.params?.cartId}).populate("buyer").populate("products");
        
        if(!cart){
        throw new ApiError("Card not found",404,"cartNotFound");
        }

        if(cart?.completed){
            throw new ApiError("Card is completed",400,"cardCompleted");
        }

    
      
        const paidPrice = cart.products.map((product)=>product.price).reduce((a,b)=> a+b,0);

        const data ={
            locale:req.user.locale,
            conversationId:nanoid(),
            price:paidPrice,
            paidPrice:paidPrice,
            currency:Iyzipay.CURRENCY.TRY,
            installments:"1",
            basketId:String(cart?._id),
            paymentChannel:Iyzipay.PAYMENT_CHANNEL.WEB,
            enableInstallments:[1,2,3,4,6,9],
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/checout/complete/payment`,
            ...req.user?.cardUserKey && {
                cardUserKey: req.user?.cardUserKey
            },
            buyer:{
                id:String(req.user?._id),
                name:req.user?.name,
                surname:req.user?.surname,
                gsmNumber:req.user?.phoneNumber,
                email:req.user?.email,
                identityNumber:req.user?.identityNumber,
                lastLoginDate:moment(req.user?.updatedAt).format("YYYY-MM-DD hh:mm:ss"),
               registrationDate:moment(req.user?.createdAt).format("YYYY-MM-DD hh:mm:ss"),
               registrationAddress:req.user?.address,
               ip:req.user?.ip,
               city:req.user?.city,
               country:req.user?.country,
              country:req.user?.country,
            },
            shippingAddress:{
                contactName:req.user?.name + " " + req.user?.surname,
                city:req.user?.city,
                country:req.user?.country,
                address:req.user?.address,
                zipCode:req.user?.zipCode,
            },
              billingAddress:{
                contactName:req.user?.name + " " + req.user?.surname,
                city:req.user?.city,
                country:req.user?.country,
                address:req.user?.address,
                zipCode:req.user?.zipCode,
            },
            basketItems:cart.products.map((product,_)=>{
                return {
                    id:String(product?._id),
                    name:product?.name,
                    category1:product?.categories[0],
                    category2:product?.categories[1],
                    itemType:Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price:product?.price,
                }
            }),
        }


  let result =await Checkout.initialize(data);
  const html = `<!DOCTYPE html> 
  <html>
  <head>
  <title>Ödeme Yap</title>
  <meta charset="UTF-8" />
  ${result?.checkoutFormContent}
  </head>
  </html>`;
  res.send(html);

    });




}