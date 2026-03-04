import $ from 'jquery';

const TEXTEDITOR_INPUT_SELECTOR = '.dx-texteditor-input';

window.DevExpress = window.DevExpress || {};
DevExpress.ui = DevExpress.ui || {};
DevExpress.ui.testing = DevExpress.ui.testing || {};

class BaseCalendarFixture {
    extractArray(elements, delegate) {
        return $.map($.makeArray(elements), delegate);
    }

    extractInnerHTMLArray(elements) {
        return this.extractArray(elements, function(element) {
            return element.innerHTML;
        });
    }

    extractInnerTextArray(elements) {
        return this.extractArray(elements, function(element) {
            return $(element).text();
        });
    }

    extractClassArray(elements) {
        return this.extractArray(elements, function(element) {
            return element.getAttribute('class') || '';
        });
    }

    typeIntoInput(dateString, input) {
        const keyPress = $.Event('keypress');
        for(let i = 0; i < dateString.length; ++i) {
            keyPress.key = dateString[i];
            input.val(input.val() + dateString[i]);
            input.trigger(keyPress);
        }
    }
}

class CalendarFixture extends BaseCalendarFixture {
    constructor(options) {
        super();
        this.rootElement = $('<div id=\'calendar\'></div>');
        this.rootElement.appendTo('body');
        this.calendar = $('#calendar')
            .dxCalendar(options)
            .dxCalendar('instance');
        this.navigatorLinks = {
            'prevYear': this.rootElement.find('.dx-calendar-navigator-previous-year'),
            'prevView': this.rootElement.find('.dx-calendar-navigator-previous-view'),
            'nextYear': this.rootElement.find('.dx-calendar-navigator-next-year'),
            'nextView': this.rootElement.find('.dx-calendar-navigator-next-view')
        };
    }

    dispose() {
        this.rootElement.remove();
        this.calendar = null;
    }
}

class DateBoxFixture extends BaseCalendarFixture {
    constructor(element, options) {
        super();
        this.format = 'shortdate';
        this.rootElement = $(element);

        this.dateBox = this.rootElement
            .dxDateBox($.extend(true, {
                pickerType: 'calendar',
                displayFormat: this.format,
            }, options))
            .dxDateBox('instance');
        this.input = this.rootElement.find(TEXTEDITOR_INPUT_SELECTOR);
    }

    dispose() {
        this.rootElement.empty();
        $.cleanData(this.rootElement);
        this.dateBox = null;
    }
}

DevExpress.ui.testing.BaseCalendarFixture = BaseCalendarFixture;
DevExpress.ui.testing.CalendarFixture = CalendarFixture;
DevExpress.ui.testing.DateBoxFixture = DateBoxFixture;
