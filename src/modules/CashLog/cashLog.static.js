/**
 * @description 
 * a constant providing header setup and a data template for 
 * turning cash log data into the appropriate format for 
 * Material Table directive
 * 
 * @name CashLogMaterialTable
 * @ngdoc constant
 * @type {object}
 * @memberOf resdesk.cashlog
 * @author Brandon Groff
 */
lockoutModule.constant('CashLogMaterialTable', {
  /**
   * Get the header structure for Material Table
   * @memberof CashLogMaterialTable
   * @author Brandon Groff
   * @returns {object[]} array of headers
   */
  getHeaders: function () {
    return [
      {
        'name': 'Time',
        'short': 'time',
        'id': 0,
        'sortable': true
        },
      {
        'name': 'Cash',
        'short': 'cash',
        'id': 1
        },
      {
        'name': 'Quarters',
        'short': 'quarters',
        'id': 2
        },
      {
        'name': 'Dimes',
        'short': 'dimes',
        'id': 3
        },
      {
        'name': 'Nickels',
        'short': 'nickels',
        'id': 4
        },
      {
        'name': 'Pennies',
        'short': 'pennies',
        'id': 5
        },
      {
        'name': 'Found',
        'short': 'found',
        'id': 6
        },
      {
        'name': 'Stamps',
        'short': 'stamps',
        'id': 7
        },
      {
        'name': 'Postage Due',
        'short': 'postage',
        'id': 8
        },
      {
        'name': 'Laundry Refunds',
        'short': 'laundry',
        'id': 9
        },
      {
        'name': 'Vending Refunds',
        'short': 'vending',
        'id': 10
        },
      {
        'name': 'Total',
        'short': 'total',
        'id': 11
        },
      {
        'name': 'Signed By',
        'short': 'signer',
        'id': 12,
        'hidden': true
       }
      ];
  },
  /**
   * Get the data structure for a MaterialTable data object in the Total view
   * @memberof CashLogMaterialTable
   * @author Brandon Groff
   * @returns {object} pre-formatted data object
   */
  getTotalDataTemplate: function () {
    return {
      time: {
        value: '',
        format: 'date:shortTime'
      },
      cash: {
        value: '',
        format: 'currency: $'
      },
      quarters: {
        value: '',
        format: 'currency: $'
      },
      dimes: {
        value: '',
        format: 'currency: $'
      },
      nickels: {
        value: '',
        format: 'currency: $'
      },
      pennies: {
        value: '',
        format: 'currency: $'
      },
      found: {
        value: '',
        format: 'currency: $'
      },
      stamps: {
        value: '',
        format: ''
      },
      postage: {
        value: '',
        format: 'currency: $'
      },
      laundry: {
        value: '',
        format: 'currency: $'
      },
      vending: {
        value: '',
        format: 'currency: $'
      },
      total: {
        value: '', //calculated
        format: 'currency: $'
      },
      signer: {
        value: '',
        format: ''
      }
    };
  },
  /**
   * Get the data structure for a MaterialTable data object in the History view
   * @memberof CashLogMaterialTable
   * @author Brandon Groff
   * @returns {object} pre-formatted data object
   */
  getHistoryDataTemplate: function () {
    return {
      time: {
        value: '',
        format: 'date:short'
      },
      cash: {
        value: '',
        format: 'currency: $'
      },
      quarters: {
        value: '',
        format: 'currency: $'
      },
      dimes: {
        value: '',
        format: 'currency: $'
      },
      nickels: {
        value: '',
        format: 'currency: $'
      },
      pennies: {
        value: '',
        format: 'currency: $'
      },
      found: {
        value: '',
        format: 'currency: $'
      },
      stamps: {
        value: '',
        format: ''
      },
      postage: {
        value: '',
        format: 'currency: $'
      },
      laundry: {
        value: '',
        format: 'currency: $'
      },
      vending: {
        value: '',
        format: 'currency: $'
      },
      total: {
        value: '', //calculated
        format: 'currency: $'
      },
      signer: {
        value: '',
        format: ''
      }
    };
  },
  /**
   * Get the defaultCash value for MaterialTable
   * @memberof CashLogMaterialTable
   * @author Brandon Groff
   * @returns {number} a float
   */
  getDefaultCash: function () {
    //TODO: Make this dynamic per hall
    return 150.00;
  },
  /**
   * Get current US Stamp price
   * @memberof CashLogMaterialTable
   * @author Brandon Groff
   * @returns {number} stamp price ($0.49)
   */
  getStampPrice: function () {
    return 0.49;
  }
});
