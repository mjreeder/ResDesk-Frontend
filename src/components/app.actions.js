/**
 * @memberof resdesk
 * @ngdoc service
 * @name clickAnywhereButHereService
 * @param {service} $document Angular document wrapper
 * @description 
 *   Service implementation of the clickAnywhereButHere directive
 *   that allows a function to be called on a click anywhere outside
 *   the attached element.
 *   
 *   Original Source: [http://stackoverflow.com/questions/12931369/click-everywhere-but-here-event](http://stackoverflow.com/questions/12931369/click-everywhere-but-here-event)
 */
app.factory('clickAnywhereButHereService', function ($document) {
  var tracker = [];

  return function ($scope, expr) {
    var i, t, len;
    for (i = 0, len = tracker.length; i < len; i++) {
      t = tracker[i];
      if (t.expr === expr && t.scope === $scope) {
        return t;
      }
    }
    var handler = function () {
      $scope.$apply(expr);
    };

    $document.on('click', handler);

    // IMPORTANT! Tear down this event handler when the scope is destroyed.
    $scope.$on('$destroy', function () {
      $document.off('click', handler);
    });

    t = {
      scope: $scope,
      expr: expr
    };
    tracker.push(t);
    return t;
  };
});

/**
 * @memberof resdesk
 * @ngdoc directive
 * @name clickAnywhereButHere
 * @param {service} $document Angular document wrapper
 * @param {service} clickAnywhereButHereService clickAnywhereButHereService that does the heavy lifting
 * @description 
 *   Attribute attachable directive that attaches an action to all elements outside the 
 *   context of the current/attached one. A best use case for this is attaching it to 
 *   a sidebar or modal and trigger a close when somewhere outside the object is clicked.
 * 
 * @example 
 *   <sidebar click-anywhere-but-here="closeSidebar()"></sidebar>
 *   <main> Clicking here will close the sidebar!! </main>
 */
app.directive('clickAnywhereButHere', function ($document, clickAnywhereButHereService) {
  return {
    restrict: 'A',

    /**
     * Attach click listener to all elements outside this actual one 
     * @memberof clickAnywhereButHere
     * @param {service} scope the scope of this element
     * @param {service} element element that this direcive is assigned to
     * @param {service}   attrs attributes of this element
     */
    link: function (scope, elem, attr) {
      var handler = function (e) {
        e.stopPropagation();
      };
      elem.on('click', handler);

      scope.$on('$destroy', function () {
        elem.off('click', handler);
      });

      clickAnywhereButHereService(scope, attr.clickAnywhereButHere);
    }
  };
});

/**
 * @memberof resdesk
 * @ngdoc directive
 * @name ngEnter
 * @description 
 *   Enter key press event listener that will trigger the given function.
 *   Example use case, used on the last input of a form.
 * @example 
 *   <form>
 *     <input type="email" />
 *     <input type="password" ng-enter="submitLogin()" />
 *     <button type="submit" ng-click="submitLogin()">Login</button>
 *   </form>
 */
app.directive('ngEnter', function () {
  /**
   * Attach Enter key listener to given element 
   * @memberof ngEnter
   * @param {service} scope the scope of this element
   * @param {service} element element that this direcive is assigned to
   * @param {service}   attrs attributes of this element
   */
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});

/**
 * @memberof resdesk
 * @ngdoc directive
 * @name ngEsc
 * @description 
 *   Escape key press event listener that will trigger the given function.
 *   Example use case, using this to trigger a modal close.
 *   Original source: [http://www.adamthings.com/post/2015/02/13/angular-directive-escape-key-function/](http://www.adamthings.com/post/2015/02/13/angular-directive-escape-key-function/)
 * 
 * @example 
 *   <modal tabindex=0 ng-esc="close()">
 *     ... Modal Content ...
 *   </modal>
 */
app.directive('ngEsc', function () {
  /**
   * Attach Escape key listener to given element 
   * @memberof ngEsc
   * @param {service} scope the scope of this element
   * @param {service} element element that this direcive is assigned to
   * @param {service}   attrs attributes of this element
   */
  return function (scope, element, attrs) {
    element.bind("keydown keypress keyup", function (event) {
      if (event.which === 27) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEsc);
        });

        event.preventDefault();
      }
    });
  };
});