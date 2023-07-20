import { shallow, ShallowWrapper } from 'enzyme';
import { Button } from '../../../../button';
import { viewFunction, OverflowIndicator } from '../layout';
import { getIndicatorColor } from '../utils';

const colorPromise = Promise.resolve('#aabbcc');
const rejectedColorPromise = Promise.resolve('');
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getIndicatorColor: jest.fn(({ resources }) => (resources
    ? colorPromise
    : rejectedColorPromise)),
}));

describe('OverflowIndicator', () => {
  const defaultViewModel = {
    key: '1-2-10-20',

    isAllDay: false,
    isCompact: true,
    groupIndex: 0,

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
      settings: [{
        appointment: {
          startDate: new Date('2021-08-05T10:00:00.000Z'),
          endDate: new Date('2021-08-05T12:00:00.000Z'),
          text: 'Some text',
        },
      },
      {},
      {},
      ],
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
          text: '',
          style: 'some-styles',
          className: 'some-class',
          type: 'default',
          stylingMode: 'contained',
        });
    });

    it('it should has correct render', () => {
      const overflowIndicator = render({
        text: 'some-text',
        styles: 'some-styles',
        classes: 'some-class',
      });

      const button = overflowIndicator.childAt(0);

      expect(button.children)
        .toHaveLength(1);

      expect(button.childAt(0).type())
        .toBe('span');

      expect(button.childAt(0).props())
        .toMatchObject({
          children: 'some-text',
        });
    });

    it('it should invoke template correctly', () => {
      const template = 'some-template';
      const overflowIndicator = render({
        data: {
          isCompact: true,
          appointmentCount: 6,
        },
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
          data: {
            isCompact: true,
            appointmentCount: 6,
          },
        });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('updateStylesEffect', () => {
        it('should call getIndicatorColor with correct arguments', () => {
          const appointmentsContextValue = {
            resources: [],
            resourceLoaderMap: [] as any,
            dataAccessors: {
              resources: [],
            },
            loadedResources: [],
          } as any;
          const viewModel = {
            ...defaultViewModel,
            groupIndex: 123,
          };
          const overflowIndicator = new OverflowIndicator({
            viewModel: {
              ...defaultViewModel,
              groupIndex: 123,
            },
            groups: ['someGroups'],
          } as any);

          overflowIndicator.appointmentsContextValue = appointmentsContextValue;

          overflowIndicator.updateStylesEffect();

          expect(getIndicatorColor)
            .toReturnWith(colorPromise);

          expect(getIndicatorColor)
            .toBeCalledWith(
              appointmentsContextValue,
              viewModel,
              ['someGroups'],
            );

          return colorPromise.then(() => {
            expect(overflowIndicator.color)
              .toBe('#aabbcc');
          });
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('appointmentCount', () => {
        it('should return correct count', () => {
          const overflowIndicator = new OverflowIndicator({
            viewModel: defaultViewModel as any,
            groups: [],
          });

          expect(overflowIndicator.data.appointmentCount)
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
              groups: [],
            });

            expect(overflowIndicator.data.isCompact)
              .toBe(isCompact);
          });
        });
      });

      describe('appointmentStyles', () => {
        it('should return correct values', () => {
          const appointment = new OverflowIndicator({
            viewModel: defaultViewModel,
          } as any);

          expect(appointment.appointmentStyles)
            .toEqual({
              left: '1px',
              top: '2px',
              width: '3px',
              height: '4px',
              boxShadow: 'inset 3px 0 0 0 rgba(0, 0, 0, 0.3)',
            });
        });
      });

      describe('styles', () => {
        it('should return correct value without color', () => {
          const overflowIndicator = new OverflowIndicator({
            viewModel: defaultViewModel as any,
            groups: [],
          });

          expect(overflowIndicator.styles)
            .toEqual({
              left: '1px',
              top: '2px',
              width: '3px',
              height: '4px',
              boxShadow: 'inset 3px 0 0 0 rgba(0, 0, 0, 0.3)',
            });
        });

        it('should return correct value with color', () => {
          const overflowIndicator = new OverflowIndicator({
            viewModel: defaultViewModel as any,
            groups: [],
          });

          overflowIndicator.color = '#aabbcc';

          expect(overflowIndicator.styles)
            .toEqual({
              left: '1px',
              top: '2px',
              width: '3px',
              height: '4px',
              boxShadow: 'inset 3px 0 0 0 rgba(0, 0, 0, 0.3)',
              backgroundColor: '#aabbcc',
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
              groups: [],
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
            groups: [],
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
            groups: [],
          });

          expect(overflowIndicator.classes)
            .toBe('dx-scheduler-appointment-collector');
        });
      });
    });
  });
});
