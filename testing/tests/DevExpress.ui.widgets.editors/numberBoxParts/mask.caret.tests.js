const maskCaret = require('ui/number_box/number_box.caret');

QUnit.module('format caret', () => {
    QUnit.test('getCaretWithOffset', function(assert) {
        assert.deepEqual(maskCaret.getCaretWithOffset({ start: 1, end: 2 }, 5), { start: 6, end: 7 });
        assert.deepEqual(maskCaret.getCaretWithOffset({ start: 4, end: 6 }, -2), { start: 2, end: 4 });
        assert.deepEqual(maskCaret.getCaretWithOffset({ start: 4, end: 6 }, -2), { start: 2, end: 4 });
        assert.deepEqual(maskCaret.getCaretWithOffset(5, 1), { start: 6, end: 6 });
    });

    QUnit.test('getCaretBoundaries', function(assert) {
        assert.deepEqual(maskCaret.getCaretBoundaries('  #  1,230.45  #  ', ' \' # \' #,##0.## \' # \' '), { start: 5, end: 13 });
        assert.deepEqual(maskCaret.getCaretBoundaries('$ 123 tst', '$ #0 tst'), { start: 2, end: 5 });
        assert.deepEqual(maskCaret.getCaretBoundaries('-$ 123 tst', '$ #0 tst'), { start: 3, end: 6 });
        assert.deepEqual(maskCaret.getCaretBoundaries('(($ 123 tst))', '$ #0 tst;(($ #0 tst))'), { start: 4, end: 7 });
        assert.deepEqual(maskCaret.getCaretBoundaries('$ ', '$ #.##'), { start: 2, end: 2 });
        assert.deepEqual(maskCaret.getCaretBoundaries(' kg', '#.## kg'), { start: 0, end: 0 });
        assert.deepEqual(maskCaret.getCaretBoundaries('$ 0.15 ts', '$ #,##0.## ts;($ #,##0.##) ts'), { start: 2, end: 6 });
        assert.deepEqual(maskCaret.getCaretBoundaries('$ 1 ts', '$ #,##0.## ts;($ #,##0.##) ts'), { start: 2, end: 3 });
        assert.deepEqual(maskCaret.getCaretBoundaries('($ 12,345) ts', '$ #,##0.## ts;($ #,##0.##) ts'), {
            start: 3,
            end: 9
        });
    });

    QUnit.test('getCaretInBoundaries', function(assert) {
        assert.deepEqual(maskCaret.getCaretInBoundaries({ start: 1, end: 5 }, '$ 123', '$ #'), { start: 2, end: 5 });
        assert.deepEqual(maskCaret.getCaretInBoundaries({ start: 1, end: 10 }, '-$ 123 kg', '$ #.## kg'), {
            start: 3,
            end: 6
        });
    });

    QUnit.test('isCaretInBoundaries', function(assert) {
        assert.equal(maskCaret.isCaretInBoundaries(3, '$ 123 st', '$ #0 st'), true);
        assert.equal(maskCaret.isCaretInBoundaries(2, '$ 123 st', '$ #0 st'), true);
        assert.equal(maskCaret.isCaretInBoundaries(1, '$ 123 st', '$ #0 st'), false);
        assert.equal(maskCaret.isCaretInBoundaries(5, '$ 123 st', '$ #0 st'), true);
        assert.equal(maskCaret.isCaretInBoundaries(7, '$ 123 st', '$ #0 st'), false);
    });

    QUnit.test('getCaretAfterFormat with integer part', function(assert) {
        assert.deepEqual(maskCaret.getCaretAfterFormat('1234.15', '1,234.15', 2, '#,##0.##'), { start: 3, end: 3 }, 'enter 3 after 2');
        assert.deepEqual(maskCaret.getCaretAfterFormat('(1234.15)', '(1,234.15)', 4, '#,##0.##;(#,##0.##)'), { start: 5, end: 5 }, 'enter 3 after 2 in negative');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1,234.15', '<<1,234.15>>', 3, '#,##0.##;<<#,##0.##>>'), { start: 5, end: 5 }, 'revert sign should save caret position');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1', '$ 1', 1, '$ #'), { start: 3, end: 3 }, 'enter 1 in a blank field');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1,234', '134', 3, '#,##0.##'), { start: 1, end: 1 }, 'remove 2 with delete');
        assert.deepEqual(maskCaret.getCaretAfterFormat(',234', '234', 0, '#,##0.##'), { start: 0, end: 0 }, 'remove 1 with backspace');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1,234', '4', { start: 0, end: 4 }, '#,##0.##'), { start: 0, end: 0 }, 'select and remove some digits');
        assert.deepEqual(maskCaret.getCaretAfterFormat('12534', '1534', 3, '0000'), { start: 2, end: 2 }, 'enter 5 in the middle of decimal format');
        assert.deepEqual(maskCaret.getCaretAfterFormat('12345', '2345', 5, '0000'), { start: 4, end: 4 }, 'enter 5 in the end of decimal format');
    });

    QUnit.test('getCaretAfterFormat with float part', function(assert) {
        assert.deepEqual(maskCaret.getCaretAfterFormat('1234.00', '1,234', 6, '#,##0.##'), { start: 5, end: 5 }, 'cut zeros in the end');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1.423', '1.42', 3, '#0.00'), { start: 3, end: 3 }, 'enter 4 in the start');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1.243', '1.24', 4, '#0.00'), { start: 4, end: 4 }, 'enter 4 in the middle');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1.234', '1.23', 5, '#0.00'), { start: 4, end: 4 }, 'enter 4 in the end');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1.23', '1.230', 4, '#0.000'), { start: 4, end: 4 }, 'remove 4 with backspace');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1.24', '1.240', 3, '#0.000'), { start: 3, end: 3 }, 'remove 3 with backspace');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1.34', '1.30', 2, '#0.000'), { start: 2, end: 2 }, 'remove 2 with backspace');
        assert.deepEqual(maskCaret.getCaretAfterFormat('1.0000 kg', '1 kg', 6, '#0.### kg'), { start: 1, end: 1 }, 'remove 2 with backspace');
    });
});

