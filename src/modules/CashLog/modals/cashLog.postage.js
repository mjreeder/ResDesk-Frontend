/**
 * @memberof resdesk.cashlog
 * @ngdoc controller
 * @name CashLogPostageModal
 * @description Controller for PostageDue modal.
 * @param {service} $scope      Angular service
 * @param {service} $MaterialModalClose      Modal prodived service for closure
 * @param {factory} CashLogAPI  factory of cashlog API endpoint functions
 * @param {service} $MaterialToast Toast notification service from ResDesk.toast
 * @param {factory} EmailAPI ResDesk Email API
 * @author Brandon Groff
 */
cashlogModule.controller('CashLogPostageModal', function ($scope, $MaterialModalClose, CashLogAPI, $MaterialToast, EmailAPI) {
  
  /**
   * this modal as jQuery instance
   * @type {object}
   * @memberof CashLogPostageModal
   * @author Brandon Groff
   */
  var thisModal = $('#material-modal');

  /**
   * the last CashLog entry
   * @type {object|null}
   * @memberof CashLogPostageModal
   * @author Brandon Groff
   */
  var lastEntry = null;
  
  /**
   * is active network request, shows/hides loading indicator
   * @type {boolean}
   * @memberof CashLogPostageModal
   * @author Brandon Groff
   */
  $scope.loading = false;

  /**
   * Called by materialize jQuery callback on modal appearance
   * @memberof CashLogPostageModal
   * @author Brandon Groff
   */
  var onLoad = function () {
    CashLogAPI.getLastEntry()
      .then(function (response) {
        //Prefill the fields
        lastEntry = response.data.data;
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
   * @memberof CashLogPostageModal
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.createdItem;
  };


  /**
   * Close the modal
   * @memberof CashLogPostageModal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here
    thisModal.modal('close');
  };

  /**
   * Submit the form
   * @memberof CashLogPostageModal
   * @author Brandon Groff
   */
  $scope.submit = function () {
    $scope.loading = true;
    var modified = lastEntry;
    if (!modified) {
      modified = {
        cash: 0,
        quarters: 0,
        dimes: 0,
        nickels: 0,
        pennies: 0,
        found: 0,
        postageDue: 0,
        laundryRefunds: 0,
        vendingRefunds: 0
      };
    } else {
      delete modified.id;
      delete modified.createdAt;
      delete modified.createdBy;
      delete modified.updateAt;
    }

    modified.postageDue += $scope.newItem.amount;

    //1: Create the new entry
    CashLogAPI.create(modified)
      .then(function (response) {
        $scope.createdItem = response.data.data;
        $MaterialToast.showToast(response.data.description);

        //2: Email the user about their payment due
        EmailAPI.sendEmails($scope.newItem.resident.email,
          'Postage Repayment Due',
          CashLogAPI.buildRefundEmail($scope.newItem.amount),
          'CashLog').then(function (response) {
          $scope.loading = false;
          $scope.close();
        }, function (inError) {
          console.error(inError);
          if (inError.data) {
            $MaterialToast.showError(inError.data.msg);
          } else {
            $MaterialToast.showError("An error occurred emailing the user about their payment due.");
          }
          $scope.loading = false;
          $scope.close();
        });


      }).catch(function (error) {
        console.error(error);
        if (error.data) {
          $MaterialToast.showError(error.data.msg);
        } else {
          $MaterialToast.showError("An error occurred loading the last entry");
        }
        $scope.loading = false;
      });

  };

  /**
   * Callback function for directory autocomplete
   * @memberof CashLogPostageModal
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
