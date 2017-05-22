/**
 * @memberof resdesk
 * @ngdoc filter
 * @name dateRange
 * @description 
 *   A custom filter that filters list of objects (containing
 *   a start and end time) to fall between the given range.
 * @example 
 *   <ul>
 *      <li ng-repeat="item in itemList | dateRange: item.startTime : item.endTime">
 *        {{item.name}}
 *      </li>
 *   </ul>
 */
app.filter('dateRange', function () {
  /**
   * Attach Enter key listener to given element 
   * @memberof ngEnter
   * @param {service} scope the scope of this element
   * @param {service} element element that this direcive is assigned to
   * @param {service}   attrs attributes of this element
   */
  return function (items, from, to) {
    if (!from || !to) {
      return items;
    }
    var df = Date.parse(from);
    var dt = Date.parse(to);
    var result = [];
    for (var i = 0; i < items.length; i++) {
      var tf = new Date(items[i].time.value),
        tt = new Date(items[i].time.value);
      if (tf > df && tt < dt) {
        result.push(items[i]);
      }
    }
    return result;
  };
});

/**
 * @memberof resdesk
 * @ngdoc filter
 * @name dynamicFilter
 * @param {service} $filter the angular built-in filter service
 * @description 
 *   A custom filter that allows different filter types to be applied
 *   depending on the given type of the object/variable
 * @example 
 *   <table>
 *      <tbody>
 *        <tr ng-repeat="row in tableData">
 *          <td ng-repeat="(key, value) in row">{{value.value | dynamicFilter: value.format}}</td>
 *          <!-- Where value.format is another valid angular filter, like 'currency: $' or 'date:shortTime' --> 
 *        </tr>
 *      <tbody>
 *   </table>
 */
app.filter('dynamicFilter', function ($filter) {
  /**
   * Attach Enter key listener to given element 
   * @memberof dynamicFilter
   * @param {any | string} value the raw value (usually a string) that will be formatted
   * @param {string} filterSpec the angular parsed filterSpec that tells how to format value
   */
  return function (value, filterSpec) {
    if (filterSpec == 'bool') {
      if (typeof (value) != 'boolean') {
        return value ? value : 'No';
      }
      return value ? 'Yes' : 'No';
    }
    var args = filterSpec.split(':');
    if (args[0].length < 1 || args[0] == "null" || args[0] == "none") {
      return value;
    }
    var filter = $filter(args.shift());
    args.unshift(value);
    return filter.apply(null, args);
  };
});