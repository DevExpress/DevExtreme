import * as React from 'react';

import {
  useContext,
  useLayoutEffect,
  useState,
  useMemo,
} from 'react';

import { createPortal } from 'react-dom';

import {
  getOptionInfo,
  IElementDescriptor,
} from './configuration/react/element';

import { useOptionScanning } from './use-option-scanning';
import { NestedOptionContext, TemplateDiscoveryContext } from './contexts';

interface INestedOptionMeta {
  optionName: string;
  registerNestedOption: (component: React.ReactElement) => any;
  updateFunc: (newProps: any, prevProps: any) => void;
  makeDirty: () => void;
}

const NestedOption = function NestedOption<P>(
  props: React.PropsWithChildren<P & { elementDescriptor: IElementDescriptor }>,
): React.ReactElement | null {
  const { children } = props;
  const { elementDescriptor, ...restProps } = props;

  if (!elementDescriptor || typeof document === 'undefined') {
    return null;
  }

  const {
    parentExpectedChildren,
    onChildOptionsReady: triggerParentOptionsReady,
    getOptionComponentKey,
    treeUpdateToken,
  } = useContext(NestedOptionContext);

  const { discoveryRendering } = useContext(TemplateDiscoveryContext);
  const [optionComponentKey] = useState(getOptionComponentKey());
  const optionElement = getOptionInfo(elementDescriptor, restProps, parentExpectedChildren);
  const templateContainer = useMemo(() => document.createElement('div'), []);
  const mainContainer = useMemo(() => document.createElement('div'), []);

  const [
    config,
    context,
  ] = useOptionScanning(optionElement, children, templateContainer, treeUpdateToken);

  useLayoutEffect(() => {
    if (!discoveryRendering) {
      triggerParentOptionsReady(config, optionElement.descriptor, treeUpdateToken, optionComponentKey);
    }
  }, [treeUpdateToken]);

  return discoveryRendering ? null : React.createElement(
    React.Fragment,
    {},
    createPortal(
      React.createElement(
        TemplateDiscoveryContext.Provider,
        {
          value: {
            discoveryRendering: true,
          },
        },
        children,
      ),
      templateContainer,
    ),
    createPortal(
      React.createElement(
        NestedOptionContext.Provider,
        {
          value: context,
        },
        children,
      ),
      mainContainer,
    ),
  );
};

export default NestedOption;
export {
  INestedOptionMeta,
};
