import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Button } from 'semantic-ui-react';

export default class ExpandTable extends Component{
  constructor(props){
    super(props);
    this.state ={
    }
  }
  render(){
    var { list } = this.props;
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
                return (<dl key={m.coin_id + '-tmp-record'}>
                  <dd>{ this.props.lang == 'en-US' ? m.coin_name_english : m.coin_name_chinese}</dd>
                  <dd>
                    {m.balance || '0.00000000'}
                  </dd>
                  <dd></dd>
                  <dd>
                    <Button size="small">{intl.get('deposit')}</Button><Button size="small">{intl.get('withdraw')}</Button>
                  </dd>
                </dl>)
              })
            }
          </div>
        </div>
      </div>
      )
  }
}