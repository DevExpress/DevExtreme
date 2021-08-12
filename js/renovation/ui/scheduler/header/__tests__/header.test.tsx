/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { shallow } from 'enzyme';
import SchedulerToolbar, { viewFunction as ViewFunction, SchedulerToolbarBaseProps } from '../header';
import { Toolbar } from '../../../toolbar/toolbar';
import { ToolbarButtonGroupProps } from '../../../toolbar/toolbar_props';

const HEADER_CLASS = 'dx-scheduler-header';
const DATE_NAVIGATOR_CLASS = 'dx-scheduler-navigator';
const VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher';

describe('Scheduler Toolbar', () => {
  describe('Render', () => {
    const defaultProps: any = { items: [] };
    const render = (viewModel = {}) => shallow(
      <ViewFunction {...{ ...defaultProps, ...viewModel }} />,
    );

    it('should render and pass', () => {
      const toolbar = render({ items: 'items' });

      expect(toolbar.is(Toolbar)).toBe(true);
      expect(toolbar.prop('items')).toEqual('items');
    });
  });

  describe('Behaviour', () => {
    const createToolbar = (options: any = {}): SchedulerToolbar => new SchedulerToolbar({
      ...new SchedulerToolbarBaseProps(),
      currentView: 'day',
      views: ['day', 'week'],
      currentDate: new Date(2021, 7, 7),
      items: [
        {
          defaultElement: 'dateNavigator',
          location: 'before',
        },
        {
          defaultElement: 'viewSwitcher',
          location: 'after',
        },
      ],
      ...options,
    });

    describe('Methods', () => {
      describe('setCurrentView', () => {
        it('should call onCurrentViewUpdate', () => {
          const mockCallback = jest.fn();
          const toolbar = createToolbar({ onCurrentViewUpdate: mockCallback });

          toolbar.setCurrentView({ name: 'week' } as any);

          expect(mockCallback).toBeCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith('week');
        });

        it('should not call onCurrentViewUpdate with currentView', () => {
          const mockCallback = jest.fn();
          const toolbar = createToolbar({ onCurrentViewUpdate: mockCallback });

          toolbar.setCurrentView({ name: 'day' } as any);

          expect(mockCallback).toBeCalledTimes(0);
        });
      });

      describe('setCurrentDate', () => {
        it('should call onCurrentDateUpdate', () => {
          const mockCallback = jest.fn();
          const toolbar = createToolbar({ onCurrentDateUpdate: mockCallback });

          toolbar.setCurrentDate(new Date(2021, 1, 1));

          expect(mockCallback).toBeCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith(new Date(2021, 1, 1));
        });

        it('should not call onCurrentDateUpdate with selected view', () => {
          const mockCallback = jest.fn();
          const toolbar = createToolbar({ onCurrentDateUpdate: mockCallback });

          toolbar.setCurrentDate(new Date(2021, 7, 7));

          expect(mockCallback).toBeCalledTimes(0);
        });
      });

      describe('getNextDate', () => {
        it('should return correct previous date', () => {
          const toolbar = createToolbar();

          expect(toolbar.getNextDate(-1)).toEqual(new Date(2021, 7, 6));
        });

        it('should return correct next date', () => {
          const toolbar = createToolbar();

          expect(toolbar.getNextDate(1)).toEqual(new Date(2021, 7, 8));
        });
      });

      describe('Navigation buttons status', () => {
        it('should disable previous button depends on min value', () => {
          const toolbar = createToolbar({
            min: new Date(2021, 7, 7),
          } as any);

          expect(toolbar.isPreviousButtonDisabled()).toBe(true);
        });

        it('should disable next button depends on max value', () => {
          const toolbar = createToolbar({
            max: new Date(2021, 7, 7),
          } as any);

          expect(toolbar.isNextButtonDisabled()).toBe(true);
        });
      });
    });

    describe('Events', () => {
      describe('View Switcher', () => {
        it('should call onCurrentViewUpdate', () => {
          const mockCallback = jest.fn();
          const toolbar = createToolbar({ onCurrentViewUpdate: mockCallback });

          const viewSwitcher = toolbar.items[1];
          const options = viewSwitcher.options as ToolbarButtonGroupProps;
          const view = { name: 'week' };
          options.onItemClick!({ itemData: view } as any);

          expect(mockCallback).toBeCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith(view.name);
        });
      });

      describe('Date Navigator', () => {
        it('should call onCurrentDateUpdate with previous button index', () => {
          const mockCallback = jest.fn();
          const toolbar = createToolbar({ onCurrentDateUpdate: mockCallback });

          const dateNavigator = toolbar.items[0];
          const options = dateNavigator.options as ToolbarButtonGroupProps;
          options.onItemClick!({ itemIndex: 0 } as any);

          expect(mockCallback).toBeCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith(new Date(2021, 7, 6));
        });

        it('should call onCurrentDateUpdate with next button index', () => {
          const mockCallback = jest.fn();
          const toolbar = createToolbar({ onCurrentDateUpdate: mockCallback });

          const dateNavigator = toolbar.items[0];
          const options = dateNavigator.options as ToolbarButtonGroupProps;
          options.onItemClick!({ itemIndex: 2 } as any);

          expect(mockCallback).toBeCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith(new Date(2021, 7, 8));
        });

        // TODO: Improve test after calendar intergration
        // eslint-disable-next-line jest/expect-expect
        it('should call showCalandar with calendar button index', () => {
          const toolbar = createToolbar();

          const dateNavigator = toolbar.items[0];
          const options = dateNavigator.options as ToolbarButtonGroupProps;
          options.onItemClick!({ itemIndex: 1 } as any);
        });
      });
    });
  });

  describe('Logic', () => {
    const createToolbar = (options: any = {}): SchedulerToolbar => new SchedulerToolbar({
      ...new SchedulerToolbarBaseProps(),
      currentView: 'day',
      views: [
        'agenda', 'day', 'month',
        'timelineDay', 'timelineMonth',
        'timelineWeek', 'timelineWorkWeek',
        'week', 'workWeek',
      ],
      currentDate: new Date(2021, 7, 7),
      items: [
        {
          defaultElement: 'dateNavigator',
          location: 'before',
        },
        {
          defaultElement: 'viewSwitcher',
          location: 'after',
        },
      ],
      ...options,
    });

    describe('Getters', () => {
      it('should return correct css class', () => {
        const toolbar = createToolbar();

        expect(toolbar.cssClass).toBe(HEADER_CLASS);
      });

      describe('Step', () => {
        it('should return correct step for week view', () => {
          const toolbar = createToolbar({ currentView: 'week' });

          expect(toolbar.step).toBe('week');
        });

        it('should return correct step for week agenda view', () => {
          const toolbar = createToolbar({ currentView: 'agenda' });

          expect(toolbar.step).toBe('agenda');
        });

        it('should return correct step for week timelineMonth view', () => {
          const toolbar = createToolbar({ currentView: 'timelineMonth' });

          expect(toolbar.step).toBe('month');
        });
      });

      describe('Caption', () => {
        it('should return correct caption for day view', () => {
          const toolbar = createToolbar({ currentView: 'day' });

          expect(toolbar.caption).toEqual({
            startDate: new Date(2021, 7, 7),
            endDate: new Date(new Date(2021, 7, 8).getTime() - 1),
            text: '7 August 2021',
          });
        });

        it('should return correct caption for week view', () => {
          const toolbar = createToolbar({ currentView: 'week' });

          expect(toolbar.caption).toEqual({
            startDate: new Date(2021, 7, 1),
            endDate: new Date(new Date(2021, 7, 8).getTime() - 1),
            text: '1-7 August 2021',
          });
        });

        it('should return correct caption for agenda view', () => {
          const toolbar = createToolbar({ currentView: 'agenda' });

          expect(toolbar.caption).toEqual({
            startDate: new Date(2021, 7, 7),
            endDate: new Date(new Date(2021, 7, 14).getTime() - 1),
            text: '7-13 August 2021',
          });
        });
      });

      describe('Caption Text', () => {
        it('should return correct caption text', () => {
          const toolbar = createToolbar();

          expect(toolbar.captionText).toBe('7 August 2021');
        });

        it('should apply customizationFunction to caption text', () => {
          const toolbar = createToolbar({
            customizationFunction: (): string => 'custom_text',
          });

          expect(toolbar.captionText).toBe('custom_text');
        });
      });

      it('should return views array', () => {
        const views = [{ type: 'day', name: 'DAY' }];
        const toolbar = createToolbar({ views });

        expect(toolbar.views).toEqual([{
          text: 'DAY',
          name: 'DAY',
        }]);
      });

      it('should return correct selected view', () => {
        const toolbar = createToolbar();

        expect(toolbar.selectedView).toBe('day');
      });

      it('should return correct intervalOptions', () => {
        const toolbar = createToolbar();

        expect(toolbar.intervalOptions).toEqual({
          step: 'day',
          intervalCount: 1,
          firstDayOfWeek: 0,
          agendaDuration: 7,
        });
      });

      describe('Items', () => {
        describe('ViewSitcher', () => {
          it('should return default viewSwitcher configurtion', () => {
            const toolbar = createToolbar();
            const viewSwitcherConfig = toolbar.items[1];

            expect(viewSwitcherConfig.cssClass).toBe(VIEW_SWITCHER_CLASS);
            expect(viewSwitcherConfig.location).toBe('after');
          });

          it('should return correct viewSwitcher type with '
            + 'useDropDownViewSwitcher=false', () => {
            const toolbar = createToolbar({ useDropDownViewSwitcher: false });
            const viewSwitcherConfig = toolbar.items[1];

            expect(viewSwitcherConfig.widget).toBe('dxButtonGroup');
            expect(viewSwitcherConfig.locateInMenu).toBe('auto');
          });

          it('should return correct viewSwitcher type with '
            + 'useDropDownViewSwitcher=true', () => {
            const toolbar = createToolbar({ useDropDownViewSwitcher: true });
            const viewSwitcherConfig = toolbar.items[1];

            expect(viewSwitcherConfig.widget).toBe('dxDropDownButton');
            expect(viewSwitcherConfig.locateInMenu).toBe('never');
          });
        });

        describe('DateNavigator', () => {
          it('should return default dateNavigator configurtion', () => {
            const toolbar = createToolbar();

            const dateNavigatorConfig = toolbar.items[0];

            expect(dateNavigatorConfig.cssClass).toBe(DATE_NAVIGATOR_CLASS);
            expect(dateNavigatorConfig.location).toBe('before');
            expect(dateNavigatorConfig.widget).toBe('dxButtonGroup');
          });

          it('should return correct dateNavigator previous button icon', () => {
            const toolbar = createToolbar();

            const previousButton = toolbar.items[0].options as ToolbarButtonGroupProps;

            expect(previousButton.items![0].icon).toBe('chevronprev');
          });

          it('should return correct dateNavigator calendat button text', () => {
            const toolbar = createToolbar();

            const previousButton = toolbar.items[0].options as ToolbarButtonGroupProps;

            expect(previousButton.items![1].text).toBe('7 August 2021');
          });

          it('should return correct dateNavigator next button icon', () => {
            const toolbar = createToolbar();

            const previousButton = toolbar.items[0].options as ToolbarButtonGroupProps;

            expect(previousButton.items![2].icon).toBe('chevronnext');
          });
        });

        it('should return custom items', () => {
          const items = [{
            widget: 'dxButton',
            text: 'Button text',
          }];

          const toolbar = createToolbar({ items });

          expect(toolbar.items).toEqual(items);
        });
      });
    });
  });
});
