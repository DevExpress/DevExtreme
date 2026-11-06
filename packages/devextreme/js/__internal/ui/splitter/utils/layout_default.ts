import { toFixed } from '@js/common/core/localization/utils';
import { isDefined } from '@js/core/utils/type';

import {
  findLastIndexOfVisibleItem,
  findLastVisibleExpandedItemIndex,
  normalizePanelSize,
} from './layout';
import { compareNumbersWithPrecision, PRECISION } from './number_comparison';
import type { PaneRestrictions } from './types';

function getRequestedSize(paneRestrictions: PaneRestrictions): number {
  const {
    size, visible, collapsed, collapsedSize = 0,
  } = paneRestrictions;

  if (visible === false) {
    return 0;
  }

  if (collapsed === true) {
    return collapsedSize;
  }

  return size ?? 0;
}

function isPaneInLayout(paneRestrictions: PaneRestrictions): boolean {
  return paneRestrictions.visible !== false && paneRestrictions.collapsed !== true;
}

function isSizeAdjustable(paneRestrictions: PaneRestrictions): boolean {
  return paneRestrictions.isSizeAuto === true
    && isDefined(paneRestrictions.size)
    && isPaneInLayout(paneRestrictions);
}

// Sizes the widget measured itself are relative to the container size of the previous layout
// pass. Once the container has been resized, they no longer add up to the space available now,
// and the difference would otherwise be taken from (or given to) panes whose size the user
// did request, making the layout depend on the container size it was first calculated for.
// Applies only to render-time recalculations: option-change recalculations work with sizes
// measured for the current container, where the pinned behavior resolves conflicts by order.
export function fitAutoSizesIntoLayout(layoutRestrictions: PaneRestrictions[]): PaneRestrictions[] {
  let requestedSize = 0;
  let adjustableSize = 0;
  let hasPanesWithoutSize = false;

  layoutRestrictions.forEach((paneRestrictions) => {
    requestedSize += getRequestedSize(paneRestrictions);

    if (isSizeAdjustable(paneRestrictions)) {
      adjustableSize += paneRestrictions.size ?? 0;
    } else if (isPaneInLayout(paneRestrictions) && !isDefined(paneRestrictions.size)) {
      hasPanesWithoutSize = true;
    }
  });

  const excessSize = requestedSize - 100;
  const excessSign = compareNumbersWithPrecision(excessSize, 0);
  // free space belongs to the panes that have no size of their own, if there are any
  const shouldFit = excessSign > 0 || (excessSign < 0 && !hasPanesWithoutSize);

  if (adjustableSize <= 0 || !shouldFit) {
    return layoutRestrictions;
  }

  const ratio = Math.max(0, adjustableSize - excessSize) / adjustableSize;

  return layoutRestrictions.map((paneRestrictions) => (isSizeAdjustable(paneRestrictions)
    ? { ...paneRestrictions, size: (paneRestrictions.size ?? 0) * ratio }
    : paneRestrictions));
}

export function getDefaultLayout(layoutRestrictions: PaneRestrictions[]): number[] {
  let layout: number[] = new Array(layoutRestrictions.length).fill(null);

  let numPanelsWithDefinedSize = 0;
  let remainingSize = 100;

  layoutRestrictions.forEach((paneRestrictions, index) => {
    const {
      size, visible, collapsed, collapsedSize = 0,
    } = paneRestrictions;

    if (visible === false) {
      numPanelsWithDefinedSize += 1;

      layout[index] = 0;
      remainingSize -= 0;

      return;
    }

    if (collapsed === true) {
      numPanelsWithDefinedSize += 1;

      layout[index] = collapsedSize;
      remainingSize -= collapsedSize;

      return;
    }

    if (isDefined(size)) {
      numPanelsWithDefinedSize += 1;

      if (remainingSize - size < 0) {
        layout[index] = remainingSize;
        remainingSize = 0;
        return;
      }

      layout[index] = size;
      remainingSize -= size;
    }
  });

  let panelsToDistribute = layoutRestrictions.length - numPanelsWithDefinedSize;

  if (panelsToDistribute === 0) {
    layout[findLastIndexOfVisibleItem(layoutRestrictions)] += remainingSize;
    remainingSize = 0;
  } else {
    layoutRestrictions.forEach((paneRestrictions, index) => {
      if (layout[index] === null) {
        if (isDefined(paneRestrictions.maxSize) && panelsToDistribute === 1) {
          // the only pane left without a size takes all the space the sized panes did not
          // claim; a larger maxSize must not push the layout over 100% and squeeze them
          layout[index] = remainingSize;
          remainingSize -= layout[index];
          numPanelsWithDefinedSize += 1;
        } else if (isDefined(paneRestrictions.maxSize)
        && paneRestrictions.maxSize < (remainingSize / panelsToDistribute)) {
          layout[index] = paneRestrictions.maxSize;
          remainingSize -= paneRestrictions.maxSize;
          numPanelsWithDefinedSize += 1;
          panelsToDistribute -= 1;
        }
      }
    });

    panelsToDistribute = layoutRestrictions.length - numPanelsWithDefinedSize;

    if (panelsToDistribute > 0) {
      const spacePerPanel = remainingSize / panelsToDistribute;
      layout.forEach((panelSize, index) => {
        if (panelSize === null) {
          layout[index] = spacePerPanel;
        }
      });
    }
  }

  layout = layout.map((size) => (size === null ? 0 : parseFloat(toFixed(size, PRECISION))));

  if (layout.length === 1) {
    return layout;
  }

  remainingSize = 0;

  const nextLayout = layout.map((panelSize, index) => {
    const restriction = layoutRestrictions[index];
    const adjustedSize = normalizePanelSize(restriction, panelSize);

    remainingSize += panelSize - adjustedSize;

    return adjustedSize;
  });

  if (compareNumbersWithPrecision(remainingSize, 0) !== 0) {
    for (
      let index = 0;
      index < nextLayout.length && compareNumbersWithPrecision(remainingSize, 0) !== 0;
      index += 1
    ) {
      const currentSize = nextLayout[index];
      const adjustedSize = normalizePanelSize(
        layoutRestrictions[index],
        currentSize + remainingSize,
      );

      remainingSize -= adjustedSize - currentSize;

      nextLayout[index] = adjustedSize;
    }

    if (remainingSize > 0) {
      const paneIndex = findLastVisibleExpandedItemIndex(layoutRestrictions);

      if (paneIndex !== -1) {
        nextLayout[paneIndex] += remainingSize;
      }
    }
  }

  return nextLayout;
}
