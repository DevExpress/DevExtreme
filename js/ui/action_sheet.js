import $ from '../core/renderer';
import { getWindow } from '../core/utils/window';
const window = getWindow();
import { noop } from '../core/utils/common';
import messageLocalization from '../localization/message';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import Button from './button';
import CollectionWidget from './collection/ui.collection_widget.edit';
import Popup from './popup';
import Popover from './popover';
import { BindableTemplate } from '../core/templates/bindable_template';
import { Deferred } from '../core/utils/deferred';

// STYLE actionSheet

const ACTION_SHEET_CLASS = 'dx-actionsheet';
const ACTION_SHEET_CONTAINER_CLASS = 'dx-actionsheet-container';
const ACTION_SHEET_POPUP_WRAPPER_CLASS = 'dx-actionsheet-popup-wrapper';
const ACTION_SHEET_POPOVER_WRAPPER_CLASS = 'dx-actionsheet-popover-wrapper';
const ACTION_SHEET_CANCEL_BUTTON_CLASS = 'dx-actionsheet-cancel';
const ACTION_SHEET_ITEM_CLASS = 'dx-actionsheet-item';
const ACTION_SHEET_ITEM_DATA_KEY = 'dxActionSheetItemData';
const ACTION_SHEET_WITHOUT_TITLE_CLASS = 'dx-actionsheet-without-title';


const ActionSheet = CollectionWidget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            usePopover: false,

            target: null,

            title: '',

            showTitle: true,

            showCancelButton: true,

            cancelText: messageLocalization.format('Cancel'),

            onCancelClick: null,

            visible: false,

            /**
            * @name dxActionSheetOptions.noDataText
            * @hidden
            */
            noDataText: '',

            /**
            * @name dxActionSheetOptions.activeStateEnabled
            * @hidden
            */

            /**
            * @name dxActionSheetOptions.selectedIndex
            * @hidden
            */

            /**
            * @name dxActionSheetOptions.selectedItem
            * @hidden
            */

            /**
            * @name dxActionSheetOptions.onSelectionChanged
            * @action
            * @hidden
            */

            /**
            * @name dxActionSheetOptions.selectedItems
            * @hidden
            */

            /**
            * @name dxActionSheetOptions.selectedItemKeys
            * @hidden
            */

            /**
            * @name dxActionSheetOptions.keyExpr
            * @hidden
            */

            /**
            * @name dxActionSheetOptions.accessKey
            * @hidden
            */

            /**
            * @name dxActionSheetOptions.tabIndex
            * @hidden
            */


            /**
             * @name dxActionSheetOptions.focusStateEnabled
             * @type boolean
             * @default false
             * @hidden
             */
            focusStateEnabled: false,

            selectionByClick: false
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: { platform: 'ios', tablet: true },
            options: {
                usePopover: true
            }
        }]);
    },

    _initTemplates: function() {
        this.callBase();
        /**
        * @name dxActionSheetItem.visible
        * @type boolean
        * @default true
        * @hidden
        */
        /**
        * @name dxActionSheetItem.html
        * @type String
        * @hidden
        */
        this._templateManager.addDefaultTemplates({
            item: new BindableTemplate(function($container, data) {
                const button = new Button($('<div>'), extend({ onClick: data && data.click }, data));
                $container.append(button.$element());
            }, ['disabled', 'icon', 'text', 'type', 'onClick', 'click'], this.option('integrationOptions.watchMethod'))
        });
    },

    _itemContainer: function() {
        return this._$itemContainer;
    },

    _itemClass: function() {
        return ACTION_SHEET_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return ACTION_SHEET_ITEM_DATA_KEY;
    },

    _toggleVisibility: noop,

    _renderDimensions: noop,

    _initMarkup: function() {
        this.callBase();
        this.$element().addClass(ACTION_SHEET_CLASS);
        this._createItemContainer();
    },

    _render: function() {
        this._renderPopup();
    },

    _createItemContainer: function() {
        this._$itemContainer = $('<div>').addClass(ACTION_SHEET_CONTAINER_CLASS);
        this._renderDisabled();
    },

    _renderDisabled: function() {
        this._$itemContainer.toggleClass('dx-state-disabled', this.option('disabled'));
    },

    _renderPopup: function() {
        this._$popup = $('<div>').appendTo(this.$element());
        this._isPopoverMode() ? this._createPopover() : this._createPopup();
        this._renderPopupTitle();
        this._mapPopupOption('visible');
    },

    _mapPopupOption: function(optionName) {
        this._popup && this._popup.option(optionName, this.option(optionName));
    },

    _isPopoverMode: function() {
        return this.option('usePopover') && this.option('target');
    },

    _renderPopupTitle: function() {
        this._mapPopupOption('showTitle');
        this._popup && this._popup.$wrapper().toggleClass(ACTION_SHEET_WITHOUT_TITLE_CLASS, !this.option('showTitle'));
    },

    _clean: function() {
        if(this._$popup) {
            this._$popup.remove();
        }

        this.callBase();
    },

    _overlayConfig: function() {
        return {
            onInitialized: (function(args) {
                this._popup = args.component;
            }).bind(this),
            disabled: false,
            showTitle: true,
            title: this.option('title'),
            deferRendering: !window.angular,
            onContentReady: this._popupContentReadyAction.bind(this),
            onHidden: this.hide.bind(this)
        };
    },

    _createPopover: function() {
        this._createComponent(this._$popup, Popover, extend(this._overlayConfig(), {
            width: this.option('width') || 200,
            height: this.option('height') || 'auto',
            target: this.option('target')
        }));

        this._popup.$wrapper().addClass(ACTION_SHEET_POPOVER_WRAPPER_CLASS);
    },

    _createPopup: function() {
        this._createComponent(this._$popup, Popup, extend(this._overlayConfig(), {
            dragEnabled: false,
            width: this.option('width') || '100%',
            height: this.option('height') || 'auto',
            showCloseButton: false,
            position: {
                my: 'bottom',
                at: 'bottom',
                of: window
            },
            animation: {
                show: {
                    type: 'slide',
                    duration: 400,
                    from: {
                        position: {
                            my: 'top',
                            at: 'bottom',
                            of: window
                        }
                    },
                    to: {
                        position: {
                            my: 'bottom',
                            at: 'bottom',
                            of: window
                        }
                    }
                },
                hide: {
                    type: 'slide',
                    duration: 400,
                    from: {
                        position: {
                            my: 'bottom',
                            at: 'bottom',
                            of: window
                        }
                    },
                    to: {
                        position: {
                            my: 'top',
                            at: 'bottom',
                            of: window
                        }
                    }
                }
            }
        }));

        this._popup.$wrapper().addClass(ACTION_SHEET_POPUP_WRAPPER_CLASS);
    },

    _popupContentReadyAction: function() {
        this._popup.$content().append(this._$itemContainer);
        this._attachClickEvent();
        this._attachHoldEvent();

        this._prepareContent();
        this._renderContent();

        this._renderCancelButton();
    },

    _renderCancelButton: function() {
        if(this._isPopoverMode()) {
            return;
        }

        if(this._$cancelButton) {
            this._$cancelButton.remove();
        }

        if(this.option('showCancelButton')) {
            const cancelClickAction = this._createActionByOption('onCancelClick') || noop;
            const that = this;

            this._$cancelButton = $('<div>').addClass(ACTION_SHEET_CANCEL_BUTTON_CLASS)
                .appendTo(this._popup && this._popup.$content());
            this._createComponent(this._$cancelButton, Button, {
                disabled: false,
                text: this.option('cancelText'),
                onClick: function(e) {
                    const hidingArgs = { event: e, cancel: false };
                    cancelClickAction(hidingArgs);

                    if(!hidingArgs.cancel) {
                        that.hide();
                    }
                },
                integrationOptions: {}
            });
        }
    },

    _attachItemClickEvent: noop,

    _itemClickHandler: function(e) {
        this.callBase(e);

        if(!$(e.target).is('.dx-state-disabled, .dx-state-disabled *')) {
            this.hide();
        }
    },

    _itemHoldHandler: function(e) {
        this.callBase(e);

        if(!$(e.target).is('.dx-state-disabled, .dx-state-disabled *')) {
            this.hide();
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'width':
            case 'height':
            case 'visible':
            case 'title':
                this._mapPopupOption(args.name);
                break;
            case 'disabled':
                this._renderDisabled();
                break;
            case 'showTitle':
                this._renderPopupTitle();
                break;
            case 'showCancelButton':
            case 'onCancelClick':
            case 'cancelText':
                this._renderCancelButton();
                break;
            case 'target':
            case 'usePopover':
            case 'items':
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    toggle: function(showing) {
        const that = this;
        const d = new Deferred();

        that._popup.toggle(showing).done(function() {
            that.option('visible', showing);
            d.resolveWith(that);
        });

        return d.promise();
    },

    show: function() {
        return this.toggle(true);
    },

    hide: function() {
        return this.toggle(false);
    }

    /**
    * @name dxActionSheet.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxActionSheet.focus
    * @publicName focus()
    * @hidden
    */

});

registerComponent('dxActionSheet', ActionSheet);

export default ActionSheet;
