import React, {Component} from 'react';
import {Link} from 'react-router';
import { Button, Table, Select, Dropdown, Icon, Pagination, Input }  from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MarketActions from 'actions/market.js';

import RadioGroup from './common/radio-group';
import RadioButton from './common/radio-button';

import Toast from './common/Toast.js';

import intl from 'react-intl-universal';
import { market } from 'locales/index.js';


class CatePanel extends Component{
  constructor(props){
    super(props);
    this.state = {
      active_cate: {},
      active_child_cate: {},
      active_grand_child_cate: {},
      active_attr_arr: [],
      filter_name: '',
    }
  }
  render(){
    var { coin_cate_list, coin_attr_list, Lang: {lang}, active_cate, active_child_cate, active_grand_child_cate,
     active_attr_arr, filter_coin_list, login } = this.props;
     var { active_attr_arr, active_cate, active_child_cate, active_grand_child_cate, filter_name } = this.state;
    return (
      <div className="filter-block" style={{margin: 'auto', padding: 0}}>
        <div className="search-block">
          <div className="table-title" style={{border: 'none'}}>
            {intl.get('token')}
            <Input size="mini" style={{fontSize: '12px', float: 'right'}} iconPosition='right' placeholder={intl.get('searchplaceholder')} action>
              <input value={filter_name} onChange={this.onNameChange.bind(this)} />
              <Button size="mini" type='submit' primary  onClick={this.getCoinListByAttr.bind(this)} >{intl.get('search')}</Button>
            </Input>
            {/*<Input size="mini" style={{fontSize: '12px', float: 'right'}} icon={<Icon style={{cursor: 'pointer'}} name='search' onClick={this.getCoinListByAttr.bind(this)} />} placeholder='输入想查找的币种' />*/}
          </div>
          {/*<div style={{float: 'left', paddingBottom: '10px'}}>
            <label>排序方式　</label>
            <Dropdown text="按船名" options={options} />
          </div>*/}
          <div style={{clear: 'both'}}></div>
        </div>
        <div className="attrs">
          <div className="cateAttrs">
            <div className="attr">
              <div className="attrKey">
                <span>{intl.get('categories')}</span>
              </div>
              <div className="attrValues">
                <ul>
                  {
                    coin_cate_list.map( n => (<li key={'cate-level-1-' + n.id}  className={`${active_cate.id == n.id ? 'active':''}`} onClick={this.chooseCate.bind(this, n)}>
                      <span>{ n.descrpt_en }
                      <Icon name="check" />
                      </span>
                    </li>))
                  }
                </ul>
                {
                  active_cate.children && active_cate.children.length ?
                  [
                  <Icon name="angle double right"/>
                  ,<ul style={{ borderTop: '1px dotted #D1CCC7', marginTop: '5px', paddingLeft: '15px'}}>
                    {
                      active_cate.children.map( n => (<li key={'cate-level-2-' + n.id }  className={`${active_child_cate.id == n.id ? 'active':''}`} onClick={this.chooseChildCate.bind(this, n)}>
                        <span>{ n.descrpt_en }
                        <Icon name="check" />
                        </span>
                      </li>))
                     }
                  </ul>]
                  :null
                }
                {
                  active_child_cate.children && active_child_cate.children.length ?
                  [
                  <Icon name="angle double right"/>
                  ,<ul style={{ borderTop: '1px dotted #D1CCC7', marginTop: '5px', paddingLeft: '30px'}}>
                    {
                      active_child_cate.children.map( n => (<li key={'cate-level-3-' + n.id }  className={`${active_grand_child_cate.id == n.id ? 'active':''}`} onClick={this.chooseGrandsonCate.bind(this, n)}>
                        <span>{ n.descrpt_en }
                        <Icon name="check" />
                        </span>
                      </li>))
                     }
                  </ul>]
                  :null
                }
              </div>
            </div>
          </div>
          <div className="propAttrs">
            {
              coin_attr_list.map( attr => (<div className="attr" key={'attr-parent-' + attr.id}>
                  <div className="attrKey">
                    <span>{ lang=='en-US' ? attr.descrpt_en : attr.descrpt_ch }</span>
                  </div>
                  <div className="attrValues">
                    <ul>
                      {
                        attr.items.map(  n => (<li key={'attr-' + n.id}
                         className={`${active_attr_arr.some( h => h.parent == n.parent && h.id == n.id) ? 'active':''}`}
                         onClick={this.chooseAttr.bind(this, { parent: n.parent, id: n.id})}>
                          <span>{ n.descrpt_en }
                            <Icon name="check" />
                          </span>
                        </li>))
                      }
                    </ul>
                  </div>
                </div>))
            }
          </div>
        </div>

        <div className="table-container" style={{width: '100%'}}>
          <Table basic="very" className="simple-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{intl.get('shipname')}</Table.HeaderCell>
                <Table.HeaderCell>{intl.get('type')}</Table.HeaderCell>
                <Table.HeaderCell>{intl.get('total')}</Table.HeaderCell>
                <Table.HeaderCell>{intl.get('sold')}</Table.HeaderCell>
                <Table.HeaderCell>{intl.get('price')}</Table.HeaderCell>
                <Table.HeaderCell>{intl.get('action')}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                filter_coin_list.map( m => <Table.Row>
                  <Table.Cell><Link to={'/trade/' + m.commodity_symbol + '/' + m.commodity_coin}>
                    <span style={{color: '#254d87'}}>{m.name_en}</span>
                    </Link></Table.Cell>
                  <Table.Cell>
                    {
                      (m.cate_chain || []).map( n => <div><div className="attr-tag" key={n.descrpt_en}>{n.descrpt_en}</div></div>)
                    }
                  </Table.Cell>
                  <Table.Cell>{m.total_supply}</Table.Cell>
                  <Table.Cell>{m.total_in_market}</Table.Cell>
                  <Table.Cell>
                    {
                      m.pub_status == 3 ?
                      <div>{m.ico_price}</div>
                      :
                      <div className="unavailable-btn">{intl.get('notforsale')}</div>
                    }
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={'/trade/' + m.commodity_symbol + '/' + m.commodity_coin}>
                      <Button className="action-btn" primary content={intl.get('exchange')} size="mini" />
                    </Link>
                    {
                      m.pub_status == 3 ?
                      <Link to={ login ? '/buytoken/' + m.name_en + '/' + m.commodity_coin : '/login'}>
                        <Button className="action-btn" primary content={intl.get('buy')} size="mini" />
                      </Link>
                      :null
                    }
                  </Table.Cell>
                </Table.Row>)
              }
            </Table.Body>
          </Table>
          {
            filter_coin_list.length == 0 ?
            <div style={{textAlign: 'center', color: '#bfbfbf', fontSize: '16px', padding: '20px 0', marginBottom: '50px'}}>
              <img src="/images/ship.png" />
              <p>{intl.get('nodata')}……</p>
            </div>
            :null
          }

        </div>
          {/*<div className="boats">
              {
                filter_coin_list.map( n => (<div className="boat" key={'coin-' + n.id} onClick={this.chooseBoat.bind(this, n.symbol.replace('USDX', ""))}>
                        <span><Icon name="ship" />{lang == 'en-US' ? n.name_en : n.name_ch}
                        </span>
                      </div>))
              }
          </div>*/}
      </div>
      )
  }
  chooseBoat(){

  }
  chooseCate(cate){
    if(this.state.active_cate.id == cate.id){
      cate = {}
    }
    this.setState({ active_cate: cate, active_child_cate: {} }, () => {
      this.getCoinListByAttr();
    });
  }
  chooseChildCate(cate){
    if(this.state.active_child_cate.id == cate.id){
      cate = {}
    }
    this.setState({ active_child_cate: cate, active_grand_child_cate: {} }, () => {
      this.getCoinListByAttr();
    });
  }
  chooseGrandsonCate(cate){
    if(this.state.active_grand_child_cate.id == cate.id){
      cate = {}
    }
    this.setState({ active_grand_child_cate: cate }, () => {
      this.getCoinListByAttr();
    });
  }
  chooseAttr(attr){
    var { active_attr_arr } = this.state;
    var index = active_attr_arr.findIndex( m => m.parent == attr.parent);
    if(index >= 0 ){
      if( active_attr_arr[index].id == attr.id){
        delete active_attr_arr[index];
      }else{
        active_attr_arr[index] = attr;
      }
    }else{
      active_attr_arr.push(attr);
    }
    this.setState({ active_attr_arr });
  }
  getCoinListByAttr(){
    var cate_id = 0, attr = "{}";
    var { active_cate, active_child_cate, active_grand_child_cate, active_attr_arr, filter_name } = this.state;
    if(active_cate.id){
      cate_id = active_cate.id;
    }
    if(active_child_cate.id){
      cate_id = active_child_cate.id;
    }
    if(active_grand_child_cate.id){
      cate_id = active_grand_child_cate.id;
    }
    if(active_attr_arr.length){
      var attr_arr = active_attr_arr.map( m => {return m.id})
      attr = "{" + attr_arr.join(',') + "}";
    }
    this.props.getCoinListByAttr({ category: cate_id, attr, top: 100, name: filter_name, ico: 0})
  }
  onNameChange(e){
    this.setState({ filter_name: e.target.value})
  }
}

class Market extends Component{
  constructor(props){
    super(props);
    this.getCoinListByAttr = this.getCoinListByAttr.bind(this);
    this.state = {
      login: false,
    }
  }
  render(){
    var { getCoinListByAttr } = this;
    var { login } = this.state;
    var { Market: { coin_cate_list, coin_attr_list, filter_coin_list }, Lang } = this.props;
    return (
      <div>
        {/*<div className="fl-block" style={{height: '200px'}}>
        </div>
        <div style={{background: '#00Bfff'}}>
          <p style={{textAlign: 'center', color: '#fff', padding: '10px 0px'}}>5月热门数字币投资分析</p>
        </div>*/}
        <div className="fl-block" style={{padding: 0, position: 'relative'}}>
          <img src="/images/bg.png" width="100%" />
          <div className="coin-market-wrapper">
            <div className="item item-4"><Button>{intl.get('tips')}</Button></div>
            <div className="item item-4"><Button>{intl.get('investment')}</Button></div>
            <div className="item item-4"><Button>{intl.get('rankings')}</Button></div>
            <div className="item item-4"><Button>{intl.get('news')}</Button></div>
          </div>
        </div>
        <div className="fl-block reverse-fl-block" style={{padding: 0}}>
          <div className="table-container">
            <div className="fl-block reverse-fl-block"  style={{padding: 0}}>
              <CatePanel { ...{ coin_attr_list, coin_cate_list, Lang, filter_coin_list, getCoinListByAttr, login }} />
            </div>
          </div>
        </div>
      </div>
      )
  }
  componentDidMount(){
    this.props.actions.getCoinCategoryList_market({});
    this.props.actions.getCommonAttrList_market({});
    this.getCoinListByAttr({ category: 0, attr: "{}", top: 100, name: '', ico: 0});
    this.loadLocales(this.props.Lang.lang)
    if(sessionStorage.getItem('_udata')){
      this.setState({ login: true})
    }else{
      this.setState({ login: false})
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.Lang.lang != nextProps.Lang.lang){
      this.loadLocales(nextProps.Lang.lang);
    }
  }
  getCoinListByAttr(params){
    this.props.actions.getCoinListByAttr_market(params)
      .fail( ({msg}) => {
        Toast.error( msg || intl.get('MSG_getCoinListByAttr'))
      })
  }
  loadLocales(lang){
    intl.init({
      currentLocale: lang,
      locales: market
    })
  }
}


function mapStateToProps(state){
  return state.MarketData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...MarketActions,
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);