import { h } from 'preact';
import { shallow, mount } from 'enzyme';
import { Fragment } from 'devextreme-generator/component_declaration/common';
import { JSXInternal } from 'preact/src/jsx';
import { dxSchedulerAppointment } from 'js/ui/scheduler';
import TooltipItemLayout, {
  viewFunction as TooltipItemLayoutView,
  TooltipItemLayoutProps, getCurrentData, getOnDeleteButtonClick,
} from '../../../../js/renovation/scheduler/appointment-tooltip/tooltip-item-layout';
import DeleteButton from '../../../../js/renovation/scheduler/appointment-tooltip/delete-button';
import Marker from '../../../../js/renovation/scheduler/appointment-tooltip/marker';
import TooltipItemContent from '../../../../js/renovation/scheduler/appointment-tooltip/tooltip-item-content';

jest.mock('../../../../js/renovation/scheduler/appointment-tooltip/delete-button', () => () => null);
jest.mock('../../../../js/renovation/scheduler/appointment-tooltip/marker', () => () => null);
jest.mock('../../../../js/renovation/scheduler/appointment-tooltip/tooltip-item-content', () => () => null);

describe('TooltipItemLayout', () => {
  describe('View', () => {
    const defaultProps: TooltipItemLayoutProps = {
      onDelete: jest.fn(),
      onHide: jest.fn(),
      getTextAndFormatDate: jest.fn(() => ({
        text: 'Appointment text',
        formatDate: 'Formatted date',
      })),
      showDeleteButton: true,
      item: {
        data: { text: 'data' },
        currentData: { text: 'currentData' },
        color: 'color',
      },
      index: 0,
      container: ('container' as unknown) as HTMLDivElement,
      singleAppointmentData: {
        text: 'singleAppointmentData',
      },
    };

    it('should render appointment item with marker, content and delete button', () => {
      const tree = shallow(<TooltipItemLayoutView props={{ ...defaultProps }} />);

      expect(tree.type())
        .toBe(Fragment);
      expect(tree.children())
        .toHaveLength(1);

      const layout = tree.childAt(0);
      expect(layout.is('.dx-tooltip-appointment-item'))
        .toBe(true);
      expect(layout.children())
        .toHaveLength(3);

      expect(layout.childAt(0).type())
        .toBe(Marker);
      expect(layout.childAt(1).type())
        .toBe(TooltipItemContent);

      const buttonContainer = layout.childAt(2);
      expect(buttonContainer.is('.dx-tooltip-appointment-item-delete-button-container'))
        .toBe(true);
    });

    it('should pass correct props to Marker', () => {
      const marker = shallow(<TooltipItemLayoutView props={{ ...defaultProps }} />).find(Marker);

      expect(marker.props())
        .toMatchObject({
          color: defaultProps.item.color,
        });
    });

    it('should process delete button click correctly', () => {
      const deleteButton = shallow(<TooltipItemLayoutView
        props={{ ...defaultProps }}
        currentData={defaultProps.item.currentData}
      />).find(DeleteButton);

      expect(deleteButton.props())
        .toMatchObject({
          onClick: expect.any(Function),
        });

      const stopPropagation = jest.fn();
      const event = { event: { stopPropagation } };
      deleteButton.prop('onClick')(event);

      expect(defaultProps.onHide)
        .toHaveBeenCalledTimes(1);
      expect(defaultProps.onDelete)
        .toHaveBeenCalledTimes(1);
      expect(defaultProps.onDelete)
        .toHaveBeenCalledWith(defaultProps.item.data, defaultProps.singleAppointmentData);
      expect(stopPropagation)
        .toHaveBeenCalledTimes(1);
    });

    it('should pass correct props to item content', () => {
      const content = shallow(<TooltipItemLayoutView
        props={{ ...defaultProps }}
        currentData={defaultProps.item?.currentData}
      />).find(TooltipItemContent);

      expect(content.props())
        .toMatchObject({
          appointmentData: defaultProps.item?.data,
          currentAppointmentData: defaultProps.item?.currentData,
          getTextAndFormatDate: defaultProps.getTextAndFormatDate,
        });
    });

    it('should not render DeleteButton if showDeleteButton is false', () => {
      const tree = shallow(<TooltipItemLayoutView props={{ ...defaultProps, showDeleteButton: false }} />);

      expect(tree.find(DeleteButton).exists())
        .toBe(false);
    });

    describe('Template', () => {
      const currentData: dxSchedulerAppointment = { text: 'currentData' };
      const template = () => null;
      const render = () => shallow(<TooltipItemLayoutView
        props={{ ...defaultProps, itemContentTemplate: template }}
        currentData={currentData}
      />);

      it('should render template if it is provided', () => {
        const tree = render();

        expect(tree.find(template).exists())
          .toBe(true);
      });

      it('should rpass correct props into the template', () => {
        const tree = render();

        expect(tree.find(template).props())
          .toEqual({
            model: {
              appointmentData: defaultProps.item?.data,
              targetedAppointmentData: currentData,
            },
            index: 0,
            parentRef: {
              current: 'container',
            },
            children: [],
          });
      });

      it('should rerender template in runtime', () => {
        const tree = shallow(<TooltipItemLayoutView props={{ ...defaultProps }} />);

        expect(tree.find(template).exists())
          .toBe(false);

        tree.setProps({
          props: {
            ...defaultProps,
            itemContentTemplate: template,
          },
        });
        expect(tree.find(template).exists())
          .toBe(true);

        tree.setProps({
          props: {
            ...defaultProps,
            itemContentTemplate: undefined,
          },
        });
        expect(tree.find(template).exists())
          .toBe(false);
      });

      //   it('should change template properties in runtime', () => {
      //     const tree = renderRoot({
      //       ...defaultProps,
      //       itemContent: template,
      //     });

      //     expect(tree.find('.appointment-data').text())
      //       .toBe('data');
      //     expect(tree.find('.appointment-targeted-data').text())
      //       .toBe('currentData');
      //     expect(tree.find('.index').text())
      //       .toBe('0');

      //     tree.setProps({
      //       item: {
      //         data: { text: 'newData' },
      //         currentData: { text: 'newCurrentData' },
      //       },
      //       index: 2,
      //     });

      //     expect(tree.find('.appointment-data').text())
      //       .toBe('newData');
      //     expect(tree.find('.appointment-targeted-data').text())
      //       .toBe('newCurrentData');
      //     expect(tree.find('.index').text())
      //       .toBe('2');
      //   });
      // });
    });

    //   describe('Getters', () => {
    //     describe('getCurentData', () => {
    //       it('should return data if other are undefiend', () => {
    //         const appointmentItem = { data: { text: 'data' } };
    //         expect(getCurrentData(appointmentItem))
    //           .toBe(appointmentItem.data);
    //       });

    //       it('should return currentData if settings are undefined', () => {
    //         const appointmentItem = {
    //           currentData: { text: 'currentData' },
    //           data: { text: 'data' },
    //         };

    //         expect(getCurrentData(appointmentItem))
    //           .toBe(appointmentItem.currentData);
    //       });

    //       it('should return currentData if settings are defined but targetedAppointmentData is undefined', () => {
    //         const appointmentItem = {
    //           currentData: { text: 'currentData' },
    //           data: { text: 'data' },
    //           settings: {},
    //         };

    //         expect(getCurrentData(appointmentItem))
    //           .toBe(appointmentItem.currentData);
    //       });

    //       it('should return targetedAppointmentData', () => {
    //         const appointmentItem = {
    //           currentData: { text: 'currentData' },
    //           data: { text: 'data' },
    //           settings: { targetedAppointmentData: { text: 'targetedAppointmentData' } },
    //         };

    //         expect(getCurrentData(appointmentItem))
    //           .toBe(appointmentItem.settings.targetedAppointmentData);
    //       });
    //     });

    //     describe('getOnDeleteButtonClick', () => {
    //       it('should return data if other are undefiend', () => {
    //         const onHide = jest.fn();
    //         const onDelete = jest.fn();
    //         const data = 'data';
    //         const currentData = 'currentData';

    //         const onDeleteButtonClick = getOnDeleteButtonClick(
    //           { onHide, onDelete }, data, currentData,
    //         );
    //         expect(onDeleteButtonClick)
    //           .toEqual(expect.any(Function));

    //         const event = { event: { stopPropagation: jest.fn() } };
    //         onDeleteButtonClick(event);

    //         expect(onHide)
    //           .toHaveBeenCalledTimes(1);
    //         expect(onDelete)
    //           .toHaveBeenCalledTimes(1);
    //         expect(onDelete)
    //           .toHaveBeenCalledWith(data, currentData);
    //       });
    //     });
  });
});
