/**
 * @memberof resdesk.cashlog
 * @ngdoc controller
 * @name CashLogCreateModal
 * @description Controller for Create/update modal.
 * @param {service} $scope      Angular service
 * @param {service} $MaterialModalClose      Modal prodived service for closure
 * @param {factory} CashLogAPI  factory of cashlog API endpoint functions
 * @param {service} $MaterialToast Toast notification service from ResDesk.toast
 * @param {constant} CashLogMaterialTable Static usage objects for CashLog
 * @author Brandon Groff
 */
cashlogModule.controller('CashLogCreateModal', function ($scope, $MaterialModalClose, CashLogAPI, $MaterialToast, CashLogMaterialTable) {
  
  /**
   * this modal as jQuery instance
   * @type {object}
   * @memberof CashLogCreateModal
   * @author Brandon Groff
   */
  var thisModal = $('#material-modal');
  
  /**
   * Called by materialize jQuery callback on modal appearance
   * @memberof CashLogCreateModal
   * @author Brandon Groff
   */
  var onLoad = function () {
    CashLogAPI.getLastEntry()
      .then(function (response) {
        //Prefill the fields
        var last = response.data.data;
        $scope.newItem = last;
      }).catch(function (error) {
        console.error(error);
        if (error.data) {
          $MaterialToast.showError(error.data.msg);
        } else {
          $MaterialToast.showError("An error occurred loading the last entry");
        }
      });
  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @memberof CashLogCreateModal
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.createdItem;
  };


  /**
   * Close the modal
   * @memberof CashLogCreateModal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here
    thisModal.modal('close');
  };

  /**
   * Submit the form
   * @memberof CashLogCreateModal
   * @author Brandon Groff
   */
  $scope.submit = function () {
    CashLogAPI.create($scope.newItem)
      .then(function (response) {
        $scope.createdItem = response.data.data;
        $MaterialToast.showToast(response.data.description);
        $scope.close();
      }).catch(function (error) {
        console.error(error);
        if (error.data) {
          $MaterialToast.showError(error.data.msg);
        } else {
          $MaterialToast.showError("An error occurred loading the last entry");
        }
      });
//    $scope.close();
  };

  /**
   * Callback function for directory autocomplete
   * @memberof CashLogCreateModal
   * @author Brandon Groff
   * @param {Object} selectedResident the autocomplete selected resident
   */
  $scope.selectResident = function (selectedResident) {
    $scope.resident = selectedResident;
  };

  /**
   * Calculate the total cost of all inputs
   * @memberof CashLogCreateModal
   * @author Brandon Groff
   * @returns {number} the cash total
   */
  $scope.calculateTotal = function () {
    var sum = 0;
    for (var key in $scope.newItem) {
      var value = $scope.newItem[key];
      if (typeof(value) != 'number'){
        continue;
      }
      
      if (key == "stamps") {
        sum += (value * CashLogMaterialTable.getStampPrice())
        continue;
      }
      sum += value;
    }
    return sum;
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
