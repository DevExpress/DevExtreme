import * as events from 'devextreme/events';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { OptionsManager } from './options-manager';
import { ITemplateMeta } from './template';
import TemplatesManager from './templates-manager';
import { TemplatesRenderer } from './templates-renderer';
import { TemplatesStore } from './templates-store';
import { elementPropNames, getClassName } from './widget-config';

import { IConfigNode } from './configuration/config-node';
import { IExpectedChild } from './configuration/react/element';
import { buildConfigTree } from './configuration/react/tree';

const DX_REMOVE_EVENT = 'dxremove';

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

abstract class ComponentBase<P extends IHtmlOptions> extends React.PureComponent<P> {
  protected _WidgetClass: any;

  protected _instance: any;

  protected _element: HTMLDivElement;

  protected portalContainer: HTMLElement | null;

  protected isPortalComponent = false;

  protected readonly _defaults: Record<string, string>;

  protected readonly _templateProps: ITemplateMeta[] = [];

  protected readonly _expectedChildren: Record<string, IExpectedChild>;

  protected readonly subscribableOptions: string[];

  protected readonly independentEvents: string[];

  private _templatesRendererRef: TemplatesRenderer | null;

  private _templatesStore: TemplatesStore;

  private _templatesManager: TemplatesManager;

  private _optionsManager: OptionsManager;

  private _useDeferUpdateForTemplates = false;

  constructor(props: P) {
    super(props);

    this._setTemplatesRendererRef = this._setTemplatesRendererRef.bind(this);
    this._createWidget = this._createWidget.bind(this);

    this._templatesStore = new TemplatesStore(() => {
      if (this._templatesRendererRef) {
        this._templatesRendererRef.scheduleUpdate(this._useDeferUpdateForTemplates);
      }
    });
    this._templatesManager = new TemplatesManager(this._templatesStore);
    this._optionsManager = new OptionsManager(this._templatesManager);
  }

  public componentDidMount(): void {
    this._updateCssClasses(null, this.props);
  }

  public componentDidUpdate(prevProps: P): void {
    this._updateCssClasses(prevProps, this.props);

    const config = this._getConfig();
    this._optionsManager.update(config);
    if (this._templatesRendererRef) {
      this._templatesRendererRef.scheduleUpdate(this._useDeferUpdateForTemplates);
    }
  }

  public componentWillUnmount(): void {
    if (this._instance) {
      events.triggerHandler(this._element, DX_REMOVE_EVENT);
      this._instance.dispose();
    }
    this._optionsManager.dispose();
  }

  protected _createWidget(element?: Element): void {
    element = element || this._element;

    const config = this._getConfig();
    this._instance = new this._WidgetClass(
      element,
      {
        templatesRenderAsynchronously: true,
        ...this._optionsManager.getInitialOptions(config),
      },
    );

    this._useDeferUpdateForTemplates = this._instance.option(
      'integrationOptions.useDeferUpdateForTemplates',
    );
    this._optionsManager.setInstance(
      this._instance, config, this.subscribableOptions, this.independentEvents,
    );
    this._instance.on('optionChanged', this._optionsManager.onOptionChanged);
  }

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

  private _setTemplatesRendererRef(instance: TemplatesRenderer | null) {
    this._templatesRendererRef = instance;
  }

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

  protected renderChildren(): React.ReactNode {
    const { children } = this.props;
    return children;
  }

  protected renderContent(): React.ReactNode {
    const { children } = this.props;

    return this.isPortalComponent && children
      ? React.createElement('div', {
        ref: (node: HTMLDivElement | null) => {
          const container = node ? node.parentElement : null;
          if (container && this.portalContainer !== container) {
            this.portalContainer = container;
            this.forceUpdate();
          }
        },
        style: {
          display: 'none',
        },
      })
      : this.renderChildren();
  }

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
        React.createElement(TemplatesRenderer, {
          templatesStore: this._templatesStore,
          ref: this._setTemplatesRendererRef,
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
