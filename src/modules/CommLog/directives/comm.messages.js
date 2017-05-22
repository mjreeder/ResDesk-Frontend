commModule.directive('commMessage', function ($user) {
  return {
    restrict: 'E',
    scope: {
      message: '=',
      editMessage: '=edit',
      deleteMessage: '=delete'
    },
    templateUrl: commModule.path + '/directives/comm.message.html',
    replace: true,
    link: function (scope, element, attrs) {

      var thisTooltip = $('.tooltipped');
      
      scope.$user = $user;

      var init = function () {

        var toStr = 'Sent To: ';
                
        scope.message.to.forEach(function(student){
          var fName;
          if (student.preferredName){
            fName = student.preferredName;
          } else {
            fName = student.firstName;
          }
          
          var name = fName + ' ' + student.lastName;
          toStr += name + ', ';
        });
        
        toStr = toStr.slice(0, -2);
        
        thisTooltip.tooltip({
          delay: 50,
          tooltip: toStr,
          position: 'right'
        });

      };




      scope.$watch('message', function (newVal) {
        if (newVal.from.email == $user.getUserInfo().email) {
          scope.sentBy = 'You';
        } else {
          scope.sentBy = newVal.from.name;
        }
      });


      scope.$on('$destroy', function () {
        thisTooltip.tooltip('remove');
      });


      init();
    }
  }
});
