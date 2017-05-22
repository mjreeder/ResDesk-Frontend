/**
 * @ngdoc module
 * @name resdesk.analytics
 * @requires resdesk.config
 * @requires resdesk.helper
 * @description
 * ResDesk analytics module.
 */
var analyticsModule = angular.module('resdesk.analytics', ['resdesk.config', 'resdesk.helper']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.analytics
 * @author Brandon Groff
 */
analyticsModule.path = './src/modules/Analytics/';

/**
 * @memberof resdesk.analytics
 * @ngdoc config
 * @name AnalyticsConfig
 * @param {service} $stateProvider Angular ui-router config service
 * @description 
 *   Configures application navigable routes.
 *   
 *   Routes: 
 *    - Analytics
 * 
 * @example 
 * 
 * $state.go('Analytics');
 */
analyticsModule.config(function ($stateProvider) {

  $stateProvider
    .state('Analytics', {
      url: "/analytics",
      templateUrl: analyticsModule.path + "analytics.home.html",
      controller: 'AnalyticsController',
      data: {
        name: 'Analytics',
        icon: 'data_usage',
        sref: 'Analytics',
        requiresAdmin: true,
        requiresLogin: true,
        friendlyName: 'Analytics',
        order: 8
      }
    });

});

/**
 * @memberof resdesk.analytics
 * @ngdoc controller
 * @name AnalyticsController
 * @description View Controller for Analytics view
 * @param {service} $scope Angular scope service
 * @author Brandon Groff
 */
analyticsModule.controller('AnalyticsController', function ($scope) {

});