/**
 * the module nav path
 * @name navPath
 * @type {string}
 * @memberOf resdesk
 * @author Brandon Groff
 */
app.navPath = './src/modules/App.Navigation/';

/**
 * @memberof resdesk
 * @ngdoc run
 * @name NavRun
 * @param {service} $rootScope Angular service
 * @param {service} $state Angular ui-router service
 * @param {service} $user ResDesk user service
 * @param {service} $window Angular service
 * @description 
 *   Configures $stateChangeStart listener that handles if a state has the following attributes:
 *   - external
 *    - this attribute will cause a link to open outside the application scope
 *   - redirectTo
 *    - this attribute will cause a state redirect to the provided state
 *    
 *    Also sets $rootScope.$state to $state for view side access to $state
 */
app.run(function ($rootScope, $state, $user, $window) {
  $rootScope.$state = $state;

  $rootScope.$on('$stateChangeStart', function (evt, to, params) {
    if (to.external) {
      evt.preventDefault();
      $window.open(to.url, '_self');
    }

    if (to.redirectTo) {
      evt.preventDefault();
      $state.go(to.redirectTo, params, {
        location: 'replace'
      });
    }
  });

});

/**
 * @memberof resdesk
 * @ngdoc config
 * @name NavigationConfig
 * @param {provider} $urlRouterProvider Angular service
 * @param {provider} $locationProvider Angular service
 * @description 
 *   Configures application navigation for html5mode, sets fallback endpoint.
 */
app.config(function ($urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise("/");

});