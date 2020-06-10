import React from 'react';
import Item from './Item.js';

export default function DragItem({ data }) {
  return (
    <Item
      text={data.itemData.Task_Subject}
      style={{
        width: 200,
        padding: 10,
        fontWeight: 'bold'
      }}
    />
  );
}
