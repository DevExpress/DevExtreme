/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-void */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import _extends from '@babel/runtime/helpers/esm/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import {
  hasTemplate, InfernoComponent, InfernoEffect, renderTemplate,
} from '@devextreme/runtime/inferno';
import type { RefObject } from 'inferno';
import { createRef as infernoCreateRef, createVNode } from 'inferno';

import { ConfigContext } from '../../../renovation/common/config_context';
import { getUpdatedOptions } from '../../../renovation/ui/common/utils/get_updated_options';

const excluded = ['valueChange'];
const excluded2 = ['componentProps', 'componentType', 'templateNames'];

const normalizeProps = (props): any => Object.keys(props).reduce((accumulator, key) => {
  if (props[key] !== undefined) {
    accumulator[key] = props[key];
  }
  return accumulator;
}, {});

export const viewFunction = (ref: any): any => {
  const {
    props: {
      componentProps: {
        className,
      },
    },
    restAttributes,
    widgetRef,
  } = ref;
  return normalizeProps(createVNode(1, 'div', className, null, 1, _extends({}, restAttributes), null, widgetRef));
};
export const DomComponentWrapperProps = {};
export class DomComponentWrapper extends InfernoComponent {
  public state: any = {};

  public refs: any;

  private readonly widgetRef: RefObject<Element>;

  private prevProps: any;

  private instance: any;

  get config(): any {
    if (this.context[(ConfigContext as any).id]) {
      return this.context[(ConfigContext as any).id];
    }
    return (ConfigContext as any).defaultValue;
  }

  constructor(props: any) {
    super(props);
    this.state = {};
    this.widgetRef = infernoCreateRef();
    this.getInstance = this.getInstance.bind(this);
    this.setupWidget = this.setupWidget.bind(this);
    this.updateWidget = this.updateWidget.bind(this);
  }

  createEffects(): InfernoEffect[] {
    return [
      new InfernoEffect(this.setupWidget, []),
      new InfernoEffect(
        this.updateWidget,
        [
          this.props.componentProps,
          this.config,
          this.props.templateNames,
        ],
      )];
  }

  updateEffects(): void {
    let _this$_effects$;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 || _this$_effects$.update([this.props.componentProps, this.config, this.props.templateNames]);
  }

  setupWidget() {
    const componentInstance = new (this.props.componentType as any)(this.widgetRef.current, this.properties);
    this.instance = componentInstance;
    return () => {
      componentInstance.dispose();
      this.instance = null;
    };
  }

  updateWidget() {
    const instance = this.getInstance();
    if (!instance) {
      return;
    }
    const updatedOptions = getUpdatedOptions(this.prevProps || {}, this.properties);
    if (updatedOptions.length) {
      instance.beginUpdate();
      updatedOptions.forEach((_ref2) => {
        const {
          path,
          value,
        } = _ref2;
        instance.option(path, value);
      });
      instance.endUpdate();
    }
    this.prevProps = this.properties;
  }

  get properties() {
    let _this$config;
    const normalizedProps = normalizeProps(this.props.componentProps);
    const {
      valueChange,
    } = normalizedProps;
    const restProps = _objectWithoutPropertiesLoose(normalizedProps, excluded);
    const properties = _extends({
      rtlEnabled: !!((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.rtlEnabled),
      isRenovated: true,
    }, restProps);
    if (valueChange) {
      properties.onValueChanged = (_ref3) => {
        const {
          value,
        } = _ref3;
        return valueChange(value);
      };
    }
    const templates = this.props.templateNames as any;
    templates.forEach((name) => {
      if (hasTemplate(name, properties, this)) {
        properties[name] = (item, index, container) => {
          renderTemplate((this.props.componentProps as any)[name], {
            item,
            index,
            container,
          }, this);
        };
      }
    });
    return properties;
  }

  get restAttributes() {
    const _this$props = this.props;
    const restProps = _objectWithoutPropertiesLoose(_this$props, excluded2);
    return restProps;
  }

  getInstance() {
    return this.instance;
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: _extends({}, props),
      widgetRef: this.widgetRef,
      config: this.config,
      properties: this.properties,
      restAttributes: this.restAttributes,
    });
  }
}
DomComponentWrapper.defaultProps = DomComponentWrapperProps;
