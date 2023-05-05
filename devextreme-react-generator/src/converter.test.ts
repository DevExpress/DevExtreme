import { convertTypes } from './converter';

it('deduplicates', () => {
  const types = [
    {
      type: 'Array', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
    {
      type: 'Boolean', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
    {
      type: 'Function', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
    {
      type: 'Boolean', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
    {
      type: 'Number', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
    {
      type: 'Object', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
    {
      type: 'String', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
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
  expect(convertTypes([{
    type: 'Any', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
  }])).toBeUndefined();
  expect(convertTypes([
    {
      type: 'String', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
    {
      type: 'Any', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
    {
      type: 'Number', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
    },
  ])).toBeUndefined();
});

it('returns object if finds isCustomType', () => {
  expect(convertTypes([
    {
      type: 'CustomType', isCustomType: true, acceptableValues: [], importPath: '', isImportedType: false,
    },
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
      {
        type: 'CustomType', isCustomType: true, acceptableValues: [], importPath: '', isImportedType: false,
      },
    ], {
      CustomType: {
        name: 'CustomType',
        types: [
          {
            type: 'String', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
          },
          {
            type: 'Number', isCustomType: false, acceptableValues: [], importPath: '', isImportedType: false,
          },
        ],
        props: [],
        templates: [],
        module: '',
      },
    },
  )).toEqual(['object', 'string', 'number']);
});
