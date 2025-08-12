import type { SimpleItem } from '@js/ui/form';
import { current, isFluent } from '@js/ui/themes';

import type { ResourceLoader } from '../loader/resource_loader';

export const createResourceEditorModel = (
  resourceById: Record<string, ResourceLoader>,
): SimpleItem[] => Object
  .values(resourceById)
  .map((resourceLoader) => {
    const dataField = resourceLoader.resourceIndex;

    return {
      editorOptions: {
        dataSource: resourceLoader.dataSource,
        displayExpr: resourceLoader.dataAccessor.textExpr,
        valueExpr: resourceLoader.dataAccessor.idExpr,
        stylingMode: isFluent(current()) ? 'filled' : 'outlined',
        _ignoreFieldTemplateDeprecation: true,
      },
      dataField,
      editorType: resourceLoader.allowMultiple ? 'dxTagBox' : 'dxSelectBox',
      label: { text: resourceLoader.resourceName ?? dataField },
    };
  });
