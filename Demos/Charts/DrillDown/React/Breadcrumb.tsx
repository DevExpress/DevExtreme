
import React from 'react';
import { DrillInfo } from './data';

interface BreadcrumbProps {
  key: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (props: DrillInfo['node']) => void;
  info: DrillInfo;
  isLast: boolean;
}

function Breadcrumb(props: BreadcrumbProps) {
  const onClick = React.useCallback(() => {
    props.onClick(props.info.node);
  }, [props]);

  return (
    <span>
      <span
        className={props.info.node ? 'link' : ''}
        onClick={onClick}
      >
        {props.info.text}
      </span>
      {props.isLast ? '' : ' > '}
    </span>
  );
}

export default Breadcrumb;
