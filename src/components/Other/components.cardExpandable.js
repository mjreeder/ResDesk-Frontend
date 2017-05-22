/**
 * @memberof resdesk.components
 * @ngdoc directive
 * @name cardExpandable
 * @description 
 *   a generic expandable card, usable as class or attribute. A card is only made expandable if it's
 *   native height is greater than 200px
 * @example
 * 
 * <div class="card card-expandable">Some Content</div>
 * 
 */
componentsModule.directive('cardExpandable', function ($timeout, $compile, $window) {
  return {
    restrict: 'AC',
    scope: false,
    link: function (scope, element, attrs) {

      scope.expand = false;
      var shrinkHeight = 200;

      /**
       * Toggle the cards expanded state
       * @private
       * @memberof cardExpandable
       * @author Brandon Groff
       */
      scope.toggle = function () {
        scope.expand = !scope.expand;
        if (scope.expand) {
          element.addClass('expand');
          element.attr('style', "max-height: " + scope.origHeight + "px");
        } else {
          element.removeClass('expand');
          element.attr('style', "max-height: " + shrinkHeight + "px");
        }
      };

      var bottomPad = $compile('<div class="card-bottom-pad"><a ng-click="toggle()"></a></div>')(scope);

      /**
       * Card initialization function that is ran at a delayed time to allow element height calculation
       * @author Brandon Groff
       * @private
       */
      function init() {
        scope.origHeight = element.prop('offsetHeight'); 
        if (scope.origHeight > 200) {
          element.append(bottomPad);
        }
//        element.attr('style', "max-height: " + shrinkHeight + "px");
        element.addClass('limit-height');
      };

      //timeout to allow for offsetHeight calculation
      $timeout(init, false);              
    }
  }
});