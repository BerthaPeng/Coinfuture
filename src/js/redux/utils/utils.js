import Noty from './_noty';
function core_isFunction(arg) {
  return typeof arg === 'function';
}

function core_isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function core_isString(arg) {
  return typeof arg === 'string';
}

function core_isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

function core_isUndefined(arg) {
  return arg === void 0;
}

function core_isNull(arg){
  return typeof arg === 'object' && arg == null;
}

/**
 *
 * 描述：日期格式化（日期格式为2018-03-19T17:01:23.930）
 *   date   date   日期
 *   format string 格式
 *   return string
 *
 * 例子：
 *   dateFormat(new Date(2015,9,27), "yyyy-MM-dd") 返回 "2015-10-27"
 *
 **/
function dateFormatUTC(date, format = 'yyyy-MM-dd') {
  if(date){
    var o = {
      "M+": date.getUTCMonth() + 1,
      "d+": date.getUTCDate(),
      "h+": date.getUTCHours(),
      "m+": date.getUTCMinutes(),
      "s+": date.getUTCSeconds(),
      "q+": Math.floor((date.getUTCMonth() + 3) / 3),
      "S": date.getUTCMilliseconds()
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  }else{
    return "";
  }

}


/**
*
* 描述：日期格式化
*   date   date   日期
*   format string 格式
*   return string
*
* 例子：
*   dateFormat(new Date(2015,9,27), "yyyy-MM-dd") 返回 "2015-10-27"
*
**/
function dateFormat(date, format = 'yyyy-MM-dd') {
  if(date){
    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  }else{
    return "";
  }

}


/**
*
* 描述：日期格式化（日期格式为2018-03-19T17:01:23.930）
*   date   date   日期
*   format string 格式
*   return string
*
* 例子：
*   dateFormat(new Date(2015,9,27), "yyyy-MM-dd") 返回 "2015-10-27"
*
**/
function dateFormatUTC(date, format = 'yyyy-MM-dd') {
  if(date){
    var o = {
      "M+": date.getUTCMonth() + 1,
      "d+": date.getUTCDate(),
      "h+": date.getUTCHours(),
      "m+": date.getUTCMinutes(),
      "s+": date.getUTCSeconds(),
      "q+": Math.floor((date.getUTCMonth() + 3) / 3),
      "S": date.getUTCMilliseconds()
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  }else{
    return "";
  }

}

function core_isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

function each(target, cb) {
  if (target && typeof target === 'object') {
    if (core_isArray(target)) {
      //target.forEach(target, cb);
      for (var i = 0, len = target.length; i < len; i++)
        cb(target[i], i);
    } else {
      for (var a in target)
        cb(target[a], a);
    }
  }
}
function map(target, cb) {
  var res = [];
  each(target, function(n, i) {
    res.push(cb(n, i));
  });
  return res;
}

function getLocaleFromBrowser(target, cb){
  return navigator.language || navigator.userLanguage
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp ),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-',
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
    D = date.getDate() + ' ',
    h = date.getHours().toString(),
    m = date.getMinutes().toString(),
    s = date.getSeconds().toString();
    h = h.length == 1 ? '0' + h + ":" : h + ":";
    m = m.length == 1 ? ('0' + m)  : m ;
    /*s = s.length == 1 ? '0' + s : s;*/
    return h+m;
}

function timestampToDate(timestamp){
  var date = new Date(timestamp),
  Y = date.getFullYear() + '-',
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
  D = date.getDate();
  return M+D;
}

var core = {
  isArray: core_isArray,
  isObject: core_isObject,
  isString: core_isString,
  isFunc: core_isFunction,
  isUndefined: core_isUndefined,
}

export {
  core,
  dateFormatUTC,
  dateFormat,
  map,
  getLocaleFromBrowser,
  timestampToTime,
  timestampToDate,
  Noty
}