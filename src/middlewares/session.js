import passport from "passport";


const session = passport.authenticate("jwt",{session:false});


export default session;