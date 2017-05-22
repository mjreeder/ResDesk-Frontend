/**
 * @memberof resdesk.cashlog
 * @ngdoc controller
 * @name CashLogRefundModal
 * @description Controller for Refund modal.
 * @param {service} $scope      Angular service
 * @param {service} $MaterialModalClose      Modal prodived service for closure
 * @param {factory} CashLogAPI  factory of cashlog API endpoint functions
 * @param {service} $MaterialToast Toast notification service from ResDesk.toast
 * @author Brandon Groff
 */
cashlogModule.controller('CashLogRefundModal', function ($scope, $MaterialModalClose, CashLogAPI, $MaterialToast) {
  
  /**
   * this modal as jQuery instance
   * @type {object}
   * @memberof CashLogRefundModal
   * @author Brandon Groff
   */
  var thisModal = $('#material-modal');

  /**
   * Called by materialize jQuery callback on modal appearance
   * @memberof CashLogRefundModal
   * @author Brandon Groff
   */
  var onLoad = function () {
    //set the default radio
    $scope.newItem = {
      type: "Laundry"
    };
    $scope.$digest();
  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @memberof CashLogRefundModal
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.createdItem;
  };


  /**
   * Close the modal
   * @memberof CashLogRefundModal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here
    thisModal.modal('close');
  };

  /**
   * Submit the form
   * @memberof CashLogRefundModal
   * @author Brandon Groff
   */
  $scope.submit = function () {
    CashLogAPI.newRefund($scope.newItem)
      .then(function (response) {
        $MaterialToast.showToast(response.data.description);
        $scope.close();
      }).catch(function (error) {
        console.error(error);
        if (error.data) {
          $MaterialToast.showError(error.data.msg);
        } else {
          $MaterialToast.showError("An error occurred creating the refund");
        }
      });

  };

  /**
   * Callback function for directory autocomplete
   * @memberof CashLogRefundModal
   * @author Brandon Groff
   * @param {Object} selectedResident the autocomplete selected resident
   */
  $scope.selectResident = function (selectedResident) {
    $scope.newItem.resident = selectedResident;
  };



  /* Modal Initilization Block. DO NOT TOUCH */


  var init = function () {
    thisModal.modal({
      dismissable: true,
      opacity: .5,
      ready: function (modal, trigger) {
        onLoad();
      },
      complete: function (modal, trigger) {
        $MaterialModalClose(onComplete());
      }
    });

    thisModal.modal('open');
  };

  init();

  /* End Init Block */


});
