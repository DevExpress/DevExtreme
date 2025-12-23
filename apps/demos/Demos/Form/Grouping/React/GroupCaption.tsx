import React from 'react';

export interface GroupCaptionProps {
  iconName: string;
  caption: string;
}

const GroupCaption = ({ iconName, caption }: GroupCaptionProps) => (
  <>
    <i className={`dx-icon dx-icon-${iconName}`}></i>
    <span>{caption}</span>
  </>
);

export default GroupCaption;
