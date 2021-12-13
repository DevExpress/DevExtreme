import { extend } from '../../core/utils/extend';
import { isDefined } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { captionize } from '../../core/utils/inflector';
import { inArray } from '../../core/utils/array';
import Guid from '../../core/guid';

import { SIMPLE_ITEM_TYPE } from './constants';

const EDITORS_WITH_ARRAY_VALUE = ['dxTagBox', 'dxRangeSlider'];
export const EDITORS_WITHOUT_LABELS = ['dxCalendar', 'dxCheckBox', 'dxHtmlEditor', 'dxRadioGroup', 'dxRangeSlider', 'dxSlider', 'dxSwitch'];

export function convertToRenderFieldItemOptions({
    $parent,
    rootElementCssClassList,
    formOrLayoutManager,
    createComponentCallback,
    useFlexLayout,
    item,
    template,
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
    labelMode
}) {
    const isRequired = isDefined(item.isRequired) ? item.isRequired : !!_hasRequiredRuleInSet(item.validationRules);
    const isSimpleItem = item.itemType === SIMPLE_ITEM_TYPE;
    const helpID = item.helpText ? ('dx-' + new Guid()) : null;

    const labelOptions = _convertToLabelOptions({
        item, id: itemId, isRequired, managerMarkOptions,
        showColonAfterLabel,
        labelLocation: managerLabelLocation,
        formLabelMode: labelMode,
    });

    const needRenderLabel = labelOptions.visible && labelOptions.text;
    const { location: labelLocation, labelID } = labelOptions;
    const labelNeedBaselineAlign =
        labelLocation !== 'top'
        &&
        (
            (!!item.helpText && !useFlexLayout)
            ||
            inArray(item.editorType, ['dxTextArea', 'dxRadioGroup', 'dxCalendar', 'dxHtmlEditor']) !== -1
        );

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
        useFlexLayout,
        labelOptions, labelNeedBaselineAlign, labelLocation, needRenderLabel,
        item, isSimpleItem, isRequired, template, helpID, labelID, name, helpText,
        formLabelLocation,
        requiredMessageTemplate,
        validationGroup,
        editorOptions
    };
}

export function getLabelMarkText({ showRequiredMark, requiredMark, showOptionalMark, optionalMark }) {
    if(!showRequiredMark && !showOptionalMark) {
        return '';
    }

    return String.fromCharCode(160) + (showRequiredMark ? requiredMark : optionalMark);
}

export function convertToLabelMarkOptions({ showRequiredMark, requiredMark, showOptionalMark, optionalMark }, isRequired) {
    return {
        showRequiredMark: showRequiredMark && isRequired,
        requiredMark,
        showOptionalMark: showOptionalMark && !isRequired,
        optionalMark
    };
}

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
    const editorOptionsWithValue = {};
    if(editorValue !== undefined || canAssignUndefinedValueToEditor) {
        editorOptionsWithValue.value = editorValue;
    }
    if(EDITORS_WITH_ARRAY_VALUE.indexOf(editorType) !== -1) {
        editorOptionsWithValue.value = editorOptionsWithValue.value || [];
    }

    let labelMode = externalEditorOptions?.labelMode;
    if(!isDefined(labelMode)) {
        labelMode = formLabelMode === 'outside' ? 'hidden' : formLabelMode;
    }

    const stylingMode = externalEditorOptions?.stylingMode || editorStylingMode;

    const result = extend(true, editorOptionsWithValue,
        externalEditorOptions,
        {
            inputAttr: { id: editorInputId },
            validationBoundary: editorValidationBoundary,
            stylingMode,
            label: labelText,
            labelMode,
            labelMark,
        },
    );

    if(externalEditorOptions) {
        if(result.dataSource) {
            result.dataSource = externalEditorOptions.dataSource;
        }
        if(result.items) {
            result.items = externalEditorOptions.items;
        }
    }

    if(defaultEditorName && !result.name) {
        result.name = defaultEditorName;
    }
    return result;
}

function _hasRequiredRuleInSet(rules) {
    let hasRequiredRule;

    if(rules && rules.length) {
        each(rules, function(index, rule) {
            if(rule.type === 'required') {
                hasRequiredRule = true;
                return false;
            }
        });
    }

    return hasRequiredRule;
}

function _convertToLabelOptions({ item, id, isRequired, managerMarkOptions, showColonAfterLabel, labelLocation, formLabelMode }) {
    const isEditorWithoutLabels = inArray(item.editorType, EDITORS_WITHOUT_LABELS) !== -1;
    const labelOptions = extend(
        {
            showColon: showColonAfterLabel,
            location: labelLocation,
            id: id,
            visible: formLabelMode === 'outside' || (isEditorWithoutLabels && formLabelMode !== 'hidden'),
            isRequired: isRequired,
        },
        item ? item.label : {},
        { markOptions: convertToLabelMarkOptions(managerMarkOptions, isRequired) }
    );

    const editorsRequiringIdForLabel = ['dxRadioGroup', 'dxCheckBox', 'dxLookup', 'dxSlider', 'dxRangeSlider', 'dxSwitch', 'dxHtmlEditor']; // TODO: support "dxCalendar"
    if(inArray(item.editorType, editorsRequiringIdForLabel) !== -1) {
        labelOptions.labelID = `dx-label-${new Guid()}`;
    }

    if(!labelOptions.text && item.dataField) {
        labelOptions.text = captionize(item.dataField);
    }

    if(labelOptions.text) {
        labelOptions.textWithoutColon = labelOptions.text;
        labelOptions.text += labelOptions.showColon ? ':' : '';
    }

    return labelOptions;
}
