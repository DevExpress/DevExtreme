import $ from 'jquery';
import fx from 'common/core/animation/fx';
import { dropDownEditorsList } from '../../helpers/widgetsList.js';
import { defaultDropDownOptions } from '../../helpers/dropDownOptions.js';

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
    hideOnOutsideClick: false,
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
    width: 500,
    wrapperAttr: { 'custom-attr': 'value' },
    _wrapperClassExternal: 'dx-dropdowneditor-overlay',
    _ignorePreventScrollEventsDeprecation: false,
};

const getPopupInstance = (editor) => {
    if(editor.NAME === 'dxDateRangeBox') {
        return editor.getStartDateBox()._popup;
    }
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
        assert.strictEqual(getPopupInstance(editor).option('position.of').get(0), expectedPosition.of.get(0), 'popup position.of is correct');
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
        if(editor.NAME === 'dxDateBox' || editor.NAME === 'dxDateRangeBox') {
            skipTesting(assert);
            return;
        }

        assert.strictEqual(editor.option('dropDownOptions.title'), '', 'dropDownOptions.title is correct');
        assert.strictEqual(getPopupInstance(editor).option('title'), '', 'popup title is correct');
    },
    showTitle: function(assert, editor) {
        if(editor.NAME === 'dxDateBox' || editor.NAME === 'dxDateRangeBox') {
            skipTesting(assert);
            return;
        }

        assert.strictEqual(editor.option('dropDownOptions.showTitle'), false, 'dropDownOptions.showTitle is correct');
        assert.strictEqual(getPopupInstance(editor).option('showTitle'), false, 'popup showTitle is correct');
    },
    hideOnOutsideClick: function(assert, editor) {
        assert.ok(editor.option('dropDownOptions.hideOnOutsideClick'), 'dropDownOptions.hideOnOutsideClick is correct');
        assert.ok(getPopupInstance(editor).option('hideOnOutsideClick'), 'popup hideOnOutsideClick is correct');
    },
    deferRendering: skipTesting,
    width: skipTesting,
    maxHeight: skipTesting,
    visible: skipTesting
};

dropDownEditorsNames.forEach(widgetName => {
    QUnit.module(widgetName, {
        beforeEach: function() {
            fx.off = true;
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            fx.off = false;
            this.clock.restore();
        }
    }, function() {
        QUnit.module('dropDownOptions on pure init', () => {
            dropDownOptionsKeys.forEach(option => {
                // TODO: fix this cases
                if(widgetName === 'dxDropDownBox' && (option === 'focusStateEnabled' || option === 'tabIndex')
                    || widgetName === 'dxDropDownButton' && (option === 'showCloseButton' || option === '_ignorePreventScrollEventsDeprecation')) {
                    return;
                }
                QUnit.test(`${option} is correct`, function(assert) {
                    const editor = new dropDownEditorsList[widgetName]($('#editor'), { deferRendering: false, applyValueMode: 'instantly' });

                    if(optionComparer[option]) {
                        optionComparer[option](assert, editor);
                        return;
                    }

                    if(widgetName !== 'dxDropDownButton' && option === 'onInitialized') {
                        assert.strictEqual(typeof editor.option(`dropDownOptions.${option}`), 'function', `dropDownOptions.${option} is equal to function`);
                    } else {
                        assert.deepEqual(editor.option(`dropDownOptions.${option}`), defaultDropDownOptions[option], `dropDownOptions.${option} is equal to ${defaultDropDownOptions[option]}`);
                        assert.deepEqual(getPopupInstance(editor).option(option), defaultDropDownOptions[option], `popup ${option} is equal to ${defaultDropDownOptions[option]}`);
                    }
                });
            });
        });

        QUnit.module('dropDownOptions on init with custom value', () => {
            dropDownOptionsKeys.forEach(option => {
                QUnit.test(`${option} is correct`, function(assert) {
                    if(option === 'visible') {
                        assert.ok('it is tested in separate module below or in widget specific test package');
                        return;
                    }

                    const editor = new dropDownEditorsList[widgetName]($('#editor'), {
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

        QUnit.module('dropDownOptions runtime change', () => {
            dropDownOptionsKeys.forEach(option => {
                if(widgetName === 'dxDropDownButton' && (option === 'visible' || option === 'position')) {
                    // TODO: fix this cases
                    return;
                }

                QUnit.test(`${option} is correct`, function(assert) {
                    const editor = new dropDownEditorsList[widgetName]($('#editor'), { deferRendering: false, applyValueMode: 'instantly' });
                    editor.option(`dropDownOptions.${option}`, optionTestValues[option]);

                    assert.deepEqual(editor.option(`dropDownOptions.${option}`), optionTestValues[option], `dropDownOptions.${option} is equal to ${optionTestValues[option]}`);
                    assert.deepEqual(getPopupInstance(editor).option(option), optionTestValues[option], `popup ${option} is equal to ${optionTestValues[option]}`);
                });
            });
        });

        QUnit.module('dropDownOptions 2-way binding', () => {
            dropDownOptionsKeys.forEach(option => {
                if(option === '_ignorePreventScrollEventsDeprecation') return;
                QUnit.test(`dropDownOptions.${option} was updated correctly`, function(assert) {
                    const editor = new dropDownEditorsList[widgetName]($('#editor'), { deferRendering: false, applyValueMode: 'instantly' });
                    const popup = getPopupInstance(editor);
                    popup.option(option, optionTestValues[option]);

                    assert.deepEqual(editor.option(`dropDownOptions.${option}`), optionTestValues[option]);
                });
            });
        });

        QUnit.module('deferRendering', () => {
            QUnit.skip('default dropDownOptions.deferRendering value is true', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'));

                assert.strictEqual(editor.option('dropDownOptions.deferRendering'), true);
            });

            QUnit.test('dropDownOptions.deferRendering=false should not override deferRendering', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), {
                    deferRendering: true,
                    'dropDownOptions.deferRendering': false
                });
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup, undefined, 'popup was not rendered');
            });

            QUnit.test('dropDownOptions.deferRendering=true should not override deferRendering', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), {
                    deferRendering: false,
                    'dropDownOptions.deferRendering': true
                });
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup.NAME, 'dxPopup', 'popup was rendered');
            });

            QUnit.test('popup is not rendered if deferRendering is true', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'));
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup, undefined, 'popup is not rendered');
            });

            QUnit.test('popup is rendered if deferRendering is false', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), { deferRendering: false });
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup.NAME, 'dxPopup', 'popup is rendered');
            });

            QUnit.test('popup is rendered immediately when deferRendering is changed to false at runtime', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'));
                editor.option('deferRendering', false);
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup.NAME, 'dxPopup', 'popup is rendered');
            });

            QUnit.test('popup should not render when dropDownOptions.deferRendering is changed to false at runtime', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'));
                editor.option('dropDownOptions.deferRendering', false);
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup, undefined, 'popup is not rendered');
            });

            QUnit.test('popup should not render if dropDownOptions.deferRendering is false', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), { 'dropDownOptions.deferRendering': false });
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup, undefined, 'popup is not rendered');
            });

            QUnit.test('deferRendering should not do anything if popup has already been rendered', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), { deferRendering: false });
                const popup = getPopupInstance(editor);

                editor.option('deferRendering', true);
                assert.strictEqual(getPopupInstance(editor), popup, 'popup does not render repeatedly');

                editor.option('deferRendering', false);
                assert.strictEqual(getPopupInstance(editor), popup, 'popup does not render repeatedly');
            });
        });

        QUnit.module('dropDownOptions.visible', () => {
            QUnit.test('popup should not render if dropDownOptions.visible=true and deferRendering=true', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), { 'dropDownOptions.visible': true });
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup, undefined, 'popup is not rendered');
            });

            QUnit.skip('popup should not open if dropDownOptions.visible=true and deferRendering=false', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), { 'dropDownOptions.visible': true, deferRendering: false });
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup.option('visible'), false, 'popup is closed');
            });

            QUnit.test('popup should not render after dropDownOptions.visible value changes to true if deferRendering=true', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'));
                editor.option('dropDownOptions.visible', true);
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup, undefined, 'popup is not rendered');
            });

            QUnit.test('popup should open after dropDownOptions.visible value changes to true if deferRendering=false', function(assert) {
                if(widgetName === 'dxDropDownButton') {
                    assert.ok(true, 'TODO: fix this case');
                    return;
                }

                const editor = new dropDownEditorsList[widgetName]($('#editor'), { deferRendering: false });
                editor.option('dropDownOptions.visible', true);
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup.option('visible'), true, 'popup is opened');
            });

            QUnit.test('popup should close after dropDownOptions.visible value changes to false if deferRendering=false', function(assert) {
                if(widgetName === 'dxDropDownButton') {
                    assert.ok(true, 'TODO: fix this case');
                    return;
                }

                const editor = new dropDownEditorsList[widgetName]($('#editor'), { deferRendering: false, opened: true });
                editor.option('dropDownOptions.visible', false);
                const popup = getPopupInstance(editor);

                assert.strictEqual(popup.option('visible'), false, 'popup is closed');
            });
        });

        QUnit.module('dropDownOptions using after repaint', () => {
            // TODO: skip because of ddOptions.visible incorrect behavior
            QUnit.skip('dropDownOptions should not be cleared', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), {
                    dropDownOptions: optionTestValues,
                    deferRendering: false,
                    pickerType: 'calendar'
                });

                editor.repaint();
                const popup = getPopupInstance(editor);

                dropDownOptionsKeys.forEach(option => {
                    assert.deepEqual(editor.option(`dropDownOptions.${option}`), optionTestValues[option], `dropDownOptions.${option}`);
                    assert.deepEqual(popup.option(option), optionTestValues[option], option);
                });
            });

            QUnit.test('dropDownOptions should not be cleared even if it was changed at runtime', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), {
                    deferRendering: false,
                    pickerType: 'calendar'
                });
                editor.option('dropDownOptions', { customOption: 'custom value' });

                editor.repaint();
                const popup = getPopupInstance(editor);

                assert.deepEqual(editor.option('dropDownOptions.customOption'), 'custom value');
                assert.deepEqual(popup.option('customOption'), 'custom value');
            });
        });

        QUnit.module('dropDownOptions.hideOnOutsideClick', () => {
            QUnit.test('popup should be hidden after click outside', function(assert) {
                new dropDownEditorsList[widgetName]($('#editor'), { opened: true, pickerType: 'calendar' });
                const $overlay = $('.dx-overlay-content').eq(0);

                $(document).trigger('dxpointerdown');
                assert.notOk($overlay.is(':visible'), 'overlay is hidden');
            });

            QUnit.test('popup should not be hidden after click on overlay', function(assert) {
                new dropDownEditorsList[widgetName]($('#editor'), { opened: true, pickerType: 'calendar' });
                const $overlay = $('.dx-overlay-content').eq(0);

                $overlay.trigger('dxpointerdown');
                assert.ok($overlay.is(':visible'), 'overlay is not hidden');
            });
        });

        QUnit.module('specific tests', () => {
            QUnit.test('dropDownOptions should have dragEnabled=false after popup opened (T946143)', function(assert) {
                const editor = new dropDownEditorsList[widgetName]($('#editor'), { opened: true, pickerType: 'calendar' });

                assert.strictEqual(editor.option('dropDownOptions.dragEnabled'), false);
            });
        });
    });
});
