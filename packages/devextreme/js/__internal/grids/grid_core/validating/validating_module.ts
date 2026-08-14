import messageLocalization from '@js/common/core/localization/message';
import type { EditingTextsBase } from '@js/common/grids';

import { validatingDataControllerExtender } from './extenders/validating_data_controller';
import {
  ValidatingController,
  validatingEditingExtender,
  validatingEditorFactoryExtender,
  validatingRowsViewExtender,
} from './m_validating';

interface ValidatingModuleOptions {
  editing: { texts: Pick<EditingTextsBase, 'validationCancelChanges'> };
}

export const validatingModule = {
  defaultOptions(): ValidatingModuleOptions {
    return {
      editing: {
        texts: {
          validationCancelChanges: messageLocalization.format('dxDataGrid-validationCancelChanges'),
        },
      },
    };
  },
  controllers: {
    validating: ValidatingController,
  },
  extenders: {
    controllers: {
      editing: validatingEditingExtender,
      editorFactory: validatingEditorFactoryExtender,
      data: validatingDataControllerExtender,
    },
    views: {
      rowsView: validatingRowsViewExtender,
    },
  },
};
