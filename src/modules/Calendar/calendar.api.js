/**
 * @memberof resdesk.calendar
 * @ngdoc factory
 * @name CalendarAPI
 * @param {service} $http     Angular service
 * @param {object} AppConfig  ResDesk Application config/settings
 * @deprecated This API not yet connected to live service
 * @description
 *   Factory for ResDesk Calendar/Scheduling related requests
 */
calendarModule.factory('CalendarAPI', function($http, AppConfig) {
  var factory = {};

  /**
   * The base url for calendar network requests
   * @private
   * @type {string}
   * @memberof CalendarAPI
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/calendar'
   */
  var baseUrl = AppConfig.baseUrl + '/lostfound';

  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10013/calendar';
  }

  var fakeData = {
    events: [{
        title: 'Event1',
        start: '2017-04-14 8:00 PM',
        end: '2017-04-14 10:00 PM'
      },
      {
        title: 'Event2',
        start: '2016-12-14 4:00 PM',
        end: '2016-12-14 5:30 PM'
      }
    ],
    className: 'calendar-event',
    editable: true
  };

  var addIds = function() {
    for (var i = 0; i < fakeData.events.length; i++) {
      var event = fakeData.events[i];
      event.id = i;
    }
  };

  /**
   * @function get events for the user's selected calendar
   * @name loadEvents
   * @memberOf CalendarAPI
   * @author Brandon Groff
   * @returns {object} the events object for FullCalendar
   */
  factory.loadEvents = function(id) {
    var response = new Promise(function(resolve, reject) {
      $http.get(baseUrl + '/' + id).then(function(result) {
        result = factory.parseForCalendar(result.data.data);
        resolve(result);
      });
    });
    // return
    return response;
    // addIds();
    // return fakeData;
  };
  factory.parseForCalendar = function(data) {
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        var event = data[i];
        if (event.type == 'school') {
          event.color = 'red';
        } else if (event.type == 'work') {
          event.color = 'green';
        } else {
          event.color = 'yellow';
        }
        if (event.start_time) {
          event.start = event.start_time;
          event.end = event.end_time;
        }
      }
    }
    else {
      var event = data;
      if (event.type == 'school') {
        event.color = 'red';
      } else if (event.type == 'work') {
        event.color = 'green';
      } else {
        event.color = 'yellow';
      }
      if (event.start_time) {
        event.start = event.start_time;
        event.end = event.end_time;
      }
    }

    return data;
  };
  /**
   * @function Create an event
   * @name createEvent
   * @author Brandon Groff
   * @memberOf CalendarAPI
   * @param   {object} data the event data
   * @returns {object} the created event
   */
  factory.createEvent = function(data, hall) {
    var cleanedData = {
      bsu_id: data.bsu_id,
      type: data.type,
      title: data.title,
      description: data.description,
      start_time: moment(data.start_time).format(),
      end_time: moment(data.end_time).format(),
      hall: hall
    };
    return $http({
      method: 'POST',
      url: baseUrl,
      data: cleanedData
    });
  };

  factory.getEventsByHall = function(hall) {
    var response = new Promise(function(resolve, reject) {
      $http.get(baseUrl + "/hall/" + hall).then(function(result) {
        result = factory.parseForCalendar(result.data.data);
        resolve(result);
      });

    });
    // return
    return response;
  };

  factory.requestShiftChange = function(data) {
    return $http({
      method: 'POST',
      url: baseUrl + '/change',
      data: data
    });
  }

  return factory;
});
