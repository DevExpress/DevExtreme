import { InfernoComponent, InfernoEffect } from '@devextreme/vdom';
// eslint-disable-next-line spellcheck/spell-checker
import { findDOMfromVNode } from 'inferno';
import { replaceWith } from '../../../core/utils/dom';
import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import { getPublicElement } from '../../../core/element';
import { removeDifferentElements } from '../utils/utils';
import Number from '../../../core/polyfills/number';
import { FunctionTemplate } from '../../../core/templates/function_template';
import { EffectReturn } from '../../utils/effect_return';

export interface TemplateModel {
  data: Record<string, unknown>;
  index: number;
}

interface TemplateWrapperProps {
  template: FunctionTemplate;
  model?: TemplateModel;
  transclude?: boolean;
}

export class TemplateWrapper extends InfernoComponent<TemplateWrapperProps> {
  newTemplateArrived = true;

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
        const $parent = $(parentNode as Element);
        const $children = $parent.contents();

        const {
          data, index,
        } = this.props.model ?? { data: {} };

        Object.keys(data).forEach((name) => {
          if (data[name] && domAdapter.isNode(data[name])) {
            data[name] = getPublicElement($(data[name] as Element));
          }
        });

        const $result = $(this.props.template.render({
          container: getPublicElement($parent),
          transclude: this.props.transclude,
          ...!this.props.transclude ? { model: data } : {},
          ...!this.props.transclude && Number.isFinite(index) ? { index } : {},
        }));

        if (this.newTemplateArrived) {
          replaceWith($(node), $result);
          this.newTemplateArrived = false;
        }

        return (): void => {
          // NOTE: order is important
          removeDifferentElements($children, $parent.contents());
          if (this.newTemplateArrived) {
            parentNode.appendChild(node);
          }
        };
      }
    }

    return undefined;
  }

  createEffects(): InfernoEffect[] {
    return [new InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  }

  updateEffects(): void {
    this._effects[0].update([this.props.template, this.props.model]);
  }

  componentWillReceiveProps(nextProps: TemplateWrapperProps): void {
    if (nextProps.template !== this.props.template) {
      this.newTemplateArrived = true;
    }
  }

  render(): JSX.Element | null {
    return null;
  }
}
