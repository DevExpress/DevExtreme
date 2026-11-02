import { name as clickEventName } from '@js/common/core/events/click';
import { addNamespace } from '@js/common/core/events/utils/index';

export const CLASSES = {
  editorInlineBlock: 'dx-editor-inline-block',
  focusedCellModified: 'dx-focused-cell-modified',
  focusedCellInvalid: 'dx-focused-cell-invalid',
  hidden: 'dx-hidden',
};

export const MODULE_NAMESPACE = 'dxDataGridEditorFactory';
export const UPDATE_FOCUS_EVENTS = addNamespace([clickEventName, 'focusin'].join(' '), MODULE_NAMESPACE);
