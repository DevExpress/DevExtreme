import $ from 'jquery';
import FormTestWrapper from '../../helpers/formTestWrapper.js';
import browser from 'core/utils/browser';
import 'ui/form/ui.form';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="form"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Label aligment', () => {
    function testOrSkip(name, callback) {
        if(!browser.chrome) {
            return;
        }

        QUnit.test(name, callback);
    }

    testOrSkip('1 column -> [item1]', function() {
        const wrapper = new FormTestWrapper(1, ['veryVeryVeryLongText']);
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryVeryVeryLongText"]'), { top: 8, left: 0, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryVeryVeryLongText"]'), { top: 1, left: 168, width: 831, height: 34 });
    });

    function test_1Column_2ItemsLayout(items) {
        const wrapper = new FormTestWrapper(1, items);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="shortText"]'), { top: 8, left: 0, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="shortText"]'), { top: 1, left: 168, width: 831, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryVeryVeryLongText"]'), { top: 54, left: 0, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryVeryVeryLongText"]'), { top: 47, left: 168, width: 831, height: 34 });
    }

    testOrSkip('1 column -> [shortText, item2]', function() {
        test_1Column_2ItemsLayout(['shortText', 'veryVeryVeryLongText']);
    });

    testOrSkip('1 column -> [group[{shortText}], group[{veryVeryVeryLongText}]]', function() {
        test_1Column_2ItemsLayout([ { itemType: 'group', items: ['shortText'] }, { itemType: 'group', items: ['veryVeryVeryLongText'] }]);
    });

    function test_2Column_2ItemsLayout(items) {
        const wrapper = new FormTestWrapper(2, items);
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="shortText"]'), { top: 8, left: 0, width: 75, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="shortText"]'), { top: 1, left: 76, width: 408, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryVeryVeryLongText"]'), { top: 8, left: 515, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryVeryVeryLongText"]'), { top: 1, left: 683, width: 316, height: 34 });
    }

    testOrSkip('2 column -> [shortText, veryVeryVeryLongText]', function() {
        test_2Column_2ItemsLayout(['shortText', 'veryVeryVeryLongText']);
    });

    testOrSkip('2 column -> [group[{shortText}], group[{veryVeryVeryLongText}]]', function() {
        test_2Column_2ItemsLayout([ { itemType: 'group', items: ['shortText'] }, { itemType: 'group', items: ['veryVeryVeryLongText'] }]);
    });

    testOrSkip('2 column -> [group[{shortText.colSpan: 2}], group[{veryVeryVeryLongText.colSpan: 2}]]', function() {
        test_1Column_2ItemsLayout([ { itemType: 'group', colSpan: 2, items: ['shortText'] }, { itemType: 'group', colSpan: 2, items: ['veryVeryVeryLongText'] }]);
    });

    testOrSkip('1 column -> [text, longText, veryLongText, veryVeryVeryLongText]', function() {
        const wrapper = new FormTestWrapper(1, ['text', 'longText', 'veryLongText', 'veryVeryVeryLongText']);
        wrapper.checkFormSize({ width: 1000, height: 174 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 168, width: 831, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 168, width: 831, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryLongText"]'), { top: 100, left: 0, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryLongText"]'), { top: 93, left: 168, width: 831, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryVeryVeryLongText"]'), { top: 146, left: 0, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryVeryVeryLongText"]'), { top: 139, left: 168, width: 831, height: 34 });
    });

    function test_2Column_4ItemsLayout(items) {
        const wrapper = new FormTestWrapper(2, items);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 104, width: 380, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 515, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 683, width: 316, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryLongText"]'), { top: 54, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryLongText"]'), { top: 47, left: 104, width: 380, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryVeryVeryLongText"]'), { top: 54, left: 515, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryVeryVeryLongText"]'), { top: 47, left: 683, width: 316, height: 34 });
    }

    testOrSkip('2 column -> [text, longText, veryLongText, veryVeryVeryLongText]', function() {
        test_2Column_4ItemsLayout(['text', 'longText', 'veryLongText', 'veryVeryVeryLongText']);
    });

    testOrSkip('2 column -> { group [text, veryLongText]}, {group[longText, veryVeryVeryLongText] }', function() {
        test_2Column_4ItemsLayout([
            { itemType: 'group', items: ['text', 'veryLongText'] },
            { itemType: 'group', items: ['longText', 'veryVeryVeryLongText'] }]);
    });

    testOrSkip('2 column -> { group [text]}, { group [longText]}, { group [veryLongText]}, { group [veryVeryVeryLongText]} ', function() {
        test_2Column_4ItemsLayout([
            { itemType: 'group', items: ['text'] },
            { itemType: 'group', items: ['longText'] },
            { itemType: 'group', items: ['veryLongText'] },
            { itemType: 'group', items: ['veryVeryVeryLongText'] }]);
    });

    testOrSkip('3 column -> [ text.colSpan: 2, longText.colSpan:1, veryLongText.colSpan:2, veryVeryVeryLongText.colSpan:1 ] ', function(assert) {
        const wrapper = new FormTestWrapper(3, [
            { colSpan: 2, dataField: 'text' },
            { colSpan: 1, dataField: 'longText' },
            { colSpan: 2, dataField: 'veryLongText' },
            { colSpan: 1, dataField: 'veryVeryVeryLongText' } ]);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 104, width: 546.6, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 681.6, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 850, width: 149, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryLongText"]'), { top: 54, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryLongText"]'), { top: 47, left: 104, width: 546.6, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryVeryVeryLongText"]'), { top: 54, left: 681.6, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryVeryVeryLongText"]'), { top: 47, left: 850, width: 149, height: 34 });
    });

    testOrSkip('1 column -> { group.colCount3 [ text.colSpan: 2, longText.colSpan:1, veryLongText.colSpan:2, veryVeryVeryLongText.colSpan:1 ]} ', function() {
        const wrapper = new FormTestWrapper(1, [
            { itemType: 'group', colCount: 3, items: [
                { colSpan: 2, dataField: 'text' }, { colSpan: 1, dataField: 'longText' },
                { colSpan: 2, dataField: 'veryLongText' }, { colSpan: 1, dataField: 'veryVeryVeryLongText' } ] } ]);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 104, width: 546.6, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 681.6, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 850, width: 149, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryLongText"]'), { top: 54, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryLongText"]'), { top: 47, left: 104, width: 546.6, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryVeryVeryLongText"]'), { top: 54, left: 681.6, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryVeryVeryLongText"]'), { top: 47, left: 850, width: 149, height: 34 });
    });

    testOrSkip('1 column -> { group.colCount3 [ text.colSpan: 2, longText.colSpan:1, veryLongText.colSpan:2, veryVeryVeryLongText.colSpan:1, smallText.colSpan:3 ]} ', function() {
        const wrapper = new FormTestWrapper(1, [
            { itemType: 'group', colCount: 3, items: [
                { colSpan: 2, dataField: 'text' }, { colSpan: 1, dataField: 'longText' },
                { colSpan: 2, dataField: 'veryLongText' }, { colSpan: 1, dataField: 'veryVeryVeryLongText' },
                { colSpan: 3, dataField: 'smallText' }] } ]);
        wrapper.checkFormSize({ width: 1000, height: 128 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 104, width: 546.6, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 681.6, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 850, width: 149, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryLongText"]'), { top: 54, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryLongText"]'), { top: 47, left: 104, width: 546.6, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="veryVeryVeryLongText"]'), { top: 54, left: 681.6, width: 167, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="veryVeryVeryLongText"]'), { top: 47, left: 850, width: 149, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="smallText"]'), { top: 100, left: 0, width: 103, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="smallText"]'), { top: 93, left: 104, width: 895, height: 34 });
    });
});
