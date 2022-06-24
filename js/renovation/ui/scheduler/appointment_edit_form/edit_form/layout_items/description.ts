import { SimpleItem } from '../../../../form/wrapper/simple_item';
import { getRenderEditorTemplate } from '../utils/renderTemplate';

export const getDescriptionLayoutItemConfig = (
  editorTemplate: JSX.Element,
  dataField: string,
  label: string,
): SimpleItem => ({
  dataField,
  colSpan: 2,
  label: {
    text: label,
  },
  template: getRenderEditorTemplate(editorTemplate),
});
