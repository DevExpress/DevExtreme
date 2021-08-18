import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';

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
