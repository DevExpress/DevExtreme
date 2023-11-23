import each from 'jest-each';

import {
  divisibleBy,
  greaterThan,
  inRange,
  isInteger,
  lessThan,
} from './validation_functions';

describe('isInteger', () => {
  each`
    value   | expectedResult
    ${1}    | ${true}
    ${1.5}  | ${false}
    ${-1}   | ${true}
    ${-1.5} | ${false}
    ${0}    | ${true}
  `.it('should detect integer correctly', ({ value, expectedResult }) => {
    const result = isInteger(value);
    expect(result).toEqual(expectedResult);
  });
});

describe('greaterThat', () => {
  each`
    value   | min     | strict    | expectedResult
    ${10}   | ${5}    | ${true}   | ${true}
    ${10}   | ${15}   | ${true}   | ${false}
    ${10}   | ${10}   | ${true}   | ${false}
    ${0}    | ${0}    | ${true}   | ${false}
    ${-10}  | ${-10}  | ${true}   | ${false}
    ${-10}  | ${-5}   | ${true}   | ${false}
    ${-10}  | ${-15}  | ${true}   | ${true}
    ${10}   | ${5}    | ${false}  | ${true}
    ${10}   | ${15}   | ${false}  | ${false}
    ${10}   | ${10}   | ${false}  | ${true}
    ${0}    | ${0}    | ${false}  | ${true}
    ${-10}  | ${-10}  | ${false}  | ${true}
    ${-10}  | ${-5}   | ${false}  | ${false}
    ${-10}  | ${-15}  | ${false}  | ${true}
  `.it('should compare numbers correctly', ({
    value,
    min,
    strict,
    expectedResult,
  }) => {
    const result = greaterThan(value, min, strict);
    expect(result).toEqual(expectedResult);
  });
});

describe('lessThat', () => {
  each`
    value   | min     | strict    | expectedResult
    ${10}   | ${5}    | ${true}   | ${false}
    ${10}   | ${15}   | ${true}   | ${true}
    ${10}   | ${10}   | ${true}   | ${false}
    ${0}    | ${0}    | ${true}   | ${false}
    ${-10}  | ${-10}  | ${true}   | ${false}
    ${-10}  | ${-5}   | ${true}   | ${true}
    ${-10}  | ${-15}  | ${true}   | ${false}
    ${10}   | ${5}    | ${false}  | ${false}
    ${10}   | ${15}   | ${false}  | ${true}
    ${10}   | ${10}   | ${false}  | ${true}
    ${0}    | ${0}    | ${false}  | ${true}
    ${-10}  | ${-10}  | ${false}  | ${true}
    ${-10}  | ${-5}   | ${false}  | ${true}
    ${-10}  | ${-15}  | ${false}  | ${false}
  `.it('should compare numbers correctly', ({
    value,
    min,
    strict,
    expectedResult,
  }) => {
    const result = lessThan(value, min, strict);
    expect(result).toEqual(expectedResult);
  });
});

describe('inRange', () => {
  each`
    value | range         | expectedResult
    ${5}  | ${[-10, 10]}  | ${true}
    ${5}  | ${[5, 10]}    | ${true}
    ${5}  | ${[-10, 5]}   | ${true}
    ${5}  | ${[-10, 4]}   | ${false}
    ${5}  | ${[6, 10]}    | ${false}
    ${-5} | ${[-10, 10]}  | ${true}
    ${-5} | ${[-5, 0]}    | ${true}
    ${-5} | ${[-10, -5]}  | ${true}
    ${-5} | ${[-10, -6]}  | ${false}
    ${-5} | ${[-4, 0]}    | ${false}
  `.it('should determine interval correctly', ({
    value,
    range,
    expectedResult,
  }) => {
    const result = inRange(value, range);
    expect(result).toEqual(expectedResult);
  });
});

describe('divisibleBy', () => {
  each`
    value  | divider  | expectedResult
    ${4}   | ${2}     | ${true}
    ${5}   | ${2}     | ${false}
    ${0}   | ${111}   | ${true}
    ${4}   | ${-2}     | ${true}
    ${5}   | ${-2}     | ${false}
    ${0}   | ${-111}   | ${true}
    ${-4}  | ${2}     | ${true}
    ${-5}  | ${2}     | ${false}
    ${4}   | ${-2}     | ${true}
    ${5}   | ${-2}     | ${false}
  `.it('should determine divisible by correctly', ({
    value,
    divider,
    expectedResult,
  }) => {
    const result = divisibleBy(value, divider);
    expect(result).toEqual(expectedResult);
  });
});
