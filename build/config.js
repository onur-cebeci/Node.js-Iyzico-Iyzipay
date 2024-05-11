"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//node ./build/index.js dev yzdığımızda slice 0-1 pas geçerek 2 parametreye bakcak ve dev varsa false geçecek
const production = process.argv.slice(2).includes("dev") ? false : true;
const config = {
  development: !production,
  production: production,
  deployment: production ? "PRODUCTION" : "DEVELOPMENT"
};
var _default = config;
exports.default = _default;