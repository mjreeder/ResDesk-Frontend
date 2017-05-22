/**
 * @memberof resdesk.email
 * @ngdoc factory
 * @name EmailAPI
 * @param {service} $httpCancellable     $http overlay service
 * @param {object} AppConfig  ResDesk Application config/settings
 * @param {constant} $MaterialToast  Toast notification service
 * @description 
 *   Factory for ResDesk Email send requests
 */
emailModule.factory('EmailAPI', function ($httpCancellable, AppConfig, $MaterialToast) {

  var factory = {};

  /**
   * The base url for auth network requests
   * @private
   * @type {string}
   * @memberof EmailAPI
   * @author Brandon Groff
   * @default AppConfig.baseUrl + '/mail'
   */
  var baseUrl = AppConfig.baseUrl + '/mail';

  if (AppConfig.dev) {
    baseUrl = 'http://localhost:10010/mail';
  }

  /**
   * Send emails. Generates toasts on successes/errors
   * @memberof EmailAPI
   * @author Brandon Groff
   * @param   {string[]|string} emails  an email string or array of emails
   * @param   {string}          subject the email subject
   * @param   {message}         message the email message
   * @param   {service}         service = 'UI' the microservice initiating this request
   * @returns {Promise}         a javascript Promise
   */
  factory.sendEmails = function (emails, subject, message, service = 'ResDesk') {
    if (!emails) {
      console.error('Missing required parameter: email');
      return;
    }
    if (!subject) {
      console.error('Missing required parameter: subject');
      return;
    }
    if (!message) {
      console.error('Missing required parameter: message');
      return;
    }

    if (!Array.isArray(emails)) {
      emails = [emails];
    }
    
    var parsedEmails = [];
    emails.forEach(function(email){
      parsedEmails.push({
        email: email
      });
    });
    
    return new Promise(function (resolve, reject) {
      $MaterialToast

      $httpCancellable({
        method: 'POST',
        url: baseUrl + '/create',
        data: {
          subject: subject,
          message: message,
          service: service,
          emails: parsedEmails
        }
      }).then(function (response) {

        var message = response.data.data.accepted.length + " email(s) sent.";
        $MaterialToast.showToast(message);

        if (response.data.data.rejected && response.data.data.rejected.length > 0) {
          var message2 = response.data.data.rejected.length + " email(s) failed to send.";
          $MaterialToast.showToast(message2, {
            notificationLevel: 'warning'
          });
        }

        resolve(response);
      }).catch(function (error) {
        if (error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError('An error occured sending the email');
        }


        resolve(error);
      });

    });
  }




  return factory;

});