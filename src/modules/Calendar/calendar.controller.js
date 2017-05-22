/**
 * @memberof resdesk.calendar
 * @ngdoc controller
 * @name CalendarController
 * @description Parent Controller for Calendar sub-views. Controls calendar sub-view navigation.
 * @param {service} $scope  Angular service
 * @param {service} $user   ResDesk user service
 * @author Brandon Groff
 */
calendarModule.controller('CalendarController', function ($scope, $user) {
  /**
   * accessor for view to use $user
   * @name $user
   * @type {string}
   * @memberof CalendarController
   * @author Brandon Groff
   */
  $scope.$user = $user;
});