const headerEn = require('./en-us/header.json');
const headerCn = require('./zh-cn/header.json');
const header = { 'en-US': headerEn, 'zh-CN': headerCn };


const coinEn = require('./en-us/coin-coin-exchange.json');
const coinCn = require('./zh-cn/coin-coin-exchange.json');
const coinExchange = { 'en-US': { ...headerEn, ...coinEn }, 'zh-CN': { ...headerCn, ...coinCn } };

const financeEn = require('./en-us/finance.json');
const financeCn = require('./zh-cn/finance.json');
const finance = { 'en-US': { ...headerEn, ...financeEn }, 'zh-CN': { ...headerCn, ...financeCn} };

const loginEn = require('./en-us/login.json');
const loginCn = require('./zh-cn/login.json');
const login = { 'en-US': { ...headerEn, ...loginEn }, 'zh-CN': { ...headerCn, ...loginCn}};

const registerEn = require('./en-us/register.json');
const registerCn = require('./zh-cn/register.json');
const register = { 'en-US': {...headerEn, ...registerEn }, 'zh-CN': { ...headerCn, ...registerCn }};

const ordersEn = require('./en-us/orders.json');
const ordersCn = require('./zh-cn/orders.json');
const orders = { 'en-US': {...headerEn, ...ordersEn }, 'zh-CN': { ...headerCn, ...ordersCn }};

export {
  header,
  coinExchange,
  finance,
  login,
  register,
  orders
}