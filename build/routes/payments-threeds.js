"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _carts = _interopRequireDefault(require("../db/carts.js"));
var _api_error = _interopRequireDefault(require("../error/api_error.js"));
var _session = _interopRequireDefault(require("../middlewares/session.js"));
var PaymentsThreeDs = _interopRequireWildcard(require("../services/iyzco/methods/threeds_payments.js"));
var Cards = _interopRequireWildcard(require("../services/iyzco/methods/cards"));
var _users = _interopRequireDefault(require("../db/users.js"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));
var _payments = require("../utils/payments.js");
var _iyzipay = _interopRequireDefault(require("iyzipay"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  //Completa payment
  router.post("/threeds/payments/complete", async (req, res) => {
    if (!req.body.paymentId) {
      throw new _api_error.default("Payment id is requuired", 400, "paymentIdRequired");
    }
    if (req.body.status != "success") {
      throw new _api_error.default("Payment cant be starred beacuse initilization failed", 400, "initializationFailed");
    }
    const data = {
      locale: "tr",
      conversationId: (0, _nanoid.default)(),
      paymentId: req.body.paymentId,
      conversationData: req.body.conversationData
    };
    const result = await PaymentsThreeDs.completePayment(data);
    await (0, _payments.CompletePayment)(result);
    res.status(200).json(result);
  });

  // YENİ KARTLA ÖDEME OLUŞTUR VE Kart kaydı yok - THREEDS
  router.post("/threeds/payments/:cartId/with-new-card", _session.default, async (req, res) => {
    const {
      card
    } = req.body;
    if (!card) {
      throw new _api_error.default("Card is required", 400, "cardRequired");
    }
    if (!req.params?.cartId) {
      throw new _api_error.default("Card id is required", 400, "cardIdRequired");
    }
    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");
    if (!cart) {
      throw new _api_error.default("Card not found", 404, "cartNotFound");
    }
    if (cart?.completed) {
      throw new _api_error.default("Card is completed", 400, "cardCompleted");
    }
    card.registerCard = "0";
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
      paymentCard: card,
      buyer: {
        id: String(req.user?._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updatedAt).format("YYYY-MM-DD hh:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        country: req.user?.country
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, _) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await PaymentsThreeDs.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  });

  // YENİ KARTLA ÖDEME OLUŞTUR VE Kart kaydet - THREEDS
  router.post("/threeds/payments/:cartId/with-new-card/register-card", _session.default, async (req, res) => {
    const {
      card
    } = req.body;
    if (!card) {
      throw new _api_error.default("Card is required", 400, "cardRequired");
    }
    if (!req.params?.cartId) {
      throw new _api_error.default("Card id is required", 400, "cardIdRequired");
    }
    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");
    if (!cart) {
      throw new _api_error.default("Card not found", 404, "cartNotFound");
    }
    if (cart?.completed) {
      throw new _api_error.default("Card is completed", 400, "cardCompleted");
    }
    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }
    card.registerCard = "1";
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
      paymentCard: card,
      buyer: {
        id: String(req.user?._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updatedAt).format("YYYY-MM-DD hh:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        country: req.user?.country
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, _) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await PaymentsThreeDs.initializePayment(data);
    if (!req.user?.cardUserKey) {
      const user = await _users.default.findOne({
        _id: req.user?._id
      });
      user.cardUserKey = result?.cardUserKey;
      await user.save();
    }
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  });

  // Hali hazırdaki bir kart ile ödeme oluştur ve Kartı kaydet -THREEDS - CARDINDEX
  router.post("/threeds/payments/:cartId/:cardIndex/with-registered-card-index", _session.default, async (req, res) => {
    const {
      cardIndex
    } = req.params;
    if (!cardIndex) {
      throw new _api_error.default("Card is required", 400, "cardRequired");
    }
    if (!req.user?.cardUserKey) {
      throw new _api_error.default("No registered card available", 400, "cardNotAvalable");
    }
    const cards = await Cards.getUserCards({
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    const index = parseInt(cardIndex);
    if (index >= cards?.cardDetails?.length) {
      throw new _api_error.default("Card doesnt exists", 400, "cardIndexInvalid");
    }
    const {
      cardToken
    } = cards?.cardDetails[index];
    const card = {
      cardUserKey: req.user?.cardUserKey,
      cardToken
    };
    if (!req.params?.cartId) {
      throw new _api_error.default("Card id is required", 400, "cardIdRequired");
    }
    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");
    if (!cart) {
      throw new _api_error.default("Card not found", 404, "cartNotFound");
    }
    if (cart?.completed) {
      throw new _api_error.default("Card is completed", 400, "cardCompleted");
    }
    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
      paymentCard: card,
      buyer: {
        id: String(req.user?._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updatedAt).format("YYYY-MM-DD hh:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        country: req.user?.country
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, _) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await PaymentsThreeDs.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  });

  // Hali hazırdaki bir kart ile ödeme oluştur ve Kartı kaydet -THREEDS - CArdToken
  router.post("/threeds/payments/:cartId/with-registered-card-token", _session.default, async (req, res) => {
    const {
      cardToken
    } = req.body;
    if (!cardToken) {
      throw new _api_error.default("Card token is required", 400, "cardTokenRequired");
    }
    if (!req.user?.cardUserKey) {
      throw new _api_error.default("No registered card available", 400, "cardNotAvalable");
    }
    const card = {
      cardUserKey: req.user?.cardUserKey,
      cardToken
    };
    if (!req.params?.cartId) {
      throw new _api_error.default("Card id is required", 400, "cardIdRequired");
    }
    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");
    if (!cart) {
      throw new _api_error.default("Card not found", 404, "cartNotFound");
    }
    if (cart?.completed) {
      throw new _api_error.default("Card is completed", 400, "cardCompleted");
    }
    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
      paymentCard: card,
      buyer: {
        id: String(req.user?._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updatedAt).format("YYYY-MM-DD hh:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD hh:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        country: req.user?.country
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, _) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await PaymentsThreeDs.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  });
};
exports.default = _default;