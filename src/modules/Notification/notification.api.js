/**
 * @memberof resdesk.notification
 * @ngdoc factory
 * @name NotificationAPI
 * @param {service} AppConfig     ResDesk Application config/settings
 * @param {service} $http         Angular $http service
 * @description 
 *   Factory for ResDesk Notification related requests
 */
notificationModule.factory('NotificationAPI', function ($http, AppConfig) {

  var factory = {};

  /**
   * The base url for network requests
   * @private
   * @type {string}
   * @memberof NotificationAPI
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/notification'
   */
  var baseUrl = AppConfig.baseUrl + '/notification';

  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10018/profile/notification'
  }

  /**
   * Create a notification
   * @author Brandon Groff
   * @memberof NotificationAPI
   * @param   {string[]} toUsers array of User BSU id's
   * @param   {string} title   a string title
   * @param   {string} content a notification description/message
   * @returns {Promise} $http Promise
   */
  factory.create = function(toUsers, title, content) {
    if (!toUsers) {
      console.error('Missing required parameters: toUsers');
      return;
    }
    if (!title) {
      console.error('Missing required parameters: title');
      return;
    }
    if (!content) {
      console.error('Missing required parameters: content');
      return;
    }
    
    return $http({
      method: 'POST',
      url: baseUrl,
      data: {
        to: toUsers,
        title: title,
        content: content,
        read: false
      }
    });
  }
  
  /**
   * Get all notifications
   * @memberof NotificationAPI
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.getAll = function () {
    return $http({
      method: 'GET',
      url: baseUrl + "?read=all"
    });
  };

  /**
   * Get a notification by id
   * @author Brandon Groff
   * @param   {string}  id a unique notification id
   * @returns {Promise} $http Promise
   */
  factory.getForId = function (id) {
    if (!id) {
      console.error('Missing required parameters: id');
      return;
    }
    
    return $http({
      method: 'GET',
      url: baseUrl + "/" + id
    });
  };

  /**
   * Get all unread notifications for this user
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.getAllUnread = function () {
    return $http({
      method: 'GET',
      url: baseUrl + "?read=unread"
    });
  };

  /**
   * Get all read notifications for this user
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.getAllRead = function () {
    return $http({
      method: 'GET',
      url: baseUrl + "?read=read"
    });
  };

  /**
   * Mark a notification as read
   * @author Brandon Groff
   * @param   {string}  id a unique notification id
   * @returns {Promise} $http Promise
   */
  factory.markAsRead = function (id) {
    if (!id) {
      console.error('Missing required: Notification ID');
      return;
    }

    return $http({
      method: 'PUT',
      url: baseUrl + '/' + id + "?read=true"
    });
  };

  /**
   * Mark all notifications as read for this user
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.markAllRead = function () {
    return $http({
      method: 'PUT',
      url: baseUrl + "?read=true"
    });
  };

  /**
   * Mark a notification as unread
   * @author Brandon Groff
   * @param   {string}  id a unique notification id
   * @returns {Promise} $http Promise
   */
  factory.markAsUnread = function (id) {
    if (!id) {
      console.error('Missing required: Notification ID');
      return;
    }

    return $http({
      method: 'PUT',
      url: baseUrl + '/' + id + "?read=false"
    });
  };

  /**
   * Mark all notifications unread for this user
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.markAllUnread = function () {
    return $http({
      method: 'PUT',
      url: baseUrl + "?read=false"
    });
  };

  return factory;
});
