import React from 'react';

type ItemTemplateProps = {
  data: {
    color: string;
    text: string;
  }
};

const ItemTemplate = (props: ItemTemplateProps) => (
  <div>
    {props.data.color && <div className="item-badge" style={{ backgroundColor: props.data.color }} />}
    {props.data.text}
  </div>
);

export default ItemTemplate;
