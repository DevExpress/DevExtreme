import Popup from "../popup";
import dxForm from "../form";
import $ from "../../core/renderer";

export class GanttDialog {
    constructor(owner, $element) {
        this._popupInstance = owner._createComponent($element, Popup);

        this.infoMap = {};
        this.infoMap["TaskEdit"] = TaskEditDialogInfo;
    }
    _apply() {
        const result = this._dialogInfo.getResult();
        this._callback(result);
        this.hide();
    }

    _clean() {
        delete this._popupInstance;
    }

    show(name, parameters, callback) {
        this._callback = callback;

        if(!this.infoMap[name]) {
            return;
        }
        this._dialogInfo = new this.infoMap[name](parameters, this._apply.bind(this), this.hide.bind(this));
        this._popupInstance.option("title", this._dialogInfo.getTitle());
        this._popupInstance.option("toolbarItems", this._dialogInfo.getToolbarItems());
        this._popupInstance.option("maxWidth", this._dialogInfo.getMaxWidth());
        this._popupInstance.option("height", this._dialogInfo.getHeight());
        this._popupInstance.option("contentTemplate", this._dialogInfo.getContentTemplate());
        this._popupInstance.show();
    }
    hide() {
        this._popupInstance.hide();
        delete this._dialogInfo;
    }
}

class DialogInfoBase {
    constructor(parameters, applyAction, hideAction) {
        this._parameters = parameters;
        this._applyAction = applyAction;
        this._hideAction = hideAction;
    }

    _getFormOptions() { return {}; }
    _updateParameters() {}
    _getOkToolbarItem() {
        return {
            widget: "dxButton",
            location: "after",
            toolbar: "bottom",
            options: {
                text: "Ok",
                onClick: this._applyAction
            }
        };
    }
    _getCancelToolbarItem() {
        return {
            widget: "dxButton",
            location: "after",
            toolbar: "bottom",
            options: {
                text: "Cancel",
                onClick: this._hideAction
            }
        };
    }

    getTitle() { return ""; }
    getToolbarItems() { return [ this._getOkToolbarItem(), this._getCancelToolbarItem()]; }
    getMaxWidth() { return 400; }
    getHeight() { return "auto"; }
    getContentTemplate() {
        return () => {
            const element = $("<div>");
            this._form = new dxForm(element, this._getFormOptions());
            return element;
        };
    }
    getResult() {
        const data = this._form.option("formData");
        this._updateParameters(data);
        return this._parameters;
    }
}

class TaskEditDialogInfo extends DialogInfoBase {
    getTitle() { return "Task Information"; }
    _getFormOptions() {
        return {
            items: [{
                dataField: "title",
                editorType: "dxTextBox",
                label: { text: "Title", location: "left" },
                editorOptions: {
                    value: this._parameters.title
                }
            }, {
                dataField: "start",
                editorType: "dxDateBox",
                label: { text: "Start", location: "left" },
                editorOptions: {
                    value: this._parameters.start,
                    type: "datetime",
                    width: "100%"
                }
            }, {
                dataField: "end",
                editorType: "dxDateBox",
                label: { text: "End", location: "left" },
                editorOptions: {
                    value: this._parameters.end,
                    type: "datetime",
                    width: "100%"
                }
            }, {
                dataField: "progress",
                editorType: "dxNumberBox",
                label: { text: "Progress", location: "left" },
                editorOptions: {
                    value: this._parameters.progress,
                    showSpinButtons: true,
                    min: 0,
                    max: 100
                }
            }]
        };
    }
    _updateParameters(data) {
        this._parameters.title = data.title;
        this._parameters.start = data.start;
        this._parameters.end = data.end;
        this._parameters.progress = data.progress;
    }
}
