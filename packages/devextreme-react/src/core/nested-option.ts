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
  const { isTemplateRendering } = useContext(TemplateRenderingContext);

  if (!elementDescriptor || typeof document === 'undefined' || isTemplateRendering) {
    return null;
  }

  const usesNamedTemplate = elementDescriptor.TemplateProps?.some(
    (prop) => props[prop.tmplOption] && typeof props[prop.tmplOption] === 'string',
  );

  const {
    parentExpectedChildren,
    onChildOptionsReady: triggerParentOptionsReady,
    getOptionComponentKey,
    treeUpdateToken,
  } = useContext(NestedOptionContext);

  const [optionComponentKey] = useState(getOptionComponentKey());
  const optionElement = getOptionInfo(elementDescriptor, restProps, parentExpectedChildren);
  const mainContainer = useMemo(() => document.createElement('div'), []);
  const renderChildren = hasExpectedChildren(elementDescriptor) || usesNamedTemplate;

  const getHasTemplate = renderChildren
    ? () => !!mainContainer.childNodes.length
    : () => !!children;

  const [
    config,
    context,
  ] = useOptionScanning(optionElement, getHasTemplate, treeUpdateToken, 'option');

  useLayoutEffect(() => {
    // eslint-disable-next-line @stylistic/max-len
    triggerParentOptionsReady(config, optionElement.descriptor, treeUpdateToken, optionComponentKey);
  }, [treeUpdateToken]);

  return renderChildren ? React.createElement(
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
  ) : null;
};

export default NestedOption;
export {
  INestedOptionMeta,
};
