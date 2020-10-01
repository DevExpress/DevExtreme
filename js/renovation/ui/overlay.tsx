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
import { DomComponentWrapper } from './common/dom_component_wrapper';

/* eslint-enable import/named */

export const viewFunction = ({ props, restAttributes }: Overlay): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyOverlay}
    componentProps={props}
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
export class Overlay extends JSXComponent(OverlayProps) { }
