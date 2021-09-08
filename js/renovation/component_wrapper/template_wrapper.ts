import { InfernoComponent, InfernoEffect } from '@devextreme/vdom';
// eslint-disable-next-line spellcheck/spell-checker
import { findDOMfromVNode } from 'inferno';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getPublicElement } from '../../core/element';
import { removeDifferentElements } from './utils';
import Number from '../../core/polyfills/number';
import { FunctionTemplate } from '../../core/templates/function_template';
import { EffectReturn } from '../utils/effect_return';

interface TemplateWrapperProps {
  template: FunctionTemplate;
  model?: { data: Record<string, unknown>; index: number };
  transclude?: boolean;
}

export class TemplateWrapper extends InfernoComponent<TemplateWrapperProps> {
  constructor(props: TemplateWrapperProps) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  renderTemplate(): EffectReturn {
    // eslint-disable-next-line spellcheck/spell-checker
    const node = findDOMfromVNode(this.$LI, true);
    if (node) {
      const { parentNode } = node;
      if (parentNode) {
        parentNode.removeChild(node);
        const $parent = $(parentNode as Element);
        const $children = $parent.contents();

        const { data, index } = this.props.model ?? { data: {} };

        Object.keys(data).forEach((name) => {
          if (data[name] && domAdapter.isNode(data[name])) {
            data[name] = getPublicElement($(data[name] as Element));
          }
        });

        this.props.template.render({
          container: getPublicElement($parent),
          transclude: this.props.transclude,
          ...(!this.props.transclude ? { model: data } : {}),
          ...(!this.props.transclude && Number.isFinite(index) ? { index } : {}),
        });

        return (): void => {
          // NOTE: order is important
          removeDifferentElements($children, $parent.contents());
          parentNode.appendChild(node);
        };
      }
    }

    return undefined;
  }

  createEffects(): InfernoEffect[] {
    return [new InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  }

  updateEffects(): void {
    // eslint-disable-next-line no-underscore-dangle
    this._effects[0].update([this.props.template, this.props.model]);
  }

  // NOTE: Prevent nodes clearing on unmount.
  //       Nodes will be destroyed by inferno on markup update
  componentWillUnmount(): void { }

  render(): JSX.Element | null {
    return null;
  }
}
