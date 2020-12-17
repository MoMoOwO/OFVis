const utils = {}; // 工具类

utils.dateFormate = function dateFormate(strDate) { // 20150101 -> 2015-01-01
  let formate1 = strDate.slice(0, 4) + '-' + strDate.slice(4);
  return formate1.slice(0, 7) + '-' + formate1.slice(7);
}

module.exports = utils;
