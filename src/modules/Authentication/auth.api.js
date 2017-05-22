/**
 * @memberof resdesk.auth
 * @ngdoc factory
 * @name AuthAPI
 * @param {service} $http angular-jwt helper functions
 * @param {object} AppConfig  ResDesk Application config/settings
 * @description 
 *   Factory for ResDesk Auth related requests
 */
authModule.factory('AuthAPI', function ($http, AppConfig) {

  var factory = {};

  /**
   * The base url for auth network requests
   * @private
   * @type {string}
   * @memberof AuthAPI
   * @author Brandon Groff
   * @default 'http://localhost:10018'
   */
  var baseUrl = AppConfig.baseUrl;

  if (AppConfig.dev){
    baseUrl = 'http://localhost:10018';
  }
    

  /**
   * @function Request to refresh the current user token
   * @name refreshToken
   * @memberof AuthAPI
   * @author Brandon Groff
   * @returns {Promise} a $http Promise
   */
  factory.refreshToken = function () {
    return $http({
      method: 'GET',
      url: baseUrl + '/token/refresh'
    });
  };
  
  
  /**
   * @function Request to validate the current user token
   * @name validateToken
   * @memberof AuthAPI
   * @author Brandon Groff
   * @returns {Promise} a $http Promise
   */
  factory.validateToken = function () {
    return $http({
      method: 'GET',
      url: baseUrl + '/token/verify'
    });
  };
  
  
  /**
   * @function Perform a logout
   * @name logout
   * @memberof AuthAPI
   * @author Brandon Groff
   * @returns {Promise} a $http Promise
   */
  factory.logout = function() {
    return $http({
      method: 'DELETE',
      url: baseUrl + '/profile/logout'
    });
  };

  return factory;

});