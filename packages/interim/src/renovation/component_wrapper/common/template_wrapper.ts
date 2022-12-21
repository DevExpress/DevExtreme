import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
// eslint-disable-next-line spellcheck/spell-checker
import { findDOMfromVNode } from 'inferno';
import { shallowEquals } from '../../utils/shallow_equals';
import $, { dxElementWrapper } from '../../../core/renderer';
import domAdapter from '../../../core/dom_adapter';
import { DxElement, getPublicElement } from '../../../core/element';
import { FunctionTemplate } from '../../../core/templates/function_template';
import { isDefined } from '../../../core/utils/type';

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
  return element.toArray ? true : false;
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

function revertMutation({ target, type, addedNodes }: MutationRecord): void {
  switch (type) {
    case 'childList':
      addedNodes.forEach(n => target.removeChild(n))
      break;
  }
}

function recordMutations<TReturn>(target: Node, func: () => TReturn): [
  TReturn,
  MutationRecord[]
] {
  const observer = new MutationObserver(() => {});

  observer.observe(target, { childList: true, attributes: true, subtree: true });

  const result = func();
  var mutations = observer.takeRecords();
  observer.disconnect();

  return [result, mutations];
}

function buildTemplateContent(props: TemplateWrapperProps, container: Element): ChildNode[] {
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

  const rendered = props.template.render({
    container,
    transclude: props.transclude,
    ...{ renovated: props.renovated },
    ...!props.transclude ? { model: data } : {},
    ...!props.transclude && Number.isFinite(index) ? { index } : {},
  }) as any as (dxElementWrapper | DxElement | undefined);

  if(rendered === undefined) {
    return [];
  }

  const result = isDxElementWrapper(rendered)
    ? rendered.toArray()
    : [getPublicElement($(rendered))]

  return result;
}

export class TemplateWrapper extends InfernoComponent<TemplateWrapperProps> {
  __node!: Element;
  __parent!: HTMLElement;
  __templateCleaner: (() => void) | undefined;

  constructor(props: TemplateWrapperProps) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  renderTemplate(): void {
    const node = findDOMfromVNode(this.$LI, true);
    if(node?.parentElement == null || node?.parentNode == null) {
      throw new Error('Template must have parent node');
    }

    this.__node = node;
    this.__parent = node.parentElement;

    this.updateContent(this.props);
  }

  shouldUpdate(nextProps: TemplateWrapperProps): boolean {
    const { model } = this.props;
    const { model: nextModel } = nextProps;

    return model?.isEqual
      ? !model.isEqual(model.data, nextModel?.data)
      : defaultComparer(this.props, nextProps);
  }

  shouldComponentUpdate(nextProps: TemplateWrapperProps): boolean {
    if(this.shouldUpdate(nextProps)) {
      this.updateContent(nextProps);
    }

    return false;
  }

  updateContent(props: TemplateWrapperProps): void {
    const container = getPublicElement($(this.__parent));

    const [ content, mutations ] = recordMutations(
      container,
      () => buildTemplateContent(props, container),
    );

    this.__templateCleaner?.();

    if (content.length === 0 || (content.length === 1 && content[0] === container)) {
      this.__templateCleaner = () => mutations.forEach(revertMutation);
    } else {
      this.__node.after(...content);
      this.__templateCleaner = () => content.forEach(el => el?.remove());
    }
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
    this.__templateCleaner?.();
  }

  render(): JSX.Element | null {
    return null;
  }
}
