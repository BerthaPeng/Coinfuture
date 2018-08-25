import React, {Component} from 'react';
import { Tab, Grid, Input, Button, Message, Icon, Menu, Dropdown } from 'semantic-ui-react';
import {Link} from 'react-router';
import TipSelector from './tip-selector.js';
const { Column } = Grid;
import { Noty } from 'utils/utils';
import intl from 'react-intl-universal';
import { trade } from 'locales/index.js';

class TradePanel extends Component{
  constructor(props){
    super(props);
    this.state = {
      pay_coin: '',
      sell_price: '',
      sell_count: '',
      sell_amount: '',
      buy_count: '',
      buy_amount: '',
      buy_price: '',
    }
  }
  handlePanelInputChange = (e, { name, value }) => {
    if(/^[0-9]+.?[0-9]*$/.test(value) || value == ''){
      var { current_price, buy_price } = this.state;
      var { panel_type } = this.props;
      //控制输入金额保留8位小数，数量4位小数
      var valueStrArr = value.split('.');
      if(name === 'buy_amount' || name === 'buy_price' || name === 'sell_price'){
        if(valueStrArr.length < 2 ||valueStrArr.length == 2 && valueStrArr[1].length <= 2){
          this.setState({ [name] :value});
        }
      }else if(name === 'buy_count' || name === 'sell_count'){
        if(valueStrArr.length < 2 || valueStrArr.length == 2 && valueStrArr[1].length <= 4){
          this.setState({ [name] :value});
        }
      }else{
        this.setState({ [name] : value});
      }
      if(name === 'buy_amount'){
        var buy_count = panel_type == 'limit' ? value / buy_price || 0 : value / current_price || 0;
        this.setState({ buy_count: buy_count.toFixed(4)})
      }else if(name == 'buy_count'){
        var buy_amount = panel_type == 'limit' ? (value * buy_price) : (current_price * buy_price);
        this.setState({ buy_amount : buy_amount.toFixed(2)});
      }
    }
  }
  render(){
    var { coin, exchange_available, market, coin_type, login, buy_submit_ing, sell_submit_ing ,
      submit_msg,
      submit_status,
      actions, current_price } = this.props.props;
    var { buy_price, buy_count, sell_count, sell_price, buy_amount } = this.state;
    var { panel_type } = this.props;
    actions = {}
    var { changeMarket, trade } = actions;
    var { pay_coin } = this.state;
    market = "USDX"
    coin_type = "USDX"
    return(
      <Tab.Pane attached={false} className="fl-trade-panel">
         <Grid>
           <Column width={8} style={{borderRight: '1px solid #eee'}}>
             <div className="wrapper">
             <div className="trade-panel-header">
               <p>{intl.get('tradebuy')}　{coin}</p>
             </div>
              <TipSelector value={pay_coin} placeholder={intl.get('paycoin')} />
             {/*<Dropdown value={pay_coin} placeholder="选择支付币种" fluid selection options={exchange_available.map( m =>({text: m, value: m}))}/>*/}
             {/*<TipSelector options={exchange_available} value={pay_coin} placeholder="选择支付币种" onChange={this.onTradeCoinTypeChange.bind(this)} />*/}
             <p style={{width: '100%', fontSize: '10px', marginTop: '10px'}}>
              <span style={{display: 'inline-block', float: 'left'}}>usdx{intl.get('availableAmount')}</span>
              <span style={{display: 'inline-block', float: 'right', color: '#2e6e92'}}>{intl.get('gocharge')}</span>
             </p>
             {
               panel_type == 'limit' ?
               [<Input
                 label={{ basic: true, content: pay_coin }}
                 labelPosition='right'
                 autoComplete="off"
                 name="buy_price"
                 value={ buy_price }
                 onChange={this.handlePanelInputChange}
                 style={{marginTop: '10px', width: '100%'}}
                 placeholder={intl.get('tradebuyprice')}
                 key="buy_price_input"
                 />,
                 <Input
                   label={{ basic: true, content: pay_coin }}
                   labelPosition='right'
                   name="buy_amount"
                   value={ buy_amount }
                   onChange={this.handlePanelInputChange}
                   style={{marginTop: '10px', width: '100%'}}
                   placeholder={intl.get('tradebuyamount')}
                   key="buy_amount_input"
                   />]
               :
               <Input
                 label={{ basic: true, content: pay_coin }}
                 labelPosition='right'
                 autoComplete="off"
                 disabled
                 placeholder={intl.get('marketbuypriceplaceholder')}
                 style={{marginTop: '10px', width: '100%'}}
                 />
             }
            <Input
              label={{ basic: true, content: coin }}
              labelPosition='right'
              name="buy_count"
              value={ buy_count }
              onChange={this.handlePanelInputChange}
              style={{marginTop: '10px', width: '100%'}}
              placeholder={intl.get('tradebuysum')}
              />
             {/*<p style={{width: '100%'}} className="light-grey-color">
              <span style={{display: 'inline-block', float: 'left'}}>实际买入量</span>
              <span style={{display: 'inline-block', float: 'right'}}>
                { }{coin}</span>
             </p>*/}
             <Button style={{width: '100%', marginTop: '10px'}}
              disabled={!login}
              className="trade-btn btn-buy"
              loading={buy_submit_ing } disabled={buy_submit_ing}
              onClick={this.onTrade.bind(this, {trade_type: 'buy_' + panel_type })}>{intl.get('tradebuy').toUpperCase()}</Button>
             </div>

           </Column>
           <Column width={8}>
            <div className="wrapper">
              <div className="trade-panel-header">
                <p>{intl.get('tradesell')}　{coin}</p>
              </div>
              <p style={{textAlign: 'left', width: '100%', marginBottom: '10px', fontSize: '10px'}}>BTC{intl.get('availableSum')}：0.0098</p>
              {
                panel_type == 'limit' ?
                <Input
                  label={{ basic: true, content: market }}
                  labelPosition='right'
                  autoComplete="off"
                  name="sell_price"
                  value={ sell_price }
                  onChange={ this.handlePanelInputChange }
                  placeholder={intl.get('tradesellprice')}
                  style={{width: '100%'}}
                />
                :
                <Input
                  label={{ basic: true, content: coin_type }}
                  labelPosition='right'
                  disabled
                  placeholder={intl.get('marketsellpriceplaceholder')}
                  />
              }
              <Input
                label={{ basic: true, content: coin }}
                labelPosition='right'
                autoComplete="off"
                name="sell_count"
                value={ sell_count }
                onChange={ this.handlePanelInputChange }
                placeholder={intl.get('tradesellsum')}
                style={{width: '100%', marginBottom: '10px', marginTop: '10px'}}
                />
              <TipSelector className="select-coin"  value={pay_coin} placeholder={intl.get('targetcoin')} onChange={this.onTradeCoinTypeChange.bind(this)} />
              { panel_type == 'limit' && <p style={{width: '100%', margin: '15px 0px 10px 0', fontSize: '10px'}}>
                <span style={{display: 'inline-block', float: 'left'}}>{intl.get('actualincome')}</span>
                <span style={{display: 'inline-block', float: 'right'}}>{ sell_count * sell_price || 0}{pay_coin}</span>
             </p>}
              <Button disabled={!login}
                className="trade-btn btn-sell" loading={sell_submit_ing} disabled={sell_submit_ing} style={{width: '100%', marginTop: '10px'}}
                onClick = {this.onTrade.bind(this, {trade_type: 'sell_' + panel_type })}>{intl.get('tradesell').toUpperCase()}</Button>
            </div>
           </Column>
         </Grid>
         </Tab.Pane>
      )
  }
  onTradeCoinTypeChange(value){
    this.setState({ pay_coin : value })
  }
  onTrade(params){
    var { buy_price, buy_amount, sell_price, sell_count, pay_coin, buy_count } = this.state;
    var { trade_type } = params;
    var { coin } = this.props.props;
    var account_id = parseInt(sessionStorage.getItem('_udata_accountid'));
    if(account_id){
      this.props.props.actions.trade({buy_price, buy_count :buy_count.toString(),
          sell_price, sell_count,
          trade_type, market: pay_coin, coin_type: coin})
      .done( () => {
        this.setState({
          sell_price: '',
          sell_count: '',
          sell_amount: '',
          buy_count: '',
          buy_amount: '',
          buy_price: '',
         })
      })
    }else{
      Noty('warning', '用户未登录，请登录后购买')
    }
  }
  componentDidMount(){
    this.setState({ pay_coin: this.props.props.exchange_available[0]})
  }
}


export default class TradePanelWrapper extends Component{
  render(){
    var { props } = this;
    const PanelInner= [
      /*{ menuItem: '限价交易', render: TradePanel( { ...props, panel_type: 'limit'} ) },
      { menuItem: '市价交易', render: TradePanel( { ...props, panel_type: 'market'} ) }*/
      { menuItem: intl.get('limitorder'), render: () => <TradePanel props={props } panel_type = 'limit' />  },
      { menuItem: intl.get('marketorder'), render: () => <TradePanel props={props} panel_type ='market'/> }

    ]

    return (
      <Tab menu={{ secondary: true, pointing: true }} panes={ PanelInner } />
      )
  }
  componentDidMount(){
    this.loadLocales(this.props.lang);
  }
  componentWillReceiveProps(nextProps){
    //切换语言
    if(this.props.lang != nextProps.lang){
      this.loadLocales(nextProps.lang);
    }
  }
  //初始化语言脚本
  loadLocales(lang){
    intl.init({
      currentLocale: lang || 'en-US',
      locales: trade
    })
    .then( () => {
      this.setState({ initDone: true })
    })
  }
}