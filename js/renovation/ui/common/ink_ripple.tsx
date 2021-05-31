import {
  Component, ComponentBindings, JSXComponent, OneWay, Method,
} from '@devextreme-generator/declarations';
import { initConfig, showWave, hideWave } from '../../../ui/widget/utils.ink_ripple';

// TODO: remake old ink ripple in new JSX component
export const viewFunction = (model: InkRipple): JSX.Element => (
  <div
    className="dx-inkripple"
    {...model.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  />
);

export interface InkRippleConfig {
  isCentered?: boolean;
  useHoldAnimation?: boolean;
  waveSizeCoefficient?: number;
  wavesNumber?: number;
  durations?: {
    showingScale: number;
    hidingScale: number;
    hidingOpacity: number;
  };
}

@ComponentBindings()
export class InkRippleProps {
  @OneWay() config?: InkRippleConfig = {};
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class InkRipple extends JSXComponent(InkRippleProps) {
  @Method()
  hideWave(opts: Event | { element?: HTMLElement; event: Event }): void {
    hideWave(this.getConfig, opts);
  }

  @Method()
  showWave(opts: Event | { element?: HTMLElement; event: Event; wave?: number }): void {
    showWave(this.getConfig, opts);
  }

  get getConfig(): InkRippleConfig {
    const { config } = this.props;
    return initConfig(config);
  }
}
