"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _users = _interopRequireDefault(require("../db/users.js"));
var _api_error = _interopRequireDefault(require("../error/api_error.js"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await _users.default.findOne({
      email: email
    });
    if (!user) {
      throw new _api_error.default("Incorrect password or email", 401, "userOrPasswordIncorrect");
    }
    const passwordConfirmed = await _bcryptjs.default.compare(password, user.password);
    if (passwordConfirmed) {
      const UserJson = user.toJSON();

      //token oluşturuyoruz
      const token = _jsonwebtoken.default.sign(UserJson, process.env.JWT_SECRET);
      res.json({
        token: `Bearer ${token}`,
        user: UserJson
      });
    } else {
      throw new _api_error.default("Incorrect password or email", 401, "userOrPasswordIncorrect");
    }
  });
};
exports.default = _default;