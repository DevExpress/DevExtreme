import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction, TooltipItemLayout, TooltipItemLayoutProps } from '../item_layout';
import { Marker } from '../marker';
import { TooltipItemContent } from '../item_content';
import { DeleteButton } from '../delete_button';
import { AppointmentViewModel } from '../../types';

describe('Tooltip item', () => {
  describe('Render', () => {
    const render = (viewModel = {} as any): ShallowWrapper => shallow(
      viewFunction({
        ...viewModel,
        props: {
          appointments: [],
          ...viewModel.props,
        },
      }),
    );

    it('it should have correct default render', () => {
      const item = render();
      const markerBody = item.childAt(0);
      const tooltipItemContent = item.childAt(1);
      const deleteButton = item.childAt(2);

      expect(item.is('div')).toBe(true);
      expect(item.hasClass('dx-tooltip-appointment-item')).toBe(true);

      expect(markerBody.is(Marker)).toBe(true);

      expect(tooltipItemContent.is(TooltipItemContent)).toBe(true);

      expect(deleteButton.is(DeleteButton)).toBe(true);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('text', () => {
        it('should return correct value', () => {
          const item = new TooltipItemLayout({
            ...new TooltipItemLayoutProps(),
            item: {
              appointment: {
                text: 'Appointment text',
              },
            } as AppointmentViewModel,
          });

          expect(item.text).toBe('Appointment text');
        });
      });

      describe('dateText', () => {
        it('should return correct value', () => {
          const item = new TooltipItemLayout({
            ...new TooltipItemLayoutProps(),
            item: {
              info: {
                dateText: '1:00 AM - 2:00 AM',
              },
            } as AppointmentViewModel,
          });

          expect(item.dateText).toBe('1:00 AM - 2:00 AM');
        });
      });
    });
  });
});
