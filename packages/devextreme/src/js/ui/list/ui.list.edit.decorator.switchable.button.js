import { getWidth, getOuterWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import fx from '../../animation/fx';
import Button from '../button';
import messageLocalization from '../../localization/message';
import { register as registerDecorator } from './ui.list.edit.decorator_registry';
import SwitchableEditDecorator from './ui.list.edit.decorator.switchable';

const SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS = 'dx-list-switchable-delete-button-container';
const SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS = 'dx-list-switchable-delete-button-wrapper';
const SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS = 'dx-list-switchable-delete-button-inner-wrapper';
const SWITCHABLE_DELETE_BUTTON_CLASS = 'dx-list-switchable-delete-button';

const SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION = 200;

const SwitchableButtonEditDecorator = SwitchableEditDecorator.inherit({

    _init: function() {
        this.callBase.apply(this, arguments);

        const $buttonContainer = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_CONTAINER_CLASS);
        const $buttonWrapper = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_WRAPPER_CLASS);
        const $buttonInnerWrapper = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_INNER_WRAPPER_CLASS);
        const $button = $('<div>').addClass(SWITCHABLE_DELETE_BUTTON_CLASS);

        this._list._createComponent($button, Button, {
            text: messageLocalization.format('dxListEditDecorator-delete'),
            type: 'danger',
            onClick: (function(e) {
                this._deleteItem();
                e.event.stopPropagation();
            }).bind(this),
            integrationOptions: {}
        });

        $buttonContainer.append($buttonWrapper);
        $buttonWrapper.append($buttonInnerWrapper);
        $buttonInnerWrapper.append($button);

        this._$buttonContainer = $buttonContainer;
    },

    _enablePositioning: function($itemElement) {
        this.callBase.apply(this, arguments);

        fx.stop(this._$buttonContainer, true);
        this._$buttonContainer.appendTo($itemElement);
    },

    _disablePositioning: function() {
        this.callBase.apply(this, arguments);

        this._$buttonContainer.detach();
    },

    _animatePrepareDeleteReady: function() {
        const rtl = this._isRtlEnabled();
        const listWidth = getWidth(this._list.$element());
        const buttonWidth = this._buttonWidth();
        const fromValue = rtl ? listWidth : -buttonWidth;
        const toValue = rtl ? listWidth - buttonWidth : 0;

        return fx.animate(this._$buttonContainer, {
            type: 'custom',
            duration: SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION,
            from: { right: fromValue },
            to: { right: toValue }
        });
    },

    _animateForgetDeleteReady: function() {
        const rtl = this._isRtlEnabled();
        const listWidth = getWidth(this._list.$element());
        const buttonWidth = this._buttonWidth();
        const fromValue = rtl ? listWidth - buttonWidth : 0;
        const toValue = rtl ? listWidth : -buttonWidth;

        return fx.animate(this._$buttonContainer, {
            type: 'custom',
            duration: SWITCHABLE_DELETE_BUTTON_ANIMATION_DURATION,
            from: { right: fromValue },
            to: { right: toValue }
        });
    },

    _buttonWidth: function() {
        if(!this._buttonContainerWidth) {
            this._buttonContainerWidth = getOuterWidth(this._$buttonContainer);
        }
        return this._buttonContainerWidth;
    },

    dispose: function() {
        if(this._$buttonContainer) {
            this._$buttonContainer.remove();
        }

        this.callBase.apply(this, arguments);
    }

});


const TOGGLE_DELETE_SWITCH_CONTAINER_CLASS = 'dx-list-toggle-delete-switch-container';
const TOGGLE_DELETE_SWITCH_CLASS = 'dx-list-toggle-delete-switch';

registerDecorator(
    'delete',
    'toggle',
    SwitchableButtonEditDecorator.inherit({

        beforeBag: function(config) {
            const $itemElement = config.$itemElement;
            const $container = config.$container;

            const $toggle = $('<div>').addClass(TOGGLE_DELETE_SWITCH_CLASS);
            this._list._createComponent($toggle, Button, {
                icon: 'toggle-delete',
                onClick: (function(e) {
                    fx.stop(this._$buttonContainer, false);
                    this._toggleDeleteReady($itemElement);
                    e.event.stopPropagation();
                }).bind(this),
                integrationOptions: {}
            });

            $container.addClass(TOGGLE_DELETE_SWITCH_CONTAINER_CLASS);
            $container.append($toggle);
        }

    })
);


registerDecorator(
    'delete',
    'slideButton',
    SwitchableButtonEditDecorator.inherit({

        _shouldHandleSwipe: true,

        _swipeEndHandler: function($itemElement, args) {
            if(args.targetOffset !== 0) {
                fx.stop(this._$buttonContainer, false);
                this._toggleDeleteReady($itemElement);
            }

            return true;
        }

    })
);

export default SwitchableButtonEditDecorator;
