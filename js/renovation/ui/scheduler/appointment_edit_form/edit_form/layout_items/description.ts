import { renderTemplate } from '@devextreme/runtime/declarations';
import { SimpleItem } from '../../../../form/wrapper/simple_item';

export const getDescriptionLayoutItemConfig = (
  editorTemplate: () => JSX.Element,
  dataField: string,
  label: string,
): SimpleItem => ({
  dataField,
  colSpan: 2,
  label: {
    text: label,
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
