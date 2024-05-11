import ApiError from "../error/api_error.js";
import * as Cards from "../services/iyzco/methods/cards.js";
import Users from "../db/users.js";
import nanoid from "../utils/nanoid";
import Session from "../middlewares/session.js";

export default (router)=>{
//Kart ekleme
router.post("/cards",Session,async(req,res)=>{

    const card = req.body.card;

    let result = await Cards.createUserCard({
            
        locale:req.user.locale,
        conversationId:nanoid(),
        email:req.user.email,
        externalId:nanoid(),
        //sorgulama yapıyoruz eğer kart user key varsa bu değeri kullan demiş olduk.
        ...req.user?.cardUserKey && {
            cardUserKey:req.user.cardUserKey,
        },
        card:card
        });

        if(!req.user.cardUserKey){
            if(result?.status === "success" && result?.cardUserKey){
                const user = await Users.findOne({
                    _id:req.user?._id,
                });
                user.cardUserKey =result?.cardUserKey;
                await user.save();

            }
        }
        res.json(result);
});


//Kart okema 

router.get('/cards',Session,async(req,res)=>{

    if(!req.user?.cardUserKey){
        throw new ApiError("User has no credit card",403,"userHasNoCard");
    }

    let cards = await Cards.getUserCards({
        locale:req.user.locale,
        conversationId:nanoid(),
        cardUserKey:req.user?.cardUserKey,
    });
    res.status(200).json(cards); 

});


//Kart Silme - Token

router.delete("/cards/delete-by-token",Session,async (req,res)=>{

    const cardToken = req.body.cardToken;
    
    if(!cardToken){
        
        throw new ApiError("Card token is required",400,"cardTokenRequired");
    }
        let deleteResult = await Cards.deleteUserCard({
            locale:req.user?.locale,
            conversationId:nanoid(),
            cardUserKey:req.user?.cardUserKey,
            cardToken:cardToken,
        });
        res.status(200).json(deleteResult);
});



//Kart Silme Index

router.delete("/cards/:cardIndex/delete-by-index",Session,async (req,res)=>{

    if(!req.params?.cardIndex){
        throw new ApiError("Card Index is required",400,"cardIndexRequired");
    }

    let cards = await Cards.getUserCards({
        locale: req.user.locale,
        conversationId:nanoid(),
        cardUserKey:req.user?.cardUserKey,
    })
    //parametre olarak gönderceğimiz kart parametresini int e çevirdik
    const index = parseInt(req.params?.cardIndex);

    if(index >=cards?.cardDetails.length){
        throw new ApiError("Card doesnt exists,check index number",400,"cardIndexInValid")
    }
    const cardToken = cards?.cardDetails[index].cardToken;

          let deleteResult = await Cards.deleteUserCard({
            locale:req.user?.locale,
            conversationId:nanoid(),
            cardUserKey:req.user?.cardUserKey,
            cardToken:cardToken,
        });

    res.json(deleteResult);

});


}

