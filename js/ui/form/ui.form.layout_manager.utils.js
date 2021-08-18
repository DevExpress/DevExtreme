import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { captionize } from '../../core/utils/inflector';
import { inArray } from '../../core/utils/array';
import Guid from '../../core/guid';

const EDITORS_WITH_ARRAY_VALUE = ['dxTagBox', 'dxRangeSlider'];

export function convertToEditorOptions({
    editorType, defaultEditorName, editorValue, editorAllowUndefinedValue, editorOptions, editorInputId, editorValidationBoundary, editorStylingMode
}) {
    const editorOptionsWithValue = {};
    if(editorValue !== undefined || editorAllowUndefinedValue) {
        editorOptionsWithValue.value = editorValue;
    }
    if(EDITORS_WITH_ARRAY_VALUE.indexOf(editorType) !== -1) {
        editorOptionsWithValue.value = editorOptionsWithValue.value || [];
    }

    const result = extend(true, editorOptionsWithValue,
        editorOptions,
        {
            inputAttr: { id: editorInputId },
            validationBoundary: editorValidationBoundary,
            stylingMode: editorStylingMode
        },
    );

    if(editorOptions) {
        if(result.dataSource) {
            result.dataSource = editorOptions.dataSource;
        }
        if(result.items) {
            result.items = editorOptions.items;
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
