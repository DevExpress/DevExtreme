import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
// eslint-disable-next-line spellcheck/spell-checker
import { findDOMfromVNode } from 'inferno';
import { shallowEquals } from '../../utils/shallow_equals';
// eslint-disable-next-line import/named
import $, { dxElementWrapper } from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
// eslint-disable-next-line import/named
import { DxElement, getPublicElement } from '../../../core/element';
import { FunctionTemplate } from '../../../core/templates/function_template';
import { isDefined } from '../../../core/utils/type';
import { recordMutations } from './mutations_recording';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type UnknownRecord = Record<PropertyKey, unknown>;

export interface TemplateModel {
  data: UnknownRecord;
  index: number;
  isEqual?: (a?: UnknownRecord, b?: UnknownRecord) => boolean;
}

interface TemplateWrapperProps {
  template: FunctionTemplate;
  model?: TemplateModel;
  transclude?: boolean;
  renovated?: boolean;
}

function isDxElementWrapper(
  element: dxElementWrapper | HTMLElement & Partial<Pick<dxElementWrapper, 'toArray'>>,
): element is dxElementWrapper {
  return !!element.toArray;
}

function defaultComparer(
  { template, model }: TemplateWrapperProps,
  { template: nextTemplate, model: nextModel }: TemplateWrapperProps,
): boolean {
  const sameTemplate = template === nextTemplate;
  if (!sameTemplate) {
    return true;
  }

  if (isDefined(model) && isDefined(nextModel)) {
    const { data, index } = model;
    const { data: nextData, index: nextIndex } = nextModel;
    return index !== nextIndex || !shallowEquals(data, nextData);
  }

  const sameModel = model === nextModel;
  return !sameModel;
}

function buildTemplateContent(
  props: TemplateWrapperProps,
  container: DxElement<Element>,
): ChildNode[] {
  const {
    data, index,
  } = props.model ?? { data: {} };

  if (data) {
    Object.keys(data).forEach((name) => {
      if (data[name] && domAdapter.isNode(data[name])) {
        data[name] = getPublicElement($(data[name] as Element));
      }
    });
  }

  const rendered = props.template.render({
    container,
    transclude: props.transclude,
    ...{ renovated: props.renovated },
    ...!props.transclude ? { model: data } : {},
    ...!props.transclude && Number.isFinite(index) ? { index } : {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any as (dxElementWrapper | DxElement | undefined);

  if (rendered === undefined) {
    return [];
  }

  return isDxElementWrapper(rendered)
    ? rendered.toArray()
    : [$(rendered).get(0)];
}

function noop(): void {}

export class TemplateWrapper extends InfernoComponent<TemplateWrapperProps> {
  __cleanParent: () => void = noop;

  constructor(props: TemplateWrapperProps) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  renderTemplate(): void {
    // eslint-disable-next-line spellcheck/spell-checker
    const node = findDOMfromVNode(this.$LI, true);
    if (node?.parentElement == null) {
      throw new Error('Template must have parent element');
    }

    const container = node.parentElement;

    this.__cleanParent();
    this.__cleanParent = recordMutations(
      node.parentElement,
      () => {
        const content = buildTemplateContent(this.props, getPublicElement($(container)));

        if (content.length !== 0 && !(content.length === 1 && content[0] === container)) {
          node.after(...content);
        }
      },
    );
  }

  shouldComponentUpdate(nextProps: TemplateWrapperProps): boolean {
    const { model } = this.props;

    return model?.isEqual
      ? !model.isEqual(model.data, nextProps.model?.data)
      : defaultComparer(this.props, nextProps);
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
    this.__cleanParent();
  }

  render(): JSX.Element | null {
    return null;
  }
}
