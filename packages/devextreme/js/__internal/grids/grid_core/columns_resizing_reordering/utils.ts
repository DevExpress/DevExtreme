import { each } from '@ts/core/utils/m_iterator';
import type { View } from '@ts/grids/grid_core/modules/modules';
import type { BoundingRect } from '@ts/grids/grid_core/views/types';

interface DraggingPanelBoundingRect {
  draggingPanel: View;
  boundingRect: BoundingRect;
}

export const getDraggingPanelBoundingRects = (
  draggingPanels: View[],
): DraggingPanelBoundingRect[] | null => {
  const boundingRects: DraggingPanelBoundingRect[] = [];

  each(draggingPanels, (_, draggingPanel) => {
    // @ts-expect-error the dragging panels have getBoundingRect
    const boundingRect = draggingPanel?.getBoundingRect();

    if (boundingRect) {
      boundingRects.push({ draggingPanel, boundingRect });
    }
  });

  return boundingRects.length ? boundingRects : null;
};
