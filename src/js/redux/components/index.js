import React, {Component} from 'react';
import { Button }  from 'semantic-ui-react';

export default class IndexPage extends Component{
  render(){
    return (
      <div>
        <div className="fl-block">
          <p className="fl-hd">操作更简单 资金更安全</p>
          <p style={{marginTop: '10px'}}>傻瓜式操作，五种体系保安全</p>
          <Button style={{marginTop: '20px'}} className="default-btn">立即注册</Button>
        </div>
        <div className="fl-block reverse-fl-block">
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
          <p style={{marginTop: '20px', width: '90%', lineHeight: '25px'}}>飞链成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业，飞链成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业，飞链成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业飞链成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业飞链成立于2018年4月，是一家面向全球的专业数字货币交易服务商，
          核心团队来自全球知名企业
          </p>
        </div>
      </div>
      )
  }
  componentDidMount(){
    /*if(this.socket){
      this.socket.close();
    }
    if(window.myChart){
      window.myChart.clear();
      window.myChart.dispose();
    }
    if(window._get_xdata_timer){
      debugger
      clearInterval(window._get_xdata_timer);

    }*/
  }

}