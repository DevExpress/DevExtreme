import * as events from 'devextreme/events';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { TemplateManager } from './template-manager-new';

import { OptionsManager, unscheduleGuards } from './options-manager';
import { ITemplateMeta } from './template';
import { elementPropNames, getClassName } from './widget-config';

import { IConfigNode } from './configuration/config-node';
import { IExpectedChild } from './configuration/react/element';
import { buildConfigTree } from './configuration/react/tree';
import { isIE } from './configuration/utils';
import { DXTemplateCreator, UpdateLocker } from './types-new';
import { OnRemovedLockerContext } from './helpers';

const DX_REMOVE_EVENT = 'dxremove';

interface IHtmlOptions {
  id?: string;
  className?: string;
  style?: any;
}

abstract class ComponentBase<P extends IHtmlOptions> extends React.PureComponent<P> {
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

  static contextType?: React.Context<UpdateLocker> | undefined = OnRemovedLockerContext;

  declare context: React.ContextType<typeof OnRemovedLockerContext> | undefined;

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

  private _createDXTemplates: DXTemplateCreator | undefined;

  private _clearRenderedInstances: () => void | undefined;

  private _childNodes: Node[] = [];

  private readonly _optionsManager: OptionsManager;

  protected useRequestAnimationFrameFlag = false;

  protected useDeferUpdateForTemplates = false;

  constructor(props: P) {
    super(props);

    this._createWidget = this._createWidget.bind(this);
    this._setTemplateManagerHooks = this._setTemplateManagerHooks.bind(this);

    this._optionsManager = new OptionsManager();
  }

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

  public componentDidUpdate(prevProps: P): void {
    this._updateCssClasses(prevProps, this.props);

    const config = this._getConfig();
    const templateOptions = this._optionsManager.getTemplateOptions(config);
    const dxTemplates = this._createDXTemplates?.(templateOptions) || {};

    this._optionsManager.update(config, dxTemplates);
    unscheduleGuards();
  }

  public componentWillUnmount(): void {
    this.context?.lock();

    if (this._instance) {
      this._childNodes?.forEach((child) => child.parentNode?.removeChild(child));
      events.triggerHandler(this._element, DX_REMOVE_EVENT, { fromReactUnmount: true });
      this._instance.dispose();
    }
    this._optionsManager.dispose();

    this.context?.unlock();
  }

  protected _createWidget(element?: Element): void {
    element = element || this._element;

    const config = this._getConfig();

    let options: any = {
      templatesRenderAsynchronously: true,
      ...this._optionsManager.getInitialOptions(config)
    };

    const templateOptions = this._optionsManager.getTemplateOptions(config);

    const dxTemplates = this._createDXTemplates?.(templateOptions);

    if (dxTemplates) {
      options = {
        ...options,
        integrationOptions: {
          templates: dxTemplates
        },
      };
    }

    this._clearRenderedInstances?.();

    this._instance = new this._WidgetClass(element, options);

    if (!this.useRequestAnimationFrameFlag) {
      this.useDeferUpdateForTemplates = this._instance.option(
        'integrationOptions.useDeferUpdateForTemplates',
      );
    }

    this._optionsManager.setInstance(this._instance, config, this.subscribableOptions, this.independentEvents);
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

  private _setInlineStyles(styles) {
    Object.entries(styles).forEach(
      ([name, value]) => {
        this._element.style[name] = value;
      },
    );
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

  private _setTemplateManagerHooks(createDXTemplates: DXTemplateCreator, clearRenderedInstances: () => void)  {
    this._createDXTemplates = createDXTemplates;
    this._clearRenderedInstances = clearRenderedInstances;
  };

  protected renderChildren(): React.ReactNode {
    // @ts-expect-error TS2339
    const { children } = this.props;
    return children;
  }

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
          init: this._setTemplateManagerHooks
        }),
      ),
      this.isPortalComponent && this.renderPortal()
    );
  }
}

export {
  IHtmlOptions,
  ComponentBase,
  DX_REMOVE_EVENT,
};
