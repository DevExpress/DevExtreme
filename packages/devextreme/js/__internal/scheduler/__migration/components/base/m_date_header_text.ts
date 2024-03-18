import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { createFragment, createVNode } from 'inferno';

export const viewFunction = (_ref) => {
  const {
    props: {
      splitText,
      text,
    },
    textParts,
  } = _ref;
  return createFragment(splitText ? textParts.map((part) => createVNode(1, 'div', 'dx-scheduler-header-panel-cell-date', createVNode(1, 'span', null, part, 0), 2)) : text, 0);
};
export const DateHeaderTextProps = {
  text: '',
  splitText: false,
};
export class DateHeaderText extends BaseInfernoComponent {
  private readonly __getterCache: any;

  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
  }

  get textParts() {
    if (this.__getterCache.textParts !== undefined) {
      return this.__getterCache.textParts;
    }
    // eslint-disable-next-line no-return-assign
    return this.__getterCache.textParts = (() => {
      const {
        text,
      } = this.props as any;
      return text ? text.split(' ') : [''];
    })();
  }

  componentWillUpdate(nextProps) {
    if (this.props.text !== nextProps.text) {
      this.__getterCache.textParts = undefined;
    }
  }

  render() {
    const { props } = this;
    return viewFunction({
      props: { ...props },
      textParts: this.textParts,
    });
  }
}
DateHeaderText.defaultProps = DateHeaderTextProps;
