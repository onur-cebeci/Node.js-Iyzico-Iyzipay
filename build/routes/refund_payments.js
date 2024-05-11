"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _iyzipay = _interopRequireDefault(require("iyzipay"));
var _api_error = _interopRequireDefault(require("../error/api_error.js"));
var _session = _interopRequireDefault(require("../middlewares/session.js"));
var RefundPayments = _interopRequireWildcard(require("../services/iyzco/methods/refund_paymet.js"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
var _payment_succes = _interopRequireDefault(require("../db/payment_succes.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];
var _default = router => {
  router.post("/payments/:paymentTransactionId/refund", _session.default, async (req, res) => {
    const {
      paymentTransactionId
    } = req.params;
    const reasonObj = {};
    const {
      reason,
      description
    } = req.body;
    if (!paymentTransactionId) {
      throw new _api_error.default("PaymentTransactionId is required", 400, "paymentTransactionIdRequired");
    }
    if (reason && description) {
      if (!reasonEnum.includes(reason)) {
        throw new _api_error.default("Invalid cancel payment reason", 400, "inivalidCancelPaymentReason");
      }
      reasonObj.reason = reason;
      reasonObj.description = description;
    }
    const payment = await _payment_succes.default.findOne({
      //Bir obje arrayi içerisinde bir key aramak istiyorsak obje noticeyonu ile bulabiliriz
      "itemTransactions.paymentTransactionId": paymentTransactionId
    });
    const currentItemTransaction = payment.itemTransactions.find((itemTransaction, index) => {
      return itemTransaction.paymentTransactionId === paymentTransactionId;
    });
    const result = await RefundPayments.refundPayment({
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      paymentTransactionId: currentItemTransaction?.paymentTransactionId,
      price: req.body?.refundPrice || currentItemTransaction?.paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      ip: req.user?.ip,
      ...reasonObj
    });
    res.json(result);
  });
};
exports.default = _default;