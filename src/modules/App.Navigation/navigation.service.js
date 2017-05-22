/**
 * @memberof resdesk
 * @ngdoc service
 * @name $nav
 * @param {service} $state Angular document wrapper
 * @param {factory} Helper ResDesk Helper factory
 * @description 
 *   Application primary navigation service
 */
app.service("$nav", function ($state, Helper) {

  /**
   * the array of standard pages
   * @type {Array}
   * @private
   * @memberOf $nav
   * @author Brandon Groff
   */
  var pages = [];
  /**
   * the array of admin-only pages
   * @type {Array}
   * @private
   * @memberOf $nav
   * @author Brandon Groff
   */
  var adminPages = [];

  /**
   * Dynamically generate the sidebar from the registered $state service, set pages and adminPages
   * @private
   * @memberof $nav
   * @author Brandon Groff
   */
  var generateSidebar = function () {
    var stateList = $state.get();

    stateList.forEach(function (state) {
      //only use parent level routes, ignore 1st abstract state
      if (!state.parent && state.name.length > 1) {
        
        if (!state.data){
          return; //works as continue in the forEach context
        }

        if (state.data.excludeSidenav) {
          return; //works as continue in the forEach context
        }

        if (state.data.requiresAdmin) {
          adminPages.push(state.data);
        } else {
          pages.push(state.data);
        }
      }
    });

    adminPages = Helper.bubbleSort(adminPages, 'order');
    pages = Helper.bubbleSort(pages, 'order');
  };
  generateSidebar();

  /**
   * is the sideNav visible
   * @type {boolean}
   * @memberOf $nav
   * @author Brandon Groff
   * @default false
   */
  this.sideNavVisible = false;

  /**
   * Show the side nav
   * @memberof $nav
   * @author Brandon Groff
   */
  this.showSideNav = function () {
    this.sideNavVisible = true;
  };

  /**
   * Hide the side nav
   * @memberof $nav
   * @author Brandon Groff
   */
  this.hideSideNav = function () {
    this.sideNavVisible = false;
  };

  /**
   * Get the sidebar page list
   * @memberof $nav
   * @author Brandon Groff
   * @returns {Array} Array of $state objects
   */
  this.getPages = function () {
    return pages;
  };

  /**
   * Get the list of admin-only pages
   * @memberof $nav
   * @author Brandon Groff
   * @returns {Array} Array of $state objects
   */
  this.getAdminPages = function () {
    return adminPages;
  };

});