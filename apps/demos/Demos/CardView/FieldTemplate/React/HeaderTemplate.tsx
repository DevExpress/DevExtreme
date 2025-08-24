import React from 'react';

interface HeaderTemplateProps {
  text: string;
}

const HeaderTemplate = ({ text }: HeaderTemplateProps) => {
  return (
    <div className="task__header" title={text}>
      {text}
    </div>
  );
};

export default HeaderTemplate;
