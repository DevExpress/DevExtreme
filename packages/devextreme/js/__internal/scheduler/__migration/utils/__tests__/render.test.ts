import {
  addHeightToStyle,
  addToStyles,
  addWidthToStyle,
  getGroupCellClasses,
} from '../render';

describe('render utils tests', () => {
  describe('addHeightToStyle', () => {
    it('should return an empty object if height is undefined', () => {
      expect(addHeightToStyle(undefined))
        .toEqual({});
    });

    it('should return ucorrect style if height is provided', () => {
      expect(addHeightToStyle(500))
        .toEqual({
          height: '500px',
        });
    });

    it('should spread styles', () => {
      expect(addHeightToStyle(500, { width: '300px' }))
        .toEqual({
          height: '500px',
          width: '300px',
        });
    });

    it('should spread styles when height is defined in restAttributes', () => {
      expect(addHeightToStyle(500, { width: '300px', height: '400px' }))
        .toEqual({
          height: '500px',
          width: '300px',
        });
    });
  });

  describe('addToStyles', () => {
    it('should return correct result', () => {
      expect(addToStyles([{
        attr: 'someAttr',
        value: 'someValue',
      }, {
        attr: 'someAttr1',
        value: 123,
      }]))
        .toEqual({ someAttr: 'someValue', someAttr1: 123 });
    });

    it('should return correct result if default style is presents', () => {
      expect(addToStyles([{
        attr: 'someAttr',
        value: 'someValue',
      }, {
        attr: 'someAttr1',
        value: 123,
      }], { width: '600px' }))
        .toEqual({
          someAttr: 'someValue',
          someAttr1: 123,
          width: '600px',
        });
    });
  });

  describe('addWidthToStyle', () => {
    it('should return an empty obbject if width is undefined', () => {
      expect(addWidthToStyle(undefined))
        .toEqual({});
    });

    it('should return ucorrect style if width is provided', () => {
      expect(addWidthToStyle(500))
        .toEqual({
          width: '500px',
        });
    });

    it('should spread styles', () => {
      expect(addWidthToStyle(500, { height: '300px' }))
        .toEqual({
          height: '300px',
          width: '500px',
        });
    });

    it('should spread styles when width is defined in restAttributes', () => {
      expect(addWidthToStyle(500, { width: '300px', height: '400px' }))
        .toEqual({
          height: '400px',
          width: '500px',
        });
    });
  });

  describe('getGroupCellClasses', () => {
    [true, false].forEach((isFirstGroupCell) => {
      [true, false].forEach((isLastGroupCell) => {
        ['some-class', undefined].forEach((className) => {
          it(`should return correct classes if isFirstGroupCell: ${isFirstGroupCell}, isLastGroupCell: ${isLastGroupCell}, className: ${className}`, () => {
            const result = getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className).trim();
            const assert = (value: string, not: boolean): void => {
              if (not) {
                expect(result).not.toContain(value);
              } else {
                expect(result).toContain(value);
              }
            };

            assert('dx-scheduler-first-group-cell', !isFirstGroupCell);
            assert('dx-scheduler-last-group-cell', !isLastGroupCell);
            assert('some-class', !className);
          });
        });
      });
    });
  });
});
