/**
 * @ngdoc directive
 * @memberOf resdesk.calendar
 * @name calendar
 * @param {factory} CalendarAPI ResDesk calendar api
 * @param {service} $compile Angular service
 * @param {service} $rootScope Angular service
 * @param {service} $MaterialModal modal service from resdesk.modal
 * @param {service} $MaterialToast toast service from resdesk.toast
 * @param {service} $user ResDesk user service
 * @param {factory} Helper  ResDesk helper factory
 * @description
 *  reusable Calendar directive that uses FullCalendar. Usable by element only
 *
 *  [https://fullcalendar.io/docs/](https://fullcalendar.io/docs/)
 *
 * @example
 *
 * <calendar></calendar>
 */
calendarModule.directive('calendar', function(CalendarAPI, $compile, $rootScope, $MaterialModal, $MaterialToast, $user, Helper, $location) {
  return {
    restrict: 'E',
    templateUrl: calendarModule.path + '/component/calendar.directive.html',
    link: function(scope, element) {
      var events = [];
      /**
       * @memberof calendar
       * @author Brandon Groff
       * @description
       *  Trigger FullCalendar reload/rerender functions
       */
      function reloadCalendar() {
        if (!events || events.length == 0) {
          $('#calendar').fullCalendar('refetchEvents');
          $('#calendar').fullCalendar('rerenderEvents');
        } else {
          $('#calendar').fullCalendar('removeEvents');
          $('#calendar').fullCalendar('addEventSource', events);
          $('#calendar').fullCalendar('rerenderEvents');
        }
      };

      var currentTab = $location.path().split('/')[2];
      var init = function() {
        var initalLoad;
        if (currentTab == "me") {
          initalLoad = CalendarAPI.loadEvents($user.getUserInfo().bsu_id);
        } else if (currentTab == "desk") {
          initalLoad = CalendarAPI.getEventsByHall($user.getUserInfo().currentHall);
        }

        initalLoad.then(function(response) {
          events = CalendarAPI.parseForCalendar(response);
          reloadCalendar();
        });
      }

      init();

      $('#calendar').fullCalendar({
        header: {
          right: 'prev,next,month,agendaWeek,agendaDay'
        },
        defaultView: 'agendaWeek',
        timezone: 'local',
        height: 'parent',
        nowIndicator: true,
        events: events,
        editable: true,
        eventClick: function(event, e, view) {
          document.activeElement.blur();
          //note: $user.id and event user id don't actually exist yet
          //          if ($user.id === event.user.id)
          if (true) {
            Helper.log(event);

            var modalInstance = $MaterialModal.showModal({
              templateUrl: calendarModule.path + 'modals/event.edit.html',
              controller: 'EventEditModal',
              passData: event
            }).then(function(modal) {
              modal.close.then(function(result) {
                //fucntion doesn't actually exist
                //API.Calendar.updateEvent(result, angular.copy(event)).finally(reloadCalendar);
              }, function(reason) {
                if (reason === 'delete') {
                  reloadCalendar();
                }
              });
            });

          } else {
            var modalInstance = $MaterialModal.showModal({
              templateUrl: calendarModule.path + 'modals/event.view.html',
              controller: 'EventViewModal',
              passData: event
            });
          }
        },
        selectable: true,
        select: function(start, end) {
          document.activeElement.blur();
          var modalInstance = $MaterialModal.showModal({
            templateUrl: calendarModule.path + 'modals/event.create.html',
            controller: 'EventCreateModal',
            passData: {
              event: {
                start: start,
                end: end
              }
            }
          }).then(function(modal) {
            modal.close.then(function(result) {
              events.push(CalendarAPI.parseForCalendar(result.data.data));
              reloadCalendar();
            });
          });

        },
        eventDrop: function(event, delta, revertFunc) {
          //use this area to update the time range of the event
          //                    event.reservation.time_out = moment(event.start).unix();
          //                    event.reservation.time_in = moment(event.end).unix();
          //                    var tmpEvent = angular.copy(event);
          //                    EventFactory.updateEvent(tmpEvent, tmpEvent).then(function() {
          //                        console.log("event updated");
          //                    }, function() {
          //                        revertFunc();
          //                    });
        },
        eventResize: function(event, delta, revertFunc) {
          //use this area to update the time range of the event
          //                    event.reservation.time_out = moment(event.start).unix();
          //                    event.reservation.time_in = moment(event.end).unix();
          //                    var tmpEvent = angular.copy(event);
          //                    EventFactory.updateEvent(tmpEvent, tmpEvent).then(function() {
          //                        console.log("event updated");
          //                    }, function() {
          //                        revertFunc();
          //                    });
        }
      });
      //The fullCalendar object

    }
  }
});
