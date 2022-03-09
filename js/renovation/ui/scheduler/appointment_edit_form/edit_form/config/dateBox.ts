import { renderTemplate } from '@devextreme/runtime/declarations';
import { SimpleItem } from '../../../../form/wrapper/simple_item';

export const getDateBoxLayoutItemConfig = (
  editorTemplate: () => JSX.Element,
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
