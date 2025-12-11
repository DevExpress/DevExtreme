import React from 'react';

import type { SortableTypes } from 'devextreme-react/sortable';

import Item from './Item.tsx';

const itemStyle = {
  width: 200,
  padding: 10,
  fontWeight: 'bold',
};

export default function DragItem({ data }: { data: SortableTypes.DragTemplateData }) {
  return (
    <Item
      text={data.itemData.Task_Subject}
      style={itemStyle}
    />
  );
}
