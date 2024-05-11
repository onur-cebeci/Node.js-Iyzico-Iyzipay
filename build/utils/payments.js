"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompletePayment = void 0;
var _mongoose = require("mongoose");
var _payment_succes = _interopRequireDefault(require("../db/payment_succes.js"));
var _carts = _interopRequireDefault(require("../db/carts.js"));
var _payment_failed = _interopRequireDefault(require("../db/payment_failed.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ObjectId = _mongoose.Types.ObjectId;
const CompletePayment = async result => {
  if (result?.status === "success") {
    await _carts.default.updateOne({
      _id: new ObjectId(result?.basketId)
    }, {
      $set: {
        completed: true
      }
    });
    await _payment_succes.default.create({
      status: result?.status,
      cartId: result?.basketId,
      conversationId: result?.conversationId,
      currency: result?.currency,
      paymentId: result?.paymentId,
      price: result?.price,
      paidPrice: result?.paidPrice,
      itemTransactions: result?.itemTransactions.map(item => {
        return {
          itemId: item?.itemId,
          paymentTransactionId: item?.paymentTransactionId,
          price: item?.price,
          paidPrice: item?.paidPrice
        };
      }),
      log: result
    });
  } else {
    await _payment_failed.default.create({
      status: result?.status,
      conversationId: result?.conversationId,
      errorCode: result?.errorCode,
      errorMessage: result?.errorMessage,
      log: result
    });
  }
};
exports.CompletePayment = CompletePayment;