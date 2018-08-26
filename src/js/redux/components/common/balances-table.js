import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Noty } from 'utils/utils';

export default class ExpandTable extends Component{
  constructor(props){
    super(props);
    this.state ={
      active_coin: '',
      deposit_address: '13uGBGwQNFcoNE8ULf1yuvF8GgYYEE6fwr',
      copied: false,
    }
  }
  render(){
    var { list } = this.props;
    var { active_coin, deposit_address } = this.state;
    return (
      <div className="cf-table">
        <dl className="body_list">
          <dt>{intl.get('coin')}</dt>
          <dt>{intl.get('available')}</dt>
          <dt>{intl.get('onorders')}</dt>
          <dt>{intl.get('action')}</dt>
        </dl>
        <div id="table_list">
          <div className="">
            {
              list.map( m => {
                return (<dl key={m.coin_id + '-tmp-record'} className="body_list">
                  <dd>{ this.props.lang == 'en-US' ? m.coin_name_english : m.coin_name_chinese}</dd>
                  <dd>
                    {m.balance || '0.00000000'}
                  </dd>
                  <dd></dd>
                  <dd>
                    <span className="primary-color action-btn" onClick={this.deposit.bind(this, m.coin_id)}>{intl.get('deposit')}</span>
                    <span className="primary-color action-btn">{intl.get('withdraw')}</span>
                  </dd>
                  {
                    active_coin == m.coin_id ?
                    <div className="action-box">
                      <div className="table-inner close">
                        <div className="action-inner">
                          <div className="inner-box deposit-address">
                            <p className="describe">Deposit Address</p>
                            <div className="address_table">
                              <div className="table_body">
                                <span className="copy" id="copyText">{deposit_address}</span>
                              </div>
                              <CopyToClipboard text={deposit_address} onCopy={this.copy.bind(this)}>
                                <div className="table_body body_group">
                                  <span className="primary-color action-btn link-copy">Copy</span>
                                </div>
                              </CopyToClipboard>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    : null
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
    if(this.state.active_coin != coin_id){
      this.props.getDepositAddress(coin_id)
        .done( data => {
          this.setState({ active_coin: coin_id})
        })
    }else{
      this.setState({ active_coin: ''});
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