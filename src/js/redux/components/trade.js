import React, {Component} from 'react';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Select, Dropdown, Icon, Pagination,
  Input, Checkbox, Message, Grid, Menu, Popup }  from 'semantic-ui-react';
import FLChart from './chart.js';
import TradePanel from './trade-lib/trade-panel.js';
import OrderRecordPanel from './trade-lib/order-record-panel.js';
import { timestampToTime } from 'utils/utils.js';
import * as TradeActions from 'actions/trade.js';
import * as FinanceActions from 'actions/user-finance.js';
import config from 'config/app.config.js';
import { getSocketHeader, getCancelSocketHeader } from 'utils/request.js';
import LazyLoad from 'utils/lazy_load';
import intl from 'react-intl-universal';
import { trade } from 'locales/index.js';
import Toast from './common/Toast.js';
import StdModal from './common/std-modal.js';

var clone = require('clone')

class newPriceQuene extends Component{
  render(){
    return (
      <div className="coin-market item-inner" style={{height: '460px'}}></div>
      )
  }
}

const CoinList = [
]

const chiNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];


class FilterModal extends Component{
  render(){
    var { coin_cate_list, coin_attr_list, Lang: {lang}, active_cate, active_child_cate, active_grand_child_cate,
     active_attr_arr, filter_coin_list } = this.props;
    return (
      <StdModal ref="modal"  title="分类搜索" footer={false}>
        <div className="filter-block">
          <div className="attrs">
            <div className="cateAttrs">
              <div className="attr">
                <div className="attrKey">
                  <span>分类</span>
                </div>
                <div className="attrValues">
                  <ul>
                    {
                      coin_cate_list.map( n => (<li key={'cate-level-1-' + n.id}  className={`${active_cate.id == n.id ? 'active':''}`} onClick={this.chooseCate.bind(this, n)}>
                        <span>{lang == 'en-US' ? n.descrpt_en : n.descrpt_ch}
                        <Icon name="check" />
                        </span>
                      </li>))
                    }
                  </ul>
                  {
                    active_cate.children && active_cate.children.length ?
                    [
                    <Icon name="angle double right"/>
                    ,<ul style={{ borderTop: '1px dotted #D1CCC7', marginTop: '5px', paddingLeft: '15px'}}>
                      {
                        active_cate.children.map( n => (<li key={'cate-level-2-' + n.id }  className={`${active_child_cate.id == n.id ? 'active':''}`} onClick={this.chooseChildCate.bind(this, n)}>
                          <span>{lang == 'en-US' ? n.descrpt_en : n.descrpt_ch}
                          <Icon name="check" />
                          </span>
                        </li>))
                       }
                    </ul>]
                    :null
                  }
                  {
                    active_child_cate.children && active_child_cate.children.length ?
                    [
                    <Icon name="angle double right"/>
                    ,<ul style={{ borderTop: '1px dotted #D1CCC7', marginTop: '5px', paddingLeft: '30px'}}>
                      {
                        active_child_cate.children.map( n => (<li key={'cate-level-3-' + n.id }  className={`${active_grand_child_cate.id == n.id ? 'active':''}`} onClick={this.chooseGrandsonCate.bind(this, n)}>
                          <span>{lang == 'en-US' ? n.descrpt_en : n.descrpt_ch}
                          <Icon name="check" />
                          </span>
                        </li>))
                       }
                    </ul>]
                    :null
                  }
                </div>
              </div>
            </div>
            <div className="propAttrs">
              {
                coin_attr_list.map( attr => (<div className="attr" key={'attr-parent-' + attr.id}>
                    <div className="attrKey">
                      <span>{lang == 'en-US' ? attr.descrpt_en : attr.descrpt_ch}</span>
                    </div>
                    <div className="attrValues">
                      <ul>
                        {
                          attr.items.map(  n => (<li key={'attr-' + n.id}
                           className={`${active_attr_arr.some( h => h.parent == n.parent && h.id == n.id) ? 'active':''}`}
                           onClick={this.chooseAttr.bind(this, { parent: n.parent, id: n.id})}>
                            <span>{lang == 'en-US' ? n.descrpt_en : n.descrpt_ch}
                              <Icon name="check" />
                            </span>
                          </li>))
                        }
                      </ul>
                    </div>
                  </div>))
              }
            </div>
          </div>
          <div className="search-block">
            <Button icon onClick={this.getCoinListByAttr.bind(this)}>搜索
              <Icon name="search" />
            </Button>
          </div>
            <div className="boats">
                {
                  filter_coin_list.map( n => (<div className="boat" key={'coin-' + n.id} onClick={this.chooseBoat.bind(this, n.symbol.replace('USDX', ""))}>
                          <span><Icon name="ship" />{lang == 'en-US' ? n.name_en : n.name_ch}
                          </span>
                        </div>))
                }
            </div>
        </div>
      </StdModal>
      )
  }
  show(){
    this.refs.modal.show();
  }
  chooseBoat(coin){
    this.props.chooseCoin(coin)
    this.refs.modal.hide();
  }
  chooseCate(cate){
    this.props.chooseCate(cate);
  }
  chooseChildCate(cate){
    this.props.chooseChildCate(cate);
  }
  chooseGrandsonCate(cate){
    this.props.chooseGrandsonCate(cate);
  }
  chooseAttr(attr){
    this.props.chooseAttr(attr)
  }
  getCoinListByAttr(){
    this.props.getCoinListByAttr();
  }
}

class Trade extends Component{
  constructor(props){
    super(props);
    this.state = {
      suscribe_success: false,
      addKdata: [], //随次增加的数据
      isNew: true, //收到的分时数据是新增数据还是更新数据
      exchange_available: ['USDX'],

      last_t: null, //上一条成交数据的时间

      msg_color: 'green',
      msg_visible: false,

      new_deal_list: [],
      new_in_order_list: [],
      new_out_order_list: [],
      state_market_list: [],
      filter_market_list: [], //经过分类筛选的货币

      deal_suscribe_success: false, //成交队列订阅成功标志

      order_suscribe_success: false, //买卖队列订阅成功标志

      daily_suscribe_success: false, //行情队列订阅成功标志

      current_line: '1m',

      login: 0,
      highest: 0,
      lowest: 0,
      commit: 0,
      changeMoney: 0,

      active_cate: {},
      active_child_cate: {},
      active_grand_child_cate: {}, //加一层
      active_attr_arr: [], //活跃
      active_cate_id: 0,   //用来声明是否有被选中cate
      coin_quene_title: '热门虚拟币',

      isFake: false, //是否为模拟交易
      user_coin_list: [],
      currency_available: 0, //货币余额
      active_coin_available: 0, //当前货币的持有数量
      isOpen: false,
    }
    this.trade = this.trade.bind(this);
    this.getTransacList = this.getTransacList.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.chooseCate = this.chooseCate.bind(this);
    this.chooseChildCate = this.chooseChildCate.bind(this);
    this.chooseGrandsonCate = this.chooseGrandsonCate.bind(this);
    this.chooseAttr = this.chooseAttr.bind(this);
    this.getCoinListByAttr = this.getCoinListByAttr.bind(this);
    this.chooseCoin = this.chooseCoin.bind(this);
  }
  render(){
    var tradePanelProps = { actions: {}};
    var { Kdata_list, market_list, coin_cate_list, coin_attr_list, activeCoin, filter_coin_list } = this.props.Trade;
    var { transac_list } = this.props.Transaction;
    var { sell_submit_ing, buy_submit_ing, submit_status } = this.props.Exchange;
    var { addKdata, exchange_available, isNew, msg_color, msg_visible, new_deal_list,
      new_in_order_list, new_out_order_list, current_line, login, state_market_list, filter_market_list,
      highest, lowest, commit, changeMoney, active_cate, active_child_cate, coin_quene_title,
      active_cate_id, isFake, currency_available, active_coin_available, active_grand_child_cate,
      active_attr_arr , isOpen } = this.state;
    var { trade, getTransacList, withdraw, chooseCate, chooseChildCate, chooseGrandsonCate, chooseAttr,
     getCoinListByAttr, chooseCoin } = this;
    /*var coin_eng_name = config.coin_trade_pair.filter( m => m.name == this.state.activeCoin)[0].eng_name;*/
    var panelStyle = active_cate.id ? { display: 'inline'} : { display: 'none'};
    //币的现价
    var currentPrice = new_deal_list.length && new_deal_list[new_deal_list.length - 1].price;
    //现价的locale价
    var { price_decimal, quantity_decimal } = this.props.Trade.activeCoinInfo;
    var { lang } = this.props.Lang.lang;
    var currentPriceLocale = this.props.Lang.lang == 'en-US' ? Number(currentPrice).toFixed(price_decimal) : (currentPrice * 6.69).toFixed(price_decimal);
    return (
      <div className="trade-page">
        {/*<div className="cate-call-wrapper">
          <Button onClick={this.showFilterModal.bind(this)}>分类
            <Icon name="angle down" style={{marginLeft: '2px'}} />
          </Button>
        </div>*/}
        {/*<div className="bg-bg" style={{background: "url(images/bg.jpg) no-repeat center", backgroundSize: '100% 100%'}}></div>*/}
        <div className="fl-block gray-bg">
          <div className="flex-wrapper">
            <div className="item-20-100" style={{padding: '0 10px'}}>
              <div className="coin-market item-inner cate-table">
                <div className="caption">Category</div>
                <div className="ceil-box">
                  {
                    coin_cate_list.map( m => { return (<div className={` ${m.isOpen ? 'open': ''}`}>
                      <div className={`cate-item ${active_cate.id == m.id ? 'active':''}`}
                      onClick={this.triggerOpenCate.bind(this, m.id, 0)}
                      key={m.id + '-coin-cate'}
                    >
                      {
                        m.children.length ?
                        <Icon name={`angle ${m.isOpen ? 'down': 'right'}`} />:null
                      }
                      <span>{m.descrpt_en}</span>
                      <Icon className="item-check" name="check" onClick={this.chooseCate.bind(this, m)} />
                    </div>
                    {
                        m.children.length ?
                          <div className="cate-item-child-block">
                            {
                              m.children.map( mc => (<div className={`${mc.isOpen ? 'open': ''}`} >
                                    <div className={`cate-item ${active_cate.id == mc.id ? 'active':''}`} key={ 'cate-item-child-' + mc.id} style={{height: '32px', lineHeight: '32px'}}
                                      onClick={this.triggerOpenCate.bind(this, mc.id, 1, m.id)}
                                    >
                                      {
                                        mc.children.length ?
                                        <Icon name={`angle ${mc.isOpen ? 'down': 'right'}`} style={{marginLeft: '5px'}} />
                                        :null
                                      }
                                      <span style={{left: '24px'}}>{mc.descrpt_en}</span>
                                      <Icon className="item-check" name="check" onClick={this.chooseCate.bind(this, mc)} />
                                    </div>
                                    {
                                      mc.children.length ?
                                      mc.children.map( mg => (
                                        <div className="cate-item-grandson-block">
                                          <div className={`cate-item ${active_cate.id == mg.id ? 'active':''}`} key={ 'cate-item-grandson-' + mg.id} style={{height: '32px', lineHeight: '32px'}}>
                                            <span style={{left: '36px'}}>{mg.descrpt_en}</span>
                                            <Icon className="item-check" name="check" onClick={this.chooseCate.bind(this, mg)} />
                                          </div>
                                        </div>
                                      ))
                                      :null
                                    }
                                  </div>
                                  ))
                            }
                          </div>
                        :null
                    }
                    </div>
                    ) })
                  }
                  {
                    coin_attr_list.map( attr => (<div key={'attr-' + attr.id}>
                      <div className="caption" style={{borderTop: '1px dotted #eee', marginTop: '10px'}}>{ attr.descrpt_en }</div>
                      {
                        attr.items.map( m => (<Button color={`${active_attr_arr.some( n => n.id == m.id ) ? 'red': ''}`} basic className="attr-btn" size="mini" key={'attr-item-' + m.id}
                          onClick={this.chooseAttr.bind(this, m)}>{ m.descrpt_en }</Button>))
                      }
                    </div>))
                  }
                </div>
              </div>
            </div>
            <div className="item-80-100" style={{paddingRight: '10px'}}>
              <div className="flex-wrapper">
                <div className="item-80-100">
                  <div className="coin-current-info item-inner" style={{paddingLeft: 0, paddingRight: 0,backgroundColor: '#000'}}>
                    <div style={{height: '45px', padding: '0px 20px 0px 20px', display: 'flex'}}>
                      <div className="item-40-100" style={{paddingTop: '10px'}}>
                        <span style={{fontSize: '18px', color: '#fff'}}>
                          { activeCoin}</span>
                        <span style={{marginLeft: '5px'}} className="price-amount"> { currentPrice + config.CURRENCY}</span>
                        <span style={{marginLeft: '5px', fontSize: '10px'}}>≈ {intl.get('currentpriceNum', { amount: (currentPriceLocale) })}</span>
                      </div>
                      <div className="item-60-100" style={{textAlign: 'right'}}>
                        <div style={{display: 'flex', width: '100%'}}>
                          <div className="item item-5 light-grey-color">
                            <p>{intl.get('daychange').toUpperCase()}</p>
                            {
                              Number(changeMoney) > 0 ?
                              <p className="color-up" style={{marginTop: '5px'}}>
                              {  '+' + changeMoney + config.CURRENCY }
                              </p>
                              :
                              <p className="color-down" style={{marginTop: '5px'}}>
                              {   changeMoney + config.CURRENCY }
                              </p>
                            }
                          </div>
                          <div className="item item-5 light-grey-color">
                            <p>{intl.get('highest').toUpperCase()}</p>
                            <p style={{marginTop: '5px'}}>{highest + config.CURRENCY}</p>
                          </div>
                          <div className="item item-5 light-grey-color">
                            <p>{intl.get('lowest').toUpperCase()}</p>
                            <p style={{marginTop: '5px'}}>{lowest + config.CURRENCY}</p>
                          </div>
                          <div className="item item-40-100 light-grey-color">
                            <p>{intl.get('dealcount').toUpperCase()}/{intl.get('amount').toUpperCase()}</p>
                            <p style={{marginTop: '5px'}}>{commit + config.CURRENCY}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="market-k-chart item-inner" style={{marginTop: 0, padding: 0}}>
                    <div className="line-guide-wrapper">
                      <ul>
                        <li className={`${current_line == 'timeline' ? 'active': ''}`}>
                          <div onClick={this.onChangeLine.bind(this, 'timeline')}>{intl.get('line')}</div>
                        </li>
                        <li className={`${current_line == '1m' ? 'active': ''}`}>
                          <div onClick={this.onChangeLine.bind(this, '1m')}>{intl.get('min')}</div></li>
                        <li className={`${current_line == '5m' ? 'active': ''}`}>
                          <div onClick={this.onChangeLine.bind(this, '5m')}>{intl.get('min5')}</div>
                        </li>
                        <li className={`${current_line == '15m' ? 'active': ''}`}>
                          <div onClick={this.onChangeLine.bind(this, '15m')}>{intl.get('min15')}</div>
                        </li>
                        <li className={`${current_line == '30m' ? 'active': ''}`}>
                          <div onClick={this.onChangeLine.bind(this, '30m')}>{intl.get('min30')}</div>
                        </li>
                        <li className={`${current_line == '60m' ? 'active': ''}`}>
                          <div onClick={this.onChangeLine.bind(this, '60m')}>{intl.get('hour')}</div>
                        </li>
                        <li className={`${current_line == '1d' ? 'active': ''}`}>
                          <div onClick={this.onChangeLine.bind(this, '1d')}>{intl.get('day')}</div>
                        </li>
                      </ul>
                    </div>
                    <FLChart { ...{ Kdata: Kdata_list, addKdata, isNew, line: current_line, coin: activeCoin}} />
                  </div>
                </div>
                <div className="item-20-100" style={{paddingLeft: '10px'}}>
                  <div className="coin-market item-inner" style={{height: 'auto', padding: '10px'}}>
                    <div className="table-wrapper">
                        <div className="trade-depth-table">
                          <div className="caption">
                            <div className="price">{intl.get('price')}({config. CURRENCY})</div>
                            <div className="amount">{intl.get('quantity')}({activeCoin})</div>
                          </div>
                          <div className="ceil-box">
                            <div className="ceil-block">
                              <div className="ceil-scrol-box">
                                <ul className="list ceil-top-list">
                                  {
                                    new_out_order_list.map( (item, index) => <li key={index + '-out-order-list'}>
                                        <div>{intl.get('sell') + ' '}{ new_out_order_list.length - index}</div>
                                        <div className="price color-down">{item.price}</div>
                                        <div className="amount">{item.quantity}</div>
                                      </li>)
                                  }
                                </ul>
                                <ul className="list">
                                  {
                                    new_in_order_list.map( (item, index) => <li key={index + '-in-order-list'}>
                                        <div>{intl.get('buy') + ' '}{ index + 1}</div>
                                        <div className="price color-up">{item.price}</div>
                                        <div className="amount">{item.quantity}</div>
                                      </li>)
                                  }
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-wrapper"  style={{width: '100%'}}>
            <div className="item-20-100" style={{width: '20%', padding: '10px 10px 0 10px'}}>
              <div className="coin-market item-inner">
                <div className="chosen-cate" style={{height: '150px'}}>
                  {
                    active_cate.id ?
                    <Button icon size="mini" labelPosition="right" color="red"
                      onClick={this.chooseCate.bind(this, {})}
                      style={{marginBottom: '5px'}}>
                      { active_cate.descrpt_en }
                      <Icon name ="close" style={{color: '#fff'}} />
                    </Button>:null
                  }
                  {
                    active_attr_arr.map( m => (<Button key={'atrr-' + m.id} icon size="mini"
                      onClick={this.clearAttr.bind(this)}
                      labelPosition="right" color="red"
                      style={{marginBottom: '5px'}}>
                      { m.descrpt_en }
                      <Icon name ="close" style={{color: '#fff'}} />
                    </Button>))
                  }
                  {
                    !active_cate.id && active_attr_arr.length == 0 ?
                    <Message positive>
                        {/*<Message.Header>选择上面的分类进行筛选</Message.Header>*/}
                        <p>选择上面的分类进行筛选</p>
                    </Message>:null
                  }
                  <Popup trigger={<Button basic size="mini" style={{width: '100%'}}
                  onClick={this.getCoinListByAttr.bind(this)}
                  >搜索</Button>}
                  on="click" position="right center"
                  open={isOpen}
                  style={{ width: '300px'}}
                  >
                    <div className="cate-table" style={{border: "none"}}>
                    <div className="caption">船币</div>
                      <div className="ceil-box" style={{border: 'none', height: '340px'}}>

                        <Table basic className="market-table">
                          <Table.Body>
                            {
                              filter_coin_list.map( m => <Table.Row onClick={this.chooseCoin.bind(this, m.commodity_symbol)}>
                                <Table.Cell>{m.name_en}</Table.Cell>
                              </Table.Row>)
                            }
                          </Table.Body>
                        </Table>
                      </div>
                    </div>
                  </Popup>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <div className="coin-market item-inner cate-table" style={{height: '220px'}}>
                  <div className="ceil-box">
                    <div className="table-wrapper">
                      <Table basic="very" textAlign="center" className="no-border-table thin-table">
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>{intl.get('coin')}</Table.HeaderCell>
                            <Table.HeaderCell>{intl.get('lastprice')}</Table.HeaderCell>
                            <Table.HeaderCell>{intl.get('change')}</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {
                            filter_market_list.map( c => <Table.Row key={c.name + '_maket_table'} active={activeCoin == c.name} onClick={this.chooseCoin.bind(this, c.name)}>
                              <Table.Cell><span>{c.name}</span></Table.Cell>
                              <Table.Cell><span className={'color-' + c.direction}>{c.price}</span></Table.Cell>
                              <Table.Cell><span className={'color-' + c.direction}>{ c.direction === 'up' ? '+' + c.change : c.change}</span></Table.Cell>
                            </Table.Row>)
                          }
                        </Table.Body>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item-60-100" style={{width: '60%'}}>
              <div className="trade-box item-inner" style={{padding: 0}}>
                <TradePanel
                  {...{ exchange_available,
                    coin: activeCoin,
                    contract_id: activeCoin,
                    actions: {trade},
                    current_price: new_deal_list.length && new_deal_list[0].price,
                    submit_status,
                    buy_submit_ing,
                    sell_submit_ing,
                    currency_available,
                    active_coin_available,
                    lang: this.props.Lang.lang
                  }} />
              </div>
            </div>
            <div className="item-20-100" style={{ padding: '10px 10px 0 10px', width: '20%'}}>
              <div className="deal-wrapper item-inner">
                <div className="full-deal-list-box">
                  <div className="full-deal-title">{intl.get('new')}</div>
                  <div className="full-deal-title caption">
                    <span>
                      {intl.get('price')}
                      {/*({config.CURRENCY})*/}
                    </span>
                    <span className="align-right">{intl.get('count')}
                      {/*({activeCoinInfo.coin_name_en})*/}
                    </span>
                    <span className="align-right">{intl.get('time')}</span>
                  </div>
                  <div className="deal-list-box" style={{height: '300px'}}>
                    <ul className="deal-ul">
                      {
                        new_deal_list.map( (m, index) => <li key={index + '-latest-deals'}>
                          <span className={`${m.type == 'in' ? 'color-up':'color-down'}`}>{m.price}</span>
                          <span className="align-right">{m.quantity}</span>
                          <span className="align-right">{m.time}</span>
                        </li> )
                      }
                    </ul>
                  </div>
                </div>
              </div>
              {/*<div className="coin-market item-inner latest-deals" style={{padding: '10px 0'}}>
                <div className="table-wrapper">
                  <p className="table-title">{intl.get('new')}</p>
                  <div className="ceil-block">
                    <div className="ceil-scrol-box">
                      <Table basic="very" textAlign="center" className="no-border-table thin-table">
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell verticalAlign="top">{intl.get('time')}</Table.HeaderCell>
                            <Table.HeaderCell verticalAlign="top">{intl.get('price')}({config.CURRENCY})</Table.HeaderCell>
                            <Table.HeaderCell verticalAlign="top">{intl.get('count')}({activeCoinInfo.coin_name_en})</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {
                            new_deal_list.map( (m, index) => <Table.Row key={index + '-latest-deals'}>
                              <Table.Cell>{m.time}</Table.Cell>
                              <Table.Cell>
                                <span className={`${m.type == 'in' ? 'color-up':'color-down'}`}>{m.price}</span>
                              </Table.Cell>
                              <Table.Cell>{m.quantity}</Table.Cell>
                            </Table.Row>)
                          }
                        </Table.Body>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>*/}
            </div>

          </div>
          <div className="flex-wrapper" style = {{ width: '100%', padding: '0 10px' }}>
            <div className="user-order-box item-inner" style={{width: '100%', height: '270px', marginTop: '10px', padding: '0px', position: 'relative'}}>
              {
                login ?
                <Link to="/transaction"><div style={{ position: 'absolute', top: 10, right: 10}}>更多>></div></Link>
                :null
              }
              <OrderRecordPanel { ...{login, transac_list, lang: this.props.Lang.lang, getTransacList, withdraw}} />
            </div>
          </div>
        </div>
        {/*<FilterModal {...{ coin_cate_list, filter_coin_list,
          Lang: this.props.Lang, coin_attr_list, active_cate,
          active_child_cate, active_grand_child_cate, active_attr_arr, chooseCate,
          chooseChildCate, chooseGrandsonCate, chooseAttr, getCoinListByAttr, chooseCoin}} ref="FilterModal" footer={false}/>*/}
        {/*<div className="hover-cate-panel" style={ panelStyle } onMouseOut={this.handleOut.bind(this)}>
          <div className="innerBox">
            <div className="banner-line">
              <span className="small-title">{ this.props.Lang.lang == 'en-US' ? active_cate.descrpt_en : active_cate.descrpt_ch}</span>
            </div>
            <div className="tag-box l">
              {
                active_cate.children && active_cate.children.length ?
                active_cate.children.map( n =>  (<span
                  className={`${active_child_cate.id == n.id ? 'active' : ''}`}
                  key={n.id + '_cate'}
                  onMouseOver = {this.handleChildEnter.bind(this, n)}
                  onClick={this.getCoinList.bind(this, n.id)}>{ this.props.Lang.lang == 'en-US' ? n.descrpt_en : n.descrpt_ch}</span>))
                :null
              }
            </div>
            {
              active_child_cate.children && active_child_cate.children.length ?
              [
                <div className="banner-line" style={{marginTop: '75px'}} key="div"></div>,
                <div className="tag-box l" key="tag-box">
                  {active_child_cate.children.map( n => (<span key={ 'span' + n.id} onClick={this.getCoinList.bind(this, n.id)}>{ this.props.Lang.lang == 'en-US' ? n.descrpt_en : n.descrpt_ch}</span>))}
                </div>
              ]:null
            }
          </div>
        </div>*/}

      </div>
      )
  }
  showFilterModal(){
    this.refs.FilterModal.show();
  }
  componentDidMount(){
    /*Toast.error('下单失败！', 5000, 'fa-times-circle');*/
    /*Toast.error('警告', 5000, 'fa-exclamation-triangle')*/
    if(window.mySocket){
      window.mySocket.close();
    }
    /*LazyLoad('noty');*/
    this.props.actions.getCoinConfigList({ org_id: config.ORG_ID, coin: this.props.params.coin})
      .done( (data) => {
        if(data && data.length){
          //设置activeCoin为数组第一位
          /*this.setState({ activeCoin: data[0].commodity_symbol})*/
          var symbol = data[0].commodity_symbol + config.CURRENCY;
          if(this.props.params.coin != 'default'){
            symbol = this.props.params.coin;
          }
          this.dataInit(symbol);
          this.socketInitX(symbol);

          //获取行情
          this.props.actions.getDailyMarket({ symbol: config.CURRENCY})
            .fail( ({msg}) => {
              Toast.error(msg || '获取行情数据失败', 5000);
            })
        }
      })
      .fail( ({msg }) => {
        Toast.error( msg || '获取币对配置信息失败', 5000)
      })
      //当用户登录后获取用户资产
    var account_id = sessionStorage.getItem('_udata_accountid');
    if(account_id){
      this.props.actions.getUserCoinList({})
        .done( data => {
          var currency_available_arr = data.filter( m => m.symbol == config.CURRENCY)
          if(currency_available_arr && currency_available_arr.length){
            var currency_available = currency_available_arr[0].balance;
            this.setState({ currency_available })
          }
          var active_coin_arr = data.filter( m => m.symbol == this.props.Trade.activeCoin);
          if(active_coin_arr && active_coin_arr.length){
            var active_coin_available = active_coin_arr[0].balance;
            this.setState({ active_coin_available });
          }
          this.setState({ user_coin_list: data });
        })
        .fail( ({msg}) => {
          Toast.error( msg || '获取用户资产失败')
        })
      this.getTransacList(1);
      this.setState({ login: true });
    }else{
      this.setState({ login: false })
    }
    this.props.actions.getCoinCategoryList({})
      .fail( ({msg}) => {
        Toast.error(msg || '获取币种分类失败', 5000);
      })
    this.props.actions.getCommonAttrList({})
      .fail( ({msg}) => {
        Toast.error( msg || '获取币种属性失败', 5000);
      })
    this.loadLocales(this.props.Lang.lang);
  }
  //"type": 查询类型 0 所有状态 1 当前委托 2 委托历史 3 成交明细
  getTransacList(type){
    this.props.actions.getTransacList({ type, pageno: 1, pagesize: 10, date_from: '', date_to: '', symbol: '' })
      .fail( ({msg}) => {
        Toast.error(msg || '获取交易记录失败', 5000);
      })
  }
  withdraw(symbol, order_id){
    this.props.actions.withdraw({ symbol, order_id})
      .done(() => {
        Toast.success('撤单申请成功！')
        this.getTransacList(1)
      })
      .fail( ({msg}) => {
        Toast.error( msg || '撤单申请失败！')
      })
  }
  handleEnter(cate){
      this.setState({active_cate: cate, active_child_cate: []});
  }
  triggerOpenCate(cate_id, level, parent, grand_parent){
    this.props.actions.triggerOpenCate({ cate_id, level, parent, grand_parent});
  }

  getActiveCoinAvailable(coin){
    var active_coin_arr = this.state.user_coin_list.filter( m => m.symbol == coin);
    if(active_coin_arr && active_coin_arr.length){
      var active_coin_available = active_coin_arr[0].balance;
      this.setState({ active_coin_available });
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Trade.market_list != nextProps.Trade.market_list){
      var currentCoinInfo = nextProps.Trade.market_list.filter(m => m.name == this.props.Trade.activeCoin);
      var highest = 0, lowest = 0, commit = 0, changeMoney = 0;
      if(currentCoinInfo && currentCoinInfo.length){
        currentCoinInfo = currentCoinInfo[0];
        highest = currentCoinInfo.highest;
        lowest = currentCoinInfo.lowest;
        commit = currentCoinInfo.commit;
        changeMoney = currentCoinInfo.changeMoney;
        this.setState({ highest, lowest, commit, changeMoney});
      }
      this.setState({ state_market_list: nextProps.Trade.market_list,
        filter_market_list: nextProps.Trade.market_list});

    }
    //切换语言
    if(this.props.Lang.lang != nextProps.Lang.lang){
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  getBeforeMarketData(line, symbol){
    var now = Number(new Date());
    var fromtime = new Date();
    fromtime.setMinutes (fromtime.getMinutes () - 24 * 60);
    fromtime = Number(fromtime);
    if(line == '1d'){
      fromtime = undefined;
      now = -1;
    }
    this.props.actions.getBeforeMarketData({from: -3, to: now, line, symbol, count: 100})
      .done( () => {
      })
      .fail( ({msg}) => {
        Toast.error(msg || '获取失败！', 5000)
      })
  }
  onChangeLine(line){
    if(line != this.state.current_line){
      //取消当前订阅
      var formerLine = this.state.current_line;
      var symbol = this.props.Trade.activeCoin + config.CURRENCY;
      formerLine = formerLine == 'timeline' ? '1m' : formerLine; //分时取1m数据
      this.socketCancelSuscribe(window.mySocket, 'market.' + symbol +'.kline.' + formerLine );

      this.setState({current_line: line});
      line = line == 'timeline' ? '1m': line;
      //订阅后修改
      /*this.setState({current_line: line, suscribe_success: false});*/
      this.getBeforeMarketData(line, symbol);
      /*window.socket.close();*/
      /*this.socketInit(line, symbol);*/

      //重新订阅一个数据
      this.socketOpen(mySocket, 'market.' + symbol +'.kline.' + line );
    }
  }
  //数据初始化
  dataInit(symbol){
    this.getBeforeMarketData(this.state.current_line, symbol);
    this.props.actions.getNewDeals({symbol, count: 10})
      .done(() => {
        //最后一个为最新数据
        this.setState({new_deal_list: this.props.Trade.deal_list})
      })
    this.props.actions.getOrderList({symbol})
      .done(() => {
        this.setState({new_in_order_list: this.props.Trade.in_order_list,
          new_out_order_list: this.props.Trade.out_order_list
        })
      })
  }
  socketOpen(socket, channel){
    console.log('websocket连接打开');
    var data = getSocketHeader(channel);
    data = JSON.stringify(data);
    this.waitForConnection( () => {
      console.warn('send data:' + data)
      socket.send(data);
    }, socket, 5000);
  }
  socketCancelSuscribe(socket, channel){
    console.log('取消socket订阅' + channel);
    var data = getCancelSocketHeader(channel);
    data = JSON.stringify(data);
    this.waitForConnection( () => {
      console.warn('send data:' + data)
      socket.send(data);
    }, socket, 5000);
  }
  cancelAllSocketSuscribe(){
    //取消订阅
    var line = this.state.current_line;
    var symbol = this.props.Trade.activeCoin + config.CURRENCY;
    line = line == 'timeline' ? '1m' : line; //分时取1m数据
    this.socketCancelSuscribe(window.mySocket, 'market.' +config.CURRENCY + '.kline.daily');
    this.socketCancelSuscribe(window.mySocket, 'market.' + symbol + '.trade.detail');
    this.socketCancelSuscribe(window.mySocket, 'market.' + symbol + '.depth.step0');
    this.socketCancelSuscribe(window.mySocket, 'market.' + symbol +'.kline.' + line );
  }
  //初始化订阅时需要订阅的频道
  socketOpenInit(){
    //订阅daily;
    this.socketOpen(window.mySocket, 'market.' +config.CURRENCY + '.kline.daily')
  }
  waitForConnection(callback, socket, interval) {
      if (socket.readyState === 1) {
          callback();
      } else {
          var that = this;
          // optional: implement backoff for interval here
          console.warn('still connecting');
          setTimeout(function () {
              that.waitForConnection(callback, socket, interval);
          }, interval);
      }
  }
  socketInitX(symbol){
    if(window.WebSocket){
      var mySocket;
      var self = this;
      if(!window.mySocket){
        mySocket = new WebSocket(config.socket_url);
        var line = self.state.current_line;
        line = line == 'timeline' ? '1m' : line; //分时取1m数据
        mySocket.onopen = function(){
          self.socketOpen(mySocket, 'market.' +config.CURRENCY + '.kline.daily');
          self.socketOpen(mySocket, 'market.' + symbol + '.trade.detail');
          self.socketOpen(mySocket, 'market.' + symbol + '.depth.step0');
          self.socketOpen(mySocket, 'market.' + symbol +'.kline.' + line );
        }
        mySocket.onclose = function (event) {
            console.log("webSocket 连接关闭");
        };
        mySocket.onmessage = function(event){
          // 如果服务端是写的二进制数据，则此处的blob也是一个二进制对象，提取数据时需要Blob类和FileReader类配合使用
          var blob = event.data;
          blob = JSON.parse(blob);
          self.handleSocketData(blob);
        }
        window.mySocket = mySocket;
      }else{
        mySocket = window.mySocket;
      }
    }else{
      Toast.warning('"你的浏览器不支持websocket"')
    }
  }
  handleSocketData(blob){
    var symbol = this.props.Trade.activeCoin + config.CURRENCY;
    var { current_line } = this.state
    var line = current_line == 'timeline' ? '1m' : current_line; //分时取1m数据
    if(this.state.suscribe_success){
      switch(blob.channel){
        case 'market.' +config.CURRENCY + '.kline.daily':
          this.handleDaily(blob);break;
        case 'market.' + symbol + '.trade.detail':
          this.handleDeal(blob);break;
        case 'market.' + symbol + '.depth.step0':
          this.handleOrder(blob);break;
        case 'market.' + symbol +'.kline.' + line:
          var transUnit = 60000; //1分钟=60000毫米   和timeline都是
          switch(line){
            case '5m':
              transUnit *= 5;break;
            case '10m':
              transUnit *= 10;break;
            case '15m':
              transUnit *= 15;break;
            case '30m':
              transUnit *= 30;break;
            case '60m':
              transUnit *= 60;break;
            case '1d':
              transUnit *= 24 * 60;break;
            default:;break;
          }
          this.handleKline(blob, transUnit);break;
        default:;break;
      }
    }else{
      if( blob.result.code === 0){
        this.setState({ suscribe_success: true});
      }else{
        Toast.error(blob.result.msg || '订阅失败！', 5000);
      }
    }

  }
  //处理行情订阅的数据
  handleDaily(blob){
    var dailyArr = blob.data.daily;
    var { coin_config_list } = this.props.Trade;
    var newDailyArr = coin_config_list.map( h => {
      var currentCoinInfo = dailyArr.filter( m => h.commodity_symbol == m.s);
      var { price_decimal, quantity_decimal } = h;
      var data = { name: currentCoinInfo[0].s, price: parseFloat(currentCoinInfo[0].c).toFixed(price_decimal), change: currentCoinInfo[0].cg,
        highest: parseFloat(currentCoinInfo[0].h).toFixed(price_decimal),
        lowest: parseFloat(currentCoinInfo[0].l).toFixed(price_decimal),
        commit: parseFloat(currentCoinInfo[0].a).toFixed(price_decimal),
        changeMoney: (parseFloat(currentCoinInfo[0].c) - parseFloat(currentCoinInfo[0].o)).toFixed(price_decimal),
      };
      if(currentCoinInfo[0].cg.indexOf('-') != -1){
        data.direction = 'down'
      }else{
        data.direction = 'up';
      }
      return data;
    })
    /*dailyArr = dailyArr.map( m => {
      var currentCoinInfo = coin_config_list.filter( h => h.commodity_symbol == m.s);
      var { price_decimal, quantity_decimal } = currentCoinInfo[0];
      var data = { name: m.s, price: parseFloat(m.c).toFixed(price_decimal), change: m.cg,
        highest: parseFloat(m.h).toFixed(price_decimal),
        lowest: parseFloat(m.l).toFixed(price_decimal),
        commit: parseFloat(m.a).toFixed(price_decimal),
        changeMoney: (parseFloat(m.c) - parseFloat(m.o)).toFixed(price_decimal),
      };
      if(m.cg.indexOf('-') != -1){
        data.direction = 'down'
      }else{
        data.direction = 'up';
      }
      return data;
    })*/
    var currentCoinInfo = newDailyArr.filter(m => m.name == this.props.Trade.activeCoin);
    var highest = 0, lowest = 0, commit = 0, changeMoney = 0;
    if(currentCoinInfo && currentCoinInfo.length){
      currentCoinInfo = currentCoinInfo[0];
      highest = currentCoinInfo.highest;
      lowest = currentCoinInfo.lowest;
      commit = currentCoinInfo.commit;
      changeMoney = currentCoinInfo.changeMoney;
      this.setState({ highest, lowest, commit, changeMoney});
    }
    console.warn('daily数据：')
    console.warn(newDailyArr);
    var { coin_list } = this.props.Trade;
    var new_coin_list = [];
    if(this.state.active_cate_id){
      new_coin_list = coin_list.map( m => {
        var index = newDailyArr.findIndex( n => n.name + 'USDX' == m.symbol);
        return newDailyArr[index];
      })
    }else{
      new_coin_list = newDailyArr;
    }
    this.setState({ state_market_list: newDailyArr, filter_market_list: new_coin_list })
  }
  //处理成交订阅的数据
  handleDeal(blob){
    var blobData = blob.data;
    var { price_decimal } = this.props.Trade.activeCoinInfo;
    var data = { id: blobData.d, price: Number(blobData.p).toFixed(price_decimal), quantity: blobData.q, time: timestampToTime(blobData.t),type: blobData.m ? 'in' : 'out'}
    var { new_deal_list } = this.state;
    new_deal_list=[data, ...new_deal_list];
    new_deal_list.pop(); //删除数组的最后一个元素，最后一个元素为最久的数据
    console.warn('成交数据：')
    console.warn(data);
    this.setState({ new_deal_list })
  }
  //处理订单订阅的数据
  handleOrder(blob){
    var { asks, bids } = blob.data;
    var { price_decimal, quantity_decimal } = this.props.Trade.activeCoinInfo;
    //卖盘数据
    asks = asks.map ( m => {
      var item = m ;
      try{
        item[0] = parseFloat(item[0]).toFixed(price_decimal);
        item[1] = parseFloat(item[1]).toFixed(quantity_decimal);
      }catch(e){
        console.warn(e);
      }
      return { quantity: item[1], price: item[0]};
    })
    bids = bids.map( m => {
      var item = m ;
      try{
        item[0] = parseFloat(item[0]).toFixed(price_decimal);
        item[1] = parseFloat(item[1]).toFixed(quantity_decimal);
      }catch(e){
        console.warn(e);
      }
      return { quantity: item[1], price: item[0]};
    })
    var { new_in_order_list, new_out_order_list } = this.state;
    //第一个数据为最新的数据，第十个数据为最老的数据
    new_out_order_list = asks.slice(0, 10).reverse();
    new_in_order_list = bids.slice(0, 10);
    console.warn('订单数据一条');
    console.warn('买盘数据：' );
    console.warn(new_in_order_list);
    console.warn('卖盘数据：')
    console.warn(new_out_order_list);
    this.setState({ new_in_order_list, new_out_order_list})
  }
  //处理K线数据
  handleKline(blob, transUnit){
    //blob.ts 为发送数据的时间， blob.kline.t 为成交时间
    var kline = blob.data.kline;
    //一条记录： 开盘价（open）,收盘价（close）,最低价（lowest）,最高价（highest)
    if(this.state.last_t && (blob.data.ts - this.state.last_t * transUnit) < transUnit){
      console.warn(this.state.current_line + '内数据')
      this.setState({isNew: false});
    }else{
      console.warn('非' + this.state.current_line + '内数据')
      this.setState({isNew: true, last_t: kline.t});
    }
    var record = [timestampToTime(kline.t * transUnit), kline.o, kline.c, kline.l, kline.h, Number(kline.q)];
    var { Kdata } = this.state;
    this.setState({ addKdata: record })
    console.warn(record);
  }
  trade(params){
    /*var { coin_type, market, sell_price, sell_count, buy_count, buy_price } = this.state;
    var { trade_type } = params;*/
    var account_id = parseInt(sessionStorage.getItem('_udata_accountid'));
    if(account_id){
      return this.props.actions.trade(params)
      .done( () => {
        Toast.success('下单成功！');
        this.props.actions.getUserCoinList({})
          .done( data => {
            var currency_available_arr = data.filter( m => m.symbol == config.CURRENCY)
            if(currency_available_arr && currency_available_arr.length){
              var currency_available = currency_available_arr[0].balance;
              this.setState({ currency_available })
            }
          })
          .fail( ({msg}) => {
            Toast.error( msg || '获取用户资产失败')
          })
        this.getTransacList(1);
      })
      .fail( (msg) => {
        Toast.error(msg || '下单失败！');
      })
    }else{
      Toast.warning('用户未登录，请登录后购买！')
    }
  }
  chooseCoin(coin){
    this.setState({ isOpen: false});
    this.getActiveCoinAvailable(coin);
    //取消先前订阅
    var line = this.state.current_line;
    var symbol = this.props.Trade.activeCoin + config.CURRENCY;
    line = line == 'timeline' ? '1m' : line; //分时取1m数据
    this.socketCancelSuscribe(window.mySocket, 'market.' + symbol + '.trade.detail');
    this.socketCancelSuscribe(window.mySocket, 'market.' + symbol + '.depth.step0');
    this.socketCancelSuscribe(window.mySocket, 'market.' + symbol +'.kline.' + line );

    var trade_pair = config.coin_trade_pair;
    /*var exchange_available = trade_pair.filter(m => m.name == coin)[0].exchange_available;*/
    //订阅数据格式改变时改动
    /*this.setState({ activeCoin: coin, exchange_available, current_line: '1m' })*/
    this.props.actions.chooseCoin(coin);
    /*this.setState({ activeCoin: coin, current_line: '1m' })*/
    this.setState({ current_line: '1m' })
    /*this.setState({ activeCoin: coin, exchange_available, current_line: '1m',
      suscribe_success: false, order_suscribe_success: false, deal_suscribe_success: false
    });*/
    //设置日最高等参数
    var currentCoinInfo = this.state.filter_market_list.filter(m => m.name == coin);
    var highest = 0, lowest = 0, commit = 0, changeMoney = 0;
    if(currentCoinInfo && currentCoinInfo.length){
      currentCoinInfo = currentCoinInfo[0];
      highest = currentCoinInfo.highest;
      lowest = currentCoinInfo.lowest;
      commit = currentCoinInfo.commit;
      changeMoney = currentCoinInfo.changeMoney;
      this.setState({ highest, lowest, commit, changeMoney});
    }
    var symbol = coin + config.CURRENCY;

    this.dataInit(symbol);
    this.socketOpen(mySocket, 'market.' + symbol + '.trade.detail');
    this.socketOpen(mySocket, 'market.' + symbol + '.depth.step0');
    this.socketOpen(mySocket, 'market.' + symbol +'.kline.' + this.state.current_line );
  }
  componentWillUnmount(){
    this.cancelAllSocketSuscribe()
    if(window.mySocket){
      window.mySocket.close();
      delete window.mySocket;
    }
    if(window.myChart){
      window.myChart.clear();
      window.myChart.dispose();
    }
    if(window._get_xdata_timer){
      clearInterval(window._get_xdata_timer);
    }
  }
  chooseCate(cate){
    this.setState({ active_cate: cate });
  }
  handleOut(e){
    var div = $('.hover-cate-panel')[0];
    var x=e.clientX;
    var y=e.clientY;
    var divx1 = div.offsetLeft;
    var divy1 = div.offsetTop;
    var divx2 = div.offsetLeft + div.offsetWidth;
    var divy2 = div.offsetTop + div.offsetHeight;
    if( x < divx1 || x > divx2 || y < divy1 || y > divy2){
      //如果离开，则执行。
      this.setState({active_cate: {}});
    }
  }
  handleChildEnter(cate){
    this.setState({active_child_cate: cate, active_grand_child_cate: {}});
  }
  chooseChildCate(cate){
    this.setState({ active_child_cate: cate, active_grand_child_cate: {} });
  }
  handleGrandChildEnter(cate){
    this.setState({ active_grand_child_cate: cate });
  }
  chooseGrandsonCate(cate){
    this.setState({ active_grand_child_cate: cate });
  }
  chooseAttr(attr){
    var { active_attr_arr } = this.state;
    var index = active_attr_arr.findIndex( m => m.parent == attr.parent);
    if(index >= 0 ){
      if( active_attr_arr[index].id == attr.id){
        delete active_attr_arr[index];
      }else{
        active_attr_arr[index] = attr;
      }
    }else{
      active_attr_arr.push(attr);
    }
    this.setState({ active_attr_arr });
  }
  clearAttr(){
    this.setState({ active_attr_arr: []})
  }
  getCoinList(attr){
    this.setState({ active_cate_id: attr})
    var cate_list = clone(this.props.Trade.origin_coin_cate_list);
    var fakeattr = attr;
    if(this.state.active_child_cate){
      fakeattr = this.state.active_child_cate.id;
    }
    var cateFiltered = cate_list.filter( m => m.id == attr);
    if(cateFiltered.length){
      var cate = cateFiltered[0];
      var level = cate.level;
      var titleStr = this.props.Lang.lang == 'en-US'? cate.descrpt_en : cate.descrpt_ch;
      var parent_id = cate.parent;
      while(parent_id){
        cate = cate_list.filter( m => m.id == parent_id )[0];
        parent_id = cate.parent;
        titleStr = (this.props.Lang.lang == 'en-US'? cate.descrpt_en : cate.descrpt_ch) + ' | ' + titleStr;
      }
      this.setState({ coin_quene_title: titleStr});
    }
    this.props.actions.getCoinList({attr: fakeattr, top: 10})
      .done( () => {
        var { state_market_list } = this.state;
        var { coin_list } = this.props.Trade;
        var new_coin_list = coin_list.map( m => {
          var index = state_market_list.findIndex( n => n.name + 'USDX' == m.symbol);
          return state_market_list[index];
        })
        console.error(new_coin_list)
        this.setState({ filter_market_list : new_coin_list});
      })
  }
  getCoinListByAttr(){
    if(!this.state.isOpen){
      var cate_id = 0, attr = "{}";
      var { active_cate, active_attr_arr } = this.state;
      if(active_cate.id){
        cate_id = active_cate.id;
      }
      if(active_attr_arr.length){
        var attr_arr = active_attr_arr.map( m => {return m.id})
        attr = "{" + attr_arr.join(',') + "}";
      }
      this.props.actions.getCoinListByAttr({ category: cate_id, attr, top: 100})
        .done( () => {
          this.setState({isOpen: !this.state.isOpen});
        })
        .fail( ({msg}) => {
          Toast.error( msg || '获取币失败')
        })
    }else{
      this.setState({isOpen: !this.state.isOpen});
    }

  }
  clearCate(){
    var str = this.props.Lang.lang == 'en-US' ? 'Hot coins' : '热门虚拟币';
    this.setState({ active_cate_id : 0, active_cate: {}, coin_quene_title:  str})
  }
  //初始化语言脚本
  loadLocales(lang){
    intl.init({
      currentLocale: lang || 'en-us',
      locales: trade
    })
    .then( () => {
      //设置分类的标题，先暂时在这里处理
      this.setState({coin_quene_title: intl.get('categoriestitle') })
    })
  }

}

function mapStateToProps(state){
  return state.TradeData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...TradeActions,
      ...FinanceActions
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Trade);