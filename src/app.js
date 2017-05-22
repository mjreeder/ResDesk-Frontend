/**
 * @ngdoc module
 * @name resdesk
 * @description
 * Primary angular app.
 */
var app = angular.module('resdesk', ['ngAnimate',
                                 'ui.router',
                                 'resdesk.auth',
//                                 'resdesk.analytics',
                                 'resdesk.calendar',
                                 'resdesk.cashlog',
                                 'resdesk.commlog',
                                 'resdesk.config',
                                 'resdesk.directory',
                                 'resdesk.helper',
                                 'resdesk.home',
                                 'resdesk.lockout',
                                 'resdesk.lostandfound',
                                 'resdesk.notification',
//                                 'resdesk.preload',
//                                 'resdesk.reminder',
                                 'resdesk.settings',
                                 'resdesk.user',
                                 'resdesk.components'
                                ]);

/**
 * @memberof resdesk
 * @ngdoc run
 * @name AppRun
 * @param {service} $rootScope Angular service
 * @param {service} $user ResDesk user service
 * @param {service} $timeout Angular service
 * @description 
 *   Configures $rootScope.$user to $user for view side $user access
 *   
 *   Sets $timeout for the load screen to disappear
 *   *in the future, will use $preload to actually do loading
 */
app.run(function ($rootScope, $user, $timeout) {
  $rootScope.$user = $user;
  $rootScope.initialLoadComplete = false;

  //TODO: Convert from timer once stuff needs loaded
  $timeout(function () {
    $rootScope.initialLoadComplete = true;
  }, 1000);

  //  $preload.all().then(function (data) {
  //    $rootScope.initialLoadComplete = true;
  //    $rootScope.$apply();
  //  });

});