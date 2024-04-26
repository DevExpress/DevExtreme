import * as React from 'react';
import * as events from 'devextreme/events';

import {
  useContext,
  useImperativeHandle,
  forwardRef,
  useRef,
  useLayoutEffect,
  useCallback,
  useState,
  ReactElement,
} from 'react';

import { requestAnimationFrame } from 'devextreme/animation/frame';
import { deferUpdate } from 'devextreme/core/utils/common';
import { createPortal } from 'react-dom';

import { RemovalLockerContext, RestoreTreeContext } from './helpers';
import { OptionsManager, scheduleGuards, unscheduleGuards } from './options-manager';
import { DXRemoveCustomArgs, DXTemplateCreator, InitArgument } from './types';
import { elementPropNames, getClassName } from './widget-config';
import { buildConfigTree } from './configuration/react/tree';
import { TemplateManager } from './template-manager';
import { ComponentProps } from './component';

const DX_REMOVE_EVENT = 'dxremove';

type ComponentBaseProps = ComponentProps & {
  renderChildren?: () => Record<string, unknown>[] | null | undefined;
};

interface ComponentBaseRef {
  getInstance: () => any;
  getElement: () => HTMLDivElement | undefined;
  createWidget: (element?: Element) => void;
}

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

const ComponentBase = forwardRef<ComponentBaseRef, any>(
  <P extends IHtmlOptions>(
    props: P & ComponentBaseProps,
    ref: React.ForwardedRef<ComponentBaseRef>,
  ) => {
    const {
      templateProps = [],
      defaults = {},
      expectedChildren = {},
      isPortalComponent = false,
      useRequestAnimationFrameFlag = false,
      subscribableOptions = [],
      WidgetClass,
      independentEvents = [],
      renderChildren,
      beforeCreateWidget = () => undefined,
      afterCreateWidget = () => undefined,
    } = props;

    const [, setForceUpdateToken] = useState(0);
    const removalLocker = useContext(RemovalLockerContext);
    const restoreParentLink = useContext(RestoreTreeContext);
    const instance = useRef<any>();
    const element = useRef<HTMLDivElement>();
    const portalContainer = useRef<HTMLElement | null>();
    const useDeferUpdateForTemplates = useRef(false);
    const guardsUpdateScheduled = useRef(false);
    const childElementsDetached = useRef(false);
    const optionsManager = useRef<OptionsManager>(new OptionsManager());
    const childNodes = useRef<Node[]>();

    const createDXTemplates = useRef<DXTemplateCreator>();
    const clearInstantiationModels = useRef<() => void>();
    const updateTemplates = useRef<(callback: () => void) => void>();

    const prevPropsRef = useRef<P & ComponentBaseProps>();

    const restoreTree = useCallback(() => {
      if (childNodes.current?.length && element.current) {
        element.current.append(...childNodes.current);
        childElementsDetached.current = false;
      }

      if (restoreParentLink && element.current && !element.current.isConnected) {
        restoreParentLink();
      }
    }, [
      childNodes.current,
      element.current,
      childElementsDetached.current,
      restoreParentLink,
    ]);

    const updateCssClasses = useCallback((prevProps: (P & ComponentBaseProps) | undefined, newProps: P & ComponentBaseProps) => {
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
        const el = element.current;

        Object.entries(styles).forEach(
          ([name, value]) => {
            el.style[name] = value;
          },
        );
      }
    }, [element.current]);

    const getConfig = useCallback(() => buildConfigTree(
      {
        templates: templateProps,
        initialValuesProps: defaults,
        predefinedValuesProps: {},
        expectedChildren,
      },
      props,
    ), [
      templateProps,
      defaults,
      expectedChildren,
      props,
    ]);

    const setTemplateManagerHooks = useCallback(({
      createDXTemplates: createDXTemplatesFn,
      clearInstantiationModels: clearInstantiationModelsFn,
      updateTemplates: updateTemplatesFn,
    }: InitArgument) => {
      createDXTemplates.current = createDXTemplatesFn;
      clearInstantiationModels.current = clearInstantiationModelsFn;
      updateTemplates.current = updateTemplatesFn;
    }, [
      createDXTemplates.current,
      clearInstantiationModels.current,
      updateTemplates.current,
    ]);

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

      instance.current = new WidgetClass(el, options);

      if (!useRequestAnimationFrameFlag) {
        useDeferUpdateForTemplates.current = instance.current.option(
          'integrationOptions.useDeferUpdateForTemplates',
        );
      }

      optionsManager.current.setInstance(instance.current, config, subscribableOptions, independentEvents);
      instance.current.on('optionChanged', optionsManager.current.onOptionChanged);

      afterCreateWidget();
    }, [
      beforeCreateWidget,
      afterCreateWidget,
      element.current,
      optionsManager.current,
      createDXTemplates.current,
      clearInstantiationModels.current,
      WidgetClass,
      useRequestAnimationFrameFlag,
      useDeferUpdateForTemplates.current,
      instance.current,
      subscribableOptions,
      independentEvents,
      getConfig,
    ]);

    const onComponentUpdated = useCallback(() => {
      if (!optionsManager.current?.isInstanceSet) {
        return;
      }

      updateCssClasses(prevPropsRef.current, props);

      const config = getConfig();

      const templateOptions = optionsManager.current.getTemplateOptions(config);
      const dxTemplates = createDXTemplates.current?.(templateOptions) || {};

      optionsManager.current.update(config, dxTemplates);
      scheduleTemplatesUpdate();

      prevPropsRef.current = props;
    }, [
      optionsManager.current,
      prevPropsRef.current,
      createDXTemplates.current,
      scheduleTemplatesUpdate,
      updateCssClasses,
      getConfig,
      props,
    ]);

    const onComponentMounted = useCallback(() => {
      const { style } = props;

      if (childElementsDetached.current) {
        restoreTree();
      } else if (element.current?.childNodes.length) {
        childNodes.current = Array.from(element.current?.childNodes);
      }
      updateCssClasses(undefined, props);

      if (style) {
        setInlineStyles(style);
      }

      prevPropsRef.current = props;
    }, [
      childNodes.current,
      element.current,
      childElementsDetached.current,
      updateCssClasses,
      setInlineStyles,
      props,
    ]);

    const onComponentUnmounted = useCallback(() => {
      removalLocker?.lock();

      if (instance.current) {
        const dxRemoveArgs: DXRemoveCustomArgs = { isUnmounting: true };

        childNodes.current?.forEach((child) => child.parentNode?.removeChild(child));
        childElementsDetached.current = true;

        if (element.current) {
          events.triggerHandler(element.current, DX_REMOVE_EVENT, dxRemoveArgs);
        }

        instance.current.dispose();
      }
      optionsManager.current.dispose();

      removalLocker?.unlock();
    }, [
      removalLocker,
      instance.current,
      childNodes.current,
      element.current,
      optionsManager.current,
      childElementsDetached.current,
    ]);

    useLayoutEffect(() => {
      onComponentMounted();

      return () => {
        onComponentUnmounted();
      };
    }, []);

    useLayoutEffect(() => {
      onComponentUpdated();
    });

    useImperativeHandle(ref, () => (
      {
        getInstance() {
          return instance.current;
        },
        getElement() {
          return element.current;
        },
        createWidget(el) {
          createWidget(el);
        },
      }
    ), [instance.current, element.current, createWidget]);

    const _renderChildren = useCallback(() => {
      if (renderChildren) {
        return renderChildren();
      }

      // @ts-expect-error TS2339
      const { children } = props;
      return children;
    }, [props, renderChildren]);

    const renderPortal = useCallback(() => portalContainer.current && createPortal(
      _renderChildren(),
      portalContainer.current,
    ), [portalContainer.current, _renderChildren]);

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
    }, [
      props,
      isPortalComponent,
      portalContainer.current,
      _renderChildren,
    ]);

    return React.createElement(
      RestoreTreeContext.Provider,
      {
        value: restoreTree,
      },
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
  },
) as <P extends IHtmlOptions>(props: P & ComponentBaseProps & { ref?: React.Ref<ComponentBaseRef> }) => ReactElement | null;

export {
  IHtmlOptions,
  ComponentBaseRef,
  ComponentBase,
  ComponentBaseProps,
  DX_REMOVE_EVENT,
};
