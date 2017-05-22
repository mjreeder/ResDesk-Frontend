/**
 * a Student
 * @class
 * @classdesc a Student from Directory service
 * @ngdoc class
 * @memberof Student
 * @author Brandon Groff
 * @param {object} studentInfo  the student data, all values optional
 *   -----------------------------------------------------------------------------------
 *   |      Key                  |         Value                                       |
 *   |---------------------------------------------------------------------------------|
 *   | bsu_id                    | the Student's unique id                             |
 *   | entry_name                | the student's comma delmited name. last, first      |
 *   | name_first                | first name                                          |
 *   | name_last                 | last name                                           |
 *   | name_preferred            | the preferred name. Robert -> Bob                   |
 *   | email                     | email                                               |
 *   | phone_mobile_cell         | the contact phone number                            |
 *   | room_space_description    | the residence hall code and room                    |
 *   | position                  | the work position. ie. desk staff                   |
 *   | term_detail               | the work location                                   |
 *   | position_date_start       | the work start date                                 |
 *   | position_date_end         | the work end date                                   |
 *   -----------------------------------------------------------------------------------
 */
function Student(studentInfo) {

  /**
   * @description a 9 digit id
   * @type {string | number | null}
   * @example 111222333
   */
  this.bsuId = studentInfo.hasOwnProperty('bsu_id') ? studentInfo['bsu_id'] : null;

  /**
   * @description a 9 digit id
   * @type {string | number | null}
   * @example 111222333
   */
  this.id = this.bsuId;

  /**
   * @description student name
   * @type {string | null}
   * @example Appleseed, Jonathan
   */
  this.name = studentInfo.hasOwnProperty('entry_name') ? studentInfo['entry_name'] : null;

  /**
   * @description first name
   * @type {string | null}
   * @example Jonathan
   */
  this.firstName = studentInfo.hasOwnProperty('name_first') ? studentInfo['name_first'] : null;

  /**
   * @description last name
   * @type {string | null}
   * @example Appleseed
   */
  this.lastName = studentInfo.hasOwnProperty('name_last') ? studentInfo['name_last'] : null;

  /**
   * @description Student email
   * @type {string | null}
   * @example jappleseed@bsu.edu
   */
  this.email = studentInfo.hasOwnProperty('email') ? studentInfo['email'] : null;

  /**
   * @description preferred name
   * @type {string | null}
   * @example Jon
   */
  this.preferredName = studentInfo.hasOwnProperty('name_preferred') ? studentInfo['name_preferred'] : null;

  /**
   * @description contact phone number
   * @type {string | number | null}
   * @example 1113335656
   */
  this.phone = studentInfo.hasOwnProperty('phone_mobile_cell') ? studentInfo['phone_mobile_cell'] : null;

  /**
   * @description residence/living info, including hall and room
   * @type {object | null}
   * @example hall = 'ELLIO', room = '015-B'
   */
  this.residence = Student.parseResidence(studentInfo['room_space_description']);

  /**
   * @description work info, including position, location, startDate, endDate
   * @type {object | null}
   * @example Jon
   */
  this.work = Student.parseWork(studentInfo);

};

/**
 * Parse the hall and room info from the room_space_description field
 * @author Brandon Groff
 * @memberof Student
 * @static
 * @param   {string} roomSpaceDesc string from studentInfo['room_space_description']
 * @returns {object} the parsed object, containing properties `hall` and `room`
 */
Student.parseResidence = function (roomSpaceDesc) {
  if (!roomSpaceDesc) {
    return null;
  }
  var temp = roomSpaceDesc.split(' ');
  return {
    hall: temp[0],
    room: temp[1]
  };
};

/**
 * Parse work info from studentInfo
 * @memberof Student
 * @static
 * @author Brandon Groff
 * @param   {object} studentInfo the object containing all raw studentInfo
 * @returns {object}   the work object conatining properties `position`, `location`, `startDate`, `endDate`
 */
Student.parseWork = function (studentInfo) {
  if (!studentInfo.hasOwnProperty('position')) {
    return null;
  }

  return {
    position: studentInfo['position'],
    location: studentInfo.hasOwnProperty('term_detail') ? studentInfo['term_detail'] : null,
    startDate: studentInfo.hasOwnProperty('position_date_start') ? moment(studentInfo['position_date_start']) : null,
    endDate: studentInfo.hasOwnProperty('position_date_end') ? moment(studentInfo['position_date_end']) : null
  };
};

/**
 * export the Student to a plain object with fields usable by the DirectoryAPI
 * @memberof Student
 * @instance
 * @author Brandon Groff
 * @returns {object} the Student as an object. All values nullable
 *   -----------------------------------------------------------------------------------
 *   |      Key                  |         Value                                       |
 *   |---------------------------------------------------------------------------------|
 *   | bsu_id                    | the Student's unique id                             |
 *   | entry_name                | the student's comma delmited name. last, first      |
 *   | name_first                | first name                                          |
 *   | name_last                 | last name                                           |
 *   | name_preferred            | the preferred name. Robert -> Bob                   |
 *   | email                     | email                                               |
 *   | phone_mobile_cell         | the contact phone number                            |
 *   | room_space_description    | the residence hall code and room                    |
 *   | position                  | the work position. ie. desk staff                   |
 *   | term_detail               | the work location                                   |
 *   | position_date_start       | the work start date                                 |
 *   | position_date_end         | the work end date                                   |
 *   -----------------------------------------------------------------------------------
 */
Student.prototype.exportToObject = function () {
  var temp = {};

  temp['bsu_id'] = this.id;

  temp['entry_name'] = this.name;

  temp['name_first'] = this.firstName;

  temp['name_last'] = this.lastName;

  temp['email'] = this.email;

  temp['name_preferred'] = this.preferredName;

  temp['phone_mobile_cell'] = this.phone;

  if (!this.residence) {
    temp['room_space_description'] = null;
  } else {
    temp['room_space_description'] = this.residence.hall + ' ' + this.residence.room;
  }

  temp['position'] = this.work.position;

  temp['term_detail'] = this.work.location;

  temp['position_date_start'] = this.work.startDate;

  temp['position_date_end'] = this.work.endDate;

  return temp;
};

/**
 * @memberof resdesk.directory
 * @ngdoc factory
 * @name Student
 * @param {object} studentInfo  the student data, all values optional
 *   -----------------------------------------------------------------------------------
 *   |      Key                  |         Value                                       |
 *   |---------------------------------------------------------------------------------|
 *   | bsu_id                    | the Student's unique id                             |
 *   | entry_name                | the student's comma delmited name. last, first      |
 *   | name_first                | first name                                          |
 *   | name_last                 | last name                                           |
 *   | name_preferred            | the preferred name. Robert -> Bob                   |
 *   | email                     | email                                               |
 *   | phone_mobile_cell         | the contact phone number                            |
 *   | room_space_description    | the residence hall code and room                    |
 *   | position                  | the work position. ie. desk staff                   |
 *   | term_detail               | the work location                                   |
 *   | position_date_start       | the work start date                                 |
 *   | position_date_end         | the work end date                                   |
 *   -----------------------------------------------------------------------------------
 * @description 
 *   Factory wrapper for Student class
 */
directoryModule.factory('Student', function () {
  return Student;
});
