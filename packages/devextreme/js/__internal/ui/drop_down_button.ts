import type { template } from '@js/common';
import type { PositionConfig } from '@js/common/core/animation';
import registerComponent from '@js/core/component_registrator';
import type { DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { compileGetter } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getImageContainer } from '@js/core/utils/icon';
import type { DataSourceLike } from '@js/data/data_source';
import type {
  Item as ButtonGroupItem,
  Properties as ButtonGroupProperties,
} from '@js/ui/button_group';
import ButtonGroup from '@js/ui/button_group';
import type { Item, Properties } from '@js/ui/drop_down_button';
import type { ItemClickEvent } from '@js/ui/list';
import type { PositionAlignment } from '@js/ui/popup';
import messageLocalization from '@ts/core/localization/message';
import { getPublicElement } from '@ts/core/m_element';
import { Guid } from '@ts/core/m_guid';
import { FunctionTemplate } from '@ts/core/templates/m_function_template';
import { ensureDefined } from '@ts/core/utils/m_common';
import { isDefined, isObject, isPlainObject } from '@ts/core/utils/m_type';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type { DataSourceType } from '@ts/data/data_controller/data_controller';
import DataController from '@ts/data/data_controller/data_controller';
import { getElementWidth } from '@ts/ui/drop_down_editor/utils';
import type { ListBaseProperties } from '@ts/ui/list/list.base';
import List from '@ts/ui/list/list.edit.search';
import type { PopupProperties } from '@ts/ui/popup/popup';
import Popup from '@ts/ui/popup/popup';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const DROP_DOWN_BUTTON_CONTENT = 'dx-dropdownbutton-content';
const DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';
const DROP_DOWN_BUTTON_HAS_ARROW_CLASS = 'dx-dropdownbutton-has-arrow';
const DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS = 'dx-dropdownbutton-popup-wrapper';
const DROP_DOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
const DX_BUTTON_TEXT_CLASS = 'dx-button-text';
const DX_BUTTON_CLASS = 'dx-button';
const DX_ICON_RIGHT_CLASS = 'dx-icon-right';

const OVERLAY_CONTENT_LABEL = 'Dropdown';

export interface DropDownButtonProperties extends Properties {
  buttonGroupOptions?: ButtonGroupItem;
  grouped?: boolean;
  groupTemplate?: string;
  _cached_buttonGroupOptions?: ButtonGroupItem;
  _cached_dropDownOptions?: PopupProperties;
}

export interface AriaAttributes {
  expanded?: boolean;
  haspopup?: string;
  label?: string;
  owns?: string;
}

type ItemClickActionType = (event?: Partial<ItemClickEvent>) => Partial<ItemClickEvent> | boolean;

class DropDownButton extends Widget<DropDownButtonProperties> {
  _popup?: Popup;

  _buttonGroup!: ButtonGroup;

  _dataController!: DataController;

  _loadSingleDeferred?: DeferredObj<unknown>;

  _list!: List;

  _lastSelectedItemData?: Item;

  _popupContentId?: string;

  _selectionChangedAction!: (event?: Record<string, unknown>) => void;

  _itemClickAction!: ItemClickActionType;

  _actionClickAction!: (event?: Record<string, unknown>) => void;

  _actionItem?: unknown;

  _keyGetter?: (obj: unknown) => unknown;

  _displayGetter?: (obj: unknown) => unknown;

  _getDefaultOptions(): DropDownButtonProperties {
    return {
      ...super._getDefaultOptions(),
      itemTemplate: 'item',
      keyExpr: 'this',
      selectedItem: null,
      selectedItemKey: null,
      stylingMode: 'outlined',
      deferRendering: true,
      noDataText: messageLocalization.format('dxCollectionWidget-noDataText'),
      useSelectMode: false,
      splitButton: false,
      showArrowIcon: true,
      // @ts-expect-error public API needs to be fixed
      template: null,
      text: '',
      type: 'normal',
      onButtonClick: null,
      onSelectionChanged: null,
      onItemClick: null,
      opened: false,
      items: null,
      dataSource: null,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      dropDownOptions: {},
      dropDownContentTemplate: 'content',
      wrapItemText: false,
      useItemTextAsTitle: true,
      grouped: false,
      groupTemplate: 'group',
      buttonGroupOptions: {},
      _cached_buttonGroupOptions: {},
      _cached_dropDownOptions: {},
    };
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    extend(this._optionsByReference, {
      selectedItem: true,
    });
  }

  _init(): void {
    super._init();
    this._createItemClickAction();
    this._createActionClickAction();
    this._createSelectionChangedAction();
    this._initDataController();
    this._compileKeyGetter();
    this._compileDisplayGetter();

    const { buttonGroupOptions, dropDownOptions } = this.option();
    this._options.cache('buttonGroupOptions', buttonGroupOptions);
    this._options.cache('dropDownOptions', dropDownOptions);
  }

  _initDataController(): void {
    const { dataSource, items, keyExpr } = this.option();
    this._dataController = new DataController(
      // @ts-expect-error DataController constructor typing needs to be fixed
      dataSource ?? items,
      { key: keyExpr },
    );
  }

  _initTemplates(): void {
    this._templateManager.addDefaultTemplates({
      content: new FunctionTemplate((options) => {
        const $popupContent = $(options.container);
        const $listContainer = $('<div>').appendTo($popupContent);

        this._list = this._createComponent($listContainer, List, this._listOptions());

        this._list.registerKeyHandler('escape', this._escHandler.bind(this));
        this._list.registerKeyHandler('tab', this._escHandler.bind(this));
        this._list.registerKeyHandler('leftArrow', this._escHandler.bind(this));
        this._list.registerKeyHandler('rightArrow', this._escHandler.bind(this));
      }),
    });
    super._initTemplates();
  }

  _compileKeyGetter(): void {
    const key = this._dataController.key();
    if (key !== undefined) {
      this._keyGetter = compileGetter(key) as (obj: unknown) => unknown;
    }
  }

  _compileDisplayGetter(): void {
    const { displayExpr } = this.option();
    // @ts-expect-error core/utils compileGetter fn typing needs to be fixed
    this._displayGetter = compileGetter(displayExpr);
  }

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(DROP_DOWN_BUTTON_CLASS);
    this._renderButtonGroup();
    this._updateArrowClass();

    if (isDefined(this.option('selectedItemKey'))) {
      this._loadSelectedItem().done(this._updateActionButton.bind(this));
    }
  }

  // T977758
  _renderFocusTarget(): void {}

  _render(): void {
    if (!this.option('deferRendering') || this.option('opened')) {
      this._renderPopup();
    }

    super._render();
  }

  _renderContentImpl(): Promise<void> | void {
    if (this._popup) {
      this._renderPopupContent();
    }

    return super._renderContentImpl();
  }

  _loadSelectedItem(): DeferredObj<unknown> {
    this._loadSingleDeferred?.reject();
    const d = Deferred();

    if (this._list && this._lastSelectedItemData !== undefined) {
      const cachedResult = this.option('useSelectMode') ? this._list.option('selectedItem') : this._lastSelectedItemData;
      return d.resolve(cachedResult);
    }
    this._lastSelectedItemData = undefined;

    const { selectedItemKey } = this.option();

    if (isDefined(selectedItemKey)) {
      this._dataController.loadSingle(this._dataController.key() as string, selectedItemKey)
        // @ts-expect-error DataController loadSingle method typing needs to be fixed
        .done((item) => { d.resolve(item); })
        .fail(() => {
          d.reject(null);
        });
    } else {
      d.reject(null);
    }

    this._loadSingleDeferred = d;

    // @ts-expect-error ts-expect-error
    return d.promise();
  }

  _createActionClickAction(): void {
    this._actionClickAction = this._createActionByOption('onButtonClick');
  }

  _createSelectionChangedAction(): void {
    this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
  }

  _createItemClickAction(): void {
    this._itemClickAction = this._createActionByOption('onItemClick') as ItemClickActionType;
  }

  _fireSelectionChangedAction(
    { previousValue, value }: { previousValue: unknown; value: unknown },
  ): void {
    this._selectionChangedAction({
      item: value,
      previousItem: previousValue,
    });
  }

  _fireItemClickAction(
    { event, itemElement, itemData }: ItemClickEvent,
  ): Partial<ItemClickEvent> | boolean {
    return this._itemClickAction({
      event,
      itemElement,
      itemData: this._actionItem ?? itemData,
    });
  }

  _formButtonTemplateFn({ text, icon }: ButtonGroupItem, buttonContent: DxElement): void {
    const $firstIcon = getImageContainer(icon);
    const $textContainer = text ? $('<span>').text(text).addClass(DX_BUTTON_TEXT_CLASS) : undefined;
    const $secondIcon = getImageContainer('spindown');
    if ($secondIcon !== null) {
      $secondIcon.addClass(DX_ICON_RIGHT_CLASS);
    }

    const $container = $(buttonContent);
    if ($firstIcon) $container.append($firstIcon);
    if ($textContainer) $container.append($textContainer);
    if ($secondIcon) $container.append($secondIcon);
  }

  _getButtonTemplate(): template {
    const { template, splitButton, showArrowIcon } = this.option();

    if (template) {
      return template;
    }

    return splitButton || !showArrowIcon ? 'content'
      : this._formButtonTemplateFn.bind(this);
  }

  _getActionButtonConfig(): ButtonGroupItem {
    const {
      icon, text, type, splitButton,
    } = this.option();

    const actionButtonConfig = {
      text,
      icon,
      type,
      template: this._getButtonTemplate(),
      elementAttr: {
        class: DROP_DOWN_BUTTON_ACTION_CLASS,
        role: splitButton ? 'menuitem' : undefined,
      },
    };

    return actionButtonConfig;
  }

  _getSpinButtonConfig(): ButtonGroupItem {
    const { type } = this.option();

    const config = {
      type,
      icon: 'spindown',
      elementAttr: {
        class: DROP_DOWN_BUTTON_TOGGLE_CLASS,
        role: 'menuitem',
      },
    };

    return config;
  }

  _getButtonGroupItems(): ButtonGroupItem[] {
    const { splitButton } = this.option();

    const items = [this._getActionButtonConfig()];

    if (splitButton) {
      items.push(this._getSpinButtonConfig());
    }

    return items;
  }

  _buttonGroupItemClick({ event, itemData }: import('@js/ui/button_group').ItemClickEvent): void {
    const itemClass = (itemData as ButtonGroupItem | undefined)?.elementAttr?.class;
    const isActionButton = itemClass === DROP_DOWN_BUTTON_ACTION_CLASS;
    const isToggleButton = itemClass === DROP_DOWN_BUTTON_TOGGLE_CLASS;

    if (isToggleButton) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.toggle();
    } else if (isActionButton) {
      this._actionClickAction({
        event,
        selectedItem: this.option('selectedItem'),
      });

      if (!this.option('splitButton')) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.toggle();
      }
    }
  }

  _getButtonGroupOptions(): ButtonGroupProperties {
    const {
      accessKey,
      focusStateEnabled,
      hoverStateEnabled,
      splitButton,
      stylingMode,
      tabIndex,
    } = this.option();

    const buttonGroupOptions: ButtonGroupProperties = {
      items: this._getButtonGroupItems(),
      width: '100%',
      height: '100%',
      selectionMode: 'none',
      focusStateEnabled,
      hoverStateEnabled,
      stylingMode,
      accessKey,
      tabIndex,
      elementAttr: {
        role: splitButton ? 'menu' : 'group',
      },
      onItemClick: this._buttonGroupItemClick.bind(this),
      onKeyboardHandled: (e): boolean => this._keyboardHandler(e),
      ...this._options.cache('buttonGroupOptions'),
    };

    return buttonGroupOptions;
  }

  _renderPopupContent(): unknown {
    const $content = this._popup?.$content();

    if (!$content) {
      return undefined;
    }

    const template = this._getTemplateByOption('dropDownContentTemplate');

    $content.empty();

    this._popupContentId = `dx-${new Guid()}`;
    this.setAria('id', this._popupContentId, $content);

    return template.render({
      container: getPublicElement($content),
      model: this.option('items') || this._dataController.getDataSource(),
    });
  }

  _popupOptions(): PopupProperties {
    const horizontalAlignment = this.option('rtlEnabled') ? 'right' : 'left';

    const { deferRendering, opened } = this.option();

    const cachedDropDownOptions: PopupProperties = this._options.cache('dropDownOptions');

    const position: PositionConfig = {
      of: this.$element() as unknown as DxElement,
      collision: 'flipfit',
      my: `${horizontalAlignment} top` as PositionAlignment,
      at: `${horizontalAlignment} bottom` as PositionAlignment,
    };

    return {
      dragEnabled: false,
      focusStateEnabled: false,
      deferRendering,
      hideOnOutsideClick: (e): boolean => {
        const $element = this.$element();
        const $buttonClicked = $(e.target).closest(`.${DROP_DOWN_BUTTON_CLASS}`);
        return !$buttonClicked.is($element);
      },
      showTitle: false,
      animation: {
        show: {
          type: 'fade', duration: 0, from: 0, to: 1,
        },
        hide: {
          type: 'fade', duration: 400, from: 1, to: 0,
        },
      },
      width: getElementWidth(this.$element()),
      height: 'auto',
      shading: false,
      position,
      _wrapperClassExternal: DROP_DOWN_EDITOR_OVERLAY_CLASS,
      // @ts-expect-error public API needs to be fixed
      contentTemplate: null,
      ...cachedDropDownOptions,
      ...{ visible: opened },
    };
  }

  _listOptions(): ListBaseProperties {
    const {
      wrapItemText,
      focusStateEnabled,
      hoverStateEnabled,
      useItemTextAsTitle,
      grouped,
      groupTemplate,
      noDataText,
      displayExpr,
      itemTemplate,
      items,

      selectedItemKey,
      useSelectMode,
    } = this.option();

    return {
      selectionMode: useSelectMode ? 'single' : 'none',
      wrapItemText,
      focusStateEnabled,
      hoverStateEnabled,
      useItemTextAsTitle,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onContentReady: () => this._fireContentReadyAction(),
      selectedItemKeys: isDefined(selectedItemKey) && useSelectMode ? [selectedItemKey] : [],
      grouped,
      groupTemplate,
      keyExpr: this._dataController.key(),
      noDataText,
      displayExpr,
      itemTemplate,
      // @ts-expect-error Update dxListOptions.items typings
      items,
      dataSource: this._dataController.getDataSource() as DataSourceLike<Item> | null,
      onItemClick: (e): void => {
        if (!this.option('useSelectMode')) {
          this._lastSelectedItemData = e.itemData;
        }
        this.option('selectedItemKey', this._keyGetter?.(e.itemData));
        const actionResult = this._fireItemClickAction(e);
        if (actionResult !== false) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.toggle(false);
          this._buttonGroup.focus();
        }
      },
    };
  }

  _upDownKeyHandler(): boolean {
    if (this._popup?.option('visible') && this._list) {
      this._list.focus();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.open();
    }

    return true;
  }

  _escHandler(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.close();
    this._buttonGroup.focus();

    return true;
  }

  _tabHandler(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.close();

    return true;
  }

  _renderPopup(): void {
    const $popup = $('<div>');
    this.$element().append($popup);
    this._popup = this._createComponent($popup, Popup, this._popupOptions());
    this._popup.$content()?.addClass(DROP_DOWN_BUTTON_CONTENT);
    this._popup.$wrapper()?.addClass(DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS);
    this._popup.$overlayContent().attr('aria-label', OVERLAY_CONTENT_LABEL);
    this._popup.on('hiding', this._popupHidingHandler.bind(this));
    this._popup.on('showing', this._popupShowingHandler.bind(this));
    this._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
  }

  _popupHidingHandler(): void {
    this.option('opened', false);

    this._updateAriaAttributes(false);
  }

  _popupOptionChanged(args: OptionChanged<DropDownButtonProperties>): void {
    const options = Widget.getOptionsFromContainer(args);

    this._setPopupOption(options);

    const optionsKeys = Object.keys(options);
    if (optionsKeys.includes('width') || optionsKeys.includes('height')) {
      this._dimensionChanged();
    }
  }

  _dimensionChanged(): void {
    const cachedWidth = this._options.cache('dropDownOptions')?.width;

    if (cachedWidth === undefined) {
      this._setPopupOption('width', getElementWidth(this.$element()));
    }
  }

  _setPopupOption(...args: [string, unknown?] | [Record<string, unknown>]): void {
    this._setWidgetOption('_popup', args);
  }

  _popupShowingHandler(): void {
    this.option('opened', true);
    this._updateAriaAttributes(true);
  }

  _setElementAria(value: boolean): void {
    const elementAria = {
      owns: value ? this._popupContentId : undefined,
    };

    this.setAria(elementAria, this.$element());
  }

  _setButtonsAria(value: boolean): void {
    const commonButtonAria: AriaAttributes = {
      expanded: value,
      haspopup: 'listbox',
    };
    const firstButtonAria: AriaAttributes = {};

    if (!this.option('text')) {
      firstButtonAria.label = 'dropdownbutton';
    }

    this._getButtons().each((index, $button) => {
      if (index === 0) {
        this.setAria({ ...firstButtonAria, ...commonButtonAria }, $($button));
      } else {
        this.setAria(commonButtonAria, $($button));
      }
      return true;
    });
  }

  _updateAriaAttributes(value: boolean): void {
    this._setElementAria(value);
    this._setButtonsAria(value);
  }

  _getButtons(): dxElementWrapper {
    return this._buttonGroup.$element().find(`.${DX_BUTTON_CLASS}`);
  }

  _renderButtonGroup(): void {
    const $buttonGroup = this._buttonGroup?.$element() || $('<div>');

    if (!this._buttonGroup) {
      this.$element().append($buttonGroup);
    }

    this._buttonGroup = this._createComponent(
      $buttonGroup,
      ButtonGroup,
      this._getButtonGroupOptions(),
    );

    this._buttonGroup.registerKeyHandler('downArrow', this._upDownKeyHandler.bind(this));
    this._buttonGroup.registerKeyHandler('tab', this._tabHandler.bind(this));
    this._buttonGroup.registerKeyHandler('upArrow', this._upDownKeyHandler.bind(this));
    this._buttonGroup.registerKeyHandler('escape', this._escHandler.bind(this));

    this._bindInnerWidgetOptions(this._buttonGroup, 'buttonGroupOptions');
    const { opened } = this.option();
    this._updateAriaAttributes(opened ?? false);
  }

  _updateArrowClass(): void {
    const hasArrow = this.option('splitButton') || this.option('showArrowIcon');
    this.$element().toggleClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS, Boolean(hasArrow));
  }

  toggle(visible?: boolean): Promise<unknown> | undefined {
    if (!this._popup) {
      this._renderPopup();
      this._renderContent();
    }

    return this._popup?.toggle(visible);
  }

  open(): Promise<unknown> | undefined {
    return this.toggle(true);
  }

  close(): Promise<unknown> | undefined {
    return this.toggle(false);
  }

  _setListOption(name: string, value: unknown): void {
    this._list?.option(name, value);
  }

  _getDisplayValue(item: Item): string {
    const isPrimitiveItem = !isObject(item);
    const displayValue = isPrimitiveItem ? item : this._displayGetter?.(item);
    return !isObject(displayValue) ? String(ensureDefined(displayValue, '')) : '';
  }

  _updateActionButton(selectedItem: unknown): void {
    if (this.option('useSelectMode')) {
      this.option({
        text: this._getDisplayValue(selectedItem as Item),
        icon: isPlainObject(selectedItem) ? (selectedItem as Item).icon : undefined,
      });
    }

    this._setOptionWithoutOptionChange('selectedItem', selectedItem);
    this._setOptionWithoutOptionChange('selectedItemKey', this._keyGetter?.(selectedItem));
  }

  _clean(): void {
    this._list?.$element().remove();
    this._popup?.$element().remove();
  }

  _selectedItemKeyChanged(value: unknown): void {
    this._setListOption('selectedItemKeys', this.option('useSelectMode') && isDefined(value) ? [value] : []);
    const { selectedItem: previousItem } = this.option();
    this._loadSelectedItem().always((selectedItem) => {
      this._updateActionButton(selectedItem);
      if (this._displayGetter?.(previousItem) !== this._displayGetter?.(selectedItem)) {
        this._fireSelectionChangedAction({
          previousValue: previousItem,
          value: selectedItem,
        });
      }
    });
  }

  _updateButtonGroup(name: string, value: unknown): void {
    this._buttonGroup.option(name, value);
    const { opened } = this.option();
    this._updateAriaAttributes(opened ?? false);
  }

  _actionButtonOptionChanged({ name, value }: { name: string; value: unknown }): void {
    const newConfig: Record<string, unknown> = {};
    newConfig[name] = value;
    this._updateButtonGroup(
      'items[0]',
      extend(
        {},
        this._getActionButtonConfig(),
        newConfig,
      ),
    );
    if (this._popup) {
      this._popup.repaint();
    }
  }

  _selectModeChanged(value: unknown): void {
    if (value) {
      this._setListOption('selectionMode', 'single');
      const selectedItemKey = this.option('selectedItemKey');
      this._setListOption('selectedItemKeys', isDefined(selectedItemKey) ? [selectedItemKey] : []);
      this._selectedItemKeyChanged(this.option('selectedItemKey'));
    } else {
      this._setListOption('selectionMode', 'none');
      this.option({
        selectedItemKey: undefined,
        selectedItem: undefined,
      });
      const { text } = this.option();
      this._actionButtonOptionChanged({ name: 'text', value: text });
    }
  }

  _updateItemCollection(optionName: string): void {
    const { selectedItemKey, useSelectMode } = this.option();
    this._setListOption('selectedItem', null);
    this._setWidgetOption('_list', [optionName]);

    if (isDefined(selectedItemKey)) {
      this._loadSelectedItem()
        .done((selectedItem) => {
          if (useSelectMode) {
            this._setListOption('selectedItemKeys', [selectedItemKey]);
            this._setListOption('selectedItem', selectedItem);
          }
        }).fail(() => {
          this._setListOption('selectedItemKeys', []);
        })
        .always(this._updateActionButton.bind(this));
    }
  }

  _updateDataController(items?: unknown[] | DataSourceType | null): void {
    const { keyExpr } = this.option();
    this._dataController.updateDataSource(items, keyExpr);
    this._updateKeyExpr();
  }

  _updateKeyExpr(): void {
    this._compileKeyGetter();
    this._setListOption('keyExpr', this._dataController.key());
  }

  focus(): void {
    this._buttonGroup.focus();
  }

  _optionChanged(args: OptionChanged<DropDownButtonProperties>): void {
    const { name, value } = args;
    switch (name) {
      case 'useSelectMode':
        this._selectModeChanged(value);
        break;
      case 'splitButton':
        this._updateArrowClass();
        this._renderButtonGroup();
        break;
      case 'displayExpr':
        this._compileDisplayGetter();
        this._setListOption(name, value);
        this._updateActionButton(this.option('selectedItem'));
        break;
      case 'keyExpr':
        this._updateDataController();
        break;
      case 'buttonGroupOptions':
        this._innerWidgetOptionChanged(this._buttonGroup, args);
        break;
      case 'dropDownOptions':
        if (args.fullName === 'dropDownOptions.visible') {
          break;
        }
        if (args.value.visible !== undefined) {
          delete args.value.visible;
        }
        this._popupOptionChanged(args);
        this._innerWidgetOptionChanged(this._popup, args);
        break;
      case 'opened':
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.toggle(value);
        break;
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._setListOption(name, value);
        this._updateButtonGroup(name, value);
        super._optionChanged(args);
        break;
      case 'items': {
        const { items } = this.option();
        this._updateDataController(items);
        this._updateItemCollection(name);
        break;
      }
      case 'dataSource':
        this._dataController.updateDataSource(value as unknown[] | DataSourceType);
        this._updateKeyExpr();
        this._updateItemCollection(name);
        break;
      case 'icon':
      case 'text':
        this._actionButtonOptionChanged(args);
        break;
      case 'showArrowIcon':
        this._updateArrowClass();
        this._renderButtonGroup();
        this._popup?.repaint();
        break;
      case 'width':
      case 'height':
        super._optionChanged(args);
        this._dimensionChanged();
        this._popup?.repaint();
        break;
      case 'stylingMode':
        this._updateButtonGroup(name, value);
        break;
      case 'type':
        this._updateButtonGroup('items', this._getButtonGroupItems());
        break;
      case 'itemTemplate':
      case 'grouped':
      case 'noDataText':
      case 'groupTemplate':
      case 'wrapItemText':
      case 'useItemTextAsTitle':
        this._setListOption(name, value);
        break;
      case 'dropDownContentTemplate':
        this._renderContent();
        break;
      case 'selectedItemKey':
        this._selectedItemKeyChanged(value);
        break;
      case 'selectedItem':
        break;
      case 'onItemClick':
        this._createItemClickAction();
        break;
      case 'onButtonClick':
        this._createActionClickAction();
        break;
      case 'onSelectionChanged':
        this._createSelectionChangedAction();
        break;
      case 'deferRendering': {
        const { opened } = this.option();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.toggle(opened);
        break;
      }
      case 'tabIndex':
        this._updateButtonGroup(name, value);
        break;
      case 'template':
        this._renderButtonGroup();
        break;
      case '_cached_buttonGroupOptions':
      case '_cached_dropDownOptions':
        break;
      default:
        super._optionChanged(args);
    }
  }

  getDataSource(): DataSourceType | null {
    return this._dataController.getDataSource();
  }
}

registerComponent('dxDropDownButton', DropDownButton);

export default DropDownButton;
