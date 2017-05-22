/**
 * @memberof resdesk.toast
 * @ngdoc controller
 * @name DefaultToast
 * @description Default controller for a MaterialToast object
 * @param {service} $scope Angular $scope service
 * @param {service} $MaterialToastClose $MaterialToastClose service from $MaterialToast constructor
 * @param {service} $element Angular $element service
 * @param {service} Helper Helper factory from resdesk.Helper
 * @author Brandon Groff
 */
toastModule.controller('DefaultToast', function ($scope, $MaterialToastClose, $element, Helper) {

  /**
   * Called after materialze jQuery callback for modal completion
   * @memberof DefaultToast
   * @private
   * @author Brandon Groff
   */
  var onComplete = function () {
    $scope.onClose();
    $MaterialToastClose();
  };

  /* Modal Initilization Block. DO NOT TOUCH */

  /**
   * Toast initialization function
   * @memberof DefaultToast
   * @private
   * @author Brandon Groff
   */
  var init = function () {
    Materialize.toast($element,
      $scope.showForTime,
      $scope.notificationLevel,
      onComplete);
    };

  init();

  /* End Init Block */

});