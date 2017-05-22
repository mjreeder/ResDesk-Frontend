/**
 * the module error path
 * @name errorPath
 * @type {string}
 * @memberOf resdesk
 * @author Brandon Groff
 */
app.errorPath = './src/modules/App.Error/';

/**
 * @memberof resdesk
 * @ngdoc config
 * @name ErrorConfig
 * @param {provider} $stateProvider Angular ui-router config service
 * @description 
 *   Configures application navigable routes.
 *   
 *   Routes: 
 *    - Error
 *      - Query Param: code (`int`)
 *    - Unauthorized
 *      - exits application scope
 * 
 * @example 
 * 
 * $state.go('Error', {code: 401});
 */
app.config(function ($stateProvider) {

  $stateProvider
    .state('Error', {
      url: "/error?code",
      templateUrl: app.errorPath + "app.error.html",
      controller: 'ErrorController',
      data: {
        requiresAdmin: false,
        excludeSidenav: true
      }
    })
    .state('Unauthorized', {
      url: '/unauthorized.html',
      external: true,
      data: {
        excludeSidenav: true
      }
    });

});

/**
 * @memberof resdesk
 * @ngdoc controller
 * @name ErrorController
 * @param {service} $scope Angular scope wrapper
 * @param {service} $state Angular-ui-router State wrapper
 * @param {service} $stateParams Angular-ui-router parameter wrapper
 * @description 
 *   Simple Error page controller that displays a message when given an Error code, 
 *   or redirects out of the app on a 403
 * 
 * @example 
 * 
 * $state.go('Error', {code: 401});
 */
app.controller('ErrorController', function ($scope, $state, $stateParams) {

  /**
   * the errorCode passed via $stateParams.code
   * @type {number}
   * @memberOf ErrorController
   * @author Brandon Groff
   */
  $scope.errorCode = $stateParams.code;

  if ($stateParams.code == '403') {
    $state.go('Unauthorized');
  }

});