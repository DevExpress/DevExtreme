import _extends from '@babel/runtime/helpers/esm/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createVNode, normalizeProps } from 'inferno';

import { hideWave, initConfig, showWave } from '../../../ui/widget/utils.ink_ripple';

const _excluded = ['config'];

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

export interface InkRippleProps {
  config?: InkRippleConfig;
}

export class InkRipple extends BaseInfernoComponent<InkRippleProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly __getterCache: any = {};

  constructor(props: InkRippleProps) {
    super(props);
    this.state = {};
    this.hideWave = this.hideWave.bind(this);
    this.showWave = this.showWave.bind(this);
  }

  get getConfig(): InkRippleConfig {
    if (this.__getterCache.getConfig !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.__getterCache.getConfig;
    }
    // eslint-disable-next-line no-return-assign
    return this.__getterCache.getConfig = ((): InkRippleConfig => {
      const {
        config,
      } = this.props;
      return initConfig(config);
    })();
  }

  get restAttributes() {
    const _this$props = this.props;
    const restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  hideWave(opts): void {
    hideWave(this.getConfig, opts);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  showWave(opts): void {
    showWave(this.getConfig, opts);
  }

  componentWillUpdate(nextProps: InkRippleProps): void {
    if (this.props.config !== nextProps.config) {
      this.__getterCache.getConfig = undefined;
    }
  }

  render(): JSX.Element {
    return <div
      className="dx-inkripple"
      {...this.restAttributes}
    />;
  }
}

InkRipple.defaultProps = {
  config: {},
};
