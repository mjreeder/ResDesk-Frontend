/**
 * @memberof resdesk.user
 * @ngdoc service
 * @name $user
 * @param {factory} NotificationAPI the NotificationAPI from resdesk.notification
 * @param {service} $auth the Auth service from resdesk.auth
 * @description
 *   General service that provides access to User Managment and related functions
 */
app.service("$user", function (NotificationAPI, $auth, $MaterialToast, $interval) {

  var self = this;

  this.unreadNotifications = 0;

  /**
   * Initialization function that performs initial notifications load and sets up
   * an auto-refresh of 5 minutes
   * @private
   * @memberof $user
   * @author Brandon Groff
   */
  var init = function () {

    var loadNotifications = function () {
      NotificationAPI.getAllUnread()
        .then(function (response) {
          self.unreadNotifications = response.data.data.length;

        }).catch(function (error) {
          if (error.data && error.data.description) {
            $MaterialToast.showError(error.data.description);
          } else {
            $MaterialToast.showError("An error occured getting notifications");
          }
        });
    };

    loadNotifications();
    $interval(loadNotifications, 5000); //5 seconds
  };

  init();

  /**
   * Parse the token into a more application friendly User object
   * @author Brandon Groff
   * @memberof $user
   * @param   {object} parsedToken the parsed JWT token
   * @returns {object} the User object
   *
   * | member name       | Description                                                              |
   * |-------------------|--------------------------------------------------------------------------|
   * | name              | The user's combined name                                                 |
   * | email             | The user's email                                                         |
   * | accessPermissions | An object containing the array of user allowed `roles` and `halls`       |
   * | activeRole        | The current Role the user is acting under. Defaults to highest permitted |
   * | currentHall       | The current hall the User is interacting with                            |
   */
  var parseInfoFromToken = function (parsedToken) {
    return {
      name: parsedToken.name.first + ' ' + parsedToken.name.last,
      bsu_id: parsedToken.sub,
      email: parsedToken.email,
      accessPermissions: {
        halls: parsedToken.permissions.halls,
        roles: parsedToken.permissions.roles
      },
      activeRole: parsedToken.permissions.roles[0],
      currentHall: parsedToken.permissions.halls[0]
    };
  };

  /**
   * Reusable function to validate object ownership
   * @author Brandon Groff
   * @memberof $user
   * @param   {object} item any object that can have an owner
   * @returns {boolean} true/false
   */
  this.ownedByThisUser = function (item) {
    //TODO: Revise this function once real system in place
    if (!item) {
      return false;
    } else if (item.from) {
      if (typeof (item.from) == 'string') {
        return item.from == this.getUserInfo().name;
      } else if (typeof (item.from) == 'object') {
        return item.from.email == this.getUserInfo().email;
      } else {
        return false;
      }
    }

    return false;
  };

  /**
   * Check if the current user is an admin
   * @memberof $user
   * @memberof $user
   * @author Brandon Groff
   * @returns {boolean} true/false
   */
  this.isAdmin = function () {
    var token = $auth.getParsedToken();
    if (token.permissions.roles.indexOf('admin') != -1) {
      return true;
    }
    return false;
  };

  /**
   * Get all info for the current User
   * @author Brandon Groff
   * @memberof $user
   * @returns {object} the User as an object
   *
   * | member name       | Description                                                              |
   * |-------------------|--------------------------------------------------------------------------|
   * | name              | The user's combined name                                                 |
   * | email             | The user's email                                                         |
   * | accessPermissions | An object containing the array of user allowed `roles` and `halls`       |
   * | activeRole        | The current Role the user is acting under. Defaults to highest permitted |
   * | currentHall       | The current hall the User is interacting with                            |
   */
  this.getUserInfo = function () {
    var token = $auth.getParsedToken();
    return parseInfoFromToken(token);
  };

  /**
   * A link function to NotificationAPI.getAll
   * @author Brandon Groff
   * @memberof $user
   */
  this.getNotifications = NotificationAPI.getAll;

  /**
   * A link function to $auth.logout
   * @author Brandon Groff
   * @memberof $user
   */
  this.logout = $auth.logout;

});
