import { resize as resizeEvent, visibility as visibilityEvents } from '@js/common/core/events/short';
import config from '@js/core/config';
import type { DOMComponentOptions } from '@js/core/dom_component';
import { getPublicElement } from '@js/core/element';
import { cleanDataRecursive } from '@js/core/element_data';
import errors from '@js/core/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error
import { grep, noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { attachInstanceToElement, getInstanceByElement } from '@js/core/utils/public_component';
import windowResizeCallbacks from '@js/core/utils/resize_callbacks';
import { addShadowDomStyles } from '@js/core/utils/shadow_dom';
import { isDefined, isFunction, isString } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import license, { peekValidationPerformed } from '@ts/core/license/license_validation';
import TemplateManagerModule from '@ts/core/m_template_manager';

import { Component } from './component';
import type { OptionChanged } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Properties<TComponent = any> extends DOMComponentOptions<TComponent> {
  _ignoreFunctionValueDeprecation?: boolean;

  integrationOptions?: Record<string, unknown>;

  nestedComponentOptions?: (context: TComponent) => void;

  modelByElement?: ($element: dxElementWrapper) => unknown;
}

class DOMComponent<
  TComponent extends Component<TComponent, TProperties>,
  TProperties extends Properties = Properties,
> extends Component<TComponent, TProperties> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static _classCustomRules: any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _customClass: any;

  private _$element!: dxElementWrapper;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _windowResizeCallBack: any;

  private _isHidden?: boolean;

  private _requireRefresh?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _templateManager!: any;

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  static getInstance(element) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getInstanceByElement($(element), this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static defaultOptions(rule): void {
    this._classCustomRules = Object.hasOwnProperty.bind(this)('_classCustomRules') && this._classCustomRules ? this._classCustomRules : [];
    this._classCustomRules.push(rule);
  }

  _getDefaultOptions(): TProperties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {

      width: undefined,

      height: undefined,

      rtlEnabled: config().rtlEnabled,

      elementAttr: {},

      disabled: false,

      integrationOptions: {},
    }, this._useTemplates() ? TemplateManagerModule.TemplateManager.createDefaultOptions() : {});
  }

  ctor(element: Element, options: TProperties): void {
    this._customClass = null;

    this._createElement(element);
    attachInstanceToElement(this._$element, this, this._dispose);

    super.ctor(options);
    const validationAlreadyPerformed = peekValidationPerformed();
    // @ts-expect-error
    license.validateLicense(config().licenseKey);
    if (!validationAlreadyPerformed && peekValidationPerformed()) {
      config({ licenseKey: '' });
    }
  }

  _createElement(element: Element): void {
    this._$element = $(element);
  }

  _getSynchronizableOptionsForCreateComponent(): (keyof TProperties)[] {
    // @ts-expect-error
    return ['rtlEnabled', 'disabled', 'templatesRenderAsynchronously'];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _checkFunctionValueDeprecation(optionNames): void {
    if (!this.option('_ignoreFunctionValueDeprecation')) {
      optionNames.forEach((optionName) => {
        if (isFunction(this.option(optionName))) {
          errors.log('W0017', optionName);
        }
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _visibilityChanged(value: boolean): void {}

  _dimensionChanged(): void {}

  _init(): void {
    super._init();
    this._checkFunctionValueDeprecation([
      'width', 'height',
      'maxHeight', 'maxWidth',
      'minHeight', 'minWidth',
      'popupHeight', 'popupWidth',
    ]);
    this._attachWindowResizeCallback();
    this._initTemplateManager();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _setOptionsByDevice(instanceCustomRules): void {
    // @ts-expect-error
    // eslint-disable-next-line max-len
    super._setOptionsByDevice([].concat(this.constructor._classCustomRules || [], instanceCustomRules || []));
  }

  _isInitialOptionValue(name: string): boolean {
    // @ts-expect-error
    const isCustomOption = this.constructor._classCustomRules
            // @ts-expect-error
            // eslint-disable-next-line max-len
            && Object.prototype.hasOwnProperty.call(this._convertRulesToOptions(this.constructor._classCustomRules), name);

    return !isCustomOption && super._isInitialOptionValue(name);
  }

  _attachWindowResizeCallback(): void {
    if (this._isDimensionChangeSupported()) {
      // eslint-disable-next-line no-multi-assign
      const windowResizeCallBack = this._windowResizeCallBack = this._dimensionChanged.bind(this);

      windowResizeCallbacks.add(windowResizeCallBack);
    }
  }

  _isDimensionChangeSupported(): boolean {
    return this._dimensionChanged !== DOMComponent.prototype._dimensionChanged;
  }

  _renderComponent(): void {
    addShadowDomStyles(this.$element());

    this._initMarkup();

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    hasWindow() && this._render();
  }

  _initMarkup(): void {
    const { rtlEnabled } = this.option() || {};

    this._renderElementAttributes();
    this._toggleRTLDirection(rtlEnabled);
    this._renderVisibilityChange();
    this._renderDimensions();
  }

  _render(): void {
    this._attachVisibilityChangeHandlers();
  }

  _renderElementAttributes(): void {
    const { elementAttr } = this.option() || {};
    const attributes = extend({}, elementAttr);
    const classNames = attributes.class;

    delete attributes.class;
    // @ts-expect-error
    this.$element()
      .attr(attributes)
      // @ts-expect-error
      .removeClass(this._customClass)
      .addClass(classNames);

    this._customClass = classNames;
  }

  _renderVisibilityChange(): void {
    if (this._isDimensionChangeSupported()) {
      this._attachDimensionChangeHandlers();
    }

    if (this._isVisibilityChangeSupported()) {
      const $element = this.$element();

      $element.addClass('dx-visibility-change-handler');
    }
  }

  _renderDimensions(): void {
    const $element = this.$element();
    const element = $element.get(0);
    const width = this._getOptionValue('width', element);
    const height = this._getOptionValue('height', element);

    if (this._isCssUpdateRequired(element, height, width)) {
      $element.css({
        width: width === null ? '' : width,
        height: height === null ? '' : height,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _isCssUpdateRequired(element, height, width): boolean {
    return !!(isDefined(width) || isDefined(height) || element.style.width || element.style.height);
  }

  _attachDimensionChangeHandlers(): void {
    const $el = this.$element();
    const namespace = `${this.NAME}VisibilityChange`;

    resizeEvent.off($el, { namespace });
    resizeEvent.on($el, () => this._dimensionChanged(), { namespace });
  }

  _attachVisibilityChangeHandlers(): void {
    if (this._isVisibilityChangeSupported()) {
      const $el = this.$element();
      const namespace = `${this.NAME}VisibilityChange`;

      this._isHidden = !this._isVisible();
      visibilityEvents.off($el, { namespace });
      visibilityEvents.on(
        $el,
        () => this._checkVisibilityChanged('shown'),
        () => this._checkVisibilityChanged('hiding'),
        { namespace },
      );
    }
  }

  _isVisible(): boolean {
    const $element = this.$element();

    return $element.is(':visible');
  }

  _checkVisibilityChanged(action: 'shown' | 'hiding'): void {
    const isVisible = this._isVisible();

    if (isVisible) {
      if (action === 'hiding' && !this._isHidden) {
        this._visibilityChanged(false);
        this._isHidden = true;
      } else if (action === 'shown' && this._isHidden) {
        this._isHidden = false;
        this._visibilityChanged(true);
      }
    }
  }

  _isVisibilityChangeSupported(): boolean {
    return this._visibilityChanged !== DOMComponent.prototype._visibilityChanged && hasWindow();
  }

  _clean(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _modelByElement(element: dxElementWrapper): unknown | undefined {
    const { modelByElement } = this.option();
    const $element = this.$element();

    return modelByElement ? modelByElement($element) : undefined;
  }

  _invalidate(): void {
    if (this._isUpdateAllowed()) {
      throw errors.Error('E0007');
    }

    this._requireRefresh = true;
  }

  _refresh(): void {
    this._clean();
    this._renderComponent();
  }

  _dispose(): void {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-unused-expressions
    this._templateManager && this._templateManager.dispose();
    super._dispose();
    this._clean();
    this._detachWindowResizeCallback();
  }

  _detachWindowResizeCallback(): void {
    if (this._isDimensionChangeSupported()) {
      windowResizeCallbacks.remove(this._windowResizeCallBack);
    }
  }

  _toggleRTLDirection(rtl: boolean | undefined): void {
    const $element = this.$element();

    $element.toggleClass('dx-rtl', rtl);
  }

  _createComponent<TTComponent>(
    element: string | HTMLElement | dxElementWrapper,
    component: string | (new (...args) => TTComponent),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    componentConfiguration: TTComponent extends Component<any, infer TTProperties>
      ? TTProperties
      : Record<string, unknown>,
  ): TTComponent {
    const configuration = componentConfiguration ?? {};

    const synchronizableOptions = grep(
      this._getSynchronizableOptionsForCreateComponent(),
      (value) => !(value in configuration),
    );

    const { integrationOptions } = this.option();
    let { nestedComponentOptions } = this.option();

    nestedComponentOptions = nestedComponentOptions ?? noop;

    const nestedComponentConfig = extend(
      { integrationOptions },
      nestedComponentOptions(this),
    );

    synchronizableOptions.forEach(
      // eslint-disable-next-line no-return-assign
      (optionName) => nestedComponentConfig[optionName] = this.option(optionName),
    );

    this._extendConfig(configuration, nestedComponentConfig);

    // eslint-disable-next-line no-void
    let instance = void 0;

    if (isString(component)) {
      const $element = $(element)[component](configuration);

      instance = $element[component]('instance');
    } else if (element) {
      // @ts-expect-error
      instance = component.getInstance(element);

      if (instance) {
        // @ts-expect-error
        instance.option(configuration);
      } else {
        // @ts-expect-error
        // eslint-disable-next-line new-cap
        instance = new component(element, configuration);
      }
    }

    if (instance) {
      const optionChangedHandler = ({ name, value }): void => {
        if (synchronizableOptions.includes(name)) {
          // @ts-expect-error
          instance.option(name, value);
        }
      };

      this.on('optionChanged', optionChangedHandler);
      // @ts-expect-error
      instance.on('disposing', () => this.off('optionChanged', optionChangedHandler));
    }

    // @ts-expect-error
    return instance;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _extendConfig(configuration, extendConfig): void {
    each(extendConfig, (key, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !Object.prototype.hasOwnProperty.call(configuration, key) && (configuration[key] = value);
    });
  }

  _defaultActionConfig(): { context: TComponent; component: TComponent } {
    const $element = this.$element();
    const context = this._modelByElement($element);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._defaultActionConfig(), { context });
  }

  _defaultActionArgs(): { component: TComponent; element?: dxElementWrapper; model?: unknown } {
    const $element = this.$element();
    const model = this._modelByElement($element);
    const element = this.element();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._defaultActionArgs(), { element, model });
  }

  _optionChanged(args: OptionChanged<TProperties> | Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'width':
      case 'height':
        this._renderDimensions();
        break;
      case 'rtlEnabled':
        this._invalidate();
        break;
      case 'elementAttr':
        this._renderElementAttributes();
        break;
      case 'disabled':
      case 'integrationOptions':
        break;
      default:
        super._optionChanged(args);
        break;
    }
  }

  _removeAttributes(element: Element): void {
    const attrs = element.attributes;

    // eslint-disable-next-line no-plusplus
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];

      if (attr) {
        const { name } = attr;

        // eslint-disable-next-line @typescript-eslint/prefer-includes
        if (!name.indexOf('aria-') || name.indexOf('dx-') !== -1
                    || name === 'role' || name === 'style' || name === 'tabindex') {
          element.removeAttribute(name);
        }
      }
    }
  }

  _removeClasses(element: Element): void {
    element.className = element.className
      .split(' ')
      .filter((cssClass) => cssClass.lastIndexOf('dx-', 0) !== 0)
      .join(' ');
  }

  _updateDOMComponent(renderRequired: boolean): void {
    if (renderRequired) {
      this._renderComponent();
    } else if (this._requireRefresh) {
      this._requireRefresh = false;
      this._refresh();
    }
  }

  endUpdate(): void {
    const renderRequired = this._isInitializingRequired();

    super.endUpdate();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this._isUpdateAllowed() && this._updateDOMComponent(renderRequired);
  }

  $element(): dxElementWrapper {
    return this._$element;
  }

  element(): HTMLElement {
    const $element = this.$element();

    return getPublicElement($element);
  }

  dispose(): void {
    const element = this.$element().get(0);

    cleanDataRecursive(element, true);
    element.textContent = '';
    this._removeAttributes(element);
    this._removeClasses(element);
  }

  resetOption(optionName: string): void {
    super.resetOption(optionName);

    if (optionName === 'width' || optionName === 'height') {
      const initialOption = this.initialOption(optionName);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !isDefined(initialOption) && this.$element().css(optionName, '');
    }
  }

  _getAnonymousTemplateName(): void {
    // eslint-disable-next-line no-void
    return void 0;
  }

  _initTemplateManager(): undefined {
    // eslint-disable-next-line no-void
    if (this._templateManager || !this._useTemplates()) return void 0;

    const { integrationOptions = {} } = this.option();
    const { createTemplate } = integrationOptions;

    this._templateManager = new TemplateManagerModule.TemplateManager(
      createTemplate,
      this._getAnonymousTemplateName(),
    );
    this._initTemplates();

    return undefined;
  }

  _initTemplates(): void {
    const {
      templates,
      anonymousTemplateMeta,
    } = this._templateManager.extractTemplates(this.$element());
    const anonymousTemplate = this.option(`integrationOptions.templates.${anonymousTemplateMeta.name}`);

    templates.forEach(({ name, template }) => {
      this._options.silent(`integrationOptions.templates.${name}`, template);
    });

    if (anonymousTemplateMeta.name && !anonymousTemplate) {
      this._options.silent(`integrationOptions.templates.${anonymousTemplateMeta.name}`, anonymousTemplateMeta.template);
      this._options.silent('_hasAnonymousTemplateContent', true);
    }
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  _getTemplateByOption(optionName) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getTemplate(this.option(optionName));
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  _getTemplate(templateSource) {
    const templates = this.option('integrationOptions.templates');
    const isAsyncTemplate = this.option('templatesRenderAsynchronously');
    const skipTemplates = this.option('integrationOptions.skipTemplates');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._templateManager.getTemplate(
      templateSource,
      templates,
      {
        isAsyncTemplate,
        skipTemplates,
      },
      this,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _saveTemplate(name, template): void {
    this._setOptionWithoutOptionChange(
      `integrationOptions.templates.${name}`,
      this._templateManager._createTemplate(template),
    );
  }

  _useTemplates(): boolean {
    return true;
  }
}

export default DOMComponent;
