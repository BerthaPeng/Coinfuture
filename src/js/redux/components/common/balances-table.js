import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Button, Input } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { balancesTable } from 'locales/index';

export default class ExpandTable extends Component{
  constructor(props){
    super(props);
    this.state ={
      active_coin: '',
      withdraw_coin: '',
      deposit_address: '',
      copied: false,
    }
  }
  render(){
    var { list } = this.props;
    var { active_coin, deposit_address, withdraw_coin } = this.state;
    return (
      <div className="cf-table">
        <dl className="body_list">
          <dt>{intl.get('symbol')}</dt>
          <dt>{intl.get('coin')}</dt>
          <dt>{intl.get('available')}</dt>
          <dt>{intl.get('onorders')}</dt>
          {/*<dt>{intl.get('action')}</dt>*/}
        </dl>
        <div id="table_list">
          <div className="">
            {
              list.map( m => {
                return (<dl key={m.coin_id + '-tmp-record'} className="body_list">
                  <dd>{m.symbol}</dd>
                  <dd>{ this.props.lang == 'en-US' ? m.coin_name_english : m.coin_name_chinese}</dd>
                  <dd>
                    {Number(m.balance) || '0.00000000'}
                  </dd>
                  <dd></dd>
                  {/*<dd>
                    <span className="primary-color action-btn" onClick={this.deposit.bind(this, m.coin_id)}>{intl.get('deposit')}</span>
                    <span className="primary-color action-btn" onClick={this.withdraw.bind(this, m.coin_id)}>{intl.get('withdraw')}</span>
                  </dd>*/}
                  {
                    active_coin == m.coin_id ?
                    <div className="action-box">
                      <div className="table-inner close">
                        <div className="action-inner">
                          <div className="inner-box deposit-address">
                            <p className="describe">{intl.get('depositaddress')}</p>
                            <div className="address_table">
                              <div className="table_body">
                                <span className="copy" id="copyText">{deposit_address}</span>
                              </div>
                              <CopyToClipboard text={deposit_address} onCopy={this.copy.bind(this)}>
                                <div className="table_body body_group">
                                  <span className="primary-color action-btn link-copy">{intl.get('copy')}</span>
                                </div>
                              </CopyToClipboard>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    : null
                  }
                  {
                    withdraw_coin == m.coin_id ?
                    <div className="action-box">
                      <div className="table-inner action-box">
                        <div className="action-inner withdraw-inner">
                          <div className="form-group">
                            <label className="table-form-lbl">地址</label>
                            <Input className="withdraw-input" />
                          </div>
                        </div>
                        <div className="form-group-container">
                          <div className="form-group">
                            <label className="table-form-lbl">金额
                              <p className="label-fr"></p>
                            </label>
                            <Input className="withdraw-input" />
                          </div>
                        </div>
                        <div className="form-group-container form-group-container2">
                          <div className="form-group form-fee">
                            <label className="table-form-lbl">手续费</label>
                            <Input  className="withdraw-input"/>
                          </div>
                          <div className="form-group">
                            <label className="table-form-lbl">到账数量</label>
                            <Input  className="withdraw-input"/>
                          </div>
                        </div>
                        <div className="action-content">
                          <div className="action-body"></div>
                          <div className="action-foot">
                            <Button className="primary-btn withdraw-btn">提现</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    :null
                  }
                </dl>)
              })
            }
          </div>
        </div>
      </div>
      )
  }
  selectText(element) {
      var text = document.getElementById(element);
      if (document.body.createTextRange) {
          var range = document.body.createTextRange();
          range.moveToElementText(text);
          range.select();
      } else if (window.getSelection) {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(text);
          selection.removeAllRanges();
          selection.addRange(range);
          /*if(selection.setBaseAndExtent){
              selection.setBaseAndExtent(text, 0, text, 1);
          }*/
      } else {
          alert("none");
      }
  }
  deposit(coin_id){
    this.setState({ withdraw_coin: ''})
    if(this.state.active_coin != coin_id){
      this.props.getDepositAddress(coin_id)
        .done( data => {
          this.setState({ active_coin: coin_id})
          if(data && data.length){
            this.setState({ deposit_address: data[0].address})
          }
        })
    }else{
      this.setState({ active_coin: ''});
    }
  }
  withdraw(coin_id){
    this.setState({ active_coin: ''})
    if(this.state.withdraw_coin != coin_id){
      this.setState({ withdraw_coin: coin_id })
    }else{

    }
  }
  copy(){
    this.selectText('copyText');
    this.setState({ copied: true});
  }
  getDepositAddress(coin_id){
    this.props.getDepositAddress({ coin_id })
  }
}