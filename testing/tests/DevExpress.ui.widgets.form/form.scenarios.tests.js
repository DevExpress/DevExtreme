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

    testOrSkip('1 column -> [longText]', function() {
        const wrapper = new FormTestWrapper(1, {}, ['longText']);
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 75, width: 923, height: 34 });
    });

    function test_1Column_2Items_AllAligned(items) {
        const wrapper = new FormTestWrapper(1, {}, items);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 75, width: 923, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 923, height: 34 });
    }

    function test_1Column_2Items_NotAligned(items) {
        const wrapper = new FormTestWrapper(1, { alignItemLabelsInAllGroups: false }, items);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 958, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 923, height: 34 });
    }

    testOrSkip('1 column-> [text, longText], alignItemLabels: true', function() {
        test_1Column_2Items_AllAligned(['text', 'longText']);
    });

    testOrSkip('1 column-> [text, longText], alignItemLabels: false', function() {
        const wrapper = new FormTestWrapper(1, { alignItemLabels: false }, ['text', 'longText']);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 42, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 43, width: 957, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 923, height: 34 });
    });

    testOrSkip('1 column -> [group[text, longText]]', function() {
        test_1Column_2Items_AllAligned([ { itemType: 'group', items: ['text', 'longText'] }]);
    });

    testOrSkip('1 column -> [group[text, group[longText]]]', function() {
        test_1Column_2Items_AllAligned([ { itemType: 'group', items: ['text', { itemType: 'group', items: ['longText'] }] }]);
    });

    testOrSkip('1 column -> [group[text], group[longText]], alignItemLabelsInAllGroups: true', function() {
        test_1Column_2Items_AllAligned([ { itemType: 'group', items: ['text'] }, { itemType: 'group', items: ['longText'] }]);
    });

    testOrSkip('1 column -> [group[text], group[longText]], alignItemLabelsInAllGroups: false', function() {
        test_1Column_2Items_NotAligned([ { itemType: 'group', items: ['text'] }, { itemType: 'group', items: ['longText'] }]);
    });

    testOrSkip('1 column -> [group[group[text], group[longText]]], alignItemLabelsInAllGroups: true', function() {
        test_1Column_2Items_AllAligned([ { itemType: 'group', items: [{ itemType: 'group', items: ['text'] }, { itemType: 'group', items: ['longText'] }] }]);
    });

    testOrSkip('1 column -> [group[group[text], group[longText]]], alignItemLabelsInAllGroups: false', function() {
        test_1Column_2Items_NotAligned([ { itemType: 'group', items: [{ itemType: 'group', items: ['text'] }, { itemType: 'group', items: ['longText'] }] }]);
    });

    testOrSkip('1 column -> [group[text.colSpan2], group[longText.colSpan2]]', function() {
        const wrapper = new FormTestWrapper(2, {},
            [ { itemType: 'group', colSpan: 2, items: ['text'] }, { itemType: 'group', colSpan: 2, items: ['longText'] }]);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 75, width: 923, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 923, height: 34 });
    });

    function test_2Column_2Items(options, items) {
        const wrapper = new FormTestWrapper(2, options, items);
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 444, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 515, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 588, width: 411, height: 34 });
    }

    testOrSkip('2 column -> [text, longText]', function() {
        test_2Column_2Items({}, ['text', 'longText']);
    });

    testOrSkip('2 column -> [group[text, longText]]', function() {
        test_2Column_2Items({}, [ { itemType: 'group', colSpan: 2, colCount: 2, items: ['text', 'longText'] }]);
    });

    function test_2Column_2Items_AllAligned(items) {
        const wrapper = new FormTestWrapper(2, {}, items);
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 76, width: 411, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 515, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 588, width: 411, height: 34 });
    }

    testOrSkip('2 column -> [group[text, group[longText]]]', function(assert) {
        // unexpected bechaviour - https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxForm/Configuration/#alignItemLabelsInAllGroups
        test_2Column_2Items_AllAligned(
            [ { itemType: 'group', colCount: 2, colSpan: 2, items: ['text', { itemType: 'group', items: ['longText'] }] }]);
    });

    testOrSkip('2 column -> [group[text], group[longText]]', function() {
        test_2Column_2Items({},
            [ { itemType: 'group', items: ['text'] }, { itemType: 'group', items: ['longText'] }]);
    });

    testOrSkip('2 column -> [group[group[text], group[longText]]], alignItemLabelsInAllGroups: true', function() {
        test_2Column_2Items_AllAligned(
            [ { itemType: 'group', colCount: 2, colSpan: 2, items: [
                { itemType: 'group', items: ['text'] }, { itemType: 'group', items: ['longText'] }] }]);
    });

    testOrSkip('2 column -> [group[group[text], group[longText]]], alignItemLabelsInAllGroups: false', function() {
        test_2Column_2Items({ alignItemLabelsInAllGroups: false },
            [{ itemType: 'group', colCount: 2, colSpan: 2,
                items: [{ itemType: 'group', items: ['text'] }, { itemType: 'group', items: ['longText'] }] }]);
    });

    testOrSkip('2 column -> [group[{text.colSpan: 2}], group[{longText.colSpan: 2}]]', function() {
        test_1Column_2Items_AllAligned([ { itemType: 'group', colSpan: 2, items: ['text'] }, { itemType: 'group', colSpan: 2, items: ['longText'] }]);
    });

    function test_2Column_4ItemsLayout(options, items) {
        const wrapper = new FormTestWrapper(2, options, items);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 41, width: 447, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 8, left: 515, width: 72, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 1, left: 586, width: 411, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 41, width: 447, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 515, width: 72, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 586, width: 411, height: 34 });
    }

    testOrSkip('2 column -> [a, abc, text, longText]', function() {
        test_2Column_4ItemsLayout({ alignItemLabels: true },
            ['a', 'abc', 'text', 'longText']);
    });

    testOrSkip('2 column -> { group [a, text]}, {group[abc, longText] }', function() {
        test_2Column_4ItemsLayout({ alignItemLabels: true }, [
            { itemType: 'group', items: ['a', 'text'] },
            { itemType: 'group', items: ['abc', 'longText'] }]);
    });

    testOrSkip('2 column -> { group [a]}, { group [abc]}, { group [text]}, { group [longText]} ', function() {
        test_2Column_4ItemsLayout({ alignItemLabels: true }, [
            { itemType: 'group', items: ['a'] },
            { itemType: 'group', items: ['abc'] },
            { itemType: 'group', items: ['text'] },
            { itemType: 'group', items: ['longText'] }]);
    });

    testOrSkip('3 column -> [ a.colSpan: 2, abc.colSpan:1, text.colSpan:2, longText.colSpan:1 ] ', function(assert) {
        const wrapper = new FormTestWrapper(3, { alignItemLabels: true }, [
            { colSpan: 2, dataField: 'a' },
            { colSpan: 1, dataField: 'abc' },
            { colSpan: 2, dataField: 'text' },
            { colSpan: 1, dataField: 'longText' } ]);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 42, width: 609, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 8, left: 680, width: 72, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 1, left: 752, width: 242, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 42, width: 609, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 680, width: 72, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 752, width: 242, height: 34 });
    });

    testOrSkip('1 column -> { group.colCount3 [ a.colSpan: 2, abc.colSpan:1, text.colSpan:2, longText.colSpan:1 ]} ', function() {
        const wrapper = new FormTestWrapper(1, { alignItemLabels: true }, [
            { itemType: 'group', colCount: 3, items: [
                { colSpan: 2, dataField: 'a' }, { colSpan: 1, dataField: 'abc' },
                { colSpan: 2, dataField: 'text' }, { colSpan: 1, dataField: 'longText' } ] } ]);
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 42, width: 609, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 8, left: 680, width: 72, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 1, left: 752, width: 242, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 42, width: 609, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 680, width: 72, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 752, width: 242, height: 34 });
    });

    testOrSkip('1 column -> { group.colCount3 [ a.colSpan: 2, abc.colSpan:1, text.colSpan:2, longText.colSpan:1, ab.colSpan:3 ]} ', function() {
        const wrapper = new FormTestWrapper(1, { alignItemLabels: true }, [
            { itemType: 'group', colCount: 3, colSpan: 3, items: [
                { colSpan: 2, dataField: 'a' }, { colSpan: 1, dataField: 'abc' },
                { colSpan: 2, dataField: 'text' }, { colSpan: 1, dataField: 'longText' },
                { colSpan: 3, dataField: 'ab' }] } ]);
        wrapper.checkFormSize({ width: 1000, height: 128 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 42, width: 609, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 8, left: 680, width: 72, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 1, left: 752, width: 242, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 42, width: 609, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 680, width: 72, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 752, width: 242, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="ab"]'), { top: 100, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="ab"]'), { top: 93, left: 42, width: 958, height: 34 });
    });
});
