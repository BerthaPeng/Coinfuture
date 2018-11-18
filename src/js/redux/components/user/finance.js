import React, { Component } from 'react';
import { Button, Dropdown, Icon, Table, Menu, Radio, Input, Label, Popup, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as FinanceActions from 'actions/user-finance.js';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router';

import intl from 'react-intl-universal';
import { finance } from 'locales/index';
import UserMenu from '../common/user-menu.js';
import BalancesTable from '../common/balances-table.js';
import LazyLoad from 'utils/lazy_load';
import Toast from '../common/Toast.js';
import PaypalExpressBtn from './PayPalExpressCheckOut';
import { post } from 'utils/request'; //Promise

class Finance extends Component{
  constructor(props){
    super(props);
    this.state = {
      activeMenu: 'pocket',
      current_usd: 0,
      isOpen: false,
      paymentId: '',
      order_id: '',
      currency: 'USD',
      balance: '',
      sumbit_ing: false,
      showPalpal: false,
    }
  }
  render(){
    var { activeMenu, current_usd, isOpen } = this.state;
    var { user_coin_list } = this.props.Finance;
    const client = {
        sandbox:    'ARDSf5WjYMJbH1mx9afk93Oum38izGFEa6M3BW3i-ZGl6jkIpa0aEt3QzsgHvp06yWyTxhn9tQnXi0eH',
        production: 'AZwao_cR8PomVrffQ5XHSCdO9A1R0us6AQB5mjuLbXe4nJm_n1_8kQK4HLF-nj0X3dQ5g5BR5YvqREFs',
    }
    return (
      <div className="fl-block gray-bg">
        <div className="flex-wrapper">
          <div className="item-20-100">
            <div className="item-inner" style={{minHeight: '100%'}}>
              <UserMenu lang={this.props.Lang.lang} active="pocket" />
            </div>
          </div>
          <div className="item-80-100" style={{marginLeft: '15px'}}>
            <div className="item-inner" style={{minHeight: '100%'}}>
              <div className="finance-header">
                <div><span style={{fontSize: '16px'}}>{intl.get('balances')}</span></div>
                <div style={{marginLeft: '20px', fontSize: '14px'}}>
                  <span>{intl.get('hidesmallbalances')}　　</span>
                  <Radio toggle style={{marginLeft: '10px', verticalAlign: 'middle'}}/>
                </div>
                <Link to="/user/withdraw-address"><div className="primary-color withdraw-address-btn">{intl.get('withdrawaddress')}</div></Link>
              </div>
              <div style={{padding: '10px 40px'}}>
                <p><Icon name="circle" /><span>USDX </span><span>{intl.get('available')}：{current_usd}  ，{intl.get('onorders')}：0，{intl.get("estimatedvalue")}：{parseFloat(current_usd) * 6.5}CNY</span></p>
                <div style={{padding: '10px 40px'}}>
                  <Popup trigger={<Button size="mini"
                      onClick={this.callDeposit.bind(this)}
                      primary
                    >{intl.get('deposit')}</Button>}
                  on="click" position="right center"
                  open={isOpen}
                  style={{ width: '200px'}}
                  >
                    <div>
                      <Input
                        label={{ basic: true, content: this.state.currency }}
                        labelPosition='right'
                        disabled={this.state.sumbit_ing || this.state.showPalpal}
                        placeholder='充值金额'
                        value={this.state.balance}
                        onChange={ (e) => {this.setState({balance: e.target.value})}}
                        style={{marginBottom: '15px', width: '100%'}}
                      />
                      <div>
                        <Button loading={this.state.sumbit_ing}
                          primary
                          onClick={this.createPayment.bind(this)}
                          style={{width: '100%', marginBottom: '15px'}}
                          disabled={this.state.showPalpal}>充值</Button>
                      </div>
                      {
                        this.state.showPalpal ?
                        [<p>已为您生成订单，请点击以下按钮使用paypal支付</p>,
                        <PaypalExpressBtn client={client} currency={this.state.currency}
                          total={this.state.balance} env="sandbox"
                          onSuccess={this.onPaypalSuccess.bind(this)}
                          paymentId={this.state.paymentId}/>]
                        :
                        null
                      }
                    </div>
                  </Popup>
                  <Button style={{marginLeft: '10px'}} size="mini">{intl.get("withdraw")}</Button></div>
                </div>
                <div className="finance-body" style={{marginTop: '20px'}}>
                <BalancesTable lang = {this.props.Lang.lang} list = {user_coin_list} getDepositAddress={this.getDepositAddress.bind(this)} />
                {/*<Table basic="very" textAlign="center" className="no-border-table gray-header-table" style={{margin: '0px'}} textAlign="left">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell verticalAlign="top">{intl.get('coin')}</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">{intl.get('available')}</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">{intl.get('onorders')}</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">{intl.get('action')}</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      user_coin_list.map( m => {
                        return (<Table.Row key={m.coin_id + '-tmp-record'}>
                      <Table.Cell>{ this.props.Lang.lang == 'en-US' ? m.coin_name_english : m.coin_name_chinese}</Table.Cell>
                      <Table.Cell>
                        {m.balance || '0.00000000'}
                      </Table.Cell>
                      <Table.Cell></Table.Cell>
                      <Table.Cell><Button size="small">{intl.get('deposit')}</Button><Button size="small">{intl.get('withdraw')}</Button></Table.Cell>
                    </Table.Row>)
                      })
                    }
                  </Table.Body>
                </Table>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
      )
  }
  componentDidMount(){
    /*this.paypalExecute();*/
    this.props.actions.getUserCoinList({})
      .done( data => {
        var usd = data.filter( m => m.symbol.trim() == 'USDX');
        if(usd && usd.length){
          this.setState({ current_usd: usd[0].balance})
        }
      })
    this.loadLocales(this.props.Lang.lang);
  }
  callDeposit(){
    this.setState({ isOpen: !this.state.isOpen, sumbit_ing: false, showPalpal: false })
  }
  createPayment(){
    var { balance, currency } = this.state;
    if(Number(balance) < 0.01){
      Toast.warning(intl.get('MSG_depositwarning'));
      return;
    }
    this.setState({ sumbit_ing: true, showPalpal: false})
    post(401001, { balance, currency })
      .done( data => {
        this.setState({ paymentId: data.payment_id, order_id: data.order_id, sumbit_ing: false, showPalpal: true})
      })
      .fail( ({ msg }) => {
        Toast.error( msg || intl.get('MSG_creatOrderfail'))
      })
  }
  onPaypalSuccess(payment){
    var { paymentID, payerID } = payment;
    var { balance, currency, order_id } = this.state;
    balance = Number(balance).toFixed(2).toString();
    post( 401002, {
      payment_id: paymentID,
      payer_id: payerID,
      order_id,
      balance,
      currency
    }).done(() =>{
      this.setState({ isOpen: false, showPalpal: false, balance: ''})
      Toast.success(intl.get('MSG_paysuccess'))
    }).fail( ({msg}) => {
      Toast.error( msg || intl.get('MSG_payfail'))
    })
  }
  onPaypalCancel(data){
    debugger
  }
  onError(err){
    debugger
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang,
      locales: finance,
    })
  }
  getDepositAddress(coin_id){
    return this.props.actions.getDepositAddress({ coin_id })
      .fail(({msg}) => {
        Toast.error( msg || intl.get('MSG_getDepositAddress'))
      })
  }
  paypalExecute(){
    paypal.Button.render({
        locale: 'zh_CN', // or en_US
        env: 'sandbox', // or sandbox

        commit: false, // Show a 'Pay Now' button
        client: {
            sandbox:    'ARDSf5WjYMJbH1mx9afk93Oum38izGFEa6M3BW3i-ZGl6jkIpa0aEt3QzsgHvp06yWyTxhn9tQnXi0eH',
            production: ''
        },
        style: {
            size: 'small',
            color: 'silver',
            shape: 'pill',
            label: 'checkout',
            tagline: false
        },

        payment: function(data, actions) {
          console.warn(1);
          console.warn(data);
          return 'PAY-0PG57868R6267503DLPKXGRA'
            /*return actions.payment.create({
                payment: {
                    transactions: [
                        {
                            amount: { total: '1', currency: 'USD' }
                        }
                    ]
                }
            });*/
        },

        onAuthorize: function(data, actions) {
          console.warn(2)
            console.warn(data);
            /*return actions.payment.execute().then(function(payment) {
                $.ajax({
                  type: 'POST',
                  url: '/',
                  data: {}
                }).done(function (data) {
                    if (data == '0') {
                        alert('The payment is complete!');
                        window.location.reload();
                    }else {
                        alert('pay fail')
                    }
                })
            });*/
        },

        onCancel: function(data, actions) {
            /*
             * Buyer cancelled the payment
             */
        },

        onError: function(err) {
            /*
            * An error occurred during the transaction
            */
        }
    }, '#paypal-button');
  }
}

function mapStateToProps(state){
  return state.FinanceData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...FinanceActions,
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Finance);