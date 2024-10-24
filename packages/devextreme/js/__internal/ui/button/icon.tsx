import _extends from '@babel/runtime/helpers/esm/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import {
  createComponentVNode, createFragment, createVNode, Fragment, normalizeProps,
} from 'inferno';

import { getImageSourceType } from '@js/core/utils/icon';
import { combineClasses } from '@ts/core/utils/combine_classes';
import { getTemplate } from '@ts/core/r1/utils';

const _excluded = ['iconTemplate', 'position', 'source'];

export const IconProps = {
  position: 'left',
  source: '',
};

export class Icon extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get sourceType() {
    return getImageSourceType(this.props.source);
  }

  get cssClass() {
    return this.props.position !== 'left' ? 'dx-icon-right' : '';
  }

  get iconClassName() {
    const generalClasses = {
      'dx-icon': true,
      [this.cssClass]: !!this.cssClass,
    };
    const {
      source,
    } = this.props;
    if (this.sourceType === 'dxIcon') {
      return combineClasses(_extends({}, generalClasses, {
        [`dx-icon-${source}`]: true,
      }));
    }
    if (this.sourceType === 'fontIcon') {
      return combineClasses(_extends({}, generalClasses, {
        [String(source)]: !!source,
      }));
    }
    if (this.sourceType === 'image') {
      return combineClasses(generalClasses);
    }
    if (this.sourceType === 'svg') {
      return combineClasses(_extends({}, generalClasses, {
        'dx-svg-icon': true,
      }));
    }
    return '';
  }

  get restAttributes() {
    const _this$props = this.props;
    const restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return restProps;
  }

  render() {
    const {
      iconClassName,
      props: {
        source,
      },
      sourceType,
    } = this;

    const IconTemplate = getTemplate(this.props.iconTemplate);

    return createFragment([sourceType === 'dxIcon' && createVNode(1, 'i', iconClassName), sourceType === 'fontIcon' && createVNode(1, 'i', iconClassName), sourceType === 'image' && createVNode(1, 'img', iconClassName, null, 1, {
      alt: '',
      src: source,
    }), IconTemplate && createVNode(1, 'i', iconClassName, IconTemplate({}), 0)], 0);
  }
}
Icon.defaultProps = IconProps;
