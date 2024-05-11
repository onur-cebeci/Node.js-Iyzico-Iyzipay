"use strict";

var _iyzipay = _interopRequireDefault(require("iyzipay"));
var Payments = _interopRequireWildcard(require("./methods/payments.js"));
var Cards = _interopRequireWildcard(require("./methods/cards.js"));
var Installments = _interopRequireWildcard(require("./methods/installments.js"));
var _nanoid = _interopRequireDefault(require("../../utils/nanoid.js"));
var Logs = _interopRequireWildcard(require("../../utils/logs.js"));
var PaymentThreeDs = _interopRequireWildcard(require("./methods/threeds_payments.js"));
var Checkout = _interopRequireWildcard(require("./methods/checkout.js"));
var CancelPayment = _interopRequireWildcard(require("./methods/cancel_payment.js"));
var RefundPayments = _interopRequireWildcard(require("./methods/refund_paymet.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*------------------------------------ */
/*a) CARDS */
/*------------------------------------ */

// Bir kullanıcı ve kart oluştur
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    card: {
      cardAlias: "Kredi kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", result);
  }).catch(err => {
    console.log(err + 'Log hatasııı');
    Logs.logFile("1-cards-kullanıcı-ve-kart-hata", err);
  });
};

// Bir kullanıcıya yeni bir kart ekle
const createACardForAUser = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    cardUserKey: "a4vmL4FZvvvwkccJS/U0WyWGBrY=",
    card: {
      cardAlias: "Kredi kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("2-cards-kullanıya-kart-ekle", result);
  }).catch(err => {
    console.log(err + 'Log hatasııı');
    Logs.logFile("2-cards-kullanıya-kart-ekle-hata", err);
  });
};

//Bir kullanıcının kartlarını oku 

const readCardsOFAUser = () => {
  Cards.getUserCards({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "a4vmL4FZvvvwkccJS/U0WyWGBrY="
  }).then(result => {
    console.log(result);
    Logs.logFile("3-cards-bir-kullanıcının-kartlarını - oku", result);
  }).catch(err => {
    console.log(err + 'Log hatasııı');
    Logs.logFile("3-cards-bir-kullanıcının-kartlarını - oku-hata", err);
  });
};

//Bir kullanıcının kartını sil 

const deleteCardOfAUser = () => {
  Cards.deleteUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "a4vmL4FZvvvwkccJS/U0WyWGBrY=",
    cardToken: "9hr3taWrtJ3LVEtVeXyg47iHBqI="
  }).then(result => {
    console.log(result);
    Logs.logFile("4-cards-bir-kullanıcının-kartını - sil", result);
  }).catch(err => {
    console.log(err + 'Log hatasııı');
    Logs.logFile("4-cards-bir-kullanıcının-kartını-sil-hata", err);
  });
};

//deleteCardOfAUser();
//readCardsOFAUser();
//createACardForAUser();
//createUserAndCards();

/*------------------------------------ */
/* b)  INSTALLMENTS */
/*------------------------------------ */

// Bir kart ve ücretle ilgili gerçekleşebilecek taksitlerin kontrolü

const checkInstallments = () => {
  return Installments.checkInstallment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    binNumber: "55287900",
    price: "1000"
  }).then(result => {
    console.log(result);
    Logs.logFile("5-installments-taksit-kontrollü", result);
  }).catch(err => {
    console.log(err + 'Log hatasııı');
    Logs.logFile("5-installments-taksit-kontrollü-hata", err);
  });
};
// checkInstallments();

/*------------------------------------ */
/* c)  NORMAL PAYMENTS                 */
/*------------------------------------ */

//Kayıtlı olmayan kartla ödeme yapmak 

const createPayment = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    Installment: "1",
    basketId: "B54234",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      //registerCard:'0', 0 olduğunda kartı kaydetmeyecektir
      registerCard: '0'
    },
    buyer: {
      id: "SAdda5",
      name: "John",
      surname: "Joe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      //Kimlik numarası Iyzico zorunlu tutuyor ama rastgeleveya 11 haneli 0 girsekte kabul ediliyor
      identityNumber: "000000000000",
      lastLoginDate: "2022-10-05 12:43:35",
      registrationDate: "2022-10-04 12:43:35",
      registrationAddress: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      //ip depolamıyorsak farkı bir rakam girebiliriz her zman doğru çalışmıyor
      ip: "85.34.78.112",
      city: "Manisa",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Telefon",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }, {
      id: "BT102",
      name: "Xaomi",
      category1: "Xaomi Telefonlar",
      category2: "Xaomi Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT103",
      name: "X",
      category1: "Telefonlar",
      category2: "IOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 110
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("6-payments-yeni-bir-kartla-ödeme-al", result);
  }).catch(err => {
    console.log(err + 'Log hatasııı');
    Logs.logFile("6-payments-yeni-bir-kartla-ödeme-al-hata", err);
  });
};

//createPayment();

//Kayıtlı olmayan bir kartla ödeme yap ve kartı kaydet.

const createPaymentAndSaveCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    Installment: "1",
    basketId: "B54234",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "a4vmL4FZvvvwkccJS/U0WyWGBrY=",
      cardAlias: "Kredi Kartım Ödemeden Sonra",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      //registerCard:'1', 1 olduğunda kartı kaydedecektir.
      registerCard: '1'
    },
    buyer: {
      id: "SAdda5",
      name: "John",
      surname: "Joe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      //Kimlik numarası Iyzico zorunlu tutuyor ama rastgeleveya 11 haneli 0 girsekte kabul ediliyor
      identityNumber: "000000000000",
      lastLoginDate: "2022-10-05 12:43:35",
      registrationDate: "2022-10-04 12:43:35",
      registrationAddress: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      //ip depolamıyorsak farkı bir rakam girebiliriz her zman doğru çalışmıyor
      ip: "85.34.78.112",
      city: "Manisa",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Telefon",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }, {
      id: "BT102",
      name: "Xaomi",
      category1: "Xaomi Telefonlar",
      category2: "Xaomi Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT103",
      name: "X",
      category1: "Telefonlar",
      category2: "IOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 110
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("7-payments-yeni-bir-kartla-ödeme-al-kartı-kaydet", result);
  }).catch(err => {
    console.log(err + 'Log hatasııı');
    Logs.logFile("7-payments-yeni-bir-kartla-ödeme-al-kartı-kaydet-hata", err);
  });
};

//createPaymentAndSaveCard();
//readCardsOFAUser();

//Daha önce Kaydedilmiş bir kart ile ödeme yap

const createPaymentWithSavedCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    Installment: "1",
    basketId: "B54234",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "a4vmL4FZvvvwkccJS/U0WyWGBrY=",
      cardToken: "sJCkbbhp0q04R8szJbaA4do1d+w="
    },
    buyer: {
      id: "SAdda5",
      name: "John",
      surname: "Joe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      //Kimlik numarası Iyzico zorunlu tutuyor ama rastgeleveya 11 haneli 0 girsekte kabul ediliyor
      identityNumber: "000000000000",
      lastLoginDate: "2022-10-05 12:43:35",
      registrationDate: "2022-10-04 12:43:35",
      registrationAddress: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      //ip depolamıyorsak farkı bir rakam girebiliriz her zman doğru çalışmıyor
      ip: "85.34.78.112",
      city: "Manisa",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Telefon",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }, {
      id: "BT102",
      name: "Xaomi",
      category1: "Xaomi Telefonlar",
      category2: "Xaomi Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT103",
      name: "X",
      category1: "Telefonlar",
      category2: "IOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 110
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("8-payments-önceden-kaydedilmiş-bir-kartla-ödeme-al", result);
  }).catch(err => {
    console.log(err + 'Log hatasııı');
    Logs.logFile("8-payments-önceden-kaydedilmiş-bir-kartla-ödeme-al-hata", err);
  });
};

//createPaymentWithSavedCard();

/*------------------------------------ */
/*e) Secure Payments */
/*------------------------------------ */

const initializeThreeDSPayment = () => {
  PaymentThreeDs.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    Installment: "1",
    basketId: "B54234",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      //registerCard:'0', 0 olduğunda kartı kaydetmeyecektir
      registerCard: '0'
    },
    buyer: {
      id: "SAdda5",
      name: "John",
      surname: "Joe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      //Kimlik numarası Iyzico zorunlu tutuyor ama rastgeleveya 11 haneli 0 girsekte kabul ediliyor
      identityNumber: "000000000000",
      lastLoginDate: "2022-10-05 12:43:35",
      registrationDate: "2022-10-04 12:43:35",
      registrationAddress: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      //ip depolamıyorsak farkı bir rakam girebiliriz her zman doğru çalışmıyor
      ip: "85.34.78.112",
      city: "Manisa",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Telefon",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }, {
      id: "BT102",
      name: "Xaomi",
      category1: "Xaomi Telefonlar",
      category2: "Xaomi Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT103",
      name: "X",
      category1: "Telefonlar",
      category2: "IOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 110
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("9-ThreeDs-payment-yeni-bir-kartla-ödeme-al", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("9-ThreeDs-payment-yeni-bir-kartla-ödeme-al-hata", err);
  });
};
//initializeThreeDSPayment();

//Complete Payment in threeDs
const completeThreeDSPayment = () => {
  PaymentThreeDs.completePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "18956993",
    conversationData: "conversation data"
  }).then(result => {
    console.log(result);
    Logs.logFile("10-ThreeDs-payment-ödeme-tamamla", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("10-ThreeDs-payment-ödeme-tamamla-hata", result);
  });
};
//completeThreeDSPayment();

//Önceden kaydedilmiş kart ile ThreeDs ödemesi yapma. 
const initializeThreeDSPaymentWiithRegisteredCard = () => {
  PaymentThreeDs.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    Installment: "1",
    basketId: "B54234",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "a4vmL4FZvvvwkccJS/U0WyWGBrY=",
      cardToken: "sJCkbbhp0q04R8szJbaA4do1d+w="
    },
    buyer: {
      id: "SAdda5",
      name: "John",
      surname: "Joe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      //Kimlik numarası Iyzico zorunlu tutuyor ama rastgeleveya 11 haneli 0 girsekte kabul ediliyor
      identityNumber: "000000000000",
      lastLoginDate: "2022-10-05 12:43:35",
      registrationDate: "2022-10-04 12:43:35",
      registrationAddress: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      //ip depolamıyorsak farkı bir rakam girebiliriz her zman doğru çalışmıyor
      ip: "85.34.78.112",
      city: "Manisa",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Telefon",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }, {
      id: "BT102",
      name: "Xaomi",
      category1: "Xaomi Telefonlar",
      category2: "Xaomi Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT103",
      name: "X",
      category1: "Telefonlar",
      category2: "IOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 110
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("11-ThreeDs-payment-kayıtlı-bir-kartla-ödeme-al", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("11-ThreeDs-payment-kayıtlı-bir-kartla-ödeme-al", err);
  });
};
//initializeThreeDSPaymentWiithRegisteredCard();

//Yeni bir kartı kaydederek  ThreeDs ödemesi yapma. 
const initializeThreeDSPaymentWithNewCardRegistered = () => {
  PaymentThreeDs.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    Installment: "1",
    basketId: "B54234",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "a4vmL4FZvvvwkccJS/U0WyWGBrY=",
      cardAlias: "Kredi Kartım Ödemeden Sonra",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      //registerCard:'1', 1 olduğunda kartı kaydedecektir.
      registerCard: '1'
    },
    buyer: {
      id: "SAdda5",
      name: "John",
      surname: "Joe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      //Kimlik numarası Iyzico zorunlu tutuyor ama rastgeleveya 11 haneli 0 girsekte kabul ediliyor
      identityNumber: "000000000000",
      lastLoginDate: "2022-10-05 12:43:35",
      registrationDate: "2022-10-04 12:43:35",
      registrationAddress: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      //ip depolamıyorsak farkı bir rakam girebiliriz her zman doğru çalışmıyor
      ip: "85.34.78.112",
      city: "Manisa",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Telefon",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }, {
      id: "BT102",
      name: "Xaomi",
      category1: "Xaomi Telefonlar",
      category2: "Xaomi Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT103",
      name: "X",
      category1: "Telefonlar",
      category2: "IOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 110
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("12-ThreeDs-payment-kayıtlı-bir-kartla-ödeme-al", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("12-ThreeDs-payment-kayıtlı-bir-kartla-ödeme-al", err);
  });
};
//initializeThreeDSPaymentWithNewCardRegistered();
//readCardsOFAUser();

/*------------------------------------ */
/*e) Checkout Form */
/*------------------------------------ */

//Checkout form i.erisinde çdeme başlat

const initializeCheckoutForm = () => {
  Checkout.initialize({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    Installment: "1",
    basketId: "B54234",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/checkout/complete/payment",
    cardUserKey: "a4vmL4FZvvvwkccJS/U0WyWGBrY=",
    enabledInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: "SAdda5",
      name: "John",
      surname: "Joe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      //Kimlik numarası Iyzico zorunlu tutuyor ama rastgeleveya 11 haneli 0 girsekte kabul ediliyor
      identityNumber: "000000000000",
      lastLoginDate: "2022-10-05 12:43:35",
      registrationDate: "2022-10-04 12:43:35",
      registrationAddress: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      //ip depolamıyorsak farkı bir rakam girebiliriz her zman doğru çalışmıyor
      ip: "85.34.78.112",
      city: "Manisa",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Manisa",
      country: "Turkey",
      address: "Manisa/Turgutlu Atatürk Bulvarı No:1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Telefon",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 100
    }, {
      id: "BT102",
      name: "Xaomi",
      category1: "Xaomi Telefonlar",
      category2: "Xaomi Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT103",
      name: "X",
      category1: "Telefonlar",
      category2: "IOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 110
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("13-Checkout-from-payment-ödeme-al", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("13-Checkout-form-payment-ödeme-al-hata", err);
  });
};

//initializeCheckoutForm();

//Ödemenin gerçekleşip gerçekleşmediğini sisteme bildirip gerekli ayarları yapıcaz
const getFormPayment = () => {
  Checkout.getFormPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    token: "2b34115c-af70-4280-b300-28590fa072e3"
  }).then(result => {
    console.log(result);
    Logs.logFile("14-Checkout-from-payment-get-details", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("14-Checkout-from-payment-get-details-hata", err);
  });
};

//getFormPayment();

/*------------------------------------ */
/*f) CANCEL PAYMENT */
/*------------------------------------ */

//Ödemeyi iptal etme
const cancelPayment = () => {
  CancelPayment.cancelPayment({
    lacale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "18960617",
    ip: "85.34.78.112"
  }).then(result => {
    console.log(result);
    Logs.logFile("15-Cancel-payment-ödeme-iptali", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("15-Cancel-payment-ödeme-iptali-hata", err);
  });
};
//cancelPayment();

//Sebeb ve açıklama kısmı ile cancel payment
const reasonCancelPayment = () => {
  CancelPayment.cancelPayment({
    lacale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "18956524",
    ip: "85.34.78.112",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Kullanıcı  isteği ile iptal edildi"
  }).then(result => {
    console.log(result);
    Logs.logFile("16-Cancel-payment-ödeme-iptali-sebeb-ve-açıklama-ile", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("16-Cancel-payment-ödeme-iptali-sebeb-ve-açıklama-ile-hata", err);
  });
};
//reasonCancelPayment();

/*------------------------------------ */
/*g)Refund Payments */
/*------------------------------------ */

//Ödemenin belirli bir parçasını iade et

const refundPayment = () => {
  RefundPayments.refundPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    //
    paymentTransactionId: "20189495",
    price: "60",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: "85.34.78.112"
  }).then(result => {
    console.log(result);
    Logs.logFile("17-Refund-payment-ödemenin-belirli-bir0kısmını-iade-et", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("17-Refund-payment-ödemenin-belirli-bir0kısmını-iade-et-hata", err);
  });
};
//refundPayment()

//Ödemenin bir kısmını neden ve açıklama ile iade et
const refundPaymentWithReason = () => {
  RefundPayments.refundPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    //
    paymentTransactionId: "20189495",
    price: "10",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: "85.34.78.112",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Ürun hatalı"
  }).then(result => {
    console.log(result);
    Logs.logFile("18-Refund-payment-ödemenin-belirli-bir0kısmını-iade-et", result);
  }).catch(err => {
    console.log(err + 'Hata !!!!');
    Logs.logFile("18-Refund-payment-ödemenin-belirli-bir0kısmını-iade-et-hata", err);
  });
};
// refundPaymentWithReason();