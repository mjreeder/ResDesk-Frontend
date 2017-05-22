/**
 * @memberof resdesk.lockout
 * @ngdoc controller
 * @name LockoutDetailsModal
 * @description Modal controller for viewing details about a person's lockout history
 * @param {service} $scope                Angular serivice
 * @param {factory} $MaterialModalClose   Modal service from ResDesk.modal, used to close this modal
 * @param {factory} LockoutsAPI           Lockout API factory
 * @param {service} $MaterialToast        Toast service from ResDesk.toast, for displaying notifications
 * @author Brandon Groff
 */
lockoutModule.controller('LockoutDetailsModal', function ($scope, $MaterialModalClose, LockoutsAPI, $MaterialToast, $user) {
  
  /**
   * @private
   * @type {object}
   * @memberof LockoutDetailsModal
   * @description 
   *  this modal jQuery element
   */
  var thisModal = $('#material-modal');

  /**
   * @type {array}
   * @memberof LockoutDetailsModal
   * @description 
   *  the lockout list
   */
  $scope.lockouts = [];
  
  /**
   * @type {object}
   * @memberof LockoutDetailsModal
   * @description 
   *  the app $user, to make $user service available to view
   */
  $scope.$user = $user;
  
  /**
   * @type {boolean}
   * @memberof LockoutDetailsModal
   * @description 
   *  is a request loading, shows a loading indicator when true
   */
  $scope.loading = false;

  /**
   * Called by materialize jQuery callback on modal appearance.
   * Loads the lockout history for the passed in user
   * @private
   * @memberOf LockoutDetailsModal
   * @author Brandon Groff
   */
  var onLoad = function () {
    $scope.loading = true;
    LockoutsAPI.getByUser($scope.givenData.bsuid.value)
      .then(function (response) {
        $scope.lockouts = response.data.data;
      }).catch(function (error) {
        var message = error.data.status + ": " + error.data.message;
        $MaterialToast.showToast(message, {
          notificationLevel: 'error'
        });
        $scope.close();
      }).finally(function () {
        $scope.loading = false;
      });
  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @private
   * @memberOf LockoutDetailsModal
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.createdItem;
  };


  /**
   * Close the modal
   * @memberOf LockoutDetailsModal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here
    thisModal.modal('close');
  };

  
  /**
   * Admin $user only, delete the passed lockout
   * @author Brandon Groff
   * @param {object} lockout a lockout row
   */
  $scope.delete = function (lockout) {
    $scope.loading = true;
    LockoutsAPI.delete(lockout.id)
      .then(function (response) {
        $MaterialToast.showToast(response.data.description);
        var removeIndex = $scope.lockouts.indexOf(lockout);
        $scope.lockouts.splice(removeIndex, 1);
      }).catch(function (error) {
        var message = error.data.status + ": " + error.data.message;
        $MaterialToast.showToast(message, {
          notificationLevel: 'error'
        });
      }).finally(function () {
        $scope.loading = false;
      });
  };


  /* Modal Initilization Block. DO NOT TOUCH */

  /**
   * Generic Modal initialization function
   * @private
   * @memberof LockoutDetailsModal
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