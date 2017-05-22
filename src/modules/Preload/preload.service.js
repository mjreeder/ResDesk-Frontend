preloadModule.service("$preload", function ($templateCache, $http, $user, $timeout, Helper) {

  var self = this;

  //a minimum load screen time, for user familiarity
  var minTime = 1500;

  var directives = [
    'calendar',
    'loadingIndicator',
    'materialTable',
    'navigation',
    'directoryAutocomplete'
  ];

  var views = [
    'analytics',
    'calendar',
    'calendar/admin',
    'calendar/deskStaff',
    'calendar/raRhd',
    'calendar/user',
    'cashLog/history',
    'cashLog/total',
    'cashLog',
    'commLog',
    'directory',
    'home',
    'lockouts',
    'lostFound',
    'notifications',
    'reminders',
    'settings'
  ];

  var modals = [
    'lostFound/create',
    'lostFound/update',
    'lockout',
    'cashLog/create',
    'cashLog/postage',
    'cashLog/refund',
    'commLog/create',
    'commLog/edit',
    'reminders/create',
    'reminders/edit',
    'calendar/event-create',
    'calendar/event-edit',
    'calendar/event-view'
  ];

  /**
   * Load all templates html files for future use
   * @author Brandon Groff
   * @returns {Promise} A Promise that always resolves successfully
   */
  this.loadTemplatesOld = function () {
    var masterProm = new Promise(function (resolve, reject) {

      var promArray = [];
      //Directives
      for (var i = 0; i < directives.length; i++) {
        var thisdir = directives[i];
        var prom = $http.get('views/directives/' + thisdir + '.html');
        promArray.push(prom);
      }

      //Views
      for (var i = 0; i < views.length; i++) {
        var thisdir = views[i];
        var prom = $http.get('views/' + thisdir + '.html');
        promArray.push(prom);
      }

      //Modals
      for (var i = 0; i < modals.length; i++) {
        var thisdir = modals[i];
        var prom = $http.get('views/modals/' + thisdir + '.html');
        promArray.push(prom);
      }

      Promise.all(promArray).then(values => {
        values.forEach(function (response) {
          $templateCache.put(response.config.url, response.data);
        });
        resolve('Success');
      }, err => {
        console.log(err);
        
        resolve(err);
      });

    });
    return masterProm;
  };

  /**
   * Preload all application data, including templates and user data
   * @author Brandon Groff
   * @returns {Promise} A Promise that always resolves successfully unless the user isn't logged in validly
   */
  this.all = function () {
    var masterProm = new Promise(function (resolve, reject) {
      var promArr = [
        self.loadTemplatesOld(),
        $timeout(function () {}, minTime)
                    ];
      //$user.loadData();


      Promise.all(promArr).then(values => {
        resolve('Success');
      }, err => {
        
        Helper.log(err);
        resolve(err);
      });
    });
    return masterProm;
  };
  
  
  /**
   * Load given files for future use
   * @author Brandon Groff
   * @param {string[]} array of files, as a string
   * @returns {Promise} A Promise that always resolves successfully
   */
  this.loadFiles = function(fileArr) {
    var masterProm = new Promise(function (resolve, reject) {
      var promArr = [];

      for (var i = 0; i < fileArr.length; i++) {
        var file = fileArr[i];
        var prom = $http.get(file);
        promArr.push(prom);
      }
      

      Promise.all(promArr).then(values => {
        //cache the loaded files now
        values.forEach(function (response) {
          $templateCache.put(response.config.url, response.data);
        });
        
        resolve({
          success: true,
          loaded: values.length + ' files'
        });
      }, err => {
        
        Helper.log(err);
        resolve(err);
        
      });
    });
    
    return masterProm;
  };

});