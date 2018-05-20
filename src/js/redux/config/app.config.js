export default {
  SMS_COUNT: 50, //毫秒为单位
  ajax: "http://47.106.71.87:8020/kiop-privilege-management",
  COUNTRY_CODE_LIST: [{
    key: '+86',
    value: '+86',
    text: '中国',
  },{
    key: '+1',
    value: '+1',
    text: '美国',
  },{
    key: '+852',
    value: '+852',
    text: '香港'
  }],
  TRADE_TYPE: {
    buy_market: 1, //市价买
    buy_limit: 2, //限价买
    sell_market: 3, //市价卖
    sell_limit: 4 //限价卖
  },
  ORDER_STATUS: {
    status_1:"received",
    status_2:"processing in queue",
    status_3:"executing to bitnet",
    status_4:"fullfilled partially",
    status_5:"completed fully",
    status_10:"部分成交已撤",
    status_20:"suspended due to failure to fullfill",
    status_21:"canceled by user",
    status_22:"expired and no longer matters",
    status_23:"failed due to external reasons"
  },
  ORDER_TYPE: {
    type_1: 'buy_market',
    type_2: 'buy_limit',
    type_3: 'sell_market',
    type_4: 'sell_limit'
  },
  ORDER_TYPE_CN: {
    type_1: '买入',
    type_2: '买入',
    type_3: '卖出',
    type_4: '卖出'
  }
  //"type": 订单类型 0 所有状态 1 当前委托 2 委托历史 3 成交明细
}