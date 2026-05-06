import type { DefaultOptionsRule } from '@js/common';
import { fx } from '@js/common/core/animation';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { BindableTemplate } from '@js/core/templates/bindable_template';
import { deferRender } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { getImageContainer } from '@js/core/utils/icon';
import * as iteratorUtils from '@js/core/utils/iterator';
import { getHeight, getOuterHeight, setHeight } from '@js/core/utils/size';
import { isDefined, isPlainObject } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Item, Properties } from '@js/ui/accordion';
import { current, isMaterialBased } from '@js/ui/themes';
import type { OptionChanged } from '@ts/core/widget/types';
import type { CollectionItemInfo, CollectionItemKey, ItemRenderInfo } from '@ts/ui/collection/collection_widget.base';
import type { CollectionWidgetLiveUpdateProperties } from '@ts/ui/collection/collection_widget.live_update';
import CollectionWidgetLiveUpdate from '@ts/ui/collection/collection_widget.live_update';

const ACCORDION_CLASS = 'dx-accordion';
const ACCORDION_WRAPPER_CLASS = 'dx-accordion-wrapper';
const ACCORDION_ITEM_CLASS = 'dx-accordion-item';
const ACCORDION_ITEM_OPENED_CLASS = 'dx-accordion-item-opened';
const ACCORDION_ITEM_CLOSED_CLASS = 'dx-accordion-item-closed';
const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';
const ACCORDION_ITEM_TITLE_CAPTION_CLASS = 'dx-accordion-item-title-caption';

const ACCORDION_ITEM_DATA_KEY = 'dxAccordionItemData';

export interface AccordionProperties extends Properties<Item, CollectionItemKey>, Omit<
  CollectionWidgetLiveUpdateProperties<Accordion, Item, CollectionItemKey>,
  keyof Properties<Item, CollectionItemKey>
> {
  _animationEasing?: string;
}

class Accordion extends CollectionWidgetLiveUpdate<AccordionProperties, Item, CollectionItemKey> {
  _deferredAnimate?: DeferredObj<unknown>;

  // eslint-disable-next-line no-restricted-globals
  _animationTimer?: ReturnType<typeof setTimeout>;

  _$container!: dxElementWrapper;

  _deferredItems!: DeferredObj<unknown>[];

  protected _activeStateUnit(): string {
    return `.${ACCORDION_ITEM_CLASS}`;
  }

  _getDefaultOptions(): AccordionProperties {
    return {
      ...super._getDefaultOptions(),
      hoverStateEnabled: true,
      itemTitleTemplate: 'title',
      // @ts-expect-error ts-error
      onItemTitleClick: null,
      selectedIndex: 0,
      collapsible: false,
      multiple: false,
      animationDuration: 300,
      deferRendering: true,
      selectByClick: true,
      activeStateEnabled: true,
      _itemAttributes: { role: 'tab' },
      _animationEasing: 'ease',
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<AccordionProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device(): boolean {
          return isMaterialBased(current());
        },
        options: {
          animationDuration: 200,
          _animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    ]);
  }

  _itemElements(): dxElementWrapper {
    return this._itemContainer().children(this._itemSelector());
  }

  _init(): void {
    super._init();

    const { collapsible, multiple } = this.option();

    this.option('selectionRequired', !collapsible);
    this.option('selectionMode', multiple ? 'multiple' : 'single');

    const $element = this.$element();
    $element.addClass(ACCORDION_CLASS);

    this._$container = $('<div>').addClass(ACCORDION_WRAPPER_CLASS);
    $element.append(this._$container);
  }

  _initTemplates(): void {
    super._initTemplates();
    this._templateManager.addDefaultTemplates({

      title: new BindableTemplate(($container: dxElementWrapper, data: Item) => {
        if (isPlainObject(data)) {
          const $iconElement = getImageContainer(data.icon);
          if ($iconElement) {
            $container.append($iconElement);
          }

          if (isDefined(data.title) && !isPlainObject(data.title)) {
            $container.append(domAdapter.createTextNode(data.title));
          }
        } else if (isDefined(data)) {
          $container.text(String(data));
        }

        $container.wrapInner($('<div>').addClass(ACCORDION_ITEM_TITLE_CAPTION_CLASS));
      }, ['title', 'icon'], this.option('integrationOptions.watchMethod')),
    });
  }

  _initMarkup(): void {
    this._deferredItems = [];
    super._initMarkup();

    const { multiple } = this.option();

    this.setAria({
      role: 'tablist',
      // eslint-disable-next-line spellcheck/spell-checker
      multiselectable: multiple,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferRender((): void => {
      const selectedItemIndices = this._getSelectedItemIndices();
      this._renderSelection(selectedItemIndices, []);
    });
  }

  _postProcessRenderItems(): void {
    this._updateItemHeights(true);
  }

  _itemDataKey(): string {
    return ACCORDION_ITEM_DATA_KEY;
  }

  _itemClass(): string {
    return ACCORDION_ITEM_CLASS;
  }

  _itemContainer(): dxElementWrapper {
    return this._$container;
  }

  _itemTitles(): dxElementWrapper {
    return this._itemElements().find(`.${ACCORDION_ITEM_TITLE_CLASS}`);
  }

  _itemContents(): dxElementWrapper {
    return this._itemElements().find(`.${ACCORDION_ITEM_BODY_CLASS}`);
  }

  _getItemData(target: Element | dxElementWrapper): Item {
    // @ts-expect-error ts-error
    const itemData = $(target).parent().data(this._itemDataKey()) as Item | undefined;

    return itemData ?? super._getItemData(target);
  }

  _itemSelectHandler(e: DxEvent): void {
    if ($(e.target).closest(this._itemContents()).length) {
      return;
    }

    super._itemSelectHandler(e);
  }

  _afterItemElementDeleted(
    $item: dxElementWrapper,
    deletedActionArgs: CollectionItemInfo<Item, number>,
  ): void {
    this._deferredItems.splice(deletedActionArgs.itemIndex, 1);
    super._afterItemElementDeleted($item, deletedActionArgs);
  }

  _renderItemContent(args: ItemRenderInfo<Item>): DeferredObj<dxElementWrapper> {
    const { itemTitleTemplate } = this.option();

    const itemTitleDeferred = super._renderItemContent({
      ...args,
      contentClass: ACCORDION_ITEM_TITLE_CLASS,
      templateProperty: 'titleTemplate',
      defaultTemplateName: itemTitleTemplate,
    });
    const callBase = super._renderItemContent.bind(this);

    return itemTitleDeferred.done((itemTitle: dxElementWrapper | Element): void => {
      this._attachItemTitleClickAction(itemTitle);

      const deferred = Deferred();
      if (isDefined(this._deferredItems[args.index])) {
        this._deferredItems[args.index] = deferred;
      } else {
        this._deferredItems.push(deferred);
      }

      const { deferRendering } = this.option();

      if (!deferRendering || this._getSelectedItemIndices().includes(args.index)) {
        deferred.resolve();
      }

      deferred.done(() => {
        callBase({
          ...args,
          contentClass: ACCORDION_ITEM_BODY_CLASS,
          container: getPublicElement($('<div>').appendTo($(itemTitle).parent())),
        });
      });
    });
  }

  _attachItemTitleClickAction($itemTitle: dxElementWrapper | Element): void {
    // @ts-expect-error ts-error
    const eventName = addNamespace(clickEventName, this.NAME);

    eventsEngine.off($itemTitle, eventName);
    eventsEngine.on($itemTitle, eventName, this._itemTitleClickHandler.bind(this));
  }

  _itemTitleClickHandler(e: DxEvent): void {
    this._itemDXEventHandler(e, 'onItemTitleClick');
  }

  _renderSelection(addedSelection: number[], removedSelection: number[]): void {
    this._itemElements().addClass(ACCORDION_ITEM_CLOSED_CLASS);
    this.setAria('hidden', true, this._itemContents());

    this._updateItems(addedSelection, removedSelection);
  }

  _updateSelection(addedSelection: number[], removedSelection: number[]): void {
    this._updateItems(addedSelection, removedSelection);
    this._updateItemHeightsWrapper(false);
  }

  _updateItems(addedSelection: number[], removedSelection: number[]): void {
    const $items = this._itemElements();

    iteratorUtils.each(addedSelection, (_i: number, addedIndex: number) => {
      this._deferredItems[addedIndex]?.resolve();

      const $item = $items.eq(addedIndex)
        .addClass(ACCORDION_ITEM_OPENED_CLASS)
        .removeClass(ACCORDION_ITEM_CLOSED_CLASS);
      this.setAria('hidden', false, $item.find(`.${ACCORDION_ITEM_BODY_CLASS}`));
    });

    iteratorUtils.each(removedSelection, (_i: number, removedIndex: number) => {
      const $item = $items.eq(removedIndex)
        .removeClass(ACCORDION_ITEM_OPENED_CLASS);
      this.setAria('hidden', true, $item.find(`.${ACCORDION_ITEM_BODY_CLASS}`));
    });
  }

  _updateItemHeightsWrapper(skipAnimation: boolean): void {
    const { templatesRenderAsynchronously } = this.option();

    // Note: require for proper animation in angularjs (T520346)
    if (templatesRenderAsynchronously) {
      // eslint-disable-next-line no-restricted-globals
      this._animationTimer = setTimeout(() => {
        this._updateItemHeights(skipAnimation);
      });
    } else {
      this._updateItemHeights(skipAnimation);
    }
  }

  _updateItemHeights(skipAnimation: boolean): DeferredObj<unknown> {
    const deferredAnimate = this._deferredAnimate;
    const itemHeight = this._splitFreeSpace(this._calculateFreeSpace());

    clearTimeout(this._animationTimer);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return when.apply($, [...this._itemElements().toArray()].map(
      (item) => that._updateItemHeight($(item), itemHeight, skipAnimation),
    ))
      .done(() => {
        if (deferredAnimate) {
          // @ts-expect-error ts-error
          deferredAnimate.resolveWith(that);
        }
      });
  }

  _updateItemHeight(
    $item: dxElementWrapper,
    itemHeight: number | undefined,
    skipAnimation: boolean,
  ): DeferredObj<unknown> {
    const $title = $item.children(`.${ACCORDION_ITEM_TITLE_CLASS}`);
    if (fx.isAnimating($item.get(0))) {
      fx.stop($item.get(0), false);
    }

    const startItemHeight: number = getOuterHeight($item);
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let finalItemHeight: number;

    if ($item.hasClass(ACCORDION_ITEM_OPENED_CLASS)) {
      finalItemHeight = itemHeight + getOuterHeight($title);

      if (!finalItemHeight) {
        setHeight($item, 'auto');
        finalItemHeight = getOuterHeight($item);
      }
    } else {
      finalItemHeight = getOuterHeight($title);
    }

    $item.css('overflow', '');
    $item.find(`.${ACCORDION_ITEM_BODY_CLASS}`).css('overflow', '');

    return this._animateItem($item, startItemHeight, finalItemHeight, skipAnimation, !!itemHeight);
  }

  _animateItem(
    $element: dxElementWrapper,
    startHeight: number,
    endHeight: number,
    skipAnimation: boolean,
    fixedHeight: boolean,
  ): DeferredObj<unknown> {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let deferred: DeferredObj<unknown> | Promise<void>;

    if (skipAnimation || startHeight === endHeight) {
      $element.css('height', endHeight);
      deferred = Deferred().resolve();
    } else {
      const { animationDuration, _animationEasing: easing } = this.option();

      deferred = fx.animate(
        $element.get(0),
        {
          // @ts-expect-error ts-error
          type: 'custom',
          // @ts-expect-error ts-error
          from: { height: startHeight },
          // @ts-expect-error ts-error,
          to: { height: endHeight },
          duration: animationDuration,
          easing,
        },
      );
    }

    // @ts-expect-error ts-error
    return deferred.done(() => {
      if ($element.hasClass(ACCORDION_ITEM_OPENED_CLASS) && !fixedHeight) {
        $element.css('height', '');
      }

      if ($element.hasClass(ACCORDION_ITEM_OPENED_CLASS)) {
        $element.css('overflow', 'visible');
        $element.find(`.${ACCORDION_ITEM_BODY_CLASS}`).css('overflow', 'visible');
      }

      $element
        .not(`.${ACCORDION_ITEM_OPENED_CLASS}`)
        .addClass(ACCORDION_ITEM_CLOSED_CLASS);
    }) as DeferredObj<unknown>;
  }

  _splitFreeSpace(freeSpace: number | undefined): number | undefined {
    const { selectedItems } = this.option();

    if (!freeSpace || !selectedItems?.length) {
      return freeSpace;
    }

    return freeSpace / selectedItems.length;
  }

  _calculateFreeSpace(): number | undefined {
    const { height } = this.option();

    if (height === undefined || height === 'auto') {
      return undefined;
    }

    const $titles = this._itemTitles();
    let itemsHeight = 0;

    iteratorUtils.each($titles, (_index: number, title: Element) => {
      itemsHeight += getOuterHeight(title);
    });

    const elementHeight: number = getHeight(this.$element());

    return elementHeight - itemsHeight;
  }

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._dimensionChanged();
    }
  }

  _dimensionChanged(): void {
    this._updateItemHeights(true);
  }

  _clean(): void {
    clearTimeout(this._animationTimer);
    super._clean();
  }

  _tryParseItemPropertyName(fullName: string): string | null {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const matches = fullName.match(/.*\.(.*)/);

    if (isDefined(matches) && (matches.length >= 1)) {
      return matches[1];
    }

    return null;
  }

  _optionChanged(args: OptionChanged<AccordionProperties>): void {
    switch (args.name) {
      case 'items': {
        super._optionChanged(args);

        if (this._tryParseItemPropertyName(args.fullName) === 'title') {
          this._renderSelection(this._getSelectedItemIndices(), []);
        }
        if (this._tryParseItemPropertyName(args.fullName) === 'visible') {
          this._updateItemHeightsWrapper(true);
        }
        const { repaintChangesOnly } = this.option();

        if (repaintChangesOnly === true && args.fullName === 'items') {
          this._renderSelection(this._getSelectedItemIndices(), []);
          this._updateItemHeightsWrapper(true);
        }
        break;
      }
      case 'animationDuration':
      case 'onItemTitleClick':
      case '_animationEasing':
        break;
      case 'collapsible':
        this.option('selectionRequired', !this.option('collapsible'));
        break;
      case 'itemTitleTemplate':
      case 'height':
      case 'deferRendering':
        this._invalidate();
        break;
      case 'multiple':
        this.option('selectionMode', args.value ? 'multiple' : 'single');
        break;
      default:
        super._optionChanged(args);
    }
  }

  expandItem(index: number): Promise<unknown> {
    this._deferredAnimate = Deferred();

    this.selectItem(index);

    return this._deferredAnimate.promise();
  }

  collapseItem(index: number): Promise<unknown> {
    this._deferredAnimate = Deferred();

    this.unselectItem(index);

    return this._deferredAnimate.promise();
  }

  updateDimensions(): DeferredObj<unknown> {
    return this._updateItemHeights(false);
  }
}

registerComponent('dxAccordion', Accordion);

export default Accordion;
