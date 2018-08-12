import config from 'config/app.config'

//传入分时获取时间轴
function getXtimeSpan(linespan){
  var { TIMESPANCOUNT, chartXTimespan } = config;
  var now = new Date();
  var nowHour = now.getHours(), nowMin = now.getMinutes();
  var timespan = chartXTimespan[linespan];
  var timeArr = [], i=0, tmpArr;
  while(i<TIMESPANCOUNT){
    var j=0, min=0;
    //第一次计算分钟内的timespan时
    if(i === 0){
      tmpArr = [];//将数组反转后存入
      while((j+1) * timespan < nowMin && i<TIMESPANCOUNT ){
        min = j * timespan;
        if(min === 0){ min = '00'};
        tmpArr.push(nowHour + ":" + min);
        i++;j++;
      }
      timeArr = [...timeArr, ...tmpArr.reverse()];
    }else{
      tmpArr = [];
      while((j+1) * timespan  <= 60 && i<TIMESPANCOUNT ){
        min = j * timespan;
        if(min === 0){ min = '00'};
        tmpArr.push(nowHour + ":"  + min);
        i++;j++;
      }
      timeArr = [...timeArr, ...tmpArr.reverse()];
    }
    nowHour--;
  }
  return timeArr.reverse();
}

export {
  getXtimeSpan
}