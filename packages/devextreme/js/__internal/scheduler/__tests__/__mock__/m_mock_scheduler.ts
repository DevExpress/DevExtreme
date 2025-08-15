import { jest } from '@jest/globals';
import DOMComponent from '@ts/core/widget/dom_component';

import SchedulerWorkSpace from '../../workspaces/m_work_space';

interface SetupSchedulerTestEnvironmentOptions {
  width?: number;
  height?: number;
}

export const setupSchedulerTestEnvironment = ({
  width = 250,
  height = 80,
}: SetupSchedulerTestEnvironmentOptions = {}): void => {
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
