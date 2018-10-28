//重构的请求 处理
import $ from 'jquery';
import req from 'superagent';
import config from 'config/app.config';
import history from 'history_instance';

function Promise(async_task){
  if(typeof async_task == 'function'){
    var $d = $.Deferred();
    async_task($d.resolve, $d.reject);
    return $d;
  }
}

function _end_callback(resolve, reject) {
  return function(err, res) {
    if (err) {
      console.error(err);
      reject('请求失败！');
      return;
    }
    if (res.ok) {
      if(res.body.code != undefined){
        var {code, msg } = res.body;
        if(code === 200 || code === 0){
          resolve(data, msg);
        }else {
          console.error(msg || 'request error');
          reject({msg, code});
        }
      }else{
        var { result : {error_code, error_msg, code, msg }, data } = res.body;
        if(error_code != undefined){
          if (error_code === 200 || error_code === 0) {
            resolve(data, error_msg);
          }else {
            console.error(error_msg || 'request error');
            reject({msg: error_msg, code: error_code});
          }
        }else if(code != undefined){
          if (code === 200 || code === 0) {
            resolve(data);
          }else {
            if(code === 400006){
              sessionStorage.removeItem('_udata');
              sessionStorage.removeItem('_udata_accountid');
              location.reload()
              /*history.push('/login');*/
            }
            console.error(msg || 'request error');
            reject({msg, code});
          }
        }
      }

    } else {
      reject(res.text || 'error');
    }
  };
}

//基本封装
export function get(url, data) {
  var r;
  var p = new Promise(function(resolve, reject) {
    r = req.get(url)
      .query(data)
      .end(_end_callback(resolve, reject));
  });
  p.abort = r.abort.bind(r);
  return p;
}

/*export function post(url, data) {
  var r;
  var p = new Promise(function(resolve, reject) {
    r = req.post(url)
      .send(data)
      .end(_end_callback(resolve, reject));
  });
  p.abort = r.abort.bind(r);
  return p;
}*/


export function post( api_id, params){

  var data ={
        header: {
          token: sessionStorage.getItem("_udata") || "",
          api_id
        },
        data: params
    }
  var r;
  var p = new Promise(function(resolve, reject){
    r = req.post(config.ajax)
      .send(data)
      .end(_end_callback(resolve, reject))
  })
  p.abort = r.abort.bind(r);
  return p;
}

export function getSocketHeader(channel){
  var data = {
    "header": {
      token: "",
      api_id: 101055
    },
    "data": {
      "channel": channel
    }
  };
  return data;
}
//取消成交队列
export function getCancelSocketHeader(channel){
  var data = {
    "header": {
      token: sessionStorage.getItem("_udata") || "",
      api_id: 101056
    },
    "data": {
      "channel": channel
    }
  };
  return data;
}
