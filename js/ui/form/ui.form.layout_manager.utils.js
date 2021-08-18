import { extend } from '../../core/utils/extend';
import { isDefined } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { captionize } from '../../core/utils/inflector';
import { inArray } from '../../core/utils/array';
import Guid from '../../core/guid';

const EDITORS_WITH_ARRAY_VALUE = ['dxTagBox', 'dxRangeSlider'];
const SIMPLE_ITEM_TYPE = 'simple'; // TODO: copy from layout_manager.js

export function convertToRenderFieldItemOptions({
    $container,
    containerCssClass,
    parentComponent,
    createComponentCallback,
    useFlexLayout,
    item, template, name,
    formLabelLocation,
    requiredMessageTemplate,
    validationGroup,
    editorType,
    editorValue,
    defaultEditorName,
    editorAllowUndefinedValue: isCheckboxUndefinedStateEnabled,
    externalEditorOptions,
    editorInputId,
    editorValidationBoundary,
    editorStylingMode,
    isFlexSupported,
    showColonAfterLabel,
    managerLabelLocation,
    manager_id,
    managerMarkOptions
}) {
    const isRequired = isDefined(item.isRequired) ? item.isRequired : !!hasRequiredRuleInSet(item.validationRules);
    const isSimpleItem = item.itemType === SIMPLE_ITEM_TYPE;
    const helpID = item.helpText ? ('dx-' + new Guid()) : null;
    const helpText = item.helpText;

    const labelOptions = getLabelOptions({
        item, id: manager_id, isRequired, managerMarkOptions,
        showColonAfterLabel,
        labelLocation: managerLabelLocation,
    });


    const needRenderLabel = labelOptions.visible && labelOptions.text;
    const { location: labelLocation, labelID } = labelOptions;
    const labelNeedBaselineAlign =
        labelLocation !== 'top'
        &&
        (
            (!!item.helpText && !isFlexSupported)
            ||
            inArray(item.editorType, ['dxTextArea', 'dxRadioGroup', 'dxCalendar', 'dxHtmlEditor']) !== -1
        );

    return {
        $container,
        containerCssClass,
        parentComponent,
        createComponentCallback,
        useFlexLayout,
        labelOptions, labelNeedBaselineAlign, labelLocation, needRenderLabel,
        item, isSimpleItem, isRequired, template, helpID, labelID, name, helpText,
        formLabelLocation,
        requiredMessageTemplate,
        validationGroup,
        editorOptions: convertToEditorOptions({
            editorType,
            editorValue,
            defaultEditorName,
            editorAllowUndefinedValue: isCheckboxUndefinedStateEnabled,
            externalEditorOptions,
            editorInputId,
            editorValidationBoundary,
            editorStylingMode,
        })
    };
}

export function convertToEditorOptions({
    editorType, defaultEditorName, editorValue, editorAllowUndefinedValue, externalEditorOptions, editorInputId, editorValidationBoundary, editorStylingMode
}) {
    const editorOptionsWithValue = {};
    if(editorValue !== undefined || editorAllowUndefinedValue) {
        editorOptionsWithValue.value = editorValue;
    }
    if(EDITORS_WITH_ARRAY_VALUE.indexOf(editorType) !== -1) {
        editorOptionsWithValue.value = editorOptionsWithValue.value || [];
    }

    const result = extend(true, editorOptionsWithValue,
        externalEditorOptions,
        {
            inputAttr: { id: editorInputId },
            validationBoundary: editorValidationBoundary,
            stylingMode: editorStylingMode
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

export function hasRequiredRuleInSet(rules) {
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

export function getLabelMarkOptions({ showRequiredMark, requiredMark, showOptionalMark, optionalMark }, isRequired) {
    return {
        isRequiredMark: showRequiredMark && isRequired,
        requiredMark,
        isOptionalMark: showOptionalMark && !isRequired,
        optionalMark
    };
}

export function getLabelOptions({ item, id, isRequired, managerMarkOptions, showColonAfterLabel, labelLocation }) {
    const labelOptions = extend(
        {
            showColon: showColonAfterLabel,
            location: labelLocation,
            id: id,
            visible: true,
            isRequired: isRequired
        },
        item ? item.label : {},
        { markOptions: getLabelMarkOptions(managerMarkOptions, isRequired) }
    );

    const editorsRequiringIdForLabel = ['dxRadioGroup', 'dxCheckBox', 'dxLookup', 'dxSlider', 'dxRangeSlider', 'dxSwitch', 'dxHtmlEditor']; // TODO: support "dxCalendar"
    if(inArray(item.editorType, editorsRequiringIdForLabel) !== -1) {
        labelOptions.labelID = `dx-label-${new Guid()}`;
    }

    if(!labelOptions.text && item.dataField) {
        labelOptions.text = captionize(item.dataField);
    }

    if(labelOptions.text) {
        labelOptions.text += labelOptions.showColon ? ':' : '';
    }

    return labelOptions;
}
