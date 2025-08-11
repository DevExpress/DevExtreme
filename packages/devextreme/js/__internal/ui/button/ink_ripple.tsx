import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import { hideWave, initConfig, showWave } from '@ts/core/utils/m_ink_ripple';

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

export const defaultInkRippleProps = {
  config: {},
};

export class InkRipple extends BaseInfernoComponent<InkRippleProps> {
  private readonly __getterCache: { getConfig?: InkRippleConfig } = {};

  constructor(props: InkRippleProps) {
    super(props);
    this.state = {};
    this.hideWave = this.hideWave.bind(this);
    this.showWave = this.showWave.bind(this);
  }

  get getConfig(): InkRippleConfig {
    if (this.__getterCache.getConfig === undefined) {
      this.__getterCache.getConfig = initConfig(this.props.config);
    }

    return this.__getterCache.getConfig;
  }

  get restAttributes(): Record<string, unknown> {
    const { config, ...restProps } = this.props;

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

InkRipple.defaultProps = defaultInkRippleProps;
