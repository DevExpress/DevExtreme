import type { DefaultOptionsRule } from '@js/common';
import { fx } from '@js/common/core/animation';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import { getHeight, getOuterWidth, getWidth } from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import {
  current,
  isMaterial,
  isMaterialBased,
  // @ts-expect-error ts-error
  waitWebFont,
} from '@js/ui/themes';
import type { Item, Properties } from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import CollectionWidgetAsync from '@ts/ui/collection/collection_widget.async';
import type { CollectionItemKey, CollectionWidgetBaseProperties } from '@ts/ui/collection/collection_widget.base';

import { TOOLBAR_CLASS } from './constants';

export const TOOLBAR_BEFORE_CLASS = 'dx-toolbar-before';
const TOOLBAR_CENTER_CLASS = 'dx-toolbar-center';
export const TOOLBAR_AFTER_CLASS = 'dx-toolbar-after';
const TOOLBAR_MINI_CLASS = 'dx-toolbar-mini';
const TOOLBAR_ITEM_CLASS = 'dx-toolbar-item';
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
  grouped: boolean;
  renderAs: 'topToolbar';
  useFlatButtons: boolean;
  useDefaultButtons: boolean;
  compactMode: boolean;
}

class ToolbarBase<
  TProperties extends ToolbarBaseProperties = ToolbarBaseProperties,
> extends CollectionWidgetAsync<TProperties> {
  _$toolbarItemsContainer!: dxElementWrapper;

  _$beforeSection!: dxElementWrapper;

  _$centerSection!: dxElementWrapper;

  _$afterSection!: dxElementWrapper;

  // eslint-disable-next-line no-restricted-globals
  _waitParentAnimationTimeout?: ReturnType<typeof setTimeout>;

  _getSynchronizableOptionsForCreateComponent(): (keyof TProperties)[] {
    return super._getSynchronizableOptionsForCreateComponent().filter((item) => item !== 'disabled');
  }

  _initTemplates(): void {
    super._initTemplates();

    const template = new BindableTemplate(($container, data, rawModel) => {
      if (isPlainObject(data)) {
        const { text, html, widget } = data;

        if (text) {
          $container.text(text).wrapInner('<div>');
        }

        if (html) {
          $container.html(html);
        }

        if (widget === 'dxDropDownButton') {
          data.options = data.options ?? {};

          if (!isDefined(data.options.stylingMode)) {
            data.options.stylingMode = this.option('useFlatButtons')
              ? TEXT_BUTTON_MODE
              : DEFAULT_DROPDOWNBUTTON_STYLING_MODE;
          }
        }

        if (widget === 'dxButton') {
          if (this.option('useFlatButtons')) {
            data.options = data.options ?? {};
            data.options.stylingMode = data.options.stylingMode ?? TEXT_BUTTON_MODE;
          }

          if (this.option('useDefaultButtons')) {
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
    }, ['text', 'html', 'widget', 'options'], this.option('integrationOptions.watchMethod'));

    this._templateManager.addDefaultTemplates({
      item: template,
      menuItem: template,
    });
  }

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      renderAs: 'topToolbar',
      grouped: false,
      useFlatButtons: false,
      useDefaultButtons: false,
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
  }

  _renderToolbar(): void {
    this.$element()
      .addClass(TOOLBAR_CLASS);

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

    const beforeRect = getBoundingRect(this._$beforeSection?.get(0));
    const afterRect = getBoundingRect(this._$afterSection?.get(0));

    this._alignCenterSection(beforeRect, afterRect, elementWidth);

    const $label = this._$toolbarItemsContainer.find(`.${TOOLBAR_LABEL_CLASS}`).eq(0);
    const $section: dxElementWrapper = $label.parent();

    if (!$label.length) {
      return;
    }

    const labelOffset = beforeRect.width ? beforeRect.width : $label.position()?.left;
    const widthBeforeSection = $section.hasClass(TOOLBAR_BEFORE_CLASS) ? 0 : labelOffset;
    const widthAfterSection = $section.hasClass(TOOLBAR_AFTER_CLASS) ? 0 : afterRect.width;
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

  _alignCenterSection(
    beforeRect: DOMRect,
    afterRect: DOMRect,
    elementWidth: number,
  ): void {
    if (!this._$centerSection) {
      return;
    }

    this._alignSection(this._$centerSection, elementWidth - beforeRect.width - afterRect.width);

    const isRTL = this.option('rtlEnabled');
    const leftRect = isRTL ? afterRect : beforeRect;
    const rightRect = isRTL ? beforeRect : afterRect;
    const centerRect = getBoundingRect(this._$centerSection.get(0));

    if (leftRect.right > centerRect.left || centerRect.right > rightRect.left) {
      this._$centerSection.css({
        marginLeft: leftRect.width,
        marginRight: rightRect.width,
        float: leftRect.width > rightRect.width ? 'none' : 'right',
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
    const getRealLabelWidth = (label: Element): number => (getBoundingRect(label) as DOMRect).width;

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

    if (this.option('compactMode') && this._getSummaryItemsSize('width', this._itemElements(), true) > getWidth($element)) {
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
    each(this.option('items'), (groupIndex, group) => {
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
    // @ts-expect-error ts-error
    const grouped = this.option('grouped') && items.length && items[0].items;

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

  _renderEmptyMessage(): void {}

  _clean(): void {
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
    const { name } = args;

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
