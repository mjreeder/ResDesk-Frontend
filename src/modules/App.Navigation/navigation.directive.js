/**
 * @memberof resdesk
 * @ngdoc directive
 * @name navigation
 * @description 
 *   the app navigation bar
 * @example
 * 
 * <navigation></navigation>
 * 
 */
app.directive("navigation", function () {
  return ({
    restrict: "E",
    scope: {
    },
    templateUrl: app.navPath + 'navigation.html',
    link: function link(scope, element, attributes) {
      
    },
    controller: 'NavController'
  });

});