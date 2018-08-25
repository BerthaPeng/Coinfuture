import React, { Component } from 'react';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/candlestick';

import ReactEcharts from 'echarts-for-react';

import echartsData from 'config/market-data.js';
import { getXtimeSpan } from 'utils/chart-utils.js';

import optionConfig from 'config/echarts-option-config.js';
import { getEchartsOptions } from 'config/echarts-option.js';

var clone = require('clone');

export default class CandleCharts extends Component{
  constructor(props){
    super(props);
    this.state = {
      linespan: 1,
      XtimeArr: [],
      Kdata: [],  //存储K线图数据

      baseHour:0,
      baseMin: 0,
      baseSecond: 0,

      Xdata: [],
      Ydata: [],
    }
  }
  render() {
    return (
      <div id="main" style={{ width: '100%', height: '390px' }}>
    {/*<ReactEcharts option={this.getOption()} />*/}
    </div>
    );
  }
  componentDidMount(){
    var { Xdata, Ydata } = this.state;
    //设置基础数据
    var now = new Date();
    var nowHour = now.getHours(), nowMin = now.getMinutes(), nowSecond = now.getSeconds();
    this.setState({ baseHour: nowHour, baseSecond: nowSecond, baseMin: nowMin});
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.getInstanceByDom(document.getElementById('main'));
    if(myChart === undefined){
      myChart = echarts.init(document.getElementById('main'));
      window.myChart = myChart;
      window.myChart.clear();
    }else{
      myChart.clear();
      window.myChart = myChart
    }
    var { Kdata } = this.props;
    var toSplitData = clone(Kdata);
    /*this.setState({ Xdata: ['2:17:11'], Ydata: [[4,3,2,1]]})*/
    this.setState({Kdata});
    /*this.getXdata();*/
    /*var data0 = this.splitData(echartsData);*/
    if(toSplitData && toSplitData.length){
      this.setEchartData(toSplitData)
    }
  }
  componentWillReceiveProps(nextProps){
    //线切换时
    if(this.props.line != nextProps.line){
      window.myChart.clear();
    }
    //币切换时
    if(this.props.coin != nextProps.coin){
      window.myChart.clear();
    }
    if(this.props.Kdata != nextProps.Kdata){
      var { Kdata } = nextProps;
      var toSplitData = clone(Kdata);
      this.setState({Kdata});
      this.setEchartData(toSplitData);
      /*if(window.myChart){
        window.myChart.clear();
      }*/
    }
    if(this.props.addKdata != nextProps.addKdata){
      var { Kdata } = this.state;
      if(this.props.isNew){
        Kdata = [...Kdata, nextProps.addKdata];
        Kdata.shift();
        toSplitData=clone([...Kdata, nextProps.addKdata]);
      }else{
        //如果是刻度时间内的则更新,则更新最后一条数据
        Kdata[ Kdata.length - 1 ] = nextProps.addKdata;
        toSplitData=clone(Kdata)
      }
      this.setState({Kdata});
      this.setEchartData(toSplitData);
    }
  }
  //echart图形为非分时图时
  setEchartData(toSplitData){
    //分时图的配置与其他线的配置不同
    var option = getEchartsOptions(this.props.line);
    var data0 = this.splitData(toSplitData);
    console.warn(data0.categoryData || []);
    if(this.props.line == 'timeline'){
      option.xAxis[0].data = data0.categoryData;
      option.xAxis[1].data = data0.categoryData;
      option.series[0].data = data0.lastPrice;
      option.series[1].data = data0.tradeVol;
    }else{
      var data5 = this.calculateMA(data0, 5);
      var data10 = this.calculateMA(data0, 10);
      var data30 = this.calculateMA(data0, 30);
      option.xAxis.data = data0.categoryData || [];
      option.series[0].data = data0.values;
      option.series[1].data = data5;
      option.series[2].data = data10;
      option.series[3].data = data30;
    }
    window.myChart.setOption(option);
  }
  splitData(rawData){
    var categoryData = [], lastPrice = [], tradeVol = [], values = [];
    if(this.props.line == 'timeline'){
      for (var i = 0; i < rawData.length; i++) {
        //splice 返回每组数组中被删除的第一项，即返回数组中被删除的日期
        //alert(rawData[i].splice(0, 1)[0]);
        //categoryData 日期 把返回的日期放到categoryData[]数组中
        categoryData.push(rawData[i].splice(0, 1)[0]);
        tradeVol.push(rawData[i].splice(-1)[0]);
        lastPrice.push( rawData[i][1]);
      }
      return {
        categoryData,
        tradeVol,
        lastPrice
      }
    }else{
      for (var i = 0; i < rawData.length; i++) {
        //splice 返回每组数组中被删除的第一项，即返回数组中被删除的日期
        //alert(rawData[i].splice(0, 1)[0]);
        //categoryData 日期 把返回的日期放到categoryData[]数组中
        categoryData.push(rawData[i].splice(0, 1)[0]);
        //alert(categoryData);
        //数据数组，即数组中除日期外的数据
        // alert(rawData[i]);
        rawData[i].splice(-1); //删除成交量
        values.push(rawData[i])
      }
      return {
        categoryData: categoryData, //数组中的日期 x轴对应的日期
        values: values  //数组中的数据 y轴对应的数据
      };
    }
  }
  splitTimelineData(rawData){
    var categoryData = []; //时间数组，现价数组，成交量数组
    /*for(var i = 0; i < rawData.length; i++ ){
      categoryData.push( rawData[i].splice(0, 1)[0]);
      lastPrice
    }*/
  }
    //计算MA平均线，N日移动平均线=N日收盘价之和/N dayCount要计算的天数(5,10,20,30)
    /*calculateMA(data0, dayCount) {
      var result = [];
      for (var i = 0, len = data0.values.length; i < len; i++) {
        if (i < dayCount) {
         result.push('-');
       //alert(result);
       continue; //结束单次循环，即不输出本次结果
     }
     var sum = 0;
     for (var j = 0; j < dayCount; j++) {
       //收盘价总和
       debugger
       sum += parseFloat(data0.values[i - j][1]);
       //alert(sum);
     }
     result.push(sum / dayCount);
      // alert(result);
    }
    return result;
  }*/
  addData(shift){
    var { baseMin, baseSecond, baseHour } = this.state;
    var str = baseHour+":"+(baseMin + 1) +":"+baseSecond;
    var { Xdata, Ydata } = this.state;
    Xdata.push(str);
    var record = [(Math.random() - 0.4) * 10 + Ydata[Ydata.length - 1][0],
      (Math.random() - 0.4) * 10 + Ydata[Ydata.length - 1][0],
      (Math.random() - 0.4) * 10 + Ydata[Ydata.length - 1][0],
      (Math.random() - 0.4) * 10 + Ydata[Ydata.length - 1][0]]
    Ydata.push(record)
    this.setState({Xdata, Ydata});
  }
  getXdataItem(){
    var { baseMin, baseHour } = this.state;
    baseMin++;
    if(baseMin == 60){
      baseMin == '00'
      baseHour ++
    }
    return baseHour+":"+baseMin;
  }
  getYdataItem(){
    var record = [(Math.random() - 0.4) * 10 + 4,
      (Math.random() - 0.4) * 10 + 4,
      (Math.random() - 0.4) * 10 + 4,
      (Math.random() - 0.4) * 10 + 4
    ]
    return record;
  }
  getXdata(interval){
    var self = this;
    var lastData = this.state.Ydata; //新增数据

    var plusDataParam = [
        [
          0,        // 系列索引
          this.getXdataItem(), // 新增数据
          false,    // 新增数据是否从队列头部插入
          false,    // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
          this.getYdataItem()  // 坐标轴标签
        ]
    ]
    var xdata = [];
    window._get_xdata_timer = setInterval(function () {

          self.addData(true);
          var option = getEchartsOptions(self.props.line);;
          option.xAxis.data = self.state.Xdata;
          option.series[0].data = self.state.Ydata;
          console.warn(option)
          /*debugger*/
          /*self.myChart.clear();*/
          /*self.myChart.addData(plusDataParam);*/
          window.myChart.setOption(option);
    }, 10000);
  }
  //计算MA平均线，N日移动平均线=N日收盘价之和/N  dayCount要计算的天数(5,10,20,30)
  calculateMA(data, dayCount) {
    var result = [];
    for (var i = 0, len = data.values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        //alert(result);
        continue;   //结束单次循环，即不输出本次结果
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        //收盘价总和
        sum += parseFloat(data.values[i - j][1]);
        //alert(sum);
      }
      result.push(sum / dayCount);
     // alert(result);
    }
    return result;
  }
  componentWillUnmount(){
    clearInterval(window._get_xdata_timer);
    /*window.myChart.clear();
    window.myChart.dispose();*/
  }
}