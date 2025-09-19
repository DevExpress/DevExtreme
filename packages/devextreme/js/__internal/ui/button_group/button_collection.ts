import type { template } from '@js/common';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isFunction } from '@js/core/utils/type';
import type { DxEvent, EventInfo, ItemInfo } from '@js/events';
import type { ButtonStyle, Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type { Item } from '@js/ui/button_group';
import type { SelectionChangeInfo } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidgetEdit from '@js/ui/collection/ui.collection_widget.edit';
import type { ItemRenderInfo } from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';

export const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-item`;
const BUTTON_GROUP_FIRST_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-first-item`;
const BUTTON_GROUP_LAST_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-last-item`;
export const BUTTON_GROUP_ITEM_HAS_WIDTH = `${BUTTON_GROUP_ITEM_CLASS}-has-width`;
const SHAPE_STANDARD_CLASS = 'dx-shape-standard';

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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

export default ButtonCollection;
