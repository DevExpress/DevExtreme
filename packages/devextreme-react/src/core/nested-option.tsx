import * as React from 'react';
import {
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import {
  getOptionInfo,
  IElementDescriptor,
} from './configuration/react/element';

import { useOptionScanning } from './use-option-scanning';
import { NestedOptionContext } from './helpers';

interface INestedOptionMeta {
  optionName: string;
  registerNestedOption: (component: React.ReactElement) => any;
  updateFunc: (newProps: any, prevProps: any) => void;
  makeDirty: () => void;
}

const NestedOption = function NestedOption<P>(props: P & { elementDescriptor: IElementDescriptor }): React.ReactElement | null {
  // @ts-expect-error TS2339
  const { children } = props;
  const { elementDescriptor, ...restProps } = props;

  const {
    parentExpectedChildren,
    onChildOptionsReady: triggerParentOptionsReady,
    getOptionComponentKey,
  } = useContext(NestedOptionContext);

  const [optionComponentKey] = useState(getOptionComponentKey());
  const optionElement = getOptionInfo(elementDescriptor, restProps, parentExpectedChildren);

  const [
    config,
    context,
    hasAnonymousTemplate,
    treeUpdateToken,
  ] = useOptionScanning(optionElement, children);

  useLayoutEffect(() => {
    triggerParentOptionsReady(config, optionElement.descriptor, treeUpdateToken, optionComponentKey);
  }, [treeUpdateToken]);

  return (
    <React.Fragment>
      <NestedOptionContext.Provider value={context}>
        { !hasAnonymousTemplate && children }
      </NestedOptionContext.Provider>
    </React.Fragment>
  );
};

export default NestedOption;
export {
  INestedOptionMeta,
};
