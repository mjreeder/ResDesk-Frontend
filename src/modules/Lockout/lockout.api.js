/**
 * @memberof resdesk.lockout
 * @ngdoc factory
 * @name LockoutsAPI
 * @param {service} $http     Angular service
 * @param {object} AppConfig  ResDesk Application config/settings
 * @param {constant} LockoutMaterialTable  ResDesk Lockout constant
 * @description 
 *   Factory for ResDesk Lockout related requests
 */
lockoutModule.factory('LockoutsAPI', function ($http, AppConfig, LockoutMaterialTable) {

  var factory = {};

  /**
   * The base url for auth network requests
   * @private
   * @type {string}
   * @memberof LockoutsAPI
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/lockouts'
   */
  var baseUrl = AppConfig.baseUrl + '/lockouts'

  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10016/lockouts'
  }

  /**
   * Parse the lockouts response to MaterialTable display format
   * @memberof LockoutsAPI
   * @author Brandon Groff
   * @param   {object} response $http Promise success response
   * @returns {object} parsed MaterialTable-ready object
   */
  factory.parseResponseToTableFormat = function (response) {
    var tableHeaders = angular.copy(LockoutMaterialTable.headers);
    var data = angular.copy(LockoutMaterialTable.data);

    var lockouts = response.data.data;

    lockouts.forEach(function (lockout) {
      var template = angular.copy(LockoutMaterialTable.dataFormat);
      template.name.value = lockout.user.entry_name;
      template.email.value = lockout.user.email;
      template.lockouts.value = lockout.lockouts;
      template.bsuid.value = lockout.bsuid;

      data.push(template);
    });


    return {
      headers: tableHeaders,
      data: data
    };
  };

  /**
   * Get all Lockouts with lockout count
   * @memberof LockoutsAPI
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.getAll = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

  /**
   * Get a lockout by ID
   * @memberof LockoutsAPI
   * @author Brandon Groff
   * @param   {string} lockoutId the lockout hex id
   * @returns {Promise} $http Promise
   */
  factory.getById = function (lockoutId) {
    return $http({
      method: 'GET',
      url: baseUrl + '/' + lockoutId
    });
  };

  /**
   * Get all lockout cases for a user
   * @memberof LockoutsAPI
   * @author Brandon Groff
   * @param   {string} bsuid a student bsuid
   * @returns {Promise} $http Promise
   */
  factory.getByUser = function (bsuid) {
    return $http({
      method: 'GET',
      url: baseUrl + '/user/' + bsuid
    });
  };

  /**
   * Create a new lockout case
   * @memberof LockoutsAPI
   * @author Brandon Groff
   * @param   {Student}   student a Student object
   * @returns {Promise} $http Promise
   */
  factory.create = function (student) {
    return $http({
      method: 'POST',
      url: baseUrl,
      data: {
        bsuid: "" + student.id
      }
    });
  };

  /**
   * Delete a lockout instance (Admin only)
   * @memberof LockoutsAPI
   * @author Brandon Groff
   * @param   {string} lockoutId the lockout hex id
   * @returns {Promise} $http Promise
   */
  factory.delete = function (lockoutId) {
    return $http({
      method: 'DELETE',
      url: baseUrl + "/" + lockoutId
    });
  }

  return factory;
});