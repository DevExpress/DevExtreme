/* eslint-disable @typescript-eslint/no-misused-promises */

import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { fields, filter } from './data';

fixture`Filter Builder Accessibility Tests`.page(
  url(__dirname, '../container.html'),
);

const elements = [
  {
    name: 'Root Element',
    role: 'tree',
    label: 'Filter Builder',
    selector: (filterBuilder) => filterBuilder.getRootElement(),
  },
  {
    name: 'Leveled Grouping',
    role: 'group',
    label: 'Level 1',
    selector: (filterBuilder) => filterBuilder.getGroupByLevel(1),
  },
  {
    name: 'Group Item',
    role: 'treeitem',
    label: 'Group Item',
    selector: (filterBuilder) => filterBuilder.getGroupItem(),
  },
  {
    name: 'Operation Button',
    role: 'button',
    label: 'Operation',
    selector: (filterBuilder) => filterBuilder.getOperationButton(1),
  },
  {
    name: 'Add Button',
    role: 'button',
    label: 'Add',
    selector: (filterBuilder) => filterBuilder.getAddButton(1),
  },
  {
    name: 'Remove Condition Button',
    role: 'button',
    label: 'Remove condition',
    selector: (filterBuilder) => filterBuilder.getRemoveButton(0),
  },
  {
    name: 'Remove Group Button',
    role: 'button',
    label: 'Remove group',
    selector: (filterBuilder) => filterBuilder.getRemoveButton(1),
  },
  {
    name: 'Item Field',
    role: 'combobox',
    label: 'Item Field',
    selector: (filterBuilder) => filterBuilder.getItem('field', 2),
  },
  {
    name: 'Item Operation',
    role: 'combobox',
    label: 'Item Operation',
    selector: (filterBuilder) => filterBuilder.getItem('operation', 2),
  },
  {
    name: 'Item Value',
    role: 'button',
    label: 'Item Value',
    selector: (filterBuilder) => filterBuilder.getItem('value', 2),
  },
];

elements.forEach(({
  name, role, label, selector,
}) => {
  test(`Filter Builder - ${name} has correct ARIA attributes`, async (t) => {
    const filterBuilder = new FilterBuilder('#parentContainer');
    const elementSelector = selector(filterBuilder);
    const labelValue = ['button', 'combobox'].includes(role) && await elementSelector.innerText ? 'title' : 'aria-label';

    await t
      .expect(elementSelector.getAttribute('role'))
      .eql(role)
      .expect(elementSelector.getAttribute(`${labelValue}`))
      .eql(label);
  }).before(async () => {
    await createWidget('dxFilterBuilder', {
      fields,
      value: filter,
    });
  });
});
