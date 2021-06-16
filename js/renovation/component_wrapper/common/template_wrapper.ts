import { InfernoComponent, InfernoEffect } from '@devextreme/vdom';
// eslint-disable-next-line spellcheck/spell-checker
import { findDOMfromVNode } from 'inferno';
import { shallowEquals } from '../../utils/shallow_equals';
import { replaceWith } from '../../../core/utils/dom';
import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import { getPublicElement } from '../../../core/element';
import { removeDifferentElements } from '../utils/utils';
import Number from '../../../core/polyfills/number';
import { FunctionTemplate } from '../../../core/templates/function_template';
import { EffectReturn } from '../../utils/effect_return';
import { isDefined } from '../../../core/utils/type';

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
  constructor(props: TemplateWrapperProps) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  renderTemplate(): EffectReturn {
    // eslint-disable-next-line spellcheck/spell-checker
    const node = findDOMfromVNode(this.$LI, true) as Element;
    const parentNode = node.parentNode as Element;
    const $parent = $(parentNode);
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

    replaceWith($(node), $result);

    return (): void => {
      // NOTE: order is important
      removeDifferentElements($children, $parent.contents());
      parentNode.appendChild(node);
    };
  }

  shouldComponentUpdate(nextProps: TemplateWrapperProps): boolean {
    const { template, model } = this.props;
    const { template: nextTemplate, model: nextModel } = nextProps;

    const sameTemplate = template === nextTemplate;

    if (!sameTemplate) {
      return true;
    }

    const sameModel = model === nextModel;

    if (sameModel) {
      return false;
    }

    if (isDefined(model) && isDefined(nextModel)) {
      const { data, index } = model;
      const { data: nextData, index: nextIndex } = nextModel;
      return index !== nextIndex || !shallowEquals(data, nextData);
    }
    return false;
  }

  createEffects(): InfernoEffect[] {
    return [new InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  }

  updateEffects(): void {
    this._effects[0].update([this.props.template, this.props.model]);
  }

  // NOTE: Prevent nodes clearing on unmount.
  //       Nodes will be destroyed by inferno on markup update
  componentWillUnmount(): void { }

  render(): JSX.Element | null {
    return null;
  }
}
