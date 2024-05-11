import "express-async-errors";
import dotenv from "dotenv";
import config from "./config.js";
import express from "express";
import logger from "morgan";
import https from "https";
import fs from "fs";
import path from "path";
import GenericErrorHandler from "./middlewares/generic_error_handler.js";
import ApiError from "./error/api_error.js";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import DBModels from "./db";
import passport from "passport";
import { ExtractJwt , Strategy as JwtStrategy} from "passport-jwt";
import Users from "./db/users.js";
import Session from "./middlewares/session.js";
import routes from "./routes/index.js";



const envPath = config?.production
? "./env/.prod"
: "./env/.dev"


dotenv.config({
    path:envPath
});

//Begin MONGODB CONNECTİON

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to MongoDb");
}).catch((err)=>{
    console.log(err);
});


//END MONGO DB CONNECTİON

const app = express();
const router = express.Router();


app.use(logger(process.env.LOGGER));

app.use(helmet());
app.use(cors({
    //origin: keyi kullanacağımız domaini olarak belirleyebiliriz sadece o domainden gelen istekleri onaylar
   //  origin:"*" bütün domainlerden istek alabilir
   //  origin:"www.onurcebeci.com" sadece bu domainden istek alabilir
    origin:"*"
    
}))

//max 1mb verilerin sunucuya gönderilmesini sağlıyoruz bir anda yüksek veri gönderimi ile sunucunun çökmemesi için önemli
app.use(express.json({
    limit:"1mb"
}));

app.use(express.urlencoded({extended:true}));



passport.serializeUser((user,done)=>{
    done(null,user);
});

passport.deserializeUser((id,done)=>{
    done(null,id);
});

app.use(passport.initialize());


const jwtOpts = {
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOpts,async (jwtPayload,done)=>{
    try{
        const user= await Users.findOne({_id:jwtPayload._id});
        if(user){
            done(null,user.toJSON());
        }else{
            done(new ApiError("Authorization is not valid",401,"authorizationInvalid"),false);
        }

    }catch(err){
            return done(err,false);
    }
}));


/*

app.use("/",(req,res)=>{
    throw new ApiError("Bir hata oluştu",404,"something wrong")
    res.json({
        test:1
    });
})

*/


routes.forEach((routeFn,index)=>{
routeFn(router);
});

app.use("/api",router);

app.all("/test-auth",Session,(req,res)=>{
res.json({
    test:true,
})
});

app.use(GenericErrorHandler);

if(process.env.HTTPS_ENABLED === 'true'){
    const key = fs.readFileSync(path.join(__dirname,"./certs/key.pem")).toString();
    const cert = fs.readFileSync(path.join(__dirname,"./certs/cert.pem")).toString();
    

    const server = https.createServer({key:key,cert:cert},app);

    server.listen(process.env.PORT,()=>{
console.log(`Express Uygulaması ${process.env.PORT} üzerinde çalışmakta`);
    });



}else{


app.listen(process.env.PORT,()=>{
    console.log(`Express Uygulaması ${process.env.PORT} üzerinde çalışmakta`);
})

}



