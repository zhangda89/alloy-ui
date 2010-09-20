/**
 * The Calendar component is a UI control that enables users to choose one or
 * more dates from a graphical calendar presented in a single month or multi
 * month interface. Calendars are generated entirely via script and can be
 * navigated without any page refreshes.
 *
 * @module aui-calendar
 * @submodule aui-calendar-base
 */

var L = A.Lang,
	isString = L.isString,
	isArray = L.isArray,
	isBoolean = L.isBoolean,
	isUndefined = L.isUndefined,
	isNumber = L.isNumber,

	toNumber = function(val) {
		return parseFloat(val) || 0;
	},

	WidgetStdMod = A.WidgetStdMod,

	EMPTY_STR = '',
	SPACE = ' ',

	ACTIVE = 'active',
	ALLOW_NONE = 'allowNone',
	ANCHOR = 'a',
	BLANK = 'blank',
	BLANK_DAYS = 'blankDays',
	BOUNDING_BOX = 'boundingBox',
	CALENDAR = 'calendar',
	CHILDREN = 'children',
	CIRCLE = 'circle',
	CLEARFIX = 'clearfix',
	CURRENT_DAY = 'currentDay',
	CURRENT_MONTH = 'currentMonth',
	CURRENT_YEAR = 'currentYear',
	DATA_DAY = 'data-day',
	DATA_MONTH = 'data-month',
	DATA_YEAR = 'data-year',
	DATES = 'dates',
	DATE_FORMAT = 'dateFormat',
	DAY = 'day',
	DEFAULT = 'default',
	DISABLED = 'disabled',
	DOT = '.',
	END = 'end',
	FIRST_DAY_OF_WEEK = 'firstDayOfWeek',
	HEADER = 'hd',
	HEADER_CONTENT_NODE = 'headerContentNode',
	HEADER_TITLE_NODE = 'headerTitleNode',
	HELPER = 'helper',
	HIDDEN = 'hidden',
	HOVER = 'hover',
	ICON = 'icon',
	ICON_NEXT_NODE = 'iconNextNode',
	ICON_PREV_NODE = 'iconPrevNode',
	LINK = 'link',
	LOCALE = 'locale',
	MAX_DATE = 'maxDate',
	MIN_DATE = 'minDate',
	MONTH = 'month',
	MONTHDAYS = 'monthdays',
	MONTH_DAYS = 'monthDays',
	MONTH_DAYS_NODE = 'monthDaysNode',
	NEXT = 'next',
	NONE = 'none',
	NONE_LINK_NODE = 'noneLinkNode',
	PADDING = 'padding',
	PADDING_DAYS_END = 'paddingDaysEnd',
	PADDING_DAYS_START = 'paddingDaysStart',
	PREV = 'prev',
	SELECT_MULTIPLE_DATES = 'selectMultipleDates',
	SHOW_OTHER_MONTH = 'showOtherMonth',
	SHOW_TODAY = 'showToday',
	START = 'start',
	STATE = 'state',
	TITLE = 'title',
	TODAY = 'today',
	TODAY_LINK_NODE = 'todayLinkNode',
	TRIANGLE = 'triangle',
	WEEK = 'week',
	WEEKDAYS = 'weekdays',
	WEEK_DAYS = 'weekDays',
	WEEK_DAYS_NODE = 'weekDaysNode',

	EV_CALENDAR_SELECT = 'calendar:select',

	getCN = A.ClassNameManager.getClassName,

	CSS_CALENDAR = getCN(CALENDAR),
	CSS_CALENDAR_DISABLED = getCN(CALENDAR, DISABLED),
	CSS_CALENDAR_LINK = getCN(CALENDAR, LINK),
	CSS_CALENDAR_LINK_NONE = getCN(CALENDAR, LINK, NONE),
	CSS_CALENDAR_LINK_TODAY = getCN(CALENDAR, LINK, TODAY),
	CSS_DAY = getCN(CALENDAR, DAY),
	CSS_DAY_MONTH = getCN(CALENDAR, DAY, MONTH),
	CSS_DAY_BLANK = getCN(CALENDAR, DAY, BLANK),
	CSS_DAY_PADDING_END = getCN(CALENDAR, DAY, PADDING, END),
	CSS_DAY_PADDING_START = getCN(CALENDAR, DAY, PADDING, START),
	CSS_HEADER = getCN(CALENDAR, HEADER),
	CSS_HELPER_CLEARFIX = getCN(HELPER, CLEARFIX),
	CSS_HELPER_HIDDEN = getCN(HELPER, HIDDEN),
	CSS_ICON = getCN(ICON),
	CSS_ICON_CIRCLE_TRIANGLE_L = getCN(ICON, CIRCLE, TRIANGLE, 'l'),
	CSS_ICON_CIRCLE_TRIANGLE_R = getCN(ICON, CIRCLE, TRIANGLE, 'r'),
	CSS_MONTHDAYS = getCN(CALENDAR, MONTHDAYS),
	CSS_NEXT = getCN(CALENDAR, NEXT),
	CSS_PREV = getCN(CALENDAR, PREV),
	CSS_STATE_ACTIVE = getCN(STATE, ACTIVE),
	CSS_STATE_DEFAULT = getCN(STATE, DEFAULT),
	CSS_STATE_HOVER = getCN(STATE, HOVER),
	CSS_TITLE = getCN(CALENDAR, TITLE),
	CSS_WEEK = getCN(CALENDAR, WEEK),
	CSS_WEEKDAYS = getCN(CALENDAR, WEEKDAYS),

	INT_MATRIX_DAYS_LENGTH = 42,
	INT_MAX_PADDING_END = 14,
	INT_MONTH_LENGTH = 31,
	INT_WEEK_LENGTH = 7,

	TPL_CALENDAR_NONE_LINK = '<a href="#" class="'+[ CSS_CALENDAR_LINK, CSS_CALENDAR_LINK_NONE ].join(SPACE)+'">None</a>',

	TPL_CALENDAR_TODAY_LINK = '<a href="#" class="'+[ CSS_CALENDAR_LINK, CSS_CALENDAR_LINK_TODAY ].join(SPACE)+'">Today</a>',

	TPL_CALENDAR_HEADER = '<div class="'+[ CSS_HEADER, CSS_STATE_DEFAULT, CSS_HELPER_CLEARFIX ].join(SPACE)+'"></div>',

	TPL_CALENDAR_PREV = '<a href="" class="'+[ CSS_ICON, CSS_ICON_CIRCLE_TRIANGLE_L, CSS_PREV ].join(SPACE)+'">Back</a>',

	TPL_CALENDAR_NEXT = '<a href="" class="'+[ CSS_ICON, CSS_ICON_CIRCLE_TRIANGLE_R, CSS_NEXT ].join(SPACE)+'">Prev</a>',

	TPL_CALENDAR_DAY_BLANK = '<div class="'+[ CSS_DAY_BLANK, CSS_HELPER_HIDDEN ].join(SPACE)+'"></div>',

	TPL_CALENDAR_DAY_PADDING_START = '<div class="'+[ CSS_DAY, CSS_STATE_DEFAULT, CSS_DAY_PADDING_START, CSS_HELPER_HIDDEN ].join(SPACE)+'"></div>',

	TPL_CALENDAR_DAY_PADDING_END = ['<div class="'+[ CSS_DAY, CSS_STATE_DEFAULT, CSS_DAY_PADDING_END, CSS_HELPER_HIDDEN ].join(SPACE)+'">', 0, '</div>'],

	TPL_CALENDAR_HEADER_TITLE = '<div class="'+CSS_TITLE+'"></div>',

	TPL_CALENDAR_MONTHDAYS = '<div class="'+[ CSS_MONTHDAYS, CSS_HELPER_CLEARFIX ].join(SPACE)+'"></div>',

	TPL_CALENDAR_WEEKDAYS = '<div class="'+[ CSS_WEEKDAYS, CSS_HELPER_CLEARFIX ].join(SPACE)+'"></div>',

	TPL_BUFFER_WEEKDAYS = ['<div class="'+CSS_WEEK+'">', 0, '</div>'],

	TPL_BUFFER_MONTH_DAYS = ['<a href="#" class="'+[ CSS_DAY, CSS_DAY_MONTH, CSS_STATE_DEFAULT ].join(SPACE)+'">', 0, '</a>'];

/**
 * <p><img src="assets/images/aui-calendar/main.png"/></p>
 *
 * A base class for Calendar, providing:
 * <ul>
 *    <li>Widget Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Setting Configuration Options</li>
 *    <li>Obtaining Selected Dates</li>
 *    <li>Creating International Calendars</li>
 *    <li>Customizing the Calendar</li>
 * </ul>
 *
 * Quick Example:
 *
 * <pre><code>var instance = new A.Calendar({
 *  trigger: '#input1',
 *  dates: ['09/14/2009', '09/15/2009'],
 *  dateFormat: '%d/%m/%y %A',
 *  setValue: true,
 *  selectMultipleDates: true
 * }).render();
 * </code></pre>
 *
 * Check the list of <a href="Calendar.html#configattributes">Configuration Attributes</a> available for
 * Calendar.
 *
 * @class Calendar
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 * @extends OverlayContext
 */
var Calendar = A.Component.create(
	{
		/**
		 * Static property provides a string to identify the class.
		 *
		 * @property Calendar.NAME
		 * @type String
		 * @static
		 */
		NAME: CALENDAR,

		/**
		 * Static property used to define the default attribute
		 * configuration for the Calendar.
		 *
		 * @property Calendar.ATTRS
		 * @type Object
		 * @static
		 */
		ATTRS: {
			/**
			 * Wheather displays the "none" link on the Calendar footer.
			 *
			 * @attribute allowNone
			 * @default true
			 * @type boolean
			 */
			allowNone: {
				value: true,
				validator: isBoolean
			},

			/**
			 * NodeList containing all the DOM elements for
			 * each blank day. If not specified try to query using HTML_PARSER
			 * an element inside contentBox which matches
			 * <code>aui-calendar-day-blank</code>.
			 *
			 * @attribute paddingDaysEnd
			 * @default Generated div element.
			 * @type NodeList
			 */
			paddingDaysEnd: {
				valueFn: '_valuePaddingDaysEnd'
			},

			/**
			 * NodeList containing all the DOM elements for
			 * each blank day. If not specified try to query using HTML_PARSER
			 * an element inside contentBox which matches
			 * <code>aui-calendar-day-blank</code>.
			 *
			 * @attribute paddingDaysStart
			 * @default Generated div element.
			 * @type NodeList
			 */
			paddingDaysStart: {
				valueFn: '_valuePaddingDaysStart'
			},

			/**
			 * NodeList containing all the DOM elements for
			 * each blank day. If not specified try to query using HTML_PARSER
			 * an element inside contentBox which matches
			 * <code>aui-calendar-day-blank</code>.
			 *
			 * @attribute blankDays
			 * @default Generated div element.
			 * @type NodeList
			 */
			blankDays: {
				valueFn: '_valueBlankDays'
			},

			/**
			 * Current day number.
			 *
			 * @attribute currentDay
			 * @default Current day
			 * @type Number
			 */
			currentDay: {
				value: (new Date()).getDate()
			},

			/**
			 * Current month number.
			 *
			 * @attribute currentMonth
			 * @default Current month
			 * @type Number
			 */
			currentMonth: {
				value: (new Date()).getMonth()
			},

			/**
			 * Current year number.
			 *
			 * @attribute currentYear
			 * @default Current year
			 * @type Number
			 */
			currentYear: {
				value: (new Date()).getFullYear()
			},

			/**
			 * Dates which the calendar will show as selected by default.
			 *
			 * @attribute dates
			 * @default Current date
			 * @type Array
			 */
			dates: {
				value: [ new Date() ],
				validator: isArray,
				setter: '_setDates'
			},

			/**
			 * The default date format string which can be overriden for
	         * localization support. The format must be valid according to
	         * <a href="DataType.Date.html">A.DataType.Date.format</a>.
			 *
			 * @attribute dateFormat
			 * @default %m/%d/%Y
			 * @type String
			 */
			dateFormat: {
				value: '%m/%d/%Y',
				validator: isString
			},

			/**
			 * First day of the week: Sunday is 0, Monday is 1.
			 *
			 * @attribute firstDayOfWeek
			 * @default 0
			 * @type Number
			 */
			firstDayOfWeek: {
				value: 0,
				validator: isNumber
			},

			/**
			 * DOM node reference to be the header of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-hd</code>.
			 *
			 * @attribute headerContentNode
			 * @default Generated div element.
			 * @type Node
			 */
			headerContentNode: {
				valueFn: function() {
					return A.Node.create(TPL_CALENDAR_HEADER);
				}
			},

			/**
			 * DOM node reference to be the title of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-title</code>.
			 *
			 * @attribute headerTitleNode
			 * @default Generated div element.
			 * @type Node
			 */
			headerTitleNode: {
				valueFn: function() {
					return A.Node.create(TPL_CALENDAR_HEADER_TITLE);
				}
			},

			/**
			 * DOM node reference to be the icon next of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-prev</code>.
			 *
			 * @attribute iconNextNode
			 * @default Generated div element.
			 * @type Node
			 */
			iconNextNode: {
				valueFn: function() {
					return A.Node.create(TPL_CALENDAR_NEXT);
				}
			},

			/**
			 * DOM node reference to be the icon prev of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-prev</code>.
			 *
			 * @attribute iconPrevNode
			 * @default Generated div element.
			 * @type Node
			 */
			iconPrevNode: {
				valueFn: function() {
					return A.Node.create(TPL_CALENDAR_PREV);
				}
			},

			/**
			 * Maximum allowable date. Values supported by the Date
             * constructor are supported.
			 *
			 * @attribute maxDate
			 * @default null
			 * @type String | Date
			 */
			maxDate: {
				value: null,
				setter: '_setMinMaxDate'
			},

			/**
			 * Minimum allowable date. Values supported by the Date
             * constructor are supported.
			 *
			 * @attribute minDate
			 * @default null
			 * @type Date | String
			 */
			minDate: {
				value: null,
				setter: '_setMinMaxDate'
			},

			/**
			 * NodeList reference containing the days of the month of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-day</code>.
			 *
			 * @attribute monthDays
			 * @default Generated div element.
			 * @type NodeList
			 */
			monthDays: {
				valueFn: '_valueMonthDays'
			},

			/**
			 * DOM node reference which contains all month days nodes of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-monthdays</code>.
			 *
			 * @attribute monthDaysNode
			 * @default Generated div element.
			 * @type Node
			 */
			monthDaysNode: {
				valueFn: function() {
					return A.Node.create(TPL_CALENDAR_MONTHDAYS);
				}
			},

			/**
			 * DOM node reference to be the "none" link of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-title</code>.
			 *
			 * @attribute noneLinkNode
			 * @default Generated div element.
			 * @type Node
			 */
			noneLinkNode: {
				valueFn: function() {
					return A.Node.create(TPL_CALENDAR_NONE_LINK);
				}
			},

			/**
			 * DOM node reference to be the "today" link of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-title</code>.
			 *
			 * @attribute todayLinkNode
			 * @default Generated div element.
			 * @type Node
			 */
			todayLinkNode: {
				valueFn: function() {
					return A.Node.create(TPL_CALENDAR_TODAY_LINK);
				}
			},

			/**
			 * Wether accepts to select multiple dates.
			 *
			 * @attribute selectMultipleDates
			 * @default false
			 * @type boolean
			 */
			selectMultipleDates: {
				value: false
			},

			/**
			 * If true set the selected date with the correct
			 * <a href="Calendar.html#config_dateFormat">dateFormat</a> to the
			 * value of the input field which is hosting the Calendar.
			 *
			 * @attribute setValue
			 * @default true
			 * @type boolean
			 */
			setValue: {
				value: true,
				validator: isBoolean
			},

			/**
			 * Wheather displays the days for the other months.
			 *
			 * @attribute showOtherMonth
			 * @default true
			 * @type boolean
			 */
			showOtherMonth: {
				value: true,
				validator: isBoolean
			},

			/**
			 * Wheather displays the "today" link on the Calendar footer.
			 *
			 * @attribute showToday
			 * @default true
			 * @type boolean
			 */
			showToday: {
				value: true,
				validator: isBoolean
			},

			/**
			 * NodeList reference containing the days of the week of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-week</code>.
			 *
			 * @attribute weekDays
			 * @default Generated div element.
			 * @type NodeList
			 */
			weekDays: {
				valueFn: '_valueWeekDays'
			},

			/**
			 * DOM node reference which contains all week days nodes of the Calendar. If not
             * specified try to query using HTML_PARSER an element inside
             * contentBox which matches <code>aui-calendar-weekdays</code>.
			 *
			 * @attribute weekDaysNode
			 * @default Generated div element.
			 * @type Node
			 */
			weekDaysNode: {
				valueFn: function() {
					return A.Node.create(TPL_CALENDAR_WEEKDAYS);
				}
			}
		},

		/**
		 * Object hash, defining how attribute values are to be parsed from
		 * markup contained in the widget's content box.
		 *
		 * @property ProgressBar.HTML_PARSER
		 * @type Object
		 * @static
		 */
		HTML_PARSER: {
			blankDays: function(srcNode) {
				var nodes = srcNode.all(DOT+CSS_DAY_BLANK);

				return nodes.size() ? nodes : null;
			},

			monthDays: function(srcNode) {
				var nodes = srcNode.all(DOT+CSS_DAY_MONTH);

				return nodes.size() ? nodes : null;
			},

			paddingDaysEnd: function(srcNode) {
				var nodes = srcNode.all(DOT+CSS_DAY_PADDING_END);

				return nodes.size() ? nodes : null;
			},

			paddingDaysStart: function(srcNode) {
				var nodes = srcNode.all(DOT+CSS_DAY_PADDING_START);

				return nodes.size() ? nodes : null;
			},

			weekDays: function(srcNode) {
				var nodes = srcNode.all(DOT+CSS_WEEK);

				return nodes.size() ? nodes : null;
			},

			headerTitleNode: DOT+CSS_TITLE,

			monthDaysNode: DOT+CSS_MONTHDAYS,

			weekDaysNode: DOT+CSS_WEEKDAYS,

			headerContentNode: DOT+CSS_HEADER,

			iconNextNode: DOT+CSS_NEXT,

			iconPrevNode: DOT+CSS_PREV,

			todayLinkNode: DOT+CSS_CALENDAR_LINK_TODAY,

			noneLinkNode: DOT+CSS_CALENDAR_LINK_NONE
		},

		UI_ATTRS: [DATES, SHOW_TODAY, ALLOW_NONE, SHOW_OTHER_MONTH],

		BIND_UI_ATTRS: [CURRENT_MONTH, CURRENT_YEAR],

		prototype: {
			/**
			 * Construction logic executed during Calendar instantiation. Lifecycle.
			 *
			 * @method initializer
			 * @protected
			 */
			initializer: function() {
				var instance = this;

				instance.selectedDates = [];
			},

			/**
			 * Create the DOM structure for the Calendar. Lifecycle.
			 *
			 * @method renderUI
			 * @protected
			 */
			renderUI: function() {
				var instance = this;

				// creating properties references for performance
				instance.blankDays = instance.get(BLANK_DAYS);
				instance.headerContentNode = instance.get(HEADER_CONTENT_NODE);
				instance.headerTitleNode = instance.get(HEADER_TITLE_NODE);
				instance.iconNextNode = instance.get(ICON_NEXT_NODE);
				instance.iconPrevNode = instance.get(ICON_PREV_NODE);
				instance.monthDays = instance.get(MONTH_DAYS);
				instance.monthDaysNode = instance.get(MONTH_DAYS_NODE);
				instance.noneLinkNode = instance.get(NONE_LINK_NODE);
				instance.paddingDaysEnd = instance.get(PADDING_DAYS_END);
				instance.paddingDaysStart = instance.get(PADDING_DAYS_START);
				instance.todayLinkNode = instance.get(TODAY_LINK_NODE);
				instance.weekDays = instance.get(WEEK_DAYS);
				instance.weekDaysNode = instance.get(WEEK_DAYS_NODE);

				instance._renderWeekDays();
				instance._renderBlankDays();
				instance._renderPaddingDaysStart();
				instance._renderMonthDays();
				instance._renderPaddingDaysEnd();
				instance._renderIconControls();
				instance._renderTitleNode();
				instance._renderStdContent();
			},

			/**
			 * Bind the events on the Calendar UI. Lifecycle.
			 *
			 * @method bindUI
			 * @protected
			 */
			bindUI: function() {
				var instance = this;

				instance._createEvents();
				instance._bindDelegate();
			},

			/**
			 * Clear all selected dates on the Calendar.
			 *
			 * @method clear
			 */
			clear: function() {
				var instance = this;

				instance.set(DATES, []);
			},

			/**
			 * Loop each date from <a href="Calendar.html#config_dates">dates</a> and
		     * executes a callback.
			 *
			 * @method eachSelectedDate
			 * @param {function} fn Callback to be executed for each date.
			 * @param {Dates} dates Optional dates Array to loop through. If not passed it will use
			 * the <a href="Calendar.html#config_dates">dates</a>.
			 */
			eachSelectedDate: function(fn, dates) {
				var instance = this;

				A.Array.each(dates || instance.get(DATES), fn, instance);
			},

			/**
			 * Format a date with the passed mask. Used on
		     * <a href="Calendar.html#config_dateFormat">dateFormat</a>.
			 *
			 * @method formatDate
			 * @param {Date} date
			 * @param {String} mask See <a href="Calendar.html#config_dateFormat">dateFormat</a>.
			 * @return {String}
			 */
			formatDate: function (date, mask) {
				var instance = this;
				var locale = instance.get(LOCALE);

				return A.DataType.Date.format(date, { format: mask, locale: locale });
			},

			/**
			 * Get current date.
			 *
			 * @method getCurrentDate
			 * @return {Date}
			 */
			getCurrentDate: function(offsetYear, offsetMonth, offsetDay) {
				var instance = this;
				var date = instance._normalizeYearMonth();

				return (new Date(date.year + toNumber(offsetYear), date.month + toNumber(offsetMonth), date.day + toNumber(offsetDay)));
			},

			/**
			 * Get the number of days in the passed year and month.
			 *
			 * @method getDaysInMonth
			 * @param {Number} year Year in the format YYYY.
			 * @param {Number} month 0 for January 11 for December.
			 * @return {Number}
			 */
			getDaysInMonth: function(year, month) {
				var instance = this;
				var date = instance._normalizeYearMonth(year, month);

		        return ( 32 - new Date(date.year, date.month, 32).getDate() );
		    },


			/**
			 * Get an Array with selected dates with detailed information (day, month, year).
			 *<pre><code>[{
			 *    year: date.getFullYear(),
			 *    month: date.getMonth(),
			 *    day: date.getDate()
			 * }]</code></pre>
			 *
			 * @method getDetailedSelectedDates
			 * @return {Array}
			 */
			getDetailedSelectedDates: function() {
				var instance = this;
				var dates = [];

				instance.eachSelectedDate(function(date) {
					dates.push({
						year: date.getFullYear(),
						month: date.getMonth(),
						day: date.getDate()
					});
				});

				return dates;
			},

			/**
			 * Get the Date for the first day of the passed year and month.
			 *
			 * @method getFirstDate
			 * @param {Number} year Year in the format YYYY.
			 * @param {Number} month 0 for January 11 for December.
			 * @return {Date}
			 */
			getFirstDate: function(year, month) {
				var instance = this;
				var date = instance._normalizeYearMonth(year, month);

				return ( new Date(date.year, date.month, 1) );
			},

			/**
			 * Get the first day of week of the passed year and month.
			 *
			 * @method getFirstDayOfWeek
			 * @param {Number} year Year in the format YYYY.
			 * @param {Number} month 0 for January 11 for December.
			 * @return {Number}
			 */
			getFirstDayOfWeek: function(year, month) {
				var instance = this;

				return instance.getFirstDate(year, month).getDay();
			},

			/**
			 * Get the selected dates formatted by the
		     * <a href="Calendar.html#config_dateFormat">dateFormat</a>.
			 *
			 * @method getFormattedSelectedDates
			 * @return {Array}
			 */
			getFormattedSelectedDates: function() {
				var instance = this;
				var dates = [];

				instance.eachSelectedDate(function(date) {
					dates.push( instance.formatDate( date, instance.get(DATE_FORMAT) ) );
				});

				return dates;
			},

			/**
			 * Get the Date for the last day of the passed year and month.
			 *
			 * @method getLastDate
			 * @param {Number} year Year in the format YYYY.
			 * @param {Number} month 0 for January 11 for December.
			 * @return {Date}
			 */
			getLastDate: function(year, month) {
				var instance = this;
				var date = instance._normalizeYearMonth(year, month);
				var daysInMonth = instance.getDaysInMonth(date.month);

				return ( new Date(date.year, date.month, daysInMonth) );
			},

			/**
			 * Get the selected dates.
			 *
			 * @method getSelectedDates
			 * @return {Array}
			 */
			getSelectedDates: function() {
				var instance = this;

				return instance.get(DATES);
			},

			/**
			 * Check if a date is already selected.
			 *
			 * @method isAlreadySelected
			 * @param {Date} date Date to be checked.
			 * @return {boolean}
			 */
			isAlreadySelected: function(date) {
				var instance = this;
				var isAlreadySelected = false;

				instance.eachSelectedDate(function(d, index) {
					if (instance._compareDates(d, date)) {
						isAlreadySelected = true;
					}
				});

				return isAlreadySelected;
			},

			/**
			 * Check if the passed date is out of range. Compared with the
		     * <a href="Calendar.html#config_minDate">minDate</a> and
		     * <a href="Calendar.html#config_maxDate">maxDate</a>.
			 *
			 * @method isOutOfRangeDate
			 * @param {Date} date Date to be checked.
			 */
			isOutOfRangeDate: function(date) {
				var instance = this;
				var maxDate = instance.get(MAX_DATE);
				var minDate = instance.get(MIN_DATE);

				var disablePrev = minDate && (date < minDate);
				var disableNext = maxDate && (date > maxDate);

				return (disablePrev || disableNext);
			},

			/**
			 * Navigate through months and re-sync the UI.
			 *
			 * @method navigateMonth
			 * @param {Number} offset Offset of the number of months to navigate.
		     * Could be a positive or a negative offset.
			 */
			navigateMonth: function(offset) {
				var instance = this;
				var date = instance.getCurrentDate(0, offset);

				// when navigate by month update the year also
				instance.set(CURRENT_MONTH, date.getMonth());
				instance.set(CURRENT_YEAR, date.getFullYear());
			},

			/**
			 * Parse a string to a Date object.
			 *
			 * @method parseDate
			 * @param {String} dateString
			 * @return {Date}
			 */
			parseDate: function(dateString) {
				var instance = this;

				return ( dateString ? new Date(dateString) : new Date() );
			},

			/**
			 * Remove the passed date from
		     * <a href="Calendar.html#config_dates">dates</a>.
			 *
			 * @method removeDate
			 * @param {Date} date Date to remove
			 */
			removeDate: function(date) {
				var instance = this;
				var dates = [];

				instance.eachSelectedDate(
					function(d, index) {
						if (!instance._compareDates(d, date)) {
							dates.push(d);
						}
					}
				);

				instance.set(DATES, dates);
			},

			/**
			 * Navigate to the next month. Fired from the next icon on the Calendar
		     * header.
			 *
			 * @method selectNextMonth
			 */
			selectNextMonth: function() {
				var instance = this;

				instance.navigateMonth(+1);
			},

			/**
			 * Navigate to the previous month. Fired from the previous icon on the
			 * Calendar header.
			 *
			 * @method selectPrevMonth
			 */
			selectPrevMonth: function() {
				var instance = this;

				instance.navigateMonth(-1);
			},

			/**
			 * Select today date on the Calendar.
			 *
			 * @method selectToday
			 */
			selectToday: function() {
				var instance = this;

				instance.set(DATES, [ new Date() ]);
			},

			/**
			 * Bind DOM events to the UI.
			 *
			 * @method _bindDelegate
			 * @private
			 */
			_bindDelegate: function() {
				var instance = this;
				var boundingBox = instance.get(BOUNDING_BOX);
				var headerContentNode = instance.headerContentNode;

				headerContentNode.delegate('click', instance.selectNextMonth, DOT+CSS_ICON_CIRCLE_TRIANGLE_R, instance);
				headerContentNode.delegate('click', instance.selectPrevMonth, DOT+CSS_ICON_CIRCLE_TRIANGLE_L, instance);

				boundingBox.delegate('click', instance._preventDefaultFn, ANCHOR);
				boundingBox.delegate('click', A.bind(instance.selectToday, instance), DOT+CSS_CALENDAR_LINK_TODAY);
				boundingBox.delegate('click', A.bind(instance.clear, instance), DOT+CSS_CALENDAR_LINK_NONE);
				boundingBox.delegate('click', A.bind(instance._onClickDays, instance), DOT+CSS_DAY);
				boundingBox.delegate('mouseenter', A.bind(instance._onMouseEnterDays, instance), DOT+CSS_DAY);
				boundingBox.delegate('mouseleave', A.bind(instance._onMouseLeaveDays, instance), DOT+CSS_DAY);
			},

			_bindDataAttrs: function(node, date) {
				node.attr(DATA_YEAR, date.getFullYear());
				node.attr(DATA_MONTH, date.getMonth());
			},

			_checkNodeRange: function(node, date) {
				var instance = this;

				node.toggleClass(
					CSS_CALENDAR_DISABLED,
					instance.isOutOfRangeDate(date)
				);
			},

		    /**
		     * Create the custom events used on the Calendar.
		     *
		     * @method _createEvents
		     * @private
		     */
			_createEvents: function() {
				var instance = this;

				// create publish function for kweight optimization
				var publish = function(name, fn) {
					instance.publish(name, {
			            defaultFn: fn,
			            queuable: false,
			            emitFacade: true,
			            bubbles: true,
			            prefix: CALENDAR
			        });
				};

				publish(
					EV_CALENDAR_SELECT,
					instance._defSelectFn
				);
			},

			_createNodeList: function(buffer) {
				var instance = this;

				var blankDays = A.one(
					A.DOM.create(buffer.join(EMPTY_STR))
				);

				return blankDays.get(CHILDREN);
			},

			/**
			 * Compare two dates.
			 *
			 * @method _compareDates
			 * @param {Date} d1
			 * @param {Date} d2
			 * @protected
			 * @return {boolean}
			 */
			_compareDates: function(d1, d2) {
				return ( d1.getTime() == d2.getTime() );
			},

			_conditionalToggle: function(node, show) {
				var instance = this;

				if (show) {
					node.show();
				}
				else {
					node.hide();
				}
			},

		    /**
		     * Default calendar:select handler
		     *
		     * @method _defSelectFn
		     * @param {EventFacade} event The Event object
		     * @protected
		     */
			_defSelectFn: function(event) {
				var instance = this;
				var selectedDates = event.date.normal;
				var lastSelectedDate = selectedDates[selectedDates.length - 1];

				if (lastSelectedDate) {
					// update the current values to the last selected date
					instance.set(CURRENT_DAY, lastSelectedDate.getDate());
					instance.set(CURRENT_MONTH, lastSelectedDate.getMonth());
					instance.set(CURRENT_YEAR, lastSelectedDate.getFullYear());
				}

				instance._syncView();
			},

			 /**
			  * Get the locale map containing the respective values for the
		      * <a href="Widget.html#config_locale">locale</a> used.
			  *
			  * <pre><code>A.DataType.Date.Locale['pt-br'] = A.merge(
			  *	A.DataType.Date.Locale['en'], {
			  *		a: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Fri', 'Sat'],
			  *		A: ['Domingo','Segunda-feira','Ter&ccedil;a-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'],
			  *		b: ['Jan','Fev','Mar','Abr','Mai','Jun', 'Jul','Ago','Set','Out','Nov','Dez'],
			  *		B: ['Janeiro','Fevereiro','Mar&ccedil;o','Abril','Maio','Junho', 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
			  *		c: '%a %d %b %Y %T %Z',
			  *		p: ['AM', 'PM'],
			  *		P: ['am', 'pm'],
			  *		r: '%I:%M:%S %p',
			  *		x: '%d/%m/%y',
			  *		X: '%T'
			  *	}
			  *);</code></pre>
			  *
			  * @method _getLocaleMap
			  * @protected
			  * @return {Object}
			  */
			_getLocaleMap: function() {
				var instance = this;

				return A.DataType.Date.Locale[ instance.get(LOCALE) ];
			},

			/**
			 * Get the day name of the passed weekDay from the locale map.
			 *
			 * @method _getDayName
			 * @param {Number} weekDay
			 * @protected
			 * @return {String}
			 */
			_getDayName: function(weekDay) {
				var instance = this;
				var localeMap = instance._getLocaleMap();

				return localeMap.A[weekDay];
			},

			/**
			 * Get a short day name of the passed weekDay from the locale map.
			 *
			 * @method _getDayNameShort
			 * @param {Number} weekDay
			 * @protected
			 * @return {String}
			 */
			_getDayNameShort: function(weekDay) {
				var instance = this;
				var localeMap = instance._getLocaleMap();

				return localeMap.a[weekDay];
			},

			/**
			 * Get a very short day name of the passed weekDay from the locale map.
			 *
			 * @method _getDayNameMin
			 * @param {Number} weekDay
			 * @protected
			 * @return {String}
			 */
			_getDayNameMin: function(weekDay) {
				var instance = this;
				var name = instance._getDayNameShort(weekDay);

				return name.slice(0, name.length-1);
			},

			/**
			 * Get a month name of the passed month from the locale map.
			 *
			 * @method _getMonthName
			 * @param {Number} month
			 * @protected
			 * @return {String}
			 */
			_getMonthName: function(month) {
				var instance = this;
				var localeMap = instance._getLocaleMap();

				return localeMap.B[month];
			},

			/**
			 * Get a short month name of the passed month from the locale map.
			 *
			 * @method _getMonthNameShort
			 * @param {Number} month
			 * @protected
			 * @return {String}
			 */
			_getMonthNameShort: function(month) {
				var instance = this;
				var localeMap = instance._getLocaleMap();

				return localeMap.b[month];
			},

		    /**
		     * Fires the calendar:select event.
		     *
		     * @method _handleSelectEvent
		     * @param {EventFacade} event calendar:select event facade
		     * @protected
		     */
			_handleSelectEvent: function() {
				var instance = this;
				var normal = instance.getSelectedDates();
				var formatted = instance.getFormattedSelectedDates();
				var detailed = instance.getDetailedSelectedDates();

				instance.fire(EV_CALENDAR_SELECT, {
					date: {
						detailed: detailed,
						formatted: formatted,
						normal: normal
					}
				});
			},

			/**
			 * Returns an Object with the current day, month and year.
			 *
			 * @method _normalizeYearMonth
			 * @param {Number} year Year in the format YYYY.
			 * @param {Number} month 0 for January 11 for December.
			 * @param {Number} day
			 * @protected
			 * @return {Object}
			 */
			_normalizeYearMonth: function(year, month, day) {
				var instance = this;
				var currentDay = instance.get(CURRENT_DAY);
				var currentMonth = instance.get(CURRENT_MONTH);
				var currentYear = instance.get(CURRENT_YEAR);

				if (isUndefined(day)) {
					day = currentDay;
				}

				if (isUndefined(month)) {
					month = currentMonth;
				}

				if (isUndefined(year)) {
					year = currentYear;
				}

				return { year: year, month: month, day: day };
			},

		    /**
		     * Fires on click days elements.
		     *
		     * @method _onClickDays
		     * @param {EventFacade} event
		     * @protected
		     */
			_onClickDays: function(event) {
				var instance = this;
				var target  = event.currentTarget || event.target;
				var disabled = target.test(DOT+CSS_CALENDAR_DISABLED);

				if (!disabled) {
					var day = toNumber(target.attr(DATA_DAY) || target.text());
					var month = toNumber(target.attr(DATA_MONTH));
					var year = toNumber(target.attr(DATA_YEAR));

					if (year) {
						instance.set(CURRENT_YEAR, year);
					}
					if (month) {
						instance.set(CURRENT_MONTH, month);
					}
					if (day) {
						instance.set(CURRENT_DAY, day);
					}

					var currentDate = instance.getCurrentDate();

					if (instance.isAlreadySelected(currentDate)) {
						instance.removeDate(currentDate);
					}
					else {
						instance._selectDate();
					}
				}
			},

		    /**
		     * Fires on mouseenter days elements.
		     *
		     * @method _onMouseEnterDays
		     * @param {EventFacade} event
		     * @protected
		     */
			_onMouseEnterDays: function(event) {
				var instance = this;
				var target  = event.currentTarget || event.target;

				target.replaceClass(CSS_STATE_DEFAULT, CSS_STATE_HOVER);
			},

		    /**
		     * Fires on mouseleave days elements.
		     *
		     * @method _onMouseLeaveDays
		     * @param {EventFacade} event
		     * @protected
		     */
			_onMouseLeaveDays: function(event) {
				var instance = this;
				var target  = event.currentTarget || event.target;

				target.replaceClass(CSS_STATE_HOVER, CSS_STATE_DEFAULT);
			},

			_preventDefaultFn: function(event) {
				event.preventDefault();
			},

			/**
			 * Render Calendar DOM blank days elements. Blank days are used to align
		     * with the week day column.
			 *
			 * @method _renderBlankDays
			 * @protected
			 */
			_renderBlankDays: function() {
				var instance = this;

				instance.blankDays.appendTo(
					instance.monthDaysNode
				);
			},

			/**
			 * Render Calendar DOM padding days elements. Padding days are used to show other month day values.
			 *
			 * @method _renderPaddingDaysEnd
			 * @protected
			 */
			_renderPaddingDaysEnd: function() {
				var instance = this;

				instance.paddingDaysEnd.appendTo(
					instance.monthDaysNode
				);
			},

			/**
			 * Render Calendar DOM padding days elements. Padding days are used to show other month day values.
			 *
			 * @method _renderPaddingDaysStart
			 * @protected
			 */
			_renderPaddingDaysStart: function() {
				var instance = this;

				instance.paddingDaysStart.appendTo(
					instance.monthDaysNode
				);
			},

			/**
			 * Render Calendar bodyContent.
			 *
			 * @method _renderStdContent
			 * @protected
			 */
			_renderStdContent: function() {
				var instance = this;
				var bodyContent = A.Node.create('<div></div>');
				var footContent = A.Node.create('<div class="' + CSS_HELPER_CLEARFIX + '"></div>');

				bodyContent.append(instance.weekDaysNode);
				bodyContent.append(instance.monthDaysNode);

				footContent.append(instance.todayLinkNode);
				footContent.append(instance.noneLinkNode);

				instance.setStdModContent(WidgetStdMod.HEADER, instance.headerContentNode.getDOM());
				instance.setStdModContent(WidgetStdMod.BODY, bodyContent);
				instance.setStdModContent(WidgetStdMod.FOOTER, footContent);
			},

			/**
			 * Render Calendar title node element.
			 *
			 * @method _renderTitleNode
			 * @protected
			 */
			_renderTitleNode: function() {
				var instance = this;

				instance.headerContentNode.append(
					instance.headerTitleNode
				);
			},

			/**
			 * Render Calendar icon controls elements.
			 *
			 * @method _renderIconControls
			 * @protected
			 */
			_renderIconControls: function() {
				var instance = this;

				instance.headerContentNode.append(
					instance.iconNextNode
				);

				instance.headerContentNode.append(
					instance.iconPrevNode
				);
			},

			/**
			 * Render Calendar DOM month days elements.
			 *
			 * @method _renderMonthDays
			 * @protected
			 */
			_renderMonthDays: function() {
				var instance = this;

				instance.monthDays.appendTo(
					instance.monthDaysNode
				);
			},

			/**
			 * Render Calendar DOM week days elements.
			 *
			 * @method _renderWeekDays
			 * @protected
			 */
			_renderWeekDays: function() {
				var instance = this;

				instance.weekDays.appendTo(
					instance.weekDaysNode
				);
			},

			_repeateTemplate: function(template, times) {
				var instance = this;
				var buffer = [];

				while (times--) {
					buffer.push(template);
				}

				return instance._createNodeList(buffer);
			},

			/**
			 * Select the current date returned by
		     * <a href="Calendar.html#method_getCurrentDate">getCurrentDate</a>.
			 *
			 * @method _selectDate
			 * @protected
			 */
			_selectDate: function() {
				var instance = this;
				var currentDate = instance.getCurrentDate();

				if (!instance.isAlreadySelected(currentDate)) {
					var dates = instance.get(DATES);

					// if is single selection reset the selected dates
					if (!instance.get(SELECT_MULTIPLE_DATES)) {
						dates = [];
					}

					dates.push(currentDate);
					instance.set(DATES, dates);
				}
			},

			/**
			 * Setter for the <a href="Calendar.html#config_dates">dates</a> attribute.
			 *
			 * @method _setDates
			 * @param {Array} value
			 * @protected
			 * @return {Array}
			 */
			_setDates: function(value) {
				var instance = this;

				A.Array.each(value, function(date, index) {
					if (isString(date)) {
						value[index] = instance.parseDate( date );
					}
				});

				return value;
			},

			/**
			 * Setter for the <a href="Calendar.html#config_maxDates">maxDates</a> or
		     * <a href="Calendar.html#config_mainDates">minDates</a> attributes.
			 *
			 * @method _setMinMaxDate
			 * @param {Date} value
			 * @protected
			 * @return {Date}
			 */
			_setMinMaxDate: function(value) {
				var instance = this;

				if (isString(value)) {
					value = instance.parseDate( value );
				}

				return value;
			},

			/**
			 * Sync Calendar days UI.
			 *
			 * @method _syncDays
			 * @protected
			 */
			_syncDays: function() {
				var instance = this;
				var firstDayOfWeek = instance.get(FIRST_DAY_OF_WEEK);
				var showOtherMonth = instance.get(SHOW_OTHER_MONTH);

				var currentDate = instance.getCurrentDate();
				var rangeDate = instance.getCurrentDate();
				var prevMonthDate = instance.getCurrentDate(0, -1);
				var nextMonthDate = instance.getCurrentDate(0, +1);

				var monthFirstWeekDay = instance.getFirstDayOfWeek();
				var daysInMonth = instance.getDaysInMonth();
				var totalPrevMonthDays = instance.getDaysInMonth(null, prevMonthDate.getMonth());

				// Sync month days
				instance.monthDays.each(
					function(node, index) {
						node.toggleClass(CSS_HELPER_HIDDEN, (index >= daysInMonth));

						rangeDate.setDate(index + 1);
						instance._checkNodeRange(node, rangeDate);
					}
				);

				// Sync blank or padding start nodes
				var paddingNodes = (showOtherMonth ? instance.paddingDaysStart : instance.blankDays);
				var totalPadding = paddingNodes.size();
				var totalVisible = (monthFirstWeekDay - firstDayOfWeek + INT_WEEK_LENGTH) % INT_WEEK_LENGTH;

				paddingNodes.each(
					function(node, index) {
						var totalHidden = (totalPadding - totalVisible);

						node.toggleClass(CSS_HELPER_HIDDEN, (index < totalHidden));

						if (showOtherMonth) {
							var dayNumber = (totalPrevMonthDays - totalPadding) + (index + 1);

							node.html(dayNumber);
							prevMonthDate.setDate(dayNumber);
							instance._bindDataAttrs(node, prevMonthDate);
							instance._checkNodeRange(node, prevMonthDate);
						}
					}
				);

				// Sync padding end nodes
				if (showOtherMonth) {
					var totalVisiblePaddingEnd = (INT_MATRIX_DAYS_LENGTH - (totalVisible + daysInMonth));

					instance.paddingDaysEnd.each(
						function(node, index) {
							node.toggleClass(CSS_HELPER_HIDDEN, (index >= totalVisiblePaddingEnd));

							nextMonthDate.setDate(index + 1);
							instance._bindDataAttrs(node, nextMonthDate);
							instance._checkNodeRange(node, nextMonthDate);
						}
					);
				}
			},

			/**
			 * Sync Calendar header UI.
			 *
			 * @method _syncHeader
			 * @protected
			 */
			_syncHeader: function() {
				var instance = this;
				var currentMonth = instance.get(CURRENT_MONTH);
				var currentYear = instance.get(CURRENT_YEAR);

				var title = [ instance._getMonthName(currentMonth), currentYear ].join(SPACE);

				instance.headerTitleNode.html(title);
			},

			/**
			 * Sync Calendar selected days UI.
			 *
			 * @method _syncSelectedDays
			 * @protected
			 */
			_syncSelectedDays: function(dates) {
				var instance = this;
				var currentMonth = instance.get(CURRENT_MONTH);
				var currentYear = instance.get(CURRENT_YEAR);

				instance.monthDays.replaceClass(CSS_STATE_ACTIVE, CSS_STATE_DEFAULT);
				instance.monthDays.replaceClass(CSS_STATE_HOVER, CSS_STATE_DEFAULT);

				instance.eachSelectedDate(
					function(date, index) {
						var canSelectDays = (currentMonth == date.getMonth()) && (currentYear == date.getFullYear());

						if (canSelectDays) {
							var dayNode = instance.monthDays.item( date.getDate() - 1 );

							dayNode.addClass(CSS_STATE_ACTIVE);

							try {
								// focus the last selected date
								// IE doesn't support focus on hidden elements
								dayNode.focus();
							}
							catch (err) {}
						}
					},
					dates
				);
			},

			/**
			 * Sync Calendar header, days and selected days UI.
			 *
			 * @method _syncView
			 * @protected
			 */
			_syncView: function() {
				var instance = this;

				instance._syncDays();
				instance._syncHeader();
				instance._syncSelectedDays();
			},

			/**
			 * Sync the UI of the Calendar when showToday attribute change.
			 *
			 * @method _uiSetShowToday
			 * @protected
			 */
			_uiSetAllowNone: function(val) {
				var instance = this;

				instance._conditionalToggle(instance.noneLinkNode, val);
			},

			/**
			 * Sync the UI of the Calendar when currentMonth attribute change.
			 *
			 * @method _uiSetCurrentMonth
			 * @protected
			 */
			_uiSetCurrentMonth: function(val) {
				var instance = this;

				instance._syncView();
			},

			/**
			 * Sync the UI of the Calendar when currentYear attribute change.
			 *
			 * @method _uiSetCurrentYear
			 * @protected
			 */
			_uiSetCurrentYear: function(val) {
				var instance = this;

				instance._syncView();
			},

			/**
			 * Sync the UI of the Calendar when dates attribute change.
			 *
			 * @method _uiSetDates
			 * @protected
			 */
			_uiSetDates: function(val) {
				var instance = this;

				instance._handleSelectEvent();
			},

			/**
			 * Sync the UI of the Calendar when showToday attribute change.
			 *
			 * @method _uiSetShowToday
			 * @protected
			 */
			_uiSetShowToday: function(val) {
				var instance = this;

				instance._conditionalToggle(instance.todayLinkNode, val);
			},

			/**
			 * Sync the UI of the Calendar when showOtherMonth attribute change.
			 *
			 * @method _uiSetShowOtherMonth
			 * @protected
			 */
			_uiSetShowOtherMonth: function(val) {
				var instance = this;

				if (val) {
					instance.blankDays.hide();
				}
				else {
					instance.paddingDaysEnd.hide();
					instance.paddingDaysStart.hide();
				}

				instance._syncDays();
			},

			/**
			 * Default value for paddingDaysEnd attribute, passed as valueFn.
			 *
			 * @method _valuePaddingDaysEnd
			 * @protected
			 */
			_valuePaddingDaysEnd: function() {
				var instance = this;
				var buffer = [];
				var day = 0;

				while (day++ <= INT_MAX_PADDING_END) {
					TPL_CALENDAR_DAY_PADDING_END[1] = day;

					buffer.push(TPL_CALENDAR_DAY_PADDING_END.join(EMPTY_STR));
				}

				return instance._createNodeList(buffer);
			},

			/**
			 * Default value for paddingDaysStart attribute, passed as valueFn.
			 *
			 * @method _valuePaddingDaysStart
			 * @protected
			 */
			_valuePaddingDaysStart: function() {
				return this._repeateTemplate(TPL_CALENDAR_DAY_PADDING_START, INT_WEEK_LENGTH);
			},


			/**
			 * Default value for blankDays attribute, passed as valueFn.
			 *
			 * @method _valueBlankDays
			 * @protected
			 */
			_valueBlankDays: function() {
				return this._repeateTemplate(TPL_CALENDAR_DAY_BLANK, INT_WEEK_LENGTH);
			},

			/**
			 * Default value for monthDays attribute, passed as valueFn.
			 *
			 * @method _valueMonthDays
			 * @protected
			 */
			_valueMonthDays: function() {
				var instance = this;

				var day = 0;
				var buffer = [];

				while (day++ < INT_MONTH_LENGTH) {
					TPL_BUFFER_MONTH_DAYS[1] = day;

					buffer.push(TPL_BUFFER_MONTH_DAYS.join(EMPTY_STR));
				}

				return instance._createNodeList(buffer);
			},

			/**
			 * Default value for weekDays attribute, passed as valueFn.
			 *
			 * @method _valueWeekDays
			 * @protected
			 */
			_valueWeekDays: function() {
				var instance = this;
				var day = 0;
				var buffer = [];
				var firstWeekDay = instance.get(FIRST_DAY_OF_WEEK);

				while(day < INT_WEEK_LENGTH) {
					var fixedDay = (day++ + firstWeekDay) % INT_WEEK_LENGTH;

					TPL_BUFFER_WEEKDAYS[1] = instance._getDayNameMin(fixedDay);

					buffer.push(TPL_BUFFER_WEEKDAYS.join(EMPTY_STR));
				}

				return instance._createNodeList(buffer);
			}
		}
	}
);

A.Calendar = A.augment(Calendar, A.WidgetStdMod);