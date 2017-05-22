/**
 * @ngdoc module
 * @name resdesk.cashlog
 * @requires ui.router
 * @requires resdesk.config
 * @requires resdesk.helper
 * @requires resdesk.modal
 * @requires resdesk.directory
 * @requires resdesk.email
 * @description
 * Module containing cashlog related services, controller, factories
 */
var cashlogModule = angular.module('resdesk.cashlog', ['ui.router',
                                                       'resdesk.config',
                                                       'resdesk.helper',
                                                        'resdesk.modal',
                                                        'resdesk.directory',
                                                        'resdesk.email']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.cashlog
 * @author Brandon Groff
 */
cashlogModule.path = './src/modules/CashLog/';

/**
 * @memberof resdesk.cashlog
 * @ngdoc config
 * @name CashLogConfig
 * @param {provider} $stateProvider Angular ui-router config service
 * @description 
 *   Configures CashLog routes
 *   
 *   Routes: 
 *    - CashLog
 *      - parent view containing sub-nav bar, redirects to CashLog.Total
 *   
 *   CashLog Sub-Routes:
 *    - CashLog.Total
 *      - CashLog tracking for the current day for the active hall
 *    - CashLog.History
 *      - CashLog history for this hall
 * 
 * @example 
 * 
 * $state.go('CashLog.Total');
 * 
 * -- OR --
 * 
 * $state.go('CashLog');
 *  - Will redirect to CashLog.Total
 * 
 */
cashlogModule.config(function ($stateProvider) {

  $stateProvider
    .state('CashLog', {
      url: "/cash",
      templateUrl: cashlogModule.path + "cashLog.nav.html",
      redirectTo: 'CashLog.Total',
      controller: 'CashLogController',
      data: {
        name: "Cash Log",
        icon: "monetization_on",
        sref: "CashLog",
        requiresAdmin: false,
        friendlyName: 'Cash Log',
        order: 3
      }
    })
    .state('CashLog.Total', {
      parent: 'CashLog',
      url: "/total",
      templateUrl: cashlogModule.path + "cashLog.total.html",
      controller: 'CashLogTotalController',
      data: {
        requiresAdmin: false,
        friendlyName: 'Cash Log | Total'
      }
    })
    .state('CashLog.History', {
      parent: 'CashLog',
      url: "/history",
      templateUrl: cashlogModule.path + "cashLog.history.html",
      controller: 'CashLogHistoryController',
      data: {
        requiresAdmin: false,
        friendlyName: 'Cash Log | History'
      }
    });

});