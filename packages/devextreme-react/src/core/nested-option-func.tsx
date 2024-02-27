import * as React from 'react';
import { memo, ReactElement } from 'react';
import { ElementType, getElementInfo } from './configuration/react/element';

interface INestedOptionMeta {
  optionName: string;
  registerNestedOption: (component: React.ReactElement) => any;
  updateFunc: (newProps: any, prevProps: any) => void;
  makeDirty: () => void;
}

const NestedOption = memo(function NestedOption<P>(props: P) {
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
}) as <P>(props: P) => ReactElement<any> | null;;

export default NestedOption;
export {
  INestedOptionMeta,
};
