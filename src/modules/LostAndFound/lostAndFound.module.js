/**
 * @ngdoc module
 * @name resdesk.lostandfound
 * @requires resdesk.config
 * @requires resdesk.helper
 * @requires resdesk.modal
 * @requires resdesk.directory
 * @requires resdesk.toast
 * @requires resdesk.email
 * @requires resdesk.user
 * @description
 * Module containing lost and found related services, controllers, factories
 */
var lostandfoundModule = angular.module('resdesk.lostandfound', ['resdesk.config', 'resdesk.helper', 'resdesk.email', 'resdesk.user', 'resdesk.directory', 'resdesk.toast', 'resdesk.modal']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.lostandfound
 * @author Brandon Groff
 */
lostandfoundModule.path = './src/modules/LostAndFound/';

/**
 * @memberof resdesk.lostandfound
 * @ngdoc config
 * @name LostAndFoundConfig
 * @param {provider} $stateProvider Angular ui-router config service
 * @description 
 *   Configures Lost & Found routes
 *   
 *   Routes: 
 *    - LostFound
 * 
 * @example 
 * 
 * $state.go('LostFound');
 * 
 * 
 */
lostandfoundModule.config(function ($stateProvider) {

  $stateProvider
    .state('LostFound', {
      url: "/lost-and-found",
      templateUrl: lostandfoundModule.path + "lostAndFound.home.html",
      controller: 'LostAndFoundController',
      data: {
        name: "Lost & Found",
        icon: "import_export",
        sref: "LostFound",
        requiresAdmin: false,
        friendlyName: 'Lost & Found',
        order: 6
      }
    });

});