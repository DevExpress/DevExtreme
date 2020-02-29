const $ = require('jquery');
const noop = require('core/utils/common').noop;
const Class = require('core/class');
const Views = require('ui/calendar/ui.calendar.views');

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';

window.DevExpress = window.DevExpress || {};

$.extend(true, DevExpress.ui = DevExpress.ui || {}, {
    testing: {
        BaseCalendarFixture: Class.inherit({
            extractArray: function(elements, delegate) {
                return $.map($.makeArray(elements), delegate);
            },
            extractInnerHTMLArray: function(elements) {
                return this.extractArray(elements, function(element, index) {
                    return element.innerHTML;
                });
            },
            extractInnerTextArray: function(elements) {
                return this.extractArray(elements, function(element, index) {
                    return $(element).text();
                });
            },
            extractClassArray: function(elements) {
                return this.extractArray(elements, function(element, index) {
                    return element.getAttribute('class') || '';
                });
            },
            typeIntoInput: function(dateString, input) {
                const keyPress = $.Event('keypress');
                let i;
                for(i = 0; i < dateString.length; ++i) {
                    keyPress.key = dateString[i];
                    input.val(input.val() + dateString[i]);
                    input.trigger(keyPress);
                }
            }
        }),
        MockMonthView: Views['month'].inherit({
            renderHeader: noop,
            renderBody: noop
        })
    }
});

$.extend(true, DevExpress.ui, {
    testing: {
        CalendarFixture: DevExpress.ui.testing.BaseCalendarFixture.inherit({
            ctor: function(options) {
                this.rootElement = $('<div id=\'calendar\'></div>');
                this.rootElement.appendTo('body');
                this.calendar = $('#calendar')
                    .dxCalendar($.extend({ monthViewType: DevExpress.ui.testing.MockMonthView }, options))
                    .dxCalendar('instance');
                this.navigatorLinks = {
                    'prevYear': this.rootElement.find('.dx-calendar-navigator-previous-year'),
                    'prevView': this.rootElement.find('.dx-calendar-navigator-previous-view'),
                    'nextYear': this.rootElement.find('.dx-calendar-navigator-next-year'),
                    'nextView': this.rootElement.find('.dx-calendar-navigator-next-view')
                };
            },
            dispose: function() {
                this.rootElement.remove();
                this.calendar = null;
            }
        }),

        DateBoxFixture: DevExpress.ui.testing.BaseCalendarFixture.inherit({
            ctor: function(element, options) {
                this.format = 'shortdate';
                this.rootElement = $(element);

                this.dateBox = this.rootElement
                    .dxDateBox($.extend(true, {
                        pickerType: 'calendar',
                        displayFormat: this.format,
                        calendarOptions: { monthViewType: DevExpress.ui.testing.MockMonthView }
                    }, options))
                    .dxDateBox('instance');
                this.input = this.rootElement.find(TEXTEDITOR_INPUT_SELECTOR);
            },
            dispose: function() {
                this.rootElement.empty();
                $.cleanData(this.rootElement);
                this.dateBox = null;
            }
        })
    }
});
