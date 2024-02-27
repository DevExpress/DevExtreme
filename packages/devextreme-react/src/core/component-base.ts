import * as events from 'devextreme/events';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { requestAnimationFrame } from 'devextreme/animation/frame';
import { deferUpdate } from 'devextreme/core/utils/common';

import { TemplateManager } from './template-manager';
import { OptionsManager, scheduleGuards, unscheduleGuards } from './options-manager';
import { ITemplateMeta } from './template';
import { elementPropNames, getClassName } from './widget-config';
import { IConfigNode } from './configuration/config-node';
import { IExpectedChild } from './configuration/react/element';
import { buildConfigTree } from './configuration/react/tree';
import { isIE } from './configuration/utils';

import {
  DXRemoveCustomArgs,
  DXTemplateCreator,
  InitArgument,
  UpdateLocker,
} from './types';

import { RemovalLockerContext } from './helpers';

const DX_REMOVE_EVENT = 'dxremove';

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

abstract class ComponentBase<P extends IHtmlOptions> extends React.PureComponent<P> {
  // + Moved to helpers.ts
  static displayContentsStyle(): React.CSSProperties {
    return isIE()
      ? {
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
      }
      : { display: 'contents' };
  }

  // + useContext
  static contextType: React.Context<UpdateLocker> = RemovalLockerContext;

  // + useContext
  declare context: React.ContextType<typeof RemovalLockerContext> | undefined;

  // + props.widgetClass
  protected _WidgetClass: any;

  // + ref.getInstance
  protected _instance: any;

  // + ref.getElement
  protected _element: HTMLDivElement;

  // + local portalContainer
  protected portalContainer: HTMLElement | null;

  // + props.isPortalComponent
  protected isPortalComponent = false;

  // + props.defaults
  protected readonly _defaults: Record<string, string>;

  // + props.templateProps
  protected readonly _templateProps: ITemplateMeta[] = [];

  // + props.expectedChildren
  protected readonly _expectedChildren: Record<string, IExpectedChild>;

  // + props.subscribableOptions
  protected readonly subscribableOptions: string[];

  // + props.independentEvents
  protected readonly independentEvents: string[];

  // + local createDXTemplates
  private _createDXTemplates: DXTemplateCreator | undefined;

  // + local clearInstantiationModels
  private _clearInstantiationModels: (() => void) | undefined;

  // + local updateTemplates
  private _updateTemplates: ((callback: () => void) => void) | undefined;

  // + local childNodes
  private _childNodes: Node[] = [];

  // + local optionsManager
  private readonly _optionsManager: OptionsManager;

  // + props.useRequestAnimationFrameFlag
  protected useRequestAnimationFrameFlag = false;

  // + local useDeferUpdateForTemplates
  protected useDeferUpdateForTemplates = false;

  // + local guardsUpdateScheduled
  protected guardsUpdateScheduled = false;

  constructor(props: P) {
    super(props);

    // ref method - no binding required
    this._createWidget = this._createWidget.bind(this);

    // useCallback - no binding
    this._setTemplateManagerHooks = this._setTemplateManagerHooks.bind(this);

    // default ref value
    this._optionsManager = new OptionsManager();
  }

  // useEffect with empty deps
  public componentDidMount(): void {
    const { style } = this.props;

    if (this._childNodes?.length) {
      this._element.append(...this._childNodes);
    } else if (this._element.childNodes.length) {
      this._childNodes = Array.from(this._element.childNodes);
    }
    this._updateCssClasses(null, this.props);

    if (style) {
      this._setInlineStyles(style);
    }
  }

  // useEffect without deps
  public componentDidUpdate(prevProps: P): void {
    this._updateCssClasses(prevProps, this.props);

    const config = this._getConfig();
    const templateOptions = this._optionsManager.getTemplateOptions(config);
    const dxTemplates = this._createDXTemplates?.(templateOptions) || {};

    this._optionsManager.update(config, dxTemplates);
    this._scheduleTemplatesUpdate();
  }

  // useEffect with empty deps return value
  public componentWillUnmount(): void {
    this._lockParentOnRemoved();

    if (this._instance) {
      const dxRemoveArgs: DXRemoveCustomArgs = { isUnmounting: true };

      this._childNodes?.forEach((child) => child.parentNode?.removeChild(child));
      events.triggerHandler(this._element, DX_REMOVE_EVENT, dxRemoveArgs);
      this._instance.dispose();
    }
    this._optionsManager.dispose();

    this._unlockParentOnRemoved();
  }

  // ref method
  protected _createWidget(element?: Element): void {
    element = element || this._element;

    const config = this._getConfig();

    let options: any = {
      templatesRenderAsynchronously: true,
      ...this._optionsManager.getInitialOptions(config),
    };

    const templateOptions = this._optionsManager.getTemplateOptions(config);
    const dxTemplates = this._createDXTemplates?.(templateOptions);

    if (dxTemplates && Object.keys(dxTemplates).length) {
      options = {
        ...options,
        integrationOptions: {
          templates: dxTemplates,
        },
      };
    }

    this._clearInstantiationModels?.();

    this._instance = new this._WidgetClass(element, options);

    if (!this.useRequestAnimationFrameFlag) {
      this.useDeferUpdateForTemplates = this._instance.option(
        'integrationOptions.useDeferUpdateForTemplates',
      );
    }

    this._optionsManager.setInstance(this._instance, config, this.subscribableOptions, this.independentEvents);
    this._instance.on('optionChanged', this._optionsManager.onOptionChanged);
  }

  // useCallback
  private _scheduleTemplatesUpdate() {
    if (this.guardsUpdateScheduled) {
      return;
    }

    this.guardsUpdateScheduled = true;

    const updateFunc = this.useDeferUpdateForTemplates ? deferUpdate : requestAnimationFrame;

    updateFunc(() => {
      this.guardsUpdateScheduled = false;

      this._updateTemplates?.(() => scheduleGuards());
    });

    unscheduleGuards();
  }

  // useCallback
  private _getConfig(): IConfigNode {
    return buildConfigTree(
      {
        templates: this._templateProps,
        initialValuesProps: this._defaults,
        predefinedValuesProps: {},
        expectedChildren: this._expectedChildren,
      },
      this.props,
    );
  }

  // useCallback
  private _getElementProps(): Record<string, any> {
    const elementProps: Record<string, any> = {
      ref: (element: HTMLDivElement) => { this._element = element; },
    };

    elementPropNames.forEach((name) => {
      const { props } = this;
      if (name in props) {
        elementProps[name] = props[name];
      }
    });
    return elementProps;
  }

  // useCallback
  private _setInlineStyles(styles) {
    Object.entries(styles).forEach(
      ([name, value]) => {
        this._element.style[name] = value;
      },
    );
  }

  // useCallback
  private _updateCssClasses(prevProps: P | null, newProps: P) {
    const prevClassName = prevProps ? getClassName(prevProps) : undefined;
    const newClassName = getClassName(newProps);

    if (prevClassName === newClassName) { return; }

    if (prevClassName) {
      const classNames = prevClassName.split(' ').filter((c) => c);
      if (classNames.length) {
        this._element.classList.remove(...classNames);
      }
    }

    if (newClassName) {
      const classNames = newClassName.split(' ').filter((c) => c);
      if (classNames.length) {
        this._element.classList.add(...classNames);
      }
    }
  }

  // - (direct call to context)
  private _lockParentOnRemoved() {
    this.context?.lock();
  }

  // - (direct call to context)
  private _unlockParentOnRemoved() {
    this.context?.unlock();
  }

  // useCallback
  private _setTemplateManagerHooks({
    createDXTemplates,
    clearInstantiationModels,
    updateTemplates,
  }: InitArgument) {
    this._createDXTemplates = createDXTemplates;
    this._clearInstantiationModels = clearInstantiationModels;
    this._updateTemplates = updateTemplates;
  }

  // prop + useCallback
  protected renderChildren(): React.ReactNode {
    // @ts-expect-error TS2339
    const { children } = this.props;
    return children;
  }

  // useCallback
  protected renderContent(): React.ReactNode {
    // @ts-expect-error TS2339
    const { children } = this.props;

    return this.isPortalComponent && children
      ? React.createElement('div', {
        ref: (node: HTMLDivElement | null) => {
          if (node && this.portalContainer !== node) {
            this.portalContainer = node;
            this.forceUpdate();
          }
        },
        style: ComponentBase.displayContentsStyle(),
      })
      : this.renderChildren();
  }

  // useCallback
  protected renderPortal(): React.ReactNode {
    return this.portalContainer && createPortal(
      this.renderChildren(),
      this.portalContainer,
    );
  }

  public render(): React.ReactNode {
    return React.createElement(
      React.Fragment,
      {},
      React.createElement(
        'div',
        this._getElementProps(),
        this.renderContent(),
        React.createElement(TemplateManager, {
          init: this._setTemplateManagerHooks,
        }),
      ),
      this.isPortalComponent && this.renderPortal(),
    );
  }
}

export {
  IHtmlOptions,
  ComponentBase,
  DX_REMOVE_EVENT,
};
