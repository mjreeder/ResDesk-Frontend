/**
 * @memberof resdesk.directory
 * @ngdoc controller
 * @name DirectoryController
 * @description Controller for Directory lookup view
 * @param {service} $scope  Angular service
 * @param {factory} DirectoryAPI   ResDesk Directory api
 * @param {factory} Helper   ResDesk helper factory
 * @author Brandon Groff
 */
directoryModule.controller('DirectoryController', function ($scope, DirectoryAPI, Helper) {
  
  /**
   * The search string
   * @type {string | undefined}
   * @memberof DirectoryController
   * @author Brandon Groff
   * @default undefined
   */
  $scope.search;
  
  /**
   * The results of a lookup
   * @type {Student[] | null}
   * @memberof DirectoryController
   * @author Brandon Groff
   * @default null
   */
  $scope.searchResults = null;
  
  /**
   * Is a request actively occuring
   * @type {boolean}
   * @memberof DirectoryController
   * @author Brandon Groff
   * @default false
   */
  $scope.loading = false;

  /**
   * Clear the current search field
   * @memberof DirectoryController
   * @author Brandon Groff
   */
  $scope.clearSearch = function () {
    $scope.search = undefined;
    $scope.searchChange($scope.search);
  }

  /**
   * Call method for anytime $scope.search changes
   * @memberof DirectoryController
   * @author Brandon Groff
   * @param {string} searchText the text to lookup. Min. length 3
   */
  $scope.searchChange = function (searchText) {
    
    if (!searchText || searchText.length < 3) {
      $scope.searchResults = null;
      return;
    }
    
    $scope.loading = true;
    
    DirectoryAPI.search(searchText)
      .then(function (response) {
        $scope.searchResults = DirectoryAPI.parseResponse(response);
        Helper.log($scope.searchResults);
        $scope.loading = false;
      }, function (error) {
        Helper.log(error);
        $scope.searchResults = null;
        $scope.loading = false;
      });
  }

});