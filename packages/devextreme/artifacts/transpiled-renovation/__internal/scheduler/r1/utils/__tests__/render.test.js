"use strict";

var _render = require("../render");
describe('render utils tests', () => {
  describe('addHeightToStyle', () => {
    it('should return an empty object if height is undefined', () => {
      expect((0, _render.addHeightToStyle)(undefined)).toEqual({});
    });
    it('should return ucorrect style if height is provided', () => {
      expect((0, _render.addHeightToStyle)(500)).toEqual({
        height: '500px'
      });
    });
    it('should spread styles', () => {
      expect((0, _render.addHeightToStyle)(500, {
        width: '300px'
      })).toEqual({
        height: '500px',
        width: '300px'
      });
    });
    it('should spread styles when height is defined in restAttributes', () => {
      expect((0, _render.addHeightToStyle)(500, {
        width: '300px',
        height: '400px'
      })).toEqual({
        height: '500px',
        width: '300px'
      });
    });
  });
  describe('addToStyles', () => {
    it('should return correct result', () => {
      expect((0, _render.addToStyles)([{
        attr: 'someAttr',
        value: 'someValue'
      }, {
        attr: 'someAttr1',
        value: 123
      }])).toEqual({
        someAttr: 'someValue',
        someAttr1: 123
      });
    });
    it('should return correct result if default style is presents', () => {
      expect((0, _render.addToStyles)([{
        attr: 'someAttr',
        value: 'someValue'
      }, {
        attr: 'someAttr1',
        value: 123
      }], {
        width: '600px'
      })).toEqual({
        someAttr: 'someValue',
        someAttr1: 123,
        width: '600px'
      });
    });
  });
  describe('addWidthToStyle', () => {
    it('should return an empty obbject if width is undefined', () => {
      expect((0, _render.addWidthToStyle)(undefined)).toEqual({});
    });
    it('should return ucorrect style if width is provided', () => {
      expect((0, _render.addWidthToStyle)(500)).toEqual({
        width: '500px'
      });
    });
    it('should spread styles', () => {
      expect((0, _render.addWidthToStyle)(500, {
        height: '300px'
      })).toEqual({
        height: '300px',
        width: '500px'
      });
    });
    it('should spread styles when width is defined in restAttributes', () => {
      expect((0, _render.addWidthToStyle)(500, {
        width: '300px',
        height: '400px'
      })).toEqual({
        height: '400px',
        width: '500px'
      });
    });
  });
  describe('getGroupCellClasses', () => {
    [true, false].forEach(isFirstGroupCell => {
      [true, false].forEach(isLastGroupCell => {
        ['some-class', undefined].forEach(className => {
          it(`should return correct classes if isFirstGroupCell: ${isFirstGroupCell}, isLastGroupCell: ${isLastGroupCell}, className: ${className}`, () => {
            const result = (0, _render.getGroupCellClasses)(isFirstGroupCell, isLastGroupCell, className).trim();
            const assert = (value, not) => {
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