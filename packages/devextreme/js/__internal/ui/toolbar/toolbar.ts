import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import { MultiLineStrategy } from '@ts/ui/toolbar/strategy/toolbar.multiline';
import { SingleLineStrategy } from '@ts/ui/toolbar/strategy/toolbar.singleline';
import type { ToolbarBaseProperties } from '@ts/ui/toolbar/toolbar.base';
import ToolbarBase from '@ts/ui/toolbar/toolbar.base';
import { toggleItemFocusableElementTabIndex } from '@ts/ui/toolbar/toolbar.utils';

const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = 'dx-toolbar-text-auto-hide';

export interface Properties extends ToolbarBaseProperties {
  menuContainer?: string | Element | undefined;
  overflowMenuVisible?: boolean;
}
class Toolbar extends ToolbarBase<Properties> {
  _layoutStrategy!: MultiLineStrategy | SingleLineStrategy;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      menuItemTemplate: 'menuItem',
      overflowMenuVisible: false,
      multiline: false,
    };
  }

  _isMultiline(): boolean | undefined {
    const { multiline } = this.option();
    return multiline;
  }

  _openOverflowMenu(focusTarget: 'first' | 'last'): void {
    this._layoutStrategy._openOverflowMenu(focusTarget);
  }

  _dimensionChanged(dimension?: 'height' | 'width'): void {
    if (dimension === 'height') {
      return;
    }

    super._dimensionChanged();

    this._layoutStrategy._dimensionChanged();

    this._updateFocusableItemsTabIndex();
  }

  _initMarkup(): void {
    super._initMarkup();

    this._updateFocusableItemsTabIndex();

    this._layoutStrategy._initMarkup();
  }

  _renderToolbar(): void {
    super._renderToolbar();

    this._renderLayoutStrategy();
  }

  _itemContainer(): dxElementWrapper {
    if (this._isMultiline()) {
      return this._$toolbarItemsContainer;
    }

    return super._itemContainer();
  }

  _renderLayoutStrategy(): void {
    this.$element().toggleClass(TOOLBAR_MULTILINE_CLASS, this._isMultiline());

    this._layoutStrategy = this._isMultiline()
      ? new MultiLineStrategy(this)
      : new SingleLineStrategy(this);
  }

  _renderSections(): void {
    if (this._isMultiline()) {
      return;
    }

    super._renderSections();
  }

  _postProcessRenderItems(): void {
    this._layoutStrategy._hideOverflowItems();
    this._layoutStrategy._updateMenuVisibility();

    super._postProcessRenderItems();

    this._layoutStrategy._renderMenuItems();
  }

  _renderItem(
    index: number,
    itemData: Item,
    $container: dxElementWrapper,
    $itemToReplace: dxElementWrapper,
  ): dxElementWrapper {
    const $itemElement = super._renderItem(index, itemData, $container, $itemToReplace);

    this._layoutStrategy._renderItem(itemData, $itemElement);

    const { widget, showText } = itemData;

    if (widget === 'dxButton' && showText === 'inMenu') {
      $itemElement.toggleClass(TOOLBAR_AUTO_HIDE_TEXT_CLASS);
    }

    return $itemElement;
  }

  // for filemanager
  _getItemsWidth(): number {
    return this._layoutStrategy._getItemsWidth();
  }

  // for filemanager
  _getMenuItems(): Item[] {
    return this._layoutStrategy._getMenuItems();
  }

  _getToolbarItems(): Item[] {
    return this._layoutStrategy._getToolbarItems();
  }

  _arrangeItems(): void {
    if (this.$element().is(':hidden')) {
      return;
    }

    const elementWidth = this._layoutStrategy._arrangeItems();

    if (!this._isMultiline()) {
      super._arrangeItems(elementWidth as number);
    }
  }

  _itemOptionChanged(
    item: Item,
    property: keyof Item,
    value: unknown,
    prevValue: unknown,
  ): void {
    // @ts-expect-error ts-error
    const isDisabledChange = property === 'disabled' || property === 'options.disabled';
    const isMenuItem = this._isMenuItem(item);

    const captured = isDisabledChange && value && !isMenuItem
      ? this._navigator?.captureItemIfFocused(this._findItemElementByItem(item))
      : undefined;

    if (!isMenuItem) {
      super._itemOptionChanged(item, property, value, prevValue);
    }

    this._layoutStrategy._itemOptionChanged(item, property, value);

    if (isDisabledChange) {
      if (isMenuItem) {
        toggleItemFocusableElementTabIndex(this, item);
      } else {
        this._updateFocusableItemsTabIndex();
        if (captured !== undefined) {
          this._navigator?.restoreFocus(captured);
        }
      }
    }

    if (property === 'location') {
      this.repaint();
    }
  }

  _updateFocusableItemsTabIndex(): void {
    const { allowKeyboardNavigation } = this.option();
    this._getToolbarItems().forEach((item) => {
      if (this._isMenuItem(item) || !allowKeyboardNavigation) {
        toggleItemFocusableElementTabIndex(this, item);
      }
    });
    if (allowKeyboardNavigation) {
      this._resetRovingTabIndex();
    }
  }

  _isMenuItem(itemData: Item): boolean {
    return itemData.locateInMenu === 'always';
  }

  _isToolbarItem(itemData: Item): boolean {
    return itemData.location === undefined || itemData.locateInMenu === 'never';
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    this._layoutStrategy._optionChanged(name, value);

    switch (name) {
      case 'menuContainer':
      case 'menuItemTemplate':
      case 'overflowMenuVisible':
        break;
      case 'multiline':
        this._invalidate();
        break;
      case 'allowKeyboardNavigation':
      case 'disabled':
        super._optionChanged(args);

        this._updateFocusableItemsTabIndex();
        break;
      default:
        super._optionChanged(args);
    }
  }

  // it is not public
  updateDimensions(): void {
    this._dimensionChanged();
  }
}

registerComponent('dxToolbar', Toolbar);

export default Toolbar;
