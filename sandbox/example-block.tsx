import * as React from 'react';

interface IProps {
  state?: Record<string, unknown>;
  title: string;
  children: any;
}

const Example = (props: IProps): JSX.Element => {
  const { state, title, children } = props;
  let stateBlock = null;
  if (state) {
    stateBlock = <pre className="example-state">{JSON.stringify(state, null, '  ')}</pre>;
  }

  return (
    <div className="example-block">
      <div className="example-header">
        <h4 className="bg-primary example-title">{title || 'example'}</h4>
        {stateBlock}
      </div>
      {children}
    </div>
  );
};

Example.defaultProps = {
  state: {},
};

export default Example;
