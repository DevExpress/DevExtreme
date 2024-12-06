/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

import type { DataSource, DataSourceOptions } from '../../../common/data';
import type Store from '../../../data/abstract_store';
import LegacySelectBox from '../../../ui/select_box';
import { DomComponentWrapper } from '../../core/r1/dom_component_wrapper';
import type { EventCallback } from '../../core/r1/event_callback';
import type { EditorLabelProps } from '../editors/common/editor_label_props';
import { EditorLabelDefaultProps } from '../editors/common/editor_label_props';
import type { EditorPropsType } from '../editors/common/editor_props';
import { EditorDefaultProps } from '../editors/common/editor_props';
import type { EditorStateProps } from '../editors/common/editor_state_props';
import { EditorStateDefaultProps } from '../editors/common/editor_state_props';

export interface SelectBoxProps extends EditorPropsType {
  dataSource?: string | (string | any)[] | Store | DataSource | DataSourceOptions;
  displayExpr?: string;
  valueExpr?: string;
  placeholder?: string;
  hoverStateEnabled?: boolean;
  searchEnabled?: boolean;
  value?: any;
  valueChange?: EventCallback<any>;
  isReactComponentWrapper?: boolean;
}

export type SelectBoxPropsType = SelectBoxProps & EditorStateProps & EditorLabelProps;

export const NumberBoxDefaultProps: SelectBoxPropsType = {
  ...EditorDefaultProps,
  ...EditorStateDefaultProps,
  ...EditorLabelDefaultProps,
  placeholder: '',
  hoverStateEnabled: true,
  searchEnabled: false,
  value: null,
  isReactComponentWrapper: true,
};

export class SelectBox extends BaseInfernoComponent<SelectBoxPropsType> {
  public state: any = {};

  public refs: any = null;

  /* istanbul ignore next: WA for Angular */
  get componentProps(): SelectBoxPropsType {
    return this.props;
  }

  render(): JSX.Element {
    return (
        <DomComponentWrapper
          componentType={LegacySelectBox}
          componentProps={this.componentProps}
          templateNames={[
            'dropDownButtonTemplate',
            'groupTemplate',
            'itemTemplate',
          ]}
        />
    );
  }
}
SelectBox.defaultProps = NumberBoxDefaultProps;
