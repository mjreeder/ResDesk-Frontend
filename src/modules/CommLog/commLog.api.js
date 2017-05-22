/**
 * @memberof resdesk.commlog
 * @ngdoc factory
 * @name CommLogAPI
 * @param {service} AppConfig     ResDesk Application config/settings
 * @param {service} $http         Angular $http service
 * @param {service} $user         ResDesk $user service
 * @description 
 *   Factory for ResDesk Communicator related requests
 */
commModule.factory('CommLogAPI', function ($http, AppConfig, $user, Student) {

  var factory = {};

  /**
   * The base url for network requests
   * @private
   * @type {string}
   * @memberof CommLogAPI
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/communicator/'
   */
  var baseUrl = AppConfig.baseUrl + '/communicator';

  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10015/communicator';
  }

  //  var fakeData = [
  //    {
  //      "id": 0,
  //      "title": "Message 1",
  //      "from": "Matt Reeder",
  //      "to": "Everyone",
  //      "body": "Hello world",
  //      "timestamp": Date.now()
  //      },
  //    {
  //      "id": 1,
  //      "title": "Message 2",
  //      "from": "Rich Downey",
  //      "to": "You",
  //      "body": "Nerd",
  //      "timestamp": Date.now()
  //      },
  //    {
  //      "id": 2,
  //      "title": "Message 3",
  //      "from": "Rich Downey",
  //      "to": "You",
  //      "body": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus",
  //      "timestamp": Date.now()
  //      },
  //    {
  //      "id": 3,
  //      "title": "Message 4",
  //      "from": "Rich Downey",
  //      "to": "You",
  //      "body": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus",
  //      "timestamp": Date.now()
  //      },
  //    {
  //      "id": 4,
  //      "title": "Message 5",
  //      "from": "Matt Reeder",
  //      "to": "Everyone",
  //      "body": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus",
  //      "timestamp": Date.now()
  //      }
  //    ];

  factory.parseMessages = function (response) {
    var data = angular.copy(response.data.data);
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        var message = data[i];
        for (var j = 0; j < message.to.length; j++) {
          var person = message.to[j];
          message.to[j] = new Student(person);
        }
      }
      return data;
    } else {
      var message = data;
      for (var j = 0; j < message.to.length; j++) {
        var person = message.to[j];
        message.to[j] = new Student(person);
      }
      return message;
    }
  };
  
  /**
   * get all CommLog messages within the last week
   * @memberof CommLogAPI
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.getRecentMessages = function () {
    return $http({
      method: 'GET',
      url: baseUrl + '/recent'
    });
  };
  

  /**
   * get all CommLog messages for this user
   * @memberof CommLogAPI
   * @author Brandon Groff
   * @returns {Promise} $http Promise
   */
  factory.getAllMessages = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

  /**
   * Create a comm log messages
   * @author Brandon Groff
   * @param   {string} title message title
   * @param   {string} body  body text
   * @param   {Student[]} to    array of Students to be notified
   * @returns {Promise} $http Promise
   */
  factory.createMessage = function (title, body, to) {
    if (!title) {
      console.error('Missing required: title');
      return;
    }
    if (!body) {
      console.error('Missing required: body');
      return;
    }
    if (!to) {
      console.error('Missing required: to');
      return;
    }
    if (!Array.isArray(to) || to.length == 0 || !(to[0] instanceof Student)) {
      console.error('Invalid parameter: to must be an array of Students');
    }

    var parsedTo = [];
    to.forEach(function (student) {
      parsedTo.push(student.exportToObject());
    });

    return $http({
      method: 'POST',
      url: baseUrl,
      data: {
        title: title,
        body: body,
        from: $user.getUserInfo(),
        to: parsedTo
      }
    });
  };

  /**
   * Update a comm log messages
   * @author Brandon Groff
   * @param   {string}  messageId id of the message to update
   * @param   {object}  data        the date to update with
   * @returns {Promise} $http Promise
   */
  factory.updateMessage = function (messageId, data) {
    if (!messageId) {
      console.error('Missing required: title');
      return;
    }
    if (!data || !data.to || !data.title || !data.body) {
      console.error('Missing required: data');
      return;
    }

    var parsedTo = [];
    data.to.forEach(function (student) {
      parsedTo.push(student.exportToObject());
    });

    return $http({
      method: 'PUT',
      url: baseUrl + '/' + messageId,
      data: {
        title: data.title,
        body: data.body,
        from: $user.getUserInfo(),
        to: parsedTo
      }
    });
  };
  
  
  factory.delete = function(messageId) {
    if (!messageId) {
      console.error('Missing required: messageId');
      return;
    }
    return $http({
      method: 'DELETE',
      url: baseUrl + '/' + messageId
    });
  };

  return factory;
});
