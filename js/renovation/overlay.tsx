import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './widget';
import DxOverlay from '../ui/overlay';
import renderTemplate from './utils/render-template';

export const viewFunction = (viewModel: Overlay) => (
  <div ref={viewModel.widgetRef as any} className={viewModel.props.className} />
);
@ComponentBindings()
export class OverlayProps extends WidgetProps {
  @OneWay() shading?: boolean;

  @OneWay() positionConfig?: any;

  @OneWay() animationConfig?: any;

  @OneWay() width?: number | string;

  @OneWay() height?: number | string;

  @OneWay() maxHeight?: number | string | (() => number | string);

  @OneWay() dragEnabled?: boolean;

  @OneWay() target?: HTMLDivElement;

  @OneWay() container?: HTMLDivElement;

  @OneWay() closeOnOutsideClick?: boolean;

  @OneWay() onShowing?: () => void;

  @OneWay() onShown?: () => void;

  @OneWay() contentTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Overlay extends JSXComponent(OverlayProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Ref()
  contentRef!: HTMLDivElement;

  @Effect()
  setupWidget() {
    const { contentTemplate } = this.props;
    const template = contentTemplate ? (container) => {
      renderTemplate(contentTemplate, { container }, container);
    } : undefined;

    const instance = DxOverlay.getInstance(this.widgetRef);
    if (instance) {
      instance.option({ ...this.props, contentTemplate: template });
    } else {
      new DxOverlay(this.widgetRef, { // eslint-disable-line no-new
        ...this.props as any,
        contentTemplate: template,
      });
    }
  }
}
