var setting =  {
  backgroundColor: '#000000',  
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
                  dataZoom : {show: false},
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
      y2: 65,
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
        color: '#404040',
        width: '1',
      }
    },
    axisLabel: {
      interval: 4,
      textStyle: {
        color: 'hsla(0,0%,100%,.3)'
      }
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
        color: '#404040',
        width: '1'
      } 
    },
    axisLabel: {
      interval: 4,
      textStyle: {
        color: 'hsla(0,0%,100%,.3)',
      }
    },
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
      end: 100,
      borderColor:"#404040"
  }],
  series: [{ //图表类型
    name: 'K线',
    type: 'candlestick', //K线图
    barMaxWidth: 10,
    data: [], //y轴对应的数据  后期传入
    itemStyle: {
      normal: {
        color: '#ee6560', //阳线颜色
        color0: '#4db872', //阴线颜色
        borderColor: '#ee6560',
        borderColor0: '#4db872',
        lineStyle: {
          width: 2,
          color: '#ee6560',
          color0: '#4db872', //阴线边框颜色
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
    },
  },
  { //MA5 5天内的收盘价之和/5
         
    name: 'MA5',
    type: 'line',
    symbol: 'none',  //默认为空心圆
    data: [],
    smooth: true,
    lineStyle: {   
      normal: {
        width: 1,
        opacity: 0.5,
        type: 'solid'
      }   
    }  
  },
  {   
    name: 'MA10',
    type: 'line',
    symbol: 'none',
    data: [],
    smooth: true,
    lineStyle: { //标线的样式
    normal: {
        width: 1,
        opacity: 0.5
      }   
    }  
  },
  {   
    name: 'MA30',
    type: 'line',
    symbol: 'none',
    data: [],
    smooth: true,
    lineStyle: {   
      normal: {
        width: 1,
        opacity: 0.5
      }   
    }  
  },   
  ] 
};

export function getEchartsOptions(type){
  var axisPointer =  {
                link: [{
                    xAxisIndex: [0, 1] //生成大十字轴，控制两个x轴
                }]
            };
  var grid = [{        //图形间距
                x: 20, //grid组件离容器左侧的距离
                y: 60, //grid组件离容器顶部的距离
                x2: 60, //grid组件离容器右侧的距离
                y2: 150, //grid组件离容器底部的距离
            }, {
                x: 20, //grid组件离容器左侧的距离
                y: 280,
                x2: 60,
                y2: 50,
            }];
  var dataZoom = [   //滚动条      控制两条x轴
                   {
                      type: 'inside',
                      top: '95%',
                      xAxisIndex:[0,1],
                      height: 20,
                      start: 20,
                      end: 100
                    } ,
                    {
                      type: 'slider',
                      xAxisIndex:[0,1],
                      start: 20,
                      end: 100
                    }
                ];
  var legend = {    //图表上方的类别显示
                x: 'left',
                show:true,
                data:['现价','成交量']
              };
  var color = [
               '#FF3B33',
               '#53FF53',
               '#B15BFF',
               '#68CFE8',
               '#FFDC35'
               ];
  var calculable = true;
  var xAxis = [{
                type: 'category',
                data: [],
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
            },{
                type: 'category',
                scale: true,
                gridIndex:1,
                data: [] ,
                axisLabel: {show: false}
            }
            ];
  var yAxis =  [
                {
                position: 'right',
                scale: true, //数据居中
                 type : 'value',
                 name : '现价',
                 splitNumber:10,//分行
                  splitLine: { show: false },
                 /*axisLabel : {
                    formatter: '{value}'    //控制输出格式
                 }*/
                 },{
                  position: 'right',
                 scale: true, //数据居中
                     /*splitArea: {
                         show: true
                       },*/
                 gridIndex:1,
                 splitLine: { show: false },
                 splitNumber: 2 ,
                 axisLine: {onZero: false},
                 axisTick: {show: false},
                 splitLine: {show: false},
                 axisLabel: {show: true}
                 }
            ];
  var series =  [    //系列（内容）列表
                  {
                      name:'现价',
                      type:'line',    //折线图表示
                      itemStyle: {normal: {
                        areaStyle: {type: 'default'},
                      }},
                      symbol:'emptycircle',    //设置折线图中表示每个坐标点的符号；emptycircle：空心圆；emptyrect：空心矩形；circle：实心圆；emptydiamond：菱形                        
                      data:[]        //数据值通过Ajax动态获取
                  },
                  {
                      name:'成交量',
                      type:'bar',
                      xAxisIndex:1,
                      yAxisIndex:1,
                      barWidth: 10,
                      itemStyle: {
                      },
                      symbol:'emptyrect',
                      data:[]
                  }
            ];
  return type === 'timeline' ?
    { ...setting, axisPointer, grid, legend, color, calculable, xAxis, yAxis, series}
    :setting;
}