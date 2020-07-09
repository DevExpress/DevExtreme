import {
  Component, ComponentBindings, JSXComponent, OneWay, Method,
} from 'devextreme-generator/component_declaration/common';
import { initConfig, showWave, hideWave } from '../ui/widget/utils.ink_ripple';

// TODO: remake old ink ripple in new JSX component
export const viewFunction = (model: InkRipple) => (
  <div
    className="dx-inkripple"
    {...model.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  />
);

@ComponentBindings()
export class InkRippleProps {
  @OneWay() config?: any = {};
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class InkRipple extends JSXComponent(InkRippleProps) {
  @Method()
  hideWave(event) {
    hideWave(this.getConfig, event);
  }

  @Method()
  showWave(event) {
    showWave(this.getConfig, event);
  }

  get getConfig() {
    const { config } = this.props;
    return initConfig(config);
  }
}
