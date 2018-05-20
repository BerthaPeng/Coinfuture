const headerEn = require('./en-us/header.json');
const headerCn = require('./zh-cn/header.json');

const coinEn = require('./en-us/coin-coin-exchange.json');
const coinCn = require('./zh-cn/coin-coin-exchange.json');

const financeEn = require('./en-us/finance.json');
const financeCn = require('./zh-cn/finance.json');



export [
  header: {
    'en': headerEn,
    'cn': headerCn
  },
  coinExchange: {
    'en': { ...headerEn, ...coinEn },
    'cn': { ...headerCn, ...coinCn }
  },
  finance; {
    'en': { ...headerEn, ...financeEn },
    'cn': { ...headerCn, ...financeCn };
  }
]