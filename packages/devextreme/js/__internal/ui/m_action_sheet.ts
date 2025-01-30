import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { noop } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getWindow } from '@js/core/utils/window';
import Button from '@js/ui/button';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.edit';
import Popover from '@js/ui/popover/ui.popover';
import Popup from '@js/ui/popup/ui.popup';

const window = getWindow();

const ACTION_SHEET_CLASS = 'dx-actionsheet';
const ACTION_SHEET_CONTAINER_CLASS = 'dx-actionsheet-container';
const ACTION_SHEET_POPUP_WRAPPER_CLASS = 'dx-actionsheet-popup-wrapper';
const ACTION_SHEET_POPOVER_WRAPPER_CLASS = 'dx-actionsheet-popover-wrapper';
const ACTION_SHEET_CANCEL_BUTTON_CLASS = 'dx-actionsheet-cancel';
const ACTION_SHEET_ITEM_CLASS = 'dx-actionsheet-item';
const ACTION_SHEET_ITEM_DATA_KEY = 'dxActionSheetItemData';
const ACTION_SHEET_WITHOUT_TITLE_CLASS = 'dx-actionsheet-without-title';
const ACTION_SHEET_BUTTON_DEFAULT_STYLING_MODE = 'outlined';
// @ts-expect-error
const ActionSheet = CollectionWidget.inherit({

  _getDefaultOptions() {
    return extend(this.callBase(), {
      usePopover: false,

      target: null,

      title: '',

      showTitle: true,

      showCancelButton: true,

      cancelText: messageLocalization.format('Cancel'),

      onCancelClick: null,

      visible: false,

      noDataText: '',

      focusStateEnabled: false,

      selectByClick: false,
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([{
      device: { platform: 'ios', tablet: true },
      options: {
        usePopover: true,
      },
    }]);
  },

  _initTemplates() {
    this.callBase();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(($container, data) => {
        // @ts-expect-error
        const button = new Button($('<div>'), extend({
          onClick: data && data.click,
          stylingMode: data && data.stylingMode || ACTION_SHEET_BUTTON_DEFAULT_STYLING_MODE,
        }, data));
        $container.append(button.$element());
      }, ['disabled', 'icon', 'text', 'type', 'onClick', 'click', 'stylingMode'], this.option('integrationOptions.watchMethod')),
    });
  },

  _itemContainer() {
    return this._$itemContainer;
  },

  _itemClass() {
    return ACTION_SHEET_ITEM_CLASS;
  },

  _itemDataKey() {
    return ACTION_SHEET_ITEM_DATA_KEY;
  },

  _toggleVisibility: noop,

  _renderDimensions: noop,

  _initMarkup() {
    this.callBase();
    this.$element().addClass(ACTION_SHEET_CLASS);
    this._createItemContainer();
  },

  _render() {
    this._renderPopup();
  },

  _createItemContainer() {
    this._$itemContainer = $('<div>').addClass(ACTION_SHEET_CONTAINER_CLASS);
    this._renderDisabled();
  },

  _renderDisabled() {
    this._$itemContainer.toggleClass('dx-state-disabled', this.option('disabled'));
  },

  _renderPopup() {
    this._$popup = $('<div>').appendTo(this.$element());
    this._isPopoverMode() ? this._createPopover() : this._createPopup();
    this._renderPopupTitle();
    this._mapPopupOption('visible');
  },

  _mapPopupOption(optionName) {
    this._popup && this._popup.option(optionName, this.option(optionName));
  },

  _isPopoverMode() {
    return this.option('usePopover') && this.option('target');
  },

  _renderPopupTitle() {
    this._mapPopupOption('showTitle');
    this._popup && this._popup.$wrapper().toggleClass(ACTION_SHEET_WITHOUT_TITLE_CLASS, !this.option('showTitle'));
  },

  _clean() {
    if (this._$popup) {
      this._$popup.remove();
    }

    this.callBase();
  },

  _overlayConfig() {
    return {
      onInitialized: function (args) {
        this._popup = args.component;
      }.bind(this),
      disabled: false,
      showTitle: true,
      title: this.option('title'),
      deferRendering: true,
      onContentReady: this._popupContentReadyAction.bind(this),
      onHidden: this.hide.bind(this),
    };
  },

  _createPopover() {
    this._createComponent(this._$popup, Popover, extend(this._overlayConfig(), {
      width: this.option('width') || 200,
      height: this.option('height') || 'auto',
      target: this.option('target'),
    }));

    this._popup.$overlayContent().attr('role', 'dialog');

    this._popup.$wrapper().addClass(ACTION_SHEET_POPOVER_WRAPPER_CLASS);
  },

  _createPopup() {
    this._createComponent(this._$popup, Popup, extend(this._overlayConfig(), {
      dragEnabled: false,
      width: this.option('width') || '100%',
      height: this.option('height') || 'auto',
      showCloseButton: false,
      position: {
        my: 'bottom',
        at: 'bottom',
        of: window,
      },
      animation: {
        show: {
          type: 'slide',
          duration: 400,
          from: {
            position: {
              my: 'top',
              at: 'bottom',
              of: window,
            },
          },
          to: {
            position: {
              my: 'bottom',
              at: 'bottom',
              of: window,
            },
          },
        },
        hide: {
          type: 'slide',
          duration: 400,
          from: {
            position: {
              my: 'bottom',
              at: 'bottom',
              of: window,
            },
          },
          to: {
            position: {
              my: 'top',
              at: 'bottom',
              of: window,
            },
          },
        },
      },
    }));

    this._popup.$wrapper().addClass(ACTION_SHEET_POPUP_WRAPPER_CLASS);
  },

  _popupContentReadyAction() {
    this._popup.$content().append(this._$itemContainer);
    this._attachClickEvent();
    this._attachHoldEvent();

    this._prepareContent();
    this._renderContent();

    this._renderCancelButton();
  },

  _renderCancelButton() {
    if (this._isPopoverMode()) {
      return;
    }

    if (this._$cancelButton) {
      this._$cancelButton.remove();
    }

    if (this.option('showCancelButton')) {
      const cancelClickAction = this._createActionByOption('onCancelClick') || noop;
      const that = this;

      this._$cancelButton = $('<div>').addClass(ACTION_SHEET_CANCEL_BUTTON_CLASS)
        .appendTo(this._popup && this._popup.$content());
      this._createComponent(this._$cancelButton, Button, {
        disabled: false,
        stylingMode: ACTION_SHEET_BUTTON_DEFAULT_STYLING_MODE,
        text: this.option('cancelText'),
        onClick(e) {
          const hidingArgs = { event: e, cancel: false };
          cancelClickAction(hidingArgs);

          if (!hidingArgs.cancel) {
            that.hide();
          }
        },
        integrationOptions: {},
      });
    }
  },

  _attachItemClickEvent: noop,

  _itemClickHandler(e) {
    this.callBase(e);

    if (!$(e.target).is('.dx-state-disabled, .dx-state-disabled *')) {
      this.hide();
    }
  },

  _itemHoldHandler(e) {
    this.callBase(e);

    if (!$(e.target).is('.dx-state-disabled, .dx-state-disabled *')) {
      this.hide();
    }
  },

  _optionChanged(args) {
    switch (args.name) {
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

  toggle(showing) {
    const that = this;
    const d = Deferred();

    that._popup.toggle(showing).done(() => {
      that.option('visible', showing);
      d.resolveWith(that);
    });

    return d.promise();
  },

  show() {
    return this.toggle(true);
  },

  hide() {
    return this.toggle(false);
  },

});

registerComponent('dxActionSheet', ActionSheet);

export default ActionSheet;
