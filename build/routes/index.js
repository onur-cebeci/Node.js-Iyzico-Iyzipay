"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _text = _interopRequireDefault(require("./text.js"));
var _users = _interopRequireDefault(require("./users.js"));
var _cards = _interopRequireDefault(require("./cards.js"));
var _installments = _interopRequireDefault(require("./installments.js"));
var _payments = _interopRequireDefault(require("./payments.js"));
var _paymentsThreeds = _interopRequireDefault(require("./payments-threeds.js"));
var _checkout = _interopRequireDefault(require("./checkout.js"));
var _cancel_payments = _interopRequireDefault(require("./cancel_payments.js"));
var _refund_payments = _interopRequireDefault(require("./refund_payments.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = [_text.default, _users.default, _cards.default, _installments.default, _payments.default, _paymentsThreeds.default, _checkout.default, _cancel_payments.default, _refund_payments.default];
exports.default = _default;