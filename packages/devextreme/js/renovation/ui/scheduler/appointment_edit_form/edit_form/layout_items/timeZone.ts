import { SimpleItem } from '../../../../form/wrapper/simple_item';
import { getRenderEditorTemplate } from '../utils/renderTemplate';

export const getTimeZoneLayoutItemConfig = (
  editorTemplate: JSX.Element,
  dataField: string,
  colSpan: number,
  visibleIndex: number,
  visible: boolean,
): SimpleItem => ({
  dataField,
  visibleIndex,
  colSpan,
  label: {
    text: ' ',
  },
  visible,
  template: getRenderEditorTemplate(editorTemplate),
});
