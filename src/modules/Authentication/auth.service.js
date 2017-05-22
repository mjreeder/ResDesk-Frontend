/**
 * @memberof resdesk.auth
 * @ngdoc service
 * @name $auth
 * @param {factory} jwtHelper   angular-jwt helper functions
 * @param {factory} AuthAPI     ResDesk.auth api functions
 * @param {service} $state      Angular ui-router service
 * @param {factory} Helper      ResDesk Helper factory
 * @param {service} $rootScope  Angular $rootScope service
 * @description 
 *   Primary $auth management service for ResDesk
 */
authModule.service('$auth', function (jwtHelper, AuthAPI, $state, Helper, $rootScope) {

  var self = this;
  
  /**
   * the localStorage key name
   * @memberof $auth
   * @private
   * @type {string}
   * @default 'resdesk.token'
   * @author Brandon Groff
   */
  var key = 'resdesk.token';

  /**
   * Validate that user is authenticated
   * @memberof $auth
   * @author Brandon Groff
   * @returns {boolean} true/false
   */
  this.isAuthenticated = function () {
    //TODO: ??
    return this.getRawToken() ? true : false;
  };

  /**
   * Called on login, used to save the token if valid
   * @memberof $auth
   * @author Brandon Groff
   * @param   {string} token the raw authorization token
   * @returns {boolean}  true on success, or broadcasts 'tokenHasExpired'
   */
  this.performLogin = function (token) {
    var decoded = jwtHelper.decodeToken(token);
    if (decoded) {
      this.setToken(token);
      return true;
    } else {
      return $rootScope.$broadcast('tokenHasExpired');
    }
  };

  /**
   * Get the raw token string from localStorage, or request one if none in localStorage
   * @memberof $auth
   * @author Brandon Groff
   * @returns {string} the raw token string if set in localStorage. Otherwise calls Error?code=403
   */
  this.getRawToken = function () {
    var localToken = localStorage.getItem(key);
    if (localToken) {
      return localToken;
    } else {
      $state.go('Error', {
        code: 403
      });
    }
  };

  /**
   * Get the parsed token object
   * @memberof $auth
   * @author Brandon Groff
   * @returns {object | undefined} the parsed token if it is set in localStorage
   */
  this.getParsedToken = function () {
    var localToken = this.getRawToken();
    if (localToken) {
      return jwtHelper.decodeToken(localToken);
    }
  };

  /**
   * Save the RAW token
   * @memberof $auth
   * @author Brandon Groff
   * @param {string} token the RAW token object
   */
  this.setToken = function (token) {
    localStorage.setItem(key, token);
  };
  
  /**
   * Clear the token from localStorage
   * @memberof $auth
   * @author Brandon Groff
   */
  this.clearLocalToken = function() {
    localStorage.removeItem(key);
  };
  
  /**
   * Perform full logout process
   * @memberof $auth
   * @author Brandon Groff
   */
  this.logout = function() {
    self.clearLocalToken();
    $state.go('Unauthorized');
  };

});