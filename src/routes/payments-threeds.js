import moment from "moment";
import Carts from "../db/carts.js";
import ApiError from "../error/api_error.js";
import Session from "../middlewares/session.js";
import * as PaymentsThreeDs from "../services/iyzco/methods/threeds_payments.js";
import * as Cards from "../services/iyzco/methods/cards";
import Users from "../db/users.js";
import nanoid from "../utils/nanoid.js";
import {CompletePayment} from "../utils/payments.js";
import Iyzipay from "iyzipay";



export default  (router) =>{


    //Completa payment
    router.post("/threeds/payments/complete",async(req,res)=>{

        if(!req.body.paymentId){
            throw new ApiError("Payment id is requuired",400,"paymentIdRequired");
        }

        if(req.body.status != "success"){
             throw new ApiError("Payment cant be starred beacuse initilization failed",400,"initializationFailed");
        }

        const data = {
            locale:"tr",
            conversationId:nanoid(),
            paymentId:req.body.paymentId,
            conversationData: req.body.conversationData,
        }

        const result = await PaymentsThreeDs.completePayment(data);
        await CompletePayment(result);
        res.status(200).json(result);

    });


      // YENİ KARTLA ÖDEME OLUŞTUR VE Kart kaydı yok - THREEDS
    router.post("/threeds/payments/:cartId/with-new-card",Session,async(req,res)=>{

        const {card} = req.body;

        if(!card){
            throw new ApiError("Card is required",400,"cardRequired");

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

        card.registerCard= "0";
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
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard: card,
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

        
        

        let result = await PaymentsThreeDs.initializePayment(data);
        const html = Buffer.from(result?.threeDSHtmlContent,'base64').toString();
        res.send(html);

    });



 // YENİ KARTLA ÖDEME OLUŞTUR VE Kart kaydet - THREEDS
    router.post("/threeds/payments/:cartId/with-new-card/register-card",Session,async(req,res)=>{

        const {card} = req.body;

        if(!card){
            throw new ApiError("Card is required",400,"cardRequired");

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

        if(req.user?.cardUserKey){
            card.cardUserKey = req.user?.cardUserKey;
        }
        card.registerCard= "1";
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
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard: card,
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

        
        

        let result = await PaymentsThreeDs.initializePayment(data);

     if(!req.user?.cardUserKey){

        const user = await Users.findOne({_id:req.user?._id});
        user.cardUserKey = result?.cardUserKey;
        await user.save();

     }

        const html = Buffer.from(result?.threeDSHtmlContent,'base64').toString();
        res.send(html);

    });





    
      // Hali hazırdaki bir kart ile ödeme oluştur ve Kartı kaydet -THREEDS - CARDINDEX
    router.post("/threeds/payments/:cartId/:cardIndex/with-registered-card-index",Session,async(req,res)=>{

        const {cardIndex} = req.params;

        if(!cardIndex){
            throw new ApiError("Card is required",400,"cardRequired");

        }


        if(!req.user?.cardUserKey){
          throw new ApiError("No registered card available",400,"cardNotAvalable");
        }

        
            const cards = await Cards.getUserCards({
                    locale:req.user?.locale,
                    conversationId:nanoid(),
                    cardUserKey:req.user?.cardUserKey,

            });

            const index = parseInt(cardIndex);
            if(index >= cards?.cardDetails?.length){
                   throw new ApiError("Card doesnt exists",400,"cardIndexInvalid");
            }

            const {cardToken} = cards?.cardDetails[index];

           const card = {
            cardUserKey:req.user?.cardUserKey,
            cardToken,

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

        if(req.user?.cardUserKey){
            card.cardUserKey = req.user?.cardUserKey;
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
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard: card,
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

        
        

        let result = await PaymentsThreeDs.initializePayment(data);

        const html = Buffer.from(result?.threeDSHtmlContent,'base64').toString();
        res.send(html);

    });





    
      // Hali hazırdaki bir kart ile ödeme oluştur ve Kartı kaydet -THREEDS - CArdToken
    router.post("/threeds/payments/:cartId/with-registered-card-token",Session,async(req,res)=>{

        const {cardToken} = req.body;

        if(!cardToken){
            throw new ApiError("Card token is required",400,"cardTokenRequired");

        }


        if(!req.user?.cardUserKey){
          throw new ApiError("No registered card available",400,"cardNotAvalable");
        }

        
      
           const card = {
            cardUserKey:req.user?.cardUserKey,
            cardToken,

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

        if(req.user?.cardUserKey){
            card.cardUserKey = req.user?.cardUserKey;
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
            paymentGroup:Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl:`${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard: card,
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

        
        

        let result = await PaymentsThreeDs.initializePayment(data);

        const html = Buffer.from(result?.threeDSHtmlContent,'base64').toString();
        res.send(html);

    });





}