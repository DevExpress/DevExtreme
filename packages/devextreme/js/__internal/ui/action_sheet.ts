import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { noop } from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getWindow } from '@js/core/utils/window';
import type { DxEvent } from '@js/events';
import type { Properties } from '@js/ui/action_sheet';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { OptionChanged } from '@ts/core/widget/types';
import Button from '@ts/ui/button/wrapper';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';
import type { PopoverProperties } from '@ts/ui/popover/m_popover';
import Popover from '@ts/ui/popover/m_popover';
import type { PopupProperties } from '@ts/ui/popup/m_popup';
import Popup from '@ts/ui/popup/m_popup';

// STYLE actionSheet

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

class ActionSheet extends CollectionWidget<Properties> {
  _$itemContainer!: dxElementWrapper;

  _popup!: Popup | Popover;

  _$popup!: dxElementWrapper;

  _$cancelButton?: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      usePopover: false,
      // @ts-expect-error ts-error
      target: null,
      title: '',
      showTitle: true,
      showCancelButton: true,
      cancelText: messageLocalization.format('Cancel'),
      // @ts-expect-error ts-error
      onCancelClick: null,
      visible: false,
      noDataText: '',
      focusStateEnabled: false,
      selectByClick: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<Properties>[] {
    return super._defaultOptionsRules().concat([{
      device: { platform: 'ios', tablet: true },
      options: {
        usePopover: true,
      },
    }]);
  }

  _initTemplates(): void {
    super._initTemplates();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(($container, data) => {
        // @ts-expect-error ts-error
        const button = new Button($('<div>'), extend({
          onClick: data?.click,
          stylingMode: data?.stylingMode || ACTION_SHEET_BUTTON_DEFAULT_STYLING_MODE,
        }, data));
        $container.append(button.$element());
      }, ['disabled', 'icon', 'text', 'type', 'onClick', 'click', 'stylingMode'], this.option('integrationOptions.watchMethod')),
    });
  }

  _itemContainer(): dxElementWrapper {
    return this._$itemContainer;
  }

  _itemClass(): string {
    return ACTION_SHEET_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return ACTION_SHEET_ITEM_DATA_KEY;
  }

  _toggleVisibility(): void {}

  _renderDimensions(): void {}

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(ACTION_SHEET_CLASS);
    this._createItemContainer();
  }

  _render(): void {
    this._renderPopup();
  }

  _createItemContainer(): void {
    this._$itemContainer = $('<div>').addClass(ACTION_SHEET_CONTAINER_CLASS);
    this._renderDisabled();
  }

  _renderDisabled(): void {
    const { disabled } = this.option();

    this._$itemContainer.toggleClass('dx-state-disabled', disabled);
  }

  _renderPopup(): void {
    this._$popup = $('<div>').appendTo(this.$element());
    if (this._isPopoverMode()) {
      this._createPopover();
    } else {
      this._createPopup();
    }

    this._renderPopupTitle();
    this._mapPopupOption('visible');
  }

  _mapPopupOption(optionName: keyof Properties): void {
    this._popup?.option(optionName, this.option(optionName));
  }

  _isPopoverMode(): boolean {
    const { usePopover, target } = this.option();

    return !!(usePopover && target);
  }

  _renderPopupTitle(): void {
    this._mapPopupOption('showTitle');
    this._popup?.$wrapper().toggleClass(ACTION_SHEET_WITHOUT_TITLE_CLASS, !this.option('showTitle'));
  }

  _clean(): void {
    if (this._$popup) {
      this._$popup.remove();
    }

    super._clean();
  }

  _overlayConfig(): PopoverProperties | PopupProperties {
    const { title } = this.option();
    return {
      onInitialized: (args): void => {
        // @ts-expect-error ts-error
        this._popup = args.component;
      },
      disabled: false,
      showTitle: true,
      title,
      deferRendering: true,
      onContentReady: this._popupContentReadyAction.bind(this),
      onHidden: (): void => {
        this.hide();
      },
    };
  }

  _createPopover(): void {
    this._createComponent(this._$popup, Popover, extend(this._overlayConfig(), {
      width: this.option('width') || 200,
      height: this.option('height') || 'auto',
      target: this.option('target'),
    }));

    this._popup.$overlayContent().attr('role', 'dialog');

    this._popup.$wrapper().addClass(ACTION_SHEET_POPOVER_WRAPPER_CLASS);
  }

  _createPopup(): void {
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
  }

  _popupContentReadyAction(): void {
    this._popup.$content().append(this._$itemContainer);
    this._attachClickEvent();
    this._attachHoldEvent();

    this._prepareContent();
    this._renderContent();

    this._renderCancelButton();
  }

  _renderCancelButton(): void {
    if (this._isPopoverMode()) {
      return;
    }

    if (this._$cancelButton) {
      this._$cancelButton.remove();
    }

    const { showCancelButton, cancelText } = this.option();

    if (showCancelButton) {
      const cancelClickAction = this._createActionByOption('onCancelClick') || noop;

      this._$cancelButton = $('<div>')
        .addClass(ACTION_SHEET_CANCEL_BUTTON_CLASS)
        .appendTo(this._popup?.$content());

      this._createComponent<Button, ButtonProperties>(this._$cancelButton, Button, {
        disabled: false,
        stylingMode: ACTION_SHEET_BUTTON_DEFAULT_STYLING_MODE,
        text: cancelText,
        onClick: (e) => {
          const hidingArgs = { event: e, cancel: false };
          cancelClickAction(hidingArgs);

          if (!hidingArgs.cancel) {
            this.hide();
          }
        },
        // @ts-expect-error
        integrationOptions: {},
      });
    }
  }

  _attachItemClickEvent(): void {}

  _itemClickHandler(e: DxEvent): void {
    super._itemClickHandler(e);

    if (!$(e.target).is('.dx-state-disabled, .dx-state-disabled *')) {
      this.hide();
    }
  }

  _itemHoldHandler(e: DxEvent): void {
    super._itemHoldHandler(e);

    if (!$(e.target).is('.dx-state-disabled, .dx-state-disabled *')) {
      this.hide();
    }
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'width':
      case 'height':
      case 'visible':
      case 'title':
        this._mapPopupOption(name);
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
        super._optionChanged(args);
    }
  }

  toggle(showing: boolean): PromiseLike<unknown> {
    const d = Deferred();
    // @ts-expect-error ts-error
    this._popup.toggle(showing).done(() => {
      this.option('visible', showing);
      // @ts-expect-error ts-error
      d.resolveWith(this);
    });

    return d.promise();
  }

  show(): PromiseLike<unknown> {
    return this.toggle(true);
  }

  hide(): PromiseLike<unknown> {
    return this.toggle(false);
  }
}

registerComponent('dxActionSheet', ActionSheet);

export default ActionSheet;
