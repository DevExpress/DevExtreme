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
  hideWave(event): void {
    hideWave(this.getConfig, event);
  }

  @Method()
  showWave(event): void {
    showWave(this.getConfig, event);
  }

  get getConfig(): InkRippleConfig {
    const { config } = this.props;
    return initConfig(config);
  }
}
