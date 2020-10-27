import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './common/widget';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable import/named */
import LegacyOverlay from '../../ui/overlay';
import { dxElement } from '../../core/element';
import { template } from '../../core/templates/template';
import { animationConfig } from '../../animation/fx';
/* eslint-enable import/named */
import { DomComponentWrapper } from './common/dom_component_wrapper';

export const viewFunction = ({
  props: { rootElementRef },
  componentProps,
  restAttributes,
}: Overlay): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef as any}
    componentType={LegacyOverlay}
    componentProps={componentProps}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class OverlayProps extends WidgetProps {
  @OneWay() integrationOptions? = {};

  @OneWay() templatesRenderAsynchronously? = false;

  @OneWay() shading?= true;

  @OneWay() width?: number | string | (() => number| string);

  @OneWay() height?: number | string | (() => number| string);

  @OneWay() closeOnOutsideClick? = false;

  @OneWay() closeOnTargetScroll? = false;

  @OneWay() animation?: animationConfig | null = {
    type: 'pop', duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 },
  };

  @OneWay() visible?: boolean = false;

  @OneWay() container?: string | Element;

  @OneWay() propagateOutsideClick? = true;

  @OneWay() _checkParentVisibility? = false;

  @OneWay() rtlEnabled?= false;

  @OneWay() contentTemplate?: template | ((contentElement: dxElement) => string | Element | JQuery) = 'content';

  @OneWay() maxWidth?: number | string | (() => number | string) | null = null;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Overlay extends JSXComponent(OverlayProps) {
  get componentProps(): WidgetProps {
    const {
      rootElementRef,
      ...restProps
    } = this.props;

    return restProps;
  }
}
