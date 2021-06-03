import { BaseInfernoComponent } from '@devextreme/vdom';
// eslint-disable-next-line spellcheck/spell-checker
import { findDOMfromVNode } from 'inferno';
import { replaceWith } from '../../../core/utils/dom';
import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import { getPublicElement } from '../../../core/element';
import { removeDifferentElements } from '../utils/utils';
import Number from '../../../core/polyfills/number';
import { FunctionTemplate } from '../../../core/templates/function_template';
import noop from '../../utils/noop';

export interface TemplateModel {
  data: Record<string, unknown>;
  index: number;
}

interface TemplateWrapperProps {
  template: FunctionTemplate;
  model?: TemplateModel;
  transclude?: boolean;
}

export class TemplateWrapper extends BaseInfernoComponent<TemplateWrapperProps> {
  clearRenderedContent: () => void = noop;

  constructor(props: TemplateWrapperProps) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  renderTemplate(): void {
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

    this.clearRenderedContent = (): void => {
      // NOTE: order is important
      removeDifferentElements($children, $parent.contents());
      parentNode.appendChild(node);
    };
  }

  componentDidMount(): void {
    this.renderTemplate();
  }

  componentDidUpdate(): void {
    this.clearRenderedContent();
    this.renderTemplate();
  }

  render(): JSX.Element | null {
    return null;
  }
}
