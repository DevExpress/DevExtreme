import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import {
  viewFunction as CellView, CellBase,
} from '../cell';
import { getGroupCellClasses } from '../../utils';

jest.mock('../../utils', () => ({
  ...require.requireActual('../../utils'),
  getGroupCellClasses: jest.fn(),
}));

describe('DateTableCellBase', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(CellView({
      ...viewModel,
      props: { ...viewModel.props },
    }));

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(cell.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should combine `className` with predefined classes', () => {
      const cell = render({ classes: 'some-classes' });

      expect(cell.hasClass('some-classes'))
        .toBe(true);
    });

    it('should render children', () => {
      const cell = render({ props: { children: <div className="child-class" /> } });

      expect(cell.find('.child-class').exists())
        .toBe(true);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      afterEach(() => jest.resetAllMocks());

      [true, false].forEach((isFirstCell) => {
        [true, false].forEach((isLastCell) => {
          ['some-class', undefined].forEach((className) => {
            it(`should call 'getGroupCellClasses' correctly if isFirstCell: ${isFirstCell}, isLastCell: ${isLastCell}, className: ${className}`, () => {
              const cellBase = new CellBase({
                isFirstCell,
                isLastCell,
                className,
              });

              expect(cellBase.classes)
                .toEqual(undefined);

              expect(getGroupCellClasses)
                .toHaveBeenCalledTimes(1);

              expect(getGroupCellClasses)
                .toHaveBeenNthCalledWith(
                  1,
                  isFirstCell,
                  isLastCell,
                  className,
                );
            });
          });
        });
      });
    });
  });
});
