import { jest } from '@jest/globals';
import { logger } from '@ts/core/utils/m_console';
import DOMComponent from '@ts/core/widget/dom_component';

import SchedulerWorkSpace from '../../workspaces/m_work_space';

interface SetupSchedulerTestEnvironmentOptions {
  width?: number;
  height?: number;
}

export const DEFAULT_CELL_WIDTH = 250;
export const DEFAULT_CELL_HEIGHT = 80;
export const DEFAULT_TIMELINE_CELL_HEIGHT = 450;

export const setupSchedulerTestEnvironment = ({
  width = DEFAULT_CELL_WIDTH,
  height = DEFAULT_CELL_HEIGHT,
}: SetupSchedulerTestEnvironmentOptions = {}): void => {
  jest.spyOn(logger, 'warn').mockImplementation(() => {});
  DOMComponent.prototype._isVisible = jest.fn((): boolean => true);
  SchedulerWorkSpace.prototype._createCrossScrollingConfig = (): {
    direction: string;
    onScroll: jest.Mock;
    onEnd: jest.Mock;
  } => ({
    direction: 'both',
    onScroll: jest.fn(),
    onEnd: jest.fn(),
  });
  Element.prototype.getBoundingClientRect = jest.fn((): DOMRect => ({
    width,
    height,
    top: 0,
    left: 0,
    bottom: height,
    right: width,
    x: 0,
    y: 0,
    toJSON: (): void => {},
  }));
};
