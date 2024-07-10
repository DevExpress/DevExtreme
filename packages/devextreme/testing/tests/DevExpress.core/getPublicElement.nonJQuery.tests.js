import $ from 'jquery';
import { getPublicElement } from 'core/element';

const testCaseArray = [
    [null, null, 'Null', 'Null'],
    ['body', document.querySelector('body'), 'String', 'HTML Element'],
    [
        document.querySelector('body'),
        document.querySelector('body'),
        'HTML Element',
        'HTML Element',
    ],
    [$('body'), document.querySelector('body'), 'jQuery', 'HTML Element'],
];

QUnit.module('getPublicElement', () => {
    testCaseArray.forEach(([args, expected, inputType, resultType]) => {
        QUnit.test(
            `Should return ${resultType} if the input argument is ${inputType} using non-jQuery strategy`,
            function(assert) {
                const result = expected instanceof HTMLElement ? getPublicElement(args) : expected;
                assert.strictEqual(expected, result);
            }
        );
    });
});
