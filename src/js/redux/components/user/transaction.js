import React, { Component } from 'react';
import { Button, Dropdown, Icon, Table, Tab, Radio } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as TransacActions from 'actions/user/transaction.js';
import { bindActionCreators } from 'redux';
import { dateFormat } from 'utils/utils';
import config from 'config/app.config';

import intl from 'react-intl-universal';
import { orders } from 'locales/index.js';
import UserMenu from '../common/user-menu.js';
import { Noty } from 'utils/utils';
import LazyLoad from 'utils/lazy_load';

const TransacDetailPane = (props) => {
  var { transac_detail_list, loading } = props;
  return  <Tab.Pane attached={false} loading={loading}>
    <Table basic="very" className="no-border-table gray-header-table main-table">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{intl.get('orderid')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('dealtime')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('pairs')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('type2')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('price')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('amount')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('total')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('fee')}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          transac_detail_list.map( (m, index) => {
            return (<Table.Row key={m.order_id + '-' + index}>
              <Table.Cell>{m.order_id}</Table.Cell>
              <Table.Cell>{m.match_datetime}</Table.Cell>
              <Table.Cell>
                <span className="primary-color">{m.trade_pair.replace('USDX', '/USDX')}</span>
              </Table.Cell>
              <Table.Cell>
                <span className={`${ m.buy_or_sell ? 'color-up' : 'color-down'}`}>{ m.buy_or_sell ? '买入': '卖出'}</span>
              </Table.Cell>
              <Table.Cell>{ Number(m.fullfilled_price).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.fullfilled_quantity).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.amount).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.fee).toFixed(8) }</Table.Cell>
            </Table.Row>)
          })
        }
      </Table.Body>
    </Table>
  </Tab.Pane>
}

class TransacPane extends Component{
  constructor(props){
    super(props);
    this.state ={
    }
  }
  render(){
    var { transac_list, loading, order_type, lang } = this.props;
    /*const  withdraw = (event) => {
      console.warn(event);
      withdraw();
    };*/
    return <Tab.Pane attached={false} loading={loading}>
      <Table basic="very" className="no-border-table gray-header-table main-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{intl.get('orderid')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('ordertime')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('type')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('pairs')}</Table.HeaderCell>
            {/*<Table.HeaderCell>方向</Table.HeaderCell>*/}
            <Table.HeaderCell>{intl.get('price')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('amount')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('total')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('executed')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('unexecuted')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('status')}</Table.HeaderCell>
            <Table.HeaderCell>{intl.get('action')}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            transac_list.map( m => {
              return (<Table.Row key={m.id}>
                <Table.Cell>{m.id}</Table.Cell>
                <Table.Cell>{m.created_datetime}</Table.Cell>
                <Table.Cell>
                  <span className={`${ m.order_type === 1 || m.order_type === 2 ? 'color-up' : 'color-down'}`}>
                  { lang == 'en-US' ? config.ORDER_TYPE_EN['type_' +m.order_type] : config.ORDER_TYPE_CN['type_' +m.order_type]}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="primary-color">{m.trade_pair.replace('USDX', '/USDX')}</span></Table.Cell>
                <Table.Cell>{ (m.order_type == 1 || m.order_type == 3) ? '市价' : Number(m.limit_price).toFixed(8)}</Table.Cell>
                <Table.Cell>{ Number(m.quantity).toFixed(8)}</Table.Cell>
                <Table.Cell>{ Number(m.amount).toFixed(8)}</Table.Cell>
                <Table.Cell>{ Number(m.executed_quantity).toFixed(8)}</Table.Cell>
                <Table.Cell>{ Number(m.not_executed_quantity).toFixed(8)}</Table.Cell>
                <Table.Cell>{ lang == 'en-US' ? m.order_status : config.ORDER_STATUS['status_' + m.order_status_id ] }</Table.Cell>
                <Table.Cell>
                  {
                    order_type == 1 ?
                    <span className="primary-color action-btn" onClick={this.withdraw.bind(this, m.trade_pair, m.id)}>
                      {intl.get('cancel')}
                    </span>
                    :
                    [<span className="primary-color action-btn">{intl.get('detail')}</span>,
                    <Icon name="angle down" className="primary-color" />]

                  }
                </Table.Cell>
              </Table.Row>)
            })
          }
        </Table.Body>
      </Table>
    </Tab.Pane>
  }
  withdraw(symbol, order_id){
    this.props.withdraw(symbol, order_id)
  }
}


class Transaction extends Component{
  constructor(props){
    super(props);
    this.state ={
      activeMenu: 'order-record',
      order_cate: 1,
      loading: false,
      order_type: 1,
    }
    this.withdraw = this.withdraw.bind(this);
  }
  render(){
    var { activeMenu, loading, order_cate, order_type } = this.state;
    var { transac_list, transac_detail_list } = this.props.Transaction;
    transac_list = transac_list.map( m => { m.created_datetime = dateFormat( new Date(m.created_datetime), 'yyyy-MM-dd hh:mm:ss'); return m;})
    transac_detail_list = transac_detail_list.map( m => { m.match_datetime = dateFormat( new Date(m.match_datetime), 'yyyy-MM-dd hh:mm:ss'); return m;})
    const order_filter_options = [
      { text: intl.get('openorders'), value: 1},
      { text: intl.get('orderhistory'), value: 2},
      { text: intl.get('transactionhistory'), value: 'detail'},
    ]
    var { withdraw } = this;
    var { lang } = this.props.Lang;
    return (
      <div className="fl-block gray-bg">
        <div className="flex-wrapper">
          <div className="item-20-100">
            <div className="item-inner" style={{minHeight: '100%'}}>
              <UserMenu />
            </div>
          </div>
          <div className="item-80-100" style={{marginLeft: '15px'}}>
            <div className="item-inner" style={{minHeight: '100%'}}>
              <div className="finance-header" style={{position: 'relative'}}>
                <div>
                  <h3>{intl.get('orders')}</h3>
                </div>
                <div style={{position: 'absolute', right: '20px', color: '#00b38c'}}>
                  <Dropdown inline options={order_filter_options} value={order_type} onChange={this.handleTabChange.bind(this)} />
                </div>
              </div>
              <div className="finance-body" style={{marginTop: '20px'}}>
                {
                  order_cate == 'detail' ?
                  <TransacDetailPane {...{transac_detail_list, loading, lang}} />
                  :
                  <TransacPane {...{transac_list, loading, withdraw, order_type, lang}} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
            )
  }
  componentDidMount(){
    LazyLoad('noty')
    this.getTransacList(1)
    this.loadLocales(this.props.Lang.lang);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      /*intl.determineLocale({ currentLocale: nextProps.Lang.lang });*/
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  handleTabChange=(e, data) => {
    this.setState({ order_cate : data.value });
    if(data.value == 'detail'){
      this.getTransacDetailList();
    }else{
      this.setState({ order_type: data.value});
      this.getTransacList(data.value);
    }
  }
  //"type": 查询类型 0 所有状态 1 当前委托 2 委托历史 3 成交明细
  getTransacList(type){
    this.setState({ loading: true})
    this.props.actions.getTransacList({ type })
      .done( () => {
        this.setState({ loading: false});
      })
      .fail( msg => {
        this.setState({ loading: false})
      })
  }
  getTransacDetailList(){
    this.props.actions.getTransacDetailList({})
      .done(() => {
        this.setState({ loading: false})
      })
      .fail( msg => {
        this.setState({ loading:false})
      })
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang,
      locales: orders
    })
  }
  withdraw(symbol, order_id){
    this.props.actions.withdraw({ symbol, order_id})
      .done(() => {
        Noty('success', '撤单申请成功！')
        this.getTransacList(1)
      })
      .fail( (msg) => {
        Noty('error', msg || '撤单申请失败！')
      })
  }
}


function mapStateToProps(state){
  return state.TransacData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...TransacActions,
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);