import { jest } from '@jest/globals';
import { logger } from '@ts/core/utils/m_console';
import DOMComponent from '@ts/core/widget/dom_component';

import SchedulerWorkSpace from '../../workspaces/m_work_space';

type ClassRects = Record<string, Partial<DOMRect>>;

interface SetupSchedulerTestEnvironmentOptions {
  width?: number;
  height?: number;
  classRects?: ClassRects;
}

export const DEFAULT_CELL_WIDTH = 250;
export const DEFAULT_CELL_HEIGHT = 80;
export const DEFAULT_TIMELINE_CELL_HEIGHT = 450;

export const setupSchedulerTestEnvironment = ({
  width = DEFAULT_CELL_WIDTH,
  height = DEFAULT_CELL_HEIGHT,
  classRects = {},
}: SetupSchedulerTestEnvironmentOptions = {}): void => {
  jest.spyOn(logger, 'warn').mockImplementation(() => {});
  DOMComponent.prototype._isVisible = jest.fn((): boolean => true);
  const workspaceProto = SchedulerWorkSpace.prototype as
    unknown as Record<string, unknown>;
  workspaceProto.createCrossScrollingConfig = (): {
    direction: string;
    onScroll: jest.Mock;
    onEnd: jest.Mock;
  } => ({
    direction: 'both',
    onScroll: jest.fn(),
    onEnd: jest.fn(),
  });

  const { getComputedStyle } = window;
  window.getComputedStyle = jest.fn(function (
    element: Element,
    pseudoElement?: string | null,
  ): CSSStyleDeclaration {
    const styles = getComputedStyle.call(this, element, pseudoElement);

    if (element.classList.contains('dx-scheduler-appointment-collector')) {
      styles.setProperty('width', '24px');
      styles.setProperty('height', '20px');
      styles.setProperty('margin', '3px');
    }

    return styles;
  });

  const defaultRect: DOMRect = {
    width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: (): void => {},
  };

  const cellRect = {
    width, height, bottom: height, right: width,
  };

  const mergedRects: ClassRects = {
    'dx-scheduler-date-table-cell': cellRect,
    'dx-scheduler-all-day-table-cell': cellRect,
    ...classRects,
  };

  Element.prototype.getBoundingClientRect = jest.fn(function (): DOMRect {
    const classList: string[] = Array.from(this.classList);

    const matchedClass = classList.find((className) => mergedRects[className]);
    if (matchedClass) {
      return { ...defaultRect, ...mergedRects[matchedClass] };
    }

    return defaultRect;
  });

  Element.prototype.getClientRects = jest.fn(function (): DOMRectList {
    return [Element.prototype.getBoundingClientRect.call(this)] as unknown as DOMRectList;
  });
};
