import $ from 'jquery';
import TagBox from 'ui/tag_box';
import fx from 'common/core/animation/fx';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import windowModule from 'core/utils/window';

QUnit.testStart(function() {
    const markup =
        '<div id="tagBox"></div>';

    $('#qunit-fixture').html(markup);
});

const EMPTY_INPUT_CLASS = 'dx-texteditor-empty';
const TAGBOX_CLASS = 'dx-tagbox';
const TAGBOX_TAG_CONTAINER_CLASS = 'dx-tag-container';
const TAGBOX_TAG_CONTENT_CLASS = 'dx-tag-content';
const TAGBOX_TAG_CLASS = 'dx-tag';
const TAGBOX_MULTI_TAG_CLASS = 'dx-tagbox-multi-tag';
const TAGBOX_TAG_REMOVE_BUTTON_CLASS = 'dx-tag-remove-button';
const TAGBOX_SINGLE_LINE_CLASS = 'dx-tagbox-single-line';
const TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS = 'dx-tagbox-default-template';
const TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS = 'dx-tagbox-custom-template';
const TAGBOX_TEXTEDITOR_INPUT_CONTAINER_CLASS = 'dx-texteditor-input-container';
const SELECT_ALL_CLASS = 'dx-list-select-all';

const moduleSetup = {
    beforeEach: function() {
        TagBox.defaultOptions({ options: { deferRendering: false } });

        this.getTexts = function($tags) {
            return $tags.map(function(_, tag) {
                return $(tag).text();
            }).toArray();
        };

        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module('base markup', moduleSetup, () => {
    QUnit.test('tagbox should have base class', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            opened: false,
            items: [1, 2, 3],
            value: [1, 2]
        });

        assert.ok($tagBox.hasClass(TAGBOX_CLASS), 'tagbox should have base class');
        assert.notOk($tagBox.hasClass(EMPTY_INPUT_CLASS), 'tag box has no empty class');

        const $tagContainer = $tagBox.find('.' + TAGBOX_TAG_CONTAINER_CLASS);
        assert.equal($tagContainer.length, 1, 'tagbox should have tag container');

        const $tags = $tagBox.find('.' + TAGBOX_TAG_CLASS); const $tagContent = $tags.find('.' + TAGBOX_TAG_CONTENT_CLASS);

        assert.equal($tagContent.length, 2, 'each tag has tag content');
        assert.deepEqual(this.getTexts($tagContent), ['1', '2'], 'each tag content has correct text');
        assert.equal($tagContent.find('.' + TAGBOX_TAG_REMOVE_BUTTON_CLASS).length, 2, 'each tag has remove button');
        assert.ok($tags.eq(0).parent().hasClass(TAGBOX_TEXTEDITOR_INPUT_CONTAINER_CLASS), 'tags are placed in the element with TAGBOX_TEXTEDITOR_INPUT_CONTAINER_CLASS');
    });

    QUnit.test('tagbox should render custom values in tags', function(assert) {
        const $element = $('#tagBox')
            .dxTagBox({
                value: [1, 2]
            });

        const tags = $element.find('.' + TAGBOX_TAG_CONTENT_CLASS);
        assert.equal(tags.length, 2, 'tags are rendered');
    });

    QUnit.test('tagElement arguments of tagTemplate for custom tags is correct', function(assert) {
        $('#tagBox').dxTagBox({
            value: [1, 2],
            tagTemplate: function(tagData, tagElement) {
                assert.equal(isRenderer(tagElement), !!config().useJQuery, 'tagElement is correct');
            }
        });
    });

    QUnit.test('empty class should be added if no one tags selected', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3]
        });

        assert.ok($tagBox.hasClass(EMPTY_INPUT_CLASS), 'element has an empty class');
    });

    QUnit.test('tagBox should render tags with the custom displayExpr for simple items', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            displayExpr: function(item) {
                if(item === 1) {
                    return 'one';
                }
                return item;
            },
            value: [1, 2]
        });
        const $tags = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tags.length, 2, 'two tags should be rendered');
        assert.equal($tags.eq(0).text(), 'one', 'Check value of the first tag');
        assert.equal($tags.eq(1).text(), '2', 'Check value of the second tag');
    });

    QUnit.test('tagBox should render tags with the custom displayExpr for object items', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [{ value: 1 }, { value: 2 }, { value: 3 }],
            displayExpr: function(item) {
                if(item.value === 1) {
                    return 'one';
                }
                return item.value;
            },
            valueExpr: 'value',
            value: [1, 2]
        });
        const $tags = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tags.length, 2, 'two tags should be rendered');
        assert.equal($tags.eq(0).text(), 'one', 'Check value of the first tag');
        assert.equal($tags.eq(1).text(), '2', 'Check value of the second tag');
    });

    QUnit.test('tagBox should not render an empty tag when item is not found in the dataSource', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [{ id: 1, text: 'item 1' }],
            valueExpr: 'id',
            displayExpr: 'text',
            value: [1, 4]
        });
        const $tags = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tags.length, 1, 'only one tag should be rendered');
        assert.equal($tags.text(), 'item 1', 'first tag should be rendered');
    });

    QUnit.test('placeholder should be rendered', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: ['item1', 'item2', 'item3'],
            value: []
        });
        const $placeholder = $tagBox.find('.dx-placeholder');

        assert.equal($placeholder.length, 1, 'placeholder has been rendered');
    });
});

QUnit.module('select element', moduleSetup, () => {
    QUnit.test('a select element should be rendered', function(assert) {
        const $select = $('#tagBox').dxTagBox()
            .find('select');

        assert.equal($select.length, 1, 'select element is rendered');
    });

    QUnit.test('the select element should has the \'multiple\' attribute', function(assert) {
        const select = $('#tagBox').dxTagBox()
            .find('select')
            .get(0);

        assert.ok(select.hasAttribute('multiple'), 'the select element has the \'multiple\' attribute');
    });

    QUnit.test('an option element should be rendered for each selected item', function(assert) {
        const items = ['eins', 'zwei', 'drei'];
        const $options = $('#tagBox')
            .dxTagBox({
                items: items,
                value: [items[0], items[2]]
            })
            .find('option');

        assert.equal($options.length, 2, 'option elements count is correct');
    });

    QUnit.test('option elements should have correct \'value\' attributes', function(assert) {
        const items = ['eins', 'zwei', 'drei'];
        const value = [items[0], items[2]];
        const $options = $('#tagBox')
            .dxTagBox({
                items: items,
                value: value
            })
            .find('option');

        $options.each(function(index) {
            assert.equal(this.value, value[index], 'the \'value\' attribute is correct for the option ' + index);
        });
    });

    QUnit.test('option elements should have the \'selected\' attributes', function(assert) {
        const items = ['eins', 'zwei', 'drei'];
        const value = [items[0], items[2]];
        const $options = $('#tagBox')
            .dxTagBox({
                items: items,
                value: value
            })
            .find('option');

        $options.each(function(index) {
            assert.ok(this.hasAttribute('selected'), 'the \'selected\' attribute is set for the option ' + index);
        });
    });

    QUnit.test('option elements should have displayed text of selected items as value if the \'valueExpr\' option is \'this\'', function(assert) {
        const items = [{ id: 1, text: 'eins' }, { id: 2, text: 'zwei' }, { id: 3, text: 'drei' }];
        const value = [items[0], items[2]];
        const $options = $('#tagBox')
            .dxTagBox({
                items: items,
                value: value,
                valueExpr: 'this',
                displayExpr: 'text'
            })
            .find('option');

        assert.equal($options.length, value.length, 'all options are rendered');

        $options.each(function(index) {
            assert.equal(this.value, value[index].text, 'the \'value\' attribute is set for the option ' + index);
        });
    });

    QUnit.test('the submit value must be equal to the value of the widget', function(assert) {
        const items = ['test-1', 'test-2', 'test-3'];
        const value = [items[0], items[2]];
        const $options = $('#tagBox')
            .dxTagBox({
                items: items,
                value: value,
                valueExpr: 'this',
                displayExpr: function(item) {
                    if(item) {
                        return item.split('-').join('+');
                    }
                }
            })
            .find('option');

        assert.equal($options.length, value.length, 'all options are rendered');

        $options.each(function(index) {
            assert.deepEqual(this.value, value[index], 'the \'value\' attribute is set for the option ' + index);
        });
    });

    QUnit.test('select element should get the \'name\' attribute with a correct value', function(assert) {
        const expectedName = 'some_name';
        const $element = $('#tagBox').dxTagBox({
            name: expectedName
        });
        const $select = $element.find('select');

        assert.equal($select.attr('name'), expectedName, 'the select element \'name\' attribute has correct value');
    });

    QUnit.test('Custom selectAllText', function(assert) {
        if(!windowModule.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const selectAllText = 'Test';

        $('#tagBox').dxTagBox({
            items: ['P1', 'P2'],
            selectAllText,
            showSelectionControls: true,
            opened: true
        });

        assert.equal($(`.${SELECT_ALL_CLASS}`).text(), selectAllText);
    });
});

QUnit.module('multitag', moduleSetup, () => {
    QUnit.test('tagBox should display one tag after limit overflow', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2
        });
        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tag.length, 1, 'only one tag should be displayed');
        assert.ok($tag.hasClass(TAGBOX_MULTI_TAG_CLASS), 'the tag has correct css class');
        assert.equal($tag.text(), '3 selected', 'tag has correct text');
    });

    QUnit.test('multitag should be rendered always when maxDisplayedTags is 0', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            maxDisplayedTags: 0,
            value: [1]
        });
        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tag.length, 1, 'one tag is selected');
        assert.ok($tag.hasClass(TAGBOX_MULTI_TAG_CLASS), 'one selected tag is multitag');
    });

    QUnit.test('onMultitagPreparing option', function(assert) {
        assert.expect(5);

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2,
            onMultiTagPreparing: function(e) {
                assert.equal(e.component.NAME, 'dxTagBox', 'component is correct');
                assert.equal(isRenderer(e.multiTagElement), !!config().useJQuery, 'tagElement is correct');
                assert.ok($(e.multiTagElement).hasClass(TAGBOX_MULTI_TAG_CLASS), 'element is correct');
                assert.deepEqual(e.selectedItems, [1, 2, 4], 'selectedItems are correct');
                e.text = 'custom text';
            }
        });
        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.deepEqual($tag.text(), 'custom text', 'custom text is displayed');
    });

    QUnit.test('multi tag should not be rendered if e.cancel is true', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2,
            onMultiTagPreparing: function(e) {
                e.cancel = true;
            }
        });
        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tag.length, 3, '3 tags was rendered');
        assert.deepEqual(this.getTexts($tag), ['1', '2', '4'], 'tags have correct text');
    });

    QUnit.test('multi tag should be rendered after max number of tags if showMultiTagOnly is false', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2,
            showMultiTagOnly: false
        });
        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tag.length, 2, '2 tags rendered');
        assert.deepEqual(this.getTexts($tag), ['1', '2 more'], 'tags have correct text');
    });

    QUnit.test('only multi tag should be shown when showMultiTagOnly option is true', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3, 4],
            value: [1, 2, 4],
            maxDisplayedTags: 2,
            showMultiTagOnly: true
        });
        const $tag = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tag.length, 1, '1 tag rendered');
        assert.deepEqual($tag.text(), '3 selected', 'text is correct');
    });
});

QUnit.module('option dependent appearance', moduleSetup, () => {
    QUnit.test('displayExpr and valueExpr options should work correctly', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            dataSource: [{
                'ID': 1,
                'Name': 'Item 1'
            }, {
                'ID': 2,
                'Name': 'Item 2'
            }],
            displayExpr: 'Name',
            valueExpr: 'ID',
            value: [2]
        });
        const $tags = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tags.text(), 'Item 2', 'tag is correct');
    });

    QUnit.test('tag should have correct value when item value is zero', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: [0, 1, 2, 3],
            value: [0]
        });
        const $tags = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tags.text(), '0', 'selected item is correct');
    });

    QUnit.test('tag should have correct value when item value is an empty string', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({
            items: ['', 1, 2, 3],
            value: ['']
        });
        const $tags = $tagBox.find('.' + TAGBOX_TAG_CLASS);

        assert.equal($tags.length, 1, 'empty string value was successfully selected');
    });

    QUnit.test('tags should not be rendered if the value is null', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            value: null
        });

        assert.equal($element.find('.' + TAGBOX_TAG_CLASS).length, 0, 'no tags are rendered');
    });

    QUnit.test('tag template option should work', function(assert) {
        const $element = $('#tagBox').dxTagBox({
            items: [{ id: 1, text: 'one' }, { id: 2, text: 'two' }],
            displayExpr: 'text',
            valueExpr: 'id',
            opened: true,
            value: [1, 2],
            tagTemplate: function(tagData, tagElement) {
                return '<div class=\'custom-item\'><div class=\'product-name\'>!' + tagData.text + '</div>';
            }
        });
        const $tagContainer = $element.find('.' + TAGBOX_TAG_CONTAINER_CLASS);

        assert.equal($.trim($tagContainer.text()), '!one!two', 'selected values are rendered correctly');
    });

    QUnit.test('tagbox should have template classes', function(assert) {
        const fieldTemplate = function() {
            return $('<div>').dxTextBox();
        };

        const $tagBox = $('#tagBox').dxTagBox({
            items: [1, 2, 3],
            focusStateEnabled: true,
            fieldTemplate: fieldTemplate
        });

        assert.notOk($tagBox.hasClass(TAGBOX_DEFAULT_FIELD_TEMPLATE_CLASS), 'default template class was removed');
        assert.ok($tagBox.hasClass(TAGBOX_CUSTOM_FIELD_TEMPLATE_CLASS), 'custom template class was applied');
    });

    QUnit.test('widget gets special class in the single line mode', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({ multiline: false });
        assert.ok($tagBox.hasClass(TAGBOX_SINGLE_LINE_CLASS), 'the single line class is added');
    });

    QUnit.test('tagbox should not have a single line class if multiline is true', function(assert) {
        const $tagBox = $('#tagBox').dxTagBox({ multiline: true });
        assert.notOk($tagBox.hasClass(TAGBOX_SINGLE_LINE_CLASS), 'there is no single line class on widget');
    });
});

