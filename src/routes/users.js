import Users from "../db/users.js";
import ApiError from "../error/api_error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default (router) =>{

    router.post("/login",async(req,res)=>{

        const email = req.body.email;
        const password = req.body.password;
        const user = await Users.findOne({email:email});

        if(!user){
            throw new ApiError("Incorrect password or email",401,"userOrPasswordIncorrect");
        }

        const passwordConfirmed = await bcrypt.compare(password,user.password);
        
        if(passwordConfirmed){
            const UserJson = user.toJSON();

            //token oluşturuyoruz
            const token = jwt.sign(UserJson,process.env.JWT_SECRET);
            res.json({
                token: `Bearer ${token}` ,
                user:UserJson,
            });
        }else{
             throw new ApiError("Incorrect password or email",401,"userOrPasswordIncorrect");
        }
    });

}