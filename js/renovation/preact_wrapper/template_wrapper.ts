import { InfernoComponent } from 'devextreme-generator/modules/inferno/inferno_component';
import { InfernoEffect } from 'devextreme-generator/modules/inferno/effect';
import { createElement } from 'inferno-create-element';
import { createRef, Fragment } from 'inferno';
import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import { getPublicElement } from '../../core/element';
import { removeDifferentElements, wrapElement } from './utils';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

export class TemplateWrapper extends InfernoComponent
  // <{ template: any, data: { model: any; index: number } }>
{
  constructor(props) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  dummyDivRef = createRef<any>();

  renderTemplate() {
    const { parentNode } = this.dummyDivRef.current!;
    parentNode?.removeChild(this.dummyDivRef.current!);
    const $parent = $(parentNode);
    const $children = $parent.contents();

    const { data, index } = this.props.data;

    Object.keys(data).forEach((name) => {
      if (data[name] && domAdapter.isNode(data[name])) {
        data[name] = getPublicElement($(data[name]));
      }
    });

    const $template = $(
      this.props.template.render({
        container: getPublicElement($parent),
        model: data,
        ...(isFinite(index) ? { index } : {}),
      }),
    );

    if ($template.hasClass(TEMPLATE_WRAPPER_CLASS)) {
      wrapElement($parent, $template);
    }

    return () => {
      // NOTE: order is important
      removeDifferentElements($children, $parent.contents());
    };
  }

  createEffects() {
    return [
      new InfernoEffect(this.renderTemplate, [
        this.props.template,
      ]),
    ];
  }

  updateEffects() {
    this._effects[0].update([this.props.template]);
  }

  render() {
    return createElement(
      Fragment,
      {},
      createElement('div', { style: { display: 'none' }, ref: this.dummyDivRef }),
    );
  }
}
