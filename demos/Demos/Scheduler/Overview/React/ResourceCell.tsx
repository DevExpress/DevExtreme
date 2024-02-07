import React from 'react';

type ResourceCellProps = {
  data: { color: string; text: string; data: { avatar: string; age: number; discipline: string; }; };
};

const ResourceCell = (props: ResourceCellProps) => {
  const { data: { color, text, data: { avatar, age, discipline } } } = props;

  return (
    <div className="dx-template-wrapper">
      <div className="name" style={{ background: color }}>
        <h2>{text}</h2>
      </div>
      <div className="avatar">
        <img src={avatar} />
      </div>
      <div className="info" style={{ color }}>
          Age: {age}
        <br />
        <b>{discipline}</b>
      </div>
    </div>
  );
};

export default ResourceCell;
