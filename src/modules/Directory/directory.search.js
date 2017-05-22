/**
 * @memberof resdesk.directory
 * @ngdoc service
 * @name $search
 * @param {constant} AppConfig    ResDesk AppConfig
 * @param {factory}  Helper       ResDesk helper factory
 * @param {service}  $httpCancellable   a cancellable version of $http
 * @description 
 *   directory module service for performing Profile searches. Manages
 *   the current search status and cancels when active request is not complete
 *   but a new request is wanted
 * 
 */
directoryModule.service('$search', function (AppConfig, Helper, $httpCancellable) {

  /**
   * The base url for network requests
   * @private
   * @type {string}
   * @memberof $search
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/directory/students/search'
   */
  var baseUrl = AppConfig.baseUrl + '/directory/students/search';

  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10011/students/search'
  }


  /**
   * The active request
   * @private
   * @type {$httpCancellable | null}
   * @memberof $search
   * @author Brandon Groff
   * @default null
   */
  var activeRequest = null;


  /**
   * Perform a basic search on any parameter
   * @author Brandon Groff
   * @memberof $search
   * @param   {string} searchText the text to search
   * @returns {Promise} a regular promise or $httpCancellable promise
   * @example 
   * 
   * $search.basic('Test')
   * .then(function(response){
   *   //handle success data
   * }, function(error){
   *  //handle error
   * });
   * 
   */
  this.basic = function (searchText) {

    if (!searchText || searchText.length < 3) {
      return new Promise(function (resolve, reject) {
        reject(new CancelError('searchText must exceed length 3'));
      });
    }

    if (this.activeRequest) {
      activeRequest.cancel();
    }

    activeRequest = $httpCancellable({
      method: 'GET',
      url: baseUrl + '?any=' + searchText
    });

    return activeRequest;
  };

  /**
   * Perform an advanced search on given key value pairs
   * @author Brandon Groff
   * @memberof $search
   * @param   {object} parameters the (key, value) pairs to search
   * @returns {Promise} a regular promise or $httpCancellable promise
   * @example 
   * 
   * $search.advanced({
   *   'bsu_id': 900,
   *   'name_first': B
   * })
   * .then(function(response){
   *   //handle success data
   * }, function(error){
   *  //handle error
   * });
   * 
   */
  this.advanced = function (parameters) {

    if (!parameters || parameters.length == 0) {
      return new Promise(function (resolve, reject) {
        reject(new CancelError('parameters cannot be empty'));
      });
    }

    if (this.activeRequest) {
      activeRequest.cancel();
    }

    activeRequest = $httpCancellable({
      method: 'GET',
      url: Helper.parameterizeUrl(baseUrl, parameters)
    });

    return activeRequest;

  };

});