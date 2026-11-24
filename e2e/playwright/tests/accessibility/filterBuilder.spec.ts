import type { Locator } from '@playwright/test';
import { expect, test } from '../../helpers/accessibility/test';
import FilterBuilder from '../../models/filterBuilder';
import { createWidget } from '../../helpers/createWidget';
import { fields, filter } from '../common/filterBuilder/data';
import { a11yCheck } from '../../helpers/accessibility/utils';

const elements: {
  name: string;
  role: string;
  label: string;
  selector: (filterBuilder: FilterBuilder) => Locator;
}[] = [
  {
    name: 'Root Element',
    role: 'group',
    label: 'Filter builder',
    selector: (filterBuilder) => filterBuilder.getRootElement(),
  },
  {
    name: 'Group Item',
    role: 'treeitem',
    label: 'Group item',
    selector: (filterBuilder) => filterBuilder.getGroupItem(),
  },
  {
    name: 'Operation Button',
    role: 'combobox',
    label: 'Operation',
    selector: (filterBuilder) => filterBuilder.getOperationButton(1),
  },
  {
    name: 'Add Button',
    role: 'combobox',
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
    label: 'Item field',
    selector: (filterBuilder) => filterBuilder.getItem('field', 2),
  },
  {
    name: 'Item Operation',
    role: 'combobox',
    label: 'Item operation',
    selector: (filterBuilder) => filterBuilder.getItem('operation', 2),
  },
  {
    name: 'Item Value',
    role: 'button',
    label: 'Item value',
    selector: (filterBuilder) => filterBuilder.getItem('value', 2),
  },
];

elements.forEach(({
  name, role, label, selector,
}) => {
  test(`Filter Builder - ${name} has correct ARIA attributes`, async ({ page }) => {
    await createWidget(page, 'dxFilterBuilder', {
      fields,
      value: filter,
    });

    const filterBuilder = new FilterBuilder(page, '#parentContainer');
    // TestCafe reads the attributes of the first match.
    const elementSelector = selector(filterBuilder).first();
    const labelValue = ['button', 'combobox'].includes(role) && await elementSelector.innerText() ? 'title' : 'aria-label';

    await expect(elementSelector).toHaveAttribute('role', role);
    await expect(elementSelector).toHaveAttribute(labelValue, label);

    const ariaControls = await elementSelector.getAttribute('aria-controls');

    if (role === 'combobox' && ariaControls) {
      await elementSelector.click();

      const popupTreeView = FilterBuilder.getPopupTreeView(page);

      await expect(popupTreeView).toHaveAttribute('id', ariaControls);

      const a11yCheckConfig = {};

      await a11yCheck(page, a11yCheckConfig, '#parentContainer');
    }
  });
});

test('Filter Builder - ARIA Attributes axe test', async ({ page }) => {
  await createWidget(page, 'dxFilterBuilder', {
    fields,
    value: filter,
  });

  const filterBuilder = new FilterBuilder(page, '#container');

  await expect.poll(() => filterBuilder.isReady()).toBe(true);

  await a11yCheck(page, {}, '#container');
});
