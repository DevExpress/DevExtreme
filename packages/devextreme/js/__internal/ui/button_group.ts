import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { EventInfo, ItemInfo } from '@js/events';
import type Button from '@js/ui/button';
import type { Item, Properties } from '@js/ui/button_group';
import type { SelectionChangeInfo } from '@js/ui/collection/ui.collection_widget.base';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import {
  ButtonGroup as ButtonGroupInferno,
} from '@ts/ui/button_group_inferno/button_group.widget';

import type { ButtonCollectionProperties } from './button_group/button_collection';
import ButtonCollection from './button_group/button_collection';

export const BUTTON_GROUP_CLASS = 'dx-buttongroup';
const BUTTON_GROUP_WRAPPER_CLASS = `${BUTTON_GROUP_CLASS}-wrapper`;
const BUTTON_GROUP_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-item`;
export const BUTTON_GROUP_ITEM_HAS_WIDTH = `${BUTTON_GROUP_ITEM_CLASS}-has-width`;

const BUTTON_GROUP_STYLING_MODE_CLASS = {
  contained: 'dx-buttongroup-mode-contained',
  outlined: 'dx-buttongroup-mode-outlined',
  text: 'dx-buttongroup-mode-text',
};

export type ItemRenderedEvent = EventInfo<ButtonCollection> & ItemInfo<Button>;
export type SelectionChangedEvent = EventInfo<ButtonCollection> & SelectionChangeInfo<Item>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      width,
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
      width,
      noDataText: '',
      selectionRequired: false,
      // onItemRendered: (e: ItemRenderedEvent): void => {
      //   if (isDefined(width)) {
      //     $(e.itemElement).addClass(BUTTON_GROUP_ITEM_HAS_WIDTH);
      //   }
      // },
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

// registerComponent('dxButtonGroup', ButtonGroup);
registerComponent('dxButtonGroup', ButtonGroupInferno);

// export default ButtonGroup;
export default ButtonGroupInferno;
