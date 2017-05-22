var helperModule = angular.module('resdesk.helper', ['resdesk.config']);


helperModule.path = './src/modules/Helper/';


helperModule.factory('Helper', function (AppConfig) {

  var factory = {};

  factory.CashLog = {};

  /**
   * @func ngClassFilter
   *
   * @desc A custom text-coloring filter function for the CashLog table
   *
   * @param {String} key an object key value
   * @param {Object} field an object
   * @param {Number} expectedTotal the expected cash log sum
   *
   * @returns {String}
   *
   **/
  factory.CashLog.ngClassFilter = function (key, field, expectedTotal) {
    if (key == 'total') {
      if (field.value != expectedTotal) {
        return 'red-text'; //red
      }
      return 'green-text'; //green
    } else {
      if (field.format.indexOf('$') != -1 && field.value < 0) {
        return 'red-text'; //red
      }
      return ''; //default
    }
  };

  /**
   * Serves as a global replacement of console log, to auto disable all when in prod
   * @author Brandon Groff
   */
  factory.log = function () {
    if (AppConfig.dev) {
      console.log(arguments);
    }
  };

  /**
   * Generic bubble sort function for reordering lists
   * @author Brandon Groff
   * @param   {Array} list             any array
   * @param   {string} sortByKey = null Optional: key to sort by if array contains objects
   * @returns {Array} the sorted array
   */
  factory.bubbleSort = function (list, sortByKey = null) {

    var len = list.length;

    if (sortByKey != null) {
      for (var i = len - 1; i >= 0; i--) {
        for (var j = 1; j <= i; j++) {
          if (list[j - 1][sortByKey] > list[j][sortByKey]) {
            var temp = list[j - 1];
            list[j - 1] = list[j];
            list[j] = temp;
          }
        }
      }
    } else {
      for (var i = len - 1; i >= 0; i--) {
        for (var j = 1; j <= i; j++) {
          if (list[j - 1] > list[j]) {
            var temp = list[j - 1];
            list[j - 1] = list[j];
            list[j] = temp;
          }
        }
      }
    }

    return list;
  };
  
  /**
   * Format a url with query parameters
   * @author Brandon Groff
   * @param   {string} url    the request url
   * @param   {object} params an object with keys and values to parameterize
   * @returns {string} the parameterized url
   */
  factory.parameterizeUrl = function(url, params) {
    
    var qStr = '';
    var first = true;
    for (var key in params) {
      var value = params[key];
      if (first) {
        qStr += '?' + key + '=' + value;
        first = false;
      } else {
        qStr += '&' + key + '=' + value;
      }
    }
    
    return url + qStr;
  }

  return factory;
});