import messageLocalization from '@js/common/core/localization/message';

import { data } from './extenders/validating_data_controller';
import {
  ValidatingController,
  validatingEditingExtender,
  validatingEditorFactoryExtender,
  validatingRowsViewExtender,
} from './m_validating';

export const validatingModule = {
  defaultOptions(): { editing: { texts: { validationCancelChanges: string } } } {
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
      data,
    },
    views: {
      rowsView: validatingRowsViewExtender,
    },
  },
};
