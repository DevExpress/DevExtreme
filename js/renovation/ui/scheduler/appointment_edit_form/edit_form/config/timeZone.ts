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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: (item: any, container: any): void => {
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
