import $ from 'jquery';
import { getPublicElementJQuery } from 'integration/jquery/element';

const jQueryDiv = $('div');
const HTMLDiv = document.createElement('div');

const testCaseArrayJQuery = [
    [null, null, 'Null'],
    ['body', 'body', 'String'],
    [ HTMLDiv, HTMLDiv, 'HTML Element'],
    [jQueryDiv, jQueryDiv, 'jQuery Element'],
];

QUnit.module('getPublicElement', () => {
    testCaseArrayJQuery.forEach(([args, expected, inputType]) => {
        QUnit.test(
            `Should return ${inputType} if the input argument is ${inputType} using jQuery strategy`,
            function(assert) {
                const result = getPublicElementJQuery(args);
                assert.strictEqual(expected, result);
            }
        );
    });
});
