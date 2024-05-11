"use strict";

require("express-async-errors");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _config = _interopRequireDefault(require("./config.js"));
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _https = _interopRequireDefault(require("https"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _generic_error_handler = _interopRequireDefault(require("./middlewares/generic_error_handler.js"));
var _api_error = _interopRequireDefault(require("./error/api_error.js"));
var _helmet = _interopRequireDefault(require("helmet"));
var _cors = _interopRequireDefault(require("cors"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _db = _interopRequireDefault(require("./db"));
var _passport = _interopRequireDefault(require("passport"));
var _passportJwt = require("passport-jwt");
var _users = _interopRequireDefault(require("./db/users.js"));
var _session = _interopRequireDefault(require("./middlewares/session.js"));
var _index = _interopRequireDefault(require("./routes/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const envPath = _config.default?.production ? "./env/.prod" : "./env/.dev";
_dotenv.default.config({
  path: envPath
});

//Begin MONGODB CONNECTİON

_mongoose.default.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDb");
}).catch(err => {
  console.log(err);
});

//END MONGO DB CONNECTİON

const app = (0, _express.default)();
const router = _express.default.Router();
app.use((0, _morgan.default)(process.env.LOGGER));
app.use((0, _helmet.default)());
app.use((0, _cors.default)({
  //origin: keyi kullanacağımız domaini olarak belirleyebiliriz sadece o domainden gelen istekleri onaylar
  //  origin:"*" bütün domainlerden istek alabilir
  //  origin:"www.onurcebeci.com" sadece bu domainden istek alabilir
  origin: "*"
}));

//max 1mb verilerin sunucuya gönderilmesini sağlıyoruz bir anda yüksek veri gönderimi ile sunucunun çökmemesi için önemli
app.use(_express.default.json({
  limit: "1mb"
}));
app.use(_express.default.urlencoded({
  extended: true
}));
_passport.default.serializeUser((user, done) => {
  done(null, user);
});
_passport.default.deserializeUser((id, done) => {
  done(null, id);
});
app.use(_passport.default.initialize());
const jwtOpts = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};
_passport.default.use(new _passportJwt.Strategy(jwtOpts, async (jwtPayload, done) => {
  try {
    const user = await _users.default.findOne({
      _id: jwtPayload._id
    });
    if (user) {
      done(null, user.toJSON());
    } else {
      done(new _api_error.default("Authorization is not valid", 401, "authorizationInvalid"), false);
    }
  } catch (err) {
    return done(err, false);
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

_index.default.forEach((routeFn, index) => {
  routeFn(router);
});
app.use("/api", router);
app.all("/test-auth", _session.default, (req, res) => {
  res.json({
    test: true
  });
});
app.use(_generic_error_handler.default);
if (process.env.HTTPS_ENABLED === 'true') {
  const key = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/key.pem")).toString();
  const cert = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/cert.pem")).toString();
  const server = _https.default.createServer({
    key: key,
    cert: cert
  }, app);
  server.listen(process.env.PORT, () => {
    console.log(`Express Uygulaması ${process.env.PORT} üzerinde çalışmakta`);
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`Express Uygulaması ${process.env.PORT} üzerinde çalışmakta`);
  });
}