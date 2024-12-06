import Popup from '../popup/ui.popup';
import Form from '../form';
import '../tag_box';
import '../radio_group';
import dateLocalization from '../../common/core/localization/date';
import messageLocalization from '../../common/core/localization/message';
import '../list_light';
import '../../__internal/ui/list/modules/m_deleting';

export class GanttDialog {
    constructor(owner, $element) {
        this._popupInstance = owner._createComponent($element, Popup);

        this.infoMap = {
            TaskEdit: TaskEditDialogInfo,
            Resources: ResourcesEditDialogInfo,
            Confirmation: ConfirmDialogInfo,
            ConstraintViolation: ConstraintViolationDialogInfo
        };
    }
    _apply() {
        if(this._dialogInfo.isValidated()) {
            const result = this._dialogInfo.getResult();
            this._callback(result);
            this.hide();
        }
    }

    show(name, parameters, callback, afterClosing, editingOptions) {
        this._callback = callback;
        this._afterClosing = afterClosing;

        if(!this.infoMap[name]) {
            return;
        }
        const isRefresh = this._popupInstance._isVisible() && this._dialogInfo && this._dialogInfo instanceof this.infoMap[name];
        this._dialogInfo = new this.infoMap[name](parameters, this._apply.bind(this), this.hide.bind(this), editingOptions);
        this._popupInstance.option({
            showTitle: !!this._dialogInfo.getTitle(),
            title: this._dialogInfo.getTitle(),
            toolbarItems: this._dialogInfo.getToolbarItems(),
            maxWidth: this._dialogInfo.getMaxWidth(),
            height: this._dialogInfo.getHeight(),
            contentTemplate: this._dialogInfo.getContentTemplate()
        });
        if(this._afterClosing) {
            this._popupInstance.option('onHidden', this._afterClosing);
        }
        if(!isRefresh) {
            this._popupInstance.show();
        }
    }
    hide() {
        this._popupInstance.hide();
        if(this._afterClosing) {
            this._afterClosing();
        }
    }
}

class DialogInfoBase {
    constructor(parameters, applyAction, hideAction, editingOptions) {
        this._parameters = parameters;
        this._applyAction = applyAction;
        this._hideAction = hideAction;
        this._editingOptions = editingOptions;
    }

    _getFormItems() { return {}; }
    _getFormCssClass() { return ''; }
    _getFormData() { return this._parameters; }
    _updateParameters() {}
    _getOkToolbarItem() {
        return this._getToolbarItem('OK', this._applyAction);
    }
    _getCancelToolbarItem() {
        return this._getToolbarItem('Cancel', this._hideAction);
    }
    _getYesToolbarItem() {
        return this._getToolbarItem('Yes', this._applyAction);
    }
    _getNoToolbarItem() {
        return this._getToolbarItem('No', this._hideAction);
    }
    _getToolbarItem(localizationText, action) {
        return {
            widget: 'dxButton',
            toolbar: 'bottom',
            options: {
                text: messageLocalization.format(localizationText),
                onClick: action
            }
        };
    }
    getTitle() { return ''; }
    getToolbarItems() {
        return this._editingOptions.enabled ?
            [ this._getOkToolbarItem(), this._getCancelToolbarItem()] : [this._getCancelToolbarItem()];
    }
    getMaxWidth() { return 400; }
    getHeight() { return 'auto'; }
    getContentTemplate() {
        return (content) => {
            this._form = new Form(content, {
                formData: this._getFormData(),
                items: this._getFormItems(),
                elementAttr: {
                    class: this._getFormCssClass()
                },
                rtlEnabled: false
            });
            return content;
        };
    }
    getResult() {
        const formData = this.getFormData();
        this._updateParameters(formData);
        return this._parameters;
    }
    getFormData() {
        const formData = this._form && this._form.option('formData');
        return formData;
    }
    isValidated() {
        return true;
    }
}

class TaskEditDialogInfo extends DialogInfoBase {
    getTitle() { return messageLocalization.format('dxGantt-dialogTaskDetailsTitle'); }
    _getFormItems() {
        const readOnly = !this._editingOptions.enabled || !this._editingOptions.allowTaskUpdating;
        const readOnlyRange = readOnly || !this._parameters.enableRangeEdit;
        return [{
            dataField: 'title',
            editorType: 'dxTextBox',
            label: { text: messageLocalization.format('dxGantt-dialogTitle') },
            editorOptions: { readOnly: readOnly || this._isReadOnlyField('title') },
            visible: !this._isHiddenField('title')
        }, {
            dataField: 'start',
            editorType: 'dxDateBox',
            label: { text: messageLocalization.format('dxGantt-dialogStartTitle') },
            editorOptions: {
                type: 'datetime',
                width: '100%',
                readOnly: readOnlyRange || this._isReadOnlyField('start')
            },
            visible: !this._isHiddenField('start'),
            validationRules: [{
                type: 'required',
                message: messageLocalization.format('validation-required-formatted', messageLocalization.format('dxGantt-dialogStartTitle'))
            },
            {
                type: 'custom',
                validationCallback: (e) => {
                    if(this._parameters.isValidationRequired) {
                        const correctDateRange = this._parameters.getCorrectDateRange(this._parameters.id, e.value, this._parameters.end);
                        if(correctDateRange.start.getTime() !== e.value.getTime()) {
                            e.rule.message = this._getValidationMessage(true, correctDateRange.start);
                            return false;
                        }
                    }
                    return true;
                },
            }
            ]
        }, {
            dataField: 'end',
            editorType: 'dxDateBox',
            label: { text: messageLocalization.format('dxGantt-dialogEndTitle') },
            editorOptions: {
                type: 'datetime',
                width: '100%',
                readOnly: readOnlyRange || this._isReadOnlyField('end')
            },
            visible: !this._isHiddenField('end'),
            validationRules: [{
                type: 'required',
                message: messageLocalization.format('validation-required-formatted', messageLocalization.format('dxGantt-dialogEndTitle'))
            },
            {
                type: 'custom',
                validationCallback: (e) => {
                    if(this._parameters.isValidationRequired) {
                        const correctDateRange = this._parameters.getCorrectDateRange(this._parameters.id, this._parameters.start, e.value);
                        if(correctDateRange.end.getTime() !== e.value.getTime()) {
                            e.rule.message = this._getValidationMessage(false, correctDateRange.end);
                            return false;
                        }
                    }
                    return true;
                },
            }]
        }, {
            dataField: 'progress',
            editorType: 'dxNumberBox',
            label: { text: messageLocalization.format('dxGantt-dialogProgressTitle') },
            editorOptions: {
                showSpinButtons: true,
                min: 0,
                max: 1,
                format: '#0%',
                step: 0.01,
                readOnly: readOnlyRange || this._isReadOnlyField('progress')
            },
            visible: !this._isHiddenField('progress')
        }, {
            dataField: 'assigned.items',
            editorType: 'dxTagBox',
            label: { text: messageLocalization.format('dxGantt-dialogResourcesTitle') },
            editorOptions: {
                readOnly: readOnly || !this._editingOptions.allowTaskResourceUpdating,
                dataSource: this._parameters.resources.items,
                displayExpr: 'text',
                buttons: [{
                    name: 'editResources',
                    location: 'after',
                    options: {
                        disabled: !this._editingOptions.allowResourceAdding && !this._editingOptions.allowResourceDeleting,
                        text: '...',
                        hint: messageLocalization.format('dxGantt-dialogEditResourceListHint'),
                        onClick: () => {
                            const showTaskEditDialogCallback = () => { this._parameters.showTaskEditDialogCommand.execute(); };
                            this._parameters.showResourcesDialogCommand.execute(showTaskEditDialogCallback);
                        }
                    }
                }]
            }
        }];
    }
    _getValidationMessage(isStartDependencies, correctDate) {
        if(isStartDependencies) {
            return messageLocalization.format('dxGantt-dialogStartDateValidation', this._getFormattedDateText(correctDate));
        }
        return messageLocalization.format('dxGantt-dialogEndDateValidation', this._getFormattedDateText(correctDate));

    }
    _getFormattedDateText(date) {
        return date ? dateLocalization.format(date, 'shortDateShortTime') : '';
    }
    _isReadOnlyField(field) {
        return this._parameters.readOnlyFields.indexOf(field) > -1;
    }
    _isHiddenField(field) {
        return this._parameters.hiddenFields.indexOf(field) > -1;
    }
    _getFormData() {
        const data = {};
        for(const field in this._parameters) {
            data[field] = field === 'progress' ? this._parameters[field] / 100 : this._parameters[field];
        }
        return data;
    }
    _updateParameters(formData) {
        this._parameters.title = formData.title;
        this._parameters.start = formData.start;
        this._parameters.end = formData.end;
        this._parameters.progress = formData.progress * 100;
        this._parameters.assigned = formData.assigned;
    }
    isValidated() {
        const validationResult = this._form?.validate();
        return validationResult?.isValid;
    }
}

class ResourcesEditDialogInfo extends DialogInfoBase {
    getTitle() { return messageLocalization.format('dxGantt-dialogResourceManagerTitle'); }
    _getFormItems() {
        return [{
            label: { visible: false },
            dataField: 'resources.items',
            editorType: 'dxList',
            editorOptions: {
                allowItemDeleting: this._editingOptions.enabled && this._editingOptions.allowResourceDeleting,
                itemDeleteMode: 'static',
                selectionMode: 'none',
                items: this._parameters.resources.items,
                height: 250,
                noDataText: messageLocalization.format('dxGantt-dialogEditNoResources'),
                onInitialized: (e) => { this.list = e.component; },
                onItemDeleted: (e) => { this._parameters.resources.remove(e.itemData); }
            }
        }, {
            label: { visible: false },
            editorType: 'dxTextBox',
            editorOptions: {
                readOnly: !this._editingOptions.enabled || !this._editingOptions.allowResourceAdding,
                onInitialized: (e) => { this.textBox = e.component; },
                onInput: (e) => {
                    const addButton = e.component.getButton('addResource');
                    const resourceName = e.component.option('text');
                    addButton.option('disabled', resourceName.length === 0);
                },
                buttons: [{
                    name: 'addResource',
                    location: 'after',
                    options: {
                        text: messageLocalization.format('dxGantt-dialogButtonAdd'),
                        disabled: true,
                        onClick: (e) => {
                            const newItem = this._parameters.resources.createItem();
                            newItem.text = this.textBox.option('text');
                            this._parameters.resources.add(newItem);
                            this.list.option('items', this._parameters.resources.items);
                            this.list.scrollToItem(newItem);
                            this.textBox.clear();
                            e.component.option('disabled', true);
                        }
                    }
                }]
            }
        }];
    }
}

class ConfirmDialogInfo extends DialogInfoBase {
    getContentTemplate() {
        return (content) => {
            return this._getConfirmMessage();
        };
    }
    _getConfirmMessage() {
        switch(this._parameters.type) {
            case 0: return messageLocalization.format('dxGantt-dialogTaskDeleteConfirmation');
            case 1: return messageLocalization.format('dxGantt-dialogDependencyDeleteConfirmation');
            case 2: return messageLocalization.format('dxGantt-dialogResourcesDeleteConfirmation', this._parameters.message);
            default: return '';
        }
    }
    getToolbarItems() {
        return [ this._getYesToolbarItem(), this._getNoToolbarItem()];
    }
}

class ConstraintViolationDialogInfo extends DialogInfoBase {
    _getFormItems() {
        const hasCriticalErrors = this._parameters.hasCriticalErrors;
        const severalErrors = this._parameters.errorsCount > 1;
        const items = [];
        const deleteMessage = severalErrors ? 'dxGantt-dialogDeleteDependenciesMessage' : 'dxGantt-dialogDeleteDependencyMessage';
        const moveMessage = severalErrors ? 'dxGantt-dialogMoveTaskAndKeepDependenciesMessage' : 'dxGantt-dialogMoveTaskAndKeepDependencyMessage';
        let titleMessage;
        if(hasCriticalErrors) {
            titleMessage = severalErrors ? 'dxGantt-dialogConstraintCriticalViolationSeveralTasksMessage' : 'dxGantt-dialogConstraintCriticalViolationMessage';
        } else {
            titleMessage = severalErrors ? 'dxGantt-dialogConstraintViolationSeveralTasksMessage' : 'dxGantt-dialogConstraintViolationMessage';
        }
        items.push({ text: messageLocalization.format('dxGantt-dialogCancelOperationMessage'), value: 0 });
        items.push({ text: messageLocalization.format(deleteMessage), value: 1 });
        if(!hasCriticalErrors) {
            items.push({ text: messageLocalization.format(moveMessage), value: 2 });
        }

        return [{
            template: messageLocalization.format(titleMessage)
        }, {
            cssClass: 'dx-cv-dialog-row',
            dataField: 'option',
            label: { visible: false },
            editorType: 'dxRadioGroup',
            editorOptions: {
                items: items,
                valueExpr: 'value',
                value: 0
            }
        }];
    }
    _getFormCssClass() {
        return 'dx-cv-dialog';
    }
    _updateParameters(formData) {
        this._parameters.option = formData.option;
    }
}
