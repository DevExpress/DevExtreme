import Guid from '@js/core/guid';
import { extend } from '@js/core/utils/extend';
import { captionize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import { isDefined } from '@js/core/utils/type';

import { SIMPLE_ITEM_TYPE } from './constants';

const EDITORS_WITH_ARRAY_VALUE = ['dxTagBox', 'dxRangeSlider', 'dxDateRangeBox'];
const EDITORS_WITH_SPECIFIC_LABELS = ['dxRangeSlider', 'dxSlider'];
export const EDITORS_WITHOUT_LABELS = ['dxCalendar', 'dxCheckBox', 'dxHtmlEditor', 'dxRadioGroup', 'dxRangeSlider', 'dxSlider', 'dxSwitch'];

export function convertToRenderFieldItemOptions({
  $parent,
  rootElementCssClassList,
  formOrLayoutManager,
  createComponentCallback,
  item,
  template,
  labelTemplate,
  name,
  formLabelLocation,
  requiredMessageTemplate,
  validationGroup,
  editorValue,
  canAssignUndefinedValueToEditor,
  editorValidationBoundary,
  editorStylingMode,
  showColonAfterLabel,
  managerLabelLocation,
  itemId,
  managerMarkOptions,
  labelMode,
  onLabelTemplateRendered,
}) {
  const isRequired = isDefined(item.isRequired) ? item.isRequired : !!_hasRequiredRuleInSet(item.validationRules);
  const isSimpleItem = item.itemType === SIMPLE_ITEM_TYPE;
  const helpID = item.helpText ? `dx-${new Guid()}` : null;

  const labelOptions = _convertToLabelOptions({
    item,
    id: itemId,
    isRequired,
    managerMarkOptions,
    showColonAfterLabel,
    labelLocation: managerLabelLocation,
    formLabelMode: labelMode,
    labelTemplate,
    onLabelTemplateRendered,
  });

  const needRenderLabel = labelOptions.visible && (labelOptions.text || (labelOptions.labelTemplate && isSimpleItem));
  const { location: labelLocation, labelID } = labelOptions;
  const labelNeedBaselineAlign = labelLocation !== 'top' && ['dxTextArea', 'dxRadioGroup', 'dxCalendar', 'dxHtmlEditor'].includes(item.editorType);

  const editorOptions = _convertToEditorOptions({
    editorType: item.editorType,
    editorValue,
    defaultEditorName: item.dataField,
    canAssignUndefinedValueToEditor,
    externalEditorOptions: item.editorOptions,
    editorInputId: itemId,
    editorValidationBoundary,
    editorStylingMode,
    formLabelMode: labelMode,
    labelText: labelOptions.textWithoutColon,
    labelMark: labelOptions.markOptions.showRequiredMark
      ? String.fromCharCode(160) + labelOptions.markOptions.requiredMark
      : '',
  });

  const needRenderOptionalMarkAsHelpText = labelOptions.markOptions.showOptionalMark
        && !labelOptions.visible && editorOptions.labelMode !== 'hidden'
        && !isDefined(item.helpText);

  const helpText = needRenderOptionalMarkAsHelpText
    ? labelOptions.markOptions.optionalMark
    : item.helpText;

  return {
    $parent,
    rootElementCssClassList,
    formOrLayoutManager,
    createComponentCallback,
    labelOptions,
    labelNeedBaselineAlign,
    labelLocation,
    needRenderLabel,
    item,
    isSimpleItem,
    isRequired,
    template,
    helpID,
    labelID,
    name,
    helpText,
    formLabelLocation,
    requiredMessageTemplate,
    validationGroup,
    editorOptions,
  };
}

export function getLabelMarkText({
  showRequiredMark, requiredMark, showOptionalMark, optionalMark,
}) {
  if (!showRequiredMark && !showOptionalMark) {
    return '';
  }

  return String.fromCharCode(160) + (showRequiredMark ? requiredMark : optionalMark);
}

export function convertToLabelMarkOptions({
  showRequiredMark, requiredMark, showOptionalMark, optionalMark,
}, isRequired?: boolean) {
  return {
    showRequiredMark: showRequiredMark && isRequired,
    requiredMark,
    showOptionalMark: showOptionalMark && !isRequired,
    optionalMark,
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function _convertToEditorOptions({
  editorType,
  defaultEditorName,
  editorValue,
  canAssignUndefinedValueToEditor,
  externalEditorOptions,
  editorInputId,
  editorValidationBoundary,
  editorStylingMode,
  formLabelMode,
  labelText,
  labelMark,
}) {
  const editorOptionsWithValue: any = {};

  if (editorValue !== undefined || canAssignUndefinedValueToEditor) {
    editorOptionsWithValue.value = editorValue;
  }
  if (EDITORS_WITH_ARRAY_VALUE.includes(editorType)) {
    editorOptionsWithValue.value = editorOptionsWithValue.value || [];
  }

  let labelMode = externalEditorOptions?.labelMode;
  if (!isDefined(labelMode)) {
    labelMode = formLabelMode === 'outside' ? 'hidden' : formLabelMode;
  }

  const stylingMode = externalEditorOptions?.stylingMode || editorStylingMode;
  const useSpecificLabelOptions = EDITORS_WITH_SPECIFIC_LABELS.includes(editorType);

  const result = extend(
    true,
    editorOptionsWithValue,
    externalEditorOptions,
    {
      inputAttr: { id: editorInputId },
      validationBoundary: editorValidationBoundary,
      stylingMode,
      label: useSpecificLabelOptions ? externalEditorOptions?.label : labelText,
      labelMode,
      labelMark,
    },
  );

  if (externalEditorOptions) {
    if (result.dataSource) {
      result.dataSource = externalEditorOptions.dataSource;
    }
    if (result.items) {
      result.items = externalEditorOptions.items;
    }
  }

  if (defaultEditorName && !result.name) {
    result.name = defaultEditorName;
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function _hasRequiredRuleInSet(rules) {
  let hasRequiredRule;

  if (rules && rules.length) {
    // @ts-expect-error
    each(rules, (index, rule) => {
      if (rule.type === 'required') {
        hasRequiredRule = true;
        return false;
      }
    });
  }

  return hasRequiredRule;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function _convertToLabelOptions({
  item, id, isRequired, managerMarkOptions, showColonAfterLabel, labelLocation, labelTemplate, formLabelMode, onLabelTemplateRendered,
}) {
  const isEditorWithoutLabels = EDITORS_WITHOUT_LABELS.includes(item.editorType);
  const labelOptions = extend(
    {
      showColon: showColonAfterLabel,
      location: labelLocation,
      id,
      visible: formLabelMode === 'outside' || (isEditorWithoutLabels && formLabelMode !== 'hidden'),
      isRequired,
    },
    item ? item.label : {},
    {
      markOptions: convertToLabelMarkOptions(managerMarkOptions, isRequired),
      labelTemplate,
      onLabelTemplateRendered,
    },
  );

  const editorsRequiringIdForLabel = ['dxRadioGroup', 'dxCheckBox', 'dxLookup', 'dxSlider', 'dxRangeSlider', 'dxSwitch', 'dxHtmlEditor', 'dxDateRangeBox']; // TODO: support "dxCalendar"
  if (editorsRequiringIdForLabel.includes(item.editorType)) {
    labelOptions.labelID = `dx-label-${new Guid()}`;
  }

  if (!labelOptions.text && item.dataField) {
    labelOptions.text = captionize(item.dataField);
  }

  if (labelOptions.text) {
    labelOptions.textWithoutColon = labelOptions.text;
    labelOptions.text += labelOptions.showColon ? ':' : '';
  }

  return labelOptions;
}
