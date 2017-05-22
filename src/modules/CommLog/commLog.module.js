/**
 * @ngdoc module
 * @name resdesk.commlog
 * @requires ui.router
 * @requires resdesk.config
 * @requires resdesk.modal
 * @requires resdesk.directory
 * @description
 * ResDesk communicator service
 */
var commModule = angular.module('resdesk.commlog', ['ui.router',
                                                    'resdesk.modal',
                                                    'resdesk.config',
                                                    'resdesk.directory',
                                                    'resdesk.toast']);
/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.commlog
 * @author Brandon Groff
 */
commModule.path = './src/modules/CommLog/';

/**
 * @memberof resdesk.commlog
 * @ngdoc config
 * @name CommLogConfig
 * @param {service} $stateProvider Angular ui-router config service
 * @description 
 *   Configures application navigable routes.
 *   
 *   Routes: 
 *    - CommLog
 * 
 * @example 
 * 
 * $state.go('CommLog');
 */
commModule.config(function ($stateProvider) {

  $stateProvider
    .state('CommLog', {
      url: "/communication",
      templateUrl: commModule.path + "commLog.home.html",
      controller: 'CommunicationLogController',
      data: {
        name: "Communication Log",
        icon: "sms",
        sref: "CommLog",
        requiresAdmin: false,
        friendlyName: 'Comm Log',
        order: 2
      }
    });

});