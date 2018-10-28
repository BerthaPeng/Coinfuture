import React, { Component } from 'react';
import { Button, Dropdown, Icon, Table, Tab, Radio, Pagination } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as TransacActions from 'actions/user/transaction.js';
import { bindActionCreators } from 'redux';
import { dateFormat } from 'utils/utils';
import config from 'config/app.config';

import intl from 'react-intl-universal';
import { orders } from 'locales/index.js';
import UserMenu from '../common/user-menu.js';
import LazyLoad from 'utils/lazy_load';
import Toast from '../common/Toast.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const TransacDetailHeader = () => (<Table.Header>
        <Table.Row>
          <Table.HeaderCell>{intl.get('orderid')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('dealtime')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('pairs')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('type2')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('price')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('amount')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('dealamount')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('fee')}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>)

const TransacDetailBody = (props) => {
  var { transac_detail_list } = props;
  return (<Table.Body>
        {
          transac_detail_list.map( (m, index) => {
            return (<Table.Row key={m.order_id + '-' + index}>
              <Table.Cell>{m.order_id}</Table.Cell>
              <Table.Cell>{m.match_datetime}</Table.Cell>
              <Table.Cell>
                <span className="primary-color">{m.trade_pair.replace('USDX', '/USDX')}</span>
              </Table.Cell>
              <Table.Cell>
                <span className={`${ m.buy_or_sell ? 'color-up' : 'color-down'}`}>{ m.buy_or_sell ? intl.get('buy'): intl.get('sell')}</span>
              </Table.Cell>
              <Table.Cell>{ Number(m.fullfilled_price).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.fullfilled_quantity).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.amount).toFixed(8)}</Table.Cell>
              <Table.Cell>{ Number(m.fee).toFixed(8) }</Table.Cell>
            </Table.Row>)
          })
        }
      </Table.Body>)
}
const TransacDetailPane = (props) => {
  var { transac_detail_list, loading } = props;
  return  <Tab.Pane attached={false} loading={loading}>
    <Table basic="very" className="no-border-table gray-header-table main-table">
      <TransacDetailHeader />
      <TransacDetailBody  {...{transac_detail_list}}/>
    </Table>
  </Tab.Pane>
}

const TransacHistoryHeader =() => {
  //写成函数式声明组件
  return <Table.Header>
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
  }

class TransacHistoryBody extends Component{
  constructor(props){
    super(props);
  }
  render(){
  var { rows, lang, order_type } = this.props;
  return <Table.Body >
    {
      rows.map( m => {
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
          <Table.Cell>{ (m.order_type == 1 || m.order_type == 3) ? intl.get('marketprice') : Number(m.limit_price).toFixed(8)}</Table.Cell>
          <Table.Cell>{ Number(m.quantity).toFixed(8)}</Table.Cell>
          <Table.Cell>{ Number(m.amount).toFixed(8)}</Table.Cell>
          <Table.Cell>{ Number(m.executed_quantity).toFixed(8)}</Table.Cell>
          <Table.Cell>{ Number(m.not_executed_quantity).toFixed(8)}</Table.Cell>
          <Table.Cell>{ lang == 'en-US' ? m.order_status : config.ORDER_STATUS['status_' + m.order_status_id ] }</Table.Cell>
          <Table.Cell>
            {
              order_type == 1 ?
              <span className="primary-color action-btn border-btn" onClick={this.withdraw.bind(this,m.trade_pair, m.id)}>
                {intl.get('cancel')}
              </span>
              :
              (m.order_status_id === 4 || m.order_status_id === 5 || m.order_status_id === 10) &&[<span className="primary-color action-btn" onClick={this.getTransacDetailList.bind(this, m.id)}>{intl.get('detail')}</span>,
              <Icon name="angle down" className="primary-color" />]

            }
          </Table.Cell>
        </Table.Row>)
      })
    }
  </Table.Body>
  }
  withdraw(symbol, order_id){
    this.props.withdraw(symbol, order_id)
  }
  getTransacDetailList(order_id){
    this.props.getTransacDetailList(order_id);
  }
}

class TransacPane extends Component{
  constructor(props){
    super(props);
    this.state ={
      showDetail: false, //是否展示某一交易的详情
      active_order_id: 0, //选中的交易id
    }
    this.getTransacDetailList = this.getTransacDetailList.bind(this);
  }
  render(){
    var { transac_list, transac_detail_list, loading, order_type, lang, withdraw, getTransacDetailList } = this.props;
    var { showDetail, active_order_id } = this.state;
    var { getTransacDetailList } = this;
    var transac_list_arr_1 = [], transac_list_arr_2 = []; //以active_order_id为界线，将transac_list 分为上下两组
    if(showDetail){
      var index = transac_list.findIndex( m => m.id == active_order_id);
      transac_list_arr_1 = transac_list.slice(0, index + 1 );
      transac_list_arr_2 = transac_list.slice(index + 1);
    }else{
      transac_list_arr_1 = transac_list;
    }
    //查看详情时，委托历史由三部分组成
    return <Tab.Pane attached={false} loading={loading}>
      <Table attached basic="very" className="no-border-table gray-header-table main-table">
        <TransacHistoryHeader />
        <TransacHistoryBody { ...{rows: transac_list_arr_1 || [], lang, order_type, withdraw, getTransacDetailList}} />
      </Table>
      {
        showDetail ?
        [
          <Table attached className="gray-header-table main-table" key="transac-detail-table">
            <TransacDetailHeader />
            <TransacDetailBody  {...{transac_detail_list}}/>
          </Table>,
          <Table attached basic="very" className="no-border-table gray-header-table main-table" key="transac-history-table">
            <TransacHistoryBody { ...{rows: transac_list_arr_2 || [], lang, order_type, withdraw, getTransacDetailList}} />
          </Table>
        ]:null
      }
    </Tab.Pane>
  }
  getTransacDetailList(order_id){
    if(order_id == this.state.active_order_id){
      this.setState({ active_order_id: 0, showDetail: false})
    }else{
      this.setState({ active_order_id: order_id, showDetail: true});
      this.props.getTransacDetailList(order_id, 1, 100);
    }
  }
  /*withdraw(symbol, order_id){
    this.props.withdraw(symbol, order_id)
  }*/
}


class Transaction extends Component{
  constructor(props){
    super(props);
    this.state ={
      activeMenu: 'order-record',
      order_cate: 1,
      loading: false,
      order_type: 1,
      pageno: 1,
      pagesize: 10,
      totalPages: 0,
      date_from: '',
      date_to: '',
    }
    this.withdraw = this.withdraw.bind(this);
    this.getTransacDetailList = this.getTransacDetailList.bind(this);
  }
  render(){
    var { activeMenu, loading, order_cate, order_type, pageno, totalPages, date_from, date_to } = this.state;
    var { transac_list, transac_detail_list } = this.props.Transaction;
    transac_list = transac_list.map( m => { m.created_datetime = dateFormat( new Date(m.created_datetime), 'yyyy-MM-dd hh:mm:ss'); return m;})
    transac_detail_list = transac_detail_list.map( m => { m.match_datetime = dateFormat( new Date(m.match_datetime), 'yyyy-MM-dd hh:mm:ss'); return m;})
    const order_filter_options = [
      { text: intl.get('openorders'), value: 1},
      { text: intl.get('orderhistory'), value: 2},
      { text: intl.get('transactionhistory'), value: 3},
    ]
    var { withdraw, getTransacDetailList } = this;
    var { lang } = this.props.Lang;
    return (
      <div className="fl-block gray-bg">
        <div className="flex-wrapper">
          <div className="item-20-100">
            <div className="item-inner" style={{minHeight: '100%'}}>
              <UserMenu lang={lang} active="order-record" />
            </div>
          </div>
          <div className="item-80-100" style={{marginLeft: '15px'}}>
            <div className="item-inner" style={{minHeight: '100%'}}>
              <div className="finance-header" style={{position: 'relative'}}>
                <div className="finance-header-title-wrapper">
                  <h3>{intl.get('orders')}</h3>

                </div>
                <div style={{position: 'absolute', right: '20px', color: '#00b38c'}}>
                  <Dropdown inline options={order_filter_options} value={order_type} onChange={this.handleTabChange.bind(this)} />
                </div>
              </div>
              <div className="finance-body" style={{marginTop: '20px'}}>
                <div className="finance-filter">
                   <label>{intl.get('transactime')}</label>
                   <div className="date-wrapper">
                    <DatePicker
                      selected={date_from}
                      selectsStart
                      showTimeSelect
                      startDate={date_from}
                      endDate={date_to}
                      onChange={this.selectDateChange.bind(this, 'date_from')}
                      dateFormat="YYYY-MM-DD HH:mm:ss"
                      timeFormat="HH:mm"
                      placeholderText={intl.get('startDate')}/></div>
                   {intl.get('and')}
                   <div className="date-wrapper">
                    <DatePicker
                      selected={date_to}
                      selectsEnd
                      showTimeSelect
                      startDate={date_from}
                      endDate={date_to}
                      onChange={this.selectDateChange.bind(this, 'date_to')}
                      dateFormat="YYYY-MM-DD HH:mm:ss"
                      timeFormat="HH:mm"
                      placeholderText={intl.get('endDate')}/></div>
                   <Button onClick={this.search.bind(this)}>{intl.get('search')}</Button>
                </div>
                {
                  order_cate == 3 ?
                  <TransacDetailPane {...{transac_detail_list, loading, lang}} />
                  :
                  <TransacPane {...{transac_list, transac_detail_list, loading, withdraw, order_type, lang, getTransacDetailList}} />
                }
                <div style={{textAlign: 'right', padding: '0 15px'}}>
                  <Pagination activePage={pageno} totalPages = {totalPages} onPageChange={this.onPageChange.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            )
  }
  componentDidMount(){
    this.getTransacList(1, 1)
    this.loadLocales(this.props.Lang.lang);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      /*intl.determineLocale({ currentLocale: nextProps.Lang.lang });*/
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  handleTabChange=(e, data) => {
    this.setState({ order_cate : data.value, order_type: data.value,
      date_to: '', date_from: '' }, () => {
        if(data.value == 3){
          this.getTransacDetailList(0, 1, this.state.pagesize, '', '');
        }else{
          this.getTransacList(data.value, 1);
        }
      });
  }
  //"type": 查询类型 0 所有状态 1 当前委托 2 委托历史 3 成交明细
  getTransacList(type, pageno){
    this.setState({ loading: true})
    var { date_to, date_from } = this.state;
    date_to = date_to? date_to.format('YYYY-MM-DD HH:mm:ss') : '';
    date_from = date_from ? date_from.format('YYYY-MM-DD HH:mm:ss') : '';
    this.props.actions.getTransacList({ type, pageno, pagesize: this.state.pagesize, date_from, date_to, symbol: '' })
      .done( (data) => {
        if(data && data.length){
          var totalPages = data[0].row_total % this.state.pagesize > 0 ?
           parseInt(data[0].row_total / this.state.pagesize) + 1 :  parseInt(data[0].row_total / this.state.pagesize);
          this.setState({ totalPages})
        }else{
          this.setState({totalPages: 0})
        }
        this.setState({ loading: false});
      })
      .fail( ({msg}) => {
        this.setState({ loading: false})
      })
  }
  getTransacDetailList(order_id, pageno, pagesize, date_from, date_to){
    date_to = date_to ? date_to.format('YYYY-MM-DD HH:mm:ss') : '';
    date_from = date_from ? date_from.format('YYYY-MM-DD HH:mm:ss') : '';
    this.props.actions.getTransacDetailList({pageno, pagesize, date_from, date_to, order_id })
      .done(data => {
        if(data && data.length){
          var totalPages = data[0].row_total % this.state.pagesize > 0 ?
           parseInt(data[0].row_total / this.state.pagesize) + 1 :  parseInt(data[0].row_total / this.state.pagesize);
          this.setState({ totalPages})
        }else{
          this.setState({totalPages: 0})
        }
        this.setState({ loading: false})
      })
      .fail( ({msg}) => {
        this.setState({ loading:false})
      })
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang,
      locales: orders
    })
  }
  onPageChange(e, { activePage }){
    var { order_type } = this.state;
    this.setState({ pageno: activePage })
    if(order_type == 3){
      this.getTransacDetailList(0, activePage, this.state.pagesize, this.state.date_from, this.state.date_to);
    }else{
      this.getTransacList(order_type, activePage);
    }
  }
  search(){
    if(this.state.order_type == 3){
      this.getTransacDetailList(0, 1, this.state.pagesize, this.state.date_from, this.state.date_to);
    }else{
      this.getTransacList(this.state.order_type, 1)
    }
  }
  withdraw(symbol, order_id){
    this.props.actions.withdraw({ symbol, order_id})
      .done(() => {
        Toast.success('撤单申请成功！')
        this.getTransacList(1, this.state.pageno)
      })
      .fail( (msg) => {
        Toast.error( msg || '撤单申请失败！')
      })
  }
  selectDateChange(key, value){
    if(key == 'date_to' && value < this.state.date_from){
      this.setState({date_to: this.state.date_from})
    }else{
      this.setState({ [key]: value})
    }
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