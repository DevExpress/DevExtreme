import { convertTypes } from './converter';

it('deduplicates', () => {
  const types = [
    { type: 'Array', isCustomType: false, acceptableValues: [] },
    { type: 'Boolean', isCustomType: false, acceptableValues: [] },
    { type: 'Function', isCustomType: false, acceptableValues: [] },
    { type: 'Boolean', isCustomType: false, acceptableValues: [] },
    { type: 'Number', isCustomType: false, acceptableValues: [] },
    { type: 'Object', isCustomType: false, acceptableValues: [] },
    { type: 'String', isCustomType: false, acceptableValues: [] },
  ];

  const expected = [
    'array',
    'bool',
    'func',
    'number',
    'object',
    'string',
  ];

  expect(convertTypes(types)).toEqual(expected);
});

it('returns undefiend if finds Any', () => {
  expect(convertTypes([{ type: 'Any', isCustomType: false, acceptableValues: [] }])).toBeUndefined();
  expect(convertTypes([
    { type: 'String', isCustomType: false, acceptableValues: [] },
    { type: 'Any', isCustomType: false, acceptableValues: [] },
    { type: 'Number', isCustomType: false, acceptableValues: [] },
  ])).toBeUndefined();
});

it('returns object if finds isCustomType', () => {
  expect(convertTypes([
    { type: 'CustomType', isCustomType: true, acceptableValues: [] },
  ])).toEqual(['object']);
});

it('returns undefined if array is empty', () => {
  expect(convertTypes([])).toBeUndefined();
});

it('returns undefined if array is undefined', () => {
  expect(convertTypes(undefined)).toBeUndefined();
});

it('returns undefined if array is null', () => {
  expect(convertTypes(null)).toBeUndefined();
});

it('returns undefined if array is undefined', () => {
  expect(convertTypes(undefined)).toBeUndefined();
});

it('expands custom types', () => {
  expect(convertTypes(
    [
      { type: 'CustomType', isCustomType: true, acceptableValues: [] },
    ], {
      CustomType: {
        name: 'CustomType',
        types: [
          { type: 'String', isCustomType: false, acceptableValues: [] },
          { type: 'Number', isCustomType: false, acceptableValues: [] },
        ],
        props: [],
        templates: [],
        module: '',
      },
    },
  )).toEqual(['object', 'string', 'number']);
});
