"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
var _moment = _interopRequireDefault(require("moment"));
var _session = _interopRequireDefault(require("../middlewares/session.js"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
var Installments = _interopRequireWildcard(require("../services/iyzco/methods/installments.js"));
var _api_error = _interopRequireDefault(require("../error/api_error.js"));
var _carts = _interopRequireDefault(require("../db/carts.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  ObjectId
} = _mongoose.Types;

//Fiyata göre taksit kontrollu
var _default = router => {
  router.post("/installments", _session.default, async (req, res) => {
    const {
      binNumber,
      price
    } = req.body;
    if (!binNumber || !price) {
      throw new _api_error.default("Missing Parameters", 400, "missingParameters");
    }
    const result = await Installments.checkInstallment({
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      binNumber: binNumber,
      price: price
    });
    res.json(result);
  });

  //Sepete fiyatına göre taksit kontrollu

  router.post("/installments/:cartId", _session.default, async (req, res) => {
    const binNumber = req.body.binNumber;
    const cartId = req.params.cartId;
    if (!cartId) {
      throw (0, _api_error.default)("Cart id is required", 400, "cartIDRequired");
    }
    const cart = await _carts.default.findOne({
      _id: new ObjectId(cartId)
    }).populate("products", {
      _id: 1,
      price: 1
    });
    //reduce ile fiyat bilgilerini topluyoruz 
    const price = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    if (!binNumber || !price) {
      throw (0, _api_error.default)("Missing parameters", 400, "missingParameters");
    }
    const result = await Installments.checkInstallment({
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      binNumber: binNumber,
      price: price
    });
    res.json(result);
  });
};
exports.default = _default;