export default {
  SMS_COUNT: 50, //毫秒为单位
  ajax: "http://112.74.51.97:8020/futurechain-base",
  socket_url: 'ws://112.74.51.97:8020/futurechain-base',
  COUNTRY_CODE_LIST: [{
    key: '+86',
    value: '+86',
    name_ch: '中国',
    name_en: 'China'
  },{
    key: '+1',
    value: '+1',
    name_ch: '美国',
    name_en: 'America'
  },{
    key: '+852',
    value: '+852',
    name_ch: '香港',
    name_en: 'HongKong'
  }],
  TRADE_TYPE: {
    buy_market: 1, //市价买
    buy_limit: 2, //限价买
    sell_market: 3, //市价卖
    sell_limit: 4 //限价卖
  },
  ORDER_STATUS: {
    status_1:"已提交",
    status_2:"正在处理",
    status_3:"区块链执行中",
    status_4:"部分成交",
    status_5:"全部成交",
    status_10:"部分成交已撤",
    status_20:"执行终止",
    status_21:"用户撤销",
    status_22:"过期",
    status_23:"其他失败"
  },
  ORDER_TYPE: {
    type_1: 'buy_market',
    type_2: 'buy_limit',
    type_3: 'sell_market',
    type_4: 'sell_limit'
  },
  ORDER_TYPE_EN: {
    type_1: 'Buy on market price',
    type_2: 'Buy on limit price',
    type_3: 'Sell on market price',
    type_4: 'Sell on limit price'
  },
  ORDER_TYPE_CN: {
    type_1: '市价买入',
    type_2: '限价买入',
    type_3: '市价卖出',
    type_4: '限价卖出'
  },
  //"type": 订单类型 0 所有状态 1 当前委托 2 委托历史 3 成交明细
  chartXTimespan: {
    1: 15,
    5: 30
  },
  TIMESPANCOUNT: 14,
  coin_trade_pair: [
    { name: 'BTC', exchange_available: ['USDX'], chinese_name: '比特币', eng_name: 'Bitcoin'},
    { name: 'ETH', exchange_available: ['USDX', 'BTC'], chinese_name: '以太币', eng_name: 'Ethereum'},
    { name: 'LTC', exchange_available: ['USDX', 'BTC', 'ETH'], chinese_name: '莱特币', eng_name: 'Litecoin'},
    { name: 'XRP', exchange_available: ['USDX', 'BTC', 'ETH'], chinese_name: '瑞波币', eng_name: 'Ripple'},
    { name: 'HABA', exchange_available: ['USDX'], chinese_name: 'BNA船币', eng_name: 'MV HAMMONIA BEROLINA'},
    { name: 'HAAM', exchange_available: ['USDX'], chinese_name: 'HHI船币', eng_name: 'MV HAMMONIA AMERICA'}
  ],
  CURRENCY: 'USDX',
  ORG_ID: 81230,
  AGE_CATE: [
    { id: 41, descrpt_en: 'Newbuilding project', descrpt_ch: '新生'},
    { id: 42, descrpt_en: '1-5 years old', descrpt_ch: '1-5岁'},
    { id: 43, descrpt_en: '6- 10 years old', descrpt_ch: '6-10岁'},
    { id: 44, descrpt_en: '11– 15 years old', descrpt_ch: '11-15岁'},
    { id: 45, descrpt_en: '16 – 20 years old', descrpt_ch: '16-20岁'},
    { id: 46, descrpt_en: '20 years old plus', descrpt_ch: '20岁及以上'},
  ]
}