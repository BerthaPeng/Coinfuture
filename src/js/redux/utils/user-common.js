const crypto = require('crypto');

function telValidator(tel){
  return /^((13[0-9])|(14[5,7,9])|(15[^4,\D])|(17[0,1,3,5-8])|(18[0-9]))\d{8}$/.test(tel)
}

function passwordValidator(pwd){
  return /^(?![\\d]+$)(?![a-zA-Z]+$)(?![^\\da-zA-Z]+$).{8,20}$/.test(pwd)
}

/*function encodePwdSync(pwd, mobile){
  return md5(md5(pwd) + mobile)
}*/

function encodePwdSync(pwd, mobile){
  var encryptPwd = crypto.pbkdf2Sync(pwd, mobile, 10000, 16, 'sha1');
  return encryptPwd.toString('hex');
}

export default {
   telValidator,
   passwordValidator,
   encodePwdSync,
}