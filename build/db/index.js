"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _users = _interopRequireDefault(require("./users.js"));
var _products = _interopRequireDefault(require("./products"));
var _carts = _interopRequireDefault(require("./carts"));
var _payment_succes = _interopRequireDefault(require("./payment_succes"));
var _payment_failed = _interopRequireDefault(require("./payment_failed"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = [_users.default, _products.default, _carts.default, _payment_succes.default, _payment_failed.default];
exports.default = _default;