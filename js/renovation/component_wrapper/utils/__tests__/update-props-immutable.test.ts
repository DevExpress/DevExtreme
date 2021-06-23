import { updatePropsImmutable } from '../update_props_immutable';

class Dummy {
  nestedProp: string;

  constructor(nestedProp: string) { this.nestedProp = nestedProp; }
}

it('simple value', () => {
  const props = { name: 'a' };
  const option = { name: 'b' };
  updatePropsImmutable(props, option, 'name', 'name');
  expect(props.name).toBe('b');
});

it('object value', () => {
  const nestedObject = { nestedProp: 'initial value' };
  const newNestedObject = { nestedProp: 'new value' };
  const option = { nestedObject: newNestedObject };
  const props = { nestedObject };
  updatePropsImmutable(props, option, 'nestedObject', 'nestedObject');
  expect(props.nestedObject).not.toBe(newNestedObject);
  expect(props.nestedObject.nestedProp).toBe('new value');
});

it('change nested object option to plain object value', () => {
  const option = { nestedObject: { nestedProp: 'new value' } };
  const props = { nestedObject: option.nestedObject };
  updatePropsImmutable(props, option, 'nestedObject', 'nestedObject.nestedProp');
  expect(props.nestedObject).not.toBe(option.nestedObject);
  expect(props.nestedObject.nestedProp).toBe('new value');
});

it('change second level nested object option to plain object value', () => {
  const option = { nestedObject1: { nestedObject2: { nestedProp: 'new value' } } };
  const props = { nestedObject1: option.nestedObject1 };

  updatePropsImmutable(props, option, 'nestedObject1', 'nestedObject1.nestedObject2.nestedProp');
  expect(props.nestedObject1).not.toBe(option.nestedObject1);
  expect(props.nestedObject1.nestedObject2).not.toBe(option.nestedObject1.nestedObject2);
  expect(props.nestedObject1.nestedObject2.nestedProp).toBe('new value');
});

it('change nested object option to plain object value 1', () => {
  const option = { nestedObject: { nestedProp: 'new value' } };
  const props = { nestedObject: option.nestedObject };
  updatePropsImmutable(props, option, 'nestedObject', 'nestedObject');
  expect(props.nestedObject).not.toBe(option.nestedObject);
  expect(props.nestedObject.nestedProp).toBe('new value');
});

it('change nested object option to class object value', () => {
  const option = { nestedObject: new Dummy('value') };
  const props = { nestedObject: option.nestedObject };
  updatePropsImmutable(props, option, 'nestedObject', 'nestedObject');

  expect(props.nestedObject).toBe(option.nestedObject);
});

it('change array option', () => {
  const dataSource = [];

  const option = { dataSource };
  const props = { dataSource: option.dataSource };
  updatePropsImmutable(props, option, 'dataSource', 'dataSource');

  expect(props.dataSource).toBe(dataSource);
});

it('change item in nested array option', () => {
  const nestedArray = [{ nestedProp: 'item1' }, { nestedProp: 'item2' }, { nestedProp: 'item3' }];

  const option = { nestedArray };
  const props = { nestedArray: option.nestedArray };
  updatePropsImmutable(props, option, 'nestedArray', 'nestedArray[1].nestedProp');

  expect(props.nestedArray).not.toBe(nestedArray);
  expect(props.nestedArray[0]).toBe(nestedArray[0]);
  expect(props.nestedArray[1]).not.toBe(nestedArray[1]);
  expect(props.nestedArray[2]).toBe(nestedArray[2]);
});

it('change several items in nested array option', () => {
  const nestedArray = [{ nestedProp1: 'item11', nestedProp2: 'item12' }];

  const option = { nestedArray };
  const props = { nestedArray: option.nestedArray };

  updatePropsImmutable(props, option, 'nestedArray', 'nestedArray[0].nestedProp1');
  option.nestedArray[0].nestedProp1 = 'changed';

  updatePropsImmutable(props, option, 'nestedArray', 'nestedArray[0].nestedProp2');
  option.nestedArray[0].nestedProp2 = 'changed';

  expect(props.nestedArray).not.toBe(nestedArray);
  expect(props.nestedArray[0]).not.toBe(nestedArray[0]);
  expect(props.nestedArray[0].nestedProp1).toBe('item11');
  expect(props.nestedArray[0].nestedProp2).toBe('item12');
});

it('change second level nested object option for empty props', () => {
  const option = { nestedObject1: { nestedObject2: { nestedProp: 'new value' } } };
  const props = {} as any;

  updatePropsImmutable(props, option, 'nestedObject1', 'nestedObject1.nestedObject2.nestedProp');

  expect(props.nestedObject1).not.toBe(option.nestedObject1);
  expect(props.nestedObject1.nestedObject2).not.toBe(option.nestedObject1.nestedObject2);
  expect(props.nestedObject1.nestedObject2.nestedProp).toBe('new value');
});

it('change modified property in nested object if prevProps', () => {
  const option = { nestedObject: { nestedProp: 'new value' } };
  const newNestedObject = { nestedProp: 'old value' };
  const props = { nestedObject: newNestedObject };

  updatePropsImmutable(props, option, 'nestedObject', 'nestedObject.nestedProp');

  expect(props.nestedObject).not.toBe(option.nestedObject);
  expect(props.nestedObject).not.toBe(newNestedObject);
  expect(props.nestedObject.nestedProp).toBe('new value');
});

it('change object item in nested array option', () => {
  const nestedArray = ['item1', 'item2'];

  const option = { nestedArray };
  const props = { nestedArray: option.nestedArray };
  nestedArray[1] = 'item2 modified';
  updatePropsImmutable(props, option, 'nestedArray', 'nestedArray[1]');

  expect(props.nestedArray).not.toBe(nestedArray);
  expect(props.nestedArray[1]).toBe('item2 modified');
});

it('change object item in double nested array option', () => {
  const objectProp = {};

  const props = {
    item: {
      objectProp,
      items: [{ value: 'item1' }, { value: 'item2' }],
    },
  };
  const option = { item: props.item };
  option.item.items[0].value = 'item1 modified';

  updatePropsImmutable(props, option, 'item', 'item.items[0].value');

  expect(props.item.items[0].value).toBe('item1 modified');
  expect(props.item.items[1].value).toBe('item2');
  expect(props.item.objectProp).toBe(objectProp);
});
