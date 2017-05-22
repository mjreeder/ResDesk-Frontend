/**
 * @memberof resdesk.cashlog
 * @ngdoc controller
 * @name CashLogTotalController
 * @description Child Controller for CashLog. Controls the last 24 hours cash log.
 * @param {service} $scope      Angular service
 * @param {factory} CashLogAPI  factory of cashlog API endpoint functions
 * @param {factory} Helper      Helper function factory from ResDesk.Helper
 * @param {service} $MaterialModal Modal service from ResDesk.modal
 * @param {service} $MaterialToast Toast notification service from ResDesk.toast
 * @author Brandon Groff
 */
cashlogModule.controller('CashLogTotalController', function ($scope, CashLogAPI, Helper, $MaterialModal, $MaterialToast) {

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
   * @memberof CashLogTotalController
   * @author Brandon Groff
   */
  $scope.loading = false;

  /**
   * Initialization function, loads recent CashLog data
   * @memberof CashLogTotalController
   * @author Brandon Groff
   */
  var init = function () {
    $scope.loading = true;
    CashLogAPI.recent()
      .then(function (response) {
        $scope.tableData = CashLogAPI.parseForTable(response.data.data);
      }).catch(function (error) {
        console.error(error);
        if (error.data) {
          $MaterialToast.showError(error.data.msg);
        } else {
          $MaterialToast.showError("An error occurred loading the Cash Log");
        }
      }).finally(function () {
        $scope.loading = false;
      });
  };
  init();


  /**
   * Provide a custom ngClass filter to the UI, adopted from Helper factory
   * @memberof CashLogTotalController
   * @param {*} key an object key, usually a string
   * @param {*} value the object keys matching value, usually a string or Number
   * @return {*} the filtered list (usually an array, but maybe an object)
   */
  $scope.ngClassFilter = function (key, value) {
    return Helper.CashLog.ngClassFilter(key, value, $scope.tableData.defaultCash);
  };

  /**
   * function to open the cashLog.create modal
   * @memberof CashLogTotalController
   * @type {function}
   * @author Brandon Groff
   */
  $scope.update = function () {
    //TODO: Change template and controller
    $MaterialModal.showModal({
      templateUrl: cashlogModule.path + "modals/cashLog.create.html",
      controller: "CashLogCreateModal"
    }).then(function (modal) {
      modal.close.then(function (result) {
        $scope.modalResult = result;
        //reload
        init();
      });
    });

  };

  /**
   * UI available function to open the cashLog.refund modal
   * @memberof CashLogTotalController
   * @type {function}
   * @author Brandon Groff
   */
  $scope.refund = function () {

    //TODO: Change template and controller
    $MaterialModal.showModal({
      templateUrl: cashlogModule.path + "modals/cashLog.refund.html",
      controller: "CashLogRefundModal"
    }).then(function (modal) {
      modal.close.then(function (result) {
        $scope.modalResult = result;
        //reload
        init();
      });
    });

  };

  /**
   * UI available function to open the cashLog.postage modal
   * @memberof CashLogTotalController
   * @type {function}
   * @author Brandon Groff
   */
  $scope.postage = function () {

    $MaterialModal.showModal({
      templateUrl: cashlogModule.path + "modals/cashLog.postage.html",
      controller: "CashLogPostageModal"
    }).then(function (modal) {
      modal.close.then(function (result) {
        $scope.modalResult = result;
        //reload
        init();
      });
    });

  };

  /**
   * Row click action for Material Table, shows the signer of the clicked cash log entry
   * @memberof CashLogTotalController
   * @author Brandon Groff
   * @param {object} row a Material Table row object
   */
  $scope.rowClick = function (row) {
    if (row.signer) {
      $MaterialToast.showToast('Entry at ' + row.time.value + ' signed by ' + row.signer.value.name);
    }
  };

});
