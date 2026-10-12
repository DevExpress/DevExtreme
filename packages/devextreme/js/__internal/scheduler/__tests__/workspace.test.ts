import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import { fireEvent } from '@testing-library/dom';

import fx from '../../../common/core/animation/fx';
import CustomStore from '../../../data/custom_store';
import { createScheduler } from './__mock__/create_scheduler';
import { setupSchedulerTestEnvironment } from './__mock__/mock_scheduler';

const CLASSES = {
  scheduler: 'dx-scheduler',
  workSpace: 'dx-scheduler-work-space',
  focusedState: 'dx-state-focused',
};

const defaultOptions = {
  currentView: 'week',
  views: ['week'],
  currentDate: new Date(2024, 0, 1),
  startDayHour: 9,
  endDayHour: 16,
  height: 600,
};

describe('Workspace', () => {
  beforeEach(() => {
    fx.off = true;
    setupSchedulerTestEnvironment({ height: 600 });
  });

  afterEach(() => {
    const $scheduler = $(document.querySelector(`.${CLASSES.scheduler}`));
    // @ts-expect-error
    $scheduler.dxScheduler('dispose');
    document.body.innerHTML = '';
    fx.off = false;
  });

  it('should not duplicate workspace elements when resources are loaded asynchronously (T661335)', async () => {
    const { scheduler, container } = await createScheduler({
      templatesRenderAsynchronously: true,
      currentView: 'day',
      views: ['day'],
      groups: ['owner'],
      resources: [
        {
          fieldExpr: 'owner',
          dataSource: [{ id: 1, text: 'Owner 1' }],
        },
        {
          fieldExpr: 'room',
          dataSource: new CustomStore({
            load(): Promise<unknown> {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve([{ id: 1, text: 'Room 1', color: '#ff0000' }]);
                });
              });
            },
          }),
        },
      ],
      dataSource: [
        {
          text: 'Meeting in Room 1',
          startDate: new Date(2017, 4, 25, 9, 0),
          endDate: new Date(2017, 4, 25, 10, 0),
          roomId: 1,
        },
      ],
      startDayHour: 9,
      currentDate: new Date(2017, 4, 25),
      height: 600,
    });

    scheduler.option('groups', ['room']);

    await new Promise((r) => { setTimeout(r); });

    const $workSpaces = $(container).find(`.${CLASSES.workSpace}`);
    const $groupHeader = $(container).find('.dx-scheduler-group-header');

    expect($workSpaces.length).toBe(1);

    expect($groupHeader.length).toBeGreaterThan(0);
    expect($groupHeader.text()).toContain('Room 1');
  });

  describe('A11y', () => {
    it('should have tabIndex -1 to be skipped in the tab order', async () => {
      const { POM } = await createScheduler(defaultOptions);

      expect(POM.getWorkSpace().getAttribute('tabindex')).toBe('-1');
    });

    it('should have tabIndex -1 after tabIndex option change', async () => {
      const { scheduler, POM } = await createScheduler(defaultOptions);

      scheduler.option('tabIndex', 1);

      expect(POM.getWorkSpace().getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Keyboard navigation', () => {
    it('should focus the clicked cell', async () => {
      const { POM } = await createScheduler(defaultOptions);

      const cell = POM.getDateTableCell(0, 0);
      fireEvent.mouseDown(cell, { which: 1 });
      fireEvent.mouseUp(cell);

      expect(cell.classList.contains(CLASSES.focusedState)).toBe(true);
    });

    it('should move focus and selection to the next cell on arrow key', async () => {
      const { POM } = await createScheduler(defaultOptions);

      const firstCell = POM.getDateTableCell(0, 0);
      const secondCell = POM.getDateTableCell(1, 0);
      fireEvent.mouseDown(firstCell, { which: 1 });
      fireEvent.mouseUp(firstCell);
      fireEvent.keyDown(POM.getWorkSpace(), { key: 'ArrowDown' });

      expect(secondCell.classList.contains(CLASSES.focusedState)).toBe(true);
      expect(firstCell.classList.contains(CLASSES.focusedState)).toBe(false);
    });

    it('should extend selection on shift + arrow key', async () => {
      const { scheduler, POM } = await createScheduler(defaultOptions);

      const firstCell = POM.getDateTableCell(0, 0);
      fireEvent.mouseDown(firstCell, { which: 1 });
      fireEvent.mouseUp(firstCell);
      fireEvent.keyDown(POM.getWorkSpace(), { key: 'ArrowDown', shiftKey: true });

      expect(scheduler.option('selectedCellData')).toHaveLength(2);
    });

    it('should clear focused cell when focus leaves the workspace', async () => {
      const { POM } = await createScheduler(defaultOptions);

      const cell = POM.getDateTableCell(0, 0);
      fireEvent.mouseDown(cell, { which: 1 });
      fireEvent.mouseUp(cell);
      fireEvent.focusOut(POM.getWorkSpace());

      expect(cell.classList.contains(CLASSES.focusedState)).toBe(false);
    });
  });
});
