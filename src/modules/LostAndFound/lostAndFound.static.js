/**
 * @description 
 * a constant providing header setup and a data template for 
 * turning a lockout into the appropriate format for 
 * Material Table directive
 * object properties: `headers`, `data`, `dataFormat`
 * - header: shouldn't be modified
 * - data: is an empty array
 * - dataFormat: is a template for a lockout item
 * 
 * Note: When importing and using these object properties, use
 * angular.copy to prevent direct object modification
 * 
 * @name LostAndFoundMaterialTable
 * @ngdoc constant
 * @type {string}
 * @memberOf resdesk.lostfound
 * @author Brandon Groff
 */
lockoutModule.constant('LostAndFoundMaterialTable', {
  headers: [
    {
      'name': 'Turned In',
      'short': 'date',
      'id': 0,
      'sortable': true
        },
    {
      'name': 'Item',
      'short': 'item',
      'id': 1,
      'sortable': true
        },
    {
      'name': 'Emailed',
      'short': 'email',
      'id': 2,
      'sortable': true
        },
    {
      'name': 'Comments',
      'short': 'comments',
      'id': 3,
      'sortable': false
        }
      ],
  data: [

    ],
  dataFormat: {
    'id': -1,
    'date': {
      'value': Date.now(),
      'format': "date:short"
    },
    'item': {
      'value': "example",
      'format': ''
    },
    'email': {
      'value': "example@example.com",
      'format': ''
    },
    'comments': {
      'value': "example",
      'format': ''
    }
  }
});