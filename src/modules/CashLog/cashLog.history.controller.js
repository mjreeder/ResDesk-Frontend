/**
 * @memberof resdesk.cashlog
 * @ngdoc controller
 * @name CashLogHistoryController
 * @param {service} $scope Angular service
 * @param {factory} CashLogAPI ResDesk CashLog API
 * @param {factory} Helper ResDesk Helper factory
 * @param {service} $MaterialToast ResDesk Toast notification service
 * @author Brandon Groff
 * @description
 *    CashLog history view controller
 */
cashlogModule.controller('CashLogHistoryController', function ($scope, CashLogAPI, Helper, $MaterialToast) {

  /**
   * The tableData to show
   * @type {object}
   * @memberof CashLogHistoryController
   * @author Brandon Groff
   */
  $scope.tableData = {};

  /**
   * Network request in progress, show loading indicator
   * @type {boolean}
   * @memberof CashLogHistoryController
   * @author Brandon Groff
   */
  $scope.loading = false;


  /**
   * Initialization function. Loads CashLog history
   * @memberof CashLogHistoryController
   * @author Brandon Groff
   */
  var init = function () {
    $scope.loading = true;
    CashLogAPI.history()
      .then(function (response) {
        $scope.tableData = CashLogAPI.parseForTable(response.data.data, false);
      }).catch(function (error) {
        console.error(error);
        if (error.data) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError('An error occurred loading the Cash Log history.');
        }
      }).finally(function () {
        $scope.loading = false;
      });
  };
  init();

  /**
   * Provide a custom ngClass filter to the UI, adopted from Helper factory
   * @func ngClassFilter
   * @memberof CashLogHistoryController
   * @param {*} key an object key, usually a string
   * @param {*} value the object keys matching value, usually a string or Number
   * @return {*} the filtered list (usually an array, but maybe an object)
   */
  $scope.ngClassFilter = function (key, value) {
    return Helper.CashLog.ngClassFilter(key, value, $scope.tableData.defaultCash);
  };

  //initialize the datetime picker popup selector
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 2 // Creates a dropdown of 15 years to control year
  });

  /**
   * Row click action for Material Table, shows the signer of the clicked cash log entry
   * @memberof CashLogHistoryController
   * @author Brandon Groff
   * @param {object} row a Material Table row object
   */
  $scope.rowClick = function (row) {
    if (row.signer) {
      $MaterialToast.showToast('Entry at ' + row.time.value + ' signed by ' + row.signer.value.name);
    }
  };

});
