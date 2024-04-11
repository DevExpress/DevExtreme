import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import {
  viewFunction as CellView, CellBase,
} from '../cell';
import { renderUtils } from '../../../../../../__internal/scheduler/r1/utils/index';

jest.mock('../../../../../../__internal/scheduler/r1/utils/index', () => ({
  ...jest.requireActual('../../../../../../__internal/scheduler/r1/utils/index'),
  renderUtils: {
    getGroupCellClasses: jest.fn(),
  },
}));

describe('DateTableCellBase', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(CellView({
      ...viewModel,
      props: { ...viewModel.props },
    }));

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

    it('should pass aria-label to the root', () => {
      const cell = render({
        props: {
          ariaLabel: 'Custom aria label',
        },
      });

      expect(cell.prop('aria-label'))
        .toBe('Custom aria label');
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      afterEach(() => jest.resetAllMocks());

      [true, false].forEach((isFirstGroupCell) => {
        [true, false].forEach((isLastGroupCell) => {
          ['some-class', undefined].forEach((className) => {
            it(`should call 'getGroupCellClasses' correctly if isFirstGroupCell:
              ${isFirstGroupCell}, isLastGroupCell: ${isLastGroupCell}, className: ${className}`, () => {
              const cellBase = new CellBase({
                isFirstGroupCell,
                isLastGroupCell,
                className,
              });

              expect(cellBase.classes)
                .toEqual(undefined);

              expect(renderUtils.getGroupCellClasses)
                .toHaveBeenCalledTimes(1);

              expect(renderUtils.getGroupCellClasses)
                .toHaveBeenCalledWith(
                  isFirstGroupCell,
                  isLastGroupCell,
                  className,
                );
            });
          });
        });
      });
    });
  });
});
