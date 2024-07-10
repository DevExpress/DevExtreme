import $ from 'jquery';
import { getPublicElement } from 'core/element';

const testCaseArray = [
    [null, null, 'Null', 'Null'],
    ['body', document.querySelector('body'), 'String', 'HTMLElement'],
    [
        document.querySelector('body'),
        document.querySelector('body'),
        'HTMLElement',
        'HTMLElement',
    ],
    [$('body'), document.querySelector('body'), 'jQuery', 'HTMLElement'],
];

QUnit.module('getPublicElement', () => {
    testCaseArray.forEach(([args, expected, inputType, resultType]) => {
        QUnit.test(
            `Should return ${resultType} if the input argument is ${inputType} using non-jQuery strategy`,
            function(assert) {
                const result = expected instanceof HTMLElement && QUnit.urlParams['nojquery'] ? getPublicElement(args) : expected;
                assert.strictEqual(expected, result, `Expected: ${expected}, Result: ${result}`);
            }
        );
    });
});
