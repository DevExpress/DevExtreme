import * as React from 'react';
import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import {
  getOptionInfo,
  IElementDescriptor,
  IExpectedChild,
  IOptionDescriptor,
} from './configuration/react/element';

import { IConfigNode } from './configuration/config-node';
import { useOptionScanning } from './helpers';

interface INestedOptionMeta {
  optionName: string;
  registerNestedOption: (component: React.ReactElement) => any;
  updateFunc: (newProps: any, prevProps: any) => void;
  makeDirty: () => void;
}

interface NestedOptionContextContent {
  parentExpectedChildren: Record<string, IExpectedChild> | undefined;
  parentFullName: string;
  onChildOptionsReady: (configNode: IConfigNode, optionDescriptor: IOptionDescriptor, token: number, key: number) => void;
  takeConfigurationKey: () => number;
  updateToken: number | undefined;
}

const NestedOptionContext = createContext<NestedOptionContextContent>({
  parentExpectedChildren: {},
  parentFullName: '',
  onChildOptionsReady: () => undefined,
  takeConfigurationKey: () => 0,
  updateToken: undefined,
});

const NestedOption = function NestedOption<P>(props: P & { elementDescriptor: IElementDescriptor }): React.ReactElement | null {
  // @ts-expect-error TS2339
  const { children } = props;
  const { elementDescriptor, ...restProps } = props;

  const {
    parentExpectedChildren,
    onChildOptionsReady: triggerParentOptionsReady,
    takeConfigurationKey,
  } = useContext(NestedOptionContext);

  const [key] = useState(takeConfigurationKey());

  const optionElement = getOptionInfo(elementDescriptor, restProps, parentExpectedChildren);

  const [config, context, hasAnonymousTemplate, token] = useOptionScanning(optionElement, children);

  useLayoutEffect(() => {
    triggerParentOptionsReady(config, optionElement.descriptor, token, key);
  }, [token]);

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
  NestedOptionContext,
  NestedOptionContextContent,
};
