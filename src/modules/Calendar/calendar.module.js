/**
 * @ngdoc module
 * @name resdesk.calendar
 * @requires ui.router
 * @requires resdesk.config
 * @requires resdesk.helper
 * @requires resdesk.user
 * @requires resdesk.modal
 * @requires resdesk.toast
 * @description
 * ResDesk authentication module
 */
var calendarModule = angular.module('resdesk.calendar', ['ui.router',
                                                         'resdesk.config',
                                                         'resdesk.helper',
                                                         'resdesk.user',
                                                         'resdesk.modal',
                                                         'resdesk.toast']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.calendar
 * @author Brandon Groff
 */
calendarModule.path = './src/modules/Calendar/';

/**
 * @memberof resdesk.calendar
 * @ngdoc config
 * @name CalendarConfig
 * @param {provider} $stateProvider Angular ui-router config service
 * @description 
 *   Configures Calendar routes
 *   
 *   Routes: 
 *    - Calendar
 *      - contains only Calendar sub-navigation, redirects to Calendar.User
 *   
 *   Calendar Sub-Routes:
 *    - Calendar.User
 *    - Calendar.RaRhd
 *    - Calendar.Desk
 *    - Calendar.Admin
 *      - requires admin user status
 * 
 * @example 
 * 
 * $state.go('Calendar.User');
 * 
 * -- OR --
 * 
 * $state.go('Calendar');
 *  - Will redirect to Calendar.User
 * 
 */
calendarModule.config(function ($stateProvider) {

  $stateProvider.state('Calendar', {
      url: "/calendar",
      templateUrl: calendarModule.path + "calendar.nav.html",
      controller: 'CalendarController',
      redirectTo: 'Calendar.User',
      data: {
        name: "Calendar",
        icon: "event",
        sref: "Calendar",
        requiresAdmin: false,
        friendlyName: 'Calendar',
        order: 1
      }

    })
    .state('Calendar.User', {
      parent: 'Calendar',
      url: "/me",
      templateUrl: calendarModule.path + "controllers/calendar.user.html",
      controller: 'CalendarUserController',
      data: {
        requiresAdmin: false,
        friendlyName: 'Calendar | Me'
      }
    })
    .state('Calendar.RaRhd', {
      parent: 'Calendar',
      url: "/ra-rhd",
      templateUrl: calendarModule.path + "controllers/calendar.rha.html",
      controller: 'CalendarRaRhdController',
      data: {
        requiresAdmin: false,
        friendlyName: 'Calendar | RA/RHD'
      }
    })
    .state('Calendar.Desk', {
      parent: 'Calendar',
      url: "/desk",
      templateUrl: calendarModule.path + "controllers/calendar.staff.html",
      controller: 'CalendarDeskStaffController',
      data: {
        requiresAdmin: false,
        friendlyName: 'Calendar | Desk Staff'
      }
    })
    .state('Calendar.Admin', {
      parent: 'Calendar',
      url: "/admin",
      templateUrl: calendarModule.path + "controllers/calendar.admin.html",
      controller: 'CalendarAdminController',
      data: {
        requiresAdmin: true,
        friendlyName: 'Calendar | Admin'
      }
    });

});