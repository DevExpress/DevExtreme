import { h } from 'preact';
import { shallow } from 'enzyme';
import { Fragment } from 'devextreme-generator/component_declaration/common';
import { dxSchedulerAppointment } from '../../../../js/ui/scheduler';
import TooltipItemLayout, {
  viewFunction as TooltipItemLayoutView,
  TooltipItemLayoutProps,
} from '../../../../js/renovation/scheduler/appointment-tooltip/item-layout';
import DeleteButton from '../../../../js/renovation/button';
import Marker from '../../../../js/renovation/scheduler/appointment-tooltip/marker';
import TooltipItemContent from '../../../../js/renovation/scheduler/appointment-tooltip/item-content';
import getCurrentAppointment from '../../../../js/renovation/scheduler/appointment-tooltip/utils/get-current-appointment';

jest.mock('../../../../js/renovation/button', () => () => null);
jest.mock('../../../../js/renovation/scheduler/appointment-tooltip/marker', () => () => null);
jest.mock('../../../../js/renovation/scheduler/appointment-tooltip/item-content', () => () => null);
jest.mock('../../../../js/renovation/scheduler/appointment-tooltip/utils/get-current-appointment', () => jest.fn(() => ({
  text: 'currentAppointment',
})));

describe('TooltipItemLayout', () => {
  describe('Render', () => {
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
      },
      index: 0,
      singleAppointment: {
        text: 'singleAppointmentData',
      },
    };
    const defaultViewModel: Partial<TooltipItemLayout> = {
      formattedContent: { text: 'text', formatDate: 'formattedDate' },
    };

    // Have to use JSX because Fragment causes errors
    const render = (viewModel) => shallow(
      <TooltipItemLayoutView
        {...defaultViewModel}
        {...viewModel}
        props={{ ...defaultProps, ...viewModel.props }}
      /> as any,
    );

    it('should combine `className` with predefined classes', () => {
      const tooltipItemLayout = render({ props: { className: 'custom-class' } }).childAt(0);

      expect(tooltipItemLayout.hasClass('dx-tooltip-appointment-item'))
        .toBe(true);
      expect(tooltipItemLayout.hasClass('custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const tooltipItemLayout = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(tooltipItemLayout.childAt(0).prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render appointment item with marker, content and delete button', () => {
      const tooltipItemLayout = render({});

      expect(tooltipItemLayout.type())
        .toBe(Fragment);
      expect(tooltipItemLayout.children())
        .toHaveLength(1);

      const layout = tooltipItemLayout.childAt(0);
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
      const marker = render({}).find(Marker);

      expect(marker.props())
        .toMatchObject({
          color: defaultProps.item!.color,
        });
    });

    it('should pass correct props to DeleteButton', () => {
      const onDeleteButtonClick = jest.fn();
      const deleteButton = render({ onDeleteButtonClick }).find(DeleteButton);

      expect(deleteButton.props())
        .toMatchObject({
          onClick: onDeleteButtonClick,
          icon: 'trash',
          stylingMode: 'text',
        });
    });

    it('should pass correct props to item content', () => {
      const content = render({
        currentAppointment: defaultProps.item?.currentData,
      }).find(TooltipItemContent);

      expect(content.props())
        .toMatchObject({
          formattedDate: 'formattedDate',
          text: 'text',
        });
    });

    it('should not render DeleteButton if showDeleteButton is false', () => {
      const tooltipItemLayout = render({ props: { showDeleteButton: false } });

      expect(tooltipItemLayout.find(DeleteButton).exists())
        .toBe(false);
    });

    describe('Template', () => {
      const currentAppointment: dxSchedulerAppointment = { text: 'currentAppointment' };
      const template = () => null;
      const renderWithTemplate = () => shallow(
        <TooltipItemLayoutView
          props={{ ...defaultProps, itemContentTemplate: template }}
          {...defaultViewModel}
          currentAppointment={currentAppointment}
        />,
      );

      it('should render template if it is provided', () => {
        const tooltipItemLayout = renderWithTemplate();

        expect(tooltipItemLayout.find(template).exists())
          .toBe(true);
      });

      it('should rpass correct props into the template', () => {
        const tooltipItemLayout = renderWithTemplate();

        expect(tooltipItemLayout.find(template).props())
          .toEqual({
            model: {
              appointmentData: defaultProps.item?.data,
              targetedAppointmentData: currentAppointment,
            },
            index: 0,
            children: [],
          });
      });

      it('should rerender template in runtime', () => {
        const tooltipItemLayout = shallow(
          <TooltipItemLayoutView
            props={{ ...defaultProps }}
            {...defaultViewModel}
          />,
        );

        expect(tooltipItemLayout.find(template).exists())
          .toBe(false);

        tooltipItemLayout.setProps({
          props: {
            ...defaultProps,
            itemContentTemplate: template,
          },
        });
        expect(tooltipItemLayout.find(template).exists())
          .toBe(true);

        tooltipItemLayout.setProps({
          props: {
            ...defaultProps,
            itemContentTemplate: undefined,
          },
        });
        expect(tooltipItemLayout.find(template).exists())
          .toBe(false);
      });

      it('should change template properties in runtime', () => {
        const tooltipItemLayout = renderWithTemplate();

        expect(tooltipItemLayout.find(template).props())
          .toEqual({
            model: {
              appointmentData: defaultProps.item?.data,
              targetedAppointmentData: currentAppointment,
            },
            index: 0,
            children: [],
          });

        const nextItem = {
          data: { text: 'nextData' },
          currentData: { text: 'nextCurrentData' },
        };
        const nextIndex = 2;
        tooltipItemLayout.setProps({
          props: {
            ...defaultProps,
            item: nextItem,
            index: nextIndex,
            itemContentTemplate: template,
          },
          currentAppointment: nextItem.currentData,
        });

        expect(tooltipItemLayout.find(template).props())
          .toEqual({
            model: {
              appointmentData: nextItem.data,
              targetedAppointmentData: nextItem.currentData,
            },
            index: nextIndex,
            children: [],
          });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('currentAppointment', () => {
        it('should call getCurrentData with correct parameters', () => {
          const appointmentItem = { data: { text: 'data' } };
          const tooltipItemLayout = new TooltipItemLayout({ item: appointmentItem });

          expect(tooltipItemLayout.currentAppointment)
            .toEqual({ text: 'currentAppointment' });
          expect(getCurrentAppointment)
            .toHaveBeenCalledWith(appointmentItem);
        });
      });

      describe('onDeleteButtonClick', () => {
        it('should create onDeleteButtonClick correctly', () => {
          const onHide = jest.fn();
          const onDelete = jest.fn();
          const stopPropagation = jest.fn();
          const appointmentItem = {
            data: { text: 'data' },
            currentData: { text: 'currentData' },
          };
          const singleAppointment = { text: 'singleAppointmentData' };

          const tooltipItemLayout = new TooltipItemLayout({
            item: appointmentItem, onHide, onDelete, singleAppointment,
          });
          const { onDeleteButtonClick } = tooltipItemLayout;

          expect(onDeleteButtonClick)
            .toEqual(expect.any(Function));

          const event = { event: { stopPropagation } };
          onDeleteButtonClick(event);

          expect(onHide)
            .toHaveBeenCalledTimes(1);
          expect(onDelete)
            .toHaveBeenCalledTimes(1);
          expect(onDelete)
            .toHaveBeenCalledWith(appointmentItem.data, singleAppointment);
          expect(stopPropagation)
            .toHaveBeenCalledTimes(1);
        });
      });

      describe('formattedContent', () => {
        it('should return formatted content and call getTextAndFormatDate', () => {
          const getTextAndFormatDate = jest.fn(() => ({
            text: 'text', formatDate: 'formatDate',
          }));
          const appointmentItem = {
            data: { text: 'text' },
            currentData: { text: 'currentText' },
          };

          const tooltipItemLayout = new TooltipItemLayout({
            item: appointmentItem, getTextAndFormatDate,
          });
          const { formattedContent } = tooltipItemLayout;

          expect(formattedContent)
            .toEqual({
              text: 'text',
              formatDate: 'formatDate',
            });
          expect(getTextAndFormatDate)
            .toHaveBeenCalledWith(appointmentItem.data, { text: 'currentAppointment' });
        });
      });
    });
  });
});
