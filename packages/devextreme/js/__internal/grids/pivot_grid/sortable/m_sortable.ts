import {
  drop as dragEventDrop,
  end as dragEventEnd,
  enter as dragEventEnter,
  leave as dragEventLeave,
  move as dragEventMove,
  start as dragEventStart,
} from '@js/common/core/events/drag';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import domAdapter from '@js/core/dom_adapter';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth, setHeight,
  setWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import swatchContainer from '@ts/core/utils/swatch_container';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import type { EngineEvent } from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';
import type { DragOffset } from '@ts/events/drag';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

import type {
  OldSortableChangedArgs,
  OldSortableDraggingArgs,
  OldSortableItemOffset,
  OldSortableProperties,
  OldSortableScrollWrapper,
} from './types';

const { getSwatchContainer } = swatchContainer;

const SORTABLE_NAMESPACE = 'dxSortable';
const SORTABLE_CLASS = 'dx-sortable-old';
const SCROLL_STEP = 2;
const START_SCROLL_OFFSET = 20;
const SCROLL_TIMEOUT = 10;

type DragMoveEvent = EngineEvent & { offset: DragOffset; pageX: number; pageY: number };

const getElementOffset = ($element: dxElementWrapper): Coordinates => {
  const result = $element.offset();
  return result as Coordinates;
};

const getElementSizes = (
  $element: dxElementWrapper,
): { width: number; height: number } => {
  const width = getWidth($element);
  const height = getHeight($element);
  return { width, height } as { width: number; height: number };
};

const getElementOuterSizes = (
  $element: dxElementWrapper,
): { width: number; height: number } => {
  const width = getOuterWidth($element, true);
  const height = getOuterHeight($element, true);
  return { width, height } as { width: number; height: number };
};

function elementHasPoint(element: Element, x: number, y: number): boolean | undefined {
  const $item = $(element);
  const offset = getElementOffset($item);

  if (x >= offset.left && x <= offset.left + Number(getOuterWidth($item, true))) {
    if (y >= offset.top && y <= offset.top + Number(getOuterHeight($item, true))) {
      return true;
    }
  }

  return undefined;
}

function checkHorizontalPosition(
  position: number,
  itemOffset: OldSortableItemOffset,
  rtl: boolean | undefined,
): boolean {
  if (isDefined(itemOffset.posHorizontal)) {
    return rtl ? position > itemOffset.posHorizontal : position < itemOffset.posHorizontal;
  }
  return true;
}

function getIndex($items: dxElementWrapper, $item: dxElementWrapper): number {
  let index = -1;
  const itemElement = $item.get(0);

  each($items, (elementIndex: number, element) => {
    const $element = $(element);

    if (!($element.attr('item-group')
      && $element.attr('item-group') === $items.eq(elementIndex - 1).attr('item-group'))) {
      index += 1;
    }

    if (element === itemElement) {
      return false;
    }

    return undefined;
  });

  return index === $items.length ? -1 : index;
}

function getTargetGroup(
  e: DragMoveEvent,
  $groups: dxElementWrapper,
): dxElementWrapper | null {
  let result: dxElementWrapper | null = null;

  each($groups, function findTargetGroup() {
    if (elementHasPoint(this, e.pageX, e.pageY)) {
      result = $(this);
    }
  });
  return result;
}

function getItemsOffset(
  $elements: dxElementWrapper,
  isVertical: boolean,
  $itemsContainer: dxElementWrapper,
): OldSortableItemOffset[] {
  const result: OldSortableItemOffset[] = [];
  let $item: dxElementWrapper | never[] = [];

  for (let i = 0; i < $elements.length; i += $item.length) {
    $item = $elements.eq(i);

    if ($item.attr('item-group')) {
      $item = $itemsContainer.find(`[item-group='${$item.attr('item-group')}']`);
    }
    if ($item.is(':visible')) {
      const lastItemOffset = getElementOffset($item.last());
      const {
        width: lastItemWidth, height: lastItemHeight,
      } = getElementOuterSizes($item.last());
      const itemOffset = getElementOffset($item);

      const offset = {
        item: $item,
        index: result.length,
        posVertical: isVertical
          ? (
            lastItemOffset.top + itemOffset.top + lastItemHeight
          ) / 2
          : lastItemHeight + lastItemOffset.top,
        posHorizontal: isVertical
          ? undefined
          : (
            lastItemWidth + lastItemOffset.left + itemOffset.left
          ) / 2,
      };

      result.push(offset);
    }
  }

  return result;
}

function getScrollWrapper(scrollable: Scrollable): OldSortableScrollWrapper {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- unset until the first move()
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let scrollTop = scrollable.scrollTop();
  const $element = scrollable.$element();
  const { top } = getElementOffset($element);
  const { height } = getElementSizes($element);
  let delta = 0;

  function onScroll(e: { scrollOffset: { top: number } }): void {
    scrollTop = e.scrollOffset.top;
  }

  scrollable.on('scroll', onScroll);

  function stop(): void {
    clearTimeout(timeout);
  }

  function move(): void {
    stop();
    scrollable.scrollTo(scrollTop += delta);

    // eslint-disable-next-line no-restricted-globals -- repeats the auto-scroll step
    timeout = setTimeout(move, SCROLL_TIMEOUT);
  }

  function moveIfNeed(event: { pageY: number }): void {
    if (event.pageY <= top + START_SCROLL_OFFSET) {
      delta = -SCROLL_STEP;
    } else if (event.pageY >= top + height - START_SCROLL_OFFSET) {
      delta = SCROLL_STEP;
    } else {
      delta = 0;
      stop();
      return;
    }
    move();
  }

  return {
    moveIfNeed,
    element(): dxElementWrapper {
      return $element;
    },
    dispose(): void {
      stop();
      scrollable.off('scroll', onScroll);
    },
  };
}

class OldSortable extends DOMComponent<OldSortable, OldSortableProperties> {
  _indicator?: dxElementWrapper;

  _$draggable?: dxElementWrapper | null;

  _getDefaultOptions(): OldSortableProperties {
    return extend(super._getDefaultOptions(), {
      onChanged: null,
      onDragging: null,
      itemRender: null,
      groupSelector: null,
      itemSelector: '.dx-sort-item',
      itemContainerSelector: '.dx-sortable-old',
      sourceClass: 'dx-drag-source',
      dragClass: 'dx-drag',
      targetClass: 'dx-drag-target',
      direction: 'vertical',
      allowDragging: true,
      groupFilter: null,
      useIndicator: false,
    });
  }

  _renderItem($sourceItem: dxElementWrapper, target: string): dxElementWrapper {
    const itemRender = this.option('itemRender');
    // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the if/else below
    let $item: dxElementWrapper;

    if (itemRender) {
      $item = itemRender($sourceItem, target);
    } else {
      $item = $sourceItem.clone();
      $item.css(getElementSizes($sourceItem));
    }
    return $item;
  }

  _renderIndicator(
    $item: dxElementWrapper,
    isVertical: boolean,
    $targetGroup: dxElementWrapper,
    isLast: boolean,
  ): void {
    if (!this._indicator) {
      return;
    }

    const itemOffset = getElementOffset($item);
    const targetGroupOffset = getElementOffset($targetGroup);
    const top = itemOffset.top - targetGroupOffset.top;
    const left = itemOffset.left - targetGroupOffset.left;
    const { height, width } = getElementOuterSizes($item);

    this._indicator
      .css({
        position: 'absolute',
        top: isLast && isVertical ? top + height : top,
        left: isLast && !isVertical ? left + width : left,
      })
      .toggleClass('dx-position-indicator-horizontal', !isVertical)
      .toggleClass('dx-position-indicator-vertical', !!isVertical)
      .toggleClass('dx-position-indicator-last', !!isLast)
      .appendTo($targetGroup);
    setHeight(this._indicator, '');
    setWidth(this._indicator, '');

    if (isVertical) {
      setWidth(this._indicator, width);
    } else {
      setHeight(this._indicator, height);
    }
  }

  _renderDraggable($sourceItem: dxElementWrapper): void {
    const $container = getSwatchContainer($sourceItem);

    if (!$container) {
      return;
    }

    this._$draggable?.remove();

    this._$draggable = this._renderItem($sourceItem, 'drag')
      .addClass(this.option('dragClass'))
      .css({
        zIndex: 1000000,
        position: 'absolute',
      })
      .appendTo($container);
  }

  _detachEventHandlers(): void {
    const dragEventsString = [dragEventMove, dragEventStart, dragEventEnd, dragEventEnter, dragEventLeave, dragEventDrop].join(' ');
    eventsEngine.off(
      this._getEventListener(),
      addNamespace(dragEventsString, SORTABLE_NAMESPACE),
      undefined,
    );
  }

  _getItemOffset(
    isVertical: boolean,
    itemsOffset: OldSortableItemOffset[],
    e: DragMoveEvent,
  ): OldSortableItemOffset | undefined {
    for (let i = 0; i < itemsOffset.length; i += 1) {
      let shouldInsert = false;
      const sameLine = e.pageY < itemsOffset[i].posVertical;

      if (isVertical) {
        shouldInsert = sameLine;
      } else if (sameLine) {
        shouldInsert = checkHorizontalPosition(e.pageX, itemsOffset[i], this.option('rtlEnabled'));

        if (!shouldInsert && itemsOffset[i + 1]
          && itemsOffset[i + 1].posVertical > itemsOffset[i].posVertical) {
          shouldInsert = true;
        }
      }
      if (shouldInsert) {
        return itemsOffset[i];
      }
    }

    return undefined;
  }

  _getEventListener(): dxElementWrapper {
    const groupSelector = this.option('groupSelector');
    const element = this.$element();

    return groupSelector ? element.find(groupSelector) : element;
  }

  _attachEventHandlers(): void {
    const itemSelector = this.option('itemSelector');
    const itemContainerSelector = this.option('itemContainerSelector');
    const groupSelector = this.option('groupSelector');
    const sourceClass = this.option('sourceClass');
    const targetClass = this.option('targetClass');
    const onDragging = this.option('onDragging');
    const groupFilter = this.option('groupFilter');
    let $sourceItem: dxElementWrapper | null = null;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the drag handlers
    let sourceIndex: number;
    let $targetItem: dxElementWrapper | null = null;
    let $targetGroup: dxElementWrapper | null = null;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the drag handlers
    let startPositions: Coordinates[];
    // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the drag handlers
    let sourceGroup: string | undefined;
    const element = this.$element();
    // eslint-disable-next-line @typescript-eslint/init-declarations -- set in the drag handlers
    let $groups: dxElementWrapper;
    let scrollWrapper: OldSortableScrollWrapper | null = null;
    let targetIndex = -1;

    const setStartPositions = (): void => {
      startPositions = [];
      each($sourceItem, (_, item) => {
        startPositions.push(getElementOffset($(item)));
      });
    };

    const createGroups = (): dxElementWrapper => {
      const root = domAdapter.getRootNode(this.$element().get<HTMLElement>(0));

      if (!groupSelector) {
        return element;
      }
      return groupFilter
        ? $(root).find(groupSelector).filter(groupFilter)
        : element.find(groupSelector);
    };

    const disposeScrollWrapper = (): void => {
      scrollWrapper?.dispose();
      scrollWrapper = null;
    };

    const invokeOnDraggingEvent = (): void => {
      if (!$sourceItem || !$targetItem || !$targetGroup) {
        return;
      }

      const draggingArgs: OldSortableDraggingArgs = {
        sourceGroup,
        sourceIndex,
        sourceElement: $sourceItem,
        targetGroup: $targetGroup.attr('group'),
        targetIndex: $targetGroup.find(itemSelector).index($targetItem),
      };

      if (onDragging) {
        onDragging(draggingArgs);
      }

      if (draggingArgs.cancel) {
        $targetGroup = null;
      }
    };

    this._detachEventHandlers();

    if (this.option('allowDragging')) {
      const $eventListener = this._getEventListener();

      eventsEngine.on(
        $eventListener,
        addNamespace(dragEventStart, SORTABLE_NAMESPACE),
        itemSelector,
        (e) => {
          $sourceItem = $(e.currentTarget);
          const $sourceGroup = groupSelector ? $sourceItem.closest(groupSelector) : $();
          sourceGroup = $sourceGroup.attr('group');

          sourceIndex = getIndex(
            (groupSelector
              ? $sourceGroup
              : element)
              .find(itemSelector),
            $sourceItem,
          );

          if ($sourceItem.attr('item-group')) {
            $sourceItem = $sourceGroup.find(`[item-group='${$sourceItem.attr('item-group')}']`);
          }

          this._renderDraggable($sourceItem);

          $targetItem = this._renderItem($sourceItem, 'target').addClass(targetClass);

          $sourceItem.addClass(sourceClass);

          setStartPositions();
          $groups = createGroups();
          this._indicator = $('<div>').addClass('dx-position-indicator');
        },
      );
      const dragMoveEventName = addNamespace(dragEventMove, SORTABLE_NAMESPACE);
      eventsEngine.on($eventListener, dragMoveEventName, (e: DragMoveEvent) => {
        if (!$sourceItem || !$targetItem) {
          return;
        }

        targetIndex = -1;

        this._indicator?.detach();

        each(this._$draggable, (index, draggableElement) => {
          $(draggableElement).css({
            top: startPositions[index].top + e.offset.y,
            left: startPositions[index].left + e.offset.x,
          });
        });

        $targetGroup?.removeClass(targetClass);

        $targetGroup = getTargetGroup(e, $groups);
        if ($targetGroup) {
          invokeOnDraggingEvent();
        }

        if ($targetGroup
          && scrollWrapper
          && $targetGroup.get(0) !== scrollWrapper.element().get(0)) {
          disposeScrollWrapper();
        }

        scrollWrapper?.moveIfNeed(e);

        if (!$targetGroup) {
          $targetItem.detach();
          return;
        }

        if (!scrollWrapper && $targetGroup.attr('allow-scrolling')) {
          // @ts-expect-error dxScrollable is not defined in dxElementWrapper
          const scrollInstance = $targetGroup.dxScrollable('instance');
          scrollWrapper = getScrollWrapper(scrollInstance);
        }

        $targetGroup.addClass(targetClass);
        const $itemContainer = $targetGroup.find(itemContainerSelector);
        const $items = $itemContainer.find(itemSelector);

        const targetSortable: OldSortable = $targetGroup.closest(`.${SORTABLE_CLASS}`).data('dxSortableOld');
        const useIndicator = targetSortable.option('useIndicator');

        const isVertical = (targetSortable || this).option('direction') === 'vertical';
        const itemsOffset = getItemsOffset($items, isVertical, $itemContainer);

        const itemOffset = this._getItemOffset(isVertical, itemsOffset, e);

        if (itemOffset) {
          const $item = itemOffset.item;

          const $prevItem = itemsOffset[itemOffset.index - 1]?.item;

          if ($item.hasClass(sourceClass) || ($prevItem?.hasClass(sourceClass) && $prevItem.is(':visible'))) {
            $targetItem.detach();
            return;
          }

          targetIndex = itemOffset.index;

          if (!useIndicator) {
            $targetItem.insertBefore($item);
            return;
          }

          const isAnotherGroup = $targetGroup.attr('group') !== sourceGroup;
          const isSameIndex = targetIndex === sourceIndex;
          const isNextIndex = targetIndex === (sourceIndex + 1);

          if (isAnotherGroup) {
            this._renderIndicator($item, isVertical, $targetGroup, !!this.option('rtlEnabled') && !isVertical);
            return;
          }

          if (!isSameIndex && !isNextIndex) {
            this._renderIndicator($item, isVertical, $targetGroup, !!this.option('rtlEnabled') && !isVertical);
          }
        } else {
          const $lastItem = $items.last();
          if ($lastItem.is(':visible') && $lastItem.hasClass(sourceClass)) {
            return;
          }
          if ($itemContainer.length) {
            targetIndex = itemsOffset.length ? itemsOffset[itemsOffset.length - 1].index + 1 : 0;
          }

          if (useIndicator) {
            if ($items.length) {
              this._renderIndicator($lastItem, isVertical, $targetGroup, !this.option('rtlEnabled') || isVertical);
            }
          } else {
            $targetItem.appendTo($itemContainer);
          }
        }
      });
      eventsEngine.on($eventListener, addNamespace(dragEventEnd, SORTABLE_NAMESPACE), () => {
        disposeScrollWrapper();

        if (!$sourceItem || !$targetItem) {
          return;
        }

        const onChanged = this.option('onChanged');
        const changedArgs: OldSortableChangedArgs = {
          sourceIndex,
          sourceElement: $sourceItem,
          sourceGroup,
          targetIndex,
          removeSourceElement: true,
          removeTargetElement: false,
          removeSourceClass: true,
        };

        if ($targetGroup) {
          $targetGroup.removeClass(targetClass);
          changedArgs.targetGroup = $targetGroup.attr('group');
          if (sourceGroup !== changedArgs.targetGroup || targetIndex > -1) {
            if (onChanged) {
              onChanged(changedArgs);
            }
            if (changedArgs.removeSourceElement) {
              $sourceItem.remove();
            }
          }
        }

        this._indicator?.detach();
        if (changedArgs.removeSourceClass) {
          $sourceItem.removeClass(sourceClass);
        }
        $sourceItem = null;

        this._$draggable?.remove();
        this._$draggable = null;

        if (changedArgs.removeTargetElement) {
          $targetItem.remove();
        }
        $targetItem.removeClass(targetClass);
        $targetItem = null;
      });
    }
  }

  _init(): void {
    super._init();
    this._attachEventHandlers();
  }

  _render(): void {
    super._render();
    this.$element().addClass(SORTABLE_CLASS);
  }

  _dispose(): void {
    super._dispose();

    this._$draggable?.detach();
    this._indicator?.detach();
  }

  _optionChanged(args: OptionChanged<OldSortableProperties>): void {
    switch (args.name) {
      case 'onDragging':
      case 'onChanged':
      case 'itemRender':
      case 'groupSelector':
      case 'itemSelector':
      case 'itemContainerSelector':
      case 'sourceClass':
      case 'targetClass':
      case 'dragClass':
      case 'allowDragging':
      case 'groupFilter':
      case 'useIndicator':
        this._attachEventHandlers();
        break;
      case 'direction':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _useTemplates(): boolean {
    return false;
  }
}

/// #DEBUG
// @ts-expect-error ts-error
OldSortable.prototype.__SCROLL_STEP = SCROLL_STEP;
/// #ENDDEBUG

// TODO remove dxSortableOld component
registerComponent('dxSortableOld', OldSortable);

export default { OldSortable };
export { OldSortable };
