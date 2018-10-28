import React, {Component} from 'react';
import {Link} from 'react-router';
import { Button, Table, Select, Dropdown, Icon, Pagination, Input }  from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MarketActions from 'actions/market.js';

import RadioGroup from './common/radio-group';
import RadioButton from './common/radio-button';


class CatePanel extends Component{
  constructor(props){
    super(props);
    this.state = {
      active_cate: {},
      active_child_cate: {},
      active_grand_child_cate: {},
      active_attr_arr: [],
    }
  }
  render(){
    var { coin_cate_list, coin_attr_list, Lang: {lang}, active_cate, active_child_cate, active_grand_child_cate,
     active_attr_arr, filter_coin_list } = this.props;
     var { active_attr_arr, active_cate, active_child_cate, active_grand_child_cate } = this.state;
    const options = [{ key: 1, text: '按币名（船名）排序', value: 1 }, { key: 2, text: '按船型排序', value: 2 }];
    return (
      <div className="filter-block" style={{margin: 'auto'}}>
        <div className="attrs">
          <div className="cateAttrs">
            <div className="attr">
              <div className="attrKey">
                <span>分类</span>
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
                    <span>{ attr.descrpt_en }</span>
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

        <div className="search-block">
          {/*<div className="filter">
            <div className="fl-form-item">
            </div>
          </div>*/}
          <Input iconPosition='right' placeholder='输入想查找的币种' action>
            <input />
            <Button type='submit'  onClick={this.getCoinListByAttr.bind(this)} >搜索</Button>
          </Input>
          {/*<Input size="small" icon='search' placeholder='输入想查找的币种' style={{float: 'right',marginBottom: '10px'}} />*/}
          {/*<Button size="mini" icon onClick={this.getCoinListByAttr.bind(this)}>搜索
            <Icon name="search" />
          </Button>*/}
        </div>
        <div className="table-container" style={{width: '100%'}}>
          <div style={{float: 'left', paddingBottom: '10px'}}>
            <label>排序方式　</label>
            <Dropdown text="按船名" options={options} />
          </div>
          <Table basic className="market-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>船名</Table.HeaderCell>
                <Table.HeaderCell>船型</Table.HeaderCell>
                <Table.HeaderCell>操作</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                filter_coin_list.map( m => <Table.Row>
                  <Table.Cell><Link to={'/trade/' + m.commodity_symbol}>{m.commodity_symbol}</Link></Table.Cell>
                  <Table.Cell>{m.name_en}</Table.Cell>
                  <Table.Cell>
                    <Button className="action-btn" primary content="去交易" size="mini" />
                  </Table.Cell>
                </Table.Row>)
              }
            </Table.Body>
          </Table>

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
    this.setState({ active_cate: cate, active_child_cate: {} });
  }
  chooseChildCate(cate){
    this.setState({ active_child_cate: cate, active_grand_child_cate: {} });
  }
  chooseGrandsonCate(cate){
    this.setState({ active_grand_child_cate: cate });
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
    var { active_cate, active_child_cate, active_grand_child_cate, active_attr_arr } = this.state;
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
    this.props.getCoinListByAttr({ category: cate_id, attr, top: 100})
  }

}

class Market extends Component{
  constructor(props){
    super(props);
    this.getCoinListByAttr = this.getCoinListByAttr.bind(this);
  }
  render(){
    var { getCoinListByAttr } = this;
    var { Market: { coin_cate_list, coin_attr_list, filter_coin_list }, Lang } = this.props;
    return (
      <div>
        {/*<div className="fl-block" style={{height: '200px'}}>
        </div>
        <div style={{background: '#00Bfff'}}>
          <p style={{textAlign: 'center', color: '#fff', padding: '10px 0px'}}>5月热门数字币投资分析</p>
        </div>*/}
        <div className="fl-block"  style={{background: "url(images/bg.jpeg) no-repeat center", backgroundSize: '100% 100%'}}>
        </div>
        <div className="fl-block  reverse-fl-block" style={{padding: '20px 100px'}}>
          <div className="coin-market-wrapper">
            <div className="item item-4"><Button className="default-btn-simple">币圈小常识</Button></div>
            <div className="item item-4"><Button className="default-btn-simple">投资分析</Button></div>
            <div className="item item-4"><Button className="default-btn-simple">排行榜</Button></div>
            <div className="item item-4"><Button className="default-btn-simple">币圈动态</Button></div>
          </div>
        </div>
        <div className="fl-block reverse-fl-block">
          <div className="header-container">
            <div className="item-3"></div>
            <div className="item-3">
              <RadioGroup>
                <RadioButton label="我的收藏"></RadioButton>
                <RadioButton label="全部币种"></RadioButton>
              </RadioGroup>
            </div>
            <div className="item-3">
            </div>
          </div>
          <div className="table-container">
            <div className="fl-block reverse-fl-block">
              <CatePanel { ...{ coin_attr_list, coin_cate_list, Lang, filter_coin_list, getCoinListByAttr }} />
            </div>
            {/*<Table basic className="market-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>排名</Table.HeaderCell>
                  <Table.HeaderCell>名称</Table.HeaderCell>
                  <Table.HeaderCell>最新价（元）</Table.HeaderCell>
                  <Table.HeaderCell>24h涨跌幅</Table.HeaderCell>
                  <Table.HeaderCell>日最高价（元）</Table.HeaderCell>
                  <Table.HeaderCell>日最低价（元）</Table.HeaderCell>
                  <Table.HeaderCell>成交量（RMB）</Table.HeaderCell>
                  <Table.HeaderCell>支付方式</Table.HeaderCell>
                  <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><Icon name="star outline"/></Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>BTC比特币</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>+4.5%</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>234566</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>
                    <Button className="action-btn" primary content="去交易" size="mini" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Icon name="star outline"/></Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>BTC比特币</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>+4.5%</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>234566</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>
                    <Button className="action-btn" primary content="去交易" size="mini" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Icon name="star outline"/></Table.Cell>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>BTC比特币</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>+4.5%</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>10,042.1</Table.Cell>
                  <Table.Cell>234566</Table.Cell>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>
                    <Button className="action-btn" primary content="去交易" size="mini" />
                  </Table.Cell>
                </Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
                <Table.Row></Table.Row>
              </Table.Body>
            </Table>
            <Pagination size="mini" defaultActivePage={5} totalPages={10} style={{marginTop: '10px'}} />*/}

          </div>
        </div>
      </div>
      )
  }
  componentDidMount(){
    this.props.actions.getCoinCategoryList_market({});
    this.props.actions.getCommonAttrList_market({});
    this.getCoinListByAttr({ category: 0, attr: "{}", top: 100})
  }
  getCoinListByAttr(params){
    this.props.actions.getCoinListByAttr_market(params)
      .fail( ({msg}) => {
        Toast.error( msg || '获取币失败')
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