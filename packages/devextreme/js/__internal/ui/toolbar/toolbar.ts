import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Item } from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';

import { MultiLineStrategy } from './strategy/toolbar.multiline';
import { SingleLineStrategy } from './strategy/toolbar.singleline';
import type { ToolbarBaseProperties } from './toolbar.base';
import ToolbarBase from './toolbar.base';
import { ToolbarKBN } from './toolbar.kbn';
import { toggleItemFocusableElementTabIndex } from './toolbar.utils';

const TOOLBAR_MULTILINE_CLASS = 'dx-toolbar-multiline';
const TOOLBAR_AUTO_HIDE_TEXT_CLASS = 'dx-toolbar-text-auto-hide';

export type ToolbarOrientation = 'horizontal' | 'vertical';

export interface Properties extends ToolbarBaseProperties {
  menuContainer?: string | Element | undefined;
  overflowMenuVisible?: boolean;
  /** Controls arrow-key navigation direction and sets aria-orientation. Default: 'horizontal'. */
  orientation?: ToolbarOrientation;
}
class Toolbar extends ToolbarBase<Properties> {
  _layoutStrategy!: MultiLineStrategy | SingleLineStrategy;

  _kbn!: ToolbarKBN;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      menuItemTemplate: 'menuItem',
      overflowMenuVisible: false,
      multiline: false,
      orientation: 'horizontal',
    };
  }

  _isMultiline(): boolean | undefined {
    const { multiline } = this.option();
    return multiline;
  }

  _dimensionChanged(dimension?: 'height' | 'width'): void {
    if (dimension === 'height') {
      return;
    }

    super._dimensionChanged();

    this._layoutStrategy._dimensionChanged();
  }

  _initMarkup(): void {
    super._initMarkup();

    this._updateFocusableItemsTabIndex();

    this._layoutStrategy._initMarkup();

    // KBN: initialise after layout strategy so the overflow button is rendered.
    if (!this._kbn) {
      this._kbn = new ToolbarKBN(this);
    }
    this._kbn.attach();
  }

  _renderToolbar(): void {
    super._renderToolbar();

    this._renderLayoutStrategy();
    this._renderOrientation();
  }

  _renderOrientation(): void {
    const orientation = ((this.option as unknown as (key: string) => unknown)('orientation') as ToolbarOrientation | undefined) ?? 'horizontal';
    this.$element().attr('aria-orientation', orientation);
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

    // KBN: refresh after all items (including overflow button) are finalised.
    this._kbn?.refresh();
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
    if (!this._isMenuItem(item)) {
      super._itemOptionChanged(item, property, value, prevValue);
    }

    this._layoutStrategy._itemOptionChanged(item, property, value);
    // @ts-expect-error ts-error
    if (property === 'disabled' || property === 'options.disabled') {
      toggleItemFocusableElementTabIndex(this, item);
      // KBN: re-apply roving tabindex because the item set may have changed.
      this._kbn?.refresh();
    }

    if (property === 'location') {
      this.repaint();
    }
  }

  /**
   * Overrides the default implementation to ensure the roving-tabindex model:
   * only one item (the KBN anchor) holds tabindex=0 at any time.
   *
   * Strategy:
   *   1. Call original logic (toggleItemFocusableElementTabIndex per item)
   *      so disabled items get tabindex=-1.
   *   2. Flatten every remaining tabindex=0 in the toolbar to -1.
   *   3. ToolbarKBN.refresh() will set exactly the roving anchor back to 0.
   */
  _updateFocusableItemsTabIndex(): void {
    // Original: sets disabled items → -1, enabled items → 0.
    this._getToolbarItems().forEach((item) => toggleItemFocusableElementTabIndex(this, item));
    // Flatten all 0s; KBN refresh() will restore the single roving anchor.
    this.$element().find('[tabindex="0"]').attr('tabindex', -1);
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
      case 'orientation':
        this._renderOrientation();
        break;
      case 'disabled':
        super._optionChanged(args);

        this._updateFocusableItemsTabIndex();
        this._kbn?.refresh();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _dispose(): void {
    this._kbn?.detach();
    super._dispose();
  }

  // it is not public
  updateDimensions(): void {
    this._dimensionChanged();
  }
}

registerComponent('dxToolbar', Toolbar);

export default Toolbar;
