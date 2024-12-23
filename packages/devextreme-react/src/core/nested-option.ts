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
import { NestedOptionContext, TemplateRenderingContext } from './contexts';
import { hasExpectedChildren } from './helpers';

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

  const { isTemplateRendering } = useContext(TemplateRenderingContext);
  const [optionComponentKey] = useState(getOptionComponentKey());
  const optionElement = getOptionInfo(elementDescriptor, restProps, parentExpectedChildren);
  const mainContainer = useMemo(() => document.createElement('div'), []);

  const [
    config,
    context,
  ] = useOptionScanning(optionElement, children, mainContainer, treeUpdateToken, 'option');

  useLayoutEffect(() => {
    if (!isTemplateRendering) {
      triggerParentOptionsReady(config, optionElement.descriptor, treeUpdateToken, optionComponentKey);
    }
  }, [treeUpdateToken]);

  if (children && !isTemplateRendering && !hasExpectedChildren(elementDescriptor)) {
    mainContainer.appendChild(document.createElement('div'));
    return null;
  }

  return isTemplateRendering ? null : React.createElement(
    React.Fragment,
    {},
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
