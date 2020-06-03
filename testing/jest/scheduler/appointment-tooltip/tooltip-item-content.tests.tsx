import { h } from 'preact';
import { mount, ReactWrapper } from 'enzyme';
import { JSXInternal } from 'preact/src/jsx';
import TooltipItemContent from '../../../../js/renovation/scheduler/appointment-tooltip/tooltip-item-content.p';
import {
  TooltipItemContentProps, getCurrentData, getOnDeleteButtonClick,
} from '../../../../js/renovation/scheduler/appointment-tooltip/tooltip-item-content';
import DeleteButton from '../../../../js/renovation/scheduler/appointment-tooltip/delete-button.p';
import Marker from '../../../../js/renovation/scheduler/appointment-tooltip/marker.p';

jest.mock('../../../../js/renovation/scheduler/appointment-tooltip/delete-button.p', () => () => null);
jest.mock('../../../../js/renovation/scheduler/appointment-tooltip/marker.p', () => () => null);

describe('DeleteButton', () => {
  describe('View', () => {
    const render = (props = {}): ReactWrapper => {
      window.h = h;
      return mount(
        <TooltipItemContent {...(new TooltipItemContentProps())} {...props} />,
      ).childAt(0);
    };
    const renderRoot = (props = {}): ReactWrapper => {
      window.h = h;
      return mount(
        <TooltipItemContent {...(new TooltipItemContentProps())} {...props} />,
      );
    };
    const defaultProps: TooltipItemContentProps = {
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
    };

    it('should render appointment item with marker, content and delete button', () => {
      const tree = render(defaultProps);

      expect(tree.is('.dx-tooltip-appointment-item'))
        .toBe(true);
      expect(tree.children())
        .toHaveLength(3);

      expect(tree.childAt(0).type())
        .toBe(Marker);
      expect(tree.childAt(1).is('.dx-tooltip-appointment-item-content'))
        .toBe(true);
      expect(tree.childAt(2).type())
        .toBe(DeleteButton);
    });

    it('should pass correct props to Marker', () => {
      const marker = render(defaultProps).find(Marker);

      expect(marker.props())
        .toMatchObject({
          color: defaultProps.item.color,
        });
    });

    it('should process delete button click correctly', () => {
      const marker = render(defaultProps).find(DeleteButton);

      expect(marker.props())
        .toMatchObject({
          onClick: expect.any(Function),
        });

      const stopPropagation = jest.fn();
      const event = { event: { stopPropagation } };
      marker.prop('onClick')(event);

      expect(defaultProps.onHide)
        .toHaveBeenCalledTimes(1);
      expect(defaultProps.onDelete)
        .toHaveBeenCalledTimes(1);
      expect(defaultProps.onDelete)
        .toHaveBeenCalledWith(defaultProps.item.data, defaultProps.item.currentData);
      expect(stopPropagation)
        .toHaveBeenCalledTimes(1);
    });

    it('should render item content corretly', () => {
      const content = render(defaultProps).find('.dx-tooltip-appointment-item-content');

      expect(content.children())
        .toHaveLength(2);

      const subject = content.childAt(0);
      expect(subject.is('.dx-tooltip-appointment-item-content-subject'))
        .toBe(true);
      expect(subject.children())
        .toHaveLength(1);
      expect(subject.childAt(0).text())
        .toBe(defaultProps.getTextAndFormatDate().text);

      const date = content.childAt(1);
      expect(date.is('.dx-tooltip-appointment-item-content-date'))
        .toBe(true);
      expect(date.children())
        .toHaveLength(1);
      expect(date.childAt(0).text())
        .toBe(defaultProps.getTextAndFormatDate().formatDate);
    });

    it('should not render DeleteButton if showDeleteButton is false', () => {
      const tree = render({
        ...defaultProps,
        showDeleteButton: false,
      });

      expect(tree.find(DeleteButton).exists())
        .toBe(false);
    });

    describe('Template', () => {
      const template = ({ model, index }): JSXInternal.Element => (
        <div className="custom-content">
          <div className="appointment-data">{model.appointmentData.text}</div>
          <div className="appointment-targeted-data">{model.targetedAppointmentData.text}</div>
          <div className="index">{index}</div>
        </div>
      );

      it('should render template if it is provided', () => {
        const tree = render({
          ...defaultProps,
          itemContent: template,
        });

        expect(tree.find('.custom-content').exists())
          .toBe(true);
      });

      it('should rpass correct props into the template', () => {
        const tree = render({
          ...defaultProps,
          itemContent: template,
        });

        expect(tree.find('.appointment-data').text())
          .toBe('data');
        expect(tree.find('.appointment-targeted-data').text())
          .toBe('currentData');
        expect(tree.find('.index').text())
          .toBe('0');
      });

      it('should rerender template in runtime', () => {
        const tree = renderRoot(defaultProps);

        expect(tree.find(template).exists())
          .toBe(false);

        tree.setProps({ itemContent: template });
        expect(tree.find(template).exists())
          .toBe(true);

        tree.setProps({ itemContent: undefined });
        expect(tree.find(template).exists())
          .toBe(false);
      });

      it('should change template properties in runtime', () => {
        const tree = renderRoot({
          ...defaultProps,
          itemContent: template,
        });

        expect(tree.find('.appointment-data').text())
          .toBe('data');
        expect(tree.find('.appointment-targeted-data').text())
          .toBe('currentData');
        expect(tree.find('.index').text())
          .toBe('0');

        tree.setProps({
          item: {
            data: { text: 'newData' },
            currentData: { text: 'newCurrentData' },
          },
          index: 2,
        });

        expect(tree.find('.appointment-data').text())
          .toBe('newData');
        expect(tree.find('.appointment-targeted-data').text())
          .toBe('newCurrentData');
        expect(tree.find('.index').text())
          .toBe('2');
      });
    });
  });

  describe('Getters', () => {
    describe('getCurentData', () => {
      it('should return data if other are undefiend', () => {
        const appointmentItem = { data: { text: 'data' } };
        expect(getCurrentData(appointmentItem))
          .toBe(appointmentItem.data);
      });

      it('should return currentData if settings are undefined', () => {
        const appointmentItem = {
          currentData: { text: 'currentData' },
          data: { text: 'data' },
        };

        expect(getCurrentData(appointmentItem))
          .toBe(appointmentItem.currentData);
      });

      it('should return currentData if settings are defined but targetedAppointmentData is undefined', () => {
        const appointmentItem = {
          currentData: { text: 'currentData' },
          data: { text: 'data' },
          settings: {},
        };

        expect(getCurrentData(appointmentItem))
          .toBe(appointmentItem.currentData);
      });

      it('should return targetedAppointmentData', () => {
        const appointmentItem = {
          currentData: { text: 'currentData' },
          data: { text: 'data' },
          settings: { targetedAppointmentData: { text: 'targetedAppointmentData' } },
        };

        expect(getCurrentData(appointmentItem))
          .toBe(appointmentItem.settings.targetedAppointmentData);
      });
    });

    describe('getOnDeleteButtonClick', () => {
      it('should return data if other are undefiend', () => {
        const onHide = jest.fn();
        const onDelete = jest.fn();
        const data = 'data';
        const currentData = 'currentData';

        const onDeleteButtonClick = getOnDeleteButtonClick(
          { onHide, onDelete }, data, currentData,
        );
        expect(onDeleteButtonClick)
          .toEqual(expect.any(Function));

        const event = { event: { stopPropagation: jest.fn() } };
        onDeleteButtonClick(event);

        expect(onHide)
          .toHaveBeenCalledTimes(1);
        expect(onDelete)
          .toHaveBeenCalledTimes(1);
        expect(onDelete)
          .toHaveBeenCalledWith(data, currentData);
      });
    });
  });
});
