/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { EventCallback } from '@js/renovation/ui/common/event_callback';

import LegacyNumberBox from '../../../ui/number_box';
import { DomComponentWrapper } from '../../core/r1/dom_component_wrapper';
import { EditorLabelDefaultProps, type EditorLabelProps } from './common/editor_label_props';
import type { EditorPropsType } from './common/editor_props';
import { EditorDefaultProps } from './common/editor_props';
import { EditorStateDefaultProps, type EditorStateProps } from './common/editor_state_props';

const DEFAULT_VALUE = 0;

export interface NumberBoxProps extends EditorPropsType {
  invalidValueMessage?: string;
  max?: number;
  min?: number;
  mode?: 'number' | 'text' | 'tel';
  showSpinButtons?: boolean;
  step?: number;
  useLargeSpinButtons?: boolean;
  value: number | null;
  valueChange?: EventCallback<number | null>;
  isReactComponentWrapper?: boolean;
}

export type NumberBoxPropsType = NumberBoxProps & EditorStateProps & EditorLabelProps;

export const NumberBoxDefaultProps: NumberBoxProps = {
  ...EditorDefaultProps,
  ...EditorStateDefaultProps,
  ...EditorLabelDefaultProps,
  value: DEFAULT_VALUE,
  isReactComponentWrapper: true,
};

export class NumberBox extends BaseInfernoComponent<NumberBoxPropsType> {
  public state: any = {};

  public refs: any = null;

  /* istanbul ignore next: WA for Angular */
  get componentProps(): NumberBoxPropsType {
    return this.props;
  }

  render(): JSX.Element {
    return (
    <DomComponentWrapper
      componentType={LegacyNumberBox}
      componentProps={this.componentProps}
      templateNames={[]}
    />
    );
  }
}
NumberBox.defaultProps = NumberBoxDefaultProps;
