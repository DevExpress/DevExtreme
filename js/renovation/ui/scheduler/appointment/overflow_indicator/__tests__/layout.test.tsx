import { shallow, ShallowWrapper } from 'enzyme';
import { Button } from '../../../../button';
import { viewFunction, OverflowIndicator } from '../layout';

describe('OverflowIndicator', () => {
  const defaultViewModel = {
    key: '1-2-10-20',

    isAllDay: false,
    isCompact: true,

    appointment: {
      startDate: new Date('2021-08-05T10:00:00.000Z'),
      endDate: new Date('2021-08-05T12:00:00.000Z'),
      text: 'Some text',
    },

    geometry: {
      left: 1,
      top: 2,
      width: 3,
      height: 4,
    },

    items: {
      data: [{}, {}, {}],
      settings: [{}, {}, {}],
    },
  };

  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(viewFunction({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    }));

    it('it should has correct props', () => {
      const overflowIndicator = render({
        text: 'some-text',
        styles: 'some-styles',
        classes: 'some-class',
      });

      const button = overflowIndicator.instance();

      expect(button)
        .toBeInstanceOf(Button);

      expect(button.props)
        .toMatchObject({
          text: 'some-text',
          style: 'some-styles',
          className: 'some-class',
          type: 'default',
          stylingMode: 'contained',
        });
    });

    it('it should invoke template correctly', () => {
      const template = 'some-template';
      const overflowIndicator = render({
        isCompact: true,
        appointmentCount: 6,
        props: {
          overflowIndicatorTemplate: template,
        },
      });

      const button = overflowIndicator.instance();

      expect(button)
        .toBeInstanceOf(Button);

      const { children } = button.props as any;

      expect(children.type)
        .toBe(template);

      expect(children.props)
        .toEqual({
          isCompact: true,
          appointmentCount: 6,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('appointmentCount', () => {
        it('should return correct count', () => {
          const overflowIndicator = new OverflowIndicator({
            viewModel: defaultViewModel as any,
          });

          expect(overflowIndicator.appointmentCount)
            .toBe(3);
        });
      });

      describe('isCompact', () => {
        [true, false].forEach((isCompact) => {
          it('should get correct isCompact', () => {
            const overflowIndicator = new OverflowIndicator({
              viewModel: {
                ...defaultViewModel as any,
                isCompact,
              },
            });

            expect(overflowIndicator.isCompact)
              .toBe(isCompact);
          });
        });
      });

      describe('styles', () => {
        it('should return correct styles', () => {
          const overflowIndicator = new OverflowIndicator({
            viewModel: defaultViewModel as any,
          });

          expect(overflowIndicator.styles)
            .toEqual({
              left: '1px',
              top: '2px',
              width: '3px',
              height: '4px',
            });
        });
      });

      describe('text', () => {
        [{
          isCompact: true,
          expectedText: '3',
        }, {
          isCompact: false,
          expectedText: '3 more',
        }].forEach(({ isCompact, expectedText }) => {
          it('should return correct text', () => {
            const overflowIndicator = new OverflowIndicator({
              viewModel: {
                ...defaultViewModel as any,
                isCompact,
              },
            });

            expect(overflowIndicator.text)
              .toBe(expectedText);
          });
        });
      });

      describe('classes', () => {
        it('should return correct classes in compact mode', () => {
          const overflowIndicator = new OverflowIndicator({
            viewModel: defaultViewModel as any,
          });

          expect(overflowIndicator.classes)
            .toBe('dx-scheduler-appointment-collector dx-scheduler-appointment-collector-compact');
        });

        it('should return correct classes in not compact mode', () => {
          const overflowIndicator = new OverflowIndicator({
            viewModel: {
              ...defaultViewModel as any,
              isCompact: false,
            },
          });

          expect(overflowIndicator.classes)
            .toBe('dx-scheduler-appointment-collector');
        });
      });
    });
  });
});
