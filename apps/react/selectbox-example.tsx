import * as React from 'react';
import { SelectBox } from 'devextreme-react/select-box';

const SelectBoxItem = (option: any) => <span>{option.data.value}</span>;

const items = [
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
  },
];

export default (): React.ReactElement | null => (
  <SelectBox
    searchEnabled
    showClearButton
    searchTimeout={0}
    noDataText="No results found"
    displayExpr="label"
    valueExpr="value"
    items={items}
    itemComponent={SelectBoxItem}
  />
);
