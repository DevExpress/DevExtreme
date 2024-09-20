import each from 'jest-each';

import { validateOptions } from './validation_utils';

describe('Validate utils', () => {
  describe('validateOption function', () => {
    each`
            oldPageSize | oldPageIndex | oldItemCount | expectedPageSize | expectedPageIndex | expectedItemCount | expectedPageCount
            ${5}        | ${1}         | ${1}         | ${5}             | ${1}              | ${1}              | ${1}                 // initial state
            ${10}       | ${500}       | ${100}       | ${10}            | ${10}             | ${100}            | ${10}
            ${3}        | ${2}         | ${2}         | ${3}             | ${1}              | ${2}              | ${1}
            ${3}        | ${2}         | ${2}         | ${3}             | ${1}              | ${2}              | ${1}
            ${3}        | ${-2}        | ${-5}        | ${3}             | ${1}              | ${0}              | ${1}
            ${-5}       | ${10}        | ${20}        | ${1}             | ${10}             | ${20}             | ${20}
            ${5}        | ${1}         | ${100}       | ${5}             | ${1}              | ${100}            | ${20}
    `
      .it('should calculate the correct state', ({
        oldPageSize,
        oldPageIndex,
        oldItemCount,

        expectedPageSize,
        expectedPageIndex,
        expectedItemCount,
        expectedPageCount,
      }) => {
        const result = validateOptions(oldPageSize, oldPageIndex, oldItemCount);
        const {
          pageSize,
          pageIndex,
          totalCount,
          pageCount,
        } = result;

        expect(pageSize).toEqual(expectedPageSize);
        expect(pageIndex).toEqual(expectedPageIndex);
        expect(totalCount).toEqual(expectedItemCount);
        expect(pageCount).toEqual(expectedPageCount);
      });
  });
});
