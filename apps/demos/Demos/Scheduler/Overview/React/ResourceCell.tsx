import React, { useMemo } from 'react';

type ResourceCellProps = {
  data: { color: string; text: string; data: { avatar: string; age: number; discipline: string; }; };
};

const ResourceCell = (props: ResourceCellProps) => {
  const { data: { color, text, data: { avatar, age, discipline } } } = props;
  const backgroundStyle = useMemo(() => ({ background: color }), [color]);
  const textStyle = useMemo(() => ({ color }), [color]);

  return (
    <div className="dx-template-wrapper">
      <div className="name" style={backgroundStyle}>
        <h2>{text}</h2>
      </div>
      <div className="avatar" title={text}>
        <img
          src={avatar}
          alt={`${text} photo`}
        />
      </div>
      <div className="info" style={textStyle}>
        Age: {age}
        <br />
        <b>{discipline}</b>
      </div>
    </div>
  );
};

export default ResourceCell;
