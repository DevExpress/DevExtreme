import Popup from '../popup';
import Form from '../form';
import '../tag_box';
import messageLocalization from '../../localization/message';

export class GanttDialog {
    constructor(owner, $element) {
        this._popupInstance = owner._createComponent($element, Popup);

        this.infoMap = {
            TaskEdit: TaskEditDialogInfo,
            Resources: ResourcesEditDialogInfo
        };
    }
    _apply() {
        const result = this._dialogInfo.getResult();
        this._callback(result);
        this.hide();
    }

    show(name, parameters, callback, editingOptions) {
        this._callback = callback;

        if(!this.infoMap[name]) {
            return;
        }
        this._dialogInfo = new this.infoMap[name](parameters, this._apply.bind(this), this.hide.bind(this), editingOptions);
        this._popupInstance.option({
            title: this._dialogInfo.getTitle(),
            toolbarItems: this._dialogInfo.getToolbarItems(),
            maxWidth: this._dialogInfo.getMaxWidth(),
            height: this._dialogInfo.getHeight(),
            contentTemplate: this._dialogInfo.getContentTemplate()
        });
        this._popupInstance.show();
    }
    hide() {
        this._popupInstance.hide();
        delete this._dialogInfo;
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
    _updateParameters() {}
    _getOkToolbarItem() {
        return {
            widget: 'dxButton',
            location: 'after',
            toolbar: 'bottom',
            options: {
                text: messageLocalization.format('OK'),
                onClick: this._applyAction
            }
        };
    }
    _getCancelToolbarItem() {
        return {
            widget: 'dxButton',
            location: 'after',
            toolbar: 'bottom',
            options: {
                text: messageLocalization.format('Cancel'),
                onClick: this._hideAction
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
                formData: this._parameters,
                items: this._getFormItems()
            });
            return content;
        };
    }
    getResult() {
        const formData = this._form.option('formData');
        this._updateParameters(formData);
        return this._parameters;
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
            editorOptions: { readOnly: readOnly }
        }, {
            dataField: 'start',
            editorType: 'dxDateBox',
            label: { text: messageLocalization.format('dxGantt-dialogStartTitle') },
            editorOptions: {
                type: 'datetime',
                width: '100%',
                readOnly: readOnlyRange
            }
        }, {
            dataField: 'end',
            editorType: 'dxDateBox',
            label: { text: messageLocalization.format('dxGantt-dialogEndTitle') },
            editorOptions: {
                type: 'datetime',
                width: '100%',
                readOnly: readOnlyRange
            }
        }, {
            dataField: 'progress',
            editorType: 'dxNumberBox',
            label: { text: messageLocalization.format('dxGantt-dialogProgressTitle') },
            editorOptions: {
                value: this._parameters.progress / 100,
                showSpinButtons: true,
                min: 0,
                max: 1,
                format: '#0%',
                step: 0.01,
                readOnly: readOnlyRange
            }
        }, {
            dataField: 'assigned.items',
            editorType: 'dxTagBox',
            label: { text: messageLocalization.format('dxGantt-dialogResourcesTitle') },
            editorOptions: {
                readOnly: readOnly,
                dataSource: this._parameters.resources.items,
                displayExpr: 'text',
                buttons: [{
                    name: 'editResources',
                    location: 'after',
                    options: {
                        text: '...',
                        hint: messageLocalization.format('dxGantt-dialogEditResourceListHint'),
                        onClick: () => {
                            this._parameters.showResourcesDialogCommand.execute();
                        }
                    }
                }]
            }
        }];
    }
    _updateParameters(formData) {
        this._parameters.title = formData.title;
        this._parameters.start = formData.start;
        this._parameters.end = formData.end;
        this._parameters.progress = formData.progress * 100;
        this._parameters.assigned = formData.assigned;
    }
}

class ResourcesEditDialogInfo extends DialogInfoBase {
    getTitle() { return messageLocalization.format('dxGantt-dialogResourcesTitle'); }
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
                            this.textBox.reset();
                            e.component.option('disabled', true);
                        }
                    }
                }]
            }
        }];
    }
}
