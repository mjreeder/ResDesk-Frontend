commModule.controller('CommunicationLogController', function ($scope, $filter, CommLogAPI, $MaterialModal, $rootScope, $MaterialToast) {

  $scope.loading = false;

  var loadRecent = function () {
    $scope.loading = true;
    $scope.messages = [];
    $scope.filteredMessages = [];

    CommLogAPI.getRecentMessages()
      .then(function (response) {
        $scope.messages = CommLogAPI.parseMessages(response);
        $scope.filteredMessages = angular.copy($scope.messages);

      }).catch(function (error) {
        console.error(error);
        if (error.data) {
          $MaterialToast.showError(error.data.msg);
        } else {
          $MaterialToast.showError('An error occurred loading the Comm Log');
        }

      }).finally(function () {
        $scope.loading = false;
      });
  };

  var init = function () {
    $scope.showingAll = false;
    loadRecent();
  };

  init();


  $scope.loadAllMessages = function () {

    $scope.loading = true;
    $scope.messages = [];
    $scope.filteredMessages = [];

    CommLogAPI.getAllMessages()
      .then(function (response) {
        $scope.messages = CommLogAPI.parseMessages(response);
        $scope.filteredMessages = angular.copy($scope.messages);
        $scope.showingAll = true;
      }).catch(function (error) {
        console.error(error);
        if (error.data) {
          $MaterialToast.showError(error.data.msg);
        } else {
          $MaterialToast.showError('An error occurred loading the Comm Log');
        }

      }).finally(function () {
        $scope.loading = false;
      });

  };

  //  $scope.messages = CommLogAPI.loadMessages();
  //  $scope.filteredMessages = $scope.messages;


  //  $scope.ownedByThisUser = $rootScope.$user.ownedByThisUser;


  // performs search functionality based on the ng-change directive on 
  // the search field. Is minisculy more efficient than handling the 
  // search only with directives in html
  $scope.searchChange = function (searchText) {
    var filtered = $filter('filter')($scope.messages, searchText);
    filtered = $filter('orderBy')(filtered, 'time');
    $scope.filteredMessages = filtered;
  };

  $scope.newMessage = function () {

    $MaterialModal.showModal({
      templateUrl: commModule.path + "modals/commLog.create.html",
      controller: "CommLogCreateModal"
    }).then(function (modal) {
      modal.close.then(function (result) {
        $scope.modalResult = result;
        //reload
        init();
      });
    });

  };

  $scope.editMessage = function (message) {

    $MaterialModal.showModal({
      templateUrl: commModule.path + "modals/commLog.edit.html",
      controller: "CommLogEditModal",
      passData: message
    }).then(function (modal) {
      modal.close.then(function (result) {
        $scope.modalResult = result;
        //reload
        init();
      });
    });

  };

  $scope.deleteMessage = function (message) {
    if (confirm("Are you sure you want to delete this message?")) {
      $scope.loading = true;
      CommLogAPI.delete(message.id)
        .then(function (response) {
          $MaterialToast.showToast(response.data.description);
        }).catch(function (error) {
          console.error(error);
          if (error.data) {
            $MaterialToast.showError(error.data.message);
          } else {
            $MaterialToast.showError('An error occurred sending the message');
          }
        }).finally(function () {
          $scope.loading = false;
          //reload
          init();
        });
    }
  };

});
