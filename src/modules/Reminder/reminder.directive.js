reminderModule.directive("reminder", function () {
  return ({
    restrict: "E",
    scope: {
      item: "=",
      activeOnly: "="
    },
    templateUrl: reminderModule.path + 'reminder.card.html',
    link: function link(scope, element, attributes) {
      
    }
  });

});