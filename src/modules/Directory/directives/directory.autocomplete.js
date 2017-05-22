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
 *    <directory-autocomplete model="someObject.resident" on-autocomplete="someFunction" required-field="true" ></directory-autocomplete>
 * </div>
 * </form>
 */
directoryModule.directive("directoryAutocomplete", function (DirectoryAPI, Helper, Student) {
  return ({
    restrict: "E",
    scope: {
      model: "=",
      requiredField: "<",
      onAutocomplete: '&',
      unique: '='
    },
    templateUrl: directoryModule.path + 'directives/directory.autocomplete.html',
    link: function link(scope, element, attributes) {
      
      

      scope.$watch('model', function (updated) {
        if (updated) {
          scope.searchText = updated.name;
          if (scope.unique) {
            $('label[for="dir-autocomplete-' + scope.unique + '"]').addClass('active');
          } else {
            $('label[for="dir-autocomplete"]').addClass('active');
          }

        } else {
          scope.searchText = updated;
          if (scope.unique) {
            $('label[for="dir-autocomplete-' + scope.unique + '"]').removeClass('active');
          } else {
            $('label[for="dir-autocomplete"]').removeClass('active');
          }
        }
      });
      
      /* This code makes key nav work in the autocomplete */

      var inputFieldElement = element.children('div.input-field.red-input').children('input.dir-autocomplete');
      var studentNodeList = element.children('div.input-field.red-input').children('ul.dir-autocomplete-options.z-depth-2').children();
      var currentIndex = -1;
      
      var unsetOld = function(){
        var node = studentNodeList[currentIndex];
        $(node).removeClass('selected')
      };
      
      var highlightActive = function() {
        var node = studentNodeList[currentIndex];
        $(node).addClass('selected');
      };

      var downArrow = function () {
        unsetOld();
        currentIndex += 1;
        if (currentIndex >= studentNodeList.length){
          currentIndex = 0;
        }
        highlightActive();
      };

      var upArrow = function () {
        unsetOld();
        currentIndex -= 1;
        if (currentIndex < 0){
          currentIndex = studentNodeList.length - 1;
        }
        highlightActive();
      };

      var onEnter = function () {
        unsetOld();
        scope.onSelect(scope.searchResults[currentIndex]);
      };

      element.bind("keydown keypress", function (event) {

        studentNodeList = element.children('div.input-field.red-input').children('ul.dir-autocomplete-options.z-depth-2').children();

        if (event.which === 13 ||
          event.which === 38 ||
          event.which === 40) {

          if (event.which === 13) {
            onEnter();
            event.preventDefault();
            return false;
          } else if (event.which === 38) {
            upArrow();
            event.preventDefault();
          } else if (event.which === 40) {
            downArrow();
            event.preventDefault();
          }
        }

      });

      /* End key nav autocomplete */
      
      
      /**
       * The model object connected through the parent form controller
       * @type {Student[] | null}
       * @memberof directoryAutocomplete
       * @author Brandon Groff
       * @default null
       */
      scope.model;

      /**
       * The parsed Student results of a lookup
       * @type {Student[] | null}
       * @memberof directoryAutocomplete
       * @author Brandon Groff
       * @default null
       */
      scope.searchResults = null;

      //Initializes materialize-css autocomplete
      $('.dir-autocomplete').autocomplete();

      /**
       * Call method for anytime $scope.search changes
       * @memberof directoryAutocomplete
       * @author Brandon Groff
       * @param {string} searchText the text to lookup. Min. length 3
       */
      scope.searchChange = function () {
        if (!scope.searchText || scope.searchText.length < 3) {
          scope.searchResults = null;
          scope.model = undefined;
          return;
        }

        scope.loading = true;

        DirectoryAPI.search(scope.searchText)
          .then(function (response) {
            scope.searchResults = DirectoryAPI.parseResponse(response);
          
            currentIndex = -1;
            scope.loading = false;
          }, function (error) {
            Helper.log(error);
            scope.searchResults = null;
            scope.loading = false;
          });
      };


      /**
       * used by autocomplete ng-click, when a Student is autocomplete selected
       * @memberof directoryAutocomplete
       * @author Brandon Groff
       * @param {Student} selectedItem the selected Student to fill the autocomplete field
       */
      scope.onSelect = function (selectedItem, cb) {
        scope.model = selectedItem;
        scope.onAutocomplete()(selectedItem);
        scope.searchResults = null;
        inputFieldElement.blur();
      };


      /**
       * used by ng-blur to approriately update the autocomplete styling
       * @memberof directoryAutocomplete
       * @author Brandon Groff
       */
      scope.blurLabel = function () {
        if (scope.searchText) {
          return;
        }
        if (scope.unique) {
          $('label[for="dir-autocomplete-' + scope.unique + '"]').addClass('active');
        } else {
          $('label[for="dir-autocomplete"]').addClass('active');
        }
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
