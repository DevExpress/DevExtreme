/* eslint-disable object-curly-newline */
import { describe, expect } from '@jest/globals';
import each from 'jest-each';

import {
  getNextSortOrder,
  sortOrderDelegate,
} from './utils';

describe('getNextSortOrder', () => {
  describe('with pressed ctrl (meta) key', () => {
    each`
            currentOrder | ctrlKey | expectedResult
            ${'asc'}     | ${true} | ${undefined}
            ${'desc'}    | ${true} | ${undefined}
            ${undefined} | ${true} | ${undefined}
    `
      .it('should reset the sort order', ({
        currentOrder,
        ctrlKey,

        expectedResult,
      }) => {
        const result = getNextSortOrder(currentOrder, ctrlKey);
        expect(result).toEqual(expectedResult);
      });
  });
  describe('without pressed ctrl (meta) key', () => {
    each`
            currentOrder | ctrlKey | expectedResult
            ${'asc'}     | ${false} | ${'desc'}
            ${'desc'}    | ${false} | ${'asc'}
            ${undefined} | ${false} | ${'asc'}
    `
      .it('should invert the sort order or return ascending', ({
        currentOrder,
        ctrlKey,

        expectedResult,
      }) => {
        const result = getNextSortOrder(currentOrder, ctrlKey);
        expect(result).toEqual(expectedResult);
      });
  });
});

describe('sortOrderDelegate', () => {
  describe('when sortIndex is not defined for both columns', () => {
    each`
            columnA                                        | columnB                                      | expectedResult
            ${{ visibleIndex: 1, sortIndex: undefined }}   | ${{ visibleIndex: 2, sortIndex: undefined }} | ${-1}
            ${{ visibleIndex: 1, sortIndex: undefined }}   | ${{ visibleIndex: 0, sortIndex: undefined }} | ${1}
            ${{ visibleIndex: 4, sortIndex: undefined }}   | ${{ visibleIndex: 2, sortIndex: undefined }} | ${2}
            ${{ visibleIndex: 3, sortIndex: undefined }}   | ${{ visibleIndex: 5, sortIndex: undefined }} | ${-2}
            ${{ visibleIndex: 4, sortIndex: undefined }}   | ${{ visibleIndex: 4, sortIndex: undefined }} | ${0}
    `
      .it('should take into account visibleIndex', ({
        columnA,
        columnB,

        expectedResult,
      }) => {
        const result = sortOrderDelegate(columnA, columnB);
        expect(result).toEqual(expectedResult);
      });
  });
  describe('when sortIndex is not defined for one of columns', () => {
    each`
            columnA                                        | columnB                                      | expectedResult
            ${{ visibleIndex: 1, sortIndex: undefined }}   | ${{ visibleIndex: 2, sortIndex: 1 }}         | ${1}
            ${{ visibleIndex: 1, sortIndex: 3 }}           | ${{ visibleIndex: 0, sortIndex: undefined }} | ${-1}
            ${{ visibleIndex: 4, sortIndex: 2 }}           | ${{ visibleIndex: 2, sortIndex: undefined }} | ${-1}
            ${{ visibleIndex: 3, sortIndex: undefined }}   | ${{ visibleIndex: 5, sortIndex: 0 }}         | ${1}
    `
      .it('should give a priority to column with undefined sortIndex', ({
        columnA,
        columnB,

        expectedResult,
      }) => {
        const result = sortOrderDelegate(columnA, columnB);
        expect(result).toEqual(expectedResult);
      });
  });
  describe('when sortIndex is defined for both columns', () => {
    each`
            columnA                                | columnB                              | expectedResult
            ${{ visibleIndex: 1, sortIndex: 0 }}   | ${{ visibleIndex: 2, sortIndex: 1 }} | ${-1}
            ${{ visibleIndex: 1, sortIndex: 3 }}   | ${{ visibleIndex: 0, sortIndex: 4 }} | ${-1}
            ${{ visibleIndex: 4, sortIndex: 2 }}   | ${{ visibleIndex: 2, sortIndex: 0 }} | ${2}
            ${{ visibleIndex: 3, sortIndex: 3 }}   | ${{ visibleIndex: 5, sortIndex: 1 }} | ${2}
    `
      .it('should give a priority to column with a greater sortIndex', ({
        columnA,
        columnB,

        expectedResult,
      }) => {
        const result = sortOrderDelegate(columnA, columnB);
        expect(result).toEqual(expectedResult);
      });
  });
});
