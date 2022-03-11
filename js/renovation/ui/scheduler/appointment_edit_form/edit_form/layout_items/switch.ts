import { renderTemplate } from '@devextreme/runtime/declarations';
import { SimpleItem } from '../../../../form/wrapper/simple_item';

const AppointmentFormClass = 'dx-appointment-form-switch';

export const getSwitchLayoutItemConfig = (
  editorTemplate: () => JSX.Element,
  dataField: string,
  label: string,
): SimpleItem => ({
  dataField,
  cssClass: AppointmentFormClass,
  label: {
    text: label,
    location: 'right',
  },
  template: (item: unknown, container: unknown): void => {
    renderTemplate(
      editorTemplate,
      {
        item,
        container,
      },
      null,
    );
  },
});
