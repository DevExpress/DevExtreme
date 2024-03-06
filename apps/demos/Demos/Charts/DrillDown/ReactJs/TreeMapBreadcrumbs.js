import React from 'react';
import Breadcrumb from './Breadcrumb.js';

function TreeMapBreadcrumbs({ className, treeInfo, onItemClick }) {
  const lastIndex = treeInfo.length - 1;
  return (
    <div className={className}>
      {treeInfo.map((info, index) => (
        <Breadcrumb
          key={info.text}
          onClick={onItemClick}
          info={info}
          isLast={index === lastIndex}
        />
      ))}
    </div>
  );
}
export default TreeMapBreadcrumbs;
