import $ from '../core/renderer';
import Component from '../core/component';
import Action from '../core/action';
import devices from '../core/devices';
import config from '../core/config';

import { resetActiveElement } from '../core/utils/dom';
import { Deferred } from '../core/utils/deferred';
import { isFunction, isPlainObject } from '../core/utils/type';
import { each } from '../core/utils/iterator';
import { extend } from '../core/utils/extend';
import { getWindow } from '../core/utils/window';
import eventsEngine from '../events/core/events_engine';
import { value as getViewport } from '../core/utils/view_port';

import messageLocalization from '../localization/message';
import errors from './widget/ui.errors';
import Popup from './popup';

import { ensureDefined } from '../core/utils/common';

const window = getWindow();

const DEFAULT_BUTTON = {
    text: 'OK',
    onClick: function() { return true; }
};

/**
 * @name ui.dialog
 */

const DX_DIALOG_CLASSNAME = 'dx-dialog';
const DX_DIALOG_WRAPPER_CLASSNAME = `${DX_DIALOG_CLASSNAME}-wrapper`;
const DX_DIALOG_ROOT_CLASSNAME = `${DX_DIALOG_CLASSNAME}-root`;
const DX_DIALOG_CONTENT_CLASSNAME = `${DX_DIALOG_CLASSNAME}-content`;
const DX_DIALOG_MESSAGE_CLASSNAME = `${DX_DIALOG_CLASSNAME}-message`;
const DX_DIALOG_BUTTONS_CLASSNAME = `${DX_DIALOG_CLASSNAME}-buttons`;
const DX_DIALOG_BUTTON_CLASSNAME = `${DX_DIALOG_CLASSNAME}-button`;

const DX_BUTTON_CLASSNAME = 'dx-button';

export const FakeDialogComponent = Component.inherit({
    ctor: function(element, options) {
        this.callBase(options);
    },

    _defaultOptionsRules: function() {

        return this.callBase().concat([
            {
                device: { platform: 'ios' },
                options: {
                    width: 276
                }
            },
            {
                device: { platform: 'android' },
                options: {
                    lWidth: '60%',
                    pWidth: '80%'
                }
            }
        ]);
    }
});

export let title = '';


export const custom = function(options) {
    const deferred = new Deferred();

    const defaultOptions = new FakeDialogComponent().option();

    options = extend(defaultOptions, options);

    const $element = $('<div>')
        .addClass(DX_DIALOG_CLASSNAME)
        .appendTo(getViewport());

    const isMessageDefined = 'message' in options;
    const isMessageHtmlDefined = 'messageHtml' in options;

    if(isMessageDefined) {
        errors.log('W1013');
    }

    const messageHtml = String(isMessageHtmlDefined ? options.messageHtml : options.message);

    const $message = $('<div>').addClass(DX_DIALOG_MESSAGE_CLASSNAME)
        .html(messageHtml);

    const popupToolbarItems = [];

    each(options.buttons || [DEFAULT_BUTTON], function() {
        const action = new Action(this.onClick, {
            context: popupInstance
        });

        popupToolbarItems.push({
            toolbar: 'bottom',
            location: devices.current().android ? 'after' : 'center',
            widget: 'dxButton',
            options: extend({}, this, {
                onClick: function() {
                    const result = action.execute(...arguments);
                    hide(result);
                }
            })
        });
    });

    const popupInstance = new Popup($element, extend({
        title: options.title || title,
        showTitle: ensureDefined(options.showTitle, true),
        dragEnabled: ensureDefined(options.dragEnabled, true),
        height: 'auto',
        width: function() {
            const isPortrait = $(window).height() > $(window).width();
            const key = (isPortrait ? 'p' : 'l') + 'Width';
            const widthOption = Object.prototype.hasOwnProperty.call(options, key) ? options[key] : options['width'];

            return isFunction(widthOption) ? widthOption() : widthOption;
        },
        showCloseButton: options.showCloseButton || false,
        ignoreChildEvents: false,
        onContentReady: function(args) {
            args.component.$content()
                .addClass(DX_DIALOG_CONTENT_CLASSNAME)
                .append($message);
        },
        onShowing: function(e) {
            e.component
                .bottomToolbar()
                .addClass(DX_DIALOG_BUTTONS_CLASSNAME)
                .find(`.${DX_BUTTON_CLASSNAME}`)
                .addClass(DX_DIALOG_BUTTON_CLASSNAME);

            resetActiveElement();
        },
        onShown: function(e) {
            const $firstButton = e.component
                .bottomToolbar()
                .find(`.${DX_BUTTON_CLASSNAME}`)
                .first();

            eventsEngine.trigger($firstButton, 'focus');
        },
        onHiding: function() {
            deferred.reject();
        },
        toolbarItems: popupToolbarItems,
        animation: {
            show: {
                type: 'pop',
                duration: 400
            },
            hide: {
                type: 'pop',
                duration: 400,
                to: {
                    opacity: 0,
                    scale: 0
                },
                from: {
                    opacity: 1,
                    scale: 1
                }
            }
        },
        rtlEnabled: config().rtlEnabled,
        boundaryOffset: { h: 10, v: 0 }
    }, options.popupOptions));

    popupInstance._$wrapper.addClass(DX_DIALOG_WRAPPER_CLASSNAME);

    if(options.position) {
        popupInstance.option('position', options.position);
    }

    popupInstance._$wrapper
        .addClass(DX_DIALOG_ROOT_CLASSNAME);

    function show() {
        popupInstance.show();
        return deferred.promise();
    }

    function hide(value) {
        deferred.resolve(value);
        popupInstance.hide().done(function() {
            popupInstance.$element().remove();
        });
    }

    return {
        show: show,
        hide: hide
    };
};

export const alert = function(messageHtml, title, showTitle) {
    const options = isPlainObject(messageHtml) ? messageHtml : { title, messageHtml, showTitle, dragEnabled: showTitle };

    return custom(options).show();
};

export const confirm = function(messageHtml, title, showTitle) {
    const options = isPlainObject(messageHtml)
        ? messageHtml
        : {
            title,
            messageHtml,
            showTitle,
            buttons: [
                { text: messageLocalization.format('Yes'), onClick: function() { return true; } },
                { text: messageLocalization.format('No'), onClick: function() { return false; } }
            ],
            dragEnabled: showTitle
        };

    return custom(options).show();
};

///#DEBUG
export const DEBUG_set_title = function(value) {
    title = value;
};
///#ENDDEBUG
