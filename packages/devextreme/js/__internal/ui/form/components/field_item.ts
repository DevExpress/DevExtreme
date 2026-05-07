import type { ValidationRule } from '@js/common';
import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { captionize } from '@js/core/utils/inflector';
import { format } from '@js/core/utils/string';
import type { SimpleItem } from '@js/ui/form';
import { current, isMaterialBased } from '@js/ui/themes';
import errors from '@js/ui/widget/ui.errors';
import type Editor from '@ts/ui/editor/editor';
import type { SimpleItemLabelTemplateData } from '@ts/ui/form/components/label';
import { renderLabel } from '@ts/ui/form/components/label';
import {
  FIELD_ITEM_CONTENT_CLASS,
} from '@ts/ui/form/constants';
import type Form from '@ts/ui/form/form';
import type LayoutManager from '@ts/ui/form/form.layout_manager';
import type { FieldItemOptions } from '@ts/ui/form/form.layout_manager.utils';
import Validator from '@ts/ui/m_validator';

export const FLEX_LAYOUT_CLASS = 'dx-flex-layout';
export const FIELD_ITEM_OPTIONAL_CLASS = 'dx-field-item-optional';
export const FIELD_ITEM_REQUIRED_CLASS = 'dx-field-item-required';
export const FIELD_ITEM_CONTENT_WRAPPER_CLASS = 'dx-field-item-content-wrapper';
export const FIELD_ITEM_CONTENT_LOCATION_CLASS = 'dx-field-item-content-location-';
export const FIELD_ITEM_LABEL_ALIGN_CLASS = 'dx-field-item-label-align';
export const FIELD_ITEM_HELP_TEXT_CLASS = 'dx-field-item-help-text';
export const LABEL_VERTICAL_ALIGNMENT_CLASS = 'dx-label-v-align';
export const LABEL_HORIZONTAL_ALIGNMENT_CLASS = 'dx-label-h-align';
export const TOGGLE_CONTROLS_PADDING_CLASS = 'dx-toggle-controls-paddings';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
const VALIDATION_TARGET_CLASS = 'dx-validation-target';
const INVALID_CLASS = 'dx-invalid';

export interface FieldItemInfo {
  $fieldEditorContainer: dxElementWrapper;
  $rootElement: dxElementWrapper;
  widgetInstance?: Editor;
}

function getValidationTarget(
  $fieldEditorContainer: dxElementWrapper,
): dxElementWrapper {
  const $editor = $fieldEditorContainer.children().first();
  return $editor.hasClass(TEMPLATE_WRAPPER_CLASS) ? $editor.children().first() : $editor;
}

function subscribeWrapperInvalidClassToggle(
  validationTargetInstance,
): void {
  if (validationTargetInstance && isMaterialBased(current())) {
    const wrapperClass = `.${FIELD_ITEM_CONTENT_WRAPPER_CLASS}`;
    const toggleInvalidClass = ({ element, component }): void => {
      const { isValid, validationMessageMode } = component.option();

      $(element)
        .parents(wrapperClass)
        .toggleClass(
          INVALID_CLASS,
          isValid === false && (component._isFocused() || validationMessageMode === 'always'),
        );
    };

    validationTargetInstance.on('optionChanged', (e) => {
      if (e.name !== 'isValid') return;
      toggleInvalidClass(e);
    });

    validationTargetInstance
      .on('focusIn', toggleInvalidClass)
      .on('focusOut', toggleInvalidClass)
      .on('enterKey', toggleInvalidClass);
  }
}

function tryGetValidationTargetInstance(
  $validationTarget: dxElementWrapper,
): Editor | undefined {
  // @ts-expect-error ts-error
  return $validationTarget?.data(VALIDATION_TARGET_CLASS)
    || $validationTarget?.parent?.()?.data(VALIDATION_TARGET_CLASS);
}

function getTemplateData(
  item: SimpleItem,
  editorOptions: SimpleItem['editorOptions'],
  formOrLayoutManager: Form | LayoutManager,
): SimpleItemLabelTemplateData {
  return {
    dataField: item.dataField,
    editorType: item.editorType,
    editorOptions,
    component: formOrLayoutManager,
    name: item.name,
  };
}

export function renderFieldItem({
  $parent,
  rootElementCssClassList,
  formOrLayoutManager,
  createComponentCallback,

  labelOptions, // TODO: move to 'item' ?
  labelNeedBaselineAlign, labelLocation, needRenderLabel, // TODO: move to 'labelOptions' ?
  formLabelLocation, // TODO: use 'labelOptions.location' instead ?

  item, // TODO: pass simple values instead of complex object
  editorOptions,
  isSimpleItem,
  isRequired,
  template,
  helpID,
  labelID,
  name,
  helpText, // TODO: move to 'item' ?

  requiredMessageTemplate,
  validationGroup,
}: FieldItemOptions): FieldItemInfo {
  const $rootElement = $('<div>')
    .addClass(rootElementCssClassList.join(' '))
    .appendTo($parent);

  $rootElement.addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS);
  if (isSimpleItem) {
    $rootElement.addClass(FLEX_LAYOUT_CLASS);
  }
  if (isSimpleItem && labelNeedBaselineAlign) {
    // TODO: label related code, execute ony if needRenderLabel ?
    $rootElement.addClass(FIELD_ITEM_LABEL_ALIGN_CLASS);
  }

  //
  // Setup field editor container:
  //

  const $fieldEditorContainer = $('<div>');
  $fieldEditorContainer.data('dx-form-item', item);
  const locationClassSuffix = { right: 'left', left: 'right', top: 'bottom' };
  $fieldEditorContainer
    .addClass(FIELD_ITEM_CONTENT_CLASS)
    // @ts-expect-error ts-error
    .addClass(FIELD_ITEM_CONTENT_LOCATION_CLASS + locationClassSuffix[formLabelLocation]);

  //
  // Setup $label:
  //

  let $label: dxElementWrapper | null = null;

  if (needRenderLabel) {
    if (labelOptions.labelTemplate) {
      labelOptions.labelTemplateData = getTemplateData(item, editorOptions, formOrLayoutManager);
    }

    $label = renderLabel(labelOptions);
  }

  if ($label) {
    const { editorType } = item;

    $rootElement.append($label);
    if (labelLocation === 'top' || labelLocation === 'left') {
      $rootElement.append($fieldEditorContainer);
    }
    if (labelLocation === 'right') {
      $rootElement.prepend($fieldEditorContainer);
    }

    if (labelLocation === 'top') {
      $rootElement.addClass(LABEL_VERTICAL_ALIGNMENT_CLASS);
    } else {
      $rootElement.addClass(LABEL_HORIZONTAL_ALIGNMENT_CLASS);
    }

    if (editorType === 'dxCheckBox' || editorType === 'dxSwitch') {
      eventsEngine.on($label, clickEventName, () => {
        // @ts-expect-error ts-error
        eventsEngine.trigger($fieldEditorContainer.children(), clickEventName);
      });
    }

    const toggleControls = ['dxCheckBox', 'dxSwitch', 'dxRadioGroup'];
    const isToggleControls = toggleControls.includes(editorType);
    const labelAlignment = labelOptions.alignment;
    const isLabelAlignmentLeft = labelAlignment === 'left' || !labelAlignment;
    const hasNotTemplate = !template;
    const isLabelOnTop = labelLocation === 'top';

    if (
      hasNotTemplate
            && isToggleControls
            && isLabelOnTop
            && isLabelAlignmentLeft
    ) {
      $fieldEditorContainer.addClass(TOGGLE_CONTROLS_PADDING_CLASS);
    }
  } else {
    $rootElement.append($fieldEditorContainer);
  }

  //
  // Append field editor:
  //

  // eslint-disable-next-line @typescript-eslint/init-declarations
  let widgetInstance: Editor | undefined;
  if (template) {
    template.render({
      container: getPublicElement($fieldEditorContainer),
      model: getTemplateData(item, editorOptions, formOrLayoutManager),
      // @ts-expect-error ts-error
      onRendered(): void {
        const $validationTarget = getValidationTarget($fieldEditorContainer);
        const validationTargetInstance = tryGetValidationTargetInstance($validationTarget);

        subscribeWrapperInvalidClassToggle(validationTargetInstance);
      },
    });
  } else {
    const $div = $('<div>').appendTo($fieldEditorContainer);

    try {
      widgetInstance = createComponentCallback($div, item.editorType, editorOptions);
      widgetInstance.setAria('describedby', helpID);
      if (labelID) widgetInstance.setAria('labelledby', labelID);
      widgetInstance.setAria('required', isRequired);
    } catch (e) {
      // @ts-expect-error ts-error
      errors.log('E1035', e.message);
    }
  }

  //
  // Setup $validation:
  //

  const $validationTarget = getValidationTarget($fieldEditorContainer);
  const validationTargetInstance = $validationTarget?.data(VALIDATION_TARGET_CLASS);

  if (validationTargetInstance) {
    const isItemHaveCustomLabel = item.label?.text;
    const itemName = isItemHaveCustomLabel ? null : name;
    const fieldName = isItemHaveCustomLabel ? item.label.text : itemName && captionize(itemName);
    let validationRules: ValidationRule[] | null = null;

    if (isSimpleItem) {
      if (item.validationRules) {
        validationRules = item.validationRules;
      } else {
        const requiredMessage = format(requiredMessageTemplate, fieldName);
        validationRules = item.isRequired ? [{ type: 'required', message: requiredMessage }] : null;
      }
    }

    if (Array.isArray(validationRules) && validationRules.length) {
      // @ts-expect-error ts-error
      createComponentCallback($validationTarget, Validator, {
        validationRules,
        validationGroup,
        dataGetter() {
          return {
            formItem: item,
          };
        },
      });
    }

    subscribeWrapperInvalidClassToggle(validationTargetInstance);
  }

  //
  // Append help text elements:
  //

  if (helpText && isSimpleItem) {
    const $editorParent = $fieldEditorContainer.parent();

    // TODO: DOM hierarchy is changed here: new node is added between $editor and $editor.parent()
    $editorParent.append(
      $('<div>')
        .addClass(FIELD_ITEM_CONTENT_WRAPPER_CLASS)
        .append($fieldEditorContainer)
        .append(
          $('<div>')
            .addClass(FIELD_ITEM_HELP_TEXT_CLASS)
            .attr('id', helpID)
            .text(helpText),
        ),
    );
  }

  return {
    $fieldEditorContainer,
    $rootElement,
    widgetInstance,
  };
}
