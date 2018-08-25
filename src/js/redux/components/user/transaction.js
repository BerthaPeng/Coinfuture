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
const TransacDetailPane = (props) => {
  var { transac_detail_list, loading } = props;
  return  <Tab.Pane attached={false} loading={loading}>
    <Table basic="very" className="no-border-table gray-header-table main-table">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>订单号</Table.HeaderCell>
          <Table.HeaderCell>成交时间</Table.HeaderCell>
          <Table.HeaderCell>交易对</Table.HeaderCell>
          <Table.HeaderCell>方向</Table.HeaderCell>
          <Table.HeaderCell>成交价格</Table.HeaderCell>
          <Table.HeaderCell>成交数量</Table.HeaderCell>
          <Table.HeaderCell>成交总额</Table.HeaderCell>
          <Table.HeaderCell>手续费</Table.HeaderCell>
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

const TransacPane = (props) => {
  var { transac_list, loading } = props;
  return <Tab.Pane attached={false} loading={loading}>
    <Table basic="very" className="no-border-table gray-header-table main-table">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>订单号</Table.HeaderCell>
          <Table.HeaderCell>下单时间</Table.HeaderCell>
          <Table.HeaderCell>交易类型</Table.HeaderCell>
          <Table.HeaderCell>交易对</Table.HeaderCell>
          {/*<Table.HeaderCell>方向</Table.HeaderCell>*/}
          <Table.HeaderCell>价格</Table.HeaderCell>
          <Table.HeaderCell>数量</Table.HeaderCell>
          <Table.HeaderCell>委托总额</Table.HeaderCell>
          <Table.HeaderCell>已成交</Table.HeaderCell>
          <Table.HeaderCell>未成交</Table.HeaderCell>
          <Table.HeaderCell>状态</Table.HeaderCell>
          <Table.HeaderCell>操作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          transac_list.map( m => {
            return (<Table.Row key={m.id}>
              <Table.Cell>{m.id}</Table.Cell>
              <Table.Cell>{m.created_datetime}</Table.Cell>
              <Table.Cell>
                <span className={`${ m.order_type === 1 || m.order_type === 2 ? 'color-up' : 'color-down'}`}>{config.ORDER_TYPE_CN['type_' +m.order_type]}</span>
              </Table.Cell>
              <Table.Cell>
                <span className="primary-color">{m.trade_pair.replace('USDX', '/USDX')}</span></Table.Cell>
              <Table.Cell>{ (m.order_type == 1 || m.order_type == 3) ? '市价' : Number(m.limit_price).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.quantity).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.amount).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.executed_quantity).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.not_executed_quantity).toFixed(8)}</Table.Cell>
              <Table.Cell>{ config.ORDER_STATUS['status_' + m.order_status ] }</Table.Cell>
              <Table.Cell>
                <span className="primary-color action-btn">详情</span>
                <Icon name="angle down" className="primary-color" />
              </Table.Cell>
            </Table.Row>)
          })
        }
      </Table.Body>
    </Table>
  </Tab.Pane>
}


class Transaction extends Component{
  constructor(props){
    super(props);
    this.state ={
      activeMenu: 'order-record',
      order_cate: 1,
      loading: false,
    }
  }
  render(){
    var { activeMenu, loading, order_cate } = this.state;
    var { transac_list, transac_detail_list } = this.props.Transaction;
    transac_list = transac_list.map( m => { m.created_datetime = dateFormat( new Date(m.created_datetime), 'yyyy-MM-dd hh:mm:ss'); return m;})
    transac_detail_list = transac_detail_list.map( m => { m.match_datetime = dateFormat( new Date(m.match_datetime), 'yyyy-MM-dd hh:mm:ss'); return m;})
    const order_filter_options = [
      { text: '当前委托', value: 1},
      { text: '委托历史', value: 2},
      { text: '成交明细', value: 'detail'},
    ]
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
                  <h3>订单记录</h3>
                </div>
                <div style={{position: 'absolute', right: '20px', color: '#00b38c'}}>
                  <Dropdown inline options={order_filter_options} defaultValue={order_filter_options[0].value} onChange={this.handleTabChange.bind(this)} />
                </div>
              </div>
              <div className="finance-body" style={{marginTop: '20px'}}>
                {
                  order_cate == 'detail' ?
                  <TransacDetailPane {...{transac_detail_list, loading}} />
                  :
                  <TransacPane {...{transac_list, loading}} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
            )
  }
  componentDidMount(){
    this.getTransacList(1)
    this.loadLocales('zh-CN');
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