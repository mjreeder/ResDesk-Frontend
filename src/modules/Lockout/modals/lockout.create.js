/**
 * @memberof resdesk.lockout
 * @ngdoc controller
 * @name LockoutCreateModal
 * @description Modal controller for creating a new lockout
 * @param {service} $scope                Angular serivice
 * @param {factory} $MaterialModalClose   Modal service from ResDesk.modal, used to close this modal
 * @param {factory} LockoutsAPI           Lockout API factory
 * @param {service} $MaterialToast        Toast service from ResDesk.toast, for displaying notifications
 * @author Brandon Groff
 */
lockoutModule.controller('LockoutCreateModal', function ($scope, $MaterialModalClose, LockoutsAPI, $MaterialToast) {
  
  /**
   * @private
   * @type {object}
   * @memberof LockoutCreateModal
   * @description 
   *  this modal jQuery element
   */
  var thisModal = $('#material-modal');



  /**
   * Called by materialize jQuery callback on modal appearance
   * @private
   * @memberOf LockoutCreateModal
   * @author Brandon Groff
   */
  var onLoad = function () {
    
  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @private
   * @memberOf LockoutCreateModal
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.createdItem;
  };


  /**
   * Close the modal
   * @memberOf LockoutCreateModal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here
    thisModal.modal('close');
  };

  /**
   * Submit the form
   * @memberOf LockoutCreateModal
   * @author Brandon Groff
   */
  $scope.submit = function () {

    LockoutsAPI.create($scope.resident)
      .then(function (response) {

        if (response.status != 200) {
          var message = response.status + ": " + response.data.message;
          $MaterialToast.showToast(message, {
            notificationLevel: 'error' 
          });
          return;
        }
        
        $scope.createdItem = response.data.data;
        $MaterialToast.showToast(response.data.description);
        $scope.close();
      }).catch(function (error) {
        
        var message = error.data.status + ": " + error.data.message;
        $MaterialToast.showToast(message, {
          notificationLevel: 'error' 
        });
      });

  };

  /**
   * Callback function for directory autocomplete
   * @memberOf LockoutCreateModal
   * @author Brandon Groff
   * @param {Object} selectedResident the autocomplete selected resident
   */
  $scope.selectResident = function (selectedResident) {
    $scope.resident = selectedResident;
  };



  /* Modal Initilization Block. DO NOT TOUCH */

  /**
   * Generic Modal initialization function
   * @private
   * @memberof LockoutCreateModal
   * @author Brandon Groff
   */
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