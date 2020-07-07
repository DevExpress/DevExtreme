import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './widget';
import DxTooltip from '../ui/tooltip';
import renderTemplate from './utils/render-template';

export const viewFunction = (viewModel: Tooltip) => (
  <div ref={viewModel.widgetRef as any} className={viewModel.props.className} />);

@ComponentBindings()
export class TooltipProps extends WidgetProps {
  @OneWay() maxHeight?: number | string;

  @OneWay() rtlEnabled?: boolean;

  @OneWay() target?: HTMLDivElement;

  @OneWay() closeOnTargetScroll?: () => boolean;

  @OneWay() onShowing?: () => void;

  @OneWay() onShown?: () => void;

  @OneWay() contentTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Tooltip extends JSXComponent(TooltipProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  setupWidget() {
    const { contentTemplate } = this.props;
    const template = contentTemplate ? (container) => {
      renderTemplate(contentTemplate, { container }, container);
    } : undefined;

    // debugger;
    // eslint-disable-next-line no-new
    new DxTooltip(this.widgetRef, {
      ...this.props as any,
      contentTemplate: template,
    });
  }
}
