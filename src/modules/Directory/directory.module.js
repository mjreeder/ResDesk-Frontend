/**
 * @ngdoc module
 * @name resdesk.directory
 * @requires ui.router
 * @requires resdesk.config
 * @requires resdesk.helper
 * @requires http.cancellable
 * @description
 * ResDesk directory service
 */
var directoryModule = angular.module('resdesk.directory', ['ui.router',
                                                           'resdesk.config',
                                                           'resdesk.helper',
                                                           'http.cancellable']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.directory
 * @author Brandon Groff
 */
directoryModule.path = './src/modules/Directory/';

/**
 * @memberof resdesk.directory
 * @ngdoc config
 * @name DirectoryConfig
 * @param {service} $stateProvider Angular ui-router config service
 * @description 
 *   Configures application navigable routes.
 *   
 *   Routes: 
 *    - Directory
 * 
 * @example 
 * 
 * $state.go('Directory');
 */
directoryModule.config(function ($stateProvider) {

  $stateProvider
    .state('Directory', {
      url: "/directory",
      templateUrl: directoryModule.path + "directory.home.html",
      controller: 'DirectoryController',
      data: {
        name: "Directory",
        icon: "perm_identity",
        sref: "Directory",
        requiresAdmin: false,
        friendlyName: 'Directory',
        order: 4
      }
    });

});