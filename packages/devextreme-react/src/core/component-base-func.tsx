import * as React from 'react';
import * as events from 'devextreme/events';

import {
  useContext,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  ReactElement,
  memo
} from 'react';

import { RemovalLockerContext } from './helpers';
import { requestAnimationFrame } from 'devextreme/animation/frame';
import { deferUpdate } from 'devextreme/core/utils/common';
import { OptionsManager, scheduleGuards, unscheduleGuards } from './options-manager';
import { DXRemoveCustomArgs, DXTemplateCreator, InitArgument } from './types';
import { elementPropNames, getClassName } from './widget-config';
import { buildConfigTree } from './configuration/react/tree';
import { createPortal } from 'react-dom';
import { TemplateManager } from './template-manager';
import { ComponentProps } from './component-func';

const DX_REMOVE_EVENT = 'dxremove';

type ComponentBaseProps = ComponentProps & {
  renderChildren?: () => Record<string, unknown>[] | null | undefined;
};

interface ComponentBaseRef {
  getInstance: () => any;
  getElement: () => HTMLDivElement;
  createWidget: (element?: Element) => void;
}

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

const ComponentBase = memo(forwardRef<ComponentBaseRef, any>(function ComponentBase<P extends IHtmlOptions>(props: P & ComponentBaseProps, ref: React.ForwardedRef<ComponentBaseRef>) {
  const {
    templateProps = [],
    defaults = {},
    expectedChildren = {},
    isPortalComponent = false,
    useRequestAnimationFrameFlag = false,
    subscribableOptions = [],
    widgetClass,
    independentEvents = [],
    renderChildren,
    beforeCreateWidget = () => undefined,
    afterCreateWidget = () => undefined,
  } = props;

  const [_, setForceUpdateToken] = useState(0);
  const removalLocker = useContext(RemovalLockerContext);
  const instance = useRef<any>();
  const element = useRef<HTMLDivElement>();
  const portalContainer = useRef<HTMLElement | null>();
  const useDeferUpdateForTemplates = useRef(false);
  const guardsUpdateScheduled = useRef(false);
  const optionsManager = useRef<OptionsManager>(new OptionsManager());
  const childNodes = useRef<Node[]>();

  const createDXTemplates = useRef<DXTemplateCreator>();
  const clearInstantiationModels = useRef<() => void>();
  const updateTemplates = useRef<(callback: () => void) => void>();

  const prevProps = useRef<P & ComponentBaseProps>();

  useEffect(() => {
    const { style } = props;

    if (childNodes.current?.length) {
      element.current?.append(...childNodes.current);
    } else if (element.current?.childNodes.length) {
      childNodes.current = Array.from(element.current?.childNodes);
    }
    updateCssClasses(null, props);

    if (style) {
      setInlineStyles(style);
    }

    prevProps.current = props;

    return () => {
      removalLocker?.lock();

      if (instance.current) {
        const dxRemoveArgs: DXRemoveCustomArgs = { isUnmounting: true };
  
        childNodes.current?.forEach((child) => child.parentNode?.removeChild(child));
        events.triggerHandler(element.current!, DX_REMOVE_EVENT, dxRemoveArgs);
        instance.current.dispose();
      }
      optionsManager.current.dispose();
  
      removalLocker?.unlock();
    };
  }, []);

  useEffect(() => {
    if (!optionsManager.current?.isInstanceSet) {
      return;
    }

    updateCssClasses(prevProps.current!, props);

    const config = getConfig();

    const templateOptions = optionsManager.current.getTemplateOptions(config);
    const dxTemplates = createDXTemplates.current?.(templateOptions) || {};

    optionsManager.current.update(config, dxTemplates);
    scheduleTemplatesUpdate();

    prevProps.current = props;
  });

  const setTemplateManagerHooks = useCallback(({
    createDXTemplates: createDXTemplatesFn,
    clearInstantiationModels: clearInstantiationModelsFn,
    updateTemplates: updateTemplatesFn,
  }: InitArgument) => {
    createDXTemplates.current = createDXTemplatesFn;
    clearInstantiationModels.current = clearInstantiationModelsFn;
    updateTemplates.current = updateTemplatesFn;
  }, [createDXTemplates, clearInstantiationModels, updateTemplates]);

  const updateCssClasses = useCallback((prevProps: P | null, newProps: P) => {
    const prevClassName = prevProps ? getClassName(prevProps) : undefined;
    const newClassName = getClassName(newProps);

    if (prevClassName === newClassName) { return; }

    if (prevClassName) {
      const classNames = prevClassName.split(' ').filter((c) => c);
      if (classNames.length) {
        element.current?.classList.remove(...classNames);
      }
    }

    if (newClassName) {
      const classNames = newClassName.split(' ').filter((c) => c);
      if (classNames.length) {
        element.current?.classList.add(...classNames);
      }
    }
  }, [element.current]);

  const setInlineStyles = useCallback((styles) => {
    if (element.current) {
      Object.entries(styles).forEach(
        ([name, value]) => {
          element.current!.style[name] = value;
        },
      );
    }
  }, [element.current]);

  const getElementProps = useCallback(() => {
    const elementProps: Record<string, any> = {
      ref: (el: HTMLDivElement) => {
        if (el) {
          element.current = el;
        }
      },
    };

    elementPropNames.forEach((name) => {
      if (name in props) {
        elementProps[name] = props[name];
      }
    });
    return elementProps;
  }, [element.current]);

  const getConfig = useCallback(() => {
    return buildConfigTree(
      {
        templates: templateProps,
        initialValuesProps: defaults,
        predefinedValuesProps: {},
        expectedChildren: expectedChildren,
      },
      props,
    );
  }, [props]);

  const scheduleTemplatesUpdate = useCallback(() => {
    if (guardsUpdateScheduled.current) {
      return;
    }

    guardsUpdateScheduled.current = true;

    const updateFunc = useDeferUpdateForTemplates.current ? deferUpdate : requestAnimationFrame;

    updateFunc(() => {
      guardsUpdateScheduled.current = false;

      updateTemplates.current?.(() => scheduleGuards());
    });

    unscheduleGuards();
  }, [
    guardsUpdateScheduled.current,
    useDeferUpdateForTemplates.current,
    updateTemplates.current,
  ]);

  const createWidget = useCallback((el?: Element) => {
    beforeCreateWidget();

    el = el || element.current;

    const config = getConfig();

    let options: any = {
      templatesRenderAsynchronously: true,
      ...optionsManager.current.getInitialOptions(config),
    };

    const templateOptions = optionsManager.current.getTemplateOptions(config);
    const dxTemplates = createDXTemplates.current?.(templateOptions);

    if (dxTemplates && Object.keys(dxTemplates).length) {
      options = {
        ...options,
        integrationOptions: {
          templates: dxTemplates,
        },
      };
    }

    clearInstantiationModels.current?.();

    instance.current = new widgetClass(el, options);

    if (!useRequestAnimationFrameFlag) {
      useDeferUpdateForTemplates.current = instance.current.option(
        'integrationOptions.useDeferUpdateForTemplates',
      );
    }

    optionsManager.current.setInstance(instance.current, config, subscribableOptions, independentEvents);
    instance.current.on('optionChanged', optionsManager.current.onOptionChanged);

    afterCreateWidget();
  }, [])

  useImperativeHandle(ref, () => {
    return {
      getInstance() {
        return instance.current;
      },
      getElement() {
        return element.current!;
      },
      createWidget(el) {
        createWidget(el);
      },
    };
  });

  const _renderChildren = useCallback(() => {
    if (renderChildren) {
      return renderChildren();
    }

    // @ts-expect-error TS2339
    const { children } = props;
    return children;
  }, [props]);

  const renderPortal = useCallback(() => {
    return portalContainer.current && createPortal(
      _renderChildren(),
      portalContainer.current!,
    );
  }, [props]);


  const renderContent = useCallback(() => {
    // @ts-expect-error TS2339
    const { children } = props;

    return isPortalComponent && children
      ? React.createElement('div', {
        ref: (node: HTMLDivElement | null) => {
          if (node && portalContainer.current !== node) {
            portalContainer.current = node;
            setForceUpdateToken(Math.random());
          }
        },
        style: { display: 'contents' },
      })
      : _renderChildren();
  }, [props]);

  return React.createElement(
    React.Fragment,
    {},
    React.createElement(
      'div',
      getElementProps(),
      renderContent(),
      React.createElement(TemplateManager, {
        init: setTemplateManagerHooks,
      }),
    ),
    isPortalComponent && renderPortal(),
  );
})) as <P extends IHtmlOptions>(props: P & ComponentBaseProps, ref: React.ForwardedRef<ComponentBaseRef>) => ReactElement<any> | null;

export {
  IHtmlOptions,
  ComponentBaseRef,
  ComponentBase,
  ComponentBaseProps,
  DX_REMOVE_EVENT,
};
