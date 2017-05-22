/**
 * The API Reminders
 * @namespace Directory
 * @memberof API
 * @author Brandon Groff
 */

reminderModule.factory('ReminderAPI', function ($http, $timeout, $filter, AppConfig) {

  var factory = {};
  
  var baseUrl = AppConfig.baseUrl + '/reminders/';

  var fakeData = [
    {
      'title': 'Kronos',
      'description': 'Reminder to clock out of Kronos',
      'id': 1,
      'settings': {
        'appliesTo': 'staff',
        'firesOn': {
          'time': null,
          'event': 'shiftEnd',
          'offset': 10 //minutes
        },
        'repeats': true,
      },
      'active': true
    },
    {
      'title': 'Count Cash Drawer',
      'description': 'Reminder for desk staff to count out',
      'id': 2,
      'settings': {
        'appliesTo': 'staff',
        'firesOn': {
          'time': null,
          'event': 'shiftEnd',
          'offset': 20 //minutes
        },
        'repeats': true
      },
      'active': true
    },
    {
      'title': 'Kronos',
      'description': 'Reminder to clock in to Kronos',
      'id': 1,
      'settings': {
        'appliesTo': 'staff',
        'firesOn': {
          'time': null,
          'event': 'shiftStart',
          'offset': 0 //minutes
        },
        'repeats': true
      },
      'active': true
    },
    {
      'title': 'Count Cash Drawer',
      'description': 'Reminder for desk staff to count in',
      'id': 4,
      'settings': {
        'appliesTo': 'staff',
        'firesOn': {
          'time': null,
          'event': 'shiftEnd',
          'offset': -20 //minutes
        },
        'repeats': true,
      },
      'active': false
    }
  ];


  /**
   * Get all Reminders
   * @author Brandon Groff
   */
  factory.getAll = function () {
    return fakeData;
  };

  factory.getActive = function () {
    var parsed = [];
    fakeData.forEach(function (item) {
      if (item.active) {
        parsed.push(item);
      }
    });
    return parsed;
  };

  return factory;
});