import { fx } from '@js/common/core/animation';
import { resetPosition } from '@js/common/core/animation/translator';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth,
} from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';
import type { Quad } from '@ts/core/utils/m_string';
import type { OptionChanged } from '@ts/core/widget/types';
import Draggable from '@ts/draggable';
import type { EngineEvent } from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';

import { isDefined } from '../core/utils/type';
import type { DragEvent, DragEventArgs, DragTemplateArgs } from './draggable.types';
import type {
  AnimateConfig, ItemPoint, OptionChangedToIndexArgs, SortableDragStartArgs,
  SortableEventArgs, SortableProperties, SourceScrollableInfo,
} from './sortable.types';

const window = getWindow();

const SORTABLE = 'dxSortable';

const PLACEHOLDER_CLASS = 'placeholder';
const CLONE_CLASS = 'clone';

const isElementVisible = (itemElement: Element): boolean => $(itemElement).is(':visible');

const animate = (element: HTMLElement | undefined, config: AnimateConfig): void => {
  if (!element) return;

  const left = config.to?.left || 0;
  const top = config.to?.top || 0;

  element.style.transform = `translate(${left}px,${top}px)`;
  // @ts-expect-error off is not declared
  element.style.transition = fx.off ? '' : `transform ${config.duration}ms ${config.easing}`;
};

const stopAnimation = (element: HTMLElement | undefined): void => {
  if (!element) return;

  element.style.transform = '';
  element.style.transition = '';
};

function getScrollableBoundary($scrollable: dxElementWrapper): Quad {
  const offset = $scrollable.offset();
  const { style } = $scrollable[0] as HTMLElement;
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingRight = parseFloat(style.paddingRight) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  // use clientWidth, because vertical scrollbar reduces content width
  const width = ($scrollable[0] as HTMLElement).clientWidth - (paddingLeft + paddingRight);
  const height = getHeight($scrollable);
  // @ts-expect-error offset can be undefined
  const left = offset.left + paddingLeft;
  // @ts-expect-error offset can be undefined
  const top = offset.top + paddingTop;
  return {
    left,
    right: left + width,
    top,
    bottom: top + height,
  };
}

class Sortable extends Draggable<SortableProperties> {
  _$placeholderElement?: dxElementWrapper | null;

  _$scrollable?: dxElementWrapper;

  _$modifiedItem?: dxElementWrapper | null;

  _sourceScrollableInfo?: SourceScrollableInfo | null;

  _sourceScrollHandler!: (e: EngineEvent) => void;

  _modifiedItemMargin?: string;

  _init(): void {
    super._init();
    this._sourceScrollHandler = this._handleSourceScroll.bind(this);
    this._sourceScrollableInfo = null;
  }

  _getDefaultOptions(): SortableProperties {
    return {
      ...super._getDefaultOptions(),
      onDragStart: undefined,
      onDragMove: undefined,
      onDragEnd: undefined,
      clone: true,
      filter: '> *',
      itemOrientation: 'vertical',
      dropFeedbackMode: 'push',
      allowDropInsideItem: false,
      allowReordering: true,
      moveItemOnDrop: false,
      onDragChange: undefined,
      onAdd: undefined,
      onRemove: undefined,
      onReorder: undefined,
      onPlaceholderPrepared: undefined,
      placeholderClassName: '',
      animation: {
        type: 'slide',
        duration: 300,
        easing: 'ease',
      },
      fromIndex: null,
      toIndex: null,
      dropInsideItem: false,
      itemPoints: null,
      fromIndexOffset: 0,
      offset: 0,
      autoUpdate: false,
      draggableElementSize: 0,
    };
  }

  reset(): void {
    this.option({
      dropInsideItem: false,
      toIndex: null,
      fromIndex: null,
      itemPoints: null,
      fromIndexOffset: 0,
      draggableElementSize: 0,
    });

    if (this._$placeholderElement) {
      this._$placeholderElement.remove();
    }
    this._$placeholderElement = null;

    if (!this._isIndicateMode() && this._$modifiedItem) {
      // @ts-expect-error css value can be undefined
      this._$modifiedItem.css('marginBottom', this._modifiedItemMargin);
      this._$modifiedItem = null;
    }
  }

  _getPrevVisibleItem(items: Element[], index?: number | null): Element | undefined {
    return items
      // @ts-expect-error slice is declared without null
      .slice(0, index)
      .reverse()
      .filter(isElementVisible)[0];
  }

  _dragStartHandler(e: DragEvent): void {
    super._dragStartHandler(e);

    if (e.cancel === true) {
      return;
    }

    const $sourceElement = this._getSourceElement();

    this._updateItemPoints();
    this._subscribeToSourceScroll(e);
    this.option('fromIndex', this._getElementIndex($sourceElement));
    this.option('fromIndexOffset', this.option('offset'));
  }

  _subscribeToSourceScroll(e: DragEvent): void {
    const $scrollable = this._getScrollable($(e.target));
    if ($scrollable) {
      this._sourceScrollableInfo = {
        element: $scrollable,
        // @ts-expect-error scrollLeft is declared to return the wrapper
        scrollLeft: $scrollable.scrollLeft(),
        // @ts-expect-error scrollTop is declared to return the wrapper
        scrollTop: $scrollable.scrollTop(),
      };

      eventsEngine.off($scrollable, 'scroll', this._sourceScrollHandler);
      eventsEngine.on($scrollable, 'scroll', this._sourceScrollHandler);
    }
  }

  _unsubscribeFromSourceScroll(): void {
    if (this._sourceScrollableInfo) {
      eventsEngine.off(this._sourceScrollableInfo.element, 'scroll', this._sourceScrollHandler);
      this._sourceScrollableInfo = null;
    }
  }

  _handleSourceScroll(e: EngineEvent): void {
    const sourceScrollableInfo = this._sourceScrollableInfo;
    if (sourceScrollableInfo) {
      (['scrollLeft', 'scrollTop'] as const).forEach((scrollProp) => {
        const target = e.target as HTMLElement;
        if (target[scrollProp] !== sourceScrollableInfo[scrollProp]) {
          const scrollBy = target[scrollProp] - sourceScrollableInfo[scrollProp];
          this._correctItemPoints(scrollBy);
          this._movePlaceholder();
          sourceScrollableInfo[scrollProp] = target[scrollProp];
        }
      });
    }
  }

  _dragEnterHandler(e: DragEvent): void {
    super._dragEnterHandler(e);

    if (this === this._getSourceDraggable()) {
      return;
    }

    this._subscribeToSourceScroll(e);

    this._updateItemPoints();
    this.option('fromIndex', -1);

    if (!this._isIndicateMode()) {
      const itemPoints = this.option('itemPoints');
      // @ts-expect-error itemPoints are set by _updateItemPoints
      const lastItemPoint = itemPoints[itemPoints.length - 1];

      if (lastItemPoint) {
        const $element = this.$element();
        const $sourceElement = this._getSourceElement();
        const isVertical = this._isVerticalOrientation();
        const sourceElementSize = isVertical
          ? getOuterHeight($sourceElement, true)
          : getOuterWidth($sourceElement, true);
        const scrollSize = $element.get(0)[isVertical ? 'scrollHeight' : 'scrollWidth'];
        const scrollPosition = $element.get(0)[isVertical ? 'scrollTop' : 'scrollLeft'];
        const positionProp = isVertical ? 'top' : 'left';
        const lastPointPosition = lastItemPoint[positionProp];
        // @ts-expect-error offset can be undefined
        const elementPosition = $element.offset()[positionProp];
        const freeSize = elementPosition + scrollSize - scrollPosition - lastPointPosition;

        if (freeSize < sourceElementSize && isVertical) {
          const items = this._getItems();
          const $lastItem = $(this._getPrevVisibleItem(items));

          this._$modifiedItem = $lastItem;
          this._modifiedItemMargin = ($lastItem.get(0) as HTMLElement).style.marginBottom;

          $lastItem.css('marginBottom', sourceElementSize - freeSize);

          const $sortable = $lastItem.closest('.dx-sortable');
          // @ts-expect-error data is declared without the getter form
          const sortable: { update: () => void } | undefined = $sortable.data('dxScrollable') || $sortable.data('dxScrollView');

          sortable?.update();
        }
      }
    }
  }

  _dragLeaveHandler(e: DragEvent): void {
    super._dragLeaveHandler(e);

    if (this !== this._getSourceDraggable()) {
      this._unsubscribeFromSourceScroll();
    }
  }

  dragEnter(): void {
    if (this !== this._getTargetDraggable()) {
      this.option('toIndex', -1);
    }
  }

  dragLeave(): void {
    if (this !== this._getTargetDraggable()) {
      this.option('toIndex', this.option('fromIndex'));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _allowDrop(event?: DragEvent): boolean {
    const targetDraggable = this._getTargetDraggable();
    const $targetDraggable = targetDraggable.$element();
    const $scrollable = this._getScrollable($targetDraggable);

    if ($scrollable) {
      const {
        left, right, top, bottom,
      } = getScrollableBoundary($scrollable);
      const toIndex = this.option('toIndex');
      const itemPoints = this.option('itemPoints');
      const itemPoint = itemPoints?.filter((item) => item.index === toIndex)[0];

      if (itemPoint?.top !== undefined) {
        const isVertical = this._isVerticalOrientation();
        if (isVertical) {
          return top <= Math.ceil(itemPoint.top) && Math.floor(itemPoint.top) <= bottom;
        }
        return left <= Math.ceil(itemPoint.left) && Math.floor(itemPoint.left) <= right;
      }
    }

    return true;
  }

  dragEnd(sourceEvent: DragEventArgs): DeferredObj<unknown> | PromiseLike<void> {
    this._unsubscribeFromSourceScroll();

    const $sourceElement = this._getSourceElement();
    const sourceDraggable = this._getSourceDraggable();
    const isSourceDraggable = sourceDraggable.NAME !== this.NAME;
    const toIndex = this.option('toIndex');
    const { event } = sourceEvent;
    const allowDrop = this._allowDrop(event);

    if (toIndex !== null && toIndex >= 0 && allowDrop) {
      let cancelAdd: boolean | undefined = false;
      let cancelRemove: boolean | undefined = false;

      if (sourceDraggable !== this) {
        cancelAdd = this._fireAddEvent(event);

        if (!cancelAdd) {
          cancelRemove = this._fireRemoveEvent(event);
        }
      }

      if (isSourceDraggable) {
        // @ts-expect-error the source element can be null
        resetPosition($sourceElement);
      }
      if (this.option('moveItemOnDrop')) {
        if (!cancelAdd) {
          this._moveItem($sourceElement, toIndex, cancelRemove);
        }
      }

      if (sourceDraggable === this) {
        return this._fireReorderEvent(event);
      }
    }

    return Deferred().resolve();
  }

  dragMove(e: DragEvent): void {
    const itemPoints = this.option('itemPoints');

    if (!itemPoints) {
      return;
    }

    const isVertical = this._isVerticalOrientation();
    const axisName = isVertical ? 'top' : 'left';
    const cursorPosition = isVertical ? e.pageY : e.pageX;
    const rtlEnabled = this.option('rtlEnabled');

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let itemPoint: ItemPoint | undefined;
    for (let i = itemPoints.length - 1; i >= 0; i -= 1) {
      const centerPosition = itemPoints[i + 1]
        && (itemPoints[i][axisName] + itemPoints[i + 1][axisName]) / 2;

      if (
        (!isVertical && rtlEnabled
          ? cursorPosition > centerPosition
          : centerPosition > cursorPosition)
        || centerPosition === undefined
      ) {
        itemPoint = itemPoints[i];
      } else {
        break;
      }
    }
    if (itemPoint) {
      this._updatePlaceholderPosition(e, itemPoint);

      if (this._verticalScrollHelper.isScrolling() && this._isIndicateMode()) {
        this._movePlaceholder();
      }
    }
  }

  private _isIndicateMode(): boolean {
    return this.option('dropFeedbackMode') === 'indicate' || this.option('allowDropInsideItem');
  }

  private _createPlaceholder(): dxElementWrapper | undefined {
    if (!this._isIndicateMode()) {
      return undefined;
    }

    const customCssClass = this.option('placeholderClassName');

    this._$placeholderElement = $('<div>')
      .addClass(this._addWidgetPrefix(PLACEHOLDER_CLASS))
      .addClass(customCssClass ?? '')
      // @ts-expect-error the drag element can be null
      .insertBefore(this._getSourceDraggable()._$dragElement);

    return this._$placeholderElement;
  }

  _getItems(): Element[] {
    const itemsSelector = this._getItemsSelector();

    return this._$content()
      .find(itemsSelector)
      .not(`.${this._addWidgetPrefix(PLACEHOLDER_CLASS)}`)
      .not(`.${this._addWidgetPrefix(CLONE_CLASS)}`)
      .toArray();
  }

  _allowReordering(): boolean {
    const sourceDraggable = this._getSourceDraggable();
    const targetDraggable = this._getTargetDraggable();

    return sourceDraggable !== targetDraggable || this.option('allowReordering');
  }

  _isValidPoint(
    visibleIndex: number,
    draggableVisibleIndex: number,
    dropInsideItem?: boolean,
  ): boolean {
    const allowDropInsideItem = this.option('allowDropInsideItem');
    const allowReordering = dropInsideItem || this._allowReordering();

    if (!allowReordering && (visibleIndex !== 0 || !allowDropInsideItem)) {
      return false;
    }

    if (!this._isIndicateMode()) {
      return true;
    }

    return draggableVisibleIndex === -1 || (
      visibleIndex !== draggableVisibleIndex
      && (dropInsideItem || visibleIndex !== (draggableVisibleIndex + 1))
    );
  }

  _getItemPoints(): ItemPoint[] {
    let result: ItemPoint[] = [];
    /* eslint-disable @typescript-eslint/init-declarations */
    let $item: dxElementWrapper | undefined;
    let offset: Coordinates | undefined;
    let itemWidth: number | undefined;
    /* eslint-enable @typescript-eslint/init-declarations */
    const { rtlEnabled } = this.option();
    const isVertical = this._isVerticalOrientation();
    const itemElements = this._getItems();
    const visibleItemElements = itemElements.filter(isElementVisible);
    const visibleItemCount = visibleItemElements.length;
    const $draggableItem = this._getDraggableElement();
    const draggableVisibleIndex = visibleItemElements.indexOf($draggableItem.get(0));

    if (visibleItemCount) {
      for (let i = 0; i <= visibleItemCount; i += 1) {
        // @ts-expect-error a boolean is used as a number operand
        // eslint-disable-next-line no-bitwise
        const needCorrectLeftPosition = !isVertical && (rtlEnabled ^ (i === visibleItemCount));
        const needCorrectTopPosition = isVertical && i === visibleItemCount;

        if (i < visibleItemCount) {
          $item = $(visibleItemElements[i]);
          offset = $item.offset();
          itemWidth = getOuterWidth($item);
        }

        result.push({
          dropInsideItem: false,
          // @ts-expect-error offset can be undefined
          left: offset.left + (needCorrectLeftPosition ? itemWidth : 0),
          // @ts-expect-error offset can be undefined
          top: offset.top + (needCorrectTopPosition ? result[i - 1].height : 0),
          // @ts-expect-error $item is assigned in the loop
          index: i === visibleItemCount ? itemElements.length : itemElements.indexOf($item.get(0)),
          // @ts-expect-error $item is assigned in the loop
          $item,
          width: getOuterWidth($item),
          height: getOuterHeight($item),
          isValid: this._isValidPoint(i, draggableVisibleIndex),
        });
      }

      if (this.option('allowDropInsideItem')) {
        const points = result;
        result = [];
        for (let i = 0; i < points.length; i += 1) {
          result.push(points[i]);
          // eslint-disable-next-line max-depth
          if (points[i + 1]) {
            result.push(extend({}, points[i], {
              dropInsideItem: true,
              top: Math.floor((points[i].top + points[i + 1].top) / 2),
              left: Math.floor((points[i].left + points[i + 1].left) / 2),
              isValid: this._isValidPoint(i, draggableVisibleIndex, true),
            }));
          }
        }
      }
    } else {
      // @ts-expect-error the empty list point has no position and size
      result.push({
        dropInsideItem: false,
        index: 0,
        isValid: true,
      });
    }

    return result;
  }

  _updateItemPoints(forceUpdate?: boolean): void {
    if (forceUpdate || this.option('autoUpdate') || !this.option('itemPoints')) {
      this.option('itemPoints', this._getItemPoints());
    }
  }

  _correctItemPoints(scrollBy: number): void {
    const itemPoints = this.option('itemPoints');
    if (scrollBy && itemPoints && !this.option('autoUpdate')) {
      const isVertical = this._isVerticalOrientation();
      const positionPropName = isVertical ? 'top' : 'left';
      itemPoints.forEach((itemPoint) => {
        itemPoint[positionPropName] -= scrollBy;
      });
    }
  }

  _getElementIndex($itemElement: dxElementWrapper | null | undefined): number {
    // @ts-expect-error the source element can be null
    return this._getItems().indexOf($itemElement.get(0));
  }

  _getDragTemplateArgs($element: dxElementWrapper, $container: dxElementWrapper): DragTemplateArgs {
    const args = super._getDragTemplateArgs($element, $container);
    args.model.fromIndex = this._getElementIndex($element);

    return args;
  }

  _togglePlaceholder(value: boolean): void {
    this._$placeholderElement?.toggle(value);
  }

  _isVerticalOrientation(): boolean {
    const { itemOrientation } = this.option();

    return itemOrientation === 'vertical';
  }

  _normalizeToIndex(toIndex: number | null, skipOffsetting?: boolean): number | null {
    const isAnotherDraggable = this._getSourceDraggable() !== this._getTargetDraggable();
    const fromIndex = this._getActualFromIndex();

    if (toIndex === null) {
      return fromIndex;
    }
    return Math.max(
      // @ts-expect-error fromIndex can be null
      isAnotherDraggable || fromIndex >= toIndex || skipOffsetting ? toIndex : toIndex - 1,
      0,
    );
  }

  _updatePlaceholderPosition(e: DragEvent, itemPoint: ItemPoint): void {
    const sourceDraggable = this._getSourceDraggable();
    const toIndex = this._normalizeToIndex(itemPoint.index, itemPoint.dropInsideItem);

    const eventArgs = extend(this._getEventArgs(e), {
      toIndex,
      dropInsideItem: itemPoint.dropInsideItem,
    });

    if (itemPoint.isValid) {
      this._getAction('onDragChange')(eventArgs);
    }

    if (eventArgs.cancel || !itemPoint.isValid) {
      if (!itemPoint.isValid) {
        this.option({
          dropInsideItem: false,
          toIndex: null,
        });
      }
      return;
    }

    this.option({
      dropInsideItem: itemPoint.dropInsideItem,
      toIndex: itemPoint.index,
    });
    this._getAction('onPlaceholderPrepared')(extend(this._getEventArgs(e), {
      // @ts-expect-error the placeholder element can be null
      placeholderElement: getPublicElement(this._$placeholderElement),
      // @ts-expect-error the drag element can be null
      dragElement: getPublicElement(sourceDraggable._$dragElement),
    }));
    this._updateItemPoints();
  }

  _makeWidthCorrection($item: dxElementWrapper, width: number | string): number | string {
    this._$scrollable = this._getScrollable($item);
    let correctedWidth = width;
    if (this._$scrollable) {
      const scrollableWidth = getWidth(this._$scrollable);
      // @ts-expect-error offset can be undefined
      const overflowLeft = this._$scrollable.offset().left - $item.offset().left;
      const overflowRight = getOuterWidth($item) - overflowLeft - scrollableWidth;

      if (overflowLeft > 0) {
        // @ts-expect-error width is an empty string when it was not measured
        correctedWidth -= overflowLeft;
      }

      if (overflowRight > 0) {
        // @ts-expect-error width is an empty string when it was not measured
        correctedWidth -= overflowRight;
      }
    }

    return correctedWidth;
  }

  private _updatePlaceholderSizes(
    $placeholderElement: dxElementWrapper,
    $itemElement: dxElementWrapper,
  ): void {
    const dropInsideItem = this.option('dropInsideItem');
    const isVertical = this._isVerticalOrientation();
    let width: number | string = '';
    let height: number | string = '';

    $placeholderElement.toggleClass(this._addWidgetPrefix('placeholder-inside'), dropInsideItem);

    if (isVertical || dropInsideItem) {
      width = getOuterWidth($itemElement);
    }
    if (!isVertical || dropInsideItem) {
      height = getOuterHeight($itemElement);
    }

    width = this._makeWidthCorrection($itemElement, width);

    $placeholderElement.css({ width, height });
  }

  _moveItem(
    $itemElement: dxElementWrapper | null | undefined,
    index: number,
    cancelRemove?: boolean,
  ): void {
    let $item = $itemElement;
    const $itemElements = this._getItems();
    const $targetItemElement = $itemElements[index];
    const sourceDraggable = this._getSourceDraggable();

    if (cancelRemove) {
      // @ts-expect-error the source element can be null
      $item = $item.clone();
      sourceDraggable._toggleDragSourceClass(false, $item);
    }

    const $prevTargetItemElement = $targetItemElement ? undefined : $itemElements[index - 1];

    this._moveItemCore($item, $targetItemElement, $prevTargetItemElement);
  }

  _moveItemCore(
    $targetItem: dxElementWrapper | null | undefined,
    item: Element | undefined,
    prevItem: Element | undefined,
  ): void {
    if (!item && !prevItem) {
      // @ts-expect-error the source element can be null
      $targetItem.appendTo(this.$element());
    } else if (prevItem) {
      // @ts-expect-error the source element can be null
      $targetItem.insertAfter($(prevItem));
    } else {
      // @ts-expect-error the source element can be null
      $targetItem.insertBefore($(item));
    }
  }

  _getDragStartArgs(e: DragEvent, $itemElement: dxElementWrapper): SortableDragStartArgs {
    const args: SortableDragStartArgs = extend(super._getDragStartArgs(e, $itemElement), {
      fromIndex: this._getElementIndex($itemElement),
    });

    return args;
  }

  _getEventArgs(e: DragEvent): SortableEventArgs {
    const sourceDraggable = this._getSourceDraggable();
    const targetDraggable = this._getTargetDraggable();
    const dropInsideItem = targetDraggable.option('dropInsideItem');
    const args: SortableEventArgs = extend(super._getEventArgs(e), {
      fromIndex: sourceDraggable.option('fromIndex'),
      toIndex: this._normalizeToIndex(targetDraggable.option('toIndex'), dropInsideItem),
      dropInsideItem,
    });

    return args;
  }

  public _optionChanged(args: OptionChanged<SortableProperties>): void {
    const { name } = args;

    switch (name) {
      case 'onDragChange':
      case 'onPlaceholderPrepared':
      case 'onAdd':
      case 'onRemove':
      case 'onReorder':
        this[`_${name}Action`] = this._createActionByOption(name);
        break;
      case 'fromIndex':
        [false, true].forEach((isDragSource) => {
          const fromIndex = isDragSource ? args.value : args.previousValue;
          if (fromIndex !== null) {
            // @ts-expect-error previousValue can be undefined
            const $fromElement = $(this._getItems()[fromIndex]);
            this._toggleDragSourceClass(isDragSource, $fromElement);
          }
        });
        break;
      case 'dropInsideItem':
        this._optionChangedDropInsideItem();
        break;
      case 'toIndex':
        // @ts-expect-error the option value is typed as possibly undefined
        this._optionChangedToIndex(args);
        break;
      case 'itemOrientation':
      case 'allowDropInsideItem':
      case 'moveItemOnDrop':
      case 'dropFeedbackMode':
      case 'itemPoints':
      case 'animation':
      case 'allowReordering':
      case 'fromIndexOffset':
      case 'offset':
      case 'draggableElementSize':
      case 'autoUpdate':
      case 'placeholderClassName':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _optionChangedDropInsideItem(): void {
    if (this._isIndicateMode() && this._$placeholderElement) {
      this._movePlaceholder();
    }
  }

  _isPositionVisible(position: Coordinates): boolean {
    const $element = this.$element();
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let scrollContainer: Element | undefined;
    if ($element.css('overflow') !== 'hidden') {
      scrollContainer = $element.get(0);
    } else {
      // @ts-expect-error each is declared with a callback that returns boolean
      $element.parents().each((_, element) => {
        if ($(element).css('overflow') !== 'visible') {
          scrollContainer = element;
          return false;
        }

        return undefined;
      });
    }

    if (scrollContainer) {
      const clientRect = getBoundingRect(scrollContainer);
      const isVerticalOrientation = this._isVerticalOrientation();
      const start = isVerticalOrientation ? 'top' : 'left';
      const end = isVerticalOrientation ? 'bottom' : 'right';
      const pageOffset = isVerticalOrientation ? window.pageYOffset : window.pageXOffset;

      if (
        position[start] < (clientRect[start] + pageOffset)
        || position[start] > (clientRect[end] + pageOffset)
      ) {
        return false;
      }
    }

    return true;
  }

  _optionChangedToIndex(args: OptionChangedToIndexArgs): void {
    const toIndex = args.value;

    if (this._isIndicateMode()) {
      const showPlaceholder = toIndex !== null && toIndex >= 0;

      this._togglePlaceholder(showPlaceholder);

      if (showPlaceholder) {
        this._movePlaceholder();
      }
    } else {
      this._moveItems(args.previousValue, args.value, args.fullUpdate);
    }
  }

  update(): void {
    if (this.option('fromIndex') === null && this.option('toIndex') === null) {
      return;
    }

    this._updateItemPoints(true);

    this._updateDragSourceClass();

    const toIndex = this.option('toIndex');
    this._optionChangedToIndex({ value: toIndex, fullUpdate: true });
  }

  _updateDragSourceClass(): void {
    const fromIndex = this._getActualFromIndex();
    // @ts-expect-error fromIndex can be null
    const $fromElement = $(this._getItems()[fromIndex]);
    if ($fromElement.length) {
      this._$sourceElement = $fromElement;
      this._toggleDragSourceClass(true, $fromElement);
    }
  }

  _makeLeftCorrection(left: number): number {
    const $scrollable = this._$scrollable;
    let correctedLeft = left;

    if ($scrollable && this._isVerticalOrientation()) {
      // @ts-expect-error offset can be undefined
      const overflowLeft = $scrollable.offset().left - correctedLeft;
      if (overflowLeft > 0) {
        correctedLeft += overflowLeft;
      }
    }

    return correctedLeft;
  }

  _movePlaceholder(): void {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const $placeholderElement = this._$placeholderElement || this._createPlaceholder();
    if (!$placeholderElement) {
      return;
    }

    const items = this._getItems();
    const toIndex = this.option('toIndex');
    const isVerticalOrientation = this._isVerticalOrientation();
    const rtlEnabled = this.option('rtlEnabled');
    const dropInsideItem = this.option('dropInsideItem');
    let position: Coordinates | null | undefined = null;
    // @ts-expect-error toIndex can be null
    let itemElement: Element | undefined = items[toIndex];

    if (itemElement) {
      const $itemElement = $(itemElement);

      position = $itemElement.offset();

      if (!isVerticalOrientation && rtlEnabled && !dropInsideItem) {
        // @ts-expect-error offset can be undefined
        position.left += getOuterWidth($itemElement, true);
      }
    } else {
      itemElement = this._getPrevVisibleItem(items, toIndex);
      const prevVisibleItemElement = itemElement;

      if (prevVisibleItemElement) {
        position = $(prevVisibleItemElement).offset();

        if (isVerticalOrientation) {
          // @ts-expect-error offset can be undefined
          position.top += getOuterHeight(prevVisibleItemElement, true);
        } else if (!rtlEnabled) {
          // @ts-expect-error offset can be undefined
          position.left += getOuterWidth(prevVisibleItemElement, true);
        }
      }
    }

    this._updatePlaceholderSizes($placeholderElement, $(itemElement));

    if (position && !this._isPositionVisible(position)) {
      position = null;
    }

    if (position) {
      const isLastVerticalPosition = isVerticalOrientation && toIndex === items.length;
      const outerPlaceholderHeight = getOuterHeight($placeholderElement);

      position.left = this._makeLeftCorrection(position.left);
      position.top = isLastVerticalPosition && position.top >= outerPlaceholderHeight
        ? position.top - outerPlaceholderHeight
        : position.top;

      this._move(position, $placeholderElement);
    }

    $placeholderElement.toggle(!!position);
  }

  _getPositions(
    items: Element[],
    elementSize: number,
    fromIndex: number | null,
    toIndex: number | null,
  ): number[] {
    const positions: number[] = [];

    for (let i = 0; i < items.length; i += 1) {
      let position = 0;

      if (toIndex === null || fromIndex === null) {
        positions.push(position);
        // eslint-disable-next-line no-continue
        continue;
      }

      if (fromIndex === -1) {
        if (i >= toIndex) {
          position = elementSize;
        }
      } else if (toIndex === -1) {
        if (i > fromIndex) {
          position = -elementSize;
        }
      } else if (fromIndex < toIndex) {
        if (i > fromIndex && i < toIndex) {
          position = -elementSize;
        }
      } else if (fromIndex > toIndex) {
        if (i >= toIndex && i < fromIndex) {
          position = elementSize;
        }
      }
      positions.push(position);
    }

    return positions;
  }

  _getDraggableElementSize(isVerticalOrientation: boolean): number {
    const $draggableItem = this._getDraggableElement();
    let size = this.option('draggableElementSize');
    if (!size) {
      size = isVerticalOrientation
        ? (getOuterHeight($draggableItem) + getOuterHeight($draggableItem, true)) / 2
        : (getOuterWidth($draggableItem) + getOuterWidth($draggableItem, true)) / 2;

      if (!this.option('autoUpdate')) {
        this.option('draggableElementSize', size);
      }
    }
    return size;
  }

  _getActualFromIndex(): number | null {
    const { fromIndex, fromIndexOffset, offset } = this.option();
    return fromIndex == null ? null : fromIndex + fromIndexOffset - offset;
  }

  _moveItems(
    prevToIndex: number | null | undefined,
    toIndex: number | null,
    fullUpdate?: boolean,
  ): void {
    const fromIndex = this._getActualFromIndex();
    const isVerticalOrientation = this._isVerticalOrientation();
    const positionPropName = isVerticalOrientation ? 'top' : 'left';
    const elementSize = this._getDraggableElementSize(isVerticalOrientation);
    const items = this._getItems();
    // @ts-expect-error prevToIndex is undefined when update() is called
    const prevPositions = this._getPositions(items, elementSize, fromIndex, prevToIndex);
    const positions = this._getPositions(items, elementSize, fromIndex, toIndex);
    const animationConfig = this.option('animation');
    const rtlEnabled = this.option('rtlEnabled');

    for (let i = 0; i < items.length; i += 1) {
      const itemElement = items[i] as HTMLElement;
      const prevPosition = prevPositions[i];
      const position = positions[i];

      if (toIndex === null || fromIndex === null) {
        stopAnimation(itemElement);
      } else if (prevPosition !== position || (fullUpdate && isDefined(position))) {
        animate(itemElement, extend({}, animationConfig, {
          to: { [positionPropName]: !isVerticalOrientation && rtlEnabled ? -position : position },
        }));
      }
    }
  }

  _toggleDragSourceClass(value: boolean, $element?: dxElementWrapper | null): void {
    const $sourceElement = $element || this._$sourceElement;
    super._toggleDragSourceClass(value, $element);
    if (!this._isIndicateMode()) {
      $sourceElement?.toggleClass(this._addWidgetPrefix('source-hidden'), value);
    }
  }

  _dispose(): void {
    this.reset();
    super._dispose();
  }

  _fireAddEvent(sourceEvent: DragEvent): boolean | undefined {
    const args = this._getEventArgs(sourceEvent);

    this._getAction('onAdd')(args);

    return args.cancel;
  }

  _fireRemoveEvent(sourceEvent: DragEvent): boolean | undefined {
    const sourceDraggable = this._getSourceDraggable();
    const args = this._getEventArgs(sourceEvent);

    sourceDraggable._getAction('onRemove')(args);

    return args.cancel;
  }

  _fireReorderEvent(sourceEvent: DragEvent): DeferredObj<unknown> | PromiseLike<void> {
    const args = this._getEventArgs(sourceEvent);

    this._getAction('onReorder')(args);

    return args.promise || Deferred().resolve();
  }
}

registerComponent(SORTABLE, Sortable);

export default Sortable;
