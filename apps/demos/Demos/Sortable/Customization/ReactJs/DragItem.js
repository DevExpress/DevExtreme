import React from 'react';
import Item from './Item.js';

const itemStyle = {
  width: 200,
  padding: 10,
  fontWeight: 'bold',
};
export default function DragItem({ data }) {
  return (
    <Item
      text={data.itemData.Task_Subject}
      style={itemStyle}
    />
  );
}
