import React, { Component } from 'react';
import { Button, Dropdown, Icon, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as FinanceActions from 'actions/user-finance.js';
import { bindActionCreators } from 'redux';

import intl from 'react-intl-universal';
import { finance } from 'locales/index';

class Finance extends Component{
  constructor(props){
    super(props);
  }
  render(){
    var { user_coin_list } = this.props.Finance;
    return (
      <div>
        {/*<div className="user-part-banner">
          <div className="banner-block"><span>资产</span></div>
        </div>*/}
        <div className="user-wrapper">
          <div className="user-content">
            <div className="title">{intl.get('balances')}</div>
            <div style={{marginTop: 20}}>
              <Table className="theme-table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>{intl.get('coin')}</Table.HeaderCell>
                    <Table.HeaderCell>{intl.get('available')}</Table.HeaderCell>
                    <Table.HeaderCell>{intl.get('onorders')}</Table.HeaderCell>
                    <Table.HeaderCell>{intl.get('action')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    user_coin_list.map( coin => {
                      return (<Table.Row>
                        <Table.Cell style={{fontSize: '14px'}}>{coin.coin_name_english}</Table.Cell>
                        <Table.Cell>{coin.balance ? coin.balance : '0.00000000'}</Table.Cell>
                        <Table.Cell>0.00000000</Table.Cell>
                        <Table.Cell className="action-btn">{intl.get('exchange')}</Table.Cell>
                      </Table.Row>)
                    })
                  }
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
      )
  }
  componentDidMount(){
    this.props.actions.getUserCoinList({})
    this.loadLocales(this.props.Lang.lang);

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