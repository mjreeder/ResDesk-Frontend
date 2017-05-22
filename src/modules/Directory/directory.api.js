/**
 * @memberof resdesk.directory
 * @ngdoc factory
 * @name DirectoryAPI
 * @param {service} AppConfig     ResDesk Application config/settings
 * @param {object} $search        directory search service
 * @param {Student} Student       a factory wrapper of a Student class
 * @param {service} $http         Angular $http service
 * @description 
 *   Factory for ResDesk Directory/Student related requests
 */
directoryModule.factory('DirectoryAPI', function (AppConfig, $search, Student, $http) {

  var factory = {};
  
  /**
   * The base url for network requests
   * @private
   * @type {string}
   * @memberof DirectoryAPI
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/directory/'
   */
  var baseUrl = AppConfig.baseUrl + '/directory/';
  
  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10011/directory'
  }

  /**
   * @function Parse the $search response to a Student list
   * @memberof DirectoryAPI
   * @name parseResponse
   * @author Brandon Groff
   * @param   {object}   response $http/$httpCancellable success response
   * @returns {Student[]} array of Students
   */
  factory.parseResponse = function(response) {
    
    var rawList = response.data.data;
    
    var students = [];
    rawList.forEach(function(entry){
      students.push(new Student(entry));
    });
    
    return students;
  };
  
  /**
   * @function basic search
   * @author Brandon Groff
   * @param   {string} searchText the text to search
   * @memberof DirectoryAPI
   * @name search
   * @description A reference to $search.basic
   * @returns {Promise} a regular promise or $httpCancellable promise
   */
  factory.search = $search.basic;
  
  /**
   * @function advanced search
   * @param   {object} parameters the (key, value) pairs to search
   * @author Brandon Groff
   * @memberof DirectoryAPI
   * @name advancedSearch
   * @description A reference to $search.advanced
   * @returns {Promise} a regular promise or $httpCancellable promise
   */
  factory.advancedSearch = $search.advanced;
  
  /**
   * get a student by bsu id
   * @memberof DirectoryAPI
   * @author Brandon Groff
   * @param   {string|number} id a student bsuid
   * @returns {Promise}         a $http promise
   */
  factory.getById = function(id) {
    if (!id){
      console.error('Missing required: id');
      return;
    }
    
    return $http({
      method: 'GET',
      url: baseUrl + '/students/' + id
    });
  };
  
  /**
   * get an array of Students by bsu id's
   * @author Brandon Groff
   * @param   {string[]|number[]} idArr array of bsu ids
   * @returns {Promise} $http Promise
   */
  factory.getByIdArray = function(idArr) {
    if (!idArr){
      console.error('Missing required: idArr');
      return;
    }
    if (!Array.isArray(idArr)){
      console.error('idArr must be an array');
      return;
    }
    
    return $http({
      method: 'POST',
      url: baseUrl + '/students/map',
      data: {
        idArray: idArr
      }
    });
  };
  
  /**
   * Get all Students that have access to ResDesk
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.getAllResDeskUsers = function(){
    return $http({
      method: 'GET',
      url: baseUrl + '/students/resdesk'
    });
  };

  return factory;
});