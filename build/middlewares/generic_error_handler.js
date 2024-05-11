"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _api_error = _interopRequireDefault(require("../error/api_error"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const GenericErrorHandler = (err, req, res, next) => {
  if (!(err instanceof _api_error.default)) {
    console.error(err);
  }
  //validasyon hataları
  if (/\w+ validation failed: \w+/i.test(err.message)) {
    err.message = err.message.replace(/\w+ validation failed: \w+/i, "");
  }
  res.status(err.status || 500).json({
    status: err?.status,
    error: err?.message,
    code: err?.code
  });
};
var _default = GenericErrorHandler;
exports.default = _default;