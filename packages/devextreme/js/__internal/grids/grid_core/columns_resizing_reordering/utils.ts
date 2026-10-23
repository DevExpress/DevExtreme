import { each } from '@ts/core/utils/iterator';

import type { DraggingPanel, DraggingPanelBoundingRect } from './types';

export const getDraggingPanelBoundingRects = (
  draggingPanels: (DraggingPanel | null | undefined)[],
): DraggingPanelBoundingRect[] | null => {
  const boundingRects: DraggingPanelBoundingRect[] = [];

  each(draggingPanels, (_, draggingPanel) => {
    const boundingRect = draggingPanel?.getBoundingRect();

    if (draggingPanel && boundingRect) {
      boundingRects.push({ draggingPanel, boundingRect });
    }
  });

  return boundingRects.length ? boundingRects : null;
};
