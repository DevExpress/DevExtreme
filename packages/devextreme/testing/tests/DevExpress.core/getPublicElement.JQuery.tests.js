import $ from 'jquery';
import { getPublicElementJQuery } from 'integration/jquery/element';

const jQueryBody = $('body');

const testcaseArrayJQuery = [
    [null, null, 'Null', 'Null'],
    ['body', 'body', 'String', 'String'],
    [
        document.querySelector('body'),
        document.querySelector('body'),
        'HTML Element',
        'HTML Element',
    ],
    [jQueryBody, jQueryBody, 'jQuery Element', 'jQuery Element'],
];

QUnit.module('getPublicElement', () => {
    testcaseArrayJQuery.forEach(([args, expected, inputType, resultType]) => {
        QUnit.test(
            `Should return ${resultType} if the input argument is ${inputType} using jQuery strategy`,
            function(assert) {
                const result = getPublicElementJQuery(args);
                assert.strictEqual(expected, result);
            }
        );
    });
});
