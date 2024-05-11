"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _api_error = _interopRequireDefault(require("../error/api_error.js"));
var Cards = _interopRequireWildcard(require("../services/iyzco/methods/cards.js"));
var _users = _interopRequireDefault(require("../db/users.js"));
var _nanoid = _interopRequireDefault(require("../utils/nanoid"));
var _session = _interopRequireDefault(require("../middlewares/session.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = router => {
  //Kart ekleme
  router.post("/cards", _session.default, async (req, res) => {
    const card = req.body.card;
    let result = await Cards.createUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      email: req.user.email,
      externalId: (0, _nanoid.default)(),
      //sorgulama yapıyoruz eğer kart user key varsa bu değeri kullan demiş olduk.
      ...(req.user?.cardUserKey && {
        cardUserKey: req.user.cardUserKey
      }),
      card: card
    });
    if (!req.user.cardUserKey) {
      if (result?.status === "success" && result?.cardUserKey) {
        const user = await _users.default.findOne({
          _id: req.user?._id
        });
        user.cardUserKey = result?.cardUserKey;
        await user.save();
      }
    }
    res.json(result);
  });

  //Kart okema 

  router.get('/cards', _session.default, async (req, res) => {
    if (!req.user?.cardUserKey) {
      throw new _api_error.default("User has no credit card", 403, "userHasNoCard");
    }
    let cards = await Cards.getUserCards({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    res.status(200).json(cards);
  });

  //Kart Silme - Token

  router.delete("/cards/delete-by-token", _session.default, async (req, res) => {
    const cardToken = req.body.cardToken;
    if (!cardToken) {
      throw new _api_error.default("Card token is required", 400, "cardTokenRequired");
    }
    let deleteResult = await Cards.deleteUserCard({
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey,
      cardToken: cardToken
    });
    res.status(200).json(deleteResult);
  });

  //Kart Silme Index

  router.delete("/cards/:cardIndex/delete-by-index", _session.default, async (req, res) => {
    if (!req.params?.cardIndex) {
      throw new _api_error.default("Card Index is required", 400, "cardIndexRequired");
    }
    let cards = await Cards.getUserCards({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    //parametre olarak gönderceğimiz kart parametresini int e çevirdik
    const index = parseInt(req.params?.cardIndex);
    if (index >= cards?.cardDetails.length) {
      throw new _api_error.default("Card doesnt exists,check index number", 400, "cardIndexInValid");
    }
    const cardToken = cards?.cardDetails[index].cardToken;
    let deleteResult = await Cards.deleteUserCard({
      locale: req.user?.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey,
      cardToken: cardToken
    });
    res.json(deleteResult);
  });
};
exports.default = _default;