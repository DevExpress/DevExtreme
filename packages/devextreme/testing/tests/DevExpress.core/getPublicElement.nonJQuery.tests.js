import $ from 'jquery';
import { getPublicElementNonJquery } from 'core/element';

const HTMLDiv = document.createElement('div');
const jQueryDiv = $('div')[0];

const testCaseArray = [
    [null, null, 'Null'],
    ['div', 'div', 'String'],
    [HTMLDiv, HTMLDiv, 'HTMLElement'],
    [jQueryDiv, jQueryDiv, 'jQuery'],
];

QUnit.module('getPublicElementNonJquery', () => {
    testCaseArray.forEach(([args, expected, inputType]) => {
        QUnit.test(
            `Should return ${inputType} if the input argument is ${inputType} using non-jQuery strategy`,
            function(assert) {
                const result = getPublicElementNonJquery(args);
                assert.strictEqual(expected, result);
            }
        );
    });
});
