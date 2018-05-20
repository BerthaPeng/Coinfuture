import React, { Component } from 'react';
import { Button, Dropdown, Icon, Table, Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as TransacActions from 'actions/user/transaction.js';
import { bindActionCreators } from 'redux';
import { dateFormatUTC } from 'utils/utils';
import config from 'config/app.config';

import intl from 'react-intl-universal';
import { orders } from 'locales/index.js';

const transacPane = (props) => {
  var { transac_list } = props;
  return () => <Tab.Pane attached={false}>
    <Table className="main-table">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{intl.get('date')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('type')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('pairs')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('type2')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('price')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('amount')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('total')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('executed')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('unexecuted')}</Table.HeaderCell>
          <Table.HeaderCell>{intl.get('action')}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          transac_list.map( m => {
            return (<Table.Row key={m.id}>
              <Table.Cell>{m.created_datetime}</Table.Cell>
              <Table.Cell>币币交易</Table.Cell>
              <Table.Cell>{m.trade_pair}</Table.Cell>
              <Table.Cell>{config.ORDER_TYPE_CN['type_' +m.order_type]}</Table.Cell>
              <Table.Cell>{m.limit_price}</Table.Cell>
              <Table.Cell>{m.quantity}</Table.Cell>
              <Table.Cell>{}</Table.Cell>
              <Table.Cell>{m.executed_quantity}</Table.Cell>
              <Table.Cell>{}</Table.Cell>
              <Table.Cell>{}</Table.Cell>
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
  }
  render(){
    var { transac_list } = this.props.Transaction;
    transac_list = transac_list.map( m => { m.created_datetime = dateFormatUTC( new Date(m.created_datetime), 'yyyy-MM-dd hh:mm:ss'); return m;})
    const panes = [
      { menuItem: intl.get('openorders'), render: transacPane({ transac_list }) },
      { menuItem: intl.get('orderhistory'), render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
      { menuItem: intl.get('transactionhistory'), render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> },
    ];

    return (
      <div className="user-wrapper">
        <div className="user-content transaction">
          <Tab menu={{ borderless: true, attached: false, tabular: false }}panes={panes} />
        </div>
      </div>
      )
  }
  componentDidMount(){
    this.props.actions.getTransacList({ type: 0});
    this.loadLocales(this.props.Lang.lang);
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