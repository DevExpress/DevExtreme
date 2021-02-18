import { InfernoComponent } from 'devextreme-generator/modules/inferno/base_component';
import { InfernoEffect } from 'devextreme-generator/modules/inferno/effect';
import { createElement } from 'inferno-create-element';
import { createRef } from 'inferno';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getPublicElement } from '../../core/element';
import { removeDifferentElements, wrapElement } from './utils';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

interface TemplateProps { template: any; model: { data: any; index: number } }

export class TemplateWrapper extends InfernoComponent<TemplateProps> {
  constructor(props) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  dummyDivRef = createRef<any>();

  renderTemplate(): () => void {
    const { parentNode } = this.dummyDivRef.current;
    parentNode?.removeChild(this.dummyDivRef.current);
    const $parent = $(parentNode);
    const $children = $parent.contents();

    const { data, index } = this.props.model;

    Object.keys(data).forEach((name) => {
      if (data[name] && domAdapter.isNode(data[name])) {
        data[name] = getPublicElement($(data[name]));
      }
    });

    const $template = $(
      this.props.template.render({
        container: getPublicElement($parent),
        model: data,
        ...(Number.isFinite(index) ? { index } : {}),
      }),
    );

    if ($template.hasClass(TEMPLATE_WRAPPER_CLASS)) {
      wrapElement($parent, $template);
    }

    return (): void => {
      // NOTE: order is important
      removeDifferentElements($children, $parent.contents());
      parentNode.appendChild(this.dummyDivRef.current);
    };
  }

  component;

  createEffects(): InfernoEffect[] {
    return [new InfernoEffect(this.renderTemplate, [this.props.template])];
  }

  updateEffects(): void {
    // eslint-disable-next-line no-underscore-dangle
    this._effects[0].update([this.props.template]);
  }

  render(): JSX.Element {
    return createElement('div', {
      style: { display: 'none' },
      ref: this.dummyDivRef,
    });
  }
}
