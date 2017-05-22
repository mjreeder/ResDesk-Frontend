/**
 * @memberof resdesk.components
 * @ngdoc directive
 * @name loadingIndicator
 * @description 
 *   a generic Google material loading indicator
 * @example
 * 
 * <loading-indicator size="small" ng-if="loading"></loading-indicator>
 * 
 */
componentsModule.directive('loadingIndicator', function () {
  return {
    restrict: 'E',
    scope: {
      size: '='
    },
    templateUrl: componentsModule.path + 'loadingIndicator/loadingIndicator.html',
    link: function (scope, element, attrs) {
      scope.size = attrs.size;
    }
  }
});