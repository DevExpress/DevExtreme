import React from 'react';

function Breadcrumb(props) {
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
