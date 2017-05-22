/**
 * @ngdoc module
 * @name resdesk.user
 * @memberof resdesk
 * @requires resdesk.notification
 * @requires resdesk.auth
 * @description
 * ResDesk user module, containing the user service
 */
var userModule = angular.module('resdesk.user', ['resdesk.notification', 'resdesk.auth', 'resdesk.toast']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.user
 * @author Brandon Groff
 */
userModule.path = './src/modules/User/';

/**
 * @memberof resdesk.user
 * @ngdoc run
 * @name UserRun
 * @param {service} $rootScope Angular service
 * @param {service} $state Angular ui-router service
 * @param {service} $user ResDesk user service
 * @description 
 *   Configures $stateChangeStart listener that checks if a 
 *   user needs to be an admin to access a state
 *   - requiresAdmin
 *    - this $state attribute used to determine if user privelage needs to be checked
 *    
 */
userModule.run(function ($rootScope, $user, $state) {

  $rootScope.$on('$stateChangeStart', function (evt, to, params) {
    if (to.data.requiresAdmin) {
      if (!$user.isAdmin()){
        evt.preventDefault();
        $state.go('Error', {code: 401});
      }
    }

  });

});