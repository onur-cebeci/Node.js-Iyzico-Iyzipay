"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var _api_error = _interopRequireDefault(require("../error/api_error.js"));
var _session = _interopRequireDefault(require("../middlewares/session.js"));
var CancelPayments = _interopRequireWildcard(require("../services/iyzco/methods/cancel_payment.js"));
var _payment_succes = _interopRequireDefault(require("../db/payment_succes.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  ObjectId
} = _mongoose.Types;
const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];
var _default = router => {
  //Cancel Whole Payment
  router.post("/payments/:paymentSuccessId/cancel", _session.default, async (req, res) => {
    const {
      reason,
      description
    } = req.body;
    const {
      paymentSuccessId
    } = req.params;
    const reasonObj = {};
    if (!paymentSuccessId) {
      throw new _api_error.default("PaymentSuccessId is Required", 400, "paymentSuccessIdRequered");
    }
    if (reason && description) {
      if (!reasonEnum.includes(reason)) {
        throw new _api_error.default("Invalid cancel payment reason", 400, "inivalidCancelPaymentReason");
      }
      reasonObj.reason = reason;
      reasonObj.description = description;
    }
    const payment = await _payment_succes.default.findOne({
      _id: new ObjectId(paymentSuccessId)
    });
    const result = await CancelPayments.cancelPayment({
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      paymentId: payment?.paymentId,
      ip: req.user?.ip,
      //reasonObj içerisindeki her key buraya aktarılmış oluyo
      ...reasonObj
    });
    res.json(result);
  });
};
exports.default = _default;