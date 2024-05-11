import {Types} from "mongoose";
import moment from "moment";
import Session from "../middlewares/session.js";
import nanoid from "../utils/nanoid.js";
import * as Installments from "../services/iyzco/methods/installments.js";
import ApiError from "../error/api_error.js";
import Carts from "../db/carts.js";

const {ObjectId} = Types;


//Fiyata göre taksit kontrollu
export default (router)=>{
    router.post("/installments",Session,async (req,res)=>{
        const  {binNumber,price} = req.body;
        if(!binNumber || !price){
            throw new ApiError("Missing Parameters",400,"missingParameters");
        }
        const result = await Installments.checkInstallment({

            locale:req.user?.locale,
            conversationId:nanoid(),
            binNumber:binNumber,
            price:price,
        });
        res.json(result);
    });


    //Sepete fiyatına göre taksit kontrollu
    
router.post("/installments/:cartId",Session,async (req,res)=>{

    const binNumber =req.body.binNumber;
    const cartId =req.params.cartId;

    if(!cartId){
        throw ApiError("Cart id is required",400,"cartIDRequired");
    }

    const cart = await Carts.findOne({
        _id:new ObjectId(cartId),
    }).populate("products",{
        _id:1,
        price:1
    });
    //reduce ile fiyat bilgilerini topluyoruz 
    const price = cart.products
    .map((product)=>product.price)
    .reduce((a,b)=>a+b,0);

    if(!binNumber || !price){
           throw ApiError("Missing parameters",400,"missingParameters");
    }
    
           const result = await Installments.checkInstallment({
            locale:req.user?.locale,
            conversationId:nanoid(),
            binNumber:binNumber,
            price:price,
        });
    res.json(result);
})
}