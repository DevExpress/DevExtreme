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

function isChildNode(node: Node): node is ChildNode {
  return typeof (node as Partial<ChildNode>).remove === 'function';
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

function revertMutation({ type, addedNodes }: MutationRecord): void {
  switch (type) {
    case 'childList':
      addedNodes.forEach((n) => isChildNode(n) && n.remove());
      break;
    default:
      break;
  }
}

function recordMutations<TReturn>(target: Node, func: () => TReturn): [
  TReturn,
  MutationRecord[],
] {
  const observer = new MutationObserver(() => {});

  // eslint-disable-next-line spellcheck/spell-checker
  observer.observe(target, { childList: true, attributes: true, subtree: false });
  const result: [TReturn, MutationRecord[]] = [func(), observer.takeRecords()];
  observer.disconnect();

  return result;
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
    : [getPublicElement($(rendered))];
}

function noop(): void {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function detectTemplateBehavior(container: Node, content: Node[]) {
  return content.length === 0 || (content.length === 1 && content[0] === container)
    ? 'mutates-container'
    : 'returns-content';
}

export class TemplateWrapper extends InfernoComponent<TemplateWrapperProps> {
  __templateCleaner: (() => void) = noop;

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
    const [content, mutations] = recordMutations(
      node.parentElement,
      () => buildTemplateContent(this.props, getPublicElement($(container))),
    );

    this.__templateCleaner();

    switch (detectTemplateBehavior(container, content)) {
      case 'mutates-container':
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        this.__templateCleaner = () => mutations.forEach(revertMutation);
        break;

      case 'returns-content':
        node.after(...content);
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        this.__templateCleaner = () => content.forEach((el) => el?.remove());
        break;

      default:
        this.__templateCleaner = noop;
    }
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
    this.__templateCleaner();
  }

  render(): JSX.Element | null {
    return null;
  }
}
