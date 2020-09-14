import {
  Ref, Effect, Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './common/widget';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable import/named */
import LegacyOverlay, { Options } from '../../ui/overlay';
import { dxElement } from '../../core/element';
import { template } from '../../core/templates/template';
import { animationConfig } from '../../animation/fx';

/* eslint-enable import/named */

export const viewFunction = ({ widgetRef }: Overlay) => (<div ref={widgetRef as any} />);

@ComponentBindings()
export class OverlayProps extends WidgetProps {
  @OneWay() integrationOptions?: object = {};

  @OneWay() templatesRenderAsynchronously?: boolean = false;

  @OneWay() shading?: boolean = true;

  @OneWay() width?: number|string|(() => number) = undefined;

  @OneWay() height?: number|string|(() => number) = undefined;

  @OneWay() closeOnOutsideClick?: boolean = false;

  @OneWay() closeOnTargetScroll?: boolean = false;

  @OneWay() animation?: animationConfig = {
    type: 'pop', duration: 300, to: { opacity: 0, scale: 0.55 }, from: { opacity: 1, scale: 1 },
  };

  @OneWay() visible?: boolean = false;

  @OneWay() container?: string | Element | JQuery = undefined;

  @OneWay() propagateOutsideClick?: boolean = true;

  @OneWay() _checkParentVisibility?: boolean = false;

  @OneWay() rtlEnabled?: boolean = false;

  @OneWay() contentTemplate?: template | ((contentElement: dxElement) => string | Element | JQuery) = 'content';

  @OneWay() maxWidth?: number | string | (() => number | string) | null = null;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Overlay extends JSXComponent(OverlayProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  updateWidget(): void {
    const widget = LegacyOverlay.getInstance(this.widgetRef);
      widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    const widget = new LegacyOverlay(this.widgetRef, this.properties);

    return (): void => widget.dispose();
  }

  get properties(): Options {
    return this.props as Options;
  }
}
