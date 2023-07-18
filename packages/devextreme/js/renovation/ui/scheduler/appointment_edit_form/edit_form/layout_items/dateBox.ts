import { SimpleItem } from '../../../../form/wrapper/simple_item';
import { getRenderEditorTemplate } from '../utils/renderTemplate';

export const getDateBoxLayoutItemConfig = (
  editorTemplate: JSX.Element,
  dataField: string,
  colSpan: number,
  labelText: string,
): SimpleItem => ({
  dataField,
  colSpan,
  label: {
    text: labelText,
  },
  validationRules: [{
    type: 'required',
  }],
  template: getRenderEditorTemplate(editorTemplate),
});
