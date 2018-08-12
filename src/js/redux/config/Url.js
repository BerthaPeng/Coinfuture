export default {
  getCaptcha: "user_request_mobile_verification",
  register: "user_register_with_mobile_verification",
  login: "user_login_with_mobile",
  loginout: "user_logout",
  userFinance: "exch_account_get_info",
  transac_list: "exch_order_list",
  get_before_market_data: "market.kline",  //拉K线图数据:market.BTCUSDT.kline.1m 后面根据传入的数据进行片接
  get_new_deal_list: "market.trade.detail", //拉取最新成交
  get_order_list: "market.depth.step0", //获取买卖盘
  get_daily_market: 'market.kline.daily', //获取行情
  get_coin_cate_list: 'exch_coin_attribute_get_all_attributes', //获取币分类
  get_coin_list_by_cate: 'exch_coin_search_by_attribute',
  get_transac_detail_list: 'exch_match_list', //获取成交明细
}