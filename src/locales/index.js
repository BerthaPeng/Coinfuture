const commonEn = require('./en-us/common.json');
const commonCn = require('./zh-cn/common.json');
const common = { 'en-US': headerEn, 'zh-CN': headerCn };

const headerEn = require('./en-us/header.json');
const headerCn = require('./zh-cn/header.json');
const header = { 'en-US': headerEn, 'zh-CN': headerCn };


const coinEn = require('./en-us/coin-coin-exchange.json');
const coinCn = require('./zh-cn/coin-coin-exchange.json');
const coinExchange = { 'en-US': { ...headerEn, ...commonEn, ...coinEn }, 'zh-CN': { ...headerCn, ...commonCn, ...coinCn } };

const financeEn = require('./en-us/finance.json');
const financeCn = require('./zh-cn/finance.json');
const finance = { 'en-US': { ...headerEn, ...commonEn, ...financeEn }, 'zh-CN': { ...headerCn, ...commonCn, ...financeCn} };

const loginEn = require('./en-us/login.json');
const loginCn = require('./zh-cn/login.json');
const login = { 'en-US': { ...headerEn, ...commonEn, ...loginEn }, 'zh-CN': { ...headerCn, ...commonCn, ...loginCn}};

const registerEn = require('./en-us/register.json');
const registerCn = require('./zh-cn/register.json');
const register = { 'en-US': {...headerEn, ...commonEn, ...registerEn }, 'zh-CN': { ...headerCn, ...commonCn, ...registerCn }};

const ordersEn = require('./en-us/orders.json');
const ordersCn = require('./zh-cn/orders.json');
const orders = { 'en-US': {...headerEn, ...commonEn, ...ordersEn }, 'zh-CN': { ...headerCn, ...commonCn, ...ordersCn }};

const tradeEn = require('./en-us/trade.json');
const tradeCn = require('./zh-cn/trade.json');
const trade = { 'en-US': {...headerEn, ...commonEn, ...tradeEn }, 'zh-CN': { ...headerCn, ...commonCn, ...tradeCn }};

export {
  common,
  header,
  coinExchange,
  finance,
  login,
  register,
  orders,
  trade,
}