import $ from 'jquery';
import { dropDownEditorsList } from '../../helpers/widgetsList.js';
import { defaultDropDownOptions } from '../../helpers/dropDownOptions.js';

import 'common.css!';
import 'generic_light.css!';

const dropDownEditorsNames = Object.keys(dropDownEditorsList);
const dropDownOptionsKeys = Object.keys(defaultDropDownOptions);

const optionTestValues = {
    accessKey: 'custom-accesskey',
    animation: {
        hide: {
            duration: 200,
            from: 0.2,
            to: 0.8,
            type: 'fade'
        },
        show: {
            duration: 100,
            from: 0.2,
            to: 0.8,
            type: 'fade'
        }
    },
    closeOnOutsideClick: true,
    container: '#container',
    contentTemplate: 'content template',
    deferRendering: false,
    disabled: true,
    dragEnabled: true,
    elementAttr: { 'custom-attr': 'value' },
    focusStateEnabled: true,
    fullScreen: true,
    height: 500,
    hint: 'hint',
    hoverStateEnabled: true,
    maxHeight: 600,
    maxWidth: 400,
    minHeight: 300,
    minWidth: 200,
    onContentReady: () => undefined,
    onDisposing: () => undefined,
    onHidden: () => undefined,
    onHiding: () => undefined,
    onInitialized: () => undefined,
    onOptionChanged: () => undefined,
    onResize: () => undefined,
    onResizeEnd: () => undefined,
    onResizeStart: () => undefined,
    onShowing: () => undefined,
    onShown: () => undefined,
    onTitleRendered: () => undefined,
    position: null,
    resizeEnabled: true,
    rtlEnabled: true,
    shading: true,
    shadingColor: 'rgb(0,0,0)',
    showCloseButton: true,
    showTitle: true,
    tabIndex: 150,
    title: 'custom title',
    titleTemplate: 'custom title',
    toolbarItems: [{ widget: 'dxButton' }],
    visible: true,
    width: 500
};

const getPopupInstance = (editor) => {
    return editor._popup;
};
const skipTesting = (assert) => {
    assert.ok(true, 'tests for this option are implemented separately');
};

QUnit.testStart(function() {
    const markup = '<div id="editor"></div>\
    <div id="container"></div>';

    $('#qunit-fixture').html(markup);
});

const optionComparer = {
    position: function(assert, editor) {
        const expectedPosition = {
            my: 'left top',
            at: 'left bottom',
            of: $('#editor')
        };

        ['my', 'at'].forEach(positionProp => {
            assert.strictEqual(editor.option('dropDownOptions.position')[positionProp], expectedPosition[positionProp], `dropDownOptions.position.${positionProp} is correct`);
            assert.strictEqual(getPopupInstance(editor).option('position')[positionProp], expectedPosition[positionProp], `popup position.${positionProp} is correct`);
        });
        assert.strictEqual(editor.option('dropDownOptions.position.of').get(0), expectedPosition.of.get(0), 'dropDownOptions.position.of is correct');
        assert.strictEqual(getPopupInstance(editor).option('position.of').get(0), expectedPosition.of.get(0), 'dropDownOptions.position.of is correct');
    },
    contentTemplate: function(assert, editor) {
        if(editor.NAME === 'dxDropDownBox' || editor.NAME === 'dxDropDownButton') {
            assert.strictEqual(editor.option('dropDownOptions.contentTemplate'), 'content', 'dropDownOptions.contentTemplate is correct');
            assert.strictEqual(getPopupInstance(editor).option('contentTemplate'), 'content', 'popup contentTemplate is correct');
            return;
        }

        assert.strictEqual(editor.option('dropDownOptions.contentTemplate'), null, 'dropDownOptions.contentTemplate is correct');
        assert.strictEqual(getPopupInstance(editor).option('contentTemplate'), null, 'popup contentTemplate is correct');
    },
    title: function(assert, editor) {
        if(editor.NAME === 'dxDateBox') {
            skipTesting(assert);
            return;
        }

        assert.strictEqual(editor.option('dropDownOptions.title'), '', 'dropDownOptions.title is correct');
        assert.strictEqual(getPopupInstance(editor).option('title'), '', 'popup title is correct');
    },
    showTitle: function(assert, editor) {
        if(editor.NAME === 'dxDateBox') {
            skipTesting(assert);
            return;
        }

        assert.strictEqual(editor.option('dropDownOptions.showTitle'), false, 'dropDownOptions.showTitle is correct');
        assert.strictEqual(getPopupInstance(editor).option('showTitle'), false, 'popup showTitle is correct');
    },
    deferRendering: skipTesting,
    closeOnOutsideClick: skipTesting,
    width: skipTesting,
    maxHeight: skipTesting
};

QUnit.module('dropDownOptions on pure init', () => {
    dropDownEditorsNames.forEach(widgetName => {
        QUnit.module(widgetName, function() {
            dropDownOptionsKeys.forEach(option => {
                // TODO: fix this cases
                if(widgetName === 'dxDropDownBox' && (option === 'focusStateEnabled' || option === 'tabIndex')
                    || widgetName === 'dxDropDownButton' && option === 'showCloseButton') {
                    return;
                }
                QUnit.test(`${option} is correct`, function(assert) {
                    const editor = new dropDownEditorsList[widgetName]('#editor', { deferRendering: false, applyValueMode: 'instantly' });

                    if(optionComparer[option]) {
                        optionComparer[option](assert, editor);
                        return;
                    }

                    assert.deepEqual(editor.option(`dropDownOptions.${option}`), defaultDropDownOptions[option], `dropDownOptions.${option} is equal to ${defaultDropDownOptions[option]}`);
                    assert.deepEqual(getPopupInstance(editor).option(option), defaultDropDownOptions[option], `popup ${option} is equal to ${defaultDropDownOptions[option]}`);
                });
            });
        });
    });
});

QUnit.module('dropDownOptions on init with custom value', () => {
    dropDownEditorsNames.forEach(widgetName => {
        QUnit.module(widgetName, function() {
            dropDownOptionsKeys.forEach(option => {
                if(option === 'visible') {
                    // TODO: fix this case
                    return;
                }
                QUnit.test(`${option} is correct`, function(assert) {
                    const editor = new dropDownEditorsList[widgetName]('#editor', {
                        deferRendering: false,
                        applyValueMode: 'instantly',
                        dropDownOptions: {
                            [option]: optionTestValues[option]
                        }
                    });

                    assert.deepEqual(editor.option(`dropDownOptions.${option}`), optionTestValues[option], `dropDownOptions.${option} is equal to ${optionTestValues[option]}`);
                    assert.deepEqual(getPopupInstance(editor).option(option), optionTestValues[option], `popup ${option} is equal to ${optionTestValues[option]}`);
                });
            });
        });
    });
});


QUnit.module('dropDownOptions runtime change', () => {
    dropDownEditorsNames.forEach(widgetName => {
        QUnit.module(widgetName, function() {
            dropDownOptionsKeys.forEach(option => {
                if(widgetName === 'dxDropDownButton' && (option === 'visible' || option === 'position')) {
                    // TODO: fix this cases
                    return;
                }

                QUnit.test(`${option} is correct`, function(assert) {
                    const editor = new dropDownEditorsList[widgetName]('#editor', { deferRendering: false, applyValueMode: 'instantly' });
                    editor.option(`dropDownOptions.${option}`, optionTestValues[option]);

                    assert.deepEqual(editor.option(`dropDownOptions.${option}`), optionTestValues[option], `dropDownOptions.${option} is equal to ${optionTestValues[option]}`);
                    assert.deepEqual(getPopupInstance(editor).option(option), optionTestValues[option], `popup ${option} is equal to ${optionTestValues[option]}`);
                });
            });
        });
    });
});
