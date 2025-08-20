import { jest } from '@jest/globals';
import DOMComponent from '@ts/core/widget/dom_component';

import SchedulerWorkSpace from '../../workspaces/m_work_space';

export const setupSchedulerTestEnvironment = (
  isTimelineView = false,
): void => {
  const cellWidth = 250;
  const cellHeight = isTimelineView ? 450 : 80;

  (DOMComponent.prototype as any)._isVisible = jest.fn().mockReturnValue(true);
  SchedulerWorkSpace.prototype._createCrossScrollingConfig = () => ({
    direction: 'both',
    onScroll: jest.fn(),
    onEnd: jest.fn(),
  });
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: cellWidth,
    height: cellHeight,
    top: 0,
    left: 0,
    bottom: cellHeight,
    right: cellWidth,
    x: 0,
    y: 0,
    toJSON: (): void => {},
  }));
};
