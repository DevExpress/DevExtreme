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
import { noop } from '../../../core/utils/common';
import { recordMutations } from './mutations_recording';

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

export class TemplateWrapper extends InfernoComponent<TemplateWrapperProps> {
  private cleanParent: () => void = noop;

  constructor(props: TemplateWrapperProps) {
    super(props);
    this.renderTemplate = this.renderTemplate.bind(this);
  }

  renderTemplate(): void {
    // eslint-disable-next-line spellcheck/spell-checker, rulesdir/no-non-null-assertion
    const node = findDOMfromVNode(this.$LI, true)!;
    // eslint-disable-next-line rulesdir/no-non-null-assertion
    const container = node.parentElement!;

    this.cleanParent();
    this.cleanParent = recordMutations(
      container,
      () => {
        const content = buildTemplateContent(this.props, getPublicElement($(container)));

        if (content.length !== 0 && !(content.length === 1 && content[0] === container)) {
          node.after(...content);
        }
      },
    );
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
  componentWillUnmount(): void {
    this.cleanParent();
  }

  render(): JSX.Element | null {
    return null;
  }
}
