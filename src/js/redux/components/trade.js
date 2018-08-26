import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Select, Dropdown, Icon, Pagination, Input, Checkbox, Message, Grid, Menu }  from 'semantic-ui-react';
import FLChart from './chart.js';
import TradePanel from './trade-lib/trade-panel.js';
import OrderRecordPanel from './trade-lib/order-record-panel.js';
import { timestampToTime } from 'utils/utils.js';
import * as TradeActions from 'actions/trade.js';
import config from 'config/app.config.js';
import { getSocketHeader } from 'utils/request.js';
import LazyLoad from 'utils/lazy_load';
import { Noty } from 'utils/utils';
import intl from 'react-intl-universal';
import { trade } from 'locales/index.js';

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

class Trade extends Component{
  constructor(props){
    super(props);
    this.state = {
      suscribe_success: false,
      addKdata: [], //随次增加的数据
      isNew: true, //收到的分时数据是新增数据还是更新数据
      activeCoin: "BTC",
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
      active_cate_id: 0,   //用来声明是否有被选中cate
      coin_quene_title: '热门虚拟币',

      isFake: false, //是否为模拟交易
    }
    this.trade = this.trade.bind(this);
  }
  render(){
    var tradePanelProps = { actions: {}};
    var { Kdata_list, market_list, coin_cate_list } = this.props.Trade;
    var { transac_list } = this.props.Transaction;
    var { sell_submit_ing, buy_submit_ing, submit_status } = this.props.Exchange;
    var { addKdata, activeCoin, exchange_available, isNew, msg_color, msg_visible, new_deal_list,
      new_in_order_list, new_out_order_list, current_line, login, state_market_list, filter_market_list,
      highest, lowest, commit, changeMoney, active_cate, active_child_cate, coin_quene_title,
      active_cate_id, isFake } = this.state;
    var { trade } = this;
    var coin_eng_name = config.coin_trade_pair.filter( m => m.name == this.state.activeCoin)[0].eng_name;
    var panelStyle = active_cate.id ? { display: 'inline'} : { display: 'none'};
    //币的现价
    var currentPrice = new_deal_list.length && new_deal_list[new_deal_list.length - 1].price;
    //现价的locale价
    var currentPriceLocale = this.props.Lang.lang == 'en-US' ? Number(currentPrice).toFixed(4) : (currentPrice * 6.69).toFixed(4);
    return (
      <div>
        <div className="fl-block gray-bg">
          {
            isFake ?
            <Menu size="mini" style={{width: '100%'}} className="fake-trade-menu" >
              <Menu.Item>模拟交易</Menu.Item>
              <Menu.Item>交易场</Menu.Item>
              <Menu.Item>账户信息</Menu.Item>
              <Menu.Item>订单记录</Menu.Item>
              <Menu.Item position="right">
                <Dropdown item text='切换账户' size="mini">
                  <Dropdown.Menu>
                    <Dropdown.Item>English</Dropdown.Item>
                    <Dropdown.Item>Russian</Dropdown.Item>
                    <Dropdown.Item>Spanish</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </Menu>
            :null
          }
          <div className="flex-wrapper">
            <div className="item-20-100" style={{paddingRight: '15px'}}>
              <div className="coin-market item-inner"  style={{height: '515px', padding: '10px 0'}}>
                <div className="table-wrapper">
                  <p className="table-title" style={{textAlign: 'center', marginBottom: '10px'}}>{intl.get('categories')}</p>
                  {
                    coin_cate_list.map( m => { return (<div className={`cate-item ${active_cate.id == m.id ? 'active':''}`}
                      onMouseOver={this.handleEnter.bind(this, m)}
                      onMouseOut={this.handleOut.bind(this)}
                      onClick={this.getCoinList.bind(this, m.id)}
                      key={m.id + '-coin-cate'}
                    >
                      <span>{this.props.Lang.lang == 'en-US' ? m.descrpt_en : m.descrpt_ch}</span>
                      <i className = 'arrow'><img src="images/arrow-right-32.png"/></i>
                      </div>) })
                  }
                </div>
                <div style={{position: 'relative'}}>
                  <p className="table-title" style={{marginBottom: '10px'}}>
                    { coin_quene_title }
                  </p>
                  {
                    active_cate_id ?
                    <Button className="clear-btn" circular icon ="delete" size="mini" onClick={this.clearCate.bind(this)} />
                    :null
                  }
                  {/*<Input icon placeholder='搜索币种' size="small" style={{width: '50%', height: '30px'}}>
                    <input />
                    <Icon name='search' />
                  </Input>
                  <Checkbox style={{marginLeft: '5px'}} label={<label>只选择<Icon name="star"/></label>} />*/}
                </div>
                <div className="table-wrapper" style={{marginTop: '10px'}}>
                  <Table basic="very" textAlign="center" className="no-border-table">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>{intl.get('coin')}</Table.HeaderCell>
                        <Table.HeaderCell>{intl.get('lastprice')}</Table.HeaderCell>
                        <Table.HeaderCell>{intl.get('change')}</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {
                        filter_market_list.map( c => <Table.Row key={c.name + '_maket_table'} active={activeCoin == c.name} onClick={this.chooseCoin.bind(this, c.name)}>
                          <Table.Cell><Icon name="star" /></Table.Cell>
                          <Table.Cell><span>{c.name}</span></Table.Cell>
                          <Table.Cell><span className={'color-' + c.direction}>{c.price}</span></Table.Cell>
                          <Table.Cell><span className={'color-' + c.direction}>{ c.direction === 'up' ? '+' + c.change : c.change}</span></Table.Cell>
                        </Table.Row>)
                      }
                    </Table.Body>
                  </Table>
                </div>
              </div>
              <div className="coin-market item-inner latest-deals" style={{height: '490px', marginTop: '15px',padding: '10px 0'}}>
                <div className="table-wrapper">
                  <p className="table-title">{intl.get('new')}</p>
                  <Table basic="very" textAlign="center" className="no-border-table">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell verticalAlign="top">{intl.get('time')}</Table.HeaderCell>
                        <Table.HeaderCell verticalAlign="top">{intl.get('type')}</Table.HeaderCell>
                        <Table.HeaderCell verticalAlign="top">{intl.get('price')}<br/>{config.CURRENCY}</Table.HeaderCell>
                        <Table.HeaderCell verticalAlign="top">{intl.get('count')}<br />{activeCoin}</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {
                        new_deal_list.map( (m, index) => <Table.Row key={index + '-latest-deals'}>
                          <Table.Cell>{m.time}</Table.Cell>
                          <Table.Cell>
                            <span className={`${m.type == 'in' ? 'color-up':'color-down'}`}>{m.type == 'in' ? '买':'卖'}</span>
                          </Table.Cell>
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
            <div className="item-60-100">
              <div className="coin-current-info item-inner" style={{paddingLeft: 0, paddingRight: 0}}>
                <div style={{height: '45px', borderBottom: '1px solid #eee', padding: '10px 20px 0px 20px', display: 'flex'}}>
                  <div className="item-7">
                    <Icon name="star outline"/>
                    <span style={{fontSize: '18px'}}>
                     <Icon name="circle" color="grey" size="large" />
                      {activeCoin}</span>
                    <span style={{marginLeft: '5px', fontSize: '10px'}}><a href={'http://47.106.71.87:8020/' + activeCoin + '.jpg'} target="_blank">{coin_eng_name}</a></span>
                    <span style={{marginLeft: '5px'}} className="price-amount"> { currentPrice + config.CURRENCY}</span>
                    <span style={{marginLeft: '5px', fontSize: '10px'}}>≈ {intl.get('currentpriceNum', { amount: (currentPriceLocale) })}</span>
                  </div>
                  <div className="item-3" style={{textAlign: 'right'}}>
                    <span className="light-grey-color">
                      {intl.get('support')}
                    </span>
                    <Icon name="circle" color='grey' />
                    <Icon name="circle" color='grey' />
                    <Icon name="circle" color='grey' />
                  </div>
                </div>
                <div style={{display: 'flex', width: '80%', margin: '20px auto 0 auto'}}>
                  <div className="item item-5 light-grey-color">
                    <p>{intl.get('daychange').toUpperCase()}</p>
                    {
                      Number(changeMoney) > 0 ?
                      <p className="color-up" style={{marginTop: '10px'}}>
                      {  '+' + changeMoney + config.CURRENCY }
                      </p>
                      :
                      <p className="color-down" style={{marginTop: '10px'}}>
                      {   changeMoney + config.CURRENCY }
                      </p>
                    }
                  </div>
                  <div className="item item-5 light-grey-color">
                    <p>{intl.get('highest').toUpperCase()}</p>
                    <p style={{marginTop: '10px'}}>{highest + config.CURRENCY}</p>
                  </div>
                  <div className="item item-5 light-grey-color">
                    <p>{intl.get('lowest').toUpperCase()}</p>
                    <p style={{marginTop: '10px'}}>{lowest + config.CURRENCY}</p>
                  </div>
                  <div className="item item-40-100 light-grey-color">
                    <p>{intl.get('dealcount').toUpperCase()}/{intl.get('amount').toUpperCase()}</p>
                    <p style={{marginTop: '10px'}}>{commit + config.CURRENCY}</p>
                  </div>
                </div>
              </div>
              <div className="market-k-chart item-inner">
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
                    {/*<li className={`${current_line == '10m' ? 'active': ''}`}>
                      <div onClick={this.onChangeLine.bind(this, '10m')}>10分钟</div>
                    </li>*/}
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
              <div className="trade-box item-inner" style={{padding: 0}}>
                <TradePanel
                  {...{ exchange_available,
                    coin: activeCoin,
                    actions: {trade},
                    current_price: new_deal_list.length && new_deal_list[0].price,
                    submit_status,
                    buy_submit_ing,
                    sell_submit_ing,
                    lang: this.props.Lang.lang
                  }} />
              </div>
              {/*<div className="user-order-box item-inner">
                <OrderRecordPanel { ...{login, transac_list}} />
              </div>*/}
            </div>
            <div className="item-20-100" style={{paddingLeft: '15px'}}>
              <div className="coin-market item-inner" style={{height: 'auto', padding: '10px 0'}}>
                <div className="table-wrapper">
                    <p className="table-title">{intl.get('sellquene')}</p>
                    <Table basic="very" textAlign="center" className="no-border-table">
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell></Table.HeaderCell>
                          <Table.HeaderCell>{intl.get('price')}({config. CURRENCY})</Table.HeaderCell>
                          <Table.HeaderCell>{intl.get('quantity')}({activeCoin})</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {
                          new_out_order_list.map( (item, index) =><Table.Row key={index + '-order-list'}>
                          <Table.Cell><span>{intl.get('sell') + ' '}{ new_out_order_list.length - index}</span></Table.Cell>
                          <Table.Cell><span className="color-down">{item.price}</span></Table.Cell>
                          <Table.Cell>{item.quantity}</Table.Cell>
                        </Table.Row> )
                        }
                      </Table.Body>
                    </Table>
                </div>
              </div>
              <div className="coin-market item-inner market-price" style={{height: '60px', marginTop: '15px'}}>
                <div>
                  <h5>{intl.get('currentprice')}　<span className="price-amount">
                    { currentPrice }
                    </span>
                  <span className="unit">{config.CURRENCY}</span></h5>
                  <p> ≈ {intl.get('currentpriceNum', { amount: (currentPriceLocale) })}</p>
                </div>
              </div>
              <div className="coin-market item-inner" style={{height: '460px', marginTop: '15px', padding: '10px 0px'}}>
              <div className="table-wrapper">
                <p className="table-title">{intl.get('buyquene')}</p>
                <Table basic="very" textAlign="center" className="no-border-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell></Table.HeaderCell>
                      <Table.HeaderCell>{intl.get('price')}({config.CURRENCY})</Table.HeaderCell>
                      <Table.HeaderCell>{intl.get('quantity')}({activeCoin})</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      new_in_order_list.map((m, index) => <Table.Row key={index+'_in_table'}>
                      <Table.Cell><span>{intl.get('buy') + ' '}{ index + 1}</span></Table.Cell>
                      <Table.Cell><span className="color-up">{m.price}</span></Table.Cell>
                      <Table.Cell>{m.quantity}</Table.Cell>
                    </Table.Row>)
                    }
                  </Table.Body>
                </Table>
              </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hover-cate-panel" style={ panelStyle } onMouseOut={this.handleOut.bind(this)}>
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
        </div>
      </div>
      )
  }
  componentDidMount(){
    /*if(window.socket){
      window.socket.close();
    }
    this.dailySocketInit()*/
    if(window.mySocket){
      window.mySocket.close();
    }
    LazyLoad('noty', () => {
      /*LazyLoad('noty');*/
      var symbol = this.state.activeCoin + config.CURRENCY;
      //获取行情
      this.props.actions.getDailyMarket({ symbol: config.CURRENCY})
        .fail( ({msg}) => {
          Noty('error', msg || '获取行情数据失败')
        })
        this.socketInitX();
        this.dataInit(symbol);
      /*var account_id = sessionStorage.getItem('_udata_accountid');
      if(account_id){
        this.props.actions.getTransacList({ type: 0})
          .fail( ({msg}) => {
            Noty('error', msg || '获取订单列表失败')
          })
        this.setState({ login: 1});
      }*/
      window.addEventListener('beforeunload', this.closeSocket);
      this.props.actions.getCoinCategoryList({})
        .fail( ({msg}) => {
          Noty('error', msg || '获取币种分类失败')
        })
    })
    this.loadLocales(this.props.Lang.lang);
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Trade.market_list != nextProps.Trade.market_list){
      var currentCoinInfo = nextProps.Trade.market_list.filter(m => m.name == this.state.activeCoin);
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
        Noty('error', msg || '获取失败')
      })
  }
  onChangeLine(line){
    if(line != this.state.current_line){
      this.setState({current_line: line});
      //订阅后修改
      /*this.setState({current_line: line, suscribe_success: false});*/
      var symbol = this.state.activeCoin + config.CURRENCY;
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
    this.props.actions.getNewDeals({symbol})
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
    /*this.socketInit(this.state.current_line, symbol);
    this.dealSocketInit(symbol);
    this.orderSocketInit(symbol);*/

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
  socketInitX(){
    if(window.WebSocket){
      var mySocket;
      var self = this;
      var symbol = this.state.activeCoin + config.CURRENCY;
      if(!window.mySocket){
        mySocket = new WebSocket(config.socket_url);
        mySocket.onopen = function(){
          self.socketOpen(mySocket, 'market.' +config.CURRENCY + '.kline.daily');
          self.socketOpen(mySocket, 'market.' + symbol + '.trade.detail');
          self.socketOpen(mySocket, 'market.' + symbol + '.depth.step0');
          self.socketOpen(mySocket, 'market.' + symbol +'.kline.' + self.state.current_line );
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
      Noty('warning',"你的浏览器不支持websocket");
    }
  }
  handleSocketData(blob){
    var symbol = this.state.activeCoin + config.CURRENCY;
    if(this.state.suscribe_success){
      switch(blob.channel){
        case 'market.' +config.CURRENCY + '.kline.daily':
          this.handleDaily(blob);break;
        case 'market.' + symbol + '.trade.detail':
          this.handleDeal(blob);break;
        case 'market.' + symbol + '.depth.step0':
          this.handleOrder(blob);break;
        case 'market.' + symbol +'.kline.' + this.state.current_line:
          var transUnit = 60000; //1分钟=60000毫米   和timeline都是
          var { current_line } = this.state
          var line = current_line == 'timeline' ? '1m' : current_line; //分时取1m数据
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
        Noty('error', blob.result.msg || '订阅失败！');
      }
    }

  }
  //处理行情订阅的数据
  handleDaily(blob){
    var dailyArr = blob.data.daily;
    dailyArr = dailyArr.map( m => {
      var data = { name: m.s, price: parseFloat(m.c).toFixed(4), change: m.cg,
        highest: parseFloat(m.h).toFixed(4),
        lowest: parseFloat(m.l).toFixed(4),
        commit: parseFloat(m.a).toFixed(4),
        changeMoney: (parseFloat(m.c) - parseFloat(m.o)).toFixed(4),
      };
      if(m.cg.indexOf('-') != -1){
        data.direction = 'down'
      }else{
        data.direction = 'up';
      }
      return data;
    })
    var currentCoinInfo = dailyArr.filter(m => m.name == this.state.activeCoin);
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
    console.warn(dailyArr);
    var { coin_list } = this.props.Trade;
    var new_coin_list = [];
    if(this.state.active_cate_id){
      new_coin_list = coin_list.map( m => {
        var index = dailyArr.findIndex( n => n.name + 'USDX' == m.symbol);
        return dailyArr[index];
      })
    }else{
      new_coin_list = dailyArr;
    }
    this.setState({ state_market_list: dailyArr, filter_market_list: new_coin_list })
  }
  //处理成交订阅的数据
  handleDeal(blob){
    var blobData = blob.data;
    var data = { id: blobData.d, price: Number(blobData.p).toFixed(4), quantity: blobData.q, time: timestampToTime(blobData.t),type: blobData.m ? 'in' : 'out'}
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
    //卖盘数据
    asks = asks.map ( m => {
      var item = m ;
      try{
        item[0] = parseFloat(item[0]).toFixed(4);
        item[1] = parseFloat(item[1]).toFixed(4);
      }catch(e){
        console.warn(e);
      }
      return { quantity: item[1], price: item[0]};
    })
    bids = bids.map( m => {
      var item = m ;
      try{
        item[0] = parseFloat(item[0]).toFixed(4);
        item[1] = parseFloat(item[1]).toFixed(4);
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
  //获取K线图数据
  socketInit(line, symbol){
    //type='deal' //为最新成交 type="order" //为买卖队列
    var socket;
    var self = this;
    var transUnit = 60000; //1分钟=60000毫米   和timeline都是
    line = line == 'timeline' ? '1m' : line; //分时取1m数据
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
    if(window.WebSocket){
        socket = new WebSocket(config.socket_url);
        // websocket收到消息
        socket.onmessage = function(event){
            // 如果服务端是写的二进制数据，则此处的blob也是一个二进制对象，提取数据时需要Blob类和FileReader类配合使用
            var blob = event.data;
            blob = JSON.parse(blob);
            if(self.state.suscribe_success){
              //blob.ts 为发送数据的时间， blob.kline.t 为成交时间
              var kline = blob.data.kline;
              //一条记录： 开盘价（open）,收盘价（close）,最低价（lowest）,最高价（highest)
              if(self.state.last_t && (blob.ts - self.state.last_t * transUnit) < transUnit){
                console.warn(line + '内数据')
                self.setState({isNew: false});
              }else{
                console.warn('非' + line + '内数据')
                self.setState({isNew: true, last_t: kline.t});
              }
              var record = [timestampToTime(kline.t * transUnit), kline.o, kline.c, kline.l, kline.h, Number(kline.q)];
              var { Kdata } = self.state;
              self.setState({ addKdata: record })
              console.warn(record);
            }else{
              if( blob.result.code === 0){
                self.setState({ suscribe_success: true});
              }
            }
        };

        // websocket连接打开
        socket.onopen = this.socketOpen(socket, 'market.' + symbol +'.kline.' + line )

        // websocket连接关闭
        socket.onclose = function (event) {
            console.log("k线图 webSocket 连接关闭");
        };
        window.socket = socket;
    }else{
        alert("你的浏览器不支持websocket");
    }
  }
  dealSocketInit(symbol){
    var dealSocket;
    var self = this;
    if(window.WebSocket){
        dealSocket = new WebSocket(config.socket_url);
        // websocket收到消息
        dealSocket.onmessage = function(event){
            // 如果服务端是写的二进制数据，则此处的blob也是一个二进制对象，提取数据时需要Blob类和FileReader类配合使用
            var blob = event.data;
            blob = JSON.parse(blob);
            if(self.state.deal_suscribe_success){
              debugger
              var data = { id: blob.d, price: blob.p, quantity: blob.q, time: timestampToTime(blob.t),type: blob.m ? 'in' : 'out'}
              var { new_deal_list } = self.state;
              new_deal_list=[data, ...new_deal_list];
              new_deal_list.pop(); //删除数组的最后一个元素，最后一个元素为最久的数据
              console.warn('成交数据：')
              console.warn(data);
              self.setState({ new_deal_list })
            }else{
              if( blob.result.code === 0){
                self.setState({ deal_suscribe_success: true});
              }else{
                Noty('error', blob.result.msg || '成交队列订阅失败')
              }
            }
        };

        // webdealSocket连接打开
        dealSocket.onopen = this.socketOpen(dealSocket, 'market.' + symbol + '.trade.detail');
        // webdealSocket连接关闭
        dealSocket.onclose = function (event) {
            console.log("deal webSocket 连接关闭");
        };
        window.dealSocket = dealSocket;
    }else{
        alert("你的浏览器不支持websocket");
    }
  }
  dailySocketInit(initial){
    var dailySocket;
    var self = this;
    if(window.WebSocket){
        dailySocket = new WebSocket(config.socket_url);
        // websocket收到消息
        dailySocket.onmessage = function(event){
            // 如果服务端是写的二进制数据，则此处的blob也是一个二进制对象，提取数据时需要Blob类和FileReader类配合使用
            var blob = event.data;
            blob = JSON.parse(blob);
            var dailyArr = blob.data.daily;
            if(self.state.daily_suscribe_success ){
              dailyArr = dailyArr.map( m => {
                var data = { name: m.s, price: parseFloat(m.c).toFixed(4), change: m.cg,
                  highest: parseFloat(m.h).toFixed(4),
                  lowest: parseFloat(m.l).toFixed(4),
                  commit: parseFloat(m.a).toFixed(4),
                  changeMoney: (parseFloat(m.c) - parseFloat(m.o)).toFixed(4),
                };
                if(m.cg.indexOf('-') != -1){
                  data.direction = 'down'
                }else{
                  data.direction = 'up';
                }
                return data;
              })
              var currentCoinInfo = dailyArr.filter(m => m.name == self.state.activeCoin);
              var highest = 0, lowest = 0, commit = 0, changeMoney = 0;
              if(currentCoinInfo && currentCoinInfo.length){
                currentCoinInfo = currentCoinInfo[0];
                highest = currentCoinInfo.highest;
                lowest = currentCoinInfo.lowest;
                commit = currentCoinInfo.commit;
                changeMoney = currentCoinInfo.changeMoney;
                self.setState({ highest, lowest, commit, changeMoney});
              }
              console.warn('daily数据：')
              console.warn(dailyArr);
              var { coin_list } = self.props.Trade;
              var new_coin_list = [];
              if(self.state.active_cate_id){
                new_coin_list = coin_list.map( m => {
                  var index = dailyArr.findIndex( n => n.name + 'USDX' == m.symbol);
                  return dailyArr[index];
                })
              }else{
                new_coin_list = dailyArr;
              }
              self.setState({ state_market_list: dailyArr, filter_market_list: new_coin_list })
            }else{
              if( blob.result.code === 0){
                self.setState({ daily_suscribe_success: true});
              }else{
                Noty('error', blob.result.msg || '行情订阅失败');
              }
            }
        };

        // webdailySocket连接打开
        dailySocket.onopen = this.socketOpen(dailySocket, 'market.' +config.CURRENCY + '.kline.daily');
        // webdailySocket连接关闭
        dailySocket.onclose = function (event) {
            console.log("deal webSocket 连接关闭");
        };
        window.dailySocket = dailySocket;
    }else{
        alert("你的浏览器不支持websocket");
    }

  }
  orderSocketInit(symbol){
    var orderSocket;
    var self = this;
    if(window.WebSocket){
        if(window.dailySocket){
          orderSocket = window.dailySocket
        }else{
          orderSocket = new WebSocket(config.socket_url);
        }
        // websocket收到消息
        orderSocket.onmessage = function(event){
            // 如果服务端是写的二进制数据，则此处的blob也是一个二进制对象，提取数据时需要Blob类和FileReader类配合使用
            var blob = event.data;
            blob = JSON.parse(blob);
            if(self.state.order_suscribe_success){
              var { asks, bids } = blob.data;
              //卖盘数据
              asks = asks.map ( m => {
                var item = m ;
                try{
                  item[0] = parseFloat(item[0]).toFixed(4);
                  item[1] = parseFloat(item[1]).toFixed(4);
                }catch(e){
                  console.warn(e);
                }
                return { quantity: item[1], price: item[0]};
              })
              bids = bids.map( m => {
                var item = m ;
                try{
                  item[0] = parseFloat(item[0]).toFixed(4);
                  item[1] = parseFloat(item[1]).toFixed(4);
                }catch(e){
                  console.warn(e);
                }
                return { quantity: item[1], price: item[0]};
              })
              var { new_in_order_list, new_out_order_list } = self.state;
              //第一个数据为最新的数据，第十个数据为最老的数据
              new_out_order_list = asks.slice(0, 10).reverse();
              new_in_order_list = bids.slice(0, 10);
              console.warn('订单数据一条')
              self.setState({ new_in_order_list, new_out_order_list})
            }else{
              if( blob.result.code === 0){
                self.setState({ order_suscribe_success: true});
              }else{
                Noty('error', blob.result.msg || '买卖盘队列订阅失败')
              }
            }
        };

        // weborderSocket连接打开
        orderSocket.onopen = this.socketOpen(orderSocket, 'market.' + symbol + '.depth.step0');
        // weborderSocket连接关闭
        orderSocket.onclose = function (event) {
            console.log("order webSocket 连接关闭");
        };
        window.orderSocket = orderSocket;
    }else{
        alert("你的浏览器不支持websocket");
    }
  }
  trade(params){
    /*var { coin_type, market, sell_price, sell_count, buy_count, buy_price } = this.state;
    var { trade_type } = params;*/
    var account_id = parseInt(sessionStorage.getItem('_udata_accountid'));
    if(account_id){
      return this.props.actions.trade(params)
      .done( () => {
        Noty('success', '下单成功！')
      })
      .fail( ({msg}) => {
        Noty('error', msg || '下单失败！')
      })
    }else{
      Noty('warning', '用户未登录，请登录后购买')
    }
  }
  chooseCoin(coin){
    var trade_pair = config.coin_trade_pair;
    var exchange_available = trade_pair.filter(m => m.name == coin)[0].exchange_available;
    //订阅数据格式改变时改动
    this.setState({ activeCoin: coin, exchange_available, current_line: '1m' })
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
    /*window.socket.close();
    window.dealSocket.close();
    window.orderSocket.close();*/
    this.dataInit(symbol);
    this.socketOpen(mySocket, 'market.' + symbol + '.trade.detail');
    this.socketOpen(mySocket, 'market.' + symbol + '.depth.step0');
    this.socketOpen(mySocket, 'market.' + symbol +'.kline.' + this.state.current_line );
  }
  componentWillUnmount(){
    if(window.socket){
      window.socket.close();
    }
    if(window.dealSocket){
      window.dealSocket.close();
    }
    if(window.orderSocket){
      window.orderSocket.close();
    }
    if(window.dailySocket){
      window.dailySocket.close();
    }
    if(window.myChart){
      window.myChart.clear();
      window.myChart.dispose();
    }
    if(window._get_xdata_timer){
      clearInterval(window._get_xdata_timer);
    }
    window.removeEventListener('beforeunload', this.closeSocket)
  }
  closeSocket(){
    window.socket.close();
  }
  handleEnter(cate){
    this.setState({active_cate: cate, active_child_cate: []});
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
    this.setState({active_child_cate: cate});
  }
  /*handlePannelEnter(){
    this.setState({active_cate: })
  }*/
  getCoinList(attr){
    this.setState({ active_cate_id: attr})
    var cate_list = clone(this.props.Trade.origin_coin_cate_list);
    var cateFiltered = cate_list.filter( m => m.id == attr);
    if(cateFiltered.length){
      var cate = cateFiltered[0];
      var level = cate.level;
      var titleStr = cate.descrpt_ch;
      var parent_id = cate.parent;
      while(parent_id){
        cate = cate_list.filter( m => m.id == parent_id )[0];
        parent_id = cate.parent;
        titleStr = cate.descrpt_ch + ' | ' + titleStr;
      }
      this.setState({ coin_quene_title: titleStr});
    }
    this.props.actions.getCoinList({attr, top: 10})
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
  clearCate(){
    this.setState({ active_cate_id : 0, active_cate: {}, coin_quene_title: '热门虚拟币'})
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
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Trade);