import $ from 'jquery';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import { alert, confirm, custom } from 'ui/dialog';
import domUtils from '__internal/core/utils/m_dom';
import errors from 'ui/widget/ui.errors';
import fx from 'common/core/animation/fx';
import keyboardMock from '../../helpers/keyboardMock.js';
import { value as viewPort } from 'core/utils/view_port';
import domAdapter from '__internal/core/m_dom_adapter';

const { module, test, testInActiveWindow } = QUnit;

const ANIMATION_TIMEOUT = 500;

const DIALOG_WRAPPER_CLASS = 'dx-dialog-wrapper';
const DIALOG_CLASS = 'dx-dialog';
const POPUP_CLASS = 'dx-popup';
const DIALOG_BUTTON_CLASS = 'dx-dialog-button';
const DIALOG_MESSAGE_CLASS = 'dx-dialog-message';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';

QUnit.testStart(function() {
    const container = $('<div id="container">');

    container.appendTo('#qunit-fixture');
});

module('dialog', {
    beforeEach: function() {
        viewPort($('#container'));

        fx.off = true;

        this.title = 'Title here';
        this.messageHtml = '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>';
        this.getDialogElement = () => $(`.${DIALOG_CLASS}`);
        this.dialog = () => {
            return $(`.${DIALOG_WRAPPER_CLASS}`);
        };
        this.thereIsDialog = () => {
            return this.dialog().length === 1;
        };
        this.thereIsNoDialog = () => {
            return this.dialog().length === 0;
        };
        this.clickButton = (index) => {
            index = index || 0;
            this.dialog()
                .find(`.${DIALOG_BUTTON_CLASS}`)
                .eq(index)
                .trigger('dxclick');
        };
        this.isPopupDraggable = () => $(`.${POPUP_CLASS}`).dxPopup('instance').option('dragEnabled');
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    test('should remove its markup after hiding by escape (T1154325)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        custom({
            messageHtml: 'text',
            buttons: [{ type: 'default', text: 'Ok' }]
        }).show();

        const dialogButton = this
            .dialog()
            .find(`.${DIALOG_BUTTON_CLASS}`);

        const keyboard = keyboardMock(dialogButton);
        keyboard.keyDown('esc');

        const $dialog = this.getDialogElement();
        assert.strictEqual($dialog.length, 0, 'dialog markup is removed');
    });

    test('should remove its markup after hide method call', function(assert) {
        const { show, hide } = custom({
            messageHtml: 'text'
        });

        show();
        hide();

        const $dialog = this.getDialogElement();
        assert.strictEqual($dialog.length, 0, 'dialog markup is removed');
    });

    module('with animation', {
        beforeEach: function() {
            fx.off = false;
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        test('should remove its markup after hiding by escape only after hiding animation is finished', function(assert) {
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'desktop specific test');
                return;
            }

            custom({
                messageHtml: 'text',
                buttons: [{ type: 'default', text: 'Ok' }],
            }).show();

            const dialogButton = this
                .dialog()
                .find(`.${DIALOG_BUTTON_CLASS}`);
            const keyboard = keyboardMock(dialogButton);

            keyboard.keyDown('esc');

            assert.strictEqual(this.getDialogElement().length, 1, 'dialog markup is not removed immediately');

            this.clock.tick(ANIMATION_TIMEOUT);
            assert.strictEqual(this.getDialogElement().length, 0, 'dialog markup is removed after animation is finished');
        });

        test('should remove its markup after hide method call only after hiding animation is finished', function(assert) {
            const { show, hide } = custom({
                messageHtml: 'text',
            });

            show();
            hide();

            assert.strictEqual(this.getDialogElement().length, 1, 'dialog markup is not removed immediately');

            this.clock.tick(ANIMATION_TIMEOUT);
            assert.strictEqual(this.getDialogElement().length, 0, 'dialog markup is removed after animation is finished');
        });
    });

    test('dialog show/hide by Escape (T686065)', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'desktop specific test');
            return;
        }

        alert();
        assert.ok(this.thereIsDialog());
        keyboardMock(this.dialog().find(`.${DIALOG_BUTTON_CLASS}`).get(0)).keyDown('esc');
        assert.ok(this.thereIsNoDialog());
    });

    test('dialog show/hide', function(assert) {
        let instance;
        const options = {
            title: this.title,
            messageHtml: this.messageHtml
        };
        const result = 'DialogResultValue';

        const afterHide = function(value) {
            assert.equal(value, result, 'Dialog\'s deferred object were resolved with right value.');
        };

        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown.');

        // by 'hide' calling
        instance = custom(options);
        instance.show().done(afterHide);
        assert.ok(this.thereIsDialog(), 'Dialog is shown.');
        instance.hide(result);
        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown after \'hide\' was called.');

        // by clicking button
        instance = custom(options);
        instance.show();
        assert.ok(this.thereIsDialog(), 'Dialog is shown.');
        this.clickButton();
        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown after button was clicked.');
    });

    testInActiveWindow('first button in dialog obtained focus on shown', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'focus is absent on mobile devices');
            return;
        }
        alert('Sample message', 'Alert');

        assert.equal($('.dx-dialog-wrapper').find('.dx-state-focused').length, 1, 'button obtained focus');
    });

    test('dialog content', function(assert) {
        const options = {
            title: this.title,
            messageHtml: this.messageHtml
        };

        const instance = custom(options);
        instance.show();

        assert.equal(this.dialog().find('.dx-popup-title').text(), this.title, 'Actual title is equal to expected.');
        assert.equal((this.dialog().find('.dx-dialog-message').html() || '').toLowerCase(), this.messageHtml.toLowerCase(), 'Actual message is equal to expected.');
        instance.hide();

        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown.');
    });

    test('dialog content without title', function(assert) {
        const options = {
            title: this.title,
            messageHtml: this.messageHtml,
            showTitle: false
        };
        const instance = custom(options);

        instance.show();

        assert.equal(this.dialog().find('.dx-popup-title').length, 0, 'Actual title is equal not expected.');
    });

    test('popup drag enabled', function(assert) {
        const testPopupDrag = (dialogDragEnabled, expectedPopupDragEnabled, message) => {
            const options = {
                title: this.title,
                messageHtml: this.messageHtml,
                dragEnabled: dialogDragEnabled
            };
            const instance = custom(options);

            instance.show();

            assert.equal(this.isPopupDraggable(), expectedPopupDragEnabled, message);
            instance.hide();
        };

        testPopupDrag(true, true, 'drag was not enabled');
        testPopupDrag(false, false, 'drag was not disabled');
        testPopupDrag(undefined, true, 'drag was not enabled');
    });

    test('alert dialog without title should not be draggable', function(assert) {
        const testPopupDrag = (showTitle, expectedPopupDragEnabled, message) => {
            alert(this.messageHtml, 'alert title', showTitle);

            assert.equal(this.isPopupDraggable(), expectedPopupDragEnabled, message);

            this.clickButton();
        };

        testPopupDrag(true, true, 'drag was not enabled');
        testPopupDrag(false, false, 'drag was not disabled');
        testPopupDrag(undefined, true, 'drag was not enabled');
    });

    test('confirm dialog without title should not be draggable', function(assert) {
        const testPopupDrag = (showTitle, expectedPopupDragEnabled, message) => {
            confirm(this.messageHtml, 'confirm title', showTitle);

            assert.equal(this.isPopupDraggable(), expectedPopupDragEnabled, message);

            this.clickButton();
        };

        testPopupDrag(true, true, 'drag was not enabled');
        testPopupDrag(false, false, 'drag was not disabled');
        testPopupDrag(undefined, true, 'drag was not enabled');
    });

    test('dialog buttons', function(assert) {
        let actual;
        const expected = 'ButtonReturnValue#2';
        const options = {
            title: this.title,
            messageHtml: this.messageHtml,
            buttons: [{
                text: 'ButtonCaption#1',
                onClick: function() {
                    return 'ButtonReturnValue#1';
                }
            }, {
                text: 'ButtonCaption#2',
                onClick: function() {
                    return 'ButtonReturnValue#2';
                }
            }]
        };

        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown.');

        const instance = custom(options);
        instance.show().done((value) => actual = value);

        assert.ok(this.thereIsDialog(), 'Dialog is shown.');
        assert.equal(this.dialog().find(`.${DIALOG_BUTTON_CLASS}`).length, 2, 'There are two custom buttons.');

        this.clickButton(1);

        assert.equal(actual, expected, 'Actual value is equal to expected.');
        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown.');
    });

    test('alert dialog', function(assert) {
        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown.');

        alert(this.messageHtml, this.title);

        assert.ok(this.thereIsDialog(), 'Dialog is shown.');
        assert.equal(this.dialog().find('.dx-popup-title').text(), this.title, 'Dialog default title is used.');

        const $bottom = this.dialog().find('.dx-popup-bottom');

        assert.equal($bottom.length, 1, 'Dialog bottom is rendered');
        assert.equal($bottom.find('.dx-button').length, 1, 'Dialog has button');

        this.clickButton();

        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown.');
    });

    test('confirm dialog', function(assert) {
        let actual;

        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown.');

        confirm(this.messageHtml, this.title).done((value) => actual = value);

        this.clickButton();

        assert.strictEqual(actual, true, 'Confirm result value is equal to expected.');
        assert.ok(this.thereIsNoDialog(), 'Dialog is not shown.');
    });

    test('dialog overlay content has \'dx-rtl\' class when RTL is enabled', function(assert) {
        config({ rtlEnabled: true });

        confirm(this.messageHtml, this.title);

        assert.ok($('.dx-overlay-content').hasClass('dx-rtl'), '\'dx-rlt\' class is present');

        config({ rtlEnabled: false });
    });

    test('dialog aria-labelledby is equal to message id if title is null', function(assert) {
        confirm({ message: 'message' });

        const overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
        const messageId = overlayContent.find(`.${DIALOG_MESSAGE_CLASS}`).attr('id');

        assert.strictEqual(overlayContent.attr('aria-labelledby'), messageId);
    });

    test('dialog aria-labelledby is equal to title id', function(assert) {
        confirm({ message: 'message', title: 'title' });

        const overlayContent = $(`.${OVERLAY_CONTENT_CLASS}`);
        const titleId = overlayContent.find(`.${TOOLBAR_LABEL_CLASS}`).attr('id');

        assert.strictEqual(overlayContent.attr('aria-labelledby'), titleId);
    });

    test('should show \'W1013\' warning if deprecated \'message\' option is used', function(assert) {
        const originalLog = errors.log;
        let warning = null;

        errors.log = (loggedWarning) => warning = loggedWarning;

        try {
            custom({ message: 'message' });
            assert.strictEqual(warning, 'W1013');
        } finally {
            errors.log = originalLog;
        }
    });

    test('dialog should reset active element on showing', function(assert) {
        const options = {
            title: 'title',
            messageHtml: 'message'
        };
        const resetActiveElementStub = sinon.stub(domUtils, 'resetActiveElement');

        try {
            const instance = custom(options);
            instance.show();
            assert.equal(resetActiveElementStub.callCount, 1);
            instance.hide();
        } finally {
            resetActiveElementStub.reset();
        }
    });

    test('it should be possible to redefine popup option in the dialog', function(assert) {
        custom({
            title: 'Test Title',
            popupOptions: {
                customOption: 'Test',
                title: 'Popup title',
                height: 300
            }
        }).show();

        const popup = $(`.${POPUP_CLASS}`).dxPopup('instance');

        assert.equal(popup.option('customOption'), 'Test', 'custom option is defined');
        assert.equal(popup.option('title'), 'Popup title', 'user option is redefined');
        assert.equal(popup.option('height'), 300, 'default option is redefined');
    });

    test('it should apply correct arguments to the button \'onClick\' handler', function(assert) {
        const clickStub = sinon.stub();

        custom({
            buttons: [{
                text: 'Test',
                onClick: clickStub
            }]
        }).show();

        this.clickButton(0);

        const clickArgs = clickStub.lastCall.args[0];

        assert.ok(Object.prototype.hasOwnProperty.call(clickArgs, 'component'));
        assert.ok(Object.prototype.hasOwnProperty.call(clickArgs, 'event'));
        assert.strictEqual(clickArgs.component.NAME, 'dxButton');
    });

    test('dragAndResizeContainer should be window by default (T1120202)', function(assert) {
        custom({
            title: 'title',
            messageHtml: 'message',
            showTitle: true,
        }).show();

        const popup = $(`.${POPUP_CLASS}`).dxPopup('instance');
        const { dragAndResizeArea } = popup.option();
        assert.strictEqual(dragAndResizeArea, window, 'dragAndResizeArea is not specified');
    });

    test('container should be equal to the root element by default', function(assert) {
        custom({
            title: 'title',
            messageHtml: 'message',
            showTitle: true,
        }).show();

        const popup = $(`.${POPUP_CLASS}`).dxPopup('instance');
        const { container } = popup.option();
        assert.strictEqual(container.get(0), $(`.${DIALOG_CLASS}`).get(0), 'container is a root element');
    });
});

QUnit.module('width on phone', {
    beforeEach: function() {
        viewPort($('#container'));
        fx.off = true;
        this.realDevice = devices.real();

        devices.real({ deviceType: 'phone' });

        this.dialog = custom();
        this.documentStub = sinon.stub(domAdapter, 'getDocumentElement');
        this.getDialogElement = () => $(`.${DIALOG_WRAPPER_CLASS} .dx-overlay-content`);
    },
    afterEach: function() {
        devices.real(this.realDevice);
        this.documentStub.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('should be 90% for portrait orientation', function(assert) {
        this.documentStub.returns({ clientWidth: 200, clientHeight: 500 });

        this.dialog.show();

        const $dialog = this.getDialogElement();
        assert.strictEqual($dialog.width(), 180, 'width is correct');
    });

    QUnit.test('should be 60% for landscape orientation', function(assert) {
        this.documentStub.returns({ clientWidth: 600, clientHeight: 500 });

        this.dialog.show();

        const $dialog = this.getDialogElement();
        assert.strictEqual($dialog.width(), 360, 'width is correct');
    });
});
