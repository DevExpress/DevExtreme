import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable import/named */
import LegacyOverlay from '../../ui/overlay/ui.overlay';
import { UserDefinedElement, DxElement } from '../../core/element';
import { template } from '../../core/templates/template';
import { animationConfig } from '../../animation/fx';
import { positionConfig } from '../../animation/position';
/* eslint-enable import/named */
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { BaseWidgetProps } from './common/base_props';

export const viewFunction = ({
  props,
  restAttributes,
}: Overlay): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyOverlay}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class OverlayProps extends BaseWidgetProps {
  @OneWay() integrationOptions? = {};

  @OneWay() templatesRenderAsynchronously? = false;

  @OneWay() shading? = true;

  @OneWay() width?: number | string | (() => number | string);

  @OneWay() height?: number | string | (() => number | string);

  @OneWay() closeOnOutsideClick? = false;

  @OneWay() closeOnTargetScroll? = false;

  @OneWay() animation?: animationConfig | null = {
    type: 'pop', duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 },
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  @OneWay() position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;

  @OneWay() visible?: boolean = false;

  @OneWay() container?: string | Element;

  @OneWay() propagateOutsideClick? = true;

  @OneWay() _checkParentVisibility? = false;

  @OneWay() rtlEnabled? = false;

  @OneWay() contentTemplate?: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'content';

  @OneWay() maxWidth?: number | string | (() => number | string) | null = null;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Overlay extends JSXComponent(OverlayProps) { }
