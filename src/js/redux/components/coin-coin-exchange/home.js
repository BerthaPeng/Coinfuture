import React, {Component} from 'react';
import Websocket from 'react-websocket';
import {Link} from 'react-router';
import { Button, Dropdown, Icon, Popup, Grid, Tab, Table, Input, Divider, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ExchangeActions from 'actions/coin-coin-exchange.js';
import { timestampToTime } from 'utils/utils';

import Charts from '../chart.js';

import intl from 'react-intl-universal';
import { coinExchange } from 'locales/index';
const { Column } = Grid;
const coin_list_usdt = [
  {id: 1, name: 'BTC' },
  {id: 2, name: 'ETH' },
  {id: 3, name: 'LTC' },
]

const coin_list_btc = [
  {id: 2, name: 'ETH'},
  {id: 3, name: 'LTC'}
]

const TabPane = (props) => {
  var { changeCoin } = props.actions;
  var list = [];
  if(props.market == 'USDT'){
    list = coin_list_usdt;
  }else if(props.market == 'BTC'){
    list = coin_list_btc;
  }
  return () => <Tab.Pane attached={false}>
    <Table className="market-table">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{intl.get('coin')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('lastprice')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('change')}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          list.map( coin => {
            return (<Table.Row key={coin.id} onClick={changeCoin(props.market, coin.name)}>
              <Table.Cell style={{fontSize: '14px'}}>{coin.name}</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>)
          })
        }
      </Table.Body>
    </Table>
  </Tab.Pane>
}




const TradePanel = (props) => {
  var { market, coin_type, login, buy_submit_ing, sell_submit_ing ,
    sell_price,
    sell_count,
    buy_price,
    buy_count,
    submit_msg,
    submit_status,
    panel_type,
    actions } = props;
  var { changeMarket, handlePanelInputChange, trade } = actions;
  return (type) => <Tab.Pane attached={false}>
  {!login && <div className="login-bar">
    <Link to="/login" > {intl.get('login')} </Link>{intl.get('or')}
    <Link to="/register"> {intl.get('signup') }</Link>
    { intl.get('start_trade')}
  </div>}
  <Grid>
    <Column width={8}>
      <p className="txt">{intl.get('buyprice')}：</p>
      {
        panel_type == 'limit' ?
        <Input
          label={{ basic: true, content: market }}
          labelPosition='right'
          autoComplete="off"
          name="buy_price"
          value={ buy_price }
          onChange={handlePanelInputChange}
          />
        :
        <Input
          label={{ basic: true, content: market }}
          labelPosition='right'
          autoComplete="off"
          disabled
          value={intl.get('buy_market_placeholder')}
          />
      }
      <p className="txt">{intl.get('buyamount')}：</p>
      <Input
        label={{ basic: true, content: coin_type }}
        labelPosition='right'
        name="buy_count"
        value={ buy_count }
        onChange={handlePanelInputChange}
        />
      <p className="txt">{intl.get('total')}：0.00000000<span>{market}</span></p>
      <Button disabled={!login} className="trade-btn" loading={buy_submit_ing } disabled={buy_submit_ing}
        onClick={trade( { trade_type: 'buy_' + panel_type })}>{intl.get('buy') + ' '+ coin_type}</Button>
          </Column>
    <Column width={8}>
      <p className="txt">{intl.get('sellprice')}：</p>
      {
        panel_type == 'limit' ?
        <Input
          label={{ basic: true, content: market }}
          labelPosition='right'
          autoComplete="off"
          name="sell_price"
          value={ sell_price }
          onChange={ handlePanelInputChange }
        />
        :
        <Input
          label={{ basic: true, content: coin_type }}
          labelPosition='right'
          disabled
          value={intl.get('sell_market_placeholder')}
          />
      }
      <p className="txt">{intl.get('sellamount')}：</p>
      <Input
        label={{ basic: true, content: coin_type }}
        labelPosition='right'
        autoComplete="off"
        name="sell_count"
        value={ sell_count }
        onChange={ handlePanelInputChange }
        />
      <p className="txt">{intl.get('total')}：0.00000000<span>{market}</span></p>
      <Button disabled={!login} className="trade-btn" loading={sell_submit_ing} disabled={sell_submit_ing}
        onClick={trade( { trade_type: 'sell_' + panel_type})}>{intl.get('sell') +' ' + coin_type}</Button>
    </Column>
  </Grid>
  {
    submit_msg != '' ?
    <Message icon size="mini" style={{padding: '0.5em 1.5em'}}
    error={ submit_status == 'error'}
    success={ submit_status == 'success'}
    >
      <Icon name='warning circle' />
        <p>{submit_msg}</p>
    </Message>
    :null
  }
  </Tab.Pane>
}

class ExchangeHome extends Component{
  constructor(props){
    super(props);
    this.state = {
      market: 'USDT',
      coin_type: 'BTC',
      login: false,
      sell_price: '',
      sell_count: '',
      buy_count: '',
      buy_price: '',
      submit_msg: '',
      suscribe_success: false,

      market_trade_list: [],
    }
    this.changeMarket = this.changeMarket.bind(this);
    this.handlePanelInputChange = this.handlePanelInputChange.bind(this);
    this.trade = this.trade.bind(this);
    this.changeCoin = this.changeCoin.bind(this);
  }
  handlePanelInputChange = (e, { name, value }) => {
    if(/^[0-9]+.?[0-9]*$/.test(value) || value == '')
      this.setState({ [name]: value })
  }
  render(){
    const coin_quene= [
      {id: 1, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 2, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 3, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 4, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 5, time: '14:20:09', type: 'out', price: 0.00001566, count: 12},
      {id: 6, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 7, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 8, time: '14:20:09', type: 'out', price: 0.00001566, count: 12},
      {id: 9, time: '14:20:09', type: 'out', price: 0.00001566, count: 12},
      {id: 10, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 11, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 12, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 13, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
      {id: 14, time: '14:20:09', type: 'in', price: 0.00001566, count: 12},
    ]
    var { market, coin_type, login, sell_price, sell_count, buy_count, buy_price, submit_msg,
      market_trade_list } = this.state;
    var { buy_submit_ing, sell_submit_ing, submit_status } = this.props.Exchange;
    var { changeMarket, handlePanelInputChange, trade, changeCoin } = this;
    var props = { market, coin_type, login, buy_submit_ing, sell_submit_ing,
      sell_count, sell_price, buy_count, buy_price, submit_msg, submit_status,
      actions: { changeMarket, handlePanelInputChange, trade }};
    var marketPaneProps = { actions: { changeCoin } }
    const panes = [
      { menuItem: 'USDT', render: TabPane({ market: 'USDT', ...marketPaneProps }) },
      { menuItem: 'BTC', render: TabPane({ market: 'BTC', ...marketPaneProps }) },
      { menuItem: 'ETH', render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> },
    ]
    const panes2= [
      { menuItem: intl.get('limitorder'), render: TradePanel( { ...props, panel_type: 'limit'} ) },
      { menuItem: intl.get('marketorder'), render: TradePanel( { ...props, panel_type: 'market'} ) }
    ]
    return (
      <div className="exchange-wrapper">
        {/*<Charts />*/}
        <Grid padded>
          <Column width={4} className="market no-padding">
            <div className="column-inner">
              {!login && <div className="login-bar">
                <Link to="/login" >{ intl.get('login')}</Link>{intl.get('or')}
                <Link to="/register">{ intl.get('signup')}</Link>
                { intl.get('start_trade')}
              </div> }
              <div><span style={{fontSize: '16px'}}>{intl.get('markets')}</span></div>
              <div style={{marginTop: '10px'}}>
                <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
              </div>
            </div>

          </Column>
          <Column width={8} className="trade-panel no-padding">
            <div className="column-inner">
              <Tab menu={{ secondary: true, pointing: true }} panes={panes2} />
            </div>
          </Column>
          <Column width={4} className="market no-padding">
            <div className="column-inner">
              <div className="head"><span style={{fontSize: '16px'}}>{intl.get('market_trades')}</span></div>
              <div>
                <Table className="market-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>{intl.get('date')}</Table.HeaderCell>
                      <Table.HeaderCell>{intl.get('type')}</Table.HeaderCell>
                      <Table.HeaderCell>{intl.get('price')}</Table.HeaderCell>
                      <Table.HeaderCell>{intl.get('amount')}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      market_trade_list.map( coin => {
                        return (<Table.Row key={coin.id}>
                          <Table.Cell>{coin.time}</Table.Cell>
                          <Table.Cell className={ coin.type == 'in' ? 'color-up' : 'color-down'}>{coin.type == 'in' ? intl.get('buy') : intl.get('sell')}</Table.Cell>
                          <Table.Cell>{coin.price}</Table.Cell>
                          <Table.Cell>{coin.count}</Table.Cell>
                        </Table.Row>)
                      })
                    }
                  </Table.Body>
                </Table>
              </div>
            </div>
          </Column>
        </Grid>
      </div>
      )
  }
  changeMarket(e){
    var market = e.target.innerText;
    this.setState({ market})
  }
  componentDidMount(){
    if(sessionStorage.getItem('_udata')){
      this.setState({login: true})
    }else{
      this.setState({ login: false })
    }
    this.loadLocales(this.props.Lang.lang);
    this.socketInit();
  }
  socketInit(){
    var socket;
    var self = this;
    if(window.WebSocket){
        socket = new WebSocket("ws://47.106.71.87:8020/");
        // websocket收到消息
        socket.onmessage = function(event){
            // 如果服务端是写的二进制数据，则此处的blob也是一个二进制对象，提取数据时需要Blob类和FileReader类配合使用
            var blob = event.data;
            blob = JSON.parse(blob);
            if(self.state.suscribe_success){
              var data = { id: blob.d, price: blob.p, count: blob.q, time: timestampToTime(blob.t),type: blob.m ? 'in' : 'out'}
              var { market_trade_list } = self.state;
              market_trade_list.push(data);
              if(market_trade_list.length > 80){
                market_trade_list = market_trade_list.slice(-80);
              }
              self.setState({ market_trade_list: market_trade_list })
            }else{
              if( blob.result.code === 0){
                self.setState({ suscribe_success: true});
              }
            }
        };

        // websocket连接打开
        socket.onopen = function (event) {
          console.log("websocket 连接打开");
          var data ={"header":{"token":"6bd0edbd0f34f232951df57f57f080df39563f24a7a4369bebc48996577270e2"},"data":{"payload_type":"api","description":{"type":"auth","id":"sys_notification_subscribe","params":{"channel":"market.BTCUSDT.trade.detail"}}}};
          data = JSON.stringify(data);
          socket.send(data);
        };

        // websocket连接关闭
        socket.onclose = function (event) {
            console.log("websocket 连接关闭");
        };
    }else{
        alert("你的浏览器不支持websocket");
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      /*intl.determineLocale({ currentLocale: nextProps.Lang.lang });*/
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang,
      locales: coinExchange
    })
  }
  trade(params){
    var { coin_type, market, sell_price, sell_count, buy_count, buy_price } = this.state;
    var { trade_type } = params;
    return () => {
      this.props.actions.trade({ coin_type,
        market,
        sell_count,
        sell_price,
        trade_type,
        buy_price,
        buy_count
      })
      .done( () => {
        this.setState( { submit_msg: '下单成功！'})
      })
      .fail( ({msg}) => {
        this.setState( { submit_msg: msg || ''})
      })
    }
  }
  changeCoin(market, coin_type){
    return () => {
      this.setState({ market, coin_type});
    }
  }
  handleData(data){
    debugger
    console.warn(data);
  }
}


function mapStateToProps(state){
  return state.ExchangeData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...ExchangeActions,
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeHome);

