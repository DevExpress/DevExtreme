import { Component } from 'inferno';

import type { DataObject } from '../../data_controller/types';
import type { FormProperties } from '../../inferno_wrappers/form';
import { Form } from '../../inferno_wrappers/form';
import { Popup } from '../../inferno_wrappers/popup';
import { Scrollable } from '../../inferno_wrappers/scrollable';

export interface Properties {
  data?: DataObject;
  onSave: () => void;
  onCancel: () => void;
  onHide: () => void;
  customizeItem: FormProperties['customizeItem'];
  items: FormProperties['items'];
}

export class EditPopup extends Component<Properties> {
  public render(): JSX.Element {
    if (!this.props.data) {
      return <></>;
    }

    const toolbarItems = [
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: 'Save',
          onClick: this.props.onSave,
          stylingMode: 'contained',
          type: 'default',    
        },
      } as const,
      {
        toolbar: 'bottom' as const,
        location: 'after',
        widget: 'dxButton',
        options: {
          text: 'Cancel',
          onClick: this.props.onCancel,
          stylingMode: 'contained',
          type: 'default',
        },
      } as const,
    ];

    return (
      <Popup
        visible={true}
        toolbarItems={toolbarItems}
        onHidden={this.props.onHide}
      >
        <Scrollable>
          <Form
            colCount={2} // TODO: move
            formData={this.props.data}
            customizeItem={this.props.customizeItem}
            items={this.props.items}
          />
        </Scrollable>
      </Popup>
    );
  }
}
