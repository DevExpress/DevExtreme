import { SimpleItem } from '../../../../form/wrapper/simple_item';
import { getRenderEditorTemplate } from '../utils/renderTemplate';

const AppointmentFormClass = 'dx-appointment-form-switch';

export const getSwitchLayoutItemConfig = (
  editorTemplate: JSX.Element,
  dataField: string,
  label: string,
): SimpleItem => ({
  dataField,
  cssClass: AppointmentFormClass,
  label: {
    text: label,
    location: 'right',
  },
  template: getRenderEditorTemplate(editorTemplate),
});
