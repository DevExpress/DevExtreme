import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { ReducedIconTooltip, ReducedIconTooltipProps, viewFunction } from '../layout';
import * as utils from '../../utils';

jest.mock('../../../../overlays/tooltip', () => ({
  Tooltip: (viewModel) => (<div className="tooltip-mock" {...viewModel} />),
}));

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getReducedIconTooltipText: jest.fn((value) => `test ${value}`),
}));

describe('Reduced icon tooltip', () => {
  describe('Render', () => {
    const render = (viewModel = {} as any): ShallowWrapper => shallow(
      viewFunction({
        ...viewModel,
        props: {
          ...viewModel.props,
        },
      }),
    );

    it('should have correct render', () => {
      const layout = render({
        text: 'some text',
        props: {
          visible: true,
          target: 'some target',
        },
      });

      expect(layout.hasClass('tooltip-mock'))
        .toBe(true);

      expect(layout.props())
        .toMatchObject({
          visible: true,
          target: 'some target',
          wrapperAttr: {
            class: 'dx-scheduler-reduced-icon-tooltip',
          },
        });

      const content = layout.childAt(0);
      expect(content.text())
        .toEqual('some text');
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('text', () => {
        afterEach(jest.clearAllMocks);

        [
          'some date',
          undefined,
          new Date(2021, 11, 22, 13, 38),
        ].forEach((endDate) => {
          it(`should innvoke getReducedIconTooltipText endDate=${endDate?.toString()}`, () => {
            const getReducedIconTooltipText = jest.spyOn(utils, 'getReducedIconTooltipText');
            const tooltip = new ReducedIconTooltip({
              ...new ReducedIconTooltipProps(),
              endDate,
            } as any);

            expect(tooltip.text)
              .toBe(`test ${endDate}`);

            expect(getReducedIconTooltipText)
              .toBeCalledTimes(1);

            expect(getReducedIconTooltipText)
              .toBeCalledWith(endDate);
          });
        });
      });
    });
  });
});
