import React, { useMemo } from 'react';

type ItemTemplateProps = {
  data: {
    color: string;
    text: string;
  }
};

const ItemTemplate = (props: ItemTemplateProps) => {
  const badgeStyle = useMemo(() => ({ backgroundColor: props.data.color }), [props.data.color]);

  return (
    <div>
      {props.data.color && <div className="item-badge" style={badgeStyle} />}
      {props.data.text}
    </div>
  );
};

export default ItemTemplate;
