import $ from 'jquery';
import { renderDateParts, getDatePartIndexByPosition } from '__internal/ui/date_box/m_date_box.mask.parts';
import dateParser from 'common/core/localization/ldml/date.parser';
import dateLocalization from 'common/core/localization/date';
import { noop } from 'core/utils/common';
import pointerMock from '../../helpers/pointerMock.js';
import 'ui/date_box';
import keyboardMock from '../../helpers/keyboardMock.js';
import devices from '__internal/core/m_devices';

const { test, module } = QUnit;

const CLEAR_BUTTON_AREA_CLASS = 'dx-clear-button-area';

const DROP_EVENT_NAME = 'drop';

QUnit.testStart(() => {
    $('#qunit-fixture').html('<div id=\'dateBox\'></div>');
});

const simulateIMEInput = function(eventsData) {
    this.$input.trigger($.Event('keydown', {
        key: 'Process',
        code: eventsData.keyDownCode,
        originalEvent: $.Event('keydown', {
            key: 'Process',
            code: eventsData.keyDownCode
        })
    }));

    this.$input.trigger($.Event('compositionstart', {
        type: 'compositionstart',
        originalEvent: $.Event('compositionstart', {
            type: 'compositionstart'
        })
    }));

    this.$input.trigger($.Event('input', {
        type: 'input',
        originalEvent: $.Event('input', {
            inputType: 'insertCompositionText',
            isComposing: true,
            data: eventsData.inputData // for ff
        })
    }));

    this.$input.trigger($.Event('keyup', {
        key: 'Process',
        code: eventsData.keyDownCode,
        originalEvent: $.Event('keyup', {
            key: 'Process',
            code: eventsData.keyDownCode,
        })
    }));

    this.$input.trigger($.Event('compositionend'));
};

const setupModule = {
    beforeEach: function() {
        this.parts = renderDateParts('Tuesday, July 2, 2024 16:19 PM', dateParser.getRegExpInfo('EEEE, MMMM d, yyyy HH:mm a', dateLocalization));
        this.$element = $('#dateBox').dxDateBox({
            value: new Date('10/10/2012 13:07'),
            useMaskBehavior: true,
            mode: 'text',
            displayFormat: 'MMMM d yyyy',
            pickerType: 'calendar'
        });

        this.instance = this.$element.dxDateBox('instance');
        this.$input = this.$element.find('.dx-texteditor-input');
        this.keyboard = keyboardMock(this.$input, true);
        this.pointer = pointerMock(this.$input);
        this.clock = sinon.useFakeTimers(new Date(2015, 3, 14).getTime());
    },

    afterEach: function() {
        this.clock.restore();
    }
};

module('Rendering', setupModule, () => {
    test('Text option should depend on the input value', function(assert) {
        this.keyboard.press('up');
        assert.strictEqual(this.instance.option('text'), 'November 10 2012', 'text is correct');
    });

    test('Masks should be enabled when displayFormat is not specified', function(assert) {
        this.instance.option('displayFormat', undefined);
        this.keyboard.press('up');
        assert.strictEqual(this.instance.option('text'), '11/10/2012', 'mask behavior works');
    });

    test('Masks should not be enabled when mode is not text', function(assert) {
        this.instance.option('mode', 'date');
        this.keyboard.press('up');
        assert.strictEqual(this.instance.option('text'), 'October 10 2012', 'mask behavior does not work');
    });

    test('Rendering with non-ldml format', function(assert) {
        this.instance.option('displayFormat', 'shortdate');
        assert.strictEqual(this.instance.option('text'), '10/10/2012', 'format works');
    });
});

module('Date parts rendering', setupModule, () => {
    const checkAndRemoveAccessors = (part, stub, assert) => {
        assert.strictEqual(part.getter(), stub, 'stub getter');
        assert.deepEqual(part.setter, noop, 'stub setter');

        delete part.setter;
        delete part.getter;
        delete part.limits;
    };

    const checkAndRemoveLimits = (part, expected, assert) => {
        const limits = part.limits;
        assert.deepEqual(limits(new Date(2012, 1, 4, 5, 6, 7)), expected, 'limits for ' + part.pattern);

        delete part.limits;
    };

    test('Check parts length', function(assert) {
        assert.strictEqual(this.parts.length, 13);
    });

    test('Day of week', function(assert) {
        checkAndRemoveLimits(this.parts[0], { min: 0, max: 6 }, assert);

        const date = new Date(2012, 1, 4, 15, 6);
        this.parts[0].setter(date, 2);
        assert.strictEqual(date.getDay(), 2, 'setter sets day of week');
        delete this.parts[0].setter;

        assert.deepEqual(this.parts[0], {
            index: 0,
            isStub: false,
            caret: { start: 0, end: 7 },
            getter: 'getDay',
            pattern: 'EEEE',
            text: 'Tuesday'
        });
    });

    test('Month', function(assert) {
        checkAndRemoveLimits(this.parts[2], { min: 1, max: 12 }, assert);

        const date = new Date(2012, 2, 30);
        this.parts[2].setter(date, 1);
        assert.strictEqual(date.getMonth(), 0, 'setter sets month');
        delete this.parts[2].setter;

        assert.strictEqual(this.parts[2].getter(date), 1, 'getter gets moth');
        delete this.parts[2].getter;

        assert.deepEqual(this.parts[2], {
            index: 2,
            isStub: false,
            caret: { start: 9, end: 13 },
            pattern: 'MMMM',
            text: 'July'
        });
    });

    test('Day', function(assert) {
        checkAndRemoveLimits(this.parts[4], { min: 1, max: 31 }, assert);

        const date = new Date(2012, 1, 4, 15, 6);
        this.parts[4].setter(date, 3);
        assert.strictEqual(date.getDate(), 3, 'setter sets day');
        delete this.parts[4].setter;

        assert.deepEqual(this.parts[4], {
            index: 4,
            isStub: false,
            caret: { start: 14, end: 15 },
            getter: 'getDate',
            pattern: 'd',
            text: '2'
        });
    });

    test('Year', function(assert) {
        checkAndRemoveLimits(this.parts[6], { min: 0, max: 9999 }, assert);

        const date = new Date(2012, 1, 4, 15, 6);
        this.parts[6].setter(date, 15);
        assert.strictEqual(date.getFullYear(), 2015, 'setter sets year');
        delete this.parts[6].setter;

        assert.deepEqual(this.parts[6], {
            index: 6,
            isStub: false,
            caret: { start: 17, end: 21 },
            getter: 'getFullYear',
            pattern: 'yyyy',
            text: '2024'
        });
    });

    test('Hours', function(assert) {
        checkAndRemoveLimits(this.parts[8], { min: 0, max: 23 }, assert);

        assert.deepEqual(this.parts[8], {
            index: 8,
            isStub: false,
            caret: { start: 22, end: 24 },
            getter: 'getHours',
            setter: 'setHours',
            pattern: 'HH',
            text: '16'
        });
    });

    test('Minutes', function(assert) {
        checkAndRemoveLimits(this.parts[10], { min: 0, max: 59 }, assert);

        assert.deepEqual(this.parts[10], {
            index: 10,
            isStub: false,
            caret: { start: 25, end: 27 },
            getter: 'getMinutes',
            setter: 'setMinutes',
            pattern: 'mm',
            text: '19'
        });
    });

    test('Seconds', function(assert) {
        const dateString = 'Tuesday, July 2, 2024 16:19:22';
        const regExpInfo = dateParser.getRegExpInfo('EEEE, MMMM d, yyyy HH:mm:ss', dateLocalization);

        this.parts = renderDateParts(dateString, regExpInfo);
        checkAndRemoveLimits(this.parts[12], { min: 0, max: 59 }, assert);

        assert.deepEqual(this.parts[12], {
            index: 12,
            isStub: false,
            caret: { start: 28, end: 30 },
            getter: 'getSeconds',
            setter: 'setSeconds',
            pattern: 'ss',
            text: '22'
        });
    });

    test('Milliseconds', function(assert) {
        const dateString = 'Tuesday, July 2, 2024 16:19:22:333';
        const regExpInfo = dateParser.getRegExpInfo('EEEE, MMMM d, yyyy HH:mm:ss:SSS', dateLocalization);

        this.parts = renderDateParts(dateString, regExpInfo);
        checkAndRemoveLimits(this.parts[14], { min: 0, max: 999 }, assert);

        assert.deepEqual(this.parts[14], {
            index: 14,
            isStub: false,
            caret: { start: 31, end: 34 },
            getter: 'getMilliseconds',
            setter: 'setMilliseconds',
            pattern: 'SSS',
            text: '333'
        });
    });

    test('Time indication', function(assert) {
        checkAndRemoveLimits(this.parts[12], { min: 0, max: 1 }, assert);

        const date = new Date(2012, 1, 4, 15, 6);

        const isPm = this.parts[12].getter(date);
        assert.strictEqual(isPm, 1, 'getter returns PM');
        delete this.parts[12].getter;

        this.parts[12].setter(date, 0);
        assert.strictEqual(date.getHours(), 3, 'setter sets AM');
        delete this.parts[12].setter;

        assert.deepEqual(this.parts[12], {
            index: 12,
            isStub: false,
            caret: { start: 28, end: 30 },
            pattern: 'a',
            text: 'PM'
        });
    });

    test('Comma stub', function(assert) {
        checkAndRemoveAccessors(this.parts[1], ',', assert);

        assert.deepEqual(this.parts[1], {
            index: 1,
            isStub: true,
            caret: { start: 7, end: 9 },
            pattern: ', ',
            text: ', '
        });
    });

    test('Space stub', function(assert) {
        checkAndRemoveAccessors(this.parts[3], ' ', assert);

        assert.deepEqual(this.parts[3], {
            index: 3,
            isStub: true,
            caret: { start: 13, end: 14 },
            pattern: ' ',
            text: ' '
        });
    });

    test('Colon stub', function(assert) {
        checkAndRemoveAccessors(this.parts[9], ':', assert);

        assert.deepEqual(this.parts[9], {
            index: 9,
            isStub: true,
            caret: { start: 24, end: 25 },
            pattern: ':',
            text: ':'
        });
    });

    test('Pattern stub', function(assert) {
        const parts = renderDateParts('dd 2016', dateParser.getRegExpInfo('\'dd\' yyyy', dateLocalization));

        assert.strictEqual(parts.length, 2, 'there are 2 parts rendered');
        assert.ok(parts[0].isStub, 'first part is the stub');
        assert.notOk(parts[1].isStub, 'second part is not the stub');
    });
});

module('Date parts find', setupModule, () => {
    test('Find day of week', function(assert) {
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 0), 0, 'start position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 3), 0, 'middle position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 7), 0, 'end position of the group');
    });

    test('Find month', function(assert) {
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 9), 2, 'start position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 10), 2, 'middle position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 13), 2, 'end position of the group');
    });

    test('Find day', function(assert) {
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 14), 4, 'start position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 15), 4, 'end position of the group');
    });

    test('Find year', function(assert) {
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 17), 6, 'start position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 19), 6, 'middle position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 21), 6, 'end position of the group');
    });

    test('Find hours', function(assert) {
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 22), 8, 'start position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 23), 8, 'middle position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 24), 8, 'end position of the group');
    });

    test('Find minutes', function(assert) {
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 25), 10, 'start position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 26), 10, 'middle position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 27), 10, 'end position of the group');
    });

    test('Find time indicator', function(assert) {
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 28), 12, 'start position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 29), 12, 'middle position of the group');
        assert.strictEqual(getDatePartIndexByPosition(this.parts, 30), 12, 'end position of the group');
    });
});

module('Keyboard navigation', setupModule, () => {
    test('RegisterKeyHandler should work', function(assert) {
        const handler = sinon.spy();
        this.instance.registerKeyHandler('del', handler);

        this.keyboard.press('del');
        assert.strictEqual(handler.callCount, 1, 'registerKeyHandler works');
    });

    test('original keyboard handlers should work after \'registerKeyHandler\'', function(assert) {
        this.instance.registerKeyHandler('space', sinon.stub());
        this.instance.open();

        this.keyboard.press('up');

        assert.strictEqual(this.$input.val(), 'October 10 2012', 'text was not changed');

        const $content = $(this.instance.content());
        const $contouredDate = $content.find('.dx-calendar-contoured-date');
        const $selectedDate = $content.find('.dx-calendar-selected-date');
        assert.notOk($contouredDate.is($selectedDate), 'Contoured date isn\'t a selected');
    });

    test('mask handler should be used instead of the default for delete key when widget is opened (T832885)', function(assert) {
        this.instance.open();

        for(let i = 0; i < 3; ++i) {
            this.keyboard.press('del');
        }

        assert.strictEqual(this.$input.val(), 'January 1 2000', 'value has been reverted');
    });

    test('mask handler should be used instead of the default for backspace key when widget is opened (T832885)', function(assert) {
        this.keyboard
            .press('right')
            .press('right');
        this.instance.open();

        for(let i = 0; i < 3; ++i) {
            this.keyboard.press('backspace');
        }

        assert.strictEqual(this.$input.val(), 'January 1 2000', 'value has been reverted');
    });

    test('Right and left arrows should move the selection', function(assert) {
        this.keyboard.press('right');
        assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'next group is selected');

        this.keyboard.press('left');
        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'previous group is selected');
    });

    test('Home and end keys should move selection to boundaries', function(assert) {
        this.keyboard.focus();
        this.keyboard.press('end');
        assert.deepEqual(this.keyboard.caret(), { start: 11, end: 15 }, 'last group is selected');

        this.keyboard.press('home');
        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'first group is selected');
    });

    test('Up and down arrows should increase and decrease current group value', function(assert) {
        const groups = [
            { pattern: 'EEEE', up: 'Thursday', down: 'Wednesday' },
            { pattern: 'd', up: '11', down: '10' },
            { pattern: 'MMMM', up: 'November', down: 'October' },
            { pattern: 'yyyy', up: '2013', down: '2012' },
            { pattern: 'HH', up: '14', down: '13' },
            { pattern: 'mm', up: '08', down: '07' }
        ];

        assert.strictEqual(this.$input.val(), 'October 10 2012', 'initial value is correct');

        groups.forEach(function(group) {
            this.instance.option('displayFormat', group.pattern);

            this.keyboard.press('up');
            assert.strictEqual(this.$input.val(), group.up, 'group \'' + group.pattern + '\' increased');
            assert.ok(this.keyboard.event.isDefaultPrevented(), 'event should be prevented to save text selection after the press');

            this.keyboard.press('down');
            assert.strictEqual(this.$input.val(), group.down, 'group \'' + group.pattern + '\' decreased');
            assert.ok(this.keyboard.event.isDefaultPrevented(), 'event should be prevented to save text selection after the press');
        }.bind(this));
    });

    test('Up/down arrow press after mask part focus using click should not revert previous changes of other mask part (T1106659)', function(assert) {
        this.instance.option('displayFormat', 'shortdate');

        this.keyboard.press('up');
        this.keyboard.caret(4);
        this.$input.trigger('dxclick');
        this.keyboard.press('up');

        const increasedDateText = '11/11/2012';
        assert.strictEqual(this.$input.val(), increasedDateText, 'input text is changed correctly');

        this.$input.change();
        assert.deepEqual(this.instance.option('value'), new Date(increasedDateText), 'value is changed correctly');
    });

    test('Hours switching should not switch am/pm', function(assert) {
        this.instance.option('displayFormat', 'h a');
        this.instance.option('value', new Date(2012, 3, 4, 23, 55, 0));

        assert.strictEqual(this.$input.val(), '11 PM', 'initial value is correct');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '12 PM', 'am/pm was not switched');
    });

    test('arrows should correctly change hours when the "HH a" format is used', function(assert) {
        this.instance.option({
            value: new Date('10/10/2012 14:00'),
            displayFormat: 'HH a',
        });

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '13 PM');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '12 PM');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '11 AM');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '12 PM');

        this.instance.option('value', new Date('10/10/2012 23:00'));

        assert.strictEqual(this.$input.val(), '23 PM');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '00 AM');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '01 AM');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '00 AM');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '23 PM');
    });

    test('arrows should correctly change hours when the AM/PM format is used (T1206328)', function(assert) {
        this.instance.option({
            value: new Date('10/10/2012 15:00'),
            displayFormat: 'hh a',
        });

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '02 PM');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '01 PM');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '12 PM');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '11 PM');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '12 PM');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '01 PM');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '02 PM');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '03 PM');
    });

    test('up arrow should switch am/pm when AM/PM part is active', function(assert) {
        this.instance.option({
            value: new Date('10/10/2012 22:00'),
            displayFormat: 'a'
        });

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), 'AM');

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), 'PM');
    });

    test('down arrow should switch AM/PM when AM/PM part is active', function(assert) {
        this.instance.option({
            value: new Date('10/10/2012 10:00'),
            displayFormat: 'a'
        });

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), 'PM');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), 'AM');
    });

    test('Moving through the february should not break day value', function(assert) {
        this.instance.option({
            value: new Date(2015, 0, 29),
            displayFormat: 'MMMM, dd'
        });

        this.keyboard.press('up').press('up');
        assert.strictEqual(this.$input.val(), 'March, 29');

        this.keyboard.press('down').press('down');
        assert.strictEqual(this.$input.val(), 'January, 29');
    });

    test('Day reducing by down arrow key should use max date for the current month', function(assert) {
        this.instance.option({
            value: new Date(2015, 1, 1),
            displayFormat: 'dd/MM/yyyy'
        });

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), '28/02/2015', 'the date is correct for \'dd\' date format');

        this.instance.option({
            value: new Date(2015, 1, 1),
            displayFormat: 'MMMM, d'
        });
        this.keyboard.press('right');
        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), 'February, 28', 'the date is correct for \'d\' date format');
    });

    test('Day increasing by up arrow key should use max date for the current month', function(assert) {
        this.instance.option({
            value: new Date(2015, 1, 28),
            displayFormat: 'dd/MM/yyyy'
        });

        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), '01/02/2015');
    });

    test('Month changing should adjust days to limits', function(assert) {
        this.instance.option('value', new Date(2018, 2, 30));
        assert.strictEqual(this.$input.val(), 'March 30 2018', 'initial text is correct');

        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), 'February 28 2018', 'text is correct');
    });

    test('Esc should restore the value', function(assert) {
        this.keyboard.press('up');
        assert.strictEqual(this.$input.val(), 'November 10 2012', 'text was changed');
        assert.strictEqual(this.instance.option('value').getMonth(), 9, 'month did not changed in the value');

        this.keyboard.press('esc');
        assert.strictEqual(this.$input.val(), 'October 10 2012', 'text was reverted');
    });

    test('Enter should commit the value', function(assert) {
        this.keyboard.press('up');
        assert.strictEqual(this.instance.option('value').getMonth(), 9, 'month did not changed in the value');

        this.keyboard.press('enter');
        assert.strictEqual(this.instance.option('value').getMonth(), 10, 'month was changed in the value');
    });

    test('Mask should not catch arrows on opened dateBox', function(assert) {
        this.instance.open();
        this.keyboard.press('up');
        this.keyboard.press('right');
        this.keyboard.press('down');
        assert.strictEqual(this.$input.val(), 'October 10 2012', 'text was not changed');
    });

    test('Mask should catch char input on opened dateBox', function(assert) {
        this.instance.open();
        this.keyboard.type('3');
        assert.strictEqual(this.$input.val(), 'March 10 2012', 'text has been changed');
    });

    test('alt+down should open dxDateBox', function(assert) {
        this.keyboard.keyDown('down', { altKey: true });
        assert.ok(this.instance.option('opened'), 'datebox is opened');
    });

    test('delete should revert group to an empty date and go to the next part', function(assert) {
        this.keyboard.press('up');
        assert.strictEqual(this.instance.option('text'), 'November 10 2012', 'text has been changed');

        this.keyboard.press('del');

        assert.strictEqual(this.instance.option('text'), 'January 10 2012', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'caret is good');

        this.keyboard.press('del');
        assert.strictEqual(this.instance.option('text'), 'January 1 2012', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 10, end: 14 }, 'caret is good');

        this.keyboard.press('del');
        assert.strictEqual(this.instance.option('text'), 'January 1 2000', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 10, end: 14 }, 'caret is good');
    });

    test('search value should be cleared after part is reverted', function(assert) {
        this.instance.option('displayFormat', 'dd, yyyy');

        this.keyboard.press('right');
        this.keyboard.type('33');
        this.keyboard.press('del');
        this.keyboard.type('44');

        assert.strictEqual(this.instance.option('text'), '10, 2044', 'text is correct');
    });

    test('search value should be cleared if number was entered after the letter', function(assert) {
        this.instance.option('displayFormat', 'dd-MMM-yyyy');
        this.keyboard.type('11m12y2015');
        assert.strictEqual(this.instance.option('text'), '11-Dec-2015', 'date is correct');
    });

    test('search value should be cleared after part is reverted when all text is selected', function(assert) {
        this.instance.option('displayFormat', 'yyyy');

        this.keyboard.type('33');
        this.keyboard.press('del');
        this.keyboard.type('44');

        assert.strictEqual(this.instance.option('text'), '2044', 'text is correct');
    });

    test('delete should revert a part when the value is null', function(assert) {
        this.instance.option({
            displayFormat: 'MMM yyyy',
            value: null
        });
        this.keyboard.press('up');

        assert.strictEqual(this.instance.option('text'), 'May 2015', 'text has been rendered');

        this.keyboard.press('del');
        assert.strictEqual(this.instance.option('text'), 'Jan 2015', 'text has been reverted');
        assert.deepEqual(this.keyboard.caret(), { start: 4, end: 8 }, 'next group is selected');
    });

    test('backspace should revert group to an empty date and go to the previous part', function(assert) {
        this.keyboard.press('right');
        this.keyboard.press('up');
        assert.strictEqual(this.instance.option('text'), 'October 11 2012', 'text has been changed');

        this.keyboard.press('backspace');

        assert.strictEqual(this.instance.option('text'), 'October 1 2012', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'caret is good');
    });

    test('emptyDateValue option should work', function(assert) {
        this.instance.option('emptyDateValue', new Date(2015, 5, 4));
        this.keyboard.press('up');
        assert.strictEqual(this.instance.option('text'), 'November 10 2012', 'text has been changed');

        this.keyboard.press('del');

        assert.strictEqual(this.instance.option('text'), 'June 10 2012', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 5, end: 7 }, 'caret is good');
    });

    test('removing all text should be possible', function(assert) {
        this.keyboard
            .caret({ start: 0, end: 15 })
            .press('del')
            .change();

        assert.strictEqual(this.instance.option('text'), '', 'text has been changed');
        assert.strictEqual(this.instance.option('value'), null, 'value has been cleared');
    });

    QUnit.testInActiveWindow('focusout should clear search value', function(assert) {
        this.keyboard.type('1');
        assert.strictEqual(this.instance.option('text'), 'January 10 2012', 'text has been changed');

        this.$input.focusout();

        this.keyboard.type('2');
        assert.strictEqual(this.instance.option('text'), 'February 10 2012', 'search value and position was cleared');
        assert.deepEqual(this.keyboard.caret(), { start: 9, end: 11 }, 'first group has been filled again');
    });

    test('enter should clear search value', function(assert) {
        this.keyboard.type('1');

        assert.strictEqual(this.instance.option('text'), 'January 10 2012', 'text has been changed');

        this.keyboard.press('enter');
        this.keyboard.type('2');

        assert.strictEqual(this.instance.option('text'), 'January 2 2012', 'search value was cleared');
    });

    QUnit.test('enter should not prevent keypress event that triggers form validation (T1131035)', function(assert) {
        assert.expect(1);

        this.$element.on('keypress', e => {
            if(e.key === 'Enter') {
                assert.ok(true, 'keypress enter event is triggered');
            }
        });

        this.keyboard.type('1');
        this.keyboard.press('enter');
    });

    test('incorrect input should clear search value', function(assert) {
        this.keyboard.type('jqwed');
        assert.strictEqual(this.instance.option('text'), 'December 10 2012', 'text has been changed');
    });

    test('first part should be active if select all parts and type new date', function(assert) {
        this.keyboard.press('right');

        assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'next group has been selected');

        this.keyboard
            .caret({ start: 0, end: 15 })
            .type('1');

        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'next group has been selected');
    });

    test('first part should be active if select all parts, delete and type new', function(assert) {
        this.keyboard.press('right');

        assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'next group has been selected');

        this.keyboard
            .caret({ start: 0, end: 15 })
            .press('del')
            .type('1');

        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'next group has been selected');
    });

    test('keydown event shouldn\'t be prevented on \'Esc\' key press', function(assert) {
        this.keyboard.press('esc');
        assert.notOk(this.keyboard.event.isDefaultPrevented(), 'event should not be prevented');
    });

    QUnit.test('command+v should not be prevented (T988724)', function(assert) {
        if(!devices.real().mac) {
            assert.ok(true, 'Test is actual only for mac');
            return;
        }

        this.keyboard.keyDown('v', { metaKey: true });

        assert.strictEqual(this.keyboard.event.isDefaultPrevented(), false, 'keydown event is not prevented');
    });
});

module('Events', setupModule, () => {
    test('Select date part on click', function(assert) {
        this.keyboard.caret(9);
        this.$input.trigger('dxclick');

        assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'caret position is good');
    });

    test('Increment and decrement date part by mouse wheel', function(assert) {
        this.$input.get(0).focus();

        this.pointer.wheel(10);
        assert.strictEqual(this.$input.val(), 'November 10 2012', 'increment works');

        this.pointer.wheel(-10);
        assert.strictEqual(this.$input.val(), 'October 10 2012', 'decrement works');
    });

    test('Change date part by mouse wheel after clicking on stubs before the value part', function(assert) {
        this.instance.option('displayFormat', '\'stub\'dd/MM/yyyy');
        this.keyboard.caret(2);
        this.$input.trigger('dxclick');

        this.pointer.wheel(10);
        assert.strictEqual(this.$input.val(), 'stub11/10/2012', 'value updated');
    });

    test('Change date part by mouse wheel after clicking on stubs after the value part', function(assert) {
        this.instance.option('displayFormat', 'dd/MM/yyyy\'stub\'');
        this.keyboard.caret(12);
        this.$input.trigger('dxclick');

        this.pointer.wheel(10);
        assert.strictEqual(this.$input.val(), '10/10/2013stub', 'value updated');
    });

    test('it should not be possible to drag text in the editor', function(assert) {
        this.keyboard.type('3');
        assert.strictEqual(this.$input.val(), 'March 10 2012', 'text has been changed');

        this.$input.trigger('drop');
        assert.strictEqual(this.$input.val(), 'March 10 2012', 'text has not reverted');
        assert.deepEqual(this.keyboard.caret(), { start: 6, end: 8 }, 'caret is good');
    });

    test('paste should be possible when pasting data matches the format', function(assert) {
        this.instance.option('value', null);

        this.keyboard.paste('123456');
        assert.strictEqual(this.$input.val(), '', 'pasting incorrect value is not allowed');

        this.keyboard.paste('November 10 2018');
        assert.strictEqual(this.$input.val(), 'November 10 2018', 'pasting correct value is allowed');
    });

    test('exception should not be thrown when the widget disposed on valueChange', function(assert) {
        this.instance.option({
            value: new Date(2019, 11, 31),
            onValueChanged: function(e) {
                e.component.dispose();
            }
        });

        this.keyboard.type('1');
        this.$input.trigger('focusout');

        assert.strictEqual(this.$input.val(), 'January 31 2019', 'value is correct');
    });

    test('change event should be triggered before focusout event (T1026909)', function(assert) {
        const valueChangedStub = sinon.stub();
        const focusOutStub = sinon.stub();

        this.instance.option({
            onValueChanged: valueChangedStub,
            onFocusOut: focusOutStub
        });

        this.keyboard
            .focus()
            .type('1')
            .blur();

        assert.ok(valueChangedStub.calledBefore(focusOutStub));
    });

    test('onInput event handler should be called even when useMaskBehavior option is true (T1023540)', function(assert) {
        const onInput = sinon.stub();

        this.instance.option({ onInput });

        this.keyboard
            .focus()
            .type('1');

        assert.ok(onInput.calledOnce);
    });

    QUnit.test('click on input after clear button click should not cause any errors, useMaskBehavior: true (T1094710)', function(assert) {
        const isIos = devices.current().platform === 'ios';
        const isMac = devices.current().mac;
        const currentDate = new Date();

        this.instance.option({
            pickerType: 'calendar',
            showClearButton: true,
            value: new Date(2022, 3, 3),
            displayFormat: 'dd.MM.yyyy HH:mm',
            onValueChanged(e) {
                if(e.value === null) {
                    e.component.option('value', currentDate);
                }
            },
            useMaskBehavior: true
        });

        const $clearButton = this.$element.find(`.${CLEAR_BUTTON_AREA_CLASS}`);

        $clearButton.trigger('dxclick');

        assert.deepEqual(this.keyboard.caret(), isIos || isMac ? { start: 16, end: 16 } : { start: 0, end: 2 }, 'caret');

        try {
            this.keyboard.caret(9);
            this.$input.trigger('dxclick');
        } catch(e) {
            assert.ok(false, `error: ${e.message}`);
        } finally {
            assert.strictEqual(this.instance.option('value'), currentDate, 'value is updated correctly');
        }
    });

    QUnit.test('focusout after clear value by clear button should not lose input value, useMaskBehavior: true', function(assert) {
        const currentDate = new Date();

        this.instance.option({
            pickerType: 'calendar',
            showClearButton: true,
            value: new Date(2022, 3, 3),
            displayFormat: 'dd.MM.yyyy HH:mm',
            onValueChanged(e) {
                if(e.value === null) {
                    e.component.option('value', currentDate);
                }
            },
            useMaskBehavior: true
        });

        const $clearButton = this.$element.find(`.${CLEAR_BUTTON_AREA_CLASS}`);

        $clearButton.trigger('dxclick');

        this.$input.focusout();

        assert.strictEqual(this.instance.option('value'), currentDate, 'value is updated correctly');
    });

    QUnit.test('drop event should be prevented in a masked date box (T1188135)', function(assert) {
        this.instance.option({
            displayFormat: 'dd.MM.yyyy HH:mm',
            useMaskBehavior: true
        });

        const event = $.Event(DROP_EVENT_NAME);

        this.$input.trigger(event);

        assert.strictEqual(event.isDefaultPrevented(), true, `the ${DROP_EVENT_NAME} event is prevented`);
    });
});

module('Search', setupModule, () => {
    test('Time indication', function(assert) {
        this.instance.option('displayFormat', 'a');

        this.keyboard.type('a');
        assert.strictEqual(this.$input.val(), 'AM', 'select on typing');

        this.keyboard.type('p');
        assert.strictEqual(this.$input.val(), 'PM', 'revert incorrect changes');
    });

    test('Hour', function(assert) {
        this.instance.option('displayFormat', 'hh');

        this.keyboard.type('31');
        assert.strictEqual(this.$input.val(), '01', 'don\'t accept out-of-limit values');

        this.keyboard.type('2');
        assert.strictEqual(this.$input.val(), '12', 'set new value');
    });

    test('Day of week', function(assert) {
        this.instance.option('displayFormat', 'EEEE');

        this.keyboard.type('monda');
        assert.strictEqual(this.$input.val(), 'Monday', 'select on typing');

        this.keyboard.type('s');
        assert.strictEqual(this.$input.val(), 'Saturday', 'revert incorrect changes');
    });

    test('Day of week by a number', function(assert) {
        this.instance.option('displayFormat', 'EEEE');

        this.keyboard.type('0');
        assert.strictEqual(this.$input.val(), 'Sunday', 'week starts from the Sunday');

        this.keyboard.type('6');
        assert.strictEqual(this.$input.val(), 'Saturday', 'week ends at the Saturday');

        this.keyboard.type('7');
        assert.strictEqual(this.$input.val(), 'Saturday', 'out-of-limit values does not supported');
    });

    test('Day', function(assert) {
        this.instance.option('displayFormat', 'MMM, dd');

        this.keyboard
            .type('feb')
            .press('right')
            .type('3');

        assert.strictEqual(this.$input.val(), 'Feb, 03', 'select on typing');

        this.keyboard.type('1');
        assert.strictEqual(this.$input.val(), 'Mar, 31', 'current month overflow should increase month');

        this.keyboard.press('enter');
        this.keyboard.type('35');
        assert.strictEqual(this.$input.val(), 'Mar, 05', 'out-of-limit values should clear search value');
    });

    test('Month', function(assert) {
        this.instance.option('displayFormat', 'MMMM');

        this.keyboard.type('janu');
        assert.strictEqual(this.$input.val(), 'January', 'select on typing');

        this.clock.tick(1);
        this.keyboard.type('d');
        assert.strictEqual(this.$input.val(), 'December', 'revert incorrect chars');
    });

    test('Month by char step over February', function(assert) {
        this.instance.option({
            value: new Date(2015, 0, 29),
            displayFormat: 'MMMM, dd'
        });

        this.keyboard.type('march');
        assert.strictEqual(this.$input.val(), 'March, 29', 'move forward, text is correct');

        this.keyboard.type('january');
        assert.strictEqual(this.$input.val(), 'January, 29', 'move backward, text is correct');
    });

    test('Short month', function(assert) {
        this.instance.option('displayFormat', 'MMM');

        this.keyboard.type('jan');
        assert.strictEqual(this.$input.val(), 'Jan', 'select on typing');

        this.keyboard.type('d');
        assert.strictEqual(this.$input.val(), 'Dec', 'revert incorrect chars');
    });

    test('Month by a number', function(assert) {
        this.instance.option('displayFormat', 'MMMM');

        this.keyboard.type('1');
        assert.strictEqual(this.$input.val(), 'January');

        this.keyboard.type('30');
        assert.strictEqual(this.$input.val(), 'January');

        this.keyboard.type('05');
        assert.strictEqual(this.$input.val(), 'May');
    });

    test('Year', function(assert) {
        this.instance.option('displayFormat', 'yyyy');

        this.keyboard.type('1995');
        assert.strictEqual(this.$input.val(), '1995');

        this.keyboard.type('2');
        assert.strictEqual(this.$input.val(), '9952');

        this.keyboard.type('0');
        assert.strictEqual(this.$input.val(), '9520');

        this.keyboard.type('1');
        assert.strictEqual(this.$input.val(), '5201');

        this.keyboard.type('8');
        assert.strictEqual(this.$input.val(), '2018');

        this.keyboard.type('0000');
        assert.strictEqual(this.$input.val(), '0000');
    });

    test('Short Year', function(assert) {
        this.instance.option({
            value: new Date(1990, 4, 2),
            displayFormat: 'yy'
        });

        this.keyboard
            .type('21')
            .press('enter');

        assert.strictEqual(this.instance.option('value').getFullYear(), 1921, 'only 2 last digits of the year should be changed');
    });

    test('Hotkeys should not be handled by the search', function(assert) {
        this.instance.option('displayFormat', 'EEEE');

        this.keyboard.keyDown('s', { altKey: true });
        assert.strictEqual(this.$input.val(), 'Wednesday', 'alt was not handled');

        this.keyboard.keyDown('s', { ctrlKey: true });
        assert.strictEqual(this.$input.val(), 'Wednesday', 'ctrl was not handled');
    });

    test('Typing a letter in the year section should not lead to an infinite loop', function(assert) {
        this.instance.option('displayFormat', 'yyyy');

        sinon.stub(this.instance, '_partIncrease').throws(new Error);

        try {
            this.keyboard.type('s');
            assert.strictEqual(this.$input.val(), '2012', 'year was not changed');
        } catch(e) {
            assert.notOk(true, 'Infinite loop detected');
        }
    });

    test('Typing an non-digital IME composition should not ignore mask rules (T905190)', function(assert) {
        this.instance.option('displayFormat', 'yyyy/MM/dd');

        this.keyboard.caret({ start: 0, end: 4 });

        this.$input.val('f/10/10');

        const eventsData = {
            keyDownCode: 'KeyF',
            inputData: 'f',
            compositionEndData: '分'
        };

        simulateIMEInput.call(this, eventsData);

        assert.strictEqual(this.$input.val(), '2012/10/10', 'year was not changed');
    });


    test('Typing an digital IME composition should not ignore mask rules (T905190)', function(assert) {
        this.instance.option('displayFormat', 'yyyy/MM/dd');

        this.keyboard.caret({ start: 0, end: 4 });

        const eventsData = {
            keyDownCode: 'Digit5',
            inputData: '5',
            compositionEndData: '5'
        };

        simulateIMEInput.call(this, eventsData);
        simulateIMEInput.call(this, eventsData);
        simulateIMEInput.call(this, eventsData);
        simulateIMEInput.call(this, eventsData);
        simulateIMEInput.call(this, eventsData);
        simulateIMEInput.call(this, eventsData);

        assert.strictEqual(this.$input.val(), '5555/05/05', 'year was changed');
    });


    test('Pasting incorrect value to the date part should not ignore mask rules', function(assert) {
        this.instance.option('displayFormat', 'yyyy/MM/dd');

        this.keyboard
            .caret({ start: 0, end: 4 })
            .paste('555555')
            .change();

        assert.strictEqual(this.$input.val(), '2012/10/10', 'year was not changed');
    });
});

module('Date AM/PM Handling', setupModule, () => {
    ['a', 'aa', 'aaa', 'aaaa', 'aaaaa'].forEach((format) => {
        test(`wrong key should not change PM to AM if displayFormat=${format}`, function(assert) {
            this.instance.option('value', new Date('10/10/2012 10:00 PM'));
            this.instance.option('displayFormat', format);

            this.keyboard.type('t');

            assert.strictEqual(this.$input.val(), 'PM');
        });

        test(`wrong key should not change AM to PM if displayFormat=${format}`, function(assert) {
            this.instance.option('value', new Date('10/10/2012 10:00 AM'));
            this.instance.option('displayFormat', format);

            this.keyboard.type('q');

            assert.strictEqual(this.$input.val(), 'AM');
        });

        test(`when "a" is pressed it should change PM to AM if displayFormat=${format} (T1217203)`, function(assert) {
            this.instance.option('value', new Date('10/10/2012 10:00 PM'));
            this.instance.option('displayFormat', format);

            this.keyboard.type('a');

            assert.strictEqual(this.$input.val(), 'AM');
        });

        test(`when "p" is pressed it should change AM to PM if displayFormat=${format}`, function(assert) {
            this.instance.option('value', new Date('10/10/2012 10:00 AM'));
            this.instance.option('displayFormat', format);

            this.keyboard.type('p');

            assert.strictEqual(this.$input.val(), 'PM');
        });
    });
});

module('TimeZone Handling', setupModule, () => {
    test('should support \'x\' in date pattern and not generate errors (T1241387)', function(assert) {
        try {
            this.instance.option({
                displayFormat: 'yyyy-MM-dd\'T\'HH:mm:ssxxx',
                useMaskBehavior: true,
                type: 'date',
            });
            assert.ok(true, 'no error shown');
        } catch(e) {
            assert.ok(false, 'error exists');
        }
    });

    test('should not show error when changing timezone on runtime via up/down buttons (T1241387)', function(assert) {
        try {
            this.instance.option({
                displayFormat: 'yyyy-MM-dd\'T\'HH:mm:ssxxx',
                useMaskBehavior: true,
                type: 'date',
            });
            const oldValue = this.$input.val();
            this.keyboard.caret({ start: 20, end: 24 });
            this.$input.focus().trigger('dxclick');
            this.keyboard.press('up');

            assert.ok(true, 'no error shown');
            assert.strictEqual(this.$input.val(), oldValue, 'value has not been modified');
        } catch(e) {
            assert.ok(false, 'error exists');
        }
    });
});

module('Empty dateBox', {
    beforeEach: function() {
        setupModule.beforeEach.call(this);
        this.instance.option('value', null);
    },
    afterEach: setupModule.afterEach
}, () => {
    test('Current date should be rendered on first input', function(assert) {
        this.keyboard.type('1');
        assert.strictEqual(this.$input.val(), 'January 14 2015', 'first part was changed, other parts is from the current date');
    });

    QUnit.testInActiveWindow('Bluring the input after first input should update the value', function(assert) {
        this.keyboard.type('1');
        this.$input.focusout();

        assert.strictEqual(this.$input.val(), 'January 14 2015', 'text is correct');
        assert.strictEqual(this.instance.option('value').getMonth(), 0, 'value is correct');
    });

    test('Clear button should work', function(assert) {
        this.instance.option({
            showClearButton: true,
            value: new Date(2018, 6, 19)
        });

        assert.strictEqual(this.$input.val(), 'July 19 2018', 'initial value is correct');

        this.$element.find(`.${CLEAR_BUTTON_AREA_CLASS}`).trigger('dxclick');

        assert.strictEqual(this.$input.val(), '', 'text was cleared');
        assert.strictEqual(this.instance.option('value'), null, 'value was cleared');

        this.$input.trigger('change');

        assert.strictEqual(this.$input.val(), '', 'text is still cleared');
        assert.strictEqual(this.instance.option('value'), null, 'value is still cleared');

        this.keyboard.type('1');
        assert.strictEqual(this.$input.val(), 'January 14 2015', 'text is correct after clearing');
    });

    test('Incorrect search on empty input should render current date', function(assert) {
        this.keyboard.type('qq');

        assert.strictEqual(this.$input.val(), 'April 14 2015', 'text is correct');
        assert.strictEqual(this.instance.option('value'), null, 'value is correct');
    });

    test('focus and blur empty input should not change it\'s value', function(assert) {
        this.$input.trigger('focusin');
        this.$input.trigger('focusout');

        assert.strictEqual(this.$input.val(), '', 'text is correct');
        assert.strictEqual(this.instance.option('value'), null, 'value is correct');
    });

    test('focusing datebox by click should work', function(assert) {
        this.$input.trigger('dxclick');
        this.keyboard.type('2');

        assert.strictEqual(this.$input.val(), 'February 14 2015', 'text is correct');
        assert.strictEqual(this.instance.option('value'), null, 'value is correct');
    });

    test('focusing datebox by mousewheel should work', function(assert) {
        this.pointer.wheel(10);
        this.keyboard.type('2');

        assert.strictEqual(this.$input.val(), 'February 14 2015', 'text is correct');
        assert.strictEqual(this.instance.option('value'), null, 'value is correct');
    });

    test('moving between groups should work with empty dateBox', function(assert) {
        ['up', 'down', 'right', 'left', 'home', 'end', 'esc'].forEach((arrow) => {
            this.instance.option('value', null);
            this.keyboard.press(arrow);
            assert.ok(true, arrow + ' key is good');
        });

        assert.strictEqual(this.$input.val(), '', 'text is correct');
        assert.strictEqual(this.instance.option('value'), null, 'value is correct');
    });

    test('Short Year should use current date', function(assert) {
        this.instance.option('displayFormat', 'yy');

        const dateStart = new Date().getFullYear().toString().substr(0, 2);

        this.keyboard
            .type('21')
            .press('enter');

        assert.strictEqual(this.instance.option('value').getFullYear(), parseInt(dateStart + '21'), 'only 2 last digits of the year should be changed');
    });

    test('Click and leave empty datebox should not change the value', function(assert) {
        this.instance.option('displayFormat', 'yy');

        this.$input.trigger('dxclick');
        this.keyboard.press('enter');
        this.$input.trigger('focusout');

        assert.strictEqual(this.$input.val(), '', 'value is correct');
    });

    [
        'home',
        'end',
        'del',
        'backpace',
        'esc',
        'left',
        'right',
        'enter'
    ].forEach((key) => {
        test(`${key} key should do nothing in an empty datebox`, function(assert) {
            this.keyboard.press(key);

            assert.deepEqual(this.instance.option('value'), null, 'value is good');
            assert.deepEqual(this.$input.val(), '', 'text is good');
            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 0 }, 'caret is good');
        });
    });

    test('space keydown event should be prevented', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const value = new Date(2020, 5, 5);
        this.instance.option({ value });
        this.keyboard.keyDown('space');

        assert.ok(this.keyboard.event.isDefaultPrevented(), 'space key keydown prevented');
    });
});

module('Options changed', setupModule, () => {
    test('The \'useMaskBehavior\' option is changed to false', function(assert) {
        this.keyboard.caret(9);
        this.$input.trigger('dxclick');

        this.instance.option('useMaskBehavior', false);

        assert.notOk(this.instance._dateParts, 'dateParts is undefined');
        assert.notOk(this.instance._activePartIndex, 'activePartIndex is undefined');
        assert.notOk(this.instance._maskValue, 'maskValue is undefined');

        this.keyboard.caret(9);
        this.$input.trigger('dxclick');

        assert.deepEqual(this.keyboard.caret(), { start: 9, end: 9 }, 'caret is not changed');

        this.pointer.wheel(10);
        assert.strictEqual(this.$input.val(), 'October 10 2012', 'date is not changed on mouse wheel');
    });

    test('Value should not contain time after value change if type is "date" when maskBehavior is enabled (T895922)', function(assert) {
        this.keyboard
            .focus()
            .press('down')
            .change();

        const expectedValue = new Date(2012, 8, 10, 0, 0, 0);

        assert.deepEqual(this.instance.option('value'), expectedValue, 'there is no time in the value');
    });

    test('ValueChanged event should be fired after input clearing undo (T878918)', function(assert) {
        const valueChangedHandler = sinon.spy();
        const date = this.instance.option('value');
        date.setHours(0, 0, 0, 0);
        this.instance.option('onValueChanged', valueChangedHandler);

        this.$input
            .val('')
            .change();

        let args = valueChangedHandler.getCall(0).args[0];
        assert.ok(valueChangedHandler.calledOnce, 'value has been changed');
        assert.strictEqual(args.value, null, 'value is correct');

        this.$input
            .val(date)
            .change();

        args = valueChangedHandler.getCall(1).args[0];
        assert.strictEqual(valueChangedHandler.callCount, 2, 'value has been changed');
        assert.deepEqual(args.value, date, 'value is correct');
    });

    test('onValueChanged should have event', function(assert) {
        const valueChangedHandler = sinon.spy();

        this.instance.option({
            onValueChanged: valueChangedHandler
        });

        this.keyboard.press('up').press('enter');

        assert.strictEqual(valueChangedHandler.callCount, 1, 'handler has been called once');
        assert.strictEqual(valueChangedHandler.getCall(0).args[0].event.type, 'change', 'event is correct');

        this.instance.option('value', new Date(2012, 4, 5));
        assert.strictEqual(valueChangedHandler.callCount, 2, 'handler has been called twice');
        assert.strictEqual(valueChangedHandler.getCall(1).args[0].event, undefined, 'event has been cleared');
    });

    test('It should be possible to set a value via calendar', function(assert) {
        this.instance.option({
            opened: true
        });

        this.keyboard.press('right').press('enter');
        assert.strictEqual(this.$input.val(), 'October 11 2012', 'text is correct');
        assert.strictEqual(this.instance.option('value').getDate(), 11, 'value is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'caret is good');
    });

    test('Internal _maskValue and public value should be different objects', function(assert) {
        assert.notStrictEqual(this.instance._maskValue, this.instance.option('value'), 'objects are different on init');

        this.instance.option('value', new Date(2012, 1, 2));
        assert.notStrictEqual(this.instance._maskValue, this.instance.option('value'), 'objects are different when setting by value');

        this.keyboard.press('up').press('esc');
        assert.notStrictEqual(this.instance._maskValue, this.instance.option('value'), 'objects are different after revert changes');

        this.keyboard.press('5').press('enter');
        assert.notStrictEqual(this.instance._maskValue, this.instance.option('value'), 'objects are different after enter');

        this.keyboard.press('4');
        this.$input.trigger('focusout');
        assert.notStrictEqual(this.instance._maskValue, this.instance.option('value'), 'objects are different after focusout');

        this.keyboard.press('7').change();
        assert.notStrictEqual(this.instance._maskValue, this.instance.option('value'), 'objects are different after change event');
    });

    test('performance - value change should not lead to recreate regexp and format pattern', function(assert) {
        const regExpInfo = sinon.spy(dateParser, 'getRegExpInfo');

        this.instance.option('displayFormat', 'dd.MM');
        assert.strictEqual(regExpInfo.callCount, 1, 'regexpInfo should be called when format changed');

        this.instance.option('value', new Date(2018, 2, 5, 10, 15, 25));
        assert.strictEqual(regExpInfo.callCount, 1, 'regexpInfo should not be called when value changed');
    });
});

module('Regression', () => {
    QUnit.test('should paste text if value was not initialized (T715236)', function(assert) {
        const $input = $('#dateBox')
            .dxDateBox({
                useMaskBehavior: true,
                pickerType: 'calendar'
            })
            .dxDateBox('instance')
            ._input();

        keyboardMock($input).paste('2/15/2019');
        assert.strictEqual($input.get(0).value, '2/15/2019');
    });

    QUnit.test('selected date should be in 1970 when it was set from user\'s input (T758357)', function(assert) {
        const $dateBox = $('#dateBox').dxDateBox({
            value: null,
            displayFormat: 'HH:mm',
            type: 'time',
            useMaskBehavior: true,
            pickerType: 'calendar'
        });

        keyboardMock($dateBox.find('.dx-texteditor-input'))
            .focus()
            .type('11:11')
            .change();

        assert.strictEqual($dateBox.dxDateBox('option', 'value').getFullYear(), new Date(null).getFullYear(), 'year is correct');
    });

    QUnit.test('There should be no error here after the component loses focus on Option Changed (T1264236)', function(assert) {
        assert.expect(1);

        const instance = $('#dateBox').dxDateBox({
            displayFormat: 'MM/dd/yyyy',
            useMaskBehavior: true,
            openOnFieldClick: true,
            onFocusIn: (e) => {
                e.component.option({ value: new Date('01/13/2025') });
            },
            onOptionChanged: (e) => {
                if(e.name === 'text' && e.value) {
                    try {
                        e.component.blur();
                    } catch(e) {
                        assert.ok(false, `error: ${e.message}`);
                    } finally {
                        assert.ok(true, 'there is no error');
                    }
                }
            },
        }).dxDateBox('instance');

        instance.focus();
    });
});

module('Caret moving', setupModule, () => {
    test('Move caret to the next group', function(assert) {
        this.instance.option({
            displayFormat: 'dd.MM'
        });

        this.keyboard.type('15');

        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved');
    });

    test('Move caret to the next group when next digit will overflow', function(assert) {
        this.instance.option({
            displayFormat: 'MM.dd'
        });

        this.keyboard.type('5');

        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved');
    });

    test('Move caret to the next group after limit overflow', function(assert) {
        this.instance.option({
            displayFormat: 'dd.MM'
        });

        this.keyboard.type('38');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved to month');
    });

    test('Move caret to the next group after format length overflow', function(assert) {
        this.instance.option({
            displayFormat: 'yy MM'
        });

        this.keyboard.type('15');
        assert.strictEqual(this.instance.option('text'), '15 10', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved to month');
    });

    test('Don\'t move caret to next group when format length is less than limit length', function(assert) {
        this.instance.option({
            displayFormat: 'y MM'
        });

        this.keyboard.type('2011');
        assert.strictEqual(this.instance.option('text'), '2011 10', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 5, end: 7 }, 'caret was moved to month');
    });

    test('Caret should not be moved to next group after type hour "1" when "hh" time format is used', function(assert) {
        this.instance.option({
            value: new Date(2021, 9, 17, 16, 6),
            displayFormat: 'hh:mm a'
        });

        this.keyboard.type('1');
        assert.strictEqual(this.instance.option('text'), '01:06 PM', 'text is correct');
        assert.deepEqual(this.keyboard.caret(), { start: 0, end: 2 }, 'caret position is correct');
    });

    [2, 3, 4, 5, 6, 7, 8, 9].forEach((hour) => {
        test(`Caret should be moved to next group after type hour "${hour}" when "hh" time format is used`, function(assert) {
            this.instance.option({
                value: new Date(2021, 9, 17, 16, 6),
                displayFormat: 'hh:mm a'
            });

            this.keyboard.type(`${hour}`);
            assert.strictEqual(this.instance.option('text'), `0${hour}:06 PM`, 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret position is correct');
        });
    });

    [10, 11, 12].forEach((hour) => {
        test(`Caret should be moved to next group after type hour "${hour}" when "hh" time format is used`, function(assert) {
            this.instance.option({
                value: new Date(2021, 9, 17, 16, 6),
                displayFormat: 'hh:mm a'
            });

            this.keyboard.type(`${hour}`);
            assert.strictEqual(this.instance.option('text'), `${hour}:06 PM`, 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved to month');
        });
    });

    [13, 14, 15, 16, 17, 18, 19].forEach((hour) => {
        test(`Caret should be moved to next group after type hour "${hour}" when "hh" time format is used`, function(assert) {
            this.instance.option({
                value: new Date(2021, 9, 17, 16, 6),
                displayFormat: 'hh:mm a'
            });

            this.keyboard.type(`${hour}`);
            assert.strictEqual(this.instance.option('text'), `0${hour.toString()[1]}:06 PM`, 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret position is correct');
        });
    });

    [0, 1, 2].forEach((hour) => {
        test(`Caret should not be moved to next group after type hour "${hour}" when "HH" time format is used`, function(assert) {
            this.instance.option({
                value: new Date(2021, 9, 17, 16, 6),
                displayFormat: 'HH:mm a'
            });

            this.keyboard.type(`${hour}`);
            assert.strictEqual(this.instance.option('text'), `0${hour}:06 AM`, 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 2 }, 'caret position is correct');
        });
    });

    [3, 4, 5, 6, 7, 8, 9].forEach((hour) => {
        test(`Caret should be moved to next group after type hour "${hour}" when "HH" time format is used`, function(assert) {
            this.instance.option({
                value: new Date(2021, 9, 17, 16, 6),
                displayFormat: 'HH:mm a'
            });

            this.keyboard.type(`${hour}`);
            assert.strictEqual(this.instance.option('text'), `0${hour}:06 AM`, 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret position is correct');
        });
    });

    [10, 11].forEach((hour) => {
        test(`Caret should be moved to next group after type hour "${hour}" when "HH" time format is used`, function(assert) {
            this.instance.option({
                value: new Date(2021, 9, 17, 16, 6),
                displayFormat: 'HH:mm a'
            });

            this.keyboard.type(`${hour}`);
            assert.strictEqual(this.instance.option('text'), `${hour}:06 AM`, 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret position is correct');
        });
    });

    [12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23].forEach((hour) => {
        test(`Caret should be moved to next group after type hour "${hour}" when "HH" time format is used`, function(assert) {
            this.instance.option({
                value: new Date(2021, 9, 17, 16, 6),
                displayFormat: 'HH:mm a'
            });

            this.keyboard.type(`${hour}`);
            assert.strictEqual(this.instance.option('text'), `${hour}:06 PM`, 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret position is correct');
        });
    });

    test('Typed year and value should be in the same century when short year format is used', function(assert) {
        this.instance.option({
            displayFormat: 'yy MM',
            value: new Date(1995, 10, 11)
        });

        this.keyboard
            .type('15')
            .press('enter');

        assert.strictEqual(this.instance.option('value').getFullYear(), 1915, 'year is correct');

        this.instance.option('value', new Date(2010, 10, 11));
        this.keyboard
            .press('left')
            .type('14')
            .press('enter');

        assert.strictEqual(this.instance.option('value').getFullYear(), 2014, 'year is correct');
    });

    test('Move caret to the next group after string length overflow', function(assert) {
        this.instance.option({
            displayFormat: 'dd.MM'
        });

        this.keyboard.type('01');
        assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved to month');
    });

    test('Click on input should not change caret position to select date part if all text is selected (T988726)', function(assert) {
        const text = this.instance.option('text');
        const allSelectedCaret = { start: 0, end: text.length };

        this.keyboard.caret(allSelectedCaret);

        this.$input.trigger('dxclick');

        assert.deepEqual(this.keyboard.caret(), allSelectedCaret, 'no date part is selected');
    });
});

module('Using beforeInput event', {
    beforeEach: function() {
        try {
            this.originalDevice = $.extend({ }, devices.real());
            devices.real({
                android: true,
                version: [ '5', '0' ]
            });

            return setupModule.beforeEach.apply(this, arguments);
        } finally {
            this.instance.option({
                value: new Date(2020, 0, 2, 3, 45),
                displayFormat: 'dd/MM/yyyy HH:mm',
            });
        }
    },
    afterEach: function() {
        try {
            return setupModule.afterEach.apply(this, arguments);
        } finally {
            devices.real(this.originalDevice);
        }
    }

}, () => {

    test('typing valid symbols changes value correctly', function(assert) {
        const input = this.$input.get(0);
        this.keyboard.type('030420210455');
        assert.strictEqual(input.value, '03/04/2021 04:55');
    });

    test('typing invalid symbols does not changes value', function(assert) {
        const input = this.$input.get(0);
        this.keyboard.type('abcde');
        assert.strictEqual(input.value, '02/01/2020 03:45');
    });

    test('typing invalid symbols does not changes value on Android devices (T838638)', function(assert) {
        const $input = this.$input;

        $input.val('A');

        this.keyboard
            .keyDown('Unidentified')
            .beforeInput('A', 'insertCompositionText')
            .input('A', 'insertCompositionText');

        assert.strictEqual($input.get(0).value, '02/01/2020 03:45');
    });

    test('unable to delete mask chars on Android devices (T838638)', function(assert) {
        this.keyboard
            .caret(3)
            .beforeInput(null, 'deleteContentBackward')
            .input(null, 'deleteContentBackward');

        assert.strictEqual(this.$input.get(0).value, '01/01/2020 03:45');
    });
});
