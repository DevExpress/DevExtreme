import $ from 'jquery';
import FormLayoutTestWrapper from '../../helpers/FormLayoutTestWrapper.js';
import browser from 'core/utils/browser';
import 'ui/form/ui.form';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Form scenarios', () => {
    function testChromeOnly(name, callback) {
        if(!browser.chrome) {
            return;
        }

        QUnit.test(name, callback);
    }

    function test_1Column_1Item(wrapper) {
        wrapper.checkFormSize(1000, 36);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 0, 40, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 41, 958, 34);
    }

    function test_1Column_2Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize(1000, 82);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 0, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 75, 923, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 923, 34);
    }

    function test_1Column_2Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize(1000, 82);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 0, 40, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 41, 958, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 923, 34);
    }

    function test_2Columns_2Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize(1000, 36);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 0, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 75, 411, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 8, 515, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 1, 588, 411, 34);
    }

    function test_2Columns_2Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize(1000, 36);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 0, 40, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 41, 444, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 8, 515, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 1, 588, 411, 34);
    }

    function test_2Columns_4Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize(1000, 82);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 443, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 588, 409, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 443, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 518, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 588, 409, 34);
    }

    function test_2Columns_4Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize(1000, 82);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 457, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 40, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 554, 442, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 443, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 518, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 588, 409, 34);
    }

    function test_3Columns_4Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize(1000, 82);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 229, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 754, 244, 34);
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
    }

    [true, false].forEach(alignItemLabels => {
        [true, false].forEach(alignItemLabelsInAllGroups => {
            testChromeOnly('3 column -> group.colCount:3 [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                    { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                    { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] }]);
                wrapper.checkFormSize(1000, 82);
                wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 72, 19);
                wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 278, 34);
                wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
            });

            QUnit.module(`Items layout and labels alignment. alignItemLabels: ${alignItemLabels}, alignItemLabelsInAllGroups: ${alignItemLabelsInAllGroups}`, () => {
                testChromeOnly('1 column -> [text]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, ['text']);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('1 column-> [text, longText]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, ['text', 'longText']);
                    if(alignItemLabels) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testChromeOnly('1 column-> [text, group[longText]]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        'text',
                        { itemType: 'group', items: ['longText'] }]);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('1 column-> [group[text], longText]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { itemType: 'group', items: ['text'] },
                        'longText']);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('1 column-> [group[text], group[longText]]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { itemType: 'group', items: ['text'] },
                        { itemType: 'group', items: ['longText'] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                [true, false].forEach(alignInGroup => {
                    testChromeOnly(`1 column-> [group.alignItemLabels: ${alignInGroup}[text, longText]]`, function() {
                        const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [
                            { itemType: 'group', alignItemLabels: alignInGroup, items: ['text', 'longText'] }]);
                        if(alignInGroup) {
                            test_1Column_2Items_AlignedLabels(wrapper);
                        } else {
                            test_1Column_2Items_NotAlignedLabels(wrapper);
                        }
                    });
                });

                testChromeOnly('2 column-> form.colCount:2 [text.colSpan: 1, longText.colSpan: 1]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> form.colCount:2 [text.colSpan: 1, longText.colSpan: 2]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> form.colCount:2 [text.colSpan: 1, group.colSpan: 2[longText]]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'text', colSpan: 1 }, { itemType: 'group', colSpan: 1, items: ['longText'] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [text.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [{ dataField: 'text', colSpan: 2 }]);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [text.colSpan: 2, longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [{ dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }]);
                    test_1Column_2Items_AlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1]]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }]);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2]]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }]);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2]]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }]);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 } ]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], group.colSpan: 1 [longText.colSpan: 1]]]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { itemType: 'group', colSpan: 1, items: [{ dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 } ]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], group.colSpan: 1 [longText.colSpan: 1]]]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { itemType: 'group', colSpan: 1, items: [{ dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [text.colSpan: 1, longText.colSpan: 1]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [text.colSpan: 1, longText.colSpan: 2]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [text.colSpan: 1, group.colSpan: 2[longText]]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 1 }, { itemType: 'group', colSpan: 1, items: ['longText'] }] }]);
                    test_2Columns_2Items_AlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [text.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 2 }] }]);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [text.colSpan: 2, longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_1Column_2Items_AlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1]]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }] }]);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2]]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }] }]);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2]]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }] }]);
                    test_1Column_1Item(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 1 [text.colSpan: 1], group.colSpan: 1 [longText.colSpan: 1]]]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { itemType: 'group', colSpan: 1, items: [{ dataField: 'longText', colSpan: 1 }] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_2Columns_2Items_AlignedLabels(wrapper);
                    } else {
                        test_2Columns_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 1 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 1 [text.colSpan: 1], group.colSpan: 1 [longText.colSpan: 2]]]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { itemType: 'group', colSpan: 1, items: [{ dataField: 'longText', colSpan: 2 }] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_2Columns_2Items_AlignedLabels(wrapper);
                    } else {
                        test_2Columns_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 1 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testChromeOnly('2 column-> group.colCount:2 [group.colSpan: 2.colCount: 2 [group.text], longText.colSpan: 2]', function() {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [
                            { itemType: 'group', colSpan: 2, colCount: 2, items: [ { dataField: 'text', colSpan: 2 }] },
                            { itemType: 'group', colSpan: 2, colCount: 2, items: [ { dataField: 'longText', colSpan: 2 }] }] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a, abc, text, longText ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a' }, { dataField: 'abc' }, { dataField: 'text' }, { dataField: 'longText' }]);
                    if(alignItemLabels) {
                        test_2Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        test_2Columns_4Items_NotAlignedLabels(wrapper);
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:1, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        test_2Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:1, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        test_2Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:1, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 128);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 409, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 555, 443, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 923, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 457, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 555, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 923, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        test_2Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        test_2Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:2, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 128);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 75, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 409, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 554, 443, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 924, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 457, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 924, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:2, text,colSpan:2, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 128);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 75, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 409, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 554, 443, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 924, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 924, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 457, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 954, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 924, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:2, abc.colSpan:1, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 128);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 923, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 409, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 924, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:2, abc.colSpan:1, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 128);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 923, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 409, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 924, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 924, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 924, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:2, abc.colSpan:1, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 128);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 923, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 409, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 924, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:2, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 128);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 958, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 41, 958, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 41, 443, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 515, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 588, 409, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 957, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 958, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 518, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 554, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 515, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 588, 409, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:2, abc.colSpan:2, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 128);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 958, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 41, 958, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 41, 443, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 515, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 588, 409, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 957, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 958, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 518, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 554, 443, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 515, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 588, 409, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:2, abc.colSpan:2, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 174);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 924, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 924, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 75, 924, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 146, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 139, 75, 409, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 174);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 957, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 958, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 75, 958, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 146, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 139, 75, 409, 34 );
                    }
                });

                testChromeOnly('2 column -> form.colCount:2 [a.colSpan:2, abc.colSpan:2, text,colSpan:2, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 174);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 924, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 924, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 75, 924, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 146, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 139, 75, 924, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 174);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 957, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 958, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 75, 958, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 146, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 139, 75, 924, 34 );
                    }
                });

                [true, false].forEach(alignInGroup => {
                    testChromeOnly('2 column-> group.colCount:2  [a, abc, text, longText ]', function(assert) {
                        const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{
                            itemType: 'group', colCount: 2, alignItemLabels: alignInGroup, items: [
                                { dataField: 'a' }, { dataField: 'abc' }, { dataField: 'text' }, { dataField: 'longText' }]
                        }]);
                        if(alignInGroup) {
                            test_2Columns_4Items_AlignedLabels(wrapper);
                        } else {
                            test_2Columns_4Items_NotAlignedLabels(wrapper);
                        }
                    });
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:1, abc.colSpan:1, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] } ]);
                    test_2Columns_4Items_AlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:1, abc.colSpan:1, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] } ]);
                    test_2Columns_4Items_AlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:1, abc.colSpan:1, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] } ]);
                    wrapper.checkFormSize(1000, 128);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 409, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 555, 443, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 923, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] } ]);
                    test_2Columns_4Items_AlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] } ]);
                    test_2Columns_4Items_AlignedLabels(wrapper);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:1, abc.colSpan:2, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] } ]);
                    wrapper.checkFormSize(1000, 128);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 75, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 409, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 554, 443, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 924, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:1, abc.colSpan:2, text,colSpan:2, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }] } ]);
                    wrapper.checkFormSize(1000, 128);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 75, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 409, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 518, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 554, 443, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 924, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 924, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:2, abc.colSpan:1, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] } ]);
                    wrapper.checkFormSize(1000, 128);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 923, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 409, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:2, abc.colSpan:1, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] } ]);
                    wrapper.checkFormSize(1000, 128);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 923, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 409, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 924, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:2, abc.colSpan:1, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] } ]);
                    wrapper.checkFormSize(1000, 128);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 923, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 409, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 518, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 554, 443, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 75, 409, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:2, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] } ]);
                    wrapper.checkFormSize(1000, 128);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 958, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 41, 958, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 41, 443, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 515, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 588, 409, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:2, abc.colSpan:2, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] } ]);
                    wrapper.checkFormSize(1000, 128);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 958, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 41, 958, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 41, 443, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 515, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 588, 409, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:2, abc.colSpan:2, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] } ]);
                    wrapper.checkFormSize(1000, 174);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 924, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 924, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 75, 924, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 146, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 139, 75, 409, 34);
                });

                testChromeOnly('2 column-> group.colCount:2  [a.colSpan:2, abc.colSpan:2, text,colSpan:2, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }] } ]);
                    wrapper.checkFormSize(1000, 174);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 924, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 75, 924, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 100, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 93, 75, 924, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 146, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 139, 75, 924, 34);
                });

                testChromeOnly('3 column -> form.colCount:3 [a, abc, text, longText ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a' }, { dataField: 'abc' }, { dataField: 'text' }, { dataField: 'longText' }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                    } else {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:1, abc.colSpan:1, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 }, { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 82);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:1, abc.colSpan:1, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 577, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 82);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 577, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:1, abc.colSpan:1, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 82);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 72, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 82);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 604, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 41, 278, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 299, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 72, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 82);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 604, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 41, 278, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:1, abc.colSpan:2, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 82);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 681, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:1, abc.colSpan:2, text,colSpan:2, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 82);
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 681, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:2, abc.colSpan:1, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 628, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 720, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 348, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 421, 229, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:2, abc.colSpan:1, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 628, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 720, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 348, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 421, 577, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:2, abc.colSpan:1, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 628, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:2, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 628, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 54, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 47, 720, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 100, 348, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 93, 421, 229, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:2, abc.colSpan:2, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 628, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:2, abc.colSpan:2, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 628, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34 );
                    }
                });

                testChromeOnly('3 column -> form.colCount:3 [a.colSpan:2, abc.colSpan:2, text,colSpan:2, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(3, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize(1000, 82);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    } else {
                        // NOTE: bug. If some item has colsPan, alignItemLabels option is ignored
                        assert.ok('NOTE: bug. If some item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize(1000, 128 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 628, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19 );
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34 );
                    }
                });

                [true, false].forEach(alignInGroup => {
                    testChromeOnly('3 column -> group.colCount:3 [a, abc, text, longText ]', function(assert) {
                        const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{
                            itemType: 'group', colCount: 3, alignItemLabels: alignInGroup, items: [
                                { dataField: 'a' }, { dataField: 'abc' }, { dataField: 'text' }, { dataField: 'longText' }]
                        }]);
                        wrapper.checkFormSize(1000, 82);
                        if(alignInGroup) {
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                        } else {
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                        }
                    });
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:1, abc.colSpan:1, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 }, { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:1, abc.colSpan:1, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 577, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:1, abc.colSpan:1, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 72, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:1, abc.colSpan:2, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 72, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:1, abc.colSpan:2, text,colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:1, abc.colSpan:2, text,colSpan:2, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:2, abc.colSpan:1, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:2, abc.colSpan:1, text.colSpan:1, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:2, abc.colSpan:1, text.colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 244, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:2, abc.colSpan:2, text.colSpan:1, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:2, abc.colSpan:2, text.colSpan:2, longText.colSpan:1 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] }]);
                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 244, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [a.colSpan:2, abc.colSpan:2, text,colSpan:2, longText.colSpan:2 ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 2 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }] }]);

                    wrapper.checkFormSize(1000, 82);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 244, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                });

                testChromeOnly('3 column -> group.colCount:3 [group[a], group[abc], group[text], group[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{
                        itemType: 'group', colCount: 3, items: [
                            { itemType: 'group', items: ['a'] },
                            { itemType: 'group', items: ['abc'] },
                            { itemType: 'group', items: ['text'] },
                            { itemType: 'group', items: ['longText'] }]
                    }]);

                    wrapper.checkFormSize(1000, 82);
                    if(alignItemLabelsInAllGroups) {
                        test_3Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:1[a], group.colSpan:1[abc], group.colSpan:1[text], group.colSpan:1[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 1, items: ['a'] },
                        { itemType: 'group', colSpan: 1, items: ['abc'] },
                        { itemType: 'group', colSpan: 1, items: ['text'] },
                        { itemType: 'group', colSpan: 1, items: ['longText'] }] }]);

                    wrapper.checkFormSize(1000, 82);
                    if(alignItemLabelsInAllGroups) {
                        test_3Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                    }
                });
            });

            testChromeOnly('3 column -> group.colCount:3 [group.colSpan:1[a], group.colSpan:1[abc], group.colSpan:1[text], group.colSpan:2[longText] ]', function(assert) {
                const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                    { itemType: 'group', colSpan: 1, items: ['a'] },
                    { itemType: 'group', colSpan: 1, items: ['abc'] },
                    { itemType: 'group', colSpan: 1, items: ['text'] },
                    { itemType: 'group', colSpan: 2, items: ['longText'] }] } ]);
                wrapper.checkFormSize(1000, 82);
                if(alignItemLabelsInAllGroups) {
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 229, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 754, 244, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 577, 34);
                } else {
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 577, 34);
                }
            });

            testChromeOnly('3 column -> group.colCount:3 [group.colSpan[a.colSpan:1, group.colSpan:1[abc], group.colSpan:2[text], group.colSpan:1[longText] ]', function(assert) {
                const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                    { itemType: 'group', colSpan: 1, items: ['a'] },
                    { itemType: 'group', colSpan: 1, items: ['abc'] },
                    { itemType: 'group', colSpan: 2, items: ['text'] },
                    { itemType: 'group', colSpan: 1, items: ['longText'] }] }]);

                wrapper.checkFormSize(1000, 82);
                if(alignItemLabelsInAllGroups) {
                    test_3Columns_4Items_AlignedLabels(wrapper);
                } else {
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 262, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 8, 681, 40, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 1, 720, 278, 34);
                    wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 0, 74, 19);
                    wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 75, 244, 34);
                }

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:1[a], group.colSpan:2[abc], group.colSpan:1[text], group.colSpan:1[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 1, items: ['a'] },
                        { itemType: 'group', colSpan: 2, items: ['abc'] },
                        { itemType: 'group', colSpan: 1, items: ['text'] },
                        { itemType: 'group', colSpan: 1, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:1[a], group.colSpan:2[abc], group.colSpan:1[text], group.colSpan:2[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 1, items: ['a'] },
                        { itemType: 'group', colSpan: 2, items: ['abc'] },
                        { itemType: 'group', colSpan: 1, items: ['text'] },
                        { itemType: 'group', colSpan: 2, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 278, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:1[a], group.colSpan:2[abc], group.colSpan:2[text], group.colSpan:1[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 1, items: ['a'] },
                        { itemType: 'group', colSpan: 2, items: ['abc'] },
                        { itemType: 'group', colSpan: 2, items: ['text'] },
                        { itemType: 'group', colSpan: 1, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:1[a], group.colSpan:2[abc], group.colSpan:2[text], group.colSpan:2[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 1, items: ['a'] },
                        { itemType: 'group', colSpan: 2, items: ['abc'] },
                        { itemType: 'group', colSpan: 2, items: ['text'] },
                        { itemType: 'group', colSpan: 2, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 244, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 421, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 293, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 348, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 386, 612, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 611, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 244, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:2[a], group.colSpan:1[abc], group.colSpan:1[text], group.colSpan:1[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 2, items: ['a'] },
                        { itemType: 'group', colSpan: 1, items: ['abc'] },
                        { itemType: 'group', colSpan: 1, items: ['text'] },
                        { itemType: 'group', colSpan: 1, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 242, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 242, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 627, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 229, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:2[a], group.colSpan:1[abc], group.colSpan:1[text], group.colSpan:2[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 2, items: ['a'] },
                        { itemType: 'group', colSpan: 1, items: ['abc'] },
                        { itemType: 'group', colSpan: 1, items: ['text'] },
                        { itemType: 'group', colSpan: 2, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 242, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 242, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 627, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 348, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 421, 577, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:2[a], group.colSpan:1[abc], group.colSpan:2[text], group.colSpan:1[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 2, items: ['a'] },
                        { itemType: 'group', colSpan: 1, items: ['abc'] },
                        { itemType: 'group', colSpan: 2, items: ['text'] },
                        { itemType: 'group', colSpan: 1, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 242, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 242, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 627, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 609, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 242, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:2[a], group.colSpan:1[abc], group.colSpan:2[text], group.colSpan:2[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 2, items: ['a'] },
                        { itemType: 'group', colSpan: 1, items: ['abc'] },
                        { itemType: 'group', colSpan: 2, items: ['text'] },
                        { itemType: 'group', colSpan: 2, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 242, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 242, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 627, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 609, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 242, 34);
                    }
                });

                testChromeOnly('3 column -> group.colCount:3 [group.colSpan:2[a], group.colSpan:2[abc], group.colSpan:2[text], group.colSpan:2[longText] ]', function(assert) {
                    const wrapper = new FormLayoutTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 3, items: [
                        { itemType: 'group', colSpan: 2, items: ['a'] },
                        { itemType: 'group', colSpan: 2, items: ['abc'] },
                        { itemType: 'group', colSpan: 2, items: ['text'] },
                        { itemType: 'group', colSpan: 2, items: ['longText'] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 754, 242, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 75, 577, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 242, 34);
                    } else {
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), 8, 0, 25, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), 1, 26, 627, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), 8, 681, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), 1, 720, 279, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), 54, 0, 40, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), 47, 41, 609, 34);
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), 54, 681, 74, 19);
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), 47, 754, 242, 34);
                    }
                });
            });
        });
    });
});
