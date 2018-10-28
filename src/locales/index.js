const commonEn = require('./en-us/common.json');
const commonCn = require('./zh-cn/common.json');
const common = { 'en-US': commonEn, 'zh-CN': commonCn };

const headerEn = require('./en-us/header.json');
const headerCn = require('./zh-cn/header.json');
const header = { 'en-US': headerEn, 'zh-CN': headerCn };

const footerEn = require('./en-us/footer.json');
const footerCn = require('./zh-cn/footer.json');
const footer = { 'en-US': footerEn, 'zh-CN': footerCn };

const balancesTableEn = require('./en-us/balances-table.json');
const balancesTableCn = require('./zh-cn/balances-table.json');
const balancesTable = { 'en-US': balancesTableEn, 'zh-CN': balancesTableCn };

const coinEn = require('./en-us/coin-coin-exchange.json');
const coinCn = require('./zh-cn/coin-coin-exchange.json');
const coinExchange = { 'en-US': {...footerEn, ...headerEn, ...commonEn, ...coinEn }, 'zh-CN': {...footerCn, ...headerCn, ...commonCn, ...coinCn } };

const financeEn = require('./en-us/finance.json');
const financeCn = require('./zh-cn/finance.json');
const finance = { 'en-US': {...footerEn, ...headerEn, ...commonEn, ...balancesTableEn, ...financeEn }, 'zh-CN': {...footerCn, ...headerCn, ...commonCn, ...balancesTableCn, ...financeCn} };

const loginEn = require('./en-us/login.json');
const loginCn = require('./zh-cn/login.json');
const login = { 'en-US': {...footerEn, ...headerEn, ...commonEn, ...loginEn }, 'zh-CN': {...footerCn, ...headerCn, ...commonCn, ...loginCn}};

const registerEn = require('./en-us/register.json');
const registerCn = require('./zh-cn/register.json');
const register = { 'en-US': {...footerEn,...headerEn, ...commonEn, ...registerEn }, 'zh-CN': {...footerCn, ...headerCn, ...commonCn, ...registerCn }};

const ordersEn = require('./en-us/orders.json');
const ordersCn = require('./zh-cn/orders.json');
const orders = { 'en-US': {...footerEn,...headerEn, ...commonEn, ...ordersEn }, 'zh-CN': {...footerCn, ...headerCn, ...commonCn, ...ordersCn }};

const tradeEn = require('./en-us/trade.json');
const tradeCn = require('./zh-cn/trade.json');
const trade = { 'en-US': {...footerEn,...headerEn, ...commonEn, ...tradeEn }, 'zh-CN': {...footerCn, ...headerCn, ...commonCn, ...tradeCn }};

export {
  balancesTable,
  footer,
  common,
  header,
  coinExchange,
  finance,
  login,
  register,
  orders,
  trade,
}