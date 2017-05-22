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
 * @name LockoutMaterialTable
 * @ngdoc constant
 * @type {string}
 * @memberOf resdesk.lockout
 * @author Brandon Groff
 */
lockoutModule.constant('LockoutMaterialTable', {
  headers: [
    {
      'name': 'Name',
      'short': 'name',
      'id': 1,
      'sortable': true
        },
    {
      'name': 'Email',
      'short': 'email',
      'id': 2,
      'sortable': true
        },
    {
      'name': 'Number of Lockouts',
      'short': 'lockouts',
      'id': 3,
      'sortable': true
        },
    {
      'name': 'Student ID',
      'short': 'bsuid',
      'id': 4,
      'sortable': false,
      'hidden': true
        }
      ],
  data: [

    ],
  dataFormat: {
    'name': {
      'value': "Jon Appleseed",
      'format': ''
    },
    'email': {
      'value': "example@example.com",
      'format': ''
    },
    'lockouts': {
      'value': 1,
      'format': ''
    },
    'bsuid': {
      'value': "123456789",
      'format': ''
    }
  }
});