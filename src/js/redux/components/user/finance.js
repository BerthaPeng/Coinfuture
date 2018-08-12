import React, { Component } from 'react';
import { Button, Dropdown, Icon, Table, Menu, Radio } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as FinanceActions from 'actions/user-finance.js';
import { bindActionCreators } from 'redux';

import intl from 'react-intl-universal';
import { finance } from 'locales/index';
import UserMenu from '../common/user-menu.js';

class Finance extends Component{
  constructor(props){
    super(props);
    this.state = {
      activeMenu: 'pocket',
      current_usd: 0,
    }
  }
  render(){
    var { activeMenu, current_usd } = this.state;
    var { user_coin_list } = this.props.Finance;
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
              <div className="finance-header">
                <div><h3>钱包及资产列表</h3></div>
                <div style={{marginLeft: '20px'}}>
                  <span>显示有余额的资产　　</span>
                  <Radio toggle style={{marginLeft: '10px', verticalAlign: 'middle'}}/></div>
              </div>
              <div style={{padding: '10px 40px'}}>
                <p><Icon name="circle" /><span>USDX</span><span>可用：{current_usd}  ，冻结：0，估值：{parseFloat(current_usd) * 6.5}元</span></p>
                <div style={{padding: '10px 40px'}}><Button size="mini">充值</Button><Button style={{marginLeft: '10px'}} size="mini">提现</Button></div>
              </div>
              <div className="finance-body" style={{marginTop: '20px'}}>
                <Table basic="very" textAlign="center" className="no-border-table gray-header-table" style={{margin: '0px'}} textAlign="left">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell verticalAlign="top">名称</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">总量</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">可用</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">估值(元)</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">可用</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">冻结</Table.HeaderCell>
                      <Table.HeaderCell verticalAlign="top">操作</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      user_coin_list.map( m => {
                        return (<Table.Row key={m.coin_id + '-tmp-record'}>
                      <Table.Cell>{m.coin_name_english}</Table.Cell>
                      <Table.Cell>
                        {m.balance || '0.00000000'}
                      </Table.Cell>
                      <Table.Cell>
                        {m.balance || '0.00000000'}
                      </Table.Cell>
                      <Table.Cell></Table.Cell>
                      <Table.Cell></Table.Cell>
                      <Table.Cell>0.00000000</Table.Cell>
                      <Table.Cell><Button size="small">充值</Button><Button size="small">提币</Button></Table.Cell>
                    </Table.Row>)
                      })
                    }
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
  }
  componentDidMount(){
    this.props.actions.getUserCoinList({})
      .done( data => {
        var usd = data.filter( m => m.coin_name_english.trim() == 'USDX');
        if(usd && usd.length){
          this.setState({ current_usd: usd[0].balance})
        }
      })
    this.loadLocales(this.props.Lang.lang);

  }
  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  loadLocales(lang){
    lang = 'zh-CN'
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