import React from 'react';

const ItemTemplate = (props) => (
  <div>
    {props.data.color && (
      <div
        className="item-badge"
        style={{ backgroundColor: props.data.color }}
      />
    )}
    {props.data.text}
  </div>
);
export default ItemTemplate;
