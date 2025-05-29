import type * as dxForm from '@js/ui/form';
import type * as dxPopup from '@js/ui/popup';
import type { RefObject } from 'inferno';
import { Component } from 'inferno';

import { CLASSES } from '../../const';
import type { FormProperties } from '../../inferno_wrappers/form';
import { Form } from '../../inferno_wrappers/form';
import { Popup } from '../../inferno_wrappers/popup';
import { getCancelButtonConfig, getSaveButtonConfig } from './buttons';

export interface Props {
  visible: boolean;
  onSave: () => void;
  onCancel: () => void;
  onHide: () => void;
  customizeItem: NonNullable<FormProperties['customizeItem']>;
  items: NonNullable<FormProperties['items']>;
  formRef: RefObject<dxForm.default>;
  formProps: dxForm.Options;
  popupProps: dxPopup.Options;
}

export class EditPopup extends Component<Props> {
  public render(): JSX.Element {
    if (!this.props.visible) {
      return <></>;
    }

    const toolbarItems = [
      getSaveButtonConfig({
        onSave: this.props.onSave,
      }),
      getCancelButtonConfig({
        onCancel: this.props.onCancel,
      }),
    ];

    return (
      <div className={CLASSES.excludeFlexBox}>
        <Popup
          visible={true}
          toolbarItems={toolbarItems}
          onHidden={this.props.onHide}
          showTitle={false}
          {...this.props.popupProps}
        >
          <Form
            componentRef={this.props.formRef}
            colCount={2} // TODO: move
            labelLocation={'top'}
            customizeItem={this.props.customizeItem}
            items={this.props.items}
            {...this.props.formProps}
          />
        </Popup>
      </div>
    );
  }
}
