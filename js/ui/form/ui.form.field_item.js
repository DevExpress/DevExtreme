import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { name as clickEventName } from '../../events/click';
import { getPublicElement } from '../../core/element';
import { captionize } from '../../core/utils/inflector';
import { format } from '../../core/utils/string';
import { isDefined } from '../../core/utils/type';
import { isMaterial } from '../themes';

import Validator from '../validator';

import {
    FIELD_ITEM_CLASS,
    FLEX_LAYOUT_CLASS,
    FIELD_ITEM_OPTIONAL_CLASS,
    FIELD_ITEM_REQUIRED_CLASS,
    FIELD_ITEM_CONTENT_WRAPPER_CLASS,
    LABEL_VERTICAL_ALIGNMENT_CLASS,
    LABEL_HORIZONTAL_ALIGNMENT_CLASS,
    FIELD_ITEM_LABEL_ALIGN_CLASS
} from './constants';

import {
    renderLabel,
    renderHelpText,
    renderComponentTo,
    renderTemplateTo,
    adjustEditorContainer
} from './ui.form.utils';

const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
const INVALID_CLASS = 'dx-invalid';

export function renderFieldItem({ item, $container, isRequired, isFlexSupported, labelNeedBaselineAlign,
    labelOptions, labelLocation, formLabelLocation,
    template, editorOptions, component, createComponentCallback, helpID, labelID,
    name, helpText, cssItemClass, formRequiredMessage,
    formValidationGroup
}) {
    //
    // Setup external $container:
    //

    $container
        .addClass(FIELD_ITEM_CLASS)
        .addClass(cssItemClass)
        .addClass(isDefined(item.col) ? 'dx-col-' + item.col : '');

    $container.addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS);
    if(item.isSimpleItem && isFlexSupported) {
        $container.addClass(FLEX_LAYOUT_CLASS);
    }
    if(item.isSimpleItem && labelNeedBaselineAlign) {
        // TODO: label related code, execute ony if needRenderLabel?
        $container.addClass(FIELD_ITEM_LABEL_ALIGN_CLASS);
    }

    //
    // Setup field editor container:
    //

    const $fieldEditorContainer = $('<div>');
    $fieldEditorContainer.data('dx-form-item', item);
    adjustEditorContainer({ // TODO: label related code, execute ony if needRenderLabel?
        $container: $fieldEditorContainer,
        labelLocation: formLabelLocation
    });

    //
    // Setup $label:
    //

    const needRenderLabel = labelOptions.visible && labelOptions.text;
    const $label = needRenderLabel ? renderLabel(labelOptions) : null;
    if($label) {
        $container.append($label);
        if(labelLocation === 'top' || labelLocation === 'left') {
            $container.append($fieldEditorContainer);
        }
        if(labelLocation === 'right') {
            $container.prepend($fieldEditorContainer);
        }

        if(labelLocation === 'top') {
            $container.addClass(LABEL_VERTICAL_ALIGNMENT_CLASS);
        } else {
            $container.addClass(LABEL_HORIZONTAL_ALIGNMENT_CLASS);
        }

        if(item.editorType === 'dxCheckBox' || item.editorType === 'dxSwitch') {
            eventsEngine.on($label, clickEventName, function() {
                eventsEngine.trigger($fieldEditorContainer.children(), clickEventName);
            });
        }
    } else {
        $container.append($fieldEditorContainer);
    }

    //
    // Append field editor:
    //

    let instance;
    if(template) {
        renderTemplateTo({
            $container: getPublicElement($fieldEditorContainer),
            template,
            templateOptions: {
                dataField: item.dataField,
                editorType: item.editorType,
                editorOptions,
                component,
                name: item.name
            }
        });
    } else {
        instance = renderComponentTo({
            $container: $fieldEditorContainer,
            createComponentCallback,
            componentType: item.editorType,
            componentOptions: editorOptions,
            helpID,
            labelID,
            isRequired
        });
    }

    //
    // Setup $validation:
    //

    const editorElem = $fieldEditorContainer.children().first();
    const $validationTarget = editorElem.hasClass(TEMPLATE_WRAPPER_CLASS) ? editorElem.children().first() : editorElem;
    const validationTargetInstance = $validationTarget && $validationTarget.data('dx-validation-target');

    if(validationTargetInstance) {
        const isItemHaveCustomLabel = item.label && item.label.text;
        const itemName = isItemHaveCustomLabel ? null : name;
        const fieldName = isItemHaveCustomLabel ? item.label.text : itemName && captionize(itemName);
        let validationRules;

        if(item.isSimpleItem) {
            if(item.validationRules) {
                validationRules = item.validationRules;
            } else {
                const requiredMessage = format(formRequiredMessage, fieldName || '');
                validationRules = item.isRequired ? [{ type: 'required', message: requiredMessage }] : null;
            }
        }

        if(Array.isArray(validationRules) && validationRules.length) {
            createComponentCallback($validationTarget, Validator, {
                validationRules: validationRules,
                validationGroup: formValidationGroup,
                dataGetter: function() {
                    return {
                        formItem: item
                    };
                }
            });
        }

        if(isMaterial()) {
            const wrapperClass = '.' + FIELD_ITEM_CONTENT_WRAPPER_CLASS;
            const toggleInvalidClass = function(e) {
                $(e.element).parents(wrapperClass)
                    .toggleClass(INVALID_CLASS, e.component._isFocused() && e.component.option('isValid') === false);
            };

            validationTargetInstance
                .on('focusIn', toggleInvalidClass)
                .on('focusOut', toggleInvalidClass)
                .on('enterKey', toggleInvalidClass);
        }
    }

    //
    // Append help text elements:
    //

    if(helpText && item.isSimpleItem) {
        const $editorParent = $fieldEditorContainer.parent();

        // TODO: DOM hierarchy is changed here: new node is added between $editor and $editor.parent()
        $editorParent.append(
            $('<div>')
                .addClass(FIELD_ITEM_CONTENT_WRAPPER_CLASS)
                .append($fieldEditorContainer)
                .append(renderHelpText(helpText, helpID))
        );
    }

    return { $fieldEditorContainer, instance };
}
