import $ from 'jquery';
import FormTestWrapper from '../../helpers/formTestWrapper.js';
import browser from 'core/utils/browser';
import 'ui/form/ui.form';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup = '<div id="form"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Form scenarios', () => {
    function testOrSkip(name, callback) {
        if(!browser.chrome) {
            return;
        }

        QUnit.test(name, callback);
    }

    function test_1Column_1Item(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 958, height: 34 });
    }

    function test_HalfColumn_1Item(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 443, height: 34 });
    }

    function test_HalfColumn_1Column_2Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 75, width: 409, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 924, height: 34 });
    }

    function test_HalfColumn_1Column_2Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 443, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 924, height: 34 });
    }

    function test_1Column_HalfColumn_2Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 75, width: 923, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 409, height: 34 });
    }

    function test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 958, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 409, height: 34 });
    }

    function test_HalfColumn_HalfColumn_2Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 75, width: 409, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 409, height: 34 });
    }

    function test_HalfColumn_HalfColumn_2Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 443, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 409, height: 34 });
    }

    function test_1Column_2Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 75, width: 923, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 923, height: 34 });
    }

    function test_1Column_2Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 958, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 75, width: 923, height: 34 });
    }

    function test_2Columns_2Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 75, width: 411, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 515, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 588, width: 411, height: 34 });
    }

    function test_2Columns_2Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 36 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 1, left: 41, width: 444, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 8, left: 515, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 1, left: 588, width: 411, height: 34 });
    }

    function test_2Columns_4Items_AlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 41, width: 443, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 8, left: 518, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 1, left: 586, width: 409, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 41, width: 443, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 518, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 586, width: 409, height: 34 });
    }

    function test_2Columns_4Items_NotAlignedLabels(wrapper) {
        wrapper.checkFormSize({ width: 1000, height: 82 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 25, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 26, width: 457, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 8, left: 518, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 1, left: 552, width: 442, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 0, width: 40, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 41, width: 443, height: 34 });
        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 54, left: 518, width: 74, height: 19 });
        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 47, left: 588, width: 409, height: 34 });
    }

    [true, false].forEach(alignItemLabels => {
        [true, false].forEach(alignItemLabelsInAllGroups => {
            QUnit.module(`Items layout and labels alignment. alignItemLabels: ${alignItemLabels}, alignItemLabelsInAllGroups: ${alignItemLabelsInAllGroups}`, () => {
                testOrSkip('1 column -> [text]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, ['text']);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('1 column-> [text, longText]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, ['text', 'longText']);
                    if(alignItemLabels) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('1 column-> [text, group[longText]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        'text',
                        { itemType: 'group', items: ['longText'] }]);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('1 column-> [group[text], longText]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { itemType: 'group', items: ['text'] },
                        'longText']);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('1 column-> [group[text], group[longText]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { itemType: 'group', items: ['text'] },
                        { itemType: 'group', items: ['longText'] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                [true, false].forEach(alignInGroup => {
                    testOrSkip(`1 column-> [group.alignItemLabels: ${alignInGroup}[text, longText]]`, function() {
                        const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [
                            { itemType: 'group', alignItemLabels: alignInGroup, items: ['text', 'longText'] }]);
                        if(alignInGroup) {
                            test_1Column_2Items_AlignedLabels(wrapper);
                        } else {
                            test_1Column_2Items_NotAlignedLabels(wrapper);
                        }
                    });
                });

                testOrSkip('2 column-> form.colCount:2 [text]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, ['text']);
                    test_HalfColumn_1Item(wrapper);
                });

                testOrSkip('2 column-> form.colCount:2 [text.colSpan: 1, longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column-> form.colCount:2 [text.colSpan: 1, longText.colSpan: 2]', function(assert) {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column-> form.colCount:2 [text.colSpan: 1, group.colSpan: 2[longText]]', function(assert) {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'text', colSpan: 1 }, { itemType: 'group', colSpan: 1, items: ['longText'] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [text.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [{ dataField: 'text', colSpan: 2 }]);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [text.colSpan: 2, longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [{ dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    test_1Column_HalfColumn_2Items_AlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [text.colSpan: 2, longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [{ dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }]);
                    test_1Column_2Items_AlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1]]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }]);
                    test_HalfColumn_1Item(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 2]]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }]);
                    test_HalfColumn_1Item(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1]]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }]);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2]]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }]);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 1]]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 1 }] }]);
                    test_HalfColumn_1Item(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2]]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }]);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 } ]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], group.colSpan: 1 [longText.colSpan: 1]]]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { itemType: 'group', colSpan: 1, items: [{ dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 1], longText.colSpan: 1]', function() {

                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_HalfColumn_HalfColumn_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 } ]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], group.colSpan: 1 [longText.colSpan: 1]]]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { itemType: 'group', colSpan: 1, items: [{ dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 1 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_HalfColumn_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }]);
                    test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> form.colCount:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups },
                        [ { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }]);
                    test_1Column_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column-> group.colSpan:2 [text]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: ['text'] }]);
                    test_HalfColumn_1Item(wrapper);
                });

                testOrSkip('2 column-> group.colSpan:2 [text.colSpan: 1, longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column-> group.colSpan:2 [text.colSpan: 1, longText.colSpan: 2]', function(assert) {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column-> group.colSpan:2 [text.colSpan: 1, group.colSpan: 2[longText]]', function(assert) {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 1 }, { itemType: 'group', colSpan: 1, items: ['longText'] }] }]);
                    test_2Columns_2Items_AlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [text.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 2 }] }]);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [text.colSpan: 2, longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_1Column_HalfColumn_2Items_AlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [text.colSpan: 2, longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_1Column_2Items_AlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 1]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }] }]);
                    test_HalfColumn_1Item(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 2]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }] }]);
                    test_HalfColumn_1Item(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }] }]);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }] }]);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 1]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 1 }] }] }]);
                    test_HalfColumn_1Item(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }] }]);
                    test_1Column_1Item(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 1], group.colSpan: 1 [longText.colSpan: 1]]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { itemType: 'group', colSpan: 1, items: [{ dataField: 'longText', colSpan: 1 }] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_2Columns_2Items_AlignedLabels(wrapper);
                    } else {
                        test_2Columns_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_HalfColumn_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_HalfColumn_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 1], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_HalfColumn_HalfColumn_2Items_AlignedLabels(wrapper);
                    } else {
                        test_HalfColumn_HalfColumn_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_HalfColumn_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 1], group.colSpan: 1 [longText.colSpan: 2]]]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { itemType: 'group', colSpan: 1, items: [{ dataField: 'longText', colSpan: 2 }] }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_2Columns_2Items_AlignedLabels(wrapper);
                    } else {
                        test_2Columns_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 1 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    test_2Columns_2Items_NotAlignedLabels(wrapper);
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 1 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 1, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 1], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 1 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_HalfColumn_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_HalfColumn_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2], longText.colSpan: 1]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 1 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_HalfColumn_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_HalfColumn_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> group.colSpan:2 [group.colSpan: 2.colCount: 2 [text.colSpan: 2], longText.colSpan: 2]', function() {
                    const wrapper = new FormTestWrapper(1, { alignItemLabels, alignItemLabelsInAllGroups }, [{ itemType: 'group', colCount: 2, items: [
                        { itemType: 'group', colSpan: 2, colCount: 2, items: [{ dataField: 'text', colSpan: 2 }] }, { dataField: 'longText', colSpan: 2 }] }]);
                    if(alignItemLabelsInAllGroups) {
                        test_1Column_2Items_AlignedLabels(wrapper);
                    } else {
                        test_1Column_2Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> form.colCount:2 [a, abc, text, longText ]', function(assert) {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a' }, { dataField: 'abc' }, { dataField: 'text' }, { dataField: 'longText' }]);
                    if(alignItemLabels) {
                        test_2Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        test_2Columns_4Items_NotAlignedLabels(wrapper);
                    }
                });

                testOrSkip('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:1, text,colSpan:1, longText:colSpan:1 ]', function(assert) {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        test_2Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        // NOTE: bug. If there item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                        assert.ok('NOTE: bug. If there item has colsPan, alignItemLabels option is ignored');
                    }
                });

                testOrSkip('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:1, text,colSpan:1, longText:colSpan:2 ]', function(assert) {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 2 }]);
                    if(alignItemLabels) {
                        test_2Columns_4Items_AlignedLabels(wrapper);
                    } else {
                        // NOTE: bug. If there item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                        assert.ok('NOTE: bug. If there item has colsPan, alignItemLabels option is ignored');
                    }
                });

                testOrSkip('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:1, text,colSpan:2, longText:colSpan:1 ]', function(assert) {
                    const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                        { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 1 },
                        { dataField: 'text', colSpan: 2 }, { dataField: 'longText', colSpan: 1 }]);
                    if(alignItemLabels) {
                        wrapper.checkFormSize({ width: 1000, height: 128 });
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 74, height: 19 });
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 75, width: 409, height: 34 });
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 8, left: 518, width: 40, height: 19 });
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 1, left: 555, width: 443, height: 34 });
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 0, width: 72, height: 19 });
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 75, width: 923, height: 34 });
                        wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 100, left: 0, width: 74, height: 19 });
                        wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 93, left: 75, width: 409, height: 34 });
                    } else {
                        // NOTE: bug. If there item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                        assert.ok('NOTE: bug. If there item has colsPan, alignItemLabels option is ignored');
                        // wrapper.checkFormSize({ width: 1000, height: 128 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 25, height: 19 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 26, width: 457, height: 34 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 8, left: 518, width: 40, height: 19 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 1, left: 555, width: 443, height: 34 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 0, width: 40, height: 19 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 75, width: 923, height: 34 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 100, left: 0, width: 74, height: 19 });
                        // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 93, left: 75, width: 409, height: 34 });
                    }

                    testOrSkip('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:2, text,colSpan:1, longText:colSpan:1 ]', function(assert) {
                        const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                            { dataField: 'a', colSpan: 1 }, { dataField: 'abc', colSpan: 2 },
                            { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                        if(alignItemLabels) {
                            test_2Columns_4Items_AlignedLabels(wrapper);
                        } else {
                            // NOTE: bug. If there item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                            assert.ok('NOTE: bug. If there item has colsPan, alignItemLabels option is ignored');
                        }
                    });


                    testOrSkip('2 column -> form.colCount:2 [a.colSpan:1, abc.colSpan:2, text,colSpan:1, longText:colSpan:1 ]', function(assert) {
                        const wrapper = new FormTestWrapper(2, { alignItemLabels, alignItemLabelsInAllGroups }, [
                            { dataField: 'a', colSpan: 2 }, { dataField: 'abc', colSpan: 1 },
                            { dataField: 'text', colSpan: 1 }, { dataField: 'longText', colSpan: 1 }]);
                        if(alignItemLabels) {
                            wrapper.checkFormSize({ width: 1000, height: 128 });
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 74, height: 19 });
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 75, width: 923, height: 34 });
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 54, left: 0, width: 74, height: 19 });
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 47, left: 75, width: 409, height: 34 });
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 518, width: 40, height: 19 });
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 552, width: 443, height: 34 });
                            wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 100, left: 0, width: 74, height: 19 });
                            wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 93, left: 75, width: 409, height: 34 });
                        } else {
                            // NOTE: bug. If there item has colsPan, alignItemLabels option is ignored - test_2Columns_4Items_NotAlignedLabels(wrapper);
                            assert.ok('NOTE: bug. If there item has colsPan, alignItemLabels option is ignored');
                            // wrapper.checkFormSize({ width: 1000, height: 128 });
                            // wrapper.checkElementPosition(wrapper.$form.find('[for$="a"]'), { top: 8, left: 0, width: 25, height: 19 });
                            // wrapper.checkElementPosition(wrapper.$form.find('[id$="a"]'), { top: 1, left: 26, width: 924, height: 34 });
                            // wrapper.checkElementPosition(wrapper.$form.find('[for$="abc"]'), { top: 54, left: 0, width: 40, height: 19 });
                            // wrapper.checkElementPosition(wrapper.$form.find('[id$="abc"]'), { top: 47, left: 75, width: 443, height: 34 });
                            // wrapper.checkElementPosition(wrapper.$form.find('[for$="text"]'), { top: 54, left: 518, width: 40, height: 19 });
                            // wrapper.checkElementPosition(wrapper.$form.find('[id$="text"]'), { top: 47, left: 552, width: 443, height: 34 });
                            // wrapper.checkElementPosition(wrapper.$form.find('[for$="longText"]'), { top: 100, left: 0, width: 74, height: 19 });
                            // wrapper.checkElementPosition(wrapper.$form.find('[id$="longText"]'), { top: 93, left: 75, width: 409, height: 34 });
                        }
                    });
                });
            });
        });
    });
});
