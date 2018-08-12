export default {  
  /*title: { //标题
          text: '上证指数',
          left: 0
        },*/
    
  tooltip: { //提示框
          trigger: 'axis', //触发类型：坐标轴触发
          axisPointer: { //坐标轴指示器配置项 
                      type: 'cross' //指示器类型，十字准星
          }  
  },
  toolbox: {
          show : true,
          feature : {
                  mark : {show: true},
                  dataZoom : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore : {show: true},
                  saveAsImage : {show: true}
          }
  },
  legend: { //图例控件
        //图例内容数组，数组项通常为{string}，每一项代表一个系列的name，默认布局到达边缘会自动分行（列），传入空字符串''可实现手动分行（列）。 
        //使用根据该值索引series中同名系列所用的图表类型和itemStyle，如果索引不到，该item将默认为没启用状态。
        x: 'left',
        padding: [10, 0, 10, 40],
        data: ['K线', 'MA5', 'MA10', 'MA30'],
    /*  data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']*/
  },
  grid: { //直角坐标系内绘图网格
      x: 20, //grid组件离容器左侧的距离
      y: 40,
      x2: 60,
      y2: 30,
       //backgroundColor:'#ccc'  
  },
  xAxis: {  
    type: 'category', //坐标轴类型，类目轴
    data: [], //！！！！后面传入
     //scale: true, //只在数字轴中有效
    boundaryGap: false, //刻度作为分割线，标签和数据点会在两个刻度上
    axisLine: {
      onZero: false,
      lineStyle: {
        color: '#606266',
      }
    },
    axisLabel: {
      interval: 4,
    },
    splitLine: {
      show: false
    }, //是否显示坐标轴轴线
         //splitNumber: 20, //坐标轴的分割段数，预估值，在类目轴中无效
    min: 'dataMin', //特殊值，数轴上的最小值作为最小刻度
    max: 'dataMax' //特殊值，数轴上的最大值作为最大刻度
      
  },
  yAxis: {
    position: 'right',
    splitLine: {
      show: false
    },
    scale: true, //坐标刻度不强制包含零刻度
    splitArea: {  
      show: false //显示分割区域   
    },
    axisLine: {
      lineStyle: {
        color: '#606266',
      } 
    }
  },
  dataZoom: [{  //用于区域缩放  
      filterMode: 'filter', //当前数据窗口外的数据被过滤掉来达到数据窗口缩放的效果 默认值filter
      type: 'inside', //内置型数据区域缩放组件
      start: 50, //数据窗口范围的起始百分比
      end: 100 //数据窗口范围的结束百分比
    },
    {   
      show: true,
      type: 'slider', //滑动条型数据区域缩放组件
      y: '90%',
      start: 50,
      end: 100  
  }],
  series: [{ //图表类型
    name: 'K线',
    type: 'candlestick', //K线图
    data: [], //y轴对应的数据  后期传入
    itemStyle: {
      normal: {
        color: '#ae4e54', //阳线颜色
        color0: '#589065', //阴线颜色
        borderColor: '#ae4e54',
        borderColor0: '#589065',
        lineStyle: {
          width: 2,
          color: '#ae4e54',
          color0: '#589065', //阴线边框颜色
        }
      }
    },
  ////////////////////////图标标注/////////////////////////////
    markPoint: { //图表标注
      label: { //标注的文本   
      normal: { //默认不显示标注
        show: true,
        //position:['20%','30%'],
        symbol: 'star',
        formatter: function(param) { //标签内容控制器
          return param != null ? Math.round(param.value) : '';    
        }    
      }   
    },
    /*data:[ //标注的数据数组
      {    
        name: 'XX标点',
        coord: ['2013/5/31', 2300], //指定数据的坐标位置
        value: 2300,
        itemStyle: { //图形样式      
          normal: {
            color: 'rgb(41,60,85)'
          }    
        }    
      },{    
        name: 'highest value',
        type: 'max', //最大值
        valueDim: 'highest' //在highest维度上的最大值 最高价
              
      },{    
        name: 'lowest value',
        type: 'min',
        valueDim: 'lowest' //最低价    
      },{    
        name: 'average value on close',
        type: 'average',
        valueDim: 'close' //收盘价
      }
    ],*/
    /*tooltip: { //提示框  
      formatter: function(param) {    
        return param.name + '<br>' + (param.data.coord || '');    
      }   
    }*/   
    },
      /////////////////////////////////图标标线///////////////////////////
    /*markLine: {   
      symbol: ['none', 'none'], //标线两端的标记类型
      data: [    
        [
          {     
            name: 'from lowest to highest',
            type: 'min', //设置该标线为最小值的线
            valueDim: 'lowest', //指定在哪个维度上的最小值
            symbol: 'circle',
            symbolSize: 10, //起点标记的大小
            label: { //normal默认，emphasis高亮    
              normal: {
                show: false
              }, //不显示标签
              emphasis: {
                show: false
              } //不显示标签    
            }    
          },
          {     
            type: 'max',
            valueDim: 'highest',
            symbol: 'circle',
            symbolSize: 10,
            label: {     
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }     
            }    
          }
        ],
        {    
          name: 'min line on close',
          type: 'min',
          valueDim: 'close'    
        },{    
          name: 'max line on close',
          type: 'max',
          valueDim: 'close'    
        }   
      ]    
    }  */ 
  },
  { //MA5 5天内的收盘价之和/5
         
    name: 'MA5',
       type: 'line',
       data: [],
       smooth: true,
       lineStyle: {   
      normal: {
        opacity: 0.5
      }   
    }  
  },
  {   
    name: 'MA10',
    type: 'line',
    data: [],
    smooth: true,
    lineStyle: { //标线的样式
    normal: {
        opacity: 0.5
      }   
    }  
  },
  {   
    name: 'MA30',
    type: 'line',
    data: [],
    smooth: true,
    lineStyle: {   
      normal: {
        opacity: 0.5
      }   
    }  
  },   
  ] 
};