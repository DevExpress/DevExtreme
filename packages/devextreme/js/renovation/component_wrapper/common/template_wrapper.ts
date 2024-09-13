import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
// eslint-disable-next-line spellcheck/spell-checker
import { findDOMFromVNode } from 'inferno';
import { replaceWith } from '../../../core/utils/dom';
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

type EqualityComparer = (a?: UnknownRecord, b?: UnknownRecord) => boolean;

export interface TemplateModel {
  data: UnknownRecord & {
    isEqual?: EqualityComparer;
  };
  index: number;
}

export interface TemplateWrapperProps {
  template: FunctionTemplate;
  model?: TemplateModel;
  isEqual?: EqualityComparer;
  transclude?: boolean;
  renovated?: boolean;
}

function isDxElementWrapper(
  element: dxElementWrapper | HTMLElement & Partial<Pick<dxElementWrapper, 'toArray'>>,
): element is dxElementWrapper {
  return !!element.toArray;
}

type TemplateModelArgs =
  // eslint-disable-next-line @typescript-eslint/no-type-alias
  Required<Pick<TemplateWrapperProps, 'model'>>
  // eslint-disable-next-line @typescript-eslint/no-type-alias
  & Omit<TemplateWrapperProps, 'model'>;

export function buildTemplateArgs(
  model: TemplateModel,
  template: TemplateWrapperProps['template'],
): TemplateModelArgs {
  const args: TemplateModelArgs = {
    template,
    model: { ...model },
  };

  const { isEqual, ...data } = model.data ?? {};
  if (isEqual) {
    args.model.data = data;
    args.isEqual = isEqual;
  }

  return args;
}

function renderTemplateContent(
  props: TemplateWrapperProps,
  container: DxElement<Element>,
): Element[] {
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

function removeDifferentElements(
  oldChildren: Element[],
  newChildren: Element[],
): void {
  newChildren.forEach((newElement) => {
    const hasOldChild = !!oldChildren.find((oldElement) => newElement === oldElement);

    if (!hasOldChild && newElement.parentNode) {
      $(newElement).remove();
    }
  });
}

export class TemplateWrapper extends InfernoComponent<TemplateWrapperProps> {
  constructor(props: TemplateWrapperProps) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  renderTemplate(): () => void {
    // eslint-disable-next-line spellcheck/spell-checker
    const node = findDOMFromVNode(this.$LI, true);

    /* istanbul ignore next */
    if (!node?.parentNode) {
      return () => {};
    }

    const container = node.parentNode as Element;
    const $container = $(container);
    const $oldContainerContent = $container.contents().toArray();

    const content = renderTemplateContent(this.props, getPublicElement($container));
    // TODO Vinogradov: Fix the renderer function type.
    // @ts-expect-error The renderer function's argument hasn't the full range of possible types
    // (the Element[] type is missing).
    replaceWith($(node), $(content));

    // NOTE: This is a dispose method that called before renderTemplate.
    return () => {
      const $actualContainerContent = $(container).contents().toArray();
      removeDifferentElements($oldContainerContent, $actualContainerContent);
      container.appendChild(node);
    };
  }

  shouldComponentUpdate(nextProps: TemplateWrapperProps): boolean {
    const { template, model } = this.props;
    const { template: nextTemplate, model: nextModel, isEqual } = nextProps;
    const equalityComparer = isEqual ?? shallowEquals;

    if (template !== nextTemplate) {
      return true;
    }

    if (!isDefined(model) || !isDefined(nextModel)) {
      return model !== nextModel;
    }

    const { data, index } = model;
    const { data: nextData, index: nextIndex } = nextModel;

    if (index !== nextIndex) {
      return true;
    }

    return !equalityComparer(data, nextData);
  }

  createEffects(): InfernoEffect[] {
    return [new InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  }

  updateEffects(): void {
    this._effects[0].update([this.props.template, this.props.model]);
  }

  // NOTE: Prevent nodes clearing on unmount.
  //       Nodes will be destroyed by inferno on markup update
  componentWillUnmount(): void {}

  render(): JSX.Element | null {
    return null;
  }
}
