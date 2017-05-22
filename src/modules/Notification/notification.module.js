/**
 * @ngdoc module
 * @name resdesk.notification
 * @requires ui.router
 * @requires resdesk.config
 * @requires resdesk.helper
 * @requires resdesk.toast
 * @description
 *  ResDesk notification management service
 */
var notificationModule = angular.module('resdesk.notification', ['ui.router', 'resdesk.config', 'resdesk.helper', 'resdesk.toast']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.notification
 * @author Brandon Groff
 */
notificationModule.path = './src/modules/Notification/';

/**
 * @memberof resdesk.notification
 * @ngdoc config
 * @name DirectoryConfig
 * @param {service} $stateProvider Angular ui-router config service
 * @description 
 *   Configures application navigable routes.
 *   
 *   Routes: 
 *    - Notifications
 * 
 * @example 
 * 
 * $state.go('Notifications');
 */
notificationModule.config(function($stateProvider) {
  
  $stateProvider
    .state('Notifications', {
      url: "/notifications",
      templateUrl: notificationModule.path + "notification.html",
      controller: 'NotificationsController',
      data: {
        name: "Notifications",
        icon: null,
        sref: "Notifications",
        requiresAdmin: false,
        friendlyName: 'Notifications',
        excludeSidenav: true,
        order: null
      }
    
    });
  
});
