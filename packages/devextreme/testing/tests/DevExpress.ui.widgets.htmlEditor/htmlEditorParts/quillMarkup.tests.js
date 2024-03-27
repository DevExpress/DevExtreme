import $ from 'jquery';
import 'ui/html_editor';

const HTML_EDITOR_CONTENT_CLASS = 'dx-htmleditor-content';

const { test, module: testModule } = QUnit;

testModule('lists', () => {
    [
        { listType: 'bullet', hasUi: false },
        { listType: 'ordered', hasUi: false },
        { listType: 'checked', hasUi: true },
        { listType: 'unchecked', hasUi: true },
    ].forEach(({ listType, hasUi }) => {
        test(`${listType} list item with should ${hasUi ? '' : 'not'} have visible ui element`, function(assert) {
            const instance = $('#htmlEditor').dxHtmlEditor({
                value: 'test'
            }).dxHtmlEditor('instance');
            const $element = instance.$element();

            instance.formatLine(0, 4, 'list', listType);

            const $listUi = $element.find('li > .ql-ui');
            const expectedVisibility = hasUi ? 'visible' : 'hidden';
            assert.strictEqual($listUi.length, 1, 'There is only one UI element');
            assert.strictEqual($listUi.css('visibility'), expectedVisibility, `UI element is ${hasUi ? '' : 'not'} visible`);
        });
    });

    test('ordered list should have counter-reset property set to default (T1220554)', function(assert) {
        const instance = $('#htmlEditor').dxHtmlEditor({
            value: '<ol><li></li></ol>'
        }).dxHtmlEditor('instance');
        const $element = instance.$element();

        const $contentOrderedList = $element.find(`.${HTML_EDITOR_CONTENT_CLASS} ol`);

        assert.equal($contentOrderedList.css('counterReset'), 'list-item 0', 'dx-htmleditor-content ol has counter-reset: list-item 0;');
    });
});
