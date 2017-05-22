/**
 * @memberof resdesk
 * @ngdoc controller
 * @name NavController
 * @param {service} $scope Angular service
 * @param {service} $nav ResDesk app nav service
 * @param {service} $user ResDesk user service from resdesk.user
 * @param {service} $state Angular ui-router service
 * @param {factory} Helper Helper factory from resdesk.helper
 * @description 
 *   the Navigation bar's controller
 */
app.controller('NavController', function ($scope, $nav, $user, $state, Helper) {

  /**
   * accessor for $nav service
   * @type {service}
   * @memberOf NavController
   * @author Brandon Groff
   */
  $scope.$nav = $nav;
  
  /**
   * accessor for $user service
   * @type {service}
   * @memberOf NavController
   * @author Brandon Groff
   */
  $scope.$user = $user;
  
  /**
   * accessor for $state service
   * @type {service}
   * @memberOf NavController
   * @author Brandon Groff
   */
  $scope.$state = $state;

});