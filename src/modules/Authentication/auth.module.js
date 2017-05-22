/**
 * @ngdoc module
 * @name resdesk.auth
 * @requires ui.router
 * @requires resdesk.config
 * @requires resdesk.user
 * @requires angular-jwt
 * @requires resdesk.helper
 * @description
 * ResDesk authentication module
 */
var authModule = angular.module('resdesk.auth', ['ui.router',
                                                 'resdesk.config',
                                                 'resdesk.user',
                                                 'angular-jwt',
                                                 'resdesk.helper']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.auth
 * @author Brandon Groff
 */
authModule.path = './src/modules/Authentication';

/**
 * @memberof resdesk.auth
 * @ngdoc config
 * @name AuthConfig
 * @param {provider} $stateProvider Angular ui-router config service
 * @param {provider} jwtOptionsProvider angular-jwt options for setting up app authorization
 * @description 
 *   Configures application login route, establishes app auth configurations
 *   leveraging jwtOptions
 *   
 *   Routes: 
 *    - Login
 *      - query params: token (int)
 * 
 * @example 
 * 
 * $state.go('Login', {token: someToken});
 * 
 * -- OR --
 * 
 * When used by a backend auth endpoint
 * 
 * (301 Redirect Header) Location: http://localhost:8080/login?token=xxxxxx.xxxxx.xxxxx
 */
authModule.config(function ($stateProvider, jwtOptionsProvider, $httpProvider) {

  $stateProvider
    .state('Login', {
      url: '/login?token',
      controller: 'AuthController',
      data: {
        name: "Login",
        icon: null,
        sref: "Login",
        friendlyName: 'Login',
        requiresAdmin: false,
        requiresLogin: false,
        excludeSidenav: true
      },
      resolve: {
        authenticate: ['$auth', '$stateParams', function ($auth, $stateParams) {
          return $auth.performLogin($stateParams.token);
        }]
      }
    });


  jwtOptionsProvider.config({
    tokenGetter: ['options', '$auth', function (options, $auth) {
      if (options && options.url.substr(options.url.length - 5) == '.html') {
        return null;
      }
      return $auth.getRawToken();
      }],
    whiteListedDomains: ['localhost'],
    //    unauthenticatedRedirectPath: '/error?code=403',
    unauthenticatedRedirector: ['$state', function ($state) {
      $state.go('Error', {
        code: 403
      });
      }]
  });

  $httpProvider.interceptors.push('jwtInterceptor');

});

/**
 * @memberof resdesk.auth
 * @ngdoc run
 * @name AuthRun
 * @param {service} authManager angular-jwt service
 * @param {service} $rootScope Angular service
 * @param {service} $state Angular ui-router service
 * @param {service} $auth ResDesk auth service
 * @description 
 *   Enables authManager to check auth on refresh and redirect when unauthenticated
 *   
 *   Establishes listener for 'tokenHasExpired'
 *   
 */
authModule.run(function (authManager, $rootScope, $state, $auth) {

  authManager.checkAuthOnRefresh();

  authManager.redirectWhenUnauthenticated();

  $rootScope.$on('tokenHasExpired', function () {
    $auth.clearLocalToken();
    $state.go('Error', {
      code: 401
    });
  });

});

/**
 * @memberof resdesk.auth
 * @ngdoc controller
 * @name AuthController
 * @param {service} $state Angular ui-router service
 * @description 
 *   Does not load until auth resolve occurs. If it succeeds,
 *   this controller loads and triggers a redirect to Home state
 *   (because $state resolve function cannot trigger state changes).
 */
authModule.controller('AuthController', function ($state) {
  //if here, resolve succeeded and we should go to home page
  $state.go('Home');
});