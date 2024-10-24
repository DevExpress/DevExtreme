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

export class InkRipple extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
    this.hideWave = this.hideWave.bind(this);
    this.showWave = this.showWave.bind(this);
  }

  get getConfig() {
    if (this.__getterCache.getConfig !== undefined) {
      return this.__getterCache.getConfig;
    }
    return this.__getterCache.getConfig = (() => {
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

  hideWave(opts) {
    hideWave(this.getConfig, opts);
  }

  showWave(opts) {
    showWave(this.getConfig, opts);
  }

  componentWillUpdate(nextProps, nextState, context) {
    if (this.props.config !== nextProps.config) {
      this.__getterCache.getConfig = undefined;
    }
  }

  render() {
    return normalizeProps(createVNode(1, 'div', 'dx-inkripple', null, 1, _extends({}, this.restAttributes)));
  }
}

InkRipple.defaultProps = {
  config: {},
};
