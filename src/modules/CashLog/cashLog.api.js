/**
 * @memberof resdesk.cashlog
 * @ngdoc factory
 * @name CashLogAPI
 * @param {service} $http     Angular service
 * @param {object} AppConfig  ResDesk Application config/settings
 * @param {constant} CashLogMaterialTable  CashLog static objects for MaterialTable usage
 * @param {service} $user ResDesk user service
 * @param {factory} Student ResDesk Student factory implementation of Student object
 * @description 
 *   Factory for ResDesk CashLog related requests
 */
cashlogModule.factory('CashLogAPI', function ($http, AppConfig, CashLogMaterialTable, $user, Student) {

  var factory = {};

  /**
   * The base url for auth network requests
   * @private
   * @type {string}
   * @memberof CashLogAPI
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/calendar'
   */
  var baseUrl = AppConfig.baseUrl + '/cashlog/';

  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10014/cashlog';
  }

  /**
   * Parse API data to Material Table format
   * @func parseForTable
   * @author Brandon Groff
   * @memberOf CashLogAPI
   * @param   {object|object[]}    data the data to parse
   * @param {boolean} totalView = true  parse for Total View or History view
   * @returns {object} an object formatted for the Material Table
   */
  factory.parseForTable = function (data, totalView = true) {
    if (typeof (data) != 'object' && !Array.isArray(data)) {
      console.error('data must be an object or Array of objects');
      return;
    }

    /**
     * Calculate and append the sum to a cash log entry
     * @private
     * @memberof CashLogAPI.parseForTable
     * @author Brandon Groff
     * @param   {object} temp an already parsed entry
     * @returns {object} the modified entry with a total sum
     */
    var appendSum = function (temp) {
      var sum = 0;
      for (var key in temp) {
        if (temp.hasOwnProperty(key)) {
          var field = temp[key];
          if (field.format == 'currency: $' && key != 'total') {
            sum += field.value;
          } else if (key == 'stamps') {
            sum += (field.value * CashLogMaterialTable.getStampPrice())
          }
        }
      }
      temp.total.value = Math.round(sum * 100) / 100;
      return temp;
    }

    if (Array.isArray(data)) {

      var parsed = {
        headers: CashLogMaterialTable.getHeaders(),
        data: [],
        defaultCash: CashLogMaterialTable.getDefaultCash()
      };
      data.forEach(function (entry) {

        var temp = CashLogMaterialTable.getTotalDataTemplate();
        temp.time.value = moment(entry.createdAt).format('LT');
        if (!totalView) {
          temp = CashLogMaterialTable.getHistoryDataTemplate();
          temp.time.value = moment(entry.createdAt).format('lll');
        }
        
        temp.cash.value = entry.cash;
        temp.quarters.value = entry.quarters;
        temp.dimes.value = entry.dimes;
        temp.nickels.value = entry.nickels;
        temp.pennies.value = entry.pennies;
        temp.found.value = entry.found;
        temp.stamps.value = entry.stamps;
        temp.postage.value = entry.postageDue;
        temp.laundry.value = entry.laundryRefunds;
        temp.vending.value = entry.vendingRefunds;
        
        temp.signer.value = entry.createdBy ? new Student(entry.createdBy):null;

        parsed.data.push(appendSum(temp));
      });

      return parsed;

    } else {

      var entry = angular.copy(data);

      var temp = CashLogMaterialTable.getTotalDataTemplate();
      temp.time.value = moment(entry.createdAt).format('LT');
      if (!totalView) {
        temp = CashLogMaterialTable.getHistoryDataTemplate();
        temp.time.value = moment(entry.createdAt).format('lll');
      }
      temp.cash.value = entry.cash;
      temp.quarters.value = entry.quarters;
      temp.dimes.value = entry.dimes;
      temp.nickels.value = entry.nickels;
      temp.pennies.value = entry.pennies;
      temp.found.value = entry.found;
      temp.stamps.value = entry.stamps;
      temp.postage.value = entry.postageDue;
      temp.laundry.value = entry.laundryRefunds;
      temp.vending.value = entry.vendingRefunds;
      temp.signer.value = entry.createdBy ? new Student(entry.createdBy):null;

      return appendSum(temp);
    }
  };
  
  /**
   * Build message for Email API
   * @memberof CashLogAPI
   * @func buildRefundEmail
   * @author Brandon Groff
   * @param   {number} amount the amount owed
   * @returns {string} the Email message body
   */
  factory.buildRefundEmail = function(amount) {
    var message = "This is a generated notification to inform you that a Postage repayment of $" + amount +
        " is due at the " + $user.getUserInfo().currentHall + " front desk.\n";

    message += "\n\n We ask that you please repay this at your earliest convenience. Until you have done so, you will be unable to pick up packages.";

    message += "\n\n Thank you!";

    return message;
  }


  /**
   * Get the CashLog for last 24 hours. uses API endpoint `GET: /cashlog/recent`.
   * @func recent
   * @memberof CashLogAPI
   * @author Brandon Groff
   * @param   {string|null} date = null a date to get the cashlog for. Default is last 24 hours
   * @returns {Promise} $http Promise
   */
  factory.recent = function (date = null) {
    var url = baseUrl + '/recent';

    if (date != null) {
      url + '?date=' + date;
    }

    return $http({
      method: 'GET',
      url: url
    });
  };


  /**
   * Get the CashLog History. uses API endpoint `GET: /cashlog`.
   * @func history
   * @memberof CashLogAPI
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.history = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

  /**
   * Get the last Cash log entry. uses API endpoint `GET: /cashlog/last`.
   * @func getLastEntry
   * @memberof CashLogAPI
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.getLastEntry = function () {
    return $http({
      method: 'GET',
      url: baseUrl + '/last'
    });
  };

  /**
   * Create a new cash log entry. uses API endpoint `POST: /cashlog`.
   * @func create
   * @memberof CashLogAPI
   * @author Brandon Groff
   * @param {object}  data the new entry data
   * @returns {Promise} $http Promise
   */
  factory.create = function (data) {
    if (!data) {
      console.error('Missing required: data');
      return;
    }

    return $http({
      method: 'POST',
      url: baseUrl,
      data: data
    });
  };

  /**
   * Create a new laundry refund. uses API endpoint `POST: /cashlog/refund`.
   * @func newRefund
   * @author Brandon Groff
   * @memberof CashLogAPI
   * @param   {object} data   the refund data
   * @returns {Promise} $http Promise
   */
  factory.newRefund = function (data) {
    if (!data) {
      console.error('Missing required data');
      return;
    }

    var postData = {
      amount: data.amount,
      student: data.resident.exportToObject()
    };
    if (data.type == 'Laundry') {
      postData.machine = data.machine;
      postData.description = data.description;
      postData.respondingRA = data.respondingRA.exportToObject()
    }

    return $http({
      method: 'POST',
      url: baseUrl + '/refund',
      data: {
        type: data.type,
        data: postData
      }
    });
  };

  return factory;
});
