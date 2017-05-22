/**
 * @memberof resdesk.components
 * @ngdoc directive
 * @name materialTable
 * @description 
 *   General multi-purpose material table with filtering, column sorting, and mobile-friendly styling
 * @example
 * 
 * <material-table table-data="someData" filter-by="controller.filter" body-cell-ng-class-func="someFunction" custom-filter="filterName" row-click-action="clickhandler"></material-table>
 * 
 */
componentsModule.directive('materialTable', function () {
  return {
    restrict: 'E',
    replace: true,
    //transclude: enables directive to have access to parent/container scope
    transclude: false,
    scope: {
      tableData: "=",
      filterBy: "=",
      bodyCellNgClassFunc: "=",
      customFilter: "@",
      rowClickAction: "="
    },
    templateUrl: componentsModule.path + 'components.materialTable.html',
    link: function (scope, element, attrs) {
      
      if (!attrs.tableData) {
        console.error("materialTable: Missing attribute tableData");
      }
      
      /**
       * Gets the header object corresponding to the short
       * @author Brandon Groff
       * @private
       * @memberof materialTable
       * @param   {string} fieldShort the fields short string value
       * @returns {Object|null} the header object or null
       */
      var getHeaderWithShort = function (fieldShort) {
        for (var i = 0; i < scope.tableData.headers.length; i++) {
          var header = scope.tableData.headers[i];
          if (header.short == fieldShort) {
            return header;
          }
        }
        return null;
      }

      /**
       * Returns if a column/field is sortable
       * @author Brandon Groff
       * @private
       * @memberof materialTable
       * @param   {string} fieldShort the fields short string value
       * @returns {boolean}  
       */
      var isSortable = function (fieldShort) {
        var header = getHeaderWithShort(fieldShort);
        if (header != null) {
          return header.sortable;
        }
        return false;
      }

      /**
       * Used by view, the sort click handler
       * @author Brandon Groff
       * @private
       * @memberof materialTable
       * @param {string} field the fields short string value
       */
      scope.sortTo = function (field) {
        if (!isSortable(field)) {
          return;
        }
        if (scope.sortBy == field) {
          scope.sortBy = "-" + field;
        } else {
          scope.sortBy = field;
        }
      }

      /**
       * Used by view to determine in a body column should be visible, based on it's header's 'hidden' value
       * @author Brandon Groff
       * @private
       * @memberof materialTable
       * @param   {string} fieldShort the fields short string value
       * @returns {boolean}  true to show the column, false to hide
       */
      scope.showColumn = function (fieldShort) {
        var header = getHeaderWithShort(fieldShort);
        if (header != null) {
          return !header.hidden;
        }
        return false;
      }
    }
  }
});