import eventsEngine from '@js/common/core/events/core/events_engine';
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
import DOMComponent from '@js/core/dom_component';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  getHeight, getOuterHeight, getOuterWidth, getWidth, setHeight,
  setWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import swatchContainer from '@js/ui/widget/swatch_container';

const { getSwatchContainer } = swatchContainer;

const SORTABLE_NAMESPACE = 'dxSortable';
const SORTABLE_CLASS = 'dx-sortable-old';
const SCROLL_STEP = 2;
const START_SCROLL_OFFSET = 20;
const SCROLL_TIMEOUT = 10;

function elementHasPoint(element, x, y) {
  const $item = $(element);
  const offset = $item.offset()!;

  if (x >= offset.left && x <= offset.left + getOuterWidth($item, true)) {
    if (y >= offset.top && y <= offset.top + getOuterHeight($item, true)) {
      return true;
    }
  }

  return undefined;
}

function checkHorizontalPosition(position, itemOffset, rtl) {
  if (isDefined(itemOffset.posHorizontal)) {
    return rtl ? position > itemOffset.posHorizontal : position < itemOffset.posHorizontal;
  }
  return true;
}

function getIndex($items, $item) {
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

function getTargetGroup(e, $groups) {
  let result;

  each($groups, function () {
    if (elementHasPoint(this, e.pageX, e.pageY)) {
      result = $(this);
    }
  });
  return result;
}

function getItemsOffset($elements, isVertical, $itemsContainer) {
  const result: any = [];
  let $item: any = [];

  for (let i = 0; i < $elements.length; i += $item.length) {
    $item = $elements.eq(i);

    if ($item.attr('item-group')) {
      $item = $itemsContainer.find(`[item-group='${$item.attr('item-group')}']`);
    }
    if ($item.is(':visible')) {
      const offset = {
        item: $item,
        index: result.length,
        posVertical: isVertical
          ? (
            $item.last().offset().top + $item.offset().top + getOuterHeight($item.last(), true)
          ) / 2
          : getOuterHeight($item.last(), true) + $item.last().offset().top,
        posHorizontal: isVertical
          ? undefined
          : (
            getOuterWidth($item.last(), true) + $item.last().offset().left + $item.offset().left
          ) / 2,
      };

      result.push(offset);
    }
  }

  return result;
}

function getScrollWrapper(scrollable) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let scrollTop = scrollable.scrollTop();
  const $element = scrollable.$element();
  const { top } = $element.offset();
  const height = getHeight($element);
  let delta = 0;

  function onScroll(e) {
    scrollTop = e.scrollOffset.top;
  }

  scrollable.on('scroll', onScroll);

  function move() {
    stop();
    scrollable.scrollTo(scrollTop += delta);

    timeout = setTimeout(move, SCROLL_TIMEOUT);
  }

  function stop() {
    clearTimeout(timeout);
  }

  function moveIfNeed(event) {
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
    element() {
      return $element;
    },
    dispose() {
      stop();
      scrollable.off('scroll', onScroll);
    },
  };
}

const Sortable = (DOMComponent as any).inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
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
  },

  _renderItem($sourceItem, target) {
    const itemRender = this.option('itemRender');
    let $item;

    if (itemRender) {
      $item = itemRender($sourceItem, target);
    } else {
      $item = $sourceItem.clone();
      $item.css({
        width: getWidth($sourceItem),
        height: getHeight($sourceItem),
      });
    }
    return $item;
  },

  _renderIndicator($item, isVertical, $targetGroup, isLast) {
    const height = getOuterHeight($item, true);
    const width = getOuterWidth($item, true);
    const top = $item.offset().top - $targetGroup.offset().top;
    const left = $item.offset().left - $targetGroup.offset().left;

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
  },

  _renderDraggable($sourceItem) {
    this._$draggable && this._$draggable.remove();

    this._$draggable = this._renderItem($sourceItem, 'drag')
      .addClass(this.option('dragClass')).appendTo(getSwatchContainer($sourceItem))
      .css({
        zIndex: 1000000,
        position: 'absolute',
      });
  },

  _detachEventHandlers() {
    const dragEventsString = [dragEventMove, dragEventStart, dragEventEnd, dragEventEnter, dragEventLeave, dragEventDrop].join(' ');
    eventsEngine.off(
      this._getEventListener(),
      addNamespace(dragEventsString, SORTABLE_NAMESPACE),
      undefined,
    );
  },

  _getItemOffset(isVertical, itemsOffset, e) {
    for (let i = 0; i < itemsOffset.length; i += 1) {
      let shouldInsert;
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
  },

  _getEventListener() {
    const groupSelector = this.option('groupSelector');
    const element = this.$element();

    return groupSelector ? element.find(groupSelector) : element;
  },

  _attachEventHandlers() {
    const that = this;
    const itemSelector = that.option('itemSelector');
    const itemContainerSelector = that.option('itemContainerSelector');
    const groupSelector = that.option('groupSelector');
    const sourceClass = that.option('sourceClass');
    const targetClass = that.option('targetClass');
    const onDragging = that.option('onDragging');
    const groupFilter = that.option('groupFilter');
    let $sourceItem;
    let sourceIndex;
    let $targetItem;
    let $targetGroup;
    let startPositions;
    let sourceGroup;
    const element = that.$element();
    let $groups;
    let scrollWrapper: any = null;
    let targetIndex = -1;

    const setStartPositions = function () {
      startPositions = [];
      each($sourceItem, (_, item) => {
        startPositions.push($(item).offset());
      });
    };

    const createGroups = function () {
      const root: any = domAdapter.getRootNode(that.$element().get(0));

      if (!groupSelector) {
        return element;
      }
      return groupFilter
        ? $(root).find(groupSelector).filter(groupFilter)
        : element.find(groupSelector);
    };

    const disposeScrollWrapper = function () {
      scrollWrapper?.dispose();
      scrollWrapper = null;
    };

    const invokeOnDraggingEvent = function () {
      const draggingArgs: any = {
        sourceGroup,
        sourceIndex,
        sourceElement: $sourceItem,
        targetGroup: $targetGroup.attr('group'),
        targetIndex: $targetGroup.find(itemSelector).index($targetItem),
      };

      onDragging && onDragging(draggingArgs);

      if (draggingArgs.cancel) {
        $targetGroup = undefined;
      }
    };

    that._detachEventHandlers();

    if (that.option('allowDragging')) {
      const $eventListener = that._getEventListener();

      eventsEngine.on(
        $eventListener,
        addNamespace(dragEventStart, SORTABLE_NAMESPACE),
        itemSelector,
        (e) => {
          $sourceItem = $(e.currentTarget);
          const $sourceGroup = $sourceItem.closest(groupSelector);
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

          that._renderDraggable($sourceItem);

          $targetItem = that._renderItem($sourceItem, 'target').addClass(targetClass);

          $sourceItem.addClass(sourceClass);

          setStartPositions();
          $groups = createGroups();
          that._indicator = $('<div>').addClass('dx-position-indicator');
        },
      );
      eventsEngine.on($eventListener, addNamespace(dragEventMove, SORTABLE_NAMESPACE), (e) => {
        let $item;
        let $lastItem;
        let $prevItem;

        if (!$sourceItem) {
          return;
        }

        targetIndex = -1;

        that._indicator.detach();

        each(that._$draggable, (index, draggableElement) => {
          ($(draggableElement) as any).css({
            top: startPositions[index].top + e.offset.y,
            left: startPositions[index].left + e.offset.x,
          });
        });

        $targetGroup && $targetGroup.removeClass(targetClass);

        $targetGroup = getTargetGroup(e, $groups);
        $targetGroup && invokeOnDraggingEvent();

        if ($targetGroup
          && scrollWrapper
          && $targetGroup.get(0) !== scrollWrapper.element().get(0)) {
          disposeScrollWrapper();
        }

        scrollWrapper && scrollWrapper.moveIfNeed(e);

        if (!$targetGroup) {
          $targetItem.detach();
          return;
        }

        if (!scrollWrapper && $targetGroup.attr('allow-scrolling')) {
          scrollWrapper = getScrollWrapper($targetGroup.dxScrollable('instance'));
        }

        $targetGroup.addClass(targetClass);
        const $itemContainer = $targetGroup.find(itemContainerSelector);
        const $items = $itemContainer.find(itemSelector);

        const targetSortable = $targetGroup.closest(`.${SORTABLE_CLASS}`).data('dxSortableOld');
        const useIndicator = targetSortable.option('useIndicator');

        const isVertical = (targetSortable || that).option('direction') === 'vertical';
        const itemsOffset = getItemsOffset($items, isVertical, $itemContainer);

        const itemOffset = that._getItemOffset(isVertical, itemsOffset, e);

        if (itemOffset) {
          $item = itemOffset.item;

          $prevItem = itemsOffset[itemOffset.index - 1] && itemsOffset[itemOffset.index - 1].item;

          if ($item.hasClass(sourceClass) || ($prevItem && $prevItem.hasClass(sourceClass) && $prevItem.is(':visible'))) {
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
            that._renderIndicator($item, isVertical, $targetGroup, that.option('rtlEnabled') && !isVertical);
            return;
          }

          if (!isSameIndex && !isNextIndex) {
            that._renderIndicator($item, isVertical, $targetGroup, that.option('rtlEnabled') && !isVertical);
          }
        } else {
          $lastItem = $items.last();
          if ($lastItem.is(':visible') && $lastItem.hasClass(sourceClass)) {
            return;
          }
          if ($itemContainer.length) {
            targetIndex = itemsOffset.length ? itemsOffset[itemsOffset.length - 1].index + 1 : 0;
          }

          if (useIndicator) {
            $items.length && that._renderIndicator($lastItem, isVertical, $targetGroup, !that.option('rtlEnabled') || isVertical);
          } else {
            $targetItem.appendTo($itemContainer);
          }
        }
      });
      eventsEngine.on($eventListener, addNamespace(dragEventEnd, SORTABLE_NAMESPACE), () => {
        disposeScrollWrapper();

        if (!$sourceItem) {
          return;
        }

        const onChanged = that.option('onChanged');
        const changedArgs: any = {
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
            onChanged && onChanged(changedArgs);
            changedArgs.removeSourceElement && $sourceItem.remove();
          }
        }

        that._indicator.detach();
        changedArgs.removeSourceClass && $sourceItem.removeClass(sourceClass);
        $sourceItem = null;

        that._$draggable.remove();
        that._$draggable = null;

        changedArgs.removeTargetElement && $targetItem.remove();
        $targetItem.removeClass(targetClass);
        $targetItem = null;
      });
    }
  },

  _init() {
    this.callBase();
    this._attachEventHandlers();
  },

  _render() {
    this.callBase();
    this.$element().addClass(SORTABLE_CLASS);
  },

  _dispose() {
    const that = this;

    that.callBase.apply(that, arguments);

    that._$draggable && that._$draggable.detach();
    that._indicator && that._indicator.detach();
  },

  _optionChanged(args) {
    const that = this;
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
        that._attachEventHandlers();
        break;
      case 'direction':
        break;
      default:
        that.callBase(args);
    }
  },

  _useTemplates() {
    return false;
  },
});

/// #DEBUG
Sortable.prototype.__SCROLL_STEP = SCROLL_STEP;
/// #ENDDEBUG

// TODO remove dxSortableOld component
registerComponent('dxSortableOld', Sortable);

export default { Sortable };
export { Sortable };
