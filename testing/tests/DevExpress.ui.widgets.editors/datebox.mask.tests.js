import $ from 'jquery';
import { renderDateParts, getDatePartIndexByPosition } from 'ui/date_box/ui.date_box.mask.parts';
import dateParser from 'localization/ldml/date.parser';
import dateLocalization from 'localization/date';
import { noop } from 'core/utils/common';
import pointerMock from '../../helpers/pointerMock.js';
import 'ui/date_box';
import keyboardMock from '../../helpers/keyboardMock.js';
import devices from 'core/devices';

const { test, module } = QUnit;

QUnit.testStart(() => {
    $('#qunit-fixture').html('<div id=\'dateBox\'></div>');
});

if(devices.real().deviceType === 'desktop') {
    const setupModule = {
        beforeEach: () => {
            this.parts = renderDateParts('Tuesday, July 2, 2024 16:19 PM', dateParser.getRegExpInfo('EEEE, MMMM d, yyyy HH:mm a', dateLocalization));
            this.$element = $('#dateBox').dxDateBox({
                value: new Date('10/10/2012 13:07'),
                useMaskBehavior: true,
                mode: 'text',
                displayFormat: 'MMMM d yyyy'
            });

            this.instance = this.$element.dxDateBox('instance');
            this.$input = this.$element.find('.dx-texteditor-input');
            this.keyboard = keyboardMock(this.$input, true);
            this.pointer = pointerMock(this.$input);
            this.clock = sinon.useFakeTimers(new Date(2015, 3, 14).getTime());
        },

        afterEach: () => {
            this.clock.restore();
        }
    };

    module('Rendering', setupModule, () => {
        test('Text option should depend on the input value', (assert) => {
            this.keyboard.press('up');
            assert.strictEqual(this.instance.option('text'), 'November 10 2012', 'text is correct');
        });

        test('Masks should be enabled when displayFormat is not specified', (assert) => {
            this.instance.option('displayFormat', undefined);
            this.keyboard.press('up');
            assert.strictEqual(this.instance.option('text'), '11/10/2012', 'mask behavior works');
        });

        test('Masks should not be enabled when mode is not text', (assert) => {
            this.instance.option('mode', 'date');
            this.keyboard.press('up');
            assert.strictEqual(this.instance.option('text'), 'October 10 2012', 'mask behavior does not work');
        });

        test('Rendering with non-ldml format', (assert) => {
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

        test('Check parts length', (assert) => {
            assert.strictEqual(this.parts.length, 13);
        });

        test('Day of week', (assert) => {
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

        test('Month', (assert) => {
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

        test('Day', (assert) => {
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

        test('Year', (assert) => {
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

        test('Hours', (assert) => {
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

        test('Minutes', (assert) => {
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

        test('Seconds', (assert) => {
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

        test('Milliseconds', (assert) => {
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

        test('Time indication', (assert) => {
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

        test('Comma stub', (assert) => {
            checkAndRemoveAccessors(this.parts[1], ',', assert);

            assert.deepEqual(this.parts[1], {
                index: 1,
                isStub: true,
                caret: { start: 7, end: 9 },
                pattern: ', ',
                text: ', '
            });
        });

        test('Space stub', (assert) => {
            checkAndRemoveAccessors(this.parts[3], ' ', assert);

            assert.deepEqual(this.parts[3], {
                index: 3,
                isStub: true,
                caret: { start: 13, end: 14 },
                pattern: ' ',
                text: ' '
            });
        });

        test('Colon stub', (assert) => {
            checkAndRemoveAccessors(this.parts[9], ':', assert);

            assert.deepEqual(this.parts[9], {
                index: 9,
                isStub: true,
                caret: { start: 24, end: 25 },
                pattern: ':',
                text: ':'
            });
        });

        test('Pattern stub', (assert) => {
            const parts = renderDateParts('dd 2016', dateParser.getRegExpInfo('\'dd\' yyyy', dateLocalization));

            assert.strictEqual(parts.length, 2, 'there are 2 parts rendered');
            assert.ok(parts[0].isStub, 'first part is the stub');
            assert.notOk(parts[1].isStub, 'second part is not the stub');
        });
    });

    module('Date parts find', setupModule, () => {
        test('Find day of week', (assert) => {
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 0), 0, 'start position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 3), 0, 'middle position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 7), 0, 'end position of the group');
        });

        test('Find month', (assert) => {
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 9), 2, 'start position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 10), 2, 'middle position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 13), 2, 'end position of the group');
        });

        test('Find day', (assert) => {
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 14), 4, 'start position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 15), 4, 'end position of the group');
        });

        test('Find year', (assert) => {
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 17), 6, 'start position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 19), 6, 'middle position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 21), 6, 'end position of the group');
        });

        test('Find hours', (assert) => {
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 22), 8, 'start position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 23), 8, 'middle position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 24), 8, 'end position of the group');
        });

        test('Find minutes', (assert) => {
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 25), 10, 'start position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 26), 10, 'middle position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 27), 10, 'end position of the group');
        });

        test('Find time indicator', (assert) => {
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 28), 12, 'start position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 29), 12, 'middle position of the group');
            assert.strictEqual(getDatePartIndexByPosition(this.parts, 30), 12, 'end position of the group');
        });
    });

    module('Keyboard navigation', setupModule, () => {
        test('RegisterKeyHandler should work', (assert) => {
            const handler = sinon.spy();
            this.instance.registerKeyHandler('del', handler);

            this.keyboard.press('del');
            assert.strictEqual(handler.callCount, 1, 'registerKeyHandler works');
        });

        test('original keyboard handlers should work after \'registerKeyHandler\'', (assert) => {
            this.instance.option('pickerType', 'calendar');
            this.instance.registerKeyHandler('space', sinon.stub());
            this.instance.open();

            this.keyboard.press('up');

            assert.strictEqual(this.$input.val(), 'October 10 2012', 'text was not changed');

            const $content = $(this.instance.content());
            const $contouredDate = $content.find('.dx-calendar-contoured-date');
            const $selectedDate = $content.find('.dx-calendar-selected-date');
            assert.notOk($contouredDate.is($selectedDate), 'Contoured date isn\'t a selected');
        });

        test('mask handler should be used instead of the default for delete key when widget is opened (T832885)', (assert) => {
            this.instance.open();

            for(let i = 0; i < 3; ++i) {
                this.keyboard.press('del');
            }

            assert.strictEqual(this.$input.val(), 'January 1 2000', 'value has been reverted');
        });

        test('mask handler should be used instead of the default for backspace key when widget is opened (T832885)', (assert) => {
            this.keyboard
                .press('right')
                .press('right');
            this.instance.open();

            for(let i = 0; i < 3; ++i) {
                this.keyboard.press('backspace');
            }

            assert.strictEqual(this.$input.val(), 'January 1 2000', 'value has been reverted');
        });

        test('Right and left arrows should move the selection', (assert) => {
            this.keyboard.press('right');
            assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'next group is selected');

            this.keyboard.press('left');
            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'previous group is selected');
        });

        test('Home and end keys should move selection to boundaries', (assert) => {
            this.keyboard.focus();
            this.keyboard.press('end');
            assert.deepEqual(this.keyboard.caret(), { start: 11, end: 15 }, 'last group is selected');

            this.keyboard.press('home');
            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'first group is selected');
        });

        test('Up and down arrows should increase and decrease current group value', (assert) => {
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

        test('Hours switching should not switch am/pm', (assert) => {
            this.instance.option('displayFormat', 'h a');
            this.instance.option('value', new Date(2012, 3, 4, 23, 55, 0));

            assert.strictEqual(this.$input.val(), '11 PM', 'initial value is correct');

            this.keyboard.press('up');
            assert.strictEqual(this.$input.val(), '12 PM', 'am/pm was not switched');
        });

        test('Moving through the february should not break day value', (assert) => {
            this.instance.option({
                value: new Date(2015, 0, 29),
                displayFormat: 'MMMM, dd'
            });

            this.keyboard.press('up').press('up');
            assert.strictEqual(this.$input.val(), 'March, 29');

            this.keyboard.press('down').press('down');
            assert.strictEqual(this.$input.val(), 'January, 29');
        });

        test('Day reducing by down arrow key should use max date for the current month', (assert) => {
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

        test('Day increasing by up arrow key should use max date for the current month', (assert) => {
            this.instance.option({
                value: new Date(2015, 1, 28),
                displayFormat: 'dd/MM/yyyy'
            });

            this.keyboard.press('up');
            assert.strictEqual(this.$input.val(), '01/02/2015');
        });

        test('Month changing should adjust days to limits', (assert) => {
            this.instance.option('value', new Date(2018, 2, 30));
            assert.strictEqual(this.$input.val(), 'March 30 2018', 'initial text is correct');

            this.keyboard.press('down');
            assert.strictEqual(this.$input.val(), 'February 28 2018', 'text is correct');
        });

        test('Esc should restore the value', (assert) => {
            this.keyboard.press('up');
            assert.strictEqual(this.$input.val(), 'November 10 2012', 'text was changed');
            assert.strictEqual(this.instance.option('value').getMonth(), 9, 'month did not changed in the value');

            this.keyboard.press('esc');
            assert.strictEqual(this.$input.val(), 'October 10 2012', 'text was reverted');
        });

        test('Enter should commit the value', (assert) => {
            this.keyboard.press('up');
            assert.strictEqual(this.instance.option('value').getMonth(), 9, 'month did not changed in the value');

            this.keyboard.press('enter');
            assert.strictEqual(this.instance.option('value').getMonth(), 10, 'November 10 2012', 'month was changed in the value');

            this.keyboard.press('down');
            assert.strictEqual(this.$input.val(), 'November 9 2012', 'text was changed');
            assert.strictEqual(this.instance.option('value').getDate(), 10, 'day did not changed in the value after commit');
        });

        test('Mask should not catch arrows on opened dateBox', (assert) => {
            this.instance.open();
            this.keyboard.press('up');
            this.keyboard.press('right');
            this.keyboard.press('down');
            assert.strictEqual(this.$input.val(), 'October 10 2012', 'text was not changed');
        });

        test('Mask should catch char input on opened dateBox', (assert) => {
            this.instance.open();
            this.keyboard.type('3');
            assert.strictEqual(this.$input.val(), 'March 10 2012', 'text has been changed');
        });

        test('alt+down should open dxDateBox', (assert) => {
            this.keyboard.keyDown('down', { altKey: true });
            assert.ok(this.instance.option('opened'), 'datebox is opened');
        });

        test('delete should revert group to an empty date and go to the next part', (assert) => {
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

        test('search value should be cleared after part is reverted', (assert) => {
            this.instance.option('displayFormat', 'dd, yyyy');

            this.keyboard.press('right');
            this.keyboard.type('33');
            this.keyboard.press('del');
            this.keyboard.type('44');

            assert.strictEqual(this.instance.option('text'), '10, 2044', 'text is correct');
        });

        test('search value should be cleared if number was entered after the letter', (assert) => {
            this.instance.option('displayFormat', 'dd-MMM-yyyy');
            this.keyboard.type('11m12y2015');
            assert.strictEqual(this.instance.option('text'), '11-Dec-2015', 'date is correct');
        });

        test('search value should be cleared after part is reverted when all text is selected', (assert) => {
            this.instance.option('displayFormat', 'yyyy');

            this.keyboard.type('33');
            this.keyboard.press('del');
            this.keyboard.type('44');

            assert.strictEqual(this.instance.option('text'), '2044', 'text is correct');
        });

        test('delete should revert a part when the value is null', (assert) => {
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

        test('backspace should revert group to an empty date and go to the previous part', (assert) => {
            this.keyboard.press('right');
            this.keyboard.press('up');
            assert.strictEqual(this.instance.option('text'), 'October 11 2012', 'text has been changed');

            this.keyboard.press('backspace');

            assert.strictEqual(this.instance.option('text'), 'October 1 2012', 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'caret is good');
        });

        test('emptyDateValue option should work', (assert) => {
            this.instance.option('emptyDateValue', new Date(2015, 5, 4));
            this.keyboard.press('up');
            assert.strictEqual(this.instance.option('text'), 'November 10 2012', 'text has been changed');

            this.keyboard.press('del');

            assert.strictEqual(this.instance.option('text'), 'June 10 2012', 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 5, end: 7 }, 'caret is good');
        });

        test('removing all text should be possible', (assert) => {
            this.keyboard
                .caret({ start: 0, end: 15 })
                .press('del')
                .change();

            assert.strictEqual(this.instance.option('text'), '', 'text has been changed');
            assert.strictEqual(this.instance.option('value'), null, 'value has been cleared');
        });

        QUnit.testInActiveWindow('focusout should clear search value', (assert) => {
            this.keyboard.type('1');
            assert.strictEqual(this.instance.option('text'), 'January 10 2012', 'text has been changed');

            this.$input.focusout();
            this.keyboard.type('2');
            assert.strictEqual(this.instance.option('text'), 'February 10 2012', 'search value and position was cleared');
            assert.deepEqual(this.keyboard.caret(), { start: 9, end: 11 }, 'first group has been filled again');
        });

        test('enter should clear search value', (assert) => {
            this.keyboard.type('1');
            assert.strictEqual(this.instance.option('text'), 'January 10 2012', 'text has been changed');

            this.keyboard.press('enter');
            this.keyboard.type('2');
            assert.strictEqual(this.instance.option('text'), 'January 2 2012', 'search value was cleared');
            assert.deepEqual(this.keyboard.caret(), { start: 8, end: 9 }, 'next group has been selected');
        });

        test('incorrect input should clear search value', (assert) => {
            this.keyboard.type('jqwed');
            assert.strictEqual(this.instance.option('text'), 'December 10 2012', 'text has been changed');
        });

        test('first part should be active if select all parts and type new date', (assert) => {
            this.keyboard.press('right');

            assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'next group has been selected');

            this.keyboard
                .caret({ start: 0, end: 15 })
                .type('1');

            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'next group has been selected');
        });

        test('first part should be active if select all parts, delete and type new', (assert) => {
            this.keyboard.press('right');

            assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'next group has been selected');

            this.keyboard
                .caret({ start: 0, end: 15 })
                .press('del')
                .type('1');

            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'next group has been selected');
        });

        test('keydown event shouldn\'t be prevented on \'Esc\' key press', (assert) => {
            this.keyboard.press('esc');
            assert.notOk(this.keyboard.event.isDefaultPrevented(), 'event should not be prevented');
        });
    });

    module('Events', setupModule, () => {
        test('Select date part on click', (assert) => {
            this.keyboard.caret(9);
            this.$input.trigger('dxclick');

            assert.deepEqual(this.keyboard.caret(), { start: 8, end: 10 }, 'caret position is good');
        });

        test('Increment and decrement date part by mouse wheel', (assert) => {
            this.$input.get(0).focus();

            this.pointer.wheel(10);
            assert.strictEqual(this.$input.val(), 'November 10 2012', 'increment works');

            this.pointer.wheel(-10);
            assert.strictEqual(this.$input.val(), 'October 10 2012', 'decrement works');
        });

        test('it should not be possible to drag text in the editor', (assert) => {
            this.keyboard.type('3');
            assert.strictEqual(this.$input.val(), 'March 10 2012', 'text has been changed');

            this.$input.trigger('drop');
            assert.strictEqual(this.$input.val(), 'March 10 2012', 'text has not reverted');
            assert.deepEqual(this.keyboard.caret(), { start: 6, end: 8 }, 'caret is good');
        });

        test('paste should be possible when pasting data matches the format', (assert) => {
            this.instance.option('value', null);

            this.keyboard.paste('123456');
            assert.strictEqual(this.$input.val(), '', 'pasting incorrect value is not allowed');

            this.keyboard.paste('November 10 2018');
            assert.strictEqual(this.$input.val(), 'November 10 2018', 'pasting correct value is allowed');
        });

        test('exception should not be thrown when the widget disposed on valueChange', (assert) => {
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
    });


    module('Search', setupModule, () => {
        test('Time indication', (assert) => {
            this.instance.option('displayFormat', 'a');

            this.keyboard.type('a');
            assert.strictEqual(this.$input.val(), 'AM', 'select on typing');

            this.keyboard.type('p');
            assert.strictEqual(this.$input.val(), 'PM', 'revert incorrect changes');
        });

        test('Hour', (assert) => {
            this.instance.option('displayFormat', 'hh');

            this.keyboard.type('31');
            assert.strictEqual(this.$input.val(), '01', 'don\'t accept out-of-limit values');

            this.keyboard.type('2');
            assert.strictEqual(this.$input.val(), '12', 'set new value');
        });

        test('Day of week', (assert) => {
            this.instance.option('displayFormat', 'EEEE');

            this.keyboard.type('monda');
            assert.strictEqual(this.$input.val(), 'Monday', 'select on typing');

            this.keyboard.type('s');
            assert.strictEqual(this.$input.val(), 'Saturday', 'revert incorrect changes');
        });

        test('Day of week by a number', (assert) => {
            this.instance.option('displayFormat', 'EEEE');

            this.keyboard.type('0');
            assert.strictEqual(this.$input.val(), 'Sunday', 'week starts from the Sunday');

            this.keyboard.type('6');
            assert.strictEqual(this.$input.val(), 'Saturday', 'week ends at the Saturday');

            this.keyboard.type('7');
            assert.strictEqual(this.$input.val(), 'Saturday', 'out-of-limit values does not supported');
        });

        test('Day', (assert) => {
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

        test('Month', (assert) => {
            this.instance.option('displayFormat', 'MMMM');

            this.keyboard.type('janu');
            assert.strictEqual(this.$input.val(), 'January', 'select on typing');

            this.clock.tick(1);
            this.keyboard.type('d');
            assert.strictEqual(this.$input.val(), 'December', 'revert incorrect chars');
        });

        test('Month by char step over February', (assert) => {
            this.instance.option({
                value: new Date(2015, 0, 29),
                displayFormat: 'MMMM, dd'
            });

            this.keyboard.type('march');
            assert.strictEqual(this.$input.val(), 'March, 29', 'move forward, text is correct');

            this.keyboard.type('january');
            assert.strictEqual(this.$input.val(), 'January, 29', 'move backward, text is correct');
        });

        test('Short month', (assert) => {
            this.instance.option('displayFormat', 'MMM');

            this.keyboard.type('jan');
            assert.strictEqual(this.$input.val(), 'Jan', 'select on typing');

            this.keyboard.type('d');
            assert.strictEqual(this.$input.val(), 'Dec', 'revert incorrect chars');
        });

        test('Month by a number', (assert) => {
            this.instance.option('displayFormat', 'MMMM');

            this.keyboard.type('1');
            assert.strictEqual(this.$input.val(), 'January');

            this.keyboard.type('30');
            assert.strictEqual(this.$input.val(), 'January');

            this.keyboard.type('05');
            assert.strictEqual(this.$input.val(), 'May');
        });

        test('Year', (assert) => {
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

        test('Short Year', (assert) => {
            this.instance.option({
                value: new Date(1990, 4, 2),
                displayFormat: 'yy'
            });

            this.keyboard
                .type('21')
                .press('enter');

            assert.strictEqual(this.instance.option('value').getFullYear(), 1921, 'only 2 last digits of the year should be changed');
        });

        test('Hotkeys should not be handled by the search', (assert) => {
            this.instance.option('displayFormat', 'EEEE');

            this.keyboard.keyDown('s', { altKey: true });
            assert.strictEqual(this.$input.val(), 'Wednesday', 'alt was not handled');

            this.keyboard.keyDown('s', { ctrlKey: true });
            assert.strictEqual(this.$input.val(), 'Wednesday', 'ctrl was not handled');
        });

        test('Typing a letter in the year section should not lead to an infinite loop', (assert) => {
            this.instance.option('displayFormat', 'yyyy');

            sinon.stub(this.instance, '_partIncrease').throws();

            try {
                this.keyboard.type('s');
                assert.strictEqual(this.$input.val(), '2012', 'year was not changed');
            } catch(e) {
                assert.notOk(true, 'Infinite loop detected');
            }
        });
    });

    module('Empty dateBox', {
        beforeEach: () => {
            setupModule.beforeEach.call(this);
            this.instance.option('value', null);
        },
        afterEach: setupModule.afterEach
    }, () => {
        test('Current date should be rendered on first input', (assert) => {
            this.keyboard.type('1');
            assert.strictEqual(this.$input.val(), 'January 14 2015', 'first part was changed, other parts is from the current date');
        });

        QUnit.testInActiveWindow('Bluring the input after first input should update the value', (assert) => {
            this.keyboard.type('1');
            this.instance.blur();

            assert.strictEqual(this.$input.val(), 'January 14 2015', 'text is correct');
            assert.strictEqual(this.instance.option('value').getMonth(), 0, 'value is correct');
        });

        test('Clear button should work', (assert) => {
            this.instance.option({
                showClearButton: true,
                value: new Date(2018, 6, 19)
            });

            assert.strictEqual(this.$input.val(), 'July 19 2018', 'initial value is correct');

            this.$element.find('.dx-clear-button-area').trigger('dxclick');

            assert.strictEqual(this.$input.val(), '', 'text was cleared');
            assert.strictEqual(this.instance.option('value'), null, 'value was cleared');

            this.$input.trigger('change');

            assert.strictEqual(this.$input.val(), '', 'text is still cleared');
            assert.strictEqual(this.instance.option('value'), null, 'value is still cleared');

            this.keyboard.type('1');
            assert.strictEqual(this.$input.val(), 'January 14 2015', 'text is correct after clearing');
        });

        test('Incorrect search on empty input should render current date', (assert) => {
            this.keyboard.type('qq');

            assert.strictEqual(this.$input.val(), 'April 14 2015', 'text is correct');
            assert.strictEqual(this.instance.option('value'), null, 'value is correct');
        });

        test('focus and blur empty input should not change it\'s value', (assert) => {
            this.$input.trigger('focusin');
            this.$input.trigger('focusout');

            assert.strictEqual(this.$input.val(), '', 'text is correct');
            assert.strictEqual(this.instance.option('value'), null, 'value is correct');
        });

        test('focusing datebox by click should work', (assert) => {
            this.$input.trigger('dxclick');
            this.keyboard.type('2');

            assert.strictEqual(this.$input.val(), 'February 14 2015', 'text is correct');
            assert.strictEqual(this.instance.option('value'), null, 'value is correct');
        });

        test('focusing datebox by mousewheel should work', (assert) => {
            this.pointer.wheel(10);
            this.keyboard.type('2');

            assert.strictEqual(this.$input.val(), 'February 14 2015', 'text is correct');
            assert.strictEqual(this.instance.option('value'), null, 'value is correct');
        });

        test('moving between groups should work with empty dateBox', (assert) => {
            ['up', 'down', 'right', 'left', 'home', 'end', 'esc'].forEach((arrow) => {
                this.instance.option('value', null);
                this.keyboard.press(arrow);
                assert.ok(true, arrow + ' key is good');
            });

            assert.strictEqual(this.$input.val(), '', 'text is correct');
            assert.strictEqual(this.instance.option('value'), null, 'value is correct');
        });

        test('Short Year should use current date', (assert) => {
            this.instance.option('displayFormat', 'yy');

            const dateStart = new Date().getFullYear().toString().substr(0, 2);

            this.keyboard
                .type('21')
                .press('enter');

            assert.strictEqual(this.instance.option('value').getFullYear(), parseInt(dateStart + '21'), 'only 2 last digits of the year should be changed');
        });

        test('Click and leave empty datebox should not change the value', (assert) => {
            this.instance.option('displayFormat', 'yy');

            this.$input.trigger('dxclick');
            this.keyboard.press('enter');
            this.$input.trigger('focusout');

            assert.strictEqual(this.$input.val(), '', 'value is correct');
        });

        test('navigation keys should do nothing in an empty datebox', (assert) => {
            this.keyboard.press('home');
            this.keyboard.press('end');
            this.keyboard.press('del');
            this.keyboard.press('backspace');
            this.keyboard.press('esc');
            this.keyboard.press('left');
            this.keyboard.press('right');
            this.keyboard.press('enter');

            assert.deepEqual(this.instance.option('value'), null, 'value is good');
            assert.deepEqual(this.$input.val(), '', 'text is good');
            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 0 }, 'caret is good');
        });
    });

    module('Options changed', setupModule, () => {
        test('The \'useMaskBehavior\' option is changed to false', (assert) => {
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

        test('onValueChanged should have event', (assert) => {
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

        test('It should be possible to set a value via calendar', (assert) => {
            this.instance.option({
                opened: true
            });

            this.keyboard.press('right').press('enter');
            assert.strictEqual(this.$input.val(), 'October 11 2012', 'text is correct');
            assert.strictEqual(this.instance.option('value').getDate(), 11, 'value is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 0, end: 7 }, 'caret is good');
        });

        test('Internal _maskValue and public value should be different objects', (assert) => {
            assert.ok(this.instance._maskValue !== this.instance.option('value'), 'objects are different on init');

            this.instance.option('value', new Date(2012, 1, 2));
            assert.ok(this.instance._maskValue !== this.instance.option('value'), 'objects are different when setting by value');

            this.keyboard.press('up').press('esc');
            assert.ok(this.instance._maskValue !== this.instance.option('value'), 'objects are different after revert changes');

            this.keyboard.press('5').press('enter');
            assert.ok(this.instance._maskValue !== this.instance.option('value'), 'objects are different after enter');

            this.keyboard.press('4');
            this.$input.trigger('focusout');
            assert.ok(this.instance._maskValue !== this.instance.option('value'), 'objects are different after focusout');

            this.keyboard.press('7').change();
            assert.ok(this.instance._maskValue !== this.instance.option('value'), 'objects are different after change event');
        });

        test('performance - value change should not lead to recreate regexp and format pattern', (assert) => {
            const regExpInfo = sinon.spy(dateParser, 'getRegExpInfo');

            this.instance.option('displayFormat', 'dd.MM');
            assert.strictEqual(regExpInfo.callCount, 1, 'regexpInfo should be called when format changed');

            this.instance.option('value', new Date(2018, 2, 5, 10, 15, 25));
            assert.strictEqual(regExpInfo.callCount, 1, 'regexpInfo should not be called when value changed');
        });
    });

    module('Regression', () => {
        QUnit.test('should paste text if value was not initialized (T715236)', (assert) => {
            const $input = $('#dateBox')
                .dxDateBox({ useMaskBehavior: true })
                .dxDateBox('instance')
                ._input();

            keyboardMock($input).paste('2/15/2019');
            assert.strictEqual($input.get(0).value, '2/15/2019');
        });

        QUnit.test('selected date should be in 1970 when it was set from user\'s input (T758357)', (assert) => {
            const $dateBox = $('#dateBox').dxDateBox({
                value: null,
                displayFormat: 'HH:mm',
                type: 'time',
                useMaskBehavior: true
            });

            keyboardMock($dateBox.find('.dx-texteditor-input'))
                .focus()
                .type('11:11')
                .change();

            assert.strictEqual($dateBox.dxDateBox('option', 'value').getFullYear(), new Date(null).getFullYear(), 'year is correct');
        });
    });

    module('Advanced caret', setupModule, () => {
        test('Move caret to the next group', (assert) => {
            this.instance.option({
                advanceCaret: true,
                displayFormat: 'dd.MM'
            });

            this.keyboard.type('15');

            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved');
        });

        test('Move caret to the next group when next digit will overflow', (assert) => {
            this.instance.option({
                advanceCaret: true,
                displayFormat: 'MM.dd'
            });

            this.keyboard.type('5');

            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved');
        });

        test('Move caret to the next group after limit overflow', (assert) => {
            this.instance.option({
                advanceCaret: true,
                displayFormat: 'dd.MM'
            });

            this.keyboard.type('38');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved to month');
        });

        test('Move caret to the next group after format length overflow', (assert) => {
            this.instance.option({
                advanceCaret: true,
                displayFormat: 'yy MM'
            });

            this.keyboard.type('15');
            assert.strictEqual(this.instance.option('text'), '15 10', 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved to month');
        });

        test('Don\'t move caret to next group when format length is less than limit length', (assert) => {
            this.instance.option({
                advanceCaret: true,
                displayFormat: 'y MM'
            });

            this.keyboard.type('2011');
            assert.strictEqual(this.instance.option('text'), '2011 10', 'text is correct');
            assert.deepEqual(this.keyboard.caret(), { start: 5, end: 7 }, 'caret was moved to month');
        });

        test('Typed year and value should be in the same century when short year format is used', (assert) => {
            this.instance.option({
                advanceCaret: true,
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

        test('Move caret to the next group after string length overflow', (assert) => {
            this.instance.option({
                advanceCaret: true,
                displayFormat: 'dd.MM'
            });

            this.keyboard.type('01');
            assert.deepEqual(this.keyboard.caret(), { start: 3, end: 5 }, 'caret was moved to month');
        });
    });
}
