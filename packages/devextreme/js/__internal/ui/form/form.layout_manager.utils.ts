import type {
  EditorStyle, LabelMode, ValidationRule,
} from '@js/common';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { FunctionTemplate } from '@js/core/templates/function_template';
import { extend } from '@js/core/utils/extend';
import { captionize } from '@js/core/utils/inflector';
import { isDefined, isFunction } from '@js/core/utils/type';
import type {
  DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import type {
  FormItemComponent, FormLabelMode, LabelLocation, SimpleItem,
} from '@js/ui/form';
import type { DropDownEditorProperties } from '@ts/ui/drop_down_editor/drop_down_editor';
import type { EditorProperties } from '@ts/ui/editor/editor';
import type Editor from '@ts/ui/editor/editor';
import type { LabelOptions } from '@ts/ui/form/components/label';
import { SIMPLE_ITEM_TYPE } from '@ts/ui/form/constants';
import type Form from '@ts/ui/form/form';
import type LayoutManager from '@ts/ui/form/form.layout_manager';

export interface LabelMarkOptions {
  showRequiredMark?: boolean;
  requiredMark?: string;
  showOptionalMark?: boolean;
  optionalMark?: string;
}

const EDITORS_WITH_ARRAY_VALUE: FormItemComponent[] = [
  'dxTagBox',
  'dxRangeSlider',
  'dxDateRangeBox',
];
const EDITORS_WITH_MULTIPLE_INPUT_FIELDS: FormItemComponent[] = [
  'dxRangeSlider',
  'dxDateRangeBox',
];
const EDITORS_WITH_SPECIFIC_LABELS: FormItemComponent[] = ['dxRangeSlider', 'dxSlider'];
export const EDITORS_WITHOUT_LABELS: FormItemComponent[] = [
  'dxCalendar',
  'dxCheckBox',
  'dxHtmlEditor',
  'dxRadioGroup',
  'dxRangeSlider',
  'dxSlider',
  'dxSwitch',
];
const DROP_DOWN_EDITORS: FormItemComponent[] = [
  'dxSelectBox',
  'dxDropDownBox',
  'dxTagBox',
  'dxLookup',
  'dxAutocomplete',
  'dxColorBox',
  'dxDateBox',
  'dxDateRangeBox',
];

export interface ConvertToRenderFieldItemOptions {
  $parent: dxElementWrapper;
  rootElementCssClassList: string[];
  formOrLayoutManager: Form | LayoutManager;

  createComponentCallback: ((
    $editor: dxElementWrapper,
    component: string,
    editorOptions: EditorProperties,
  ) => Editor);

  item: Required<SimpleItem>;
  template: FunctionTemplate;
  labelTemplate: FunctionTemplate;
  name: string;
  formLabelLocation: LabelLocation | undefined;
  requiredMessageTemplate: FunctionTemplate;
  validationGroup?: string;
  canAssignUndefinedValueToEditor: boolean;
  editorValidationBoundary?: dxElementWrapper;
  editorStylingMode?: EditorStyle;
  showColonAfterLabel: boolean;
  managerLabelLocation: LabelLocation | undefined;
  itemId: string;
  managerMarkOptions: LabelMarkOptions;
  labelMode?: FormLabelMode;
  onLabelTemplateRendered: () => void;

  editorValue: unknown;
}

export interface FieldItemOptions {
  $parent: dxElementWrapper;
  rootElementCssClassList: string[];
  formOrLayoutManager: Form | LayoutManager;

  createComponentCallback: ((
    $editor: dxElementWrapper,
    component: string,
    editorOptions: EditorProperties,
  ) => Editor);

  labelOptions: LabelOptions;
  labelNeedBaselineAlign: boolean;
  labelLocation: LabelLocation | undefined;
  needRenderLabel: boolean;
  item: Required<SimpleItem>;
  isSimpleItem: boolean;
  isRequired: boolean;
  template: FunctionTemplate;
  helpID: string | null;
  labelID?: string | null;
  name: string;
  helpText?: string;
  formLabelLocation: LabelLocation | undefined;
  requiredMessageTemplate: FunctionTemplate;
  validationGroup?: string;
  editorOptions: EditorOptions;
}

export interface ConvertToLabelOptions {
  item: Required<SimpleItem>;
  id: string;
  isRequired: boolean;
  managerMarkOptions: LabelMarkOptions;
  showColonAfterLabel: boolean;
  labelLocation: LabelLocation | undefined;
  labelTemplate: FunctionTemplate;
  formLabelMode?: FormLabelMode;
  onLabelTemplateRendered: () => void;
}

export interface ConvertToEditorOptions {
  $parent: dxElementWrapper;
  editorType: FormItemComponent;
  editorValue: unknown;
  defaultEditorName: string | undefined;
  canAssignUndefinedValueToEditor: boolean;
  externalEditorOptions: SimpleItem['editorOptions'];
  editorInputId: string;
  editorValidationBoundary?: dxElementWrapper;
  editorStylingMode?: EditorStyle;
  formLabelMode?: FormLabelMode;
  labelText?: string;
  labelMark?: string;
}

export type EditorOptions = EditorProperties & DropDownEditorProperties & {
  inputAttr: { id: string };
  validationBoundary: dxElementWrapper;
  stylingMode: EditorStyle;
  label?: string;
  labelMode: LabelMode;
  labelMark?: string;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
function _hasRequiredRuleInSet(rules?: ValidationRule[]): boolean | undefined {
  return rules?.some((rule) => rule.type === 'required');
}

export function convertToLabelMarkOptions(
  {
    showRequiredMark,
    requiredMark,
    showOptionalMark,
    optionalMark,
  }: LabelMarkOptions,
  isRequired?: boolean,
): LabelMarkOptions {
  return {
    showRequiredMark: showRequiredMark && isRequired,
    requiredMark,
    showOptionalMark: showOptionalMark && !isRequired,
    optionalMark,
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function _convertToLabelOptions({
  item,
  id,
  isRequired,
  managerMarkOptions,
  showColonAfterLabel,
  labelLocation,
  labelTemplate,
  formLabelMode,
  onLabelTemplateRendered,
}: ConvertToLabelOptions): LabelOptions {
  const isEditorWithoutLabels = EDITORS_WITHOUT_LABELS.includes(
    item.editorType,
  );
  const labelOptions: LabelOptions = extend(
    {
      showColon: showColonAfterLabel,
      location: labelLocation,
      id,
      visible:
        formLabelMode === 'outside'
        || (isEditorWithoutLabels && formLabelMode !== 'hidden'),
      isRequired,
    },
    item ? item.label : {},
    {
      markOptions: convertToLabelMarkOptions(managerMarkOptions, isRequired),
      labelTemplate,
      onLabelTemplateRendered,
    },
  );

  const editorsRequiringIdForLabel: FormItemComponent[] = [
    'dxRadioGroup',
    'dxCheckBox',
    'dxLookup',
    'dxSlider',
    'dxRangeSlider',
    'dxSwitch',
    'dxHtmlEditor',
    'dxDateRangeBox',
  ]; // TODO: support "dxCalendar"
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

function getDropDownEditorOptions(
  $parent: dxElementWrapper,
  editorType: FormItemComponent,
  editorInputId: string,
): DropDownEditorProperties {
  const isDropDownEditor = DROP_DOWN_EDITORS.includes(editorType);

  if (!isDropDownEditor) {
    return {};
  }

  return {
    onPopupInitialized: ({ component, popup }): void => {
      const { openOnFieldClick } = component.option();
      const { hideOnOutsideClick: initialHideOnOutsideClick } = popup.option();

      // Do not overwrite boolean hideOnOutsideClick
      if (openOnFieldClick && isFunction(initialHideOnOutsideClick)) {
        const hideOnOutsideClick = (
          e: DxEvent<PointerInteractionEvent>,
        ): boolean => {
          const $target = $(e.target);
          const $label = $parent.find(`label[for="${editorInputId}"]`);
          const isLabelClicked = !!$target.closest($label).length;

          return !isLabelClicked && initialHideOnOutsideClick(e);
        };

        component.option('dropDownOptions', {
          hideOnOutsideClick,
        });

        popup.option({
          hideOnOutsideClick,
        });
      }
    },
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function _convertToEditorOptions({
  $parent,
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
}: ConvertToEditorOptions): EditorOptions {
  const editorOptionsWithValue: {
    value?: unknown;
  } = {};

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

  const dropDownEditorOptions = getDropDownEditorOptions($parent, editorType, editorInputId);

  const result = extend(
    true,
    editorOptionsWithValue,
    externalEditorOptions,
    dropDownEditorOptions,
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

  if (defaultEditorName) {
    if (EDITORS_WITH_MULTIPLE_INPUT_FIELDS.includes(editorType)) {
      if (editorType === 'dxRangeSlider') {
        // eslint-disable-next-line max-depth
        if (!result.startName) {
          result.startName = `${defaultEditorName}[0]`;
        }
        // eslint-disable-next-line max-depth
        if (!result.endName) {
          result.endName = `${defaultEditorName}[1]`;
        }
      }

      if (editorType === 'dxDateRangeBox') {
        // eslint-disable-next-line max-depth
        if (!result.startDateName) {
          result.startDateName = `${defaultEditorName}[0]`;
        }
        // eslint-disable-next-line max-depth
        if (!result.endDateName) {
          result.endDateName = `${defaultEditorName}[1]`;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    }

    if (!result.name) {
      result.name = defaultEditorName;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result;
}

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
}: ConvertToRenderFieldItemOptions): FieldItemOptions {
  const isRequired = isDefined(item.isRequired)
    ? item.isRequired
    : !!_hasRequiredRuleInSet(item.validationRules);
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

  const needRenderLabel = !!labelOptions.visible
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    && !!(labelOptions.text || (labelOptions.labelTemplate && isSimpleItem));
  const { location: labelLocation, labelID } = labelOptions;
  const labelNeedBaselineAlign = labelLocation !== 'top'
    && ['dxTextArea', 'dxRadioGroup', 'dxCalendar', 'dxHtmlEditor'].includes(
      item.editorType ?? '',
    );

  const editorOptions = _convertToEditorOptions({
    $parent,
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
    && !labelOptions.visible
    && editorOptions.labelMode !== 'hidden'
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
  showRequiredMark,
  requiredMark,
  showOptionalMark,
  optionalMark,
}: LabelMarkOptions): string {
  if (!showRequiredMark && !showOptionalMark) {
    return '';
  }

  return (
    String.fromCharCode(160) + (showRequiredMark ? requiredMark : optionalMark)
  );
}
