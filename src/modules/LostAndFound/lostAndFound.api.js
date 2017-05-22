/**
 * @memberof resdesk.lostandfound
 * @ngdoc factory
 * @name LostAndFoundAPI
 * @param {service} $httpCancellable     custom $http service
 * @param {object} AppConfig  ResDesk Application config/settings
 * @param {constant} LostAndFoundMaterialTable  ResDesk Lost and Found constants
 * @param {service} $user ResDesk user service
 * @description 
 *   Factory for ResDesk Lost and Found related requests and post-processing
 */
lostandfoundModule.factory('LostAndFoundAPI', function ($httpCancellable, AppConfig, LostAndFoundMaterialTable, $user) {

  var factory = {};

  /**
   * The base url for auth network requests
   * @private
   * @type {string}
   * @memberof LostAndFoundAPI
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/lostfound'
   */
  var baseUrl = AppConfig.baseUrl + '/lostfound';

  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10017/lostfound';
  }

  /**
   * Parse the lockouts response to MaterialTable display format
   * @memberof LostAndFoundAPI
   * @author Brandon Groff
   * @param   {object} response $http Promise success response
   * @returns {object} parsed MaterialTable-ready object
   */
  factory.parseResponseToTableFormat = function (response) {
    var tableHeaders = angular.copy(LostAndFoundMaterialTable.headers);
    var data = angular.copy(LostAndFoundMaterialTable.data);

    var lostItems = response.data.data;

    lostItems.forEach(function (item) {
      var template = angular.copy(LostAndFoundMaterialTable.dataFormat);
      template.id = item.id;
      template.date.value = moment(item.createdAt).toDate();
      template.email.value = item.email;
      template.item.value = item.item;
      template.comments.value = item.comments;

      data.push(template);
    });


    return {
      headers: tableHeaders,
      data: data
    };
  };

  /**
   * Reformat a lost and found item's time based properties to moment objects 
   * @memberof LostAndFoundAPI
   * @author Brandon Groff
   * @param   {object}   item a lost and found item
   * @returns {object} a lost and found item
   */
  factory.parseItemTimesToMoment = function (item) {
    item.createdAt = moment(item.createdAt);
    item.updatedAt = moment(item.updatedAt);
    return item;
  }


  factory.createEmailMessageFromItem = function (lostFoundItem) {
    var message = "This is a generated notification to inform you that the following item has been turned in at " + $user.getUserInfo().currentHall + ".\n";

    message += "\n\n " + lostFoundItem.item;
    message += "\n Additional Comments: " + lostFoundItem.comments;
    message += "\n\n If you believe this item may be yours, please see the desk staff during day hours to retrieve it.";

    message += "\n\n Thank you!";

    return message;
  }


  /**
   * Get all lost and found items
   * @memberof LostAndFoundAPI
   * @author Brandon Groff
   * @returns {Promise} an $httpCancellable Promise
   */
  factory.getAll = function () {
    return $httpCancellable({
      method: 'GET',
      url: baseUrl
    });
  };

  /**
   * Create a new Lost and Found item
   * @memberof LostAndFoundAPI
   * @author Brandon Groff
   * @param   {string} item     an item string
   * @param   {Student|undefined} student  Optional: the student the item might belong to
   * @param   {string|undefined} comments Optional: comments on the lost item
   * @returns {Promise} a $httpCancellable Promise
   */
  factory.createItem = function (item, student, comments) {
    if (!item) {
      console.error('Missing property: item');
      return;
    }

    return $httpCancellable({
      method: 'POST',
      url: baseUrl,
      data: {
        item: item,
        email: student ? student.email : undefined,
        comments: comments
      }
    });
  };

  /**
   * Get a lost and found item by id
   * @memberof LostAndFoundAPI
   * @author Brandon Groff
   * @param   {string} id a unique lost and found item id
   * @returns {Promise} $httpCancellable Promise
   */
  factory.getById = function (id) {
    if (!id) {
      console.error('Missing required: id');
      return;
    }

    return $httpCancellable({
      method: 'GET',
      url: baseUrl + '/' + id
    });
  }

  /**
   * Update a Lost and Found item
   * @memberof LostAndFoundAPI
   * @author Brandon Groff
   * @param   {Object}   item a lost and found item with fields: `id`, `item`, `resdident.email`, and `comments`.
   * @returns {Promise} $httpCancellable Promise
   */
  factory.updateItem = function (item) {
    if (!item) {
      console.error('Missing required: item');
      return;
    }
    if (!item.hasOwnProperty('id')) {
      console.error('Missing required: item.id');
      return;
    }

    return $httpCancellable({
      method: 'PUT',
      url: baseUrl + '/' + item.id,
      data: {
        item: item.item,
        email: !item.resident ? null:item.resident.email,
        comments: item.comments
      }
    });
  };

  /**
   * Mark a Lost & Found item as Found
   * @author Brandon Groff
   * @param   {number}        itemId     the id of the lost and found item returned
   * @param   {string|object} returnedTo   the person the object was returned to
   * @returns {Promise}       $httpCancellable Promise
   */
  factory.markAsFound = function (itemId, returnedTo) {
    if (!itemId) {
      console.error('Missing required: itemId');
      return;
    }
    if (!returnedTo) {
      console.error('Missing required: returnedTo');
      return;
    }
    
    return $httpCancellable({
      method: 'PUT',
      url: baseUrl + '/return/' + itemId,
      data: {
        returnedTo: returnedTo
      }
    });
  };

  /**
   * Delete a Lost & Found item
   * @memberof LostAndFoundAPI
   * @author Brandon Groff
   * @param   {string} itemId the lost and found item unique id
   * @returns {Promise} $httpCancellable Promise
   */
  factory.deleteItem = function (itemId) {
    if (!itemId){
      console.error('Missing required: itemId');
      return;
    }
    
    return $httpCancellable({
      method: 'DELETE',
      url: baseUrl + '/' + itemId,
    });
  };

  return factory;
});