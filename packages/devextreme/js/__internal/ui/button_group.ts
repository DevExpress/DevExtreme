/* eslint-disable max-classes-per-file */
import type { template } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isFunction } from '@js/core/utils/type';
import type { DxEvent, EventInfo, ItemInfo } from '@js/events';
import type { ButtonStyle, Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type { Item, Properties } from '@js/ui/button_group';
import type { SelectionChangeInfo } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidgetEdit from '@js/ui/collection/ui.collection_widget.edit';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
// import {
//   ButtonGroup as ButtonGroupInferno,
// } from '@ts/ui/button_group_inferno/button_group.widget';
import type { ItemRenderInfo } from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';

export const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_WRAPPER_CLASS = `${BUTTON_GROUP_CLASS}-wrapper`;
const BUTTON_GROUP_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-item`;
const BUTTON_GROUP_FIRST_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-first-item`;
const BUTTON_GROUP_LAST_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-last-item`;
const BUTTON_GROUP_ITEM_HAS_WIDTH = `${BUTTON_GROUP_ITEM_CLASS}-has-width`;
const SHAPE_STANDARD_CLASS = 'dx-shape-standard';

const BUTTON_GROUP_STYLING_MODE_CLASS = {
  contained: 'dx-buttongroup-mode-contained',
  outlined: 'dx-buttongroup-mode-outlined',
  text: 'dx-buttongroup-mode-text',
};

export type ItemRenderedEvent = EventInfo<ButtonCollection> & ItemInfo<Button>;
export type SelectionChangedEvent = EventInfo<ButtonCollection> & SelectionChangeInfo<Item>;

export interface ButtonCollectionProperties extends CollectionWidgetEditProperties<
 ButtonCollection
> {
  buttonTemplate?: template | (
    (buttonData: Item, buttonContent: Element) => dxElementWrapper
  );

  stylingMode?: ButtonStyle;
}

class ButtonCollection extends CollectionWidgetEdit<ButtonCollectionProperties> {
  _initTemplates(): void {
    super._initTemplates();

    this._templateManager.addDefaultTemplates({
      item: new BindableTemplate(($container, data, model) => {
        this._prepareItemStyles($container);
        const { buttonTemplate } = this.option();

        this._createComponent(
          $container,
          Button,
          extend({}, model, data, this._getBasicButtonOptions(), {
            _templateData: this._hasCustomTemplate(buttonTemplate) ? model : {},
            template: model.template || buttonTemplate,
          }),
        );
      }, ['text', 'type', 'icon', 'disabled', 'visible', 'hint'], this.option('integrationOptions.watchMethod')),
    });
  }

  _getBasicButtonOptions(): ButtonProperties {
    const { hoverStateEnabled, activeStateEnabled, stylingMode } = this.option();

    return {
      focusStateEnabled: false,
      // @ts-expect-error ts-error
      onClick: null,
      hoverStateEnabled,
      activeStateEnabled,
      stylingMode,
    };
  }

  _getDefaultOptions(): ButtonCollectionProperties {
    return {
      ...super._getDefaultOptions(),
      itemTemplateProperty: null,
    };
  }

  _hasCustomTemplate(template): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return isFunction(template) || this.option('integrationOptions.templates')[template];
  }

  _selectedItemClass(): string {
    return 'dx-item-selected dx-state-selected';
  }

  _prepareItemStyles($item: dxElementWrapper): void {
    // @ts-expect-error ts-error
    const itemIndex: number = $item.data('dxItemIndex');
    if (itemIndex === 0) {
      $item.addClass(BUTTON_GROUP_FIRST_ITEM_CLASS);
    }

    const { items } = this.option();
    if (items && itemIndex === items.length - 1) {
      $item.addClass(BUTTON_GROUP_LAST_ITEM_CLASS);
    }

    $item.addClass(SHAPE_STANDARD_CLASS);
  }

  _renderItemContent(
    args: ItemRenderInfo<Item>,
  ): dxElementWrapper | Element | DeferredObj<dxElementWrapper> {
    args.container = $(args.container).parent();

    return super._renderItemContent(args);
  }

  _setAriaSelectionAttribute($target: dxElementWrapper, value: string): void {
    this.setAria('pressed', value, $target);
  }

  _renderItemContentByNode(args: ItemRenderInfo<Item>, $node: dxElementWrapper): dxElementWrapper {
    args.container = $(args.container).children().first();
    return super._renderItemContentByNode(args, $node);
  }

  _focusTarget(): dxElementWrapper {
    return this.$element().parent();
  }

  _keyboardEventBindingTarget(): dxElementWrapper {
    return this._focusTarget();
  }

  _enterKeyHandler(e: DxEvent<KeyboardEvent>): void {
    e.preventDefault();
    super._enterKeyHandler(e);
  }

  _refreshContent(): void {
    this._prepareContent();
    this._renderContent();
  }

  _itemClass(): string {
    return BUTTON_GROUP_ITEM_CLASS;
  }

  _itemSelectHandler(e: DxEvent): void {
    const { selectionMode } = this.option();

    if (selectionMode === 'single' && this.isItemSelected(e.currentTarget)) {
      return;
    }

    super._itemSelectHandler(e);
  }
}

class ButtonGroup extends Widget<Properties> {
  _itemClickAction!: (event?: Record<string, unknown>) => void;

  _buttonsCollection!: ButtonCollection;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      hoverStateEnabled: true,
      focusStateEnabled: true,
      selectionMode: 'single',
      selectedItems: [],
      selectedItemKeys: [],
      stylingMode: 'contained',
      keyExpr: 'text',
      items: [],
      buttonTemplate: 'content',
      // @ts-expect-error ts-error
      onSelectionChanged: null,
      // @ts-expect-error ts-error
      onItemClick: null,
    };
  }

  _init(): void {
    super._init();
    this._createItemClickAction();
  }

  _createItemClickAction(): void {
    this._itemClickAction = this._createActionByOption('onItemClick');
  }

  _initMarkup(): void {
    this.setAria('role', 'group');
    this.$element().addClass(BUTTON_GROUP_CLASS);
    this._renderStylingMode();
    this._renderButtons();
    this._syncSelectionOptions();
    super._initMarkup();
  }

  _renderStylingMode(): void {
    const { stylingMode } = this.option();

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in BUTTON_GROUP_STYLING_MODE_CLASS) {
      this.$element().removeClass(BUTTON_GROUP_STYLING_MODE_CLASS[key]);
    }

    this.$element().addClass(BUTTON_GROUP_STYLING_MODE_CLASS[stylingMode ?? 'contained']);
  }

  _fireSelectionChangeEvent(
    addedItems: Item[],
    removedItems: Item[],
  ): void {
    this._createActionByOption('onSelectionChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    })({ addedItems, removedItems });
  }

  _renderButtons(): void {
    const $buttons = $('<div>')
      .addClass(BUTTON_GROUP_WRAPPER_CLASS)
      .appendTo(this.$element());

    const {
      selectedItems,
      selectionMode,
      items,
      keyExpr,
      buttonTemplate,
      selectedItemKeys,
      focusStateEnabled,
      hoverStateEnabled,
      activeStateEnabled,
      stylingMode,
      accessKey,
      tabIndex,
    } = this.option();

    const options: ButtonCollectionProperties = {
      selectionMode,
      items,
      keyExpr,
      buttonTemplate,
      selectedItemKeys,
      focusStateEnabled,
      hoverStateEnabled,
      activeStateEnabled,
      stylingMode,
      accessKey,
      tabIndex,
      noDataText: '',
      selectionRequired: false,
      onItemRendered: (e: ItemRenderedEvent): void => {
        const { width } = this.option();
        if (isDefined(width)) {
          $(e.itemElement).addClass(BUTTON_GROUP_ITEM_HAS_WIDTH);
        }
      },
      onSelectionChanged: (e: SelectionChangedEvent): void => {
        this._syncSelectionOptions();
        this._fireSelectionChangeEvent(e.addedItems, e.removedItems);
      },
      onItemClick: (e) => {
        this._itemClickAction(e);
      },
    };

    if (isDefined(selectedItems) && selectedItems.length) {
      options.selectedItems = selectedItems;
    }
    this._buttonsCollection = this._createComponent($buttons, ButtonCollection, options);
  }

  _syncSelectionOptions(): void {
    this._setOptionWithoutOptionChange('selectedItems', this._buttonsCollection.option('selectedItems'));
    this._setOptionWithoutOptionChange('selectedItemKeys', this._buttonsCollection.option('selectedItemKeys'));
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;
    switch (name) {
      case 'stylingMode':
      case 'selectionMode':
      case 'keyExpr':
      case 'buttonTemplate':
      case 'items':
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
      case 'tabIndex':
        this._invalidate();
        break;
      case 'selectedItemKeys':
      case 'selectedItems':
        this._buttonsCollection.option(name, value);
        break;
      case 'onItemClick':
        this._createItemClickAction();
        break;
      case 'onSelectionChanged':
        break;
      case 'width':
        super._optionChanged(args);
        this._buttonsCollection
          .itemElements()
          .toggleClass(BUTTON_GROUP_ITEM_HAS_WIDTH, !!value);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export class TestButtonGroup1 extends ButtonGroup {}

registerComponent('dxButtonGroup', ButtonGroup);
// registerComponent('dxButtonGroup', ButtonGroupInferno);

export default ButtonGroup;
// export default ButtonGroupInferno;
