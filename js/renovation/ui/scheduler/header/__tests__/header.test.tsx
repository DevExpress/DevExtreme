import { mount } from 'enzyme';
import SchedulerToolbar, { viewFunction, SchedulerToolbarProps } from '../header';
import { Toolbar } from '../../../toolbar/toolbar';
import { ToolbarButtonGroupProps } from '../../../toolbar/toolbar_props';
import { options } from 'yargs';

const HEADER_CLASS = 'dx-scheduler-header';
const DATE_NAVIGATOR_CLASS = 'dx-scheduler-navigator';
const VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher';

describe('Scheduler Toolbar', () => {
  describe('Render', () => {
    it('should render', () => {
      const toolbar = mount(viewFunction({} as any));

      expect(toolbar.is(Toolbar)).toBe(true);
    });
 
    it('should pass items', () => {
      const toolbar = mount(viewFunction({ items: 'items' } as any));

      expect(toolbar.prop('items')).toEqual('items');
    });
  });

  describe('Behaviour', () => {
    describe('Methods', () => {
      it('should call onCurrentViewUpdate after view change', () => {
        const mockCallback = jest.fn();

        const toolbar = new SchedulerToolbar({
          onCurrentViewUpdate: mockCallback,
        });

        toolbar.setCurrentView({name: 'week'} as any);

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toBe('week');
      });

      it('should call onCurrentDateUpdate', () => {
        const mockCallback = jest.fn();

        const toolbar = new SchedulerToolbar({
          onCurrentDateUpdate: mockCallback,
        });

        toolbar.setCurrentDate(new Date(2021, 1, 1));

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual(new Date(2021, 1, 1));
      });
    });

    describe('User Intercation', () => {
      const r = (methods) => mount(
        viewFunction(new SchedulerToolbar({
          ...new SchedulerToolbarProps(),
          ...methods,
        }))
      );

      it('should call', () => {
        const mockCallback = jest.fn();
  
        const toolbar = new SchedulerToolbar({
          ...new SchedulerToolbarProps(),
          onCurrentViewUpdate: mockCallback,
        });
  
        const previousButton = toolbar.items[1].options as ToolbarButtonGroupProps;
        previousButton.onItemClick!({itemData: {view: {name: 'dayz'}}} as any);
  
        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual(new Date(2021, 1, 1));
      });
    });
  });

  describe('Logic', () => {
    const create = (options: any = {}): SchedulerToolbar => {
      return new SchedulerToolbar({
        ...new SchedulerToolbarProps(),
        currentView: 'day',
        views: [
          'agenda', 'day', 'month',
          'timelineDay', 'timelineMonth',
          'timelineWeek', 'timelineWorkWeek',
          'week', 'workWeek'
        ],
        currentDate: new Date(2021, 7, 7),
        ...options,
      });
    };

    describe('Getters', () => {
      it('should return correct css class', () => {
        const toolbar = create();

        expect(toolbar.cssClass).toBe(HEADER_CLASS);
      });

      it('should return correct step for week view', () => {
        const toolbar = create({currentView: 'week'});

        expect(toolbar.step).toBe('week');
      });

      it('should return correct step for week agenda view', () => {
        const toolbar = create({currentView: 'agenda'});

        expect(toolbar.step).toBe('agenda');
      })

      it('should return correct step for week timelineMonth view', () => {
        const toolbar = create({currentView: 'timelineMonth'});

        expect(toolbar.step).toBe('month');
      })

      it('should return correct caption for day view', () => {
        const toolbar = create({ currentView: 'day' });

        expect(toolbar.caption).toEqual({
          startDate: new Date(2021, 7, 7),
          endDate: new Date(new Date(2021, 7, 8).getTime() - 1),
          text: '7 August 2021',
        });
      });

      it('should return correct caption for week view', () => {
        const toolbar = create({ currentView: 'week' });

        expect(toolbar.caption).toEqual({
          startDate: new Date(2021, 7, 1),
          endDate: new Date(new Date(2021, 7, 8).getTime() - 1),
          text: '1-7 August 2021',
        });
      });

      it('should return correct caption for month view', () => {
        const toolbar = create({ currentView: 'agenda' });

        expect(toolbar.caption).toEqual({
          startDate: new Date(2021, 7, 7),
          endDate: new Date(new Date(2021, 7, 14).getTime() - 1),
          text: '7-13 August 2021',
        });
      });

      it('should return correct caption text', () => {
        const toolbar = create();

        expect(toolbar.captionText).toBe('7 August 2021');
      });


      it('should apply customizationFunction to caption text', () => {
        const toolbar = create({
          customizationFunction: (): string => 'custom_text'
        });

        expect(toolbar.captionText).toBe('custom_text');
      });

      it('shoudl return views array', () => {
        const toolbar = create({
          views: [
            {
              type: 'day',
              name: 'DAY',
            },
          ]
        });

        // TODO
        expect(toolbar.views).toEqual([
          {
            name: 'DAY',
            text: 'DAY',
            view: {
                name: 'DAY',
                text: 'DAY',
                type: 'day',
            }
          }
        ]);
      });

      it('should return correct selected view', () => {
        const toolbar = create();

        expect(toolbar.selectedView).toBe('day');
      });

      it('should return correct intervalOptions', () => {
        const toolbar = create();

        expect(toolbar.intervalOptions).toEqual({
          step: 'day',
          intervalCount: 1,
          firstDayOfWeek: 0,
          agendaDuration: 7,
        });
      });

      // TODO проверить вложенные опции виджетов
      it('should return default dateNavigator configurtion', () => {
        const toolbar = create();

        const dateNavigatorConfig = toolbar.items[0];

        expect(dateNavigatorConfig.cssClass).toBe(DATE_NAVIGATOR_CLASS);
        expect(dateNavigatorConfig.location).toBe('before');
        expect(dateNavigatorConfig.widget).toBe('dxButtonGroup');
      });

      it('should return correct dateNavigator previous button icon', () => {
        const toolbar = create();

        const previousButton = toolbar.items[0].options as ToolbarButtonGroupProps;

        expect(previousButton.items![0].icon).toBe('chevronprev');
      });

      it('should return correct dateNavigator calendat button text', () => {
        const toolbar = create();

        const previousButton = toolbar.items[0].options as ToolbarButtonGroupProps;

        expect(previousButton.items![1].text).toBe('7 August 2021');
      });

      it('should return correct dateNavigator next button icon', () => {
        const toolbar = create();

        const previousButton = toolbar.items[0].options as ToolbarButtonGroupProps;

        expect(previousButton.items![2].icon).toBe('chevronnext');
      });

      it('should return default viewSwitcher configurtion', () => {
        const toolbar = create();
        const viewSwitcherConfig = toolbar.items[1];

        expect(viewSwitcherConfig.cssClass).toBe(VIEW_SWITCHER_CLASS);
        expect(viewSwitcherConfig.location).toBe('after');
      });

      it('should return correct viewSwitcher configuraion with useDropDownViewSwitcher=false', () => {
        const toolbar = create({ useDropDownViewSwitcher: false });
        const viewSwitcherConfig = toolbar.items[1];

        expect(viewSwitcherConfig.widget).toBe('dxButtonGroup');
      });

      it('should return correct viewSwitcher configuraion with useDropDownViewSwitcher=true', () => {
        const toolbar = create({ useDropDownViewSwitcher: true });
        const viewSwitcherConfig = toolbar.items[1];

        expect(viewSwitcherConfig.widget).toBe('dxDropDownButton');
      });

      it('should return custom items', () => {
        const items = [
          {
            widget: 'dxButton',
            text: 'Button text',
          }
        ];

        const toolbar = create({ items });

        expect(toolbar.items).toEqual(items);
      });
    });

    describe('Methods', () => {
      it('should return correct previous date', () => {
        const toolbar = create();

        expect(toolbar.getNextDate(-1)).toEqual(new Date(2021, 7, 6));
      });
      it('should return correct next date', () => {
        const toolbar = create();

        expect(toolbar.getNextDate(1)).toEqual(new Date(2021, 7, 8));
      });

      it('should disable previous button depends on min value', () => {
        const toolbar = create({
          min: new Date(2021, 7, 7),
        } as any);

        expect(toolbar.isPreviousButtonDisabled()).toBeTruthy();
      });

      it('should disable next button depends on max value', () => {
        const toolbar = create({
          max: new Date(2021, 7, 7),
        } as any);

        expect(toolbar.isNextButtonDisabled()).toBeTruthy();
      });
    });
  });
});
