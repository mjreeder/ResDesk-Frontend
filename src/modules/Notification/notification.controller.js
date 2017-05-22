/**
 * @memberof resdesk.notification
 * @ngdoc controller
 * @name NotificationsController
 * @description Controller for Directory lookup view
 * @param {service} $scope  Angular service
 * @param {factory} NotificationAPI   ResDesk Notification api
 * @param {factory} $user   ResDesk user service
 * @param {factory} $MaterialToast   ResDesk toast service
 * @author Brandon Groff
 */
notificationModule.controller('NotificationsController', function ($scope, $user, NotificationAPI, $MaterialToast) {

  /**
   * Controller initialization function, performs initial notifications load
   * @memberof NotificationsController
   * @author Brandon Groff
   */
  var init = function () {

    NotificationAPI.getAll()
      .then(function (response) {
        $scope.notifications = response.data.data;

      }).catch(function (error) {

        if (error.data && error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError("An error occured getting notifications");
        }
      });
  }

  init();

  /**
   * Ng-click function to toggle the read status of a notification
   * @memberof NotificationsController
   * @author Brandon Groff
   * @param {object} notification the notification object to updae
   */
  $scope.toggleReadStatus = function (notification) {

    if (notification.read) {
      NotificationAPI.markAsUnread(notification.id).then(function (response) {
        $MaterialToast.showToast(response.data.description);
        $user.unreadNotifications += 1;
      }).catch(function (error) {
        if (error.data && error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError("An error occured marking notifications as unread.");
        }
      });

    } else {

      NotificationAPI.markAsRead(notification.id).then(function (response) {
        $MaterialToast.showToast(response.data.description);
        $user.unreadNotifications -= 1;
      }).catch(function (error) {
        if (error.data && error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError("An error occured marking notification as read.");
        }
      });
    }
  };

  /**
   * Ng-click function to mark all notifications as read
   * @memberof NotificationsController
   * @author Brandon Groff
   */
  $scope.markAllRead = function () {

    NotificationAPI.markAllRead().then(function (response) {
      $MaterialToast.showToast(response.data.description);
      $user.unreadNotifications = 0;
    }).catch(function (error) {
      if (error.data && error.data.description) {
        $MaterialToast.showError(error.data.description);
      } else {
        $MaterialToast.showError("An error occured marking notifications as read.");
      }
    });
  };

  /**
   * Ng-click function to mark all notifications as unread
   * @memberof NotificationsController
   * @author Brandon Groff
   */
  $scope.markAllUnread = function () {

    NotificationAPI.markAllUnread().then(function (response) {
      $MaterialToast.showToast(response.data.description);
      $user.unreadNotifications = response.data.data.length;
    }).catch(function (error) {
      if (error.data && error.data.description) {
        $MaterialToast.showError(error.data.description);
      } else {
        $MaterialToast.showError("An error occured marking notifications as unread.");
      }
    });
  };

});
