import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
// eslint-disable-next-line spellcheck/spell-checker
import { createTextVNode, findDOMfromVNode } from 'inferno';
import $ from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import { getPublicElement } from '../../../core/element';
import { FunctionTemplate } from '../../../core/templates/function_template';

type UnknownRecord = Record<PropertyKey, unknown>;

export interface TemplateModel {
  data: Record<string, unknown>;
  index: number;
  isEqual?: (a?: UnknownRecord, b?: UnknownRecord) => boolean;
}

interface TemplateWrapperProps {
  template: FunctionTemplate;
  model?: TemplateModel;
  transclude?: boolean;
  renovated?: boolean;
}

function replaceChild(parentDOM, newDom, lastDom) {
  parentDOM.replaceChild(newDom, lastDom);
}

export class TemplateWrapper extends InfernoComponent<TemplateWrapperProps> {
  __templateContent: Element | undefined;
  __parent!: Element;

  constructor(props: TemplateWrapperProps) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  renderTemplate(): void {
  // eslint-disable-next-line spellcheck/spell-checker
    const node = findDOMfromVNode(this.$LI, true);
    this.__parent = node?.parentNode as Element;
    this.__templateContent = this.getTemplateContent(this.props);

    node?.after(this.__templateContent!);
  }

  getTemplateContent(props) {
    const {
      data, index,
    } = props.model ?? { data: {} };
  
    if(data) {
      Object.keys(data).forEach((name) => {
        if(data[name] && domAdapter.isNode(data[name])) {
          data[name] = getPublicElement($(data[name]));
        }
      });
    }
  
    return this.props.template.render({
      container: getPublicElement($(this.__parent)),
      transclude: this.props.transclude,
      ...{ renovated: this.props.renovated },
      ...!this.props.transclude ? { model: data } : {},
      ...!this.props.transclude && Number.isFinite(index) ? { index } : {},
    })[0];
  }

  shouldComponentUpdate(nextProps: TemplateWrapperProps): boolean {
    if(this.__templateContent &&
      (!this.props.model?.isEqual || !this.props.model.isEqual(this.props.model.data, nextProps.model?.data))) {
      const result = this.getTemplateContent(nextProps);
      replaceChild(this.__parent, result, this.__templateContent);
      this.__templateContent = result;
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
  componentWillUnmount(): void {
    this.__templateContent?.remove();
  }

  render(): JSX.Element | null {
    return createTextVNode("");
  }
}
