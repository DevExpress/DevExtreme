import * as React from 'react';
import { ElementType, getElementInfo } from './configuration/react/element';

interface INestedOptionMeta {
  optionName: string;
  registerNestedOption: (component: React.ReactElement) => any;
  updateFunc: (newProps: any, prevProps: any) => void;
  makeDirty: () => void;
}

const NestedOption = <P>(props: P) => {
  // @ts-expect-error TS2339
  const { children: stateChildren } = props;
  const children = React.Children.map(
    stateChildren,
    (child) => {
      const childElementInfo = getElementInfo(child);

      return childElementInfo.type === ElementType.Option ? child : null;
    },
  );
  return React.createElement(
    React.Fragment,
    {},
    children,
  );
};

export default NestedOption;
export {
  INestedOptionMeta,
};
