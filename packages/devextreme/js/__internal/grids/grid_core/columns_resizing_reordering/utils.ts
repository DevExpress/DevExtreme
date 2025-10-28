import { each } from '@ts/core/utils/m_iterator';
import type { View } from '@ts/grids/grid_core/m_modules';

interface DraggingPanelBoundingRect {
  draggingPanel: View;
  boundingRect: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}

export const getDraggingPanelBoundingRects = (
  draggingPanels: View[],
): DraggingPanelBoundingRect[] | null => {
  const boundingRects: DraggingPanelBoundingRect[] = [];

  each(draggingPanels, (_, draggingPanel) => {
    const boundingRect = draggingPanel?.getBoundingRect();

    if (boundingRect) {
      boundingRects.push({ draggingPanel, boundingRect });
    }
  });

  return boundingRects.length ? boundingRects : null;
};
