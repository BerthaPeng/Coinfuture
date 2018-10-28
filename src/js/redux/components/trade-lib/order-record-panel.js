import React, {Component} from 'react';
import {Link} from 'react-router';
import { Tab, Table, Button} from 'semantic-ui-react';
import { orders } from 'locales/index.js';
import intl from 'react-intl-universal';
import config from 'config/app.config.js';
import { dateFormat } from 'utils/utils';

const tmpRecord = [
  {id: 1, time: '11:12:12', type: 'in', price: 8909.90, count: 8981.23, dealed: 23.45, undeal: 46.78, total: 0.56},
  {id: 2, time: '11:12:12', type: 'in', price: 8909.90, count: 8981.23, dealed: 23.45, undeal: 46.78, total: 0.56},
  {id: 3, time: '11:12:12', type: 'in', price: 8909.90, count: 8981.23, dealed: 23.45, undeal: 46.78, total: 0.56},
]

class OrderRecordPanel extends Component{
  constructor(props){
    super(props);
  }
  render(){
    var { lang, login, transac_list } = this.props.props
    transac_list = transac_list.map( m => { m.created_datetime = dateFormat( new Date(m.created_datetime), 'yyyy-MM-dd hh:mm:ss'); return m;})
    return (<Tab.Pane attached={false} className="fl-trade-panel" style={{padding: '0px', marginTop: '6px', border: '1px solid #eee'}}>
            <Table attached basic="very" textAlign="center" className="no-border-table gray-header-table thin-table" style={{margin: '0px'}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{intl.get('orderid')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('ordertime')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('type')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('pairs')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('price')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('amount')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('total')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('executed')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('unexecuted')}</Table.HeaderCell>
                  <Table.HeaderCell>{intl.get('status')}</Table.HeaderCell>
                  { this.props.panel_type == 'current' && <Table.HeaderCell>{intl.get('action')}</Table.HeaderCell> }
                </Table.Row>
              </Table.Header>
            </Table>
            {
              login ?
              <Table attached basic="very" textAlign="center" className="no-border-table gray-header-table thin-table" style={{margin: '0px'}}>
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
                      <Table.Cell>{ (m.order_type == 1 || m.order_type == 3) ? intl.get('marketprice') : Number(m.limit_price).toFixed(8)}</Table.Cell>
                      <Table.Cell>{ Number(m.quantity).toFixed(8)}</Table.Cell>
                      <Table.Cell>{ Number(m.amount).toFixed(8)}</Table.Cell>
                      <Table.Cell>{ Number(m.executed_quantity).toFixed(8)}</Table.Cell>
                      <Table.Cell>{ Number(m.not_executed_quantity).toFixed(8)}</Table.Cell>
                      <Table.Cell>{ lang == 'en-US' ? m.order_status : config.ORDER_STATUS['status_' + m.order_status_id ] }</Table.Cell>
                      <Table.Cell>
                        {
                          this.props.panel_type == 'current' ?
                          <span className="primary-color action-btn border-btn" onClick={this.withdraw.bind(this, m.trade_pair, m.id)}>
                            {intl.get('cancel')}
                          </span>
                          :
                          null

                        }
                      </Table.Cell>
                    </Table.Row>)
                  })
                  }
                </Table.Body>
              </Table>
              :
              <div className="no-login-tips">
                <p style={{marginTop: '30px'}}>您必须先登录才能查看此内容</p>
                <div style={{marginTop: '10px'}}>
                  <Link to='/login'><Button className="login-btn" size="tiny">{intl.get('login')}</Button></Link>
                  <Link to='/register'><Button className="register-btn" size="tiny">{intl.get('signup')}</Button></Link>
                </div>
              </div>
            }
        </Tab.Pane>)
  }
  withdraw(symbol, order_id){
    this.props.props.withdraw( symbol, order_id )
  }
}

export default class OrderRecordPanelWrapper extends Component{
  state = { activeIndex: 0}
  render(){
    var { props } = this;
    var { activeIndex } = this.state;
    const PanelInner= [
      { menuItem: '当前委托', render: () => <OrderRecordPanel props={props} panel_type="current" /> },
      { menuItem: '交易记录', render: () => <OrderRecordPanel props={props} panel_type="before" /> }
    ]
    return(
      <Tab activeIndex={activeIndex} className="order-record" menu={{ secondary: true, pointing: true }} panes={ PanelInner } style={{marginBottom: '0px'}} onTabChange = {this.handleTabChange.bind(this)} />
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
  handleTabChange = ( e, { activeIndex }) => {
    if(activeIndex != this.state.activeIndex){
      this.props.getTransacList(activeIndex + 1)
      this.setState({ activeIndex });
    }
  }
  //初始化语言脚本
  loadLocales(lang){
    intl.load(orders)
  }
}