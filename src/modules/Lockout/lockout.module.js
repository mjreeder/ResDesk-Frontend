/**
 * @ngdoc module
 * @name resdesk.lockout
 * @requires resdesk.config
 * @requires resdesk.helper
 * @requires resdesk.modal
 * @requires resdesk.directory
 * @requires resdesk.toast
 * @description
 * Module containing lockout related services, controller, factories
 */
var lockoutModule = angular.module('resdesk.lockout', ['resdesk.config', 'resdesk.helper',
                                                      'resdesk.toast', 'resdesk.modal',
                                                      'resdesk.directory', 'resdesk.user']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.lockout
 * @author Brandon Groff
 */
lockoutModule.path = './src/modules/Lockout/';


/**
 * @memberof resdesk.lockout
 * @ngdoc config
 * @name LockoutConfig
 * @param {provider} $stateProvider Angular ui-router config service
 * @description 
 *   Configures Lockout routes
 *   
 *   Routes: 
 *    - Lockouts
 * 
 * @example 
 * 
 * $state.go('Lockouts');
 * 
 * 
 */
lockoutModule.config(function ($stateProvider) {

  $stateProvider
    .state('Lockouts', {
      url: "/lockouts",
      templateUrl: lockoutModule.path + "lockout.home.html",
      controller: 'LockoutsController',
      data: {
        name: "Lockouts",
        icon: "vpn_key",
        sref: "Lockouts",
        requiresAdmin: false,
        friendlyName: 'Lockouts',
        order: 5
      }
    });

});