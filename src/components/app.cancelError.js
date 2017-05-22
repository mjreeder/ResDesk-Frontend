/**
 * @memberof resdesk
 * @ngdoc class
 * @description creates a custom Error object with a message
 * @class
 * @classdesc A custom Error type for Cancelled network requests.
 * @constructor
 * @param {string} message - The reason for the cancel
 */
function CancelError(message) {
  this.message = message;
  var last_part = new Error().stack.match(/[^\s]+$/);
  this.stack = `${this.name} at ${last_part}`;
}

CancelError.prototype = Object.create(Error.prototype);

/**
 * an instance member, CancelError#name.
 * @memberof CancelError.prototype
 */
CancelError.prototype.name = "CancelError";

/**
 * an instance member, CancelError#message.
 * @memberof CancelError.prototype
 */
CancelError.prototype.message = "";

CancelError.prototype.constructor = CancelError;