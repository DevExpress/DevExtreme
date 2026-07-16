import type { DefaultOptionsRule } from '@js/common';
import { fx } from '@js/common/core/animation';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { getHeight, getOuterWidth, getWidth } from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import {
  current,
  isMaterial,
  isMaterialBased,
  // @ts-expect-error ts-error
  waitWebFont,
} from '@js/ui/themes';
import type { Item, Properties } from '@js/ui/toolbar';
import { BindableTemplate } from '@ts/core/templates/m_bindable_template';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import CollectionWidgetAsync from '@ts/ui/collection/collection_widget.async';
import type { CollectionItemKey, CollectionWidgetBaseProperties } from '@ts/ui/collection/collection_widget.base';
import type { FocusRestoreTarget, RovingTabIndexController } from '@ts/ui/toolbar/internal/keyboard.navigation';
import {
  setupRovingKeyboard,
} from '@ts/ui/toolbar/internal/keyboard.navigation';
import {
  afterRovingMoveFocus,
  beforeRovingMoveFocus,
  getAvailableItems,
  handleMenuActivation,
  isItemComponentOpened,
  releaseNavigationKeys,
  wrapSpaceKey,
} from '@ts/ui/toolbar/internal/roving.utils';
import {
  getItemFocusTarget,
} from '@ts/ui/toolbar/toolbar.utils';

import {
  DROP_DOWN_MENU_BUTTON_CLASS,
  TOOLBAR_CLASS,
  TOOLBAR_FOCUS_MODE_CLASS,
} from './constants';

export const TOOLBAR_BEFORE_CLASS = 'dx-toolbar-before';
const TOOLBAR_CENTER_CLASS = 'dx-toolbar-center';
export const TOOLBAR_AFTER_CLASS = 'dx-toolbar-after';
const TOOLBAR_MINI_CLASS = 'dx-toolbar-mini';
export const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
const TOOLBAR_LABEL_CLASS = 'dx-toolbar-label';
const TOOLBAR_BUTTON_CLASS = 'dx-toolbar-button';
const TOOLBAR_ITEMS_CONTAINER_CLASS = 'dx-toolbar-items-container';
const TOOLBAR_GROUP_CLASS = 'dx-toolbar-group';
const TOOLBAR_COMPACT_CLASS = 'dx-toolbar-compact';
const TEXT_BUTTON_MODE = 'text';

const DEFAULT_BUTTON_TYPE = 'default';
const DEFAULT_DROPDOWNBUTTON_STYLING_MODE = 'contained';

const TOOLBAR_ITEM_DATA_KEY = 'dxToolbarItemDataKey';
const ANIMATION_TIMEOUT = 15;

type ItemLike = string | Item;

export interface ToolbarBaseProperties<
  TItem extends ItemLike = Item,
  TKey extends CollectionItemKey = CollectionItemKey,
> extends Properties<TItem, TKey>,
  Omit<
    CollectionWidgetBaseProperties<ToolbarBase, TItem, TKey>,
  keyof Properties<TItem, TKey> & keyof CollectionWidgetBaseProperties<ToolbarBase, TItem, TKey>
  > {
  allowKeyboardNavigation: boolean;
  grouped: boolean;
  renderAs: 'topToolbar';
  useFlatButtons: boolean;
  useDefaultButtons: boolean;
  compactMode: boolean;
}

class ToolbarBase<
  TProperties extends ToolbarBaseProperties = ToolbarBaseProperties,
> extends CollectionWidgetAsync<TProperties, Item> {
  _$toolbarItemsContainer!: dxElementWrapper;

  _$beforeSection!: dxElementWrapper;

  _$centerSection!: dxElementWrapper;

  _$afterSection!: dxElementWrapper;

  _waitParentAnimationTimeout?: ReturnType<typeof setTimeout>;

  _navigator?: RovingTabIndexController;

  _pendingFocusTarget?: FocusRestoreTarget;

  _getSynchronizableOptionsForCreateComponent(): (keyof TProperties)[] {
    return super._getSynchronizableOptionsForCreateComponent().filter((item) => item !== 'disabled');
  }

  _initTemplates(): void {
    super._initTemplates();

    const { integrationOptions } = this.option();
    const template = new BindableTemplate(($container, data, rawModel) => {
      if (isPlainObject(data)) {
        const { text, html, widget } = data;
        const { useFlatButtons, useDefaultButtons } = this.option();

        if (text) {
          $container.text(text).wrapInner('<div>');
        }

        if (html) {
          $container.html(html);
        }

        if (widget === 'dxDropDownButton') {
          data.options = data.options ?? {};

          if (!isDefined(data.options.stylingMode)) {
            data.options.stylingMode = useFlatButtons
              ? TEXT_BUTTON_MODE
              : DEFAULT_DROPDOWNBUTTON_STYLING_MODE;
          }
        }

        if (widget === 'dxButton') {
          if (useFlatButtons) {
            data.options = data.options ?? {};
            data.options.stylingMode = data.options.stylingMode ?? TEXT_BUTTON_MODE;
          }

          if (useDefaultButtons) {
            data.options = data.options ?? {};
            data.options.type = data.options.type ?? DEFAULT_BUTTON_TYPE;
          }
        }
      } else {
        $container.text(String(data));
      }

      this._getTemplate('dx-polymorph-widget').render({
        container: $container,
        model: rawModel,
        parent: this,
      });
    }, ['text', 'html', 'widget', 'options'], integrationOptions?.watchMethod);

    this._templateManager.addDefaultTemplates({
      item: template,
      menuItem: template,
    });
  }

  _init(): void {
    super._init();

    if (!this.option('allowKeyboardNavigation')) {
      this.option('focusStateEnabled', false);
    }
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      renderAs: 'topToolbar',
      grouped: false,
      useFlatButtons: false,
      useDefaultButtons: false,
      focusStateEnabled: true,
      allowKeyboardNavigation: true,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return isMaterialBased(current());
        },
        // @ts-expect-error ts-error
        options: {
          useFlatButtons: true,
        },
      },
    ]);
  }

  _toggleFocusClass(): void { }

  _supportedKeys(): SupportedKeys {
    const keys = super._supportedKeys();

    wrapSpaceKey(keys);
    releaseNavigationKeys(keys);

    keys.upArrow = (e: DxEvent<KeyboardEvent>): void => this._handleOverflowOpenAtNavLevel(e);
    keys.downArrow = (e: DxEvent<KeyboardEvent>): void => this._handleOverflowOpenAtNavLevel(e);

    return keys;
  }

  _getItemFocusTarget($item: dxElementWrapper): dxElementWrapper | undefined {
    return getItemFocusTarget($item);
  }

  _enterKeyHandler(e: DxEvent<KeyboardEvent>): void {
    const { focusedElement } = this.option();
    const isOverflowButton = this._isOverflowItem($(focusedElement));

    this._navigator?.handleEnterKey(e, {
      focusedElement,
      activateAtNavLevel: ($focused, event) => this._handleActivationAtNavLevel($focused, event),
    });

    if (isOverflowButton) {
      return;
    }

    super._enterKeyHandler(e);
  }

  _setFocusedItem($target: dxElementWrapper): void {
    super._setFocusedItem($target);

    this._navigator?.updateRovingTabIndex($target);
  }

  _focusOutHandler(e: DxEvent<FocusEvent>): void {
    if (!this._navigator || this._navigator.shouldDelegateFocusOut(e)) {
      super._focusOutHandler(e);
    }
  }

  _getAvailableItems($itemElements?: dxElementWrapper): dxElementWrapper {
    return getAvailableItems(
      this._getVisibleItems($itemElements),
      !!this.option().disabled,
      ($item) => this._getItemFocusTarget($item),
    );
  }

  _focusInHandler(e: DxEvent): void {
    super._focusInHandler(e);
    this._navigator?.focusInHandler(e);
  }

  _renderFocusTarget(): void {
    this._focusTarget().removeAttr('tabIndex');
  }

  _refreshActiveDescendant(): void { }

  _refreshItemId(): void { }

  _attachKeyboardEvents(): void {
    const { allowKeyboardNavigation } = this.option();
    if (!allowKeyboardNavigation) {
      super._attachKeyboardEvents();
      return;
    }

    this._detachKeyboardEvents();

    const { listenerId, navigator } = setupRovingKeyboard(this, {
      itemsSelector: `${this._itemSelector()}, .${DROP_DOWN_MENU_BUTTON_CLASS}`,
      direction: 'horizontal',
    });
    this._keyboardListenerId = listenerId;
    this._navigator = navigator;
  }

  _detachKeyboardEvents(): void {
    this._navigator?.detach();
    this._navigator = undefined;
    super._detachKeyboardEvents();
  }

  _isOverflowItem($item: dxElementWrapper): boolean {
    return $item.hasClass(DROP_DOWN_MENU_BUTTON_CLASS);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _openOverflowMenu(focusTarget: 'first' | 'last'): void {
    // overridden in Toolbar
  }

  _getVisibleItems($itemElements?: dxElementWrapper): dxElementWrapper {
    const $items = $itemElements ?? this._itemContainer().find(`${this._itemSelector()}, .${DROP_DOWN_MENU_BUTTON_CLASS}`);
    return $items.filter(':visible');
  }

  _resetRovingTabIndex(): void {
    this._navigator?.resetRovingTabIndex(this._itemContainer());
  }

  _handleActivationAtNavLevel($focused: dxElementWrapper, e: KeyboardEvent): void {
    if ($focused.length && !isItemComponentOpened($focused) && this._isOverflowItem($focused)) {
      e.preventDefault();
      e.stopPropagation();
      this._openOverflowMenu('first');
      return;
    }

    handleMenuActivation($focused, e);
  }

  _handleOverflowOpenAtNavLevel(e: KeyboardEvent): void {
    const { focusedElement } = this.option();
    const $focused = $(focusedElement);

    if (!$focused.length || !this._isOverflowItem($focused)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this._openOverflowMenu(e.key === 'ArrowUp' ? 'last' : 'first');
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  _moveFocus(location: string, e?: DxEvent<KeyboardEvent>): boolean | undefined | void {
    if (!this._navigator) {
      const { focusedElement } = this.option();
      return focusedElement ? super._moveFocus(location, e) : undefined;
    }

    beforeRovingMoveFocus(this);
    const result = super._moveFocus(location, e);
    afterRovingMoveFocus(this);
    return result;
  }

  _itemContainer(): dxElementWrapper {
    return this._$toolbarItemsContainer.find([
      `.${TOOLBAR_BEFORE_CLASS}`,
      `.${TOOLBAR_CENTER_CLASS}`,
      `.${TOOLBAR_AFTER_CLASS}`,
    ].join(','));
  }

  _itemClass(): string {
    return TOOLBAR_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return TOOLBAR_ITEM_DATA_KEY;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _dimensionChanged(dimension?: 'height' | 'width'): void {
    if (this._disposed) {
      return;
    }

    this._arrangeItems();
    this._applyCompactMode();
  }

  _initMarkup(): void {
    this._renderToolbar();
    this._renderSections();

    super._initMarkup();
  }

  _render(): void {
    super._render();

    this._updateDimensionsInMaterial();
  }

  _postProcessRenderItems(): void {
    this._arrangeItems();

    this._updateFocusableItemsTabIndex();

    const target = this._pendingFocusTarget;
    this._pendingFocusTarget = undefined;
    if (target !== undefined) {
      this._navigator?.restoreFocus(target);
    }
  }

  _updateFocusableItemsTabIndex(): void {
    this._resetRovingTabIndex();
  }

  _invalidate(): void {
    const captured = this._navigator?.captureFocusedItem();
    if (captured === null) {
      this._pendingFocusTarget = undefined;
    } else if (captured !== undefined) {
      this._pendingFocusTarget = captured;
    }

    super._invalidate();
  }

  _renderToolbar(): void {
    const { allowKeyboardNavigation } = this.option();
    this.$element()
      .addClass(TOOLBAR_CLASS)
      .toggleClass(TOOLBAR_FOCUS_MODE_CLASS, !!allowKeyboardNavigation);

    this._$toolbarItemsContainer = $('<div>')
      .addClass(TOOLBAR_ITEMS_CONTAINER_CLASS)
      .appendTo(this.$element());

    this.setAria('role', 'toolbar');
  }

  _renderSections(): void {
    const $container = this._$toolbarItemsContainer;

    each(['before', 'center', 'after'], (_, section) => {
      const sectionClass = `dx-toolbar-${section}`;
      const $section = $container.find(`.${sectionClass}`);

      if (!$section.length) {
        this[`_$${section}Section`] = $('<div>')
          .addClass(sectionClass)
          .attr('role', 'presentation')
          .appendTo($container);
      }
    });
  }

  _arrangeItems(width?: number): void {
    const elementWidth = width ?? getWidth(this.$element());

    this._$centerSection?.css({
      margin: '0 auto',
      float: 'none',
    });

    const beforeWidth = getOuterWidth(this._$beforeSection?.get(0)) ?? 0;
    const afterWidth = getOuterWidth(this._$afterSection?.get(0)) ?? 0;

    this._alignCenterSection(beforeWidth, afterWidth, elementWidth);

    const $label = this._$toolbarItemsContainer.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0);
    const $section: dxElementWrapper = $label.parent();

    if (!$label.length) {
      return;
    }

    const labelOffset = beforeWidth ?? $label.position()?.left;
    const widthBeforeSection = $section.hasClass(TOOLBAR_BEFORE_CLASS) ? 0 : labelOffset;
    const widthAfterSection = $section.hasClass(TOOLBAR_AFTER_CLASS) ? 0 : afterWidth;
    let elemsAtSectionWidth = 0;

    // @ts-expect-error ts error
    $section.children().not(`.${TOOLBAR_LABEL_CLASS}`).each((_, element) => {
      elemsAtSectionWidth += getOuterWidth(element);
    });

    const freeSpace = elementWidth - elemsAtSectionWidth;
    const sectionMaxWidth = Math.max(freeSpace - widthBeforeSection - widthAfterSection, 0);

    if ($section.hasClass(TOOLBAR_BEFORE_CLASS)) {
      if (this._$beforeSection) {
        this._alignSection(this._$beforeSection, sectionMaxWidth);
      }
    } else {
      const labelPaddings = getOuterWidth($label) - getWidth($label);
      $label.css('maxWidth', sectionMaxWidth - labelPaddings);
    }
  }

  _alignCenterSection(beforeWidth: number, afterWidth: number, elementWidth: number): void {
    if (!this._$centerSection) {
      return;
    }

    this._alignSection(this._$centerSection, elementWidth - beforeWidth - afterWidth);

    const { rtlEnabled: isRTL } = this.option();
    const leftWidth = isRTL ? afterWidth : beforeWidth;
    const rightWidth = isRTL ? beforeWidth : afterWidth;

    const centerEl = this._$centerSection.get(0) as HTMLElement;
    const centerLeft = centerEl.offsetLeft;
    const centerRight = centerLeft + centerEl.offsetWidth;

    const beforeEl = this._$beforeSection?.get(0) as HTMLElement | undefined;
    const afterEl = this._$afterSection?.get(0) as HTMLElement | undefined;
    const leftSectionRight = afterEl ? afterEl.offsetLeft + afterEl.offsetWidth : 0;
    const leftSectionRightLTR = beforeEl ? beforeEl.offsetLeft + beforeEl.offsetWidth : 0;
    const leftRight = isRTL ? leftSectionRight : leftSectionRightLTR;
    const rightLeft = isRTL
      ? (beforeEl?.offsetLeft ?? elementWidth)
      : (afterEl?.offsetLeft ?? elementWidth);

    if (leftRight > centerLeft || centerRight > rightLeft) {
      this._$centerSection.css({
        marginLeft: leftWidth,
        marginRight: rightWidth,
        float: leftWidth > rightWidth ? 'none' : 'right',
      });
    }
  }

  _alignSection($section: dxElementWrapper, maxWidth: number): void {
    const $labels = $section.find(`.${TOOLBAR_LABEL_CLASS}`);
    const labels = $labels.toArray();

    const maxWidthWithoutPaddings = maxWidth - this._getCurrentLabelsPaddings(labels);
    const currentWidth = this._getCurrentLabelsWidth(labels);
    const difference = Math.abs(currentWidth - maxWidthWithoutPaddings);

    if (maxWidthWithoutPaddings < currentWidth) {
      const reversedLabels = labels.reverse();

      this._alignSectionLabels(reversedLabels, difference, false);
    } else {
      this._alignSectionLabels(labels, difference, true);
    }
  }

  _alignSectionLabels(
    labels: Element[],
    difference: number,
    expanding: boolean,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const getRealLabelWidth = (label: Element): number => getOuterWidth(label) ?? 0;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of, no-plusplus
    for (let i = 0; i < labels.length; i++) {
      const $label = $(labels[i]);
      const currentLabelWidth = Math.ceil(getRealLabelWidth(labels[i]));

      let labelMaxWidth = 0;

      if (expanding) {
        $label.css('maxWidth', 'inherit');
      }

      const width = expanding ? getRealLabelWidth(labels[i]) : currentLabelWidth;
      const possibleLabelWidth = Math.ceil(width);

      if (possibleLabelWidth < difference) {
        labelMaxWidth = expanding ? possibleLabelWidth : 0;
        // eslint-disable-next-line no-param-reassign
        difference -= possibleLabelWidth;
      } else {
        labelMaxWidth = expanding ? currentLabelWidth + difference : currentLabelWidth - difference;
        $label.css('maxWidth', labelMaxWidth);
        break;
      }

      $label.css('maxWidth', labelMaxWidth);
    }
  }

  _applyCompactMode(): void {
    const $element = $(this.element());
    $element.removeClass(TOOLBAR_COMPACT_CLASS);

    const { compactMode } = this.option();
    if (compactMode && this._getSummaryItemsSize('width', this._itemElements(), true) > getWidth($element)) {
      $element.addClass(TOOLBAR_COMPACT_CLASS);
    }
  }

  _getCurrentLabelsWidth(labels: Element[]): number {
    let width = 0;

    labels.forEach((label) => {
      width += getOuterWidth(label);
    });

    return width;
  }

  _getCurrentLabelsPaddings(labels: Element[]): number {
    let padding = 0;

    labels.forEach((label) => {
      padding += getOuterWidth(label) - getWidth(label);
    });

    return padding;
  }

  _renderItem(
    index: number,
    itemData: Item,
    $container: dxElementWrapper,
    $itemToReplace?: dxElementWrapper,
  ): dxElementWrapper {
    const location = itemData.location ?? 'center';
    const container = $container ?? this[`_$${location}Section`];
    const itemHasText = !!(itemData.text ?? itemData.html);
    const $itemElement = super._renderItem(index, itemData, container, $itemToReplace);

    $itemElement
      .toggleClass(TOOLBAR_BUTTON_CLASS, !itemHasText)
      .toggleClass(TOOLBAR_LABEL_CLASS, itemHasText)
      .addClass(itemData.cssClass ?? '');

    return $itemElement;
  }

  _renderGroupedItems(): void {
    const { items: groups = [] } = this.option();
    each(groups, (groupIndex, group) => {
      const groupItems = group.items;
      const $container = $('<div>').addClass(TOOLBAR_GROUP_CLASS);
      const location = group.location ?? 'center';

      if (!groupItems?.length) {
        return;
      }

      each(groupItems, (itemIndex, item) => {
        this._renderItem(itemIndex, item, $container);
      });

      this._$toolbarItemsContainer.find(`.dx-toolbar-${location}`).append($container);
    });
  }

  _renderItems(items: Item[]): void {
    const { grouped: isGroupedOption } = this.option();
    // @ts-expect-error ts-error
    const grouped = isGroupedOption && items.length && items[0].items;

    if (grouped) {
      this._renderGroupedItems();
    } else {
      super._renderItems(items);
    }
  }

  _getToolbarItems(): Item[] {
    const { items = [] } = this.option();
    return items;
  }

  _renderContentImpl(): void {
    const items = this._getToolbarItems();

    this.$element().toggleClass(TOOLBAR_MINI_CLASS, items.length === 0);

    if (this._renderedItemsCount) {
      this._renderItems(items.slice(this._renderedItemsCount));
    } else {
      this._renderItems(items);
    }

    this._applyCompactMode();
  }

  _renderEmptyMessage(): boolean {
    return false;
  }

  _clean(): void {
    super._clean();

    this._$toolbarItemsContainer.children().empty();

    this.$element().empty();
    // @ts-expect-error ts-error
    delete this._$beforeSection;
    // @ts-expect-error ts-error
    delete this._$centerSection;
    // @ts-expect-error ts-error
    delete this._$afterSection;
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._arrangeItems();
    }
  }

  _isVisible(): boolean {
    return getWidth(this.$element()) > 0 && getHeight(this.$element()) > 0;
  }

  _getIndexByItem(item: Item): number {
    return this._getToolbarItems().indexOf(item);
  }

  _itemOptionChanged(
    item: Item,
    property: keyof Item,
    value: unknown,
    prevValue: unknown,
  ): void {
    super._itemOptionChanged(item, property, value, prevValue);
    this._arrangeItems();
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'width':
        super._optionChanged(args);
        this._dimensionChanged();
        break;
      case 'renderAs':
      case 'useFlatButtons':
      case 'useDefaultButtons':
        this._invalidate();
        break;
      case 'compactMode':
        this._applyCompactMode();
        break;
      case 'allowKeyboardNavigation':
        this.$element().toggleClass(TOOLBAR_FOCUS_MODE_CLASS, !!value);
        this.option('focusStateEnabled', !!value);
        this._updateFocusableItemsTabIndex();
        break;
      case 'grouped':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _dispose(): void {
    super._dispose();
    clearTimeout(this._waitParentAnimationTimeout);
  }

  _updateDimensionsInMaterial(): void {
    if (isMaterial(current())) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _waitParentAnimationFinished = (): Promise<void> => new Promise((resolve) => {
        const check = (): boolean => {
          let readyToResolve = true;
          this.$element().parents().each((_, parent: Element): boolean => {
            if (fx.isAnimating($(parent).get(0))) {
              readyToResolve = false;
              return false;
            }
            return true;
          });
          if (readyToResolve) {
            resolve();
          }
          return readyToResolve;
        };
        const runCheck = (): void => {
          clearTimeout(this._waitParentAnimationTimeout);
          // eslint-disable-next-line no-restricted-globals
          this._waitParentAnimationTimeout = setTimeout(
            () => check() || runCheck(),
            ANIMATION_TIMEOUT,
          );
        };
        runCheck();
      });

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _checkWebFontForLabelsLoaded = (): Promise<unknown[]> => {
        const $labels = this.$element().find(`.${TOOLBAR_LABEL_CLASS}`);
        const promises: Promise<unknown>[] = [];
        $labels.each((_, label): boolean => {
          const text = $(label).text();
          const fontWeight = $(label).css('fontWeight');
          promises.push(waitWebFont(text, fontWeight));
          return true;
        });
        return Promise.all(promises);
      };

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.all([
        _waitParentAnimationFinished(),
        _checkWebFontForLabelsLoaded(),
      ]).then(() => { this._dimensionChanged(); });
    }
  }
}

registerComponent('dxToolbarBase', ToolbarBase);

export default ToolbarBase;
