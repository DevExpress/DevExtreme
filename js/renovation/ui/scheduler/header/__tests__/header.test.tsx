import { mount, shallow, ShallowWrapper } from 'enzyme';
import SchedulerToolbar, { viewFunction, SchedulerToolbarProps } from '../header';
import { Toolbar } from '../../../toolbar/toolbar';
import { ToolbarItem, ToolbarLocationType, ToolbarWidgetType, ToolbarItemType } from '../../../toolbar/toolbar_props';
import { is } from '@babel/types';

const HEADER_CLASS = 'dx-scheduler-header';
const DATE_NAVIGATOR_CLASS = 'dx-scheduler-navigator';
const VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher';

const props = {
  currentView: 'day',
  currentDate: new Date(2021, 7, 7),
};

describe('Scheduler Toolbar', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => {
      return shallow(viewFunction({
          ...viewModel,
          props: {
            ...viewModel.props,
          }
      }))
    }

    it('should render', () => {
      const toolbar = mount(viewFunction({} as any));

      expect(toolbar.is(Toolbar)).toBe(true);
    });

    // it('should render dateNavigator', () => {
    //   const toolbar = render({
    //     items: [
    //       {
    //         location: 'before' as ToolbarLocationType,
    //         widget: 'dxButtonGroup' as ToolbarWidgetType,
    //         cssClass: 'dx-scheduler-navigator',
    //         options: {
    //           items: [
    //             {
    //               icon: 'chevronprev',
    //             },
    //             {
    //               text: '23-29 May 2021',
    //             },
    //             {
    //               icon: 'chevronnext',
    //             },
    //           ]
    //         },
    //       } as ToolbarItemType,
    //     ]
    //   } as any);
    //   const dateNavigator = toolbar.find(DATE_NAVIGATOR_CLASS);

    //   expect(toolbar.render().has).toEqual(1);
    //   // expect(toolbar.exists(DATE_NAVIGATOR_CLASS)).toBeTruthy();
    // });

    // it('should have props', () => {
    //   const cell = render({ items: { with: '31px' } });

    //   expect(cell.props()).toEqual({
    //     with: '23px',
    //   });

    //   // TODO - WORK
    //   // expect(cell.props().componentProps.items).toEqual({
    //   //   with: '23px',
    //   // });

    //   // expect(cell.prop('items'))
    //   //   .toEqual({ with: '32px' });
    // })

    it('should render', () => {
      const toolbar = mount(viewFunction({} as any));

      expect(toolbar.is(Toolbar)).toBe(true);
    });

    // it('should render dateNavigator', () => {
    //   const toolbar = render({currentDate: 12} as any);
    //   const dateNavigator = toolbar.find(DATE_NAVIGATOR_CLASS);

    //   // expect(dateNavigator.text()).toEqual('fd');

    //   expect(toolbar.prop('currentDate')).toBe(4);

    //   expect(toolbar.props()).toMatchObject({
    //     currentDate: new Date()
    //   });
    // });

    // it('should render viewSwitcher', () => {
    //   const toolbar = render({} as any);
    //   const dateNavigator = toolbar.find(VIEW_SWITCHER_CLASS);
    // });

    // it('should have props', () => {
    //   const props = {
    //     currentView: 'day',
    //   };

    //   const toolbar = mount(viewFunction(props as any));


    //   expect(toolbar.props()).toMatchObject({
    //     currentView: 'day',
    //   });
    // });

    // it('should have class', () => {
    //   const toolbar = mount(viewFunction({} as any));

    //   expect(toolbar.hasClass(HEADER_CLASS)).toBe(true);
    // });

    // it('should has correct caption', () => {
    //   const toolbar = render({} as any);

    //   expect(toolbar.props()).toBe('8 August 2021');
    // });

    // it('should render with correct props', () => {
    //   const props = {
    //     currentView: 'day',
    //   }

    //   const toolbar = render(props as any);
    //   setTimeout(() => {
    //     console.log(toolbar.prop('currentView'));
    //   }, 10000);

    //   // TODO пройтись for'иком по всем пропсам
    //   expect(toolbar.prop('currentView')).toBe(props.currentView);
    // })
  });

  describe('Behaviour', () => {
    describe('Methods', () => {
      it('should call onCurrentViewUpdate after view change', () => {
        const mockCallback = jest.fn();

        const toolbar  = new SchedulerToolbar({
          onCurrentViewUpdate: mockCallback,
        });

        toolbar.setCurrentView({name: 'week'} as any);

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toBe('week');
      });

      it('should call onCurrentDateUpdate', () => {
        const mockCallback = jest.fn();

        const toolbar = new  SchedulerToolbar({
          onCurrentDateUpdate: mockCallback,
        });

        toolbar.setCurrentDate(new Date(2021, 1, 1));

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toEqual(new Date(2021, 1, 1));
      });
    });
  });

  describe('logic', () => {
    const create = (options: SchedulerToolbarProps): SchedulerToolbar => {
      return new SchedulerToolbar({
        ...new SchedulerToolbarProps(),
        ...options,
      });
    }

    describe('Getters', () => {
      it('should return correct css class', () => {
        const toolbar = new SchedulerToolbar({});

        expect(toolbar.cssClass).toEqual(HEADER_CLASS);
      });

      // it('should return correct step for week view', () => {
      //   const toolbar = new SchedulerToolbar({currentView: 'week'});

      //   expect(toolbar.step).toEqual('week');
      // });

      // it('should return correct step for week agenda view', () => {
      //   const toolbar = new SchedulerToolbar({currentView: 'agenda'});

      //   expect(toolbar.step).toEqual('agenda');
      // })

      // Проверяется работоспособность, логику лучше проверять в другом месте
      it('should return correct step for week timelineMonth view', () => {
        const toolbar = new SchedulerToolbar({currentView: 'timelineMonth'});

        expect(toolbar.step).toEqual('month');
      })

      it('should return correct caption', () => {
        const toolbar = new SchedulerToolbar({
          currentView: 'day',
          currentDate: new Date(2021, 7, 7),
          intervalCount: 1,
          firstDayOfWeek: 0,
        });

        expect(toolbar.caption).toEqual({
          startDate: new Date(2021, 7, 7),
          endDate: new Date(new Date(2021, 7, 8).getTime() - 1),
          text: '7 August 2021',
        });
      });

      it('should return correct caption text', () => {
        const toolbar = new SchedulerToolbar({
          currentView: 'day',
          currentDate: new Date(2021, 7, 7),
          intervalCount: 1,
          firstDayOfWeek: 0,
        });

        expect(toolbar.captionText).toEqual('7 August 2021');
      });


      it('should apply customizationFunction to caption text', () => {
        const toolbar = new SchedulerToolbar({
          currentView: 'day',
          currentDate: new Date(2021, 7, 7),
          intervalCount: 1,
          firstDayOfWeek: 0,
          customizationFunction: (): string => {
            return 'custom_text';
          },
        });

        expect(toolbar.captionText).toEqual('custom_text');
      });

      it('shoudl return views array', () => {
        const toolbar = new SchedulerToolbar({
          views: ['day'],
        });

        expect(toolbar.views).toEqual([
          {
            name: 'day',
            text: 'Day',
            view: {
                name: 'day',
                text: 'Day',
                type: 'day',
            }
          }
        ]);
      });

      it('should return correct selected view', () => {
        const toolbar = new SchedulerToolbar({
          currentView: 'Day',
        });

        expect(toolbar.selectedView).toEqual('Day');
      });

      it('should return correct intervalOptions', () => {
          const intervalCount = 2;
          const firstDayOfWeek = 3;
          const agendaDuration = 4;

        const toolbar = new SchedulerToolbar({
          currentView: 'week',
          intervalCount,
          firstDayOfWeek,
          agendaDuration,
        });

        expect(toolbar.intervalOptions).toEqual({
          step: 'week',
          intervalCount,
          firstDayOfWeek,
          agendaDuration,
        });
      });

      it('should return correct next date', () => {
        const toolbar = new SchedulerToolbar({
          intervalCount: 1,
          firstDayOfWeek: 0,
          currentDate: new Date(2021, 7, 7),
          currentView: 'day',
        })

        expect(toolbar.getNextDate(-1)).toEqual(new Date(2021, 7, 6));
        expect(toolbar.getNextDate(1)).toEqual(new Date(2021, 7, 8));
      });

      it('should disable previous button depends on min value', () => {
        const toolbar = create({
          currentDate: new Date(2021, 7, 7),
          min: new Date(2021, 7, 7),
        } as any);

        expect(toolbar.isPreviousButtonDisabled()).toBeTruthy();
      });

      it('should disable next button depends on max value', () => {
        const toolbar = create({
          currentDate: new Date(2021, 7, 7),
          max: new Date(2021, 7, 7),
        } as any);

        expect(toolbar.isNextButtonDisabled()).toBeTruthy();
      });

      // TODO проверить вложенные опции виджетов
      it('should return default configurtion', () => {
        const toolbar = create({} as any);

        const dateNavigatorConfig = toolbar.items[0];
        const viewSwitcherConfig = toolbar.items[1];

        expect(dateNavigatorConfig.cssClass).toEqual(DATE_NAVIGATOR_CLASS);
        expect(dateNavigatorConfig.location).toEqual('before');
        expect(dateNavigatorConfig.widget).toEqual('dxButtonGroup');

        expect(viewSwitcherConfig.cssClass).toEqual(VIEW_SWITCHER_CLASS);
        expect(viewSwitcherConfig.location).toEqual('after');
        // TODO проверить на мобильный вид
        expect(viewSwitcherConfig.widget).toEqual('dxButtonGroup');
      });

      it('should return custom items', () => {
        const items = [
          {
            widget: 'dxButton',
            text: 'Button text'
          }
        ];

        const toolbar = create({
          items,
        } as any);

        expect(toolbar.items).toEqual(items);
      });
    });

    describe('Default Option Rules', () => {

    });
  });
});
