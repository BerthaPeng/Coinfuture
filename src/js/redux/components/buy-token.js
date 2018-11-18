import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon, Table, Input }  from 'semantic-ui-react';
import * as IndexActions from 'actions/index.js';
import Toast from './common/Toast.js';
import config from 'config/app.config.js';
import intl from 'react-intl-universal';
import { buyToken } from 'locales/index.js';

import { home } from 'locales/index.js';
import { post } from 'utils/request'; //Promise

import { dateFormat } from 'utils/utils';

class BuyToken extends Component{
  constructor(props){
    super(props);
    this.state = {
      tokenInfo: {
        /*name_en: 'Bomar Renaissance',
        url: 'https://www.hammonia-reederei.de/fileadmin/_processed_/1/b/csm_HAMMONIA_Jutlandia_DSC00935_6de944a9f8.jpg',
        loa: '222.5',
        beam: '32,20',
        intake: '3398',
        homogen: '1479',
        reefer: '300',
*/      },
      tokenInfoArr: [],
      count: '',
      submit_ing: false,
    }
  }
  render(){
    var { tokenInfo, count, submit_ing, tokenInfoArr } = this.state;
    return (<div>
      <div className="token-info-container">
        <div className="flex-wrapper">
          <div style={{width: '40%'}}>
            <div className="item-content">
              <div className="vesselheader">
                <strong>{tokenInfo.name}</strong>
                <h2>{tokenInfo.name}</h2>
              </div>
              <div className="image">
                <img src={tokenInfo.url} />
              </div>
              <ul className="list-group">
                {
                  /*tokenInfoArr.map( m => <li key={m.key} className="list-group-item">
                  <span className="list-group-item-label">{m.key}</span>
                  <span className="list-group-item-value">{m.value}</span>
                </li>)*/
                }
                <li className="list-group-item">
                  <span>NAME　</span>
                  <span><strong>{tokenInfo.name}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>TYPE　</span>
                  <span><strong>container</strong></span>
                </li>
                <li className="list-group-item">
                  <span>YEAR OF BUILD　</span>
                  <span><strong>{tokenInfo.built}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>SHIPBUILDER　</span>
                  <span><strong>{tokenInfo.ship_builder}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>TEU　</span>
                  <span><strong>{tokenInfo.teu}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>TEU X 14 TONS　</span>
                  <span><strong>{tokenInfo.teux}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>REEFER　</span>
                  <span><strong>{tokenInfo.reefer}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>LOA(M)　</span>
                  <span><strong>{tokenInfo.loa}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>LBP(M)　</span>
                  <span><strong>{tokenInfo.lbp}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>BREADTH(M)　</span>
                  <span><strong>{tokenInfo.breadth}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>DEPTH(M)　</span>
                  <span><strong>{tokenInfo.depth}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>DRAFT(M)　</span>
                  <span><strong>{tokenInfo.draft}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>SERVICE SPEED(KNOTS)　</span>
                  <span><strong>{tokenInfo.service_speed}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>MAIN ENGINE　</span>
                  <span><strong>{tokenInfo.me}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>POWER　</span>
                  <span><strong>{tokenInfo.power}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>MAKER　</span>
                  <span><strong>{tokenInfo.maker}</strong></span>
                </li>
                <li className="list-group-item">
                  <span>CONSUMPTION(TON/DAY)　</span>
                  <span><strong>{tokenInfo.consumption}</strong></span>
                </li>
              </ul>
            </div>
          </div>
          <div style={{width: '60%'}}>
            <div style={{marginLeft: '40px'}}>
              <ul className="list-group-form">
                <li className="list-group-form-item" style={{border: 'none'}}>
                  <span className="list-group-item-label">{intl.get('quantity')}</span>
                  <Input value={count} onChange={this.handleChange.bind(this)} size="mini" style={{width: '200px'}}/>
                </li>
                <li className="list-group-form-item" style={{border: 'none'}}>
                  <span className="list-group-item-label">{intl.get('price')}</span>
                  <span>{tokenInfo.ico_price}</span>
                </li>
                <li className="list-group-form-item" style={{border: 'none'}}>
                  <span className="list-group-item-label">{intl.get('exchangeamount')}</span>
                  <span>{count !== '' ? Number(count) * Number(tokenInfo.ico_price) : 0}</span>
                </li>
              </ul>
              <Button loading={submit_ing} onClick={this.buyToken.bind(this)} className="action-btn" primary style={{marginLeft: '250px', marginTop: '40px'}}>{intl.get('buynow')}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
  componentDidMount(){
    var { token, tokenId } = this.props.params;
    this.loadLocales(this.props.Lang.lang);
    post( 202001, {  id: Number(tokenId) })
      .done( (data) => {
        if(data.length){
          var { tokenInfo } = this.state;
          var tokenInfoArr = [];
          for(var  key in data[0]){
            if(key != 'url' && key != 'id')
              tokenInfoArr.push({key: key, value: data[0][key]})
          }
          tokenInfo.ico_price = data[0].ico_price;
          this.setState({ tokenInfo: data[0], tokenInfoArr })
        }else{
          Toast.error(intl.get('cannotbuy'))
        }
      })
      .fail( ({msg}) => {
        Toast.error( msg || intl.get('coininfoerror'))
      })
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  handleChange(e){
    this.setState({ count: e.target.value});
  }
  buyToken(){
    var { tokenId } = this.props.params;
    if(/^[0-9]*[1-9][0-9]*$/.test(Number(this.state.count))){
      this.setState({ submit_ing: true})
      post( 201023, { coin_id: Number(tokenId), qty: Number(this.state.count)})
        .done( () => {
          Toast.success(intl.get('buyok'));
          this.setState({ submit_ing: false})
        })
        .fail(({msg}) => {
          Toast.error(msg || intl.get('buyfail'));
          this.setState({ submit_ing: false})
        })
    }else{
      Toast.warning(intl.get('quantityreg'))
    }
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang,
      locales: buyToken
    })
  }

}

function mapStateToProps(state){
  return state.BuytokenData;
}

export default connect(mapStateToProps)(BuyToken);