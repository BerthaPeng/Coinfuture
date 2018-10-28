import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon, Table }  from 'semantic-ui-react';
import * as IndexActions from 'actions/index.js';
import Toast from './common/Toast.js';
import config from 'config/app.config.js';


class IndexPage extends Component{
  render(){
    var { PageIndex: { market_list }, Lang } = this.props;
    return (
      <div>
        <div className="fl-block"  style={{background: "url(images/bg.jpeg) no-repeat center", backgroundSize: '100% 100%'}}>
          <p className="fl-hd">操作更简单 资金更安全</p>
          <p style={{marginTop: '10px'}}>傻瓜式操作，五种体系保安全</p>
          <Button style={{marginTop: '20px'}} className="default-btn">立即注册</Button>
        </div>
        <div className="fl-block  reverse-fl-block" style={{padding: '20px 100px'}}>
          <div className="coin-market-wrapper">
            <div className="item item-5"><Button className="default-btn-simple">航运信息</Button></div>
            <div className="item item-5"><Button className="default-btn-simple">关于我们</Button></div>
            <div className="item item-5"><Button className="default-btn-simple">新手上路</Button></div>
            <div className="item item-5"><Button className="default-btn-simple">上币申请</Button></div>
            <div className="item item-5"><Button className="default-btn-simple">帮助中心</Button></div>
          </div>
        </div>
        <div className="fl-block  reverse-fl-block" style={{padding: '0 100px', marginTop: '30px'}}>
          <div className="table-title">最新排名</div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>排名</Table.HeaderCell>
                <Table.HeaderCell>名称</Table.HeaderCell>
                <Table.HeaderCell>最新价</Table.HeaderCell>
                <Table.HeaderCell>涨幅</Table.HeaderCell>
                <Table.HeaderCell>日最高价</Table.HeaderCell>
                <Table.HeaderCell>日最低价</Table.HeaderCell>
                <Table.HeaderCell>成交量</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { market_list.map( (n, index) => <Table.Row key={ index+'coin-order'}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{n.name}</Table.Cell>
                <Table.Cell>{n.price}</Table.Cell>
                <Table.Cell>{n.change}</Table.Cell>
                <Table.Cell>{n.highest}</Table.Cell>
                <Table.Cell>{n.lowest}</Table.Cell>
                <Table.Cell>{n.commit}</Table.Cell>
              </Table.Row>)}
            </Table.Body>
          </Table>
        </div>
        <div className="fl-block  reverse-fl-block" style={{padding: '20px 100px', marginTop: '30px'}}>
          <div className="table-title">市场概览</div>
          <div className="chart-wrapper" style={{marginTop: '20px'}}>
            <div className="item" >
              <ul className="coin-name">
                <li>BCI</li>
                <li>BPI 82</li>
                <li>BPI</li>
                <li>BSI</li>
                <li>BSI 52</li>
                <li>BHSI 38</li>
                <li>BHSI</li>
              </ul>
            </div>
            <div className="item" style={{minHeight: '1px'}}></div>
          </div>
        </div>
        <div className="fl-block  reverse-fl-block" style={{padding: '20px 100px', marginTop: '30px'}}>
          <div className="table-title">船币新闻</div>
          <div className="chart-wrapper" style={{marginTop: '20px'}}></div>
        </div>
        
        {/*<div className="fl-block reverse-fl-block">
          <p className="fl-hd">币种平台严选 可交易数量繁多</p>
          <div className="coin-market-wrapper" style={{marginTop: '30px'}}>
            <div className="item item-8">
              <img src="http://fakeimg.pl/40x40" />
              <p className="name">BTC比特币</p>
              <p className="price color-up">288998.89美元</p>
              <p className="rate color-up">0.26%</p>
            </div>
            <div className="item item-8">
              <img src="http://fakeimg.pl/40x40" />
              <p className="name">BTC比特币</p>
              <p className="price color-down">288998.89美元</p>
              <p className="rate color-down">0.26%</p>
            </div>
            <div className="item item-8">
              <img src="http://fakeimg.pl/40x40" />
              <p className="name">BTC比特币</p>
              <p className="price color-down">288998.89美元</p>
              <p className="rate color-down">0.26%</p>
            </div>
            <div className="item item-8">
              <img src="http://fakeimg.pl/40x40" />
              <p className="name">BTC比特币</p>
              <p className="price color-down">288998.89美元</p>
              <p className="rate color-down">0.26%</p>
            </div>
            <div className="item item-8">
              <img src="http://fakeimg.pl/40x40" />
              <p className="name">BTC比特币</p>
              <p className="price color-down">288998.89美元</p>
              <p className="rate color-down">0.26%</p>
            </div>
            <div className="item item-8">
              <img src="http://fakeimg.pl/40x40" />
              <p className="name">BTC比特币</p>
              <p className="price color-down">288998.89美元</p>
              <p className="rate color-down">0.26%</p>
            </div>
            <div className="item item-8">
              <img src="http://fakeimg.pl/40x40" />
              <p className="name">BTC比特币</p>
              <p className="price color-down">288998.89美元</p>
              <p className="rate color-down">0.26%</p>
            </div>
            <div className="item item-8">
              <img src="http://fakeimg.pl/40x40" />
              <p className="name">BTC比特币</p>
              <p className="price color-down">288998.89美元</p>
              <p className="rate color-down">0.26%</p>
            </div>
          </div>
          <Button className="primary-btn" style={{marginTop: '20px'}}>查看全部</Button>
        </div>
        <div className="fl-block reverse-fl-block">
          <p className="fl-hd">最适合新手</p>
          <p style={{marginTop: '10px'}}>3步轻松玩转资产</p>
          <div className="coin-market-wrapper" style={{marginTop: '30px'}}>
            <div className="item item-5">
              <img src="http://fakeimg.pl/40x40" />
              <p className="title">最高级别加密</p>
            </div>
            <div className="item item-5">
              <img src="http://fakeimg.pl/40x40" />
              <p className="title">7级交易系统备案</p>
            </div>
            <div className="item item-5">
              <img src="http://fakeimg.pl/40x40" />
              <p className="title">账户安全险</p>
            </div>
            <div className="item item-5">
              <img src="http://fakeimg.pl/40x40" />
              <p className="title">用户行为检测系统</p>
            </div>
            <div className="item item-5">
              <img src="http://fakeimg.pl/40x40" />
              <p className="title">服务器隔离存储</p>
            </div>
          </div>
        </div>
        <div className="fl-block reverse-fl-block">
          <p className="fl-hd">关于我们</p>
          <p style={{marginTop: '20px', width: '90%', lineHeight: '25px'}}>海洋数字交易王国成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业，海洋数字交易王国成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业，海洋数字交易王国成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业海洋数字交易王国成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业海洋数字交易王国成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业
          </p>
        </div>*/}
      </div>
      )
  }
  componentDidMount(){
    this.props.actions.getDailyMarket_index({ symbol: config.CURRENCY})
      .fail( ({msg}) => {
        Toast.error(msg || '获取行情数据失败', 5000);
      });
  }

}

function mapStateToProps(state){
  return state.PageIndexData;
}

function mapDispatchToProps(dispatch){
  return {
    actions:bindActionCreators({
      ...IndexActions,
    },dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);