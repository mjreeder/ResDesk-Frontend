var reminderModule = angular.module('resdesk.reminder', ['resdesk.config', 'resdesk.helper']);

reminderModule.path = './src/modules/Reminder/';

reminderModule.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('Reminders', {
      url: "/reminders",
      templateUrl: reminderModule.path + "reminder.home.html",
      controller: 'RemindersController',
      data: {
        name: "Reminders",
        icon: "assignment_turned_in",
        sref: "Reminders",
        requiresAdmin: true,
        friendlyName: 'Reminders',
        order: 7 
      }
    });

});