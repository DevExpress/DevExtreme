import { renderTemplate } from '@devextreme/runtime/declarations';
import { SimpleItem } from '../../../../form/wrapper/simple_item';

export const getTimeZoneLayoutItemConfig = (
  editorTemplate: () => JSX.Element,
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
  // This is WA for templates in nested components
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
