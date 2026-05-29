import {
  describe, expect, it,
} from '@jest/globals';

import { type ConfigItem, customizeFormItems, type FormItem } from './customize_form_items';

const subjectGroup: FormItem = {
  name: 'subjectGroup',
  itemType: 'group',
  cssClass: 'dx-scheduler-form-subject-group dx-scheduler-form-group-with-icon',
};

const dateGroup: FormItem = {
  name: 'dateGroup',
  itemType: 'group',
  cssClass: 'dx-scheduler-form-date-range-group dx-scheduler-form-group-with-icon',
};

const repeatGroup: FormItem = {
  name: 'repeatGroup',
  itemType: 'group',
  cssClass: 'dx-scheduler-form-repeat-group dx-scheduler-form-group-with-icon',
};

const resourcesGroup: FormItem = {
  name: 'resourcesGroup',
  itemType: 'group',
  cssClass: 'dx-scheduler-form-resources-group dx-scheduler-form-group-with-icon',
};

const descriptionGroup: FormItem = {
  name: 'descriptionGroup',
  itemType: 'group',
  cssClass: 'dx-scheduler-form-description-group dx-scheduler-form-group-with-icon',
};

const mainGroup: FormItem = {
  items: [subjectGroup, dateGroup, repeatGroup, resourcesGroup, descriptionGroup],
  name: 'mainGroup',
  itemType: 'group',
  cssClass: 'dx-scheduler-form-main-group',
  colSpan: 1,
};

const recurrenceGroup: FormItem = {
  name: 'recurrenceGroup',
  itemType: 'group',
  cssClass: 'dx-scheduler-form-recurrence-group dx-scheduler-form-recurrence-hidden',
  colSpan: 1,
};

const mainTestCase: FormItem[] = [mainGroup, recurrenceGroup];

describe('customizeFormItems', () => {
  it('should return original items when no customization provided', () => {
    const result = customizeFormItems(mainTestCase);

    expect(result).toEqual(mainTestCase);
  });

  it('should not mutate original data', () => {
    const originalMainTestCase = JSON.parse(JSON.stringify(mainTestCase));
    const originalMainGroup = JSON.parse(JSON.stringify(mainGroup));
    const originalSubjectGroup = JSON.parse(JSON.stringify(subjectGroup));

    expect(mainGroup.items).toBe(mainGroup.items);

    customizeFormItems(mainTestCase, ['mainGroup']);
    customizeFormItems(mainTestCase, ['subjectGroup', 'dateGroup']);
    customizeFormItems(mainTestCase, [{ name: 'mainGroup', items: [] }]);
    customizeFormItems(mainTestCase, [{ name: 'mainGroup', items: ['subjectGroup'] }] as ConfigItem[]);

    expect(mainTestCase).toEqual(originalMainTestCase);
    expect(mainGroup).toEqual(originalMainGroup);
    expect(subjectGroup).toEqual(originalSubjectGroup);

    expect(mainGroup.items).toHaveLength(5);
    expect(mainGroup.items?.[0]).toBe(subjectGroup);
    expect(mainGroup.items?.[1]).toBe(dateGroup);
  });

  it('should show only mainGroup when specified by object', () => {
    const customizeItems = [
      {
        name: 'mainGroup',
      },
    ];
    const result = customizeFormItems(mainTestCase, customizeItems);

    expect(result).toEqual([mainGroup]);
  });

  it('should show only mainGroup when specified by string', () => {
    const result = customizeFormItems(mainTestCase, ['mainGroup']);

    expect(result).toEqual([mainGroup]);
  });

  it('should extract specific items from parent group', () => {
    const result = customizeFormItems(mainTestCase, ['subjectGroup', 'dateGroup']);

    expect(result).toEqual([subjectGroup, dateGroup]);
  });

  it('should create empty mainGroup when items array is empty', () => {
    const result = customizeFormItems(mainTestCase, [{ name: 'mainGroup', items: [], visible: false }]);

    expect(result).toEqual([{
      ...mainGroup,
      items: [],
      visible: false,
    }]);
  });

  it('should change order of top-level groups', () => {
    const customizeItems = [
      'recurrenceGroup',
      'mainGroup',
    ];
    const result = customizeFormItems(mainTestCase, customizeItems);

    expect(result).toEqual([recurrenceGroup, mainGroup]);
  });

  it('should extract item from group and change order', () => {
    const customizeItems = [
      'subjectGroup',
      'recurrenceGroup',
      'mainGroup',
    ];
    const result = customizeFormItems(mainTestCase, customizeItems);
    const expectedMainGroup = {
      ...mainGroup,
      items: [dateGroup, repeatGroup, resourcesGroup, descriptionGroup],
    };

    expect(result).toEqual([subjectGroup, recurrenceGroup, expectedMainGroup]);
  });

  it('should extract multiple items from parent group', () => {
    const customizeItems = [
      'subjectGroup',
      'repeatGroup',
      'mainGroup',
    ];
    const result = customizeFormItems(mainTestCase, customizeItems);

    const expectedMainGroup = {
      ...mainGroup,
      items: [dateGroup, resourcesGroup, descriptionGroup],
    };

    expect(result).toEqual([subjectGroup, repeatGroup, expectedMainGroup]);
  });

  it('should create custom form item when name not found', () => {
    const result = customizeFormItems(mainTestCase, ['customItem']);

    expect(result).toEqual([{
      name: 'customItem',
      itemType: 'simple',
      dataField: 'customItem',
      editorType: 'dxTextBox',
    }]);
  });

  it('should create custom group with children', () => {
    const customizeItems = [
      {
        name: 'customGroup',
        itemType: 'group' as const,
        items: ['child1', 'child2'],
      },
    ];
    const result = customizeFormItems(mainTestCase, customizeItems);

    expect(result).toEqual([{
      name: 'customGroup',
      itemType: 'group',
      items: [{
        name: 'child1',
        itemType: 'simple',
        dataField: 'child1',
        editorType: 'dxTextBox',
      }, {
        name: 'child2',
        itemType: 'simple',
        dataField: 'child2',
        editorType: 'dxTextBox',
      }],
    }]);
  });

  it('should create custom group with visibility control', () => {
    const customizeItems = [
      {
        name: 'hiddenGroup',
        itemType: 'group' as const,
        visible: false,
        items: ['field1'],
      },
    ];
    const result = customizeFormItems(mainTestCase, customizeItems);

    expect(result).toEqual([{
      name: 'hiddenGroup',
      itemType: 'group',
      visible: false,
      items: [{
        name: 'field1',
        itemType: 'simple',
        dataField: 'field1',
        editorType: 'dxTextBox',
      }],
    }]);
  });

  it('should customize mainGroup with specific items as array', () => {
    const result = customizeFormItems(
      mainTestCase,
      [{ name: 'mainGroup', items: ['subjectGroup', 'dateGroup'] }] as ConfigItem[],
    );

    expect(result).toEqual([{
      ...mainGroup,
      items: [subjectGroup, dateGroup],
    }]);
  });

  it('should customize mainGroup with specific items as objects', () => {
    const result = customizeFormItems(mainTestCase, [{ name: 'mainGroup', items: [{ name: 'subjectGroup' }, { name: 'dateGroup' }] }]);

    expect(result).toEqual([{
      ...mainGroup,
      items: [subjectGroup, dateGroup],
    }]);
  });

  it('should create nested custom groups', () => {
    const result = customizeFormItems(mainTestCase, [{
      name: 'mainGroup',
      items: [
        { name: 'several', itemType: 'group' as const, items: ['subjectGroup'] },
        'dateGroup',
      ],
    }] as ConfigItem[]);

    expect(result).toEqual([{
      ...mainGroup,
      items: [{ name: 'several', itemType: 'group', items: [subjectGroup] }, dateGroup],
    }]);
  });

  it('should set item visibility property', () => {
    const result = customizeFormItems(mainTestCase, [{ name: 'mainGroup', items: [{ name: 'subjectGroup', visible: false }, { name: 'dateGroup' }] }]);

    expect(result).toEqual([{
      ...mainGroup,
      items: [{ ...subjectGroup, visible: false }, dateGroup],
    }]);
  });
});
