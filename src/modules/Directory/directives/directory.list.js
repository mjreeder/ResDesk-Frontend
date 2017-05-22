/**
 * @ngdoc directive
 * @memberOf resdesk.directory
 * @name directoryAutocomplete
 * @param {factory} DirectoryAPI    ResDesk calendar api
 * @param {factory} Helper          ResDesk helper factory
 * @param {factory} Student         factory wrapper for Student class
 * @description
 *  reusable directory autocomplete directive for Student lookup in forms
 *  
 * @example
 * <form>
 * <div class="row">
 *    <h6>Some notable field label</h6>
 *    <directory-list model-list="someArray" required-field="true" ></directory-list>
 * </div>
 * </form>
 */
directoryModule.directive("directoryList", function (DirectoryAPI, Helper, Student) {
  return ({
    restrict: "E",
    scope: {
      to: "=modelList",
      requiredField: "<"
    },
    templateUrl: directoryModule.path + 'directives/directory.list.html',
    link: function link(scope, element, attributes) {

      scope.to = [undefined];

      scope.addTo = function () {
        scope.to.push(undefined);
      };

      scope.removeTo = function (index) {
        scope.to.splice(index, 1);
      };

      scope.selectResident = function (selectedResident) {
        scope.resident = selectedResident;
      };

      /**
       * called on initial directory load, will perform a search if scope.model is not empty
       * @memberof directoryAutocomplete
       * @author Brandon Groff
       */
      var init = function () {
        if (scope.model) {

          if (!Student.prototype.isPrototypeOf(scope.model)) {
            console.error('scope.model must be a Student class object or null');
          }

          DirectoryAPI.advancedSearch(scope.model.exportToObject())
            .then(function (response) {
              //TODO
              Helper.log('Handle response in directory.autocomplete', response);
              scope.loading = false;
            }, function (error) {
              Helper.log(error);
              scope.loading = false;
            });

        }
      };


      init();

    }
  });

});
