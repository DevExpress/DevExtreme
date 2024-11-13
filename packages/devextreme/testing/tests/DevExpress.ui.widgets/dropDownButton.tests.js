import { getHeight, getOuterHeight, getOuterWidth, getWidth } from 'core/utils/size';
import $ from 'jquery';
import DropDownButton from 'ui/drop_down_button';
import typeUtils, { isRenderer } from 'core/utils/type';
import config from 'core/config';
import eventsEngine from 'common/core/events/core/events_engine';
import keyboardMock from '../../helpers/keyboardMock.js';
import ArrayStore from 'common/data/array_store';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import { extend } from 'core/utils/extend';
import devices from '__internal/core/m_devices';

import 'generic_light.css!';

const DROP_DOWN_BUTTON_CONTENT = 'dx-dropdownbutton-content';
const DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS = 'dx-dropdownbutton-popup-wrapper';
const DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';
const BUTTON = 'dx-button';
const BUTTON_GROUP_WRAPPER = 'dx-buttongroup-wrapper';
const BUTTON_TEXT = 'dx-button-text';
const BUTTON_CONTENT_CLASS = 'dx-button-content';
const LIST_GROUP_HEADER_CLASS = 'dx-list-group-header';
const DROP_DOWN_BUTTON_HAS_ARROW_CLASS = 'dx-dropdownbutton-has-arrow';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const POPUP_CONTENT_CLASS = 'dx-popup-content';
const POPUP_CLASS = 'dx-popup';
const FOCUSED_CLASS = 'dx-state-focused';
const DROP_DOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const CUSTOM_CLASS = 'custom-class';
const LIST_CLASS = 'dx-list';
const LIST_ITEMS_CLASS = 'dx-list-items';

const OVERLAY_CONTENT_LABEL = 'Dropdown';

QUnit.testStart(() => {
    const markup =
        `<div id='container'>
            <div id='dropDownButton'></div>
            <div id='anotherDropDownButton'></div>
        </div>`;
    $('#qunit-fixture').html(markup);
});

const getPopup = (instance) => {
    return instance._popup;
};

const getList = (instance) => {
    return instance._list;
};

const getListKeyboard = (dropDownButton) => {
    return keyboardMock($(getList(dropDownButton).element()).find('[tabindex=0]'));
};

const getButtonGroup = (instance) => {
    return instance._buttonGroup;
};

const getActionButton = (instance) => {
    return instance.$element().find(`.${DROP_DOWN_BUTTON_ACTION_CLASS}`);
};

const getToggleButton = (instance) => {
    return instance.$element().find(`.${DROP_DOWN_BUTTON_TOGGLE_CLASS}`);
};

QUnit.module('button group integration', {}, () => {
    QUnit.test('height option should change buttonGroup wrapper height', function(assert) {
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            height: '300px'
        }).dxDropDownButton('instance');

        const buttonGroup = getButtonGroup(dropDownButton);
        const buttonGroupWrapper = buttonGroup.$element().find(`.${BUTTON_GROUP_WRAPPER}`);
        assert.strictEqual(getHeight(buttonGroupWrapper.eq(0)), 300, 'height is right');

        $('#container').css('height', '900px');
        dropDownButton.option('height', '50%');

        const newButtonGroupWrapper = buttonGroup.$element().find(`.${BUTTON_GROUP_WRAPPER}`);
        assert.strictEqual(getHeight(newButtonGroupWrapper.eq(0)), 450, 'height after option change in runtime is right');
    });

    QUnit.test('accessKey option should be passed to buttonGroup (T1089414)', function(assert) {
        const accessKey = 't';
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            accessKey
        }).dxDropDownButton('instance');

        const buttonGroup = getButtonGroup(dropDownButton);
        assert.strictEqual(buttonGroup.option('accessKey'), accessKey, 'accessKey is passed to buttonGroup');
    });

    ['normal', 'default', 'danger', 'success'].forEach((type) => {
        QUnit.test(`type '${type}' should be passed to action button of buttonGroup if splitbutton is false`, function(assert) {
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                type,
                splitButton: false
            }).dxDropDownButton('instance');

            const actionButton = getActionButton(dropDownButton).dxButton('instance');

            assert.strictEqual(actionButton.option('type'), type, `action button has ${type} type`);
        });

        QUnit.test(`type '${type}' should be passed to action and toggle buttons of buttonGroup if splitbutton is true`, function(assert) {
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                type,
                splitButton: true
            }).dxDropDownButton('instance');

            const actionButton = getActionButton(dropDownButton).dxButton('instance');
            const toggleButton = getToggleButton(dropDownButton).dxButton('instance');

            assert.strictEqual(actionButton.option('type'), type, `action button has ${type} type`);
            assert.strictEqual(toggleButton.option('type'), type, `toggle button has ${type} type`);
        });

        QUnit.test(`type '${type}' should be passed to action button of buttonGroup if splitbutton is false after change in runtime`, function(assert) {
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                splitButton: false
            }).dxDropDownButton('instance');

            dropDownButton.option('type', type);

            const actionButton = getActionButton(dropDownButton).dxButton('instance');

            assert.strictEqual(actionButton.option('type'), type, `action button has ${type} type`);
        });

        QUnit.test(`type '${type}' should be passed to action and toggle buttons of buttonGroup if splitbutton is true after change in runtime`, function(assert) {
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                splitButton: true
            }).dxDropDownButton('instance');

            dropDownButton.option('type', type);

            const actionButton = getActionButton(dropDownButton).dxButton('instance');
            const toggleButton = getToggleButton(dropDownButton).dxButton('instance');

            assert.strictEqual(actionButton.option('type'), type, `action button has ${type} type`);
            assert.strictEqual(toggleButton.option('type'), type, `toggle button has ${type} type`);
        });
    });
});

QUnit.module('popup integration', {
    beforeEach: function() {
        this.instance = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            splitButton: true,
            items: [{ text: 'Item 1' }, { text: 'Item 2' }]
        });
        this.popup = getPopup(this.instance);
    }
}, () => {
    QUnit.module('overlay content height', () => {
        QUnit.test('should be equal to content height when dropDownOptions.height in not defined', function(assert) {
            const contentHeight = 300;
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownContentTemplate: () => {
                    return $('<div>').css({ height: contentHeight });
                },
            });

            const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);
            assert.strictEqual(getHeight($popupContent), contentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to content height when dropDownOptions.height is set to auto', function(assert) {
            const contentHeight = 300;
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownContentTemplate: () => {
                    return $('<div>').css({ height: contentHeight });
                },
                dropDownOptions: {
                    height: 'auto'
                }
            });

            const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);
            assert.strictEqual(getHeight($popupContent), contentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to content height when dropDownOptions.height in not defined after editor height runtime change', function(assert) {
            const contentHeight = 300;
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownContentTemplate: () => {
                    return $('<div>').css({ height: contentHeight });
                },
            }).dxDropDownButton('instance');

            dropDownButton.option('height', 200);

            const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);
            assert.strictEqual(getHeight($popupContent), contentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to content height when dropDownOptions.height is set to auto after editor height runtime change', function(assert) {
            const contentHeight = 300;
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownContentTemplate: () => {
                    return $('<div>').css({ height: contentHeight });
                },
                dropDownOptions: {
                    height: 'auto'
                }
            }).dxDropDownButton('instance');

            dropDownButton.option('height', 200);

            const $popupContent = $(`.${POPUP_CONTENT_CLASS}`);
            assert.strictEqual(getHeight($popupContent), contentHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to dropDownOptions.height if it is defined', function(assert) {
            const dropDownOptionsHeight = 300;
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownOptions: {
                    height: dropDownOptionsHeight
                }
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual(getOuterHeight($overlayContent), dropDownOptionsHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to dropDownOptions.height if it is defined even after editor height runtime change', function(assert) {
            const dropDownOptionsHeight = 300;
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownOptions: {
                    height: dropDownOptionsHeight
                }
            }).dxDropDownButton('instance');

            dropDownButton.option('height', 200);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.strictEqual(getOuterHeight($overlayContent), dropDownOptionsHeight, 'overlay content height is correct');
        });

        QUnit.test('should be equal to wrapper height if dropDownOptions.height is set to 100%', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownOptions: {
                    height: '100%'
                }
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.strictEqual(getOuterHeight($overlayContent), getOuterHeight($overlayWrapper), 'overlay content height is correct');
        });

        QUnit.test('should be calculated relative to wrapper when dropDownOptions.height is percent', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownOptions: {
                    height: '50%'
                }
            });

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual(getOuterHeight($overlayContent), getOuterHeight($overlayWrapper) / 2, 0.1, 'overlay content height is correct');
        });

        QUnit.test('should be calculated relative to wrapper after editor height runtime change', function(assert) {
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownOptions: {
                    height: '50%'
                },
                height: 600,
            }).dxDropDownButton('instance');

            dropDownButton.option('height', 200);

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);
            assert.roughEqual(getOuterHeight($overlayContent), getOuterHeight($overlayWrapper) / 2, 0.1, 'overlay content height is correct');
        });

        QUnit.test('should be calculated relative to dropDownOptions.position.of if it is specified', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownOptions: {
                    height: '50%',
                    position: { of: window }
                },
                height: 600,
            }).dxDropDownButton('instance');

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.roughEqual(getOuterHeight($overlayContent), getOuterHeight(window) / 2, 0.1, 'overlay content height is correct');
        });

        QUnit.test('should be calculated relative to dropDownOptions.container if it is specified', function(assert) {
            const $container = $('<div>')
                .css({ height: 500 })
                .appendTo('#qunit-fixture');

            $('#dropDownButton').dxDropDownButton({
                opened: true,
                dropDownOptions: {
                    height: '50%',
                    position: { of: window },
                    container: $container
                },
                height: 600,
            }).dxDropDownButton('instance');

            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
            assert.roughEqual(getOuterHeight($overlayContent), getOuterHeight($container) / 2, 0.1, 'overlay content height is correct');
        });
    });

    QUnit.test('dropDownOptions.height should be passed to popup', function(assert) {
        const dropDownOptionsHeight = 500;
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            dropDownOptions: {
                height: dropDownOptionsHeight
            },
            opened: true
        });

        const popup = $dropDownButton.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('height'), dropDownOptionsHeight, 'popup height option value is correct');
    });

    QUnit.test('popup should have height equal to dropDownOptions.height even after editor input height change', function(assert) {
        const dropDownOptionsHeight = 500;
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            dropDownOptions: {
                height: dropDownOptionsHeight
            },
            opened: true
        });
        const dropDownButton = $dropDownButton.dxDropDownButton('instance');

        dropDownButton.option('height', 300);

        const popup = $dropDownButton.find(`.${POPUP_CLASS}`).dxPopup('instance');
        assert.strictEqual(popup.option('height'), dropDownOptionsHeight, 'popup height option value is correct');
    });

    QUnit.module('overlay content width', () => {
        QUnit.test('should be equal to editor width if dropDownOptions.width is not defined and content width is smaller than editor width', function(assert) {
            const $container = $('<div>')
                .css({ width: 150 })
                .appendTo('#qunit-fixture');

            const $dropDownButton = $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 500,
                dropDownOptions: {
                    container: $container
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));

            assert.strictEqual(overlayContentWidth, getOuterWidth($dropDownButton), 'width is correct on init');
            assert.strictEqual(overlayContentWidth, 500, 'width is correct on init');
        });

        QUnit.test('should be equal to editor width if dropDownOptions.width is not defined and content width is bigger than editor width', function(assert) {
            const $container = $('<div>')
                .css({ width: 150 })
                .appendTo('#qunit-fixture');

            const $dropDownButton = $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 100,
                dropDownOptions: {
                    container: $container
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));

            assert.strictEqual(overlayContentWidth, getOuterWidth($dropDownButton), 'width is correct on init');
            assert.strictEqual(overlayContentWidth, 100, 'width is correct on init');
        });

        QUnit.test('should be equal to editor width if dropDownOptions.width is not defined after editor width runtime change', function(assert) {
            const $dropDownButton = $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 500
            });

            const instance = $dropDownButton.dxDropDownButton('instance');
            const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);

            instance.option('width', 700);
            assert.strictEqual(getOuterWidth($overlayContent), getOuterWidth($dropDownButton), 'width are equal after option change');
            assert.strictEqual(getOuterWidth($overlayContent), 700, 'width is correct after option change');
        });

        QUnit.test('should be equal to content width if dropDownOptions.width is "auto" and content width is bigger than editor width', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 100,
                dropDownContentTemplate: () => {
                    return $('<div>').css({ width: 300 });
                },
                dropDownOptions: {
                    width: 'auto'
                }
            });

            const popupContentWidth = getWidth($(`.${POPUP_CONTENT_CLASS}`));

            assert.strictEqual(popupContentWidth, 300, 'width is correct');
        });

        QUnit.test('should be equal to content width if dropDownOptions.width is "auto" and content width is smaller than editor width', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 300,
                dropDownContentTemplate: () => {
                    return $('<div>').css({ width: 100 });
                },
                dropDownOptions: {
                    width: 'auto'
                }
            });

            const popupContentWidth = getWidth($(`.${POPUP_CONTENT_CLASS}`));

            assert.strictEqual(popupContentWidth, 100, 'width is correct');
        });

        QUnit.test('should be equal to wrapper width if dropDownOptions.width is "100%" and content width is smaller than editor width', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 300,
                dropDownContentTemplate: () => {
                    return $('<div>').css({ width: 100 });
                },
                dropDownOptions: {
                    width: '100%'
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));
            const overlayWrapperWidth = getOuterWidth($(`.${OVERLAY_WRAPPER_CLASS}`));

            assert.strictEqual(overlayContentWidth, 300, 'width is correct');
            assert.strictEqual(overlayContentWidth, overlayWrapperWidth, 'width is correct');
        });

        QUnit.test('should be equal to wrapper width if dropDownOptions.width is "100%" and content width is bigger than editor width', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 100,
                dropDownContentTemplate: () => {
                    return $('<div>').css({ width: 300 });
                },
                dropDownOptions: {
                    width: '100%'
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));
            const overlayWrapperWidth = getOuterWidth($(`.${OVERLAY_WRAPPER_CLASS}`));

            assert.strictEqual(overlayContentWidth, 100, 'width is correct');
            assert.strictEqual(overlayContentWidth, overlayWrapperWidth, 'width is correct');
        });

        QUnit.test('should be equal to wrapper width if dropDownOptions.width is "100%" and visualContainer is defined', function(assert) {
            const $container = $('<div>')
                .css({ width: 150 })
                .appendTo('#qunit-fixture');

            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 100,
                dropDownOptions: {
                    width: '100%',
                    visualContainer: $container
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));
            const overlayWrapperWidth = getOuterWidth($(`.${OVERLAY_WRAPPER_CLASS}`));

            assert.strictEqual(overlayContentWidth, getOuterWidth($container), 'width is correct');
            assert.strictEqual(overlayContentWidth, overlayWrapperWidth, 'width is correct');
        });

        QUnit.test('should be equal to dropDownOptions.width if dropDownOptions.width is bigger than editor width', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 100,
                dropDownOptions: {
                    width: 200
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));

            assert.strictEqual(overlayContentWidth, 200, 'width is correct');
        });

        QUnit.test('should be equal to dropDownOptions.width if dropDownOptions.width is smaller than editor width', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 200,
                dropDownOptions: {
                    width: 100
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));

            assert.strictEqual(overlayContentWidth, 100, 'width is correct');
        });

        QUnit.test('should be calculated relative to wrapper width when dropDownOptions.width is pecrentage and smaller than 100', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 300,
                dropDownOptions: {
                    width: '50%'
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));
            const overlayWrapperWidth = getOuterWidth($(`.${OVERLAY_WRAPPER_CLASS}`));

            assert.roughEqual(overlayContentWidth, overlayWrapperWidth / 2, 0.1, 'width is correct');
            assert.roughEqual(overlayContentWidth, 150, 0.1, 'width is correct');
        });

        QUnit.test('should be calculated relative to wrapper width when dropDownOptions.width is pecrentage and bigger than 100', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 300,
                dropDownOptions: {
                    width: '150%'
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));
            const overlayWrapperWidth = getOuterWidth($(`.${OVERLAY_WRAPPER_CLASS}`));

            assert.roughEqual(overlayContentWidth, overlayWrapperWidth * 1.5, 0.1, 'width is correct');
            assert.roughEqual(overlayContentWidth, 450, 0.1, 'width is correct');
        });

        QUnit.test('should be calculated relative to wrapper width when visualContainer is defined', function(assert) {
            const $container = $('<div>')
                .css({ width: 500 })
                .appendTo('#qunit-fixture');

            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 300,
                dropDownOptions: {
                    width: '150%',
                    visualContainer: $container
                }
            });

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));
            const overlayWrapperWidth = getOuterWidth($(`.${OVERLAY_WRAPPER_CLASS}`));

            assert.roughEqual(overlayContentWidth, overlayWrapperWidth * 1.5, 0.1, 'width is correct');
            assert.roughEqual(overlayContentWidth, 750, 0.1, 'width is correct');
        });

        QUnit.test('should be calculated relative to wrapper width after wrapper width runtime change', function(assert) {
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 300,
                dropDownOptions: {
                    width: '150%'
                }
            }).dxDropDownButton('instance');

            dropDownButton.option('width', 500);

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));
            const overlayWrapperWidth = getOuterWidth($(`.${OVERLAY_WRAPPER_CLASS}`));

            assert.roughEqual(overlayContentWidth, overlayWrapperWidth * 1.5, 0.1, 'width is correct');
            assert.roughEqual(overlayContentWidth, 750, 0.1, 'width is correct');
        });

        QUnit.test('should be calculated relative to dropDownOptions.position.of if it is specified', function(assert) {
            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 300,
                dropDownOptions: {
                    width: '50%',
                    position: { of: window }
                }
            }).dxDropDownButton('instance');

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));

            assert.roughEqual(overlayContentWidth, getOuterWidth(window) / 2, 0.1, 'width is correct');
        });

        QUnit.test('should be calculated relative to dropDownOptions.container if it is specified', function(assert) {
            const $container = $('<div>')
                .css({ width: 500 })
                .appendTo('#qunit-fixture');

            $('#dropDownButton').dxDropDownButton({
                opened: true,
                width: 300,
                dropDownOptions: {
                    width: '50%',
                    position: { of: window },
                    container: $container
                }
            }).dxDropDownButton('instance');

            const overlayContentWidth = getOuterWidth($(`.${OVERLAY_CONTENT_CLASS}`));

            assert.roughEqual(overlayContentWidth, getOuterWidth($container) / 2, 0.1, 'width is correct');
        });
    });

    QUnit.test('toggle button should toggle the widget', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), { splitButton: true });
        const $toggleButton = getToggleButton(instance);

        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.strictEqual(instance.option('dropDownOptions.visible'), true, 'the widget is opened');

        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.strictEqual(instance.option('dropDownOptions.visible'), false, 'the widget is closed');
    });

    QUnit.test('list should be rendered on init when deferRendering is false', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), { deferRendering: false });

        assert.strictEqual(getList(dropDownButton).NAME, 'dxList', 'list has been rendered');
    });

    QUnit.test('popup should have special classes', function(assert) {
        assert.ok($(this.popup.$content()).hasClass(DROP_DOWN_BUTTON_CONTENT), 'popup has a special class');
        assert.ok($(this.popup.$wrapper()).hasClass(DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS), 'popup wrapper has a special class');
    });

    QUnit.test('popup content should have special class when custom template is used', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            dropDownContentTemplate: () => {
                return 'Custom Content';
            }
        });

        const $popupContent = getPopup(instance).$content();
        assert.ok($popupContent.hasClass(DROP_DOWN_BUTTON_CONTENT), 'popup has special class');
    });

    QUnit.test('popup should be positioned correctly if rtlEnabled is true', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            opened: true,
            dropDownOptions: {
                width: 200,
                'position.collision': 'none'
            },
        });

        const instance = $dropDownButton.dxDropDownButton('instance');
        const dropDownButtonElementRect = $dropDownButton.get(0).getBoundingClientRect();
        const popupContentElementRect = getPopup(instance).$overlayContent().get(0).getBoundingClientRect();

        assert.strictEqual(popupContentElementRect.left, dropDownButtonElementRect.left, 'popup position is correct, rtlEnabled = false');
    });

    QUnit.test('popup width should change if content is truncated', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            icon: 'square',
            opened: true,
            dropDownContentTemplate: function(data, $container) {
                $('<div>')
                    .addClass('custom-color-picker')
                    .css({
                        width: 82,
                        padding: 5
                    })
                    .appendTo($container);
            },
            dropDownOptions: {
                width: 'auto'
            }
        });

        const instance = $dropDownButton.dxDropDownButton('instance');
        const $popupContent = getPopup(instance).$content();

        assert.equal(getOuterWidth($popupContent), 84, 'width is right');
    });

    QUnit.test('popup width should be recalculated when button dimension changed', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            opened: true
        });
        const repaintMock = sinon.spy(getPopup(instance), 'repaint');

        instance.option({
            icon: 'box',
            text: 'Test',
            showArrowIcon: false
        });

        assert.strictEqual(repaintMock.callCount, 3, 'popup has been repainted 3 times');
    });

    QUnit.test('popup should be repositioned after height option runtime change', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), {
            opened: true,
            dropDownOptions: {
                'position.collision': 'none'
            },
        });

        instance.option('height', 300);

        const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
        const overlayContentRect = $overlayContent.get(0).getBoundingClientRect();
        const dropDownButtonRect = $('#dropDownButton').get(0).getBoundingClientRect();

        assert.roughEqual(overlayContentRect.top, dropDownButtonRect.bottom, 1.01, 'top position is correct');
        assert.roughEqual(overlayContentRect.left, dropDownButtonRect.left, 1.01, 'left position is correct');
    });

    QUnit.test('click on toggle button should not be outside', function(assert) {
        const $toggleButton = getToggleButton(this.instance);
        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.ok(this.instance.option('dropDownOptions.visible'), 'popup is visible');

        eventsEngine.trigger($toggleButton, 'dxpointerdown');
        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.notOk(this.instance.option('dropDownOptions.visible'), 'popup is hidden');
    });

    QUnit.test('click on other toggle button should be outside', function(assert) {
        const otherButton = new DropDownButton($('#anotherDropDownButton'), {
            text: 'Text',
            icon: 'box',
            splitButton: true
        });

        let $toggleButton = getToggleButton(this.instance);
        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.ok(this.instance.option('dropDownOptions.visible'), 'popup is visible');

        $toggleButton = getToggleButton(otherButton);
        eventsEngine.trigger($toggleButton, 'dxpointerdown');
        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.notOk(this.instance.option('dropDownOptions.visible'), 'popup is hidden');
    });

    QUnit.module('ios tests', {
        beforeEach: function() {
            this._savedDevice = devices.current();
            devices.current({ platform: 'ios' });

            const getWrapperClasses = (element) => {
                return Array.from(element._popup.$wrapper()[0].classList);
            };

            this.hasClass = (element, className) => {
                return getWrapperClasses(element).includes(className);
            };
        },
        afterEach: function() {
            devices.current(this._savedDevice);
        },
    }, () => {
        QUnit.test('DropDownButton popup wrapper has overlay and custom classes if the "wrapperAttr.class" property is added to "dropDownOptions" on init on iOS', function(assert) {
            const $dropDownButton = $('#dropDownButton').dxDropDownButton({
                dropDownOptions: {
                    wrapperAttr: {
                        class: CUSTOM_CLASS,
                    },
                },
            });
            const dropDownButton = $dropDownButton.dxDropDownButton('instance');

            dropDownButton.open();

            assert.strictEqual(this.hasClass(dropDownButton, DROP_DOWN_EDITOR_OVERLAY_CLASS), true, 'popup wrapper has overlay class');
            assert.strictEqual(this.hasClass(dropDownButton, CUSTOM_CLASS), true, 'popup wrapper has custom class');
        });
    });
});

QUnit.module('list integration', {}, () => {
    QUnit.test('hoverStateEnabled should be transfered to the list', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), { hoverStateEnabled: false, deferRendering: false });
        const list = getList(instance);

        assert.strictEqual(list.option('hoverStateEnabled'), false, 'List has correct option');

        instance.option('hoverStateEnabled', true);

        assert.strictEqual(list.option('hoverStateEnabled'), true, 'List has changed option');
    });

    QUnit.test('it should be possible to render the widget list item without a text', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            items: [{ icon: 'box' }, { icon: 'user' }],
            keyExpr: 'icon',
            displayExpr: '',
            selectedItemKey: 'user'
        });

        const $listItemText = getList(dropDownButton).itemElements().eq(0).text();

        assert.strictEqual($listItemText, '', 'item text is empty');
    });

    QUnit.test('default list item template should correctly render item text', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ text: 'Item 1' }],
            deferRendering: false
        });
        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), 'Item 1', 'displayExpr works');
    });

    QUnit.test('list should be displayed correctly without data expressions', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: ['Item 1'],
            deferRendering: false
        });
        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), 'Item 1', 'displayExpr works');
        assert.strictEqual(list.option('keyExpr'), 'this', 'keyExpr is \'this\'');
    });

    QUnit.test('data expressions should work with dropDownButton', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            keyExpr: 'key',
            displayExpr: 'name',
            deferRendering: false
        });

        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), 'Item 1', 'displayExpr works');
        assert.strictEqual(list.option('keyExpr'), 'key', 'keyExpr works');
        assert.strictEqual($listItem.find('.dx-icon-box').length, 1, 'item icon works');
    });

    QUnit.test('some options should be transfered to the list', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false,
            grouped: true,
            noDataText: 'No data',
            useSelectMode: false
        });

        const list = getList(dropDownButton);

        assert.strictEqual(list.option('grouped'), true, 'grouped option transfered');
        assert.strictEqual(list.option('noDataText'), 'No data', 'noDataText option transfered');
        assert.strictEqual(list.option('selectionMode'), 'none', 'selectionMode is none for useSelectMode: false');
    });

    QUnit.test('text property value should be rendered as the button text after useSelectMode changed to false', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ id: 1, name: 'Item 1' }],
            deferRendering: false,
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'name',
            selectedItemKey: 1,
            text: 'initial text'
        });
        const $element = dropDownButton.$element();

        let $text = $element.find(`.${BUTTON_TEXT}`);
        assert.strictEqual($text.text(), 'Item 1', 'selected item text is rendered as the button text');

        dropDownButton.option({
            text: 'new text',
            useSelectMode: false
        });

        $text = $element.find(`.${BUTTON_TEXT}`);
        assert.strictEqual($text.text(), 'new text', 'text property value is rendered as the button text');
    });

    QUnit.test('selected item text should be rendered as the button text after useSelectMode changed to true (T1049361)', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
            deferRendering: false,
            useSelectMode: false,
            keyExpr: 'id',
            displayExpr: 'name',
            selectedItemKey: 1,
            text: 'initial text'
        });
        const $element = dropDownButton.$element();

        let $text = $element.find(`.${BUTTON_TEXT}`);
        assert.strictEqual($text.text(), 'initial text', 'text property value is rendered as the button text');

        dropDownButton.option({
            selectedItemKey: 2,
            useSelectMode: true
        });

        $text = $element.find(`.${BUTTON_TEXT}`);
        assert.strictEqual($text.text(), 'Item 2', 'selected item text is rendered as the button text');
    });

    QUnit.test('groupTemplate should be transfered to list', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false,
            grouped: true,
            groupTemplate: (data) => {
                return $('<div>').text(`${data.key}: ${data.name}`);
            }
        });
        const $element = dropDownButton.$element();

        let groupHeaders = $element.find(`.${LIST_GROUP_HEADER_CLASS}`);
        assert.equal(groupHeaders.eq(0).text(), '1: Item 1', 'groupTemplate is transfered to list on init');

        dropDownButton.option('groupTemplate', (data) => {
            return $('<div>').text(`Group #${data.key}`);
        });

        groupHeaders = $element.find(`.${LIST_GROUP_HEADER_CLASS}`);
        assert.equal(groupHeaders.eq(0).text(), 'Group #1', 'groupTemplate is transfered to list after option change');
    });

    QUnit.test('list should have single selection mode if useSelectMode: true', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false,
            useSelectMode: true
        });
        const list = getList(dropDownButton);

        assert.strictEqual(list.option('selectionMode'), 'single', 'selectionMode is single for useSelectMode: true');
    });

    QUnit.test('useItemTextAsTitle should be true for the list', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false
        });

        const list = getList(dropDownButton);

        assert.strictEqual(list.option('useItemTextAsTitle'), true, 'option is true');
    });

    QUnit.test('wrapItemText option', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: ['Text'],
            deferRendering: false,
            wrapItemText: true
        });

        const list = getList(dropDownButton);
        const $itemContainer = list._getItemsContainer();

        assert.ok($itemContainer.hasClass('dx-wrap-item-text'), 'class was added');
    });

    [true, false].forEach(useItemTextAsTitle => {
        QUnit.test(`useItemTextAsTitle=${useItemTextAsTitle} option should be passed to list on init`, function(assert) {
            const dropDownButton = new DropDownButton($('#dropDownButton'), {
                deferRendering: false,
                useItemTextAsTitle
            });
            const list = getList(dropDownButton);

            assert.strictEqual(list.option('useItemTextAsTitle'), useItemTextAsTitle, 'list option initial value is correct');
        });

        QUnit.test(`useItemTextAsTitle option runtime change to ${useItemTextAsTitle} should be passed to list`, function(assert) {
            const dropDownButton = new DropDownButton($('#dropDownButton'), {
                deferRendering: false,
                useItemTextAsTitle: !useItemTextAsTitle
            });
            const list = getList(dropDownButton);

            dropDownButton.option('useItemTextAsTitle', useItemTextAsTitle);
            assert.strictEqual(list.option('useItemTextAsTitle'), useItemTextAsTitle, 'list option value is correct after runtime change');
        });
    });

    [true, false].forEach(wrapItemText => {
        QUnit.test('wrapItemText option should be synchronized with dxList wrapItemText option (T846124)', function(assert) {
            const dropDownButton = new DropDownButton($('#dropDownButton'), {
                deferRendering: false,
                wrapItemText
            });

            const list = getList(dropDownButton);
            assert.strictEqual(list.option('wrapItemText'), dropDownButton.option('wrapItemText'), `list option is correct when dropDownButton wrapItemText is ${wrapItemText} on init`);

            dropDownButton.option('wrapItemText', !wrapItemText);
            assert.strictEqual(list.option('wrapItemText'), dropDownButton.option('wrapItemText'), 'list option is correct after dropDownButton wrapItemText option value change');
        });
    });

    [true, false].forEach(wrapItemText => {
        QUnit.test(`toggleButton should render inside of dropDownButton when width option is defined in generic themes when wrapItemText=${wrapItemText} (T847072)`, function(assert) {
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                items: [{
                    'id': 1,
                    'name': 'VeryVeryVeryVeryLongString',
                    'icon': 'alignright'
                }],
                displayExpr: 'name',
                keyExpr: 'id',
                stylingMode: 'text',
                useSelectMode: true,
                width: 120,
                splitButton: true,
                selectedItemKey: 1,
                wrapItemText
            }).dxDropDownButton('instance');

            const dropDownButtonElement = dropDownButton.$element().get(0);
            const toggleButtonElement = getToggleButton(dropDownButton).get(0);

            const dropDownButtonRightPosition = dropDownButtonElement.getBoundingClientRect(0).right;
            const toggleButtonRightPosition = toggleButtonElement.getBoundingClientRect(0).right;

            assert.strictEqual(dropDownButtonRightPosition, toggleButtonRightPosition, 'toggleButton position is correct');
        });
    });

    QUnit.test('dropDownButton content should be centered vertically (T847072)', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            items: [{
                'id': 1,
                'name': 'VeryVeryVeryVeryLongString',
                'icon': 'alignright'
            }],
            displayExpr: 'name',
            keyExpr: 'id',
            useSelectMode: true,
            width: 100,
            height: 100,
            splitButton: true,
            selectedItemKey: 1
        });

        const $buttonText = $dropDownButton.find(`.${BUTTON_TEXT}`);
        const dropDownButtonRect = $dropDownButton.get(0).getBoundingClientRect();
        const buttonTextRect = $buttonText.get(0).getBoundingClientRect();

        const dropDownButtonVerticalCenter = (dropDownButtonRect.top + dropDownButtonRect.bottom) / 2;
        const buttonTextVerticalCenter = (buttonTextRect.top + buttonTextRect.bottom) / 2;

        assert.roughEqual(buttonTextVerticalCenter, dropDownButtonVerticalCenter, 2, 'content is vertically centered');
    });

    QUnit.test('toggle/action buttons should have correct height when height option is not defined (T847072)', function(assert) {
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            items: [{
                'id': 1,
                'name': 'I',
                'icon': 'alignright'
            }],
            displayExpr: 'name',
            keyExpr: 'id',
            useSelectMode: true,
            width: 100,
            splitButton: true,
            selectedItemKey: 1
        }).dxDropDownButton('instance');

        const toggleButtonElement = getToggleButton(dropDownButton);
        const actionButtonElement = getActionButton(dropDownButton);

        assert.strictEqual(getOuterHeight(toggleButtonElement), 36, 'toggleButton has correct height in generic theme');
        assert.strictEqual(getOuterHeight(actionButtonElement), 36, 'actionButton has correct height in generic theme');
    });

    QUnit.test('list selection should depend on selectedItemKey option', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1' }, { key: 2, name: 'Item 2' }],
            deferRendering: false,
            keyExpr: 'key',
            displayExpr: 'name',
            selectedItemKey: 2,
            useSelectMode: true
        });

        const list = getList(dropDownButton);
        assert.deepEqual(list.option('selectedItemKeys'), [2], 'selection is correct');

        dropDownButton.option('selectedItemKey', 1);
        assert.deepEqual(list.option('selectedItemKeys'), [1], 'selection is correct');
    });

    QUnit.test('list selection should by defined depend on useSelectMode option (T838962)', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1' }, { key: 2, name: 'Item 2' }],
            deferRendering: false,
            keyExpr: 'key',
            displayExpr: 'name',
            selectedItemKey: 1,
            useSelectMode: false
        });
        const list = getList(dropDownButton);

        assert.deepEqual(list.option('selectedItemKeys'), [], 'selection is correct');

        dropDownButton.option('useSelectMode', true);
        assert.deepEqual(list.option('selectedItemKeys'), [1], 'selection is correct');

        dropDownButton.option('useSelectMode', false);
        assert.deepEqual(list.option('selectedItemKeys'), [], 'selection is correct');
    });

    QUnit.test('selection by click, key has been provided by dataSource', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ key: 1, name: 'Item 1' }, { key: 2, name: 'Item 2' }],
                    key: 'key'
                }
            },
            deferRendering: false,
            displayExpr: 'name',
            selectedItemKey: 2,
            useSelectMode: true
        });

        const list = getList(dropDownButton);
        assert.deepEqual(list.option('selectedItemKeys'), [2], 'selection is correct');

        dropDownButton.open();
        eventsEngine.trigger(list.itemElements().eq(0), 'dxclick');
        assert.deepEqual(dropDownButton.option('selectedItemKey'), 1, 'dropDownButton selected item key is correct');
        assert.deepEqual(list.option('selectedItemKeys'), [1], 'list selected item key is correct');
    });

    QUnit.test('selection by click, key has been provided by widget', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1' }, { key: 2, name: 'Item 2' }],
            deferRendering: false,
            keyExpr: 'key',
            displayExpr: 'name',
            selectedItemKey: 2,
            useSelectMode: true
        });

        const list = getList(dropDownButton);
        assert.deepEqual(list.option('selectedItemKeys'), [2], 'selection is correct');

        dropDownButton.open();
        eventsEngine.trigger(list.itemElements().eq(0), 'dxclick');
        assert.deepEqual(dropDownButton.option('selectedItemKey'), 1, 'dropDownButton selected item key is correct');
        assert.deepEqual(list.option('selectedItemKeys'), [1], 'list selected item key is correct');
    });

    QUnit.test('selected item with zero-equal key should be selected in the built-in List', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            items: [{ id: 0, text: 'text1' }, { id: 1, text: 'text2' }],
            keyExpr: 'id',
            displayExpr: 'text',
            useSelectMode: true,
            selectedItemKey: 0
        });
        const list = getList(instance);

        assert.deepEqual(list.option('selectedItemKeys'), [0], 'List has correct selection');
    });

    QUnit.test('selected item with zero-equal key should be selected in the built-in List when select mode turning on', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            items: [{ id: 0, text: 'text1' }, { id: 1, text: 'text2' }],
            keyExpr: 'id',
            displayExpr: 'text',
            useSelectMode: false,
            selectedItemKey: 0
        });
        const list = getList(instance);
        instance.option('useSelectMode', true);

        assert.deepEqual(list.option('selectedItemKeys'), [0], 'List has correct selection');
    });
});

QUnit.module('common use cases', {
    beforeEach: function() {
        this.itemClickHandler = sinon.spy();
        this.dropDownButton = new DropDownButton($('#dropDownButton'), {
            useSelectMode: false,
            deferRendering: false,
            keyExpr: 'id',
            displayExpr: 'name',
            onItemClick: this.itemClickHandler,
            items: [
                { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' },
                { id: 2, file: 'all.exe', name: 'Trial for all platforms', icon: 'user' }
            ],
            text: 'Download DevExtreme Trial',
            icon: 'group'
        });
        this.list = getList(this.dropDownButton);
        this.listItems = this.list.itemElements();
    }
}, () => {
    QUnit.test('dataSource store should have correct key', function(assert) {
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            items: [{
                'id': 1,
                'name': 'I'
            }],
            keyExpr: 'id'
        }).dxDropDownButton('instance');

        let store = dropDownButton.getDataSource().store();
        assert.strictEqual(store.key(), 'id', 'store key is correct');

        dropDownButton.option('keyExpr', 'this');
        store = dropDownButton.getDataSource().store();
        assert.strictEqual(store.key(), 'this', 'store key is correct');
    });

    QUnit.test('toggleButton should have static width (T847072)', function(assert) {
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            items: [{
                'id': 1,
                'name': 'I',
                'icon': 'alignright'
            }],
            displayExpr: 'name',
            keyExpr: 'id',
            useSelectMode: true,
            width: 100,
            splitButton: true,
            selectedItemKey: 1
        }).dxDropDownButton('instance');

        const toggleButtonElement = getToggleButton(dropDownButton);

        assert.strictEqual(getWidth(toggleButtonElement), 18, 'toggleButton has correct width in generic theme');
    });

    QUnit.test('it should be possible to set non-datasource action button', function(assert) {
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Download DevExtreme Trial', 'initial text is correct');

        eventsEngine.trigger(this.listItems.eq(0), 'dxclick');

        assert.strictEqual(this.itemClickHandler.callCount, 1, 'item clicked');
        assert.strictEqual(this.itemClickHandler.getCall(0).args[0].itemData.id, 1, 'vs.exe clicked');
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Download DevExtreme Trial', 'initial text was not changed');
        assert.notOk(getPopup(this.dropDownButton).option('visible'), 'popup is hidden');
    });

    QUnit.test('custom item should be redefined after selection if useSelectMode is true', function(assert) {
        this.dropDownButton.option({
            useSelectMode: true,
            opened: true
        });
        eventsEngine.trigger(this.list.itemElements().eq(0), 'dxclick');
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Trial for Visual Studio', 'action button has been changed');
    });

    QUnit.test('Widget should work correct if new selected item has key is 0', function(assert) {
        this.dropDownButton.option({
            items: [{ id: 0, name: 'Test 0' }, { id: 1, name: 'Test 1' }],
            selectedItemKey: 1,
            useSelectMode: true,
            opened: true
        });

        eventsEngine.trigger(this.list.itemElements().eq(0), 'dxclick');
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Test 0', 'action button text is correct');
    });

    QUnit.test('custom item should be redefined after selection if useSelectMode is changed to true at runtime', function(assert) {
        this.dropDownButton.option({
            useSelectMode: false,
            opened: true
        });

        eventsEngine.trigger(this.list.itemElements().eq(1), 'dxclick');
        assert.strictEqual(this.list.option('selectedItem'), undefined, 'list selectedItem is undefined after item click');

        this.dropDownButton.option({
            useSelectMode: true,
            opened: true
        });

        eventsEngine.trigger(this.list.itemElements().eq(0), 'dxclick');

        assert.deepEqual(this.dropDownButton.option('selectedItem'), { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' }, 'selectedItem is defined after item click');
        assert.deepEqual(this.list.option('selectedItem'), { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' }, 'list selectedITem is defined after item click');
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Trial for Visual Studio', 'action button has been changed');

        this.dropDownButton.option('useSelectMode', false);
        assert.deepEqual(this.dropDownButton.option('selectedItem'), undefined, 'selectedITem is undefined if useSelectMode is changed to false');
    });

    QUnit.test('prevent default behavior for the itemClick action', function(assert) {
        const clickHandler = sinon.stub().returns(false);
        this.dropDownButton.option('onItemClick', clickHandler);

        this.dropDownButton.toggle(true);
        eventsEngine.trigger(this.listItems.eq(0), 'dxclick');
        assert.strictEqual(clickHandler.callCount, 1, 'clickHandler called');
        assert.ok(getPopup(this.dropDownButton).option('visible'), 'default behavior has been prevented');
    });

    QUnit.test('the user can hide the toggle button', function(assert) {
        this.dropDownButton.option('splitButton', false);
        assert.strictEqual(getToggleButton(this.dropDownButton).length, 0, 'there is no toggle button');

        eventsEngine.trigger(getActionButton(this.dropDownButton), 'dxclick');
        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'action button opens the dropdown');

        this.dropDownButton.close();
        this.dropDownButton.option('splitButton', true);
        assert.strictEqual(getToggleButton(this.dropDownButton).length, 1, 'the toggle button is visible');

        eventsEngine.trigger(getActionButton(this.dropDownButton), 'dxclick');
        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'action button doesn\'t open the dropdown');
    });

    QUnit.test('click on item should raise onSelectionChanged (T848284)', function(assert) {
        const selectionChangeHandler = sinon.spy();

        this.dropDownButton.option({
            items: [{
                id: 1, name: 'a'
            }, {
                id: 2, name: 'b'
            }],
            useSelectMode: true,
            onSelectionChanged: selectionChangeHandler
        });

        const firstListItems = getList(this.dropDownButton).itemElements();
        eventsEngine.trigger(firstListItems[1], 'dxclick');

        this.dropDownButton.option('items', [{ id: 1, name: 'test' }]);
        this.dropDownButton.option('selectedItemKey', 1);

        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'test', 'actionButton text is correct');
        assert.strictEqual(selectionChangeHandler.callCount, 2, 'onSelectionChange is raised');
    });

    QUnit.test('selectedItem should be kept after items option change when new dataSource includes selectedItemKey (T919804)', function(assert) {
        const done = assert.async();
        this.dropDownButton.option({
            items: [{
                id: 1, name: 'a'
            }, {
                id: 2, name: 'b'
            }],
            useSelectMode: true,
            selectedItemKey: 1
        });

        const items = [{ id: 1, name: 'test' }];
        this.dropDownButton.option('items', items);

        setTimeout(() => {
            assert.strictEqual(this.dropDownButton.option('selectedItemKey'), 1, 'selectedItemKey is kept');
            assert.deepEqual(this.dropDownButton.option('selectedItem'), items[0], 'selectedItem is correct');

            const list = getList(this.dropDownButton);
            assert.deepEqual(list.option('selectedItemKeys'), [1], 'list selectedItemKey is kept');
            assert.deepEqual(list.option('selectedItem'), items[0], 'list selectedItem is correct');

            done();
        });
    });

    QUnit.test('selectedItem should be kept after dataSource option change when new dataSource-array includes selectedItemKey (T919804)', function(assert) {
        const done = assert.async();
        this.dropDownButton.option({
            dataSource: [{
                id: 1, name: 'a'
            }, {
                id: 2, name: 'b'
            }],
            useSelectMode: true,
            selectedItemKey: 1
        });

        const items = [{ id: 1, name: 'test' }];
        this.dropDownButton.option('dataSource', items);

        setTimeout(() => {
            assert.strictEqual(this.dropDownButton.option('selectedItemKey'), 1, 'selectedItemKey is kept');
            assert.deepEqual(this.dropDownButton.option('selectedItem'), items[0], 'selectedItem is correct');

            const list = getList(this.dropDownButton);
            assert.deepEqual(list.option('selectedItemKeys'), [1], 'list selectedItemKey is kept');
            assert.deepEqual(list.option('selectedItem'), items[0], 'list selectedItem is correct');

            done();
        });
    });

    QUnit.test('keyGetter should be updated after keyExpr option change', function(assert) {
        this.dropDownButton.option({
            dataSource: [{
                key: 1, name: 'a'
            }, {
                key: 2, name: 'b'
            }],
            keyExpr: 'key',
            useSelectMode: true,
            selectedItemKey: 1
        });

        assert.strictEqual(this.dropDownButton._dataController.key(), 'key', '_keyGetter was updated');
    });

    QUnit.test('keyGetter should be updated after dataSource option change', function(assert) {
        this.dropDownButton.option({
            keyExpr: 'this',
            dataSource: new DataSource({
                store: new ArrayStore({
                    data: [{
                        key: 1, name: 'a'
                    }, {
                        key: 2, name: 'b'
                    }],
                    key: 'key'
                })
            }),
            useSelectMode: true,
            selectedItemKey: 1
        });

        assert.strictEqual(this.dropDownButton._dataController.key(), 'key', '_keyGetter was updated');
    });

    QUnit.test('list keyExpr should be updated after keyExpr option change', function(assert) {
        this.dropDownButton.option({
            keyExpr: 'newValue',
        });

        const list = getList(this.dropDownButton);
        assert.strictEqual(list.option('keyExpr'), 'newValue', 'list keyExpr was updated');
    });

    QUnit.test('list keyExpr should be updated after dataSource option change', function(assert) {
        this.dropDownButton = new DropDownButton($('#dropDownButton'), { deferRendering: false });

        this.dropDownButton.option({
            dataSource: new DataSource({
                store: new ArrayStore({
                    data: [{ key: 1, name: 'test' }],
                    key: 'newValue'
                }),
            })
        });

        const list = getList(this.dropDownButton);
        assert.strictEqual(list.option('keyExpr'), 'newValue', 'list keyExpr was updated');
    });

    QUnit.test('selectedItem should be kept after dataSource option change when new dataSource includes selectedItemKey (T919804)', function(assert) {
        this.dropDownButton = new DropDownButton($('#dropDownButton'), { deferRendering: false });
        const done = assert.async();

        const oldDataSource = new DataSource({
            store: new ArrayStore({
                data: [{
                    id: 1, name: 'a'
                }, {
                    id: 2, name: 'b'
                }],
                key: 'id'
            }),
        });

        const newDataSource = new DataSource({
            store: new ArrayStore({
                data: [{ key: 1, name: 'test' }],
                key: 'key'
            }),
        });

        this.dropDownButton.option({
            dataSource: oldDataSource,
            useSelectMode: true,
            selectedItemKey: 1,
        });

        const items = [{ key: 1, name: 'test' }];
        this.dropDownButton.option('dataSource', newDataSource);

        setTimeout(() => {
            assert.strictEqual(this.dropDownButton.option('selectedItemKey'), 1, 'selectedItemKey is kept');
            assert.deepEqual(this.dropDownButton.option('selectedItem'), items[0], 'selectedItem is correct');

            const list = getList(this.dropDownButton);
            assert.deepEqual(list.option('selectedItemKeys'), [1], 'list selectedItemKeys is kept');
            assert.deepEqual(list.option('selectedItem'), items[0], 'list selectedItem is correct');

            done();
        });
    });

    QUnit.test('selectedItem should be kept after dataSource reload when new dataSource includes selectedItemKey and keyExpr is default (T919804)', function(assert) {
        const done = assert.async();
        this.dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2],
            useSelectMode: true,
            selectedItemKey: 1,
            deferRendering: false
        });

        const items = [1, 4, 5];
        this.dropDownButton.option('items', items);

        setTimeout(() => {
            assert.strictEqual(this.dropDownButton.option('selectedItemKey'), 1, 'selectedItemKey is kept');
            assert.strictEqual(this.dropDownButton.option('selectedItem'), items[0], 'selectedItem is correct');

            const list = getList(this.dropDownButton);
            assert.deepEqual(list.option('selectedItemKeys'), [1], 'list selectedItemKey is kept');
            assert.strictEqual(list.option('selectedItem'), items[0], 'list selectedItem is correct');

            done();
        });
    });

    QUnit.test('list selectedItem should be restored after dataSource reload when new dataSource doesn\'t include selectedItemKey', function(assert) {
        const done = assert.async();
        this.dropDownButton.option({
            items: [{
                id: 1, name: 'a'
            }, {
                id: 2, name: 'b'
            }],
            useSelectMode: true,
            selectedItemKey: 1
        });
        const items = [{ id: 3, name: 'test' }];
        this.dropDownButton.option('items', items);

        setTimeout(() => {
            assert.strictEqual(this.dropDownButton.option('selectedItemKey'), null, 'selectedItemKey is correct');
            assert.strictEqual(this.dropDownButton.option('selectedItem'), null, 'selectedItem is correct');

            const list = getList(this.dropDownButton);
            assert.deepEqual(list.option('selectedItemKeys'), [], 'list selectedItemKey is kept');
            assert.strictEqual(list.option('selectedItem'), undefined, 'list selectedItem is correct');

            done();
        });
    });

    QUnit.test('click on item should raise selectionChanged - subscription by "on" method', function(assert) {
        const selectionChangeHandler = sinon.spy();
        const items = [{
            id: 1, name: 'a'
        }, {
            id: 2, name: 'b'
        }];

        this.dropDownButton.option({
            items,
            useSelectMode: true
        });

        this.dropDownButton.on('selectionChanged', selectionChangeHandler);

        const firstListItems = getList(this.dropDownButton).itemElements();
        eventsEngine.trigger(firstListItems[0], 'dxclick');

        assert.strictEqual(selectionChangeHandler.callCount, 1, 'selectionChanged is raised');
    });

    QUnit.test('click on item should change selectedItem option', function(assert) {
        const items = [{
            id: 1, name: 'a'
        }, {
            id: 2, name: 'b'
        }];

        this.dropDownButton.option({
            items,
            useSelectMode: true
        });

        const firstListItems = getList(this.dropDownButton).itemElements();
        eventsEngine.trigger(firstListItems[0], 'dxclick');

        assert.strictEqual(this.dropDownButton.option('selectedItem'), items[0], 'selectedItem is correct');
    });

    QUnit.test('widget should have specific class if it\'s is shown or hidden runtime', function(assert) {
        this.dropDownButton.option({
            showArrowIcon: false
        });

        const $dropDownButton = this.dropDownButton.$element();
        this.dropDownButton.option('showArrowIcon', true);
        assert.ok($dropDownButton.hasClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS));

        this.dropDownButton.option('showArrowIcon', false);
        assert.notOk($dropDownButton.hasClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS));

        this.dropDownButton.option('splitButton', true);
        assert.ok($dropDownButton.hasClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS));
    });
});

QUnit.module('public methods', {
    beforeEach: function() {
        this.dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: ['Item 1', 'Item 2', 'Item 3'],
            deferRendering: false
        });
    }
}, () => {
    QUnit.test('toggle method', function(assert) {
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');

        this.dropDownButton.toggle(true);
        assert.strictEqual(popup.option('visible'), true, 'popup is opened');

        this.dropDownButton.toggle(true);
        assert.strictEqual(popup.option('visible'), true, 'popup is still opened');

        this.dropDownButton.toggle(false);
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');

        this.dropDownButton.toggle();
        assert.strictEqual(popup.option('visible'), true, 'popup visibility is inverted');

        const togglePromise = this.dropDownButton.toggle();
        assert.strictEqual(popup.option('visible'), false, 'popup visibility is inverted');
        assert.ok(typeUtils.isPromise(togglePromise), 'toggle should return promise');
    });

    QUnit.test('open method', function(assert) {
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');

        const openPromise = this.dropDownButton.open();
        assert.strictEqual(popup.option('visible'), true, 'popup is opened');
        assert.ok(typeUtils.isPromise(openPromise), 'open should return promise');
    });

    QUnit.test('close method', function(assert) {
        this.dropDownButton.option('opened', true);
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option('visible'), true, 'popup is opened');

        const closePromise = this.dropDownButton.close();
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');
        assert.ok(typeUtils.isPromise(closePromise), 'close should return promise');
    });

    QUnit.test('opened option', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            opened: true
        });

        assert.ok(getPopup(dropDownButton).option('visible'), 'popup is opened');

        dropDownButton.option('opened', false);
        assert.notOk(getPopup(dropDownButton).option('visible'), 'popup is closed');
    });

    QUnit.test('optionChange should be called when popup opens manually', function(assert) {
        const optionChangedHandler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            onOptionChanged: optionChangedHandler
        });
        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, 'dxclick');
        assert.ok(getPopup(dropDownButton).option('visible'), 'popup is opened');
        assert.strictEqual(optionChangedHandler.callCount, 1, 'optionChanged was called');
        assert.strictEqual(optionChangedHandler.getCall(0).args[0].name, 'opened', 'option name is correct');
        assert.strictEqual(optionChangedHandler.getCall(0).args[0].value, true, 'option value is correct');

        eventsEngine.trigger($actionButton, 'dxclick');
        assert.notOk(getPopup(dropDownButton).option('visible'), 'popup is closed');
        assert.strictEqual(optionChangedHandler.callCount, 2, 'optionChanged was called');
        assert.strictEqual(optionChangedHandler.getCall(1).args[0].name, 'opened', 'option name is correct');
        assert.strictEqual(optionChangedHandler.getCall(1).args[0].value, false, 'option value is correct');
    });
});

QUnit.module('items changing', {
    beforeEach: function() {
        this.dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [
                { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' },
                { id: 2, file: 'all.exe', name: 'Trial for all platforms', icon: 'user' }
            ],
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'name'
        });
    }
}, () => {
    QUnit.test('showing and hiding the toggle button should not lead to datasource loading when there is no list', function(assert) {
        const loadHandler = sinon.stub().returns([{ id: 1, name: 'Item 1' }]);
        const byKeyHandler = sinon.stub().withArgs(1).returns([{ id: 1, name: 'Item 1' }]).returns([]);

        this.dropDownButton.option({
            dataSource: {
                load: loadHandler,
                byKey: byKeyHandler
            },
            deferRendering: false,
            selectedItemKey: 1
        });

        const loadCount = loadHandler.callCount;
        const byKeyCount = byKeyHandler.callCount;

        this.dropDownButton.option('splitButton', true);
        this.dropDownButton.option('splitButton', false);

        assert.strictEqual(byKeyHandler.callCount, byKeyCount, 'byKey was not called');
        assert.strictEqual(loadHandler.callCount, loadCount, 'load was not called');
    });

    QUnit.test('items changing with useSelectMode: false should not lead to datasource loading', function(assert) {
        const data = [{
            id: 1,
            name: 'Item 1'
        }, {
            id: 2,
            name: 'Item 2'
        }, {
            id: 3,
            name: 'Item 3'
        }];

        const loadHandler = sinon.stub().returns(data);
        const byKeyHandler = sinon.spy((key) => {
            return [ data[key - 1] ];
        });

        this.dropDownButton.option({
            dataSource: {
                load: loadHandler,
                byKey: byKeyHandler
            },
            useSelectMode: false,
            deferRendering: false,
            keyExpr: 'id',
            displayExpr: 'name',
            selectedItemKey: 1,
            opened: true
        });

        const loadCount = loadHandler.callCount;
        const byKeyCount = byKeyHandler.callCount;
        const $items = getList(this.dropDownButton).itemElements();

        eventsEngine.trigger($items.eq(0), 'dxclick');
        this.dropDownButton.option('opened', true);
        eventsEngine.trigger($items.eq(1), 'dxclick');
        this.dropDownButton.option('opened', true);
        eventsEngine.trigger($items.eq(2), 'dxclick');

        assert.strictEqual(byKeyHandler.callCount, byKeyCount, 'byKey was not called after items clicks');
        assert.strictEqual(loadHandler.callCount, loadCount, 'load was not called after items clicks');

        this.dropDownButton.option('selectedItemKey', 1);
        this.dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(byKeyHandler.callCount, byKeyCount, 'byKey was not called');
        assert.strictEqual(loadHandler.callCount, loadCount, 'load was not called');
    });
});

QUnit.module('deferred datasource', {
    beforeEach: function() {
        this.items = [
            { id: 1, name: 'Left', icon: 'alignleft' },
            { id: 4, name: 'Right', icon: 'alignright' },
            { id: 2, name: 'Center', icon: 'aligncenter' },
            { id: 3, name: 'Justify', icon: 'alignjustify' }
        ];
        this.clock = sinon.useFakeTimers();
        this.dataSourceConfig = {
            load: () => {
                const d = $.Deferred();
                setTimeout(() => {
                    d.resolve(this.items.slice());
                }, 500);
                return d.promise();
            },
            byKey: (key) => {
                const d = $.Deferred();
                setTimeout(() => {
                    const item = $.grep(this.items, (item) => {
                        return item.id === key;
                    });
                    d.resolve(item);
                }, 200);

                return d.promise();
            }
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('displayExpr should work with deferred datasource', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            displayExpr: 'name',
            dataSource: this.dataSourceConfig,
        });

        dropDownButton.open();
        this.clock.tick(500);

        const list = getList(dropDownButton);
        const $item = list.itemElements().eq(0);

        assert.strictEqual($item.text(), 'Left', 'text is correct');
    });

    QUnit.test('select an item via api', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'text',
            items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }]
        });
        dropDownButton.option('selectedItemKey', 2);
        this.clock.tick(10);
        assert.strictEqual(getList(dropDownButton).option('selectedItemKeys')[0], 2, 'selectedItemKeys is correct');
    });

    QUnit.test('dropDownButton should not try to load selected item after dataSource change if selectedItemKey is undefined', function(assert) {
        const byKeySpy = sinon.spy(this.dataSourceConfig, 'byKey');

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'text',
            items: [1, 2, 3]
        });

        dropDownButton.option('dataSource', this.dataSourceConfig);

        assert.ok(byKeySpy.notCalled, 'no unnecessary call was made');
    });

    QUnit.test('dropDownButton should not try to load value on init if selectedItemKey is undefined (T925687)', function(assert) {
        const byKeySpy = sinon.spy(this.dataSourceConfig, 'byKey');

        new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'text',
            dataSource: this.dataSourceConfig
        });

        assert.ok(byKeySpy.notCalled, 'no unnecessary call was made');
    });

    QUnit.module('byKey call result should be ignored', {
        beforeEach: function() {
            this.callCount = 0;
            this.items = [{ id: 1, text: 'first' }, { id: 2, text: 'second' }];
            this.customStore = new CustomStore({
                load: () => {
                    const deferred = $.Deferred();
                    setTimeout(() => {
                        deferred.resolve({ data: this.items, totalCount: this.items.length });
                    }, 100);
                    return deferred.promise();
                },

                byKey: (key) => {
                    const deferred = $.Deferred();
                    const filter = () => this.items.find(item => item.id === key);
                    if(this.callCount === 0) {
                        setTimeout(() => {
                            deferred.resolve(filter());
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            deferred.resolve(filter());
                        }, 1000);
                    }
                    ++this.callCount;
                    return deferred.promise();
                }
            });

            this.dataSource = new DataSource({
                store: this.customStore
            });

            this.dropDownButton = $('#dropDownButton').dxDropDownButton({
                dataSource: this.dataSource,
                displayExpr: 'text',
                keyExpr: 'id',
                selectedItemKey: 1
            }).dxDropDownButton('instance');
        }
    }, () => {
        QUnit.test('after new call', function(assert) {
            this.dropDownButton.option('selectedItemKey', 2);

            this.clock.tick(1000);
            assert.strictEqual(this.dropDownButton.option('selectedItem').id, 2, 'second request is resolved');
            this.clock.tick(1000);
            assert.strictEqual(this.dropDownButton.option('selectedItem').id, 2, 'first init byKey result is ignored');
        });

        QUnit.test('after value change to already loaded value', function(assert) {
            this.dropDownButton.open();
            this.clock.tick(100);

            this.dropDownButton.option('selectedItemKey', 2);

            this.clock.tick(1000);
            assert.strictEqual(this.dropDownButton.option('selectedItem').id, 2, 'second request is resolved');
            this.clock.tick(1000);
            assert.strictEqual(this.dropDownButton.option('selectedItem').id, 2, 'first init byKey result is ignored');
        });

        QUnit.test('after change value to undefined (T1008488)', function(assert) {
            this.dropDownButton.option('selectedItemKey', undefined);
            this.clock.tick(2000);

            assert.strictEqual(this.dropDownButton.option('selectedItem'), null, 'init byKey result is ignored');
        });
    });

    QUnit.test('should display correct text for non-plain objects(T1233565)', function(assert) {
        class Alignment {
            constructor(id, name, icon) {
                this.id = id;
                this.name = name;
                this.icon = icon;
            }
        }
        const alignments = [
            new Alignment(1, 'Left', 'alignleft'),
            new Alignment(4, 'Right', 'alignright'),
            new Alignment(2, 'Center', 'aligncenter'),
            new Alignment(3, 'Justify', 'alignjustify'),
        ];
        const instance = new DropDownButton($('#dropDownButton'), {
            displayExpr: 'name',
            keyExpr: 'id',
            selectedItemKey: 1,
            useSelectMode: true,
            dataSource: alignments,
        });

        const textValue = instance.option('text');

        assert.strictEqual(textValue, 'Left', 'the selected item text is properly shown');
    });
});

QUnit.module('events', {}, () => {
    QUnit.test('onItemClick event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            onItemClick: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 5, 'event has 5 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
        assert.strictEqual(e.itemData, 1, 'itemData is correct');
        assert.strictEqual($(e.itemElement).get(0), $item.get(0), 'itemElement is correct');
    });

    QUnit.test('itemClick event - subscription using "on" method', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3]
        });

        dropDownButton.on('itemClick', handler);

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 5, 'event has 5 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
        assert.strictEqual(e.itemData, 1, 'itemData is correct');
        assert.strictEqual($(e.itemElement).get(0), $item.get(0), 'itemElement is correct');
    });

    QUnit.test('itemClick event change - subscription by "on" method', function(assert) {
        const handler = sinon.spy();

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3]
        });

        dropDownButton.open();
        dropDownButton.on('itemClick', handler);

        const $item = getList(dropDownButton).itemElements().eq(0);
        eventsEngine.trigger($item, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('onButtonClick event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2,
            onButtonClick: handler
        });

        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 4, 'event has 4 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
        assert.strictEqual(e.selectedItem, 2, 'itemData is correct');
    });

    QUnit.test('onButtonClick option change', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            selectedItemKey: 2
        });

        dropDownButton.option('onButtonClick', handler);
        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, 'dxclick');

        const e = handler.lastCall.args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
    });

    QUnit.test('onButtonClick should be called even if splitButton is false', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            splitButton: false,
            onButtonClick: handler
        });

        const $actionButton = getActionButton(dropDownButton);
        eventsEngine.trigger($actionButton, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('buttonClick - subscription using "on" method', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            splitButton: false
        });

        dropDownButton.on('buttonClick', handler);

        const $actionButton = getActionButton(dropDownButton);
        eventsEngine.trigger($actionButton, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('onContentReady should be fired after widget rendering and take into account Popup rendering', function(assert) {
        const contentReadyHandler = sinon.spy();

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            deferRendering: true,
            onContentReady: contentReadyHandler
        });

        assert.strictEqual(contentReadyHandler.callCount, 1, 'Widget is ready');
        dropDownButton.open();
        assert.strictEqual(contentReadyHandler.callCount, 3, 'Popup is ready, then List is ready');
    });

    QUnit.test('onContentReady should be fired after widget rendering when subscription uses "on" method', function(assert) {
        const contentReadyHandler = sinon.spy();

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            deferRendering: true
        });

        dropDownButton.on('contentReady', contentReadyHandler);
        dropDownButton.open();
        assert.strictEqual(contentReadyHandler.callCount, 2, 'Popup is ready, then List is ready');

        dropDownButton.option('dataSource', [1, 2, 3]);
        assert.strictEqual(contentReadyHandler.callCount, 3, 'List is ready after updating Popup content');
    });

    QUnit.test('onContentReady should be fired after widget with custom content template rendering', function(assert) {
        const contentReadyHandler = sinon.spy();
        const firstTemplateHandler = sinon.stub().returns('Template 1');
        const secondTemplateHandler = sinon.stub().returns('Template 2');

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            dropDownContentTemplate: firstTemplateHandler,
            deferRendering: false,
            onContentReady: contentReadyHandler,
            opened: true
        });

        assert.strictEqual(contentReadyHandler.callCount, 1, 'event is fired');

        dropDownButton.option('dropDownContentTemplate', secondTemplateHandler);
        assert.strictEqual(contentReadyHandler.callCount, 2, 'event is fired after template change');
    });

    QUnit.test('onContentReady should be fired after widget with custom content template rendering - subscription uses "on" method', function(assert) {
        const contentReadyHandler = sinon.spy();
        const firstTemplateHandler = sinon.stub().returns('Template 1');
        const secondTemplateHandler = sinon.stub().returns('Template 2');

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            dropDownContentTemplate: firstTemplateHandler,
            deferRendering: true
        });

        dropDownButton.on('contentReady', contentReadyHandler);
        dropDownButton.open();
        assert.strictEqual(contentReadyHandler.callCount, 1, 'event is fired');

        dropDownButton.option('dropDownContentTemplate', secondTemplateHandler);
        assert.strictEqual(contentReadyHandler.callCount, 2, 'event is fired after template change');
    });

    QUnit.test('onSelectionChanged event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            selectedItemKey: 2,
            onSelectionChanged: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 4, 'event has 4 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.previousItem, 2, 'previousItem is correct');
        assert.strictEqual(e.item, 1, 'item is correct');
    });

    QUnit.test('onSelectionChanged event with data expressions', function(assert) {
        const handler = sinon.spy();
        const items = [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }];
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: items,
            keyExpr: 'id',
            displayExpr: 'text',
            selectedItemKey: 2,
            onSelectionChanged: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 4, 'event has 4 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.deepEqual(e.previousItem, items[1], 'previousItem is correct');
        assert.deepEqual(e.item, items[0], 'item is correct');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this.$element = $('#dropDownButton');
        this.dropDownButton = new DropDownButton(this.$element, {
            focusStateEnabled: true,
            splitButton: true,
            deferRendering: false,
            items: [
                { name: 'Item 1', id: 1 },
                { name: 'Item 2', id: 2 },
                { name: 'Item 3', id: 3 }
            ],
            displayExpr: 'name',
            keyExpr: 'id'
        });
        this.$actionButton = getActionButton(this.dropDownButton);
        this.$toggleButton = getToggleButton(this.dropDownButton);
        this.keyboard = keyboardMock(getButtonGroup(this.dropDownButton).element());
    }
}, () => {
    QUnit.test('focusStateEnabled option should be transfered to list and buttonGroup', function(assert) {
        assert.ok(getList(this.dropDownButton).option('focusStateEnabled'), 'list got option on init');
        assert.ok(getButtonGroup(this.dropDownButton).option('focusStateEnabled'), 'buttonGroup got option on init');

        this.dropDownButton.option('focusStateEnabled', false);
        assert.notOk(getList(this.dropDownButton).option('focusStateEnabled'), 'list got option on change');
        assert.notOk(getButtonGroup(this.dropDownButton).option('focusStateEnabled'), 'buttonGroup got option on change');
    });

    QUnit.testInActiveWindow('arrow right and left should select a button', function(assert) {
        this.keyboard.press('right');
        assert.ok(this.$toggleButton.hasClass(FOCUSED_CLASS), 'toggle button is focused');
        assert.notOk(this.$actionButton.hasClass(FOCUSED_CLASS), 'action button lose focus');

        this.keyboard.press('left');
        assert.notOk(this.$toggleButton.hasClass(FOCUSED_CLASS), 'action button lose');
        assert.ok(this.$actionButton.hasClass(FOCUSED_CLASS), 'toggle button is focused');
    });

    QUnit.testInActiveWindow('action button should be clicked on enter or space', function(assert) {
        const handler = sinon.spy();
        this.dropDownButton.option('onButtonClick', handler);

        this.keyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'action button pressed');

        this.keyboard.press('space');
        assert.strictEqual(handler.callCount, 2, 'action button pressed twice');
    });

    QUnit.testInActiveWindow('enter/space press should raise itemClick event when list item is focused', function(assert) {
        const handler = sinon.spy();
        this.dropDownButton.option('onItemClick', handler);

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);

        listKeyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'itemClick has been raised');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(handler.callCount, 2, 'itemClick has been raised');
    });

    QUnit.testInActiveWindow('enter/space press should raise itemClick event when list item is focused - subscription by "on" method', function(assert) {
        const handler = sinon.spy();

        this.dropDownButton.on('itemClick', handler);

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);

        listKeyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'itemClick has been raised');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(handler.callCount, 2, 'itemClick has been raised');
    });

    QUnit.test('enter/space press should raise selectionChanged event when list item is focused', function(assert) {
        const handler = sinon.spy();

        this.dropDownButton.option('onSelectionChanged', handler);

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);

        listKeyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'selectionChanged is raised');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(handler.callCount, 2, 'selectionChanged has been raised');
    });

    QUnit.test('enter/space press should change selectedItem option when list item is focused', function(assert) {
        const items = this.dropDownButton.option('items');

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);

        listKeyboard.press('enter');

        assert.strictEqual(this.dropDownButton.option('selectedItem'), items[0], 'selectedItem is correct');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(this.dropDownButton.option('selectedItem'), items[1], 'selectedItem is correct');
    });

    QUnit.test('enter/space press should raise selectionChanged event when list item is focused - subscription using "on" method', function(assert) {
        const handler = sinon.spy();

        this.dropDownButton.on('selectionChanged', handler);

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);

        listKeyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'onSelectionChanged is raised');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(handler.callCount, 2, 'selectionChanged has been raised');
    });

    QUnit.testInActiveWindow('enter/space press should rise buttonClick event when action button is focused - subscription using "on" method', function(assert) {
        const handler = sinon.spy();
        this.dropDownButton.on('buttonClick', handler);

        this.keyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'buttonClick event has been raised after enter press');

        this.keyboard.press('space');
        assert.strictEqual(handler.callCount, 2, 'buttonClick event has been raised after space press');
    });

    QUnit.testInActiveWindow('toggle button should be clicked on enter or space', function(assert) {
        this.keyboard.press('right').press('enter');

        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'popup is opened');
        assert.ok(this.$toggleButton.hasClass(FOCUSED_CLASS), 'toggle button is focused');

        this.keyboard.press('space');
        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
        assert.ok(this.$toggleButton.hasClass(FOCUSED_CLASS), 'toggle button is focused');
    });

    QUnit.testInActiveWindow('list should get first focused item when down arrow pressed after opening', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const $firstItem = getList(this.dropDownButton).itemElements().first();

        assert.ok($firstItem.hasClass(FOCUSED_CLASS), 'first list item is focused');
    });

    QUnit.testInActiveWindow('list should get first focused item when up arrow pressed after opening', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('up');

        const $firstItem = getList(this.dropDownButton).itemElements().first();

        assert.ok($firstItem.hasClass(FOCUSED_CLASS), 'first list item is focused');
    });

    QUnit.testInActiveWindow('esc on list should close the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);
        listKeyboard.press('esc');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');

        // TODO: it is better to focus toggle button when splitButtons is true but it is a complex fix
        assert.ok(this.$actionButton.hasClass(FOCUSED_CLASS), 'action button is focused');
    });

    QUnit.testInActiveWindow('esc on button group should close the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('esc');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
        assert.ok(this.$toggleButton.hasClass(FOCUSED_CLASS), 'toggle button is focused');
    });

    QUnit.testInActiveWindow('left on list should close the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);
        listKeyboard.press('left');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');

        // TODO: it is better to focus toggle button when splitButtons is true but it is a complex fix
        assert.ok(this.$actionButton.hasClass(FOCUSED_CLASS), 'action button is focused');
    });

    QUnit.testInActiveWindow('right on list should close the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);
        listKeyboard.press('right');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');

        // TODO: it is better to focus toggle button when splitButtons is true but it is a complex fix
        assert.ok(this.$actionButton.hasClass(FOCUSED_CLASS), 'action button is focused');
    });

    QUnit.testInActiveWindow('down arrow on toggle button should open the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('down');

        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'popup is opened');
    });

    QUnit.testInActiveWindow('selection of the item should return focus to the button group', function(assert) {
        this.keyboard
            .press('right')
            .press('down')
            .press('down');

        const listKeyboard = getListKeyboard(this.dropDownButton);
        listKeyboard.press('enter');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
        assert.ok(this.$toggleButton.hasClass(FOCUSED_CLASS), 'toggle button is focused');
    });

    QUnit.testInActiveWindow('tab on button should close the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('down');

        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'popup is opened');

        this.keyboard.press('tab');
        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
    });

    QUnit.testInActiveWindow('tab on list should close the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('down')
            .press('down');

        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'popup is opened');

        const listKeyboard = getListKeyboard(this.dropDownButton);
        const event = listKeyboard.press('tab').event;

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
        assert.ok(getButtonGroup(this.dropDownButton).$element().hasClass(FOCUSED_CLASS), 'button group was focused');
        assert.strictEqual(event.isDefaultPrevented(), false, 'event was not prevented and native focus move next');
    });

    QUnit.testInActiveWindow('focus method call moves focus to buttonGroup', function(assert) {
        const $buttonGroup = getButtonGroup(this.dropDownButton).$element();

        this.dropDownButton.focus();

        assert.ok($buttonGroup.hasClass(FOCUSED_CLASS), 'button group is focused');
    });

    QUnit.testInActiveWindow('focusIn handler should be called on dropDownButton focus', function(assert) {
        const focusInHandler = sinon.stub();

        this.dropDownButton.option({ onFocusIn: focusInHandler });
        this.dropDownButton.focus();

        assert.ok(focusInHandler.calledOnce, 'focusIn handler was called');
    });

    QUnit.testInActiveWindow('focusOut handler should be called on buttonGroup blur', function(assert) {
        const focusOutHandler = sinon.stub();
        this.dropDownButton.option({ onFocusOut: focusOutHandler });
        const $buttonGroup = getButtonGroup(this.dropDownButton).$element();

        this.dropDownButton.focus();
        eventsEngine.trigger($buttonGroup, 'focusout');

        assert.ok(focusOutHandler.calledOnce, 'focusOut handler was called');
    });

    QUnit.module('registerKeyHandler', () => {
        QUnit.test('should add keyboard event handler with correct context', function(assert) {
            assert.expect(1);

            const handler = function() {
                assert.strictEqual(this.NAME, 'dxDropDownButton', 'context is correct');
            };
            this.dropDownButton.registerKeyHandler('backspace', handler);

            this.keyboard.press('backspace');
        });

        [
            ['downArrow', true],
            ['upArrow', true],
            ['tab', false],
            ['escape', false]
        ].forEach(([key, opened]) => {
            QUnit.test(`should work correctly with ${key}`, function(assert) {
                const handler = sinon.stub();
                this.dropDownButton.registerKeyHandler(key, handler);
                this.dropDownButton.focus();

                this.keyboard.press(key);

                assert.strictEqual(this.dropDownButton.option('opened'), opened, 'default handler was called');
                assert.ok(handler.calledOnce, 'custom handler was called');
            });
        });
    });
});

QUnit.module('custom content template', {}, () => {
    QUnit.test('dropDownContentTemplate option can be used', function(assert) {
        const templateHandler = sinon.stub().returns('Template 1');
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            dropDownContentTemplate: templateHandler,
            deferRendering: false
        });

        const popupContent = getPopup(dropDownButton).content();
        assert.strictEqual(templateHandler.callCount, 1, 'templateHandler was called');
        assert.deepEqual(templateHandler.getCall(0).args[0], [1, 2, 3], 'data is correct');
        assert.strictEqual(templateHandler.getCall(0).args[1], popupContent, 'container is correct');
        assert.strictEqual($(popupContent).text(), 'Template 1', 'template was rendered');

        const templateHandler2 = sinon.stub().returns('Template 2');
        dropDownButton.option('dropDownContentTemplate', templateHandler2);
        assert.strictEqual(templateHandler.callCount, 1, 'templateHandler was called');
        assert.strictEqual($(popupContent).text(), 'Template 2', 'template was rendered');
    });

    QUnit.test('datasource should be passed to contentTemplae when items are not specified', function(assert) {
        const templateHandler = sinon.stub().returns('Template 1');
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            dropDownContentTemplate: templateHandler,
            deferRendering: false
        });

        assert.deepEqual(templateHandler.getCall(0).args[0], dropDownButton.getDataSource(), 'data is correct');
    });

    QUnit.test('itemTemplate option', function(assert) {
        const items = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' }
        ];

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items,
            deferRendering: false,
            itemTemplate: function(itemData) {
                return $('<div>')
                    .text(`${ itemData.id }: ${ itemData.name }`);
            }
        });

        const $listItems = getList(dropDownButton).itemElements();
        assert.strictEqual($listItems.eq(0).text(), '1: A', 'itemTemlate has changed item text');
    });
});

QUnit.module('Button template', {}, () => {
    QUnit.test('Button template should be rendered correctly if string is passed', function(assert) {
        const customText = 'Custom text';
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            template: customText,
        });
        const $buttonContent = $dropDownButton.find(`.${BUTTON_CONTENT_CLASS}`);

        assert.strictEqual($buttonContent.text(), customText, 'text is correct');
    });

    QUnit.test('Button template should be rendered correctly if template function is passed', function(assert) {
        const customClass = 'CustomClass';
        const customText = 'Custom text';
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            template: () => $(`<div class=${customClass}>${customText}</div>`)
        });
        const $buttonContent = $dropDownButton.find(`.${BUTTON_CONTENT_CLASS}`);
        const $template = $dropDownButton.find(`.${customClass}`);

        assert.ok($template.parent().is($buttonContent), 'template is placed in button content');
        assert.strictEqual($template.text(), customText, 'text is correct');
    });

    QUnit.test('Button template should have icon and text as first argument', function(assert) {
        const templateStub = sinon.stub();
        const text = 'Custom caption';
        const icon = '';
        $('#dropDownButton').dxDropDownButton({
            text,
            icon,
            template: templateStub
        });

        const data = templateStub.getCall(0).args[0];

        assert.strictEqual(data.text, text, 'text is passed as first argument field');
        assert.strictEqual(data.icon, icon, 'icon is passed as first argument field');
    });

    QUnit.test('Button template should have button content element as second argument', function(assert) {
        const templateStub = sinon.stub();
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            template: templateStub
        });

        const $element = $(templateStub.getCall(0).args[1]);
        const $buttonContent = $dropDownButton.find(`.${BUTTON_CONTENT_CLASS}`);

        assert.ok($element.is($buttonContent));
    });

    QUnit.test('Button template should have correct container argument', function(assert) {
        $('#dropDownButton').dxDropDownButton({
            template: (_, container) => {
                assert.deepEqual(isRenderer(container), !!config().useJQuery, 'container is correct');
            }
        });
    });

    QUnit.test('Action button should have template passed from DropDownButton', function(assert) {
        const templateStub = sinon.stub();
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            template: templateStub
        }).dxDropDownButton('instance');

        const actionButton = getActionButton(dropDownButton).dxButton('instance');

        assert.strictEqual(dropDownButton.option('template'), actionButton.option('template'));
    });

    QUnit.test('Button template should be rerendered correctly on runtime change', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            template: 'Old text',
        });
        const dropDownButton = $dropDownButton.dxDropDownButton('instance');

        dropDownButton.option('template', 'New text');

        const $buttonContent = $dropDownButton.find(`.${BUTTON_CONTENT_CLASS}`);

        assert.strictEqual($buttonContent.text(), 'New text', 'template is updated');
    });
});


QUnit.module('Accessibility', {
    beforeEach: function() {
        this.elementSelector = '#dropDownButton';
        this.$element = $(this.elementSelector);

        this.createInstance = (options) => {
            return new DropDownButton(this.$element, extend({
                items: ['item 1'],
                text: 'Text'
            }, options));
        };

        this.getButtons = () => {
            return $(this.elementSelector).find(`.${BUTTON}`);
        };
    }
}, () => {
    QUnit.test('check aria-expanded attr for dropdown', function(assert) {
        this.createInstance();

        const buttonElements = this.getButtons();

        assert.strictEqual(buttonElements.eq(0).attr('aria-expanded'), 'false');
        assert.strictEqual(this.$element.attr('aria-expanded'), undefined);
    });

    QUnit.test('check aria-label attr for overlay content', function(assert) {
        this.createInstance({ opened: true });

        const $overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`).eq(0);

        assert.strictEqual($overlayContent.attr('aria-label'), OVERLAY_CONTENT_LABEL);
    });

    QUnit.test('check aria-expanded attr for visible dropdown', function(assert) {
        this.createInstance({ opened: true });

        const buttonElements = this.getButtons();

        assert.strictEqual(buttonElements.eq(0).attr('aria-expanded'), 'true');
        assert.strictEqual(this.$element.attr('aria-expanded'), undefined);
    });

    QUnit.test('check aria-expanded attr for visible dropdown if splitButton is true', function(assert) {
        const instance = this.createInstance({ splitButton: true });

        instance.open();

        const buttonElements = this.getButtons();

        assert.strictEqual($(buttonElements[0]).attr('aria-expanded'), 'true');
        assert.strictEqual($(buttonElements[1]).attr('aria-expanded'), 'true');
        assert.strictEqual(this.$element.attr('aria-expanded'), undefined);
    });

    QUnit.test('check aria-expanded attr if splitButton is true after dropdown was closed', function(assert) {
        const instance = this.createInstance({ splitButton: true });

        const buttonElements = this.getButtons();

        instance.open();
        instance.close();

        assert.strictEqual($(buttonElements[0]).attr('aria-expanded'), 'false');
        assert.strictEqual($(buttonElements[1]).attr('aria-expanded'), 'false');
        assert.strictEqual(this.$element.attr('aria-expanded'), undefined);
    });

    QUnit.test('check aria-expanded attr if splitButton=true', function(assert) {
        const instance = this.createInstance();
        const $firstButton = this.getButtons().eq(0);

        assert.strictEqual($firstButton.attr('aria-expanded'), 'false');

        instance.option({ splitButton: true });

        const $buttonElements = this.getButtons();

        assert.strictEqual($buttonElements.eq(0).attr('aria-expanded'), 'false');
        assert.strictEqual($buttonElements.eq(1).attr('aria-expanded'), 'false');
    });

    QUnit.test('button group element should have correct role if splitButton=true', function(assert) {
        const instance = this.createInstance({ splitButton: true });

        const buttonGroup = getButtonGroup(instance).$element();

        assert.strictEqual(buttonGroup.attr('role'), 'menu');
    });

    QUnit.test('button group element should have correct role if splitButton was changed in runtime', function(assert) {
        const instance = this.createInstance({ splitButton: true });

        instance.option({ splitButton: false });

        assert.strictEqual(getButtonGroup(instance).$element().attr('role'), 'group');

        instance.option({ splitButton: true });

        assert.strictEqual(getButtonGroup(instance).$element().attr('role'), 'menu');
    });

    QUnit.test('buttons should have role menuitem if splitButton=true', function(assert) {
        this.createInstance({ splitButton: true });

        const buttonElements = this.getButtons();

        assert.strictEqual(buttonElements.eq(0).attr('role'), 'menuitem');
        assert.strictEqual(buttonElements.eq(1).attr('role'), 'menuitem');
    });

    QUnit.test('buttons should have correct role if splitButton was changed in runtime', function(assert) {
        const instance = this.createInstance({ splitButton: true });

        instance.option({ splitButton: false });

        assert.strictEqual(this.getButtons().eq(0).attr('role'), 'button');

        instance.option({ splitButton: true });

        assert.strictEqual(this.getButtons().eq(0).attr('role'), 'menuitem');
        assert.strictEqual(this.getButtons().eq(1).attr('role'), 'menuitem');
    });

    QUnit.test('check aria-owns attr for element', function(assert) {
        const instance = this.createInstance();

        assert.strictEqual(this.$element.attr('aria-owns'), undefined);

        instance.open();

        const popupId = $(`.${POPUP_CONTENT_CLASS}`).attr('id');

        assert.strictEqual(this.$element.attr('aria-owns'), popupId);
    });

    [true, false].forEach(splitButton => {
        QUnit.test(`check aria-haspopup attr for button if splitButton=${splitButton}`, function(assert) {
            this.createInstance({ splitButton });

            const $buttonElements = this.getButtons();
            const $button = splitButton ? $buttonElements.eq(1) : $buttonElements.eq(0);

            assert.strictEqual($button.attr('aria-haspopup'), 'listbox');
        });
    });

    QUnit.test('check aria-haspopup attr for button if splitButton was changed in runtime', function(assert) {
        const instance = this.createInstance();

        const $button = this.getButtons().eq(0);

        assert.strictEqual($button.attr('aria-haspopup'), 'listbox');

        instance.option('splitButton', true);

        const $firstButton = this.getButtons().eq(0);
        const $secondButton = this.getButtons().eq(1);

        assert.strictEqual($firstButton.attr('aria-haspopup'), 'listbox');
        assert.strictEqual($secondButton.attr('aria-haspopup'), 'listbox');
    });

    [{
        name: 'text',
        value: 'text',
        updatedValue: 'new text'
    }, {
        name: 'icon',
        value: 'icon',
        updatedValue: 'newIcon'
    }, {
        name: 'focusStateEnabled',
        value: false,
        updatedValue: true
    }, {
        name: 'hoverStateEnabled',
        value: false,
        updatedValue: true
    }, {
        name: 'stylingMode',
        value: 'text',
        updatedValue: 'outlined'
    }, {
        name: 'tabIndex',
        value: 0,
        updatedValue: 1
    }].forEach((option) => {
        QUnit.test(`button should have aria-haspopup, aria-label and aria-expanded attributes after update ${option.name} option`, function(assert) {
            const instance = this.createInstance({ [option.name]: option.value });

            instance.option(option.name, option.updatedValue);

            const $button = this.getButtons().eq(0);

            assert.strictEqual($button.attr('aria-haspopup'), 'listbox');
            assert.strictEqual($button.attr('aria-label'), option.name === 'text' ? 'new text' : 'Text');
            assert.strictEqual($button.attr('aria-expanded'), 'false');
        });

        QUnit.test(`buttons should have aria-haspopup, aria-label and aria-expanded attributes if splitButton is set and after update ${option.name} option`, function(assert) {
            const instance = this.createInstance({ splitButton: true, [option.name]: option.value });

            instance.option(option.name, option.updatedValue);

            const $firstButton = this.getButtons().eq(0);
            const $secondButton = this.getButtons().eq(1);

            assert.strictEqual($firstButton.attr('aria-haspopup'), 'listbox');
            assert.strictEqual($firstButton.attr('aria-label'), option.name === 'text' ? 'new text' : 'Text');
            assert.strictEqual($firstButton.attr('aria-expanded'), 'false');

            assert.strictEqual($secondButton.attr('aria-haspopup'), 'listbox');
            assert.strictEqual($secondButton.attr('aria-label'), 'spindown');
            assert.strictEqual($secondButton.attr('aria-expanded'), 'false');
        });
    });

    QUnit.test('button should have correct aria-label attribute if text is not specified', function(assert) {
        this.createInstance({ text: '' });

        const $button = this.getButtons().eq(0);

        assert.strictEqual($button.attr('aria-label'), 'dropdownbutton');
    });

    QUnit.test('button should have correct aria-label attribute if text updated from empty value', function(assert) {
        const instance = this.createInstance({ text: '' });

        instance.option('text', 'new text');

        const $button = this.getButtons().eq(0);

        assert.strictEqual($button.attr('aria-label'), 'new text');
    });

    QUnit.test('buttons should have correct aria-label attributes if text is not specified and splitButton is set', function(assert) {
        this.createInstance({ splitButton: true, text: '' });

        const $firstButton = this.getButtons().eq(0);
        const $secondButton = this.getButtons().eq(1);

        assert.strictEqual($firstButton.attr('aria-label'), 'dropdownbutton');
        assert.strictEqual($secondButton.attr('aria-label'), 'spindown');
    });

    ['items', 'dataSource'].forEach(dataSource => {
        const getItemsContainer = () => $(`.${LIST_CLASS} .${LIST_ITEMS_CLASS}`);

        QUnit.test(`list aria-label should be set correctly if data source is ${dataSource} and items is not empty on init`, function(assert) {
            const instance = this.createInstance({ opened: true });

            assert.strictEqual(getItemsContainer().attr('aria-label'), 'Items');

            instance.option(dataSource, []);
            assert.strictEqual(getItemsContainer().attr('aria-label'), undefined);

            instance.option(dataSource, [1, 2, 3]);
            assert.strictEqual(getItemsContainer().attr('aria-label'), 'Items');
        });

        QUnit.test(`list aria-label should be set correctly if data source is ${dataSource} and items is empty on init`, function(assert) {
            const instance = this.createInstance({
                [dataSource]: [],
                opened: true,
            });

            assert.strictEqual(getItemsContainer().attr('aria-label'), undefined);

            instance.option(dataSource, [1, 2, 3]);
            assert.strictEqual(getItemsContainer().attr('aria-label'), 'Items');

            instance.option(dataSource, []);
            assert.strictEqual(getItemsContainer().attr('aria-label'), undefined);
        });

        QUnit.test(`list should have correct role if data sourse is set with ${dataSource} property`, function(assert) {
            const instance = this.createInstance({
                [dataSource]: [],
                opened: true,
            });

            assert.strictEqual(getItemsContainer().attr('role'), undefined);

            instance.option(dataSource, [1, 2, 3]);
            assert.strictEqual(getItemsContainer().attr('role'), 'listbox');

            instance.option(dataSource, []);
            assert.strictEqual(getItemsContainer().attr('role'), undefined);
        });

        [[1, 2, 3], []].forEach(items => {
            QUnit.test(`There is no errors if dataSource is ${dataSource}=[${items}] was changed in runtime and list was not rendered`, function(assert) {
                const instance = this.createInstance({
                    [dataSource]: items,
                });

                try {
                    instance.option(dataSource, items);
                } catch(e) {
                    assert.ok(false, `error is raised: ${e.message}`);
                } finally {
                    assert.ok(true, 'no error raised');
                }
            });
        });
    });
});
