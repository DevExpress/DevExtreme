/* eslint-disable max-classes-per-file,@typescript-eslint/explicit-module-boundary-types */
import '@js/ui/tag_box';
import '@js/ui/radio_group';
import '@js/ui/list_light';
import '@ts/ui/list/modules/deleting';

import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import Form from '@ts/ui/form/form';
import Popup from '@ts/ui/popup/m_popup';

class DialogInfoBase {
  _form?: Form;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _parameters?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _applyAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _hideAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _editingOptions?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _owner?: any;

  constructor(parameters, applyAction, hideAction, editingOptions, owner) {
    this._parameters = parameters;
    this._applyAction = applyAction;
    this._hideAction = hideAction;
    this._editingOptions = editingOptions;
    this._owner = owner;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFormItems() {
    return {};
  }

  _getFormCssClass(): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFormData() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._parameters;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateParameters(_formData): void {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getOkToolbarItem() {
    return this._getToolbarItem('OK', this._applyAction);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getCancelToolbarItem() {
    return this._getToolbarItem('Cancel', this._hideAction);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getYesToolbarItem() {
    return this._getToolbarItem('Yes', this._applyAction);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getNoToolbarItem() {
    return this._getToolbarItem('No', this._hideAction);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getToolbarItem(localizationText, action) {
    return {
      widget: 'dxButton',
      toolbar: 'bottom',
      options: {
        text: messageLocalization.format(localizationText),
        onClick: action,
      },
    };
  }

  getTitle(): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getToolbarItems() {
    return this._editingOptions.enabled
      ? [this._getOkToolbarItem(), this._getCancelToolbarItem()]
      : [this._getCancelToolbarItem()];
  }

  getMaxWidth(): number {
    return 400;
  }

  getHeight(): string {
    return 'auto';
  }

  getContentTemplate() {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (content) => {
      // @ts-expect-error ts-error
      this._form = new Form(content, {
        formData: this._getFormData(),
        items: this._getFormItems(),
        elementAttr: {
          class: this._getFormCssClass(),
        },
        rtlEnabled: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return content;
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getResult() {
    const formData = this.getFormData();
    this._updateParameters(formData);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._parameters;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getFormData() {
    const formData = this._form?.option('formData');
    return formData;
  }

  isValidated(): boolean {
    return true;
  }

  shouldHidePopup(): boolean {
    return true;
  }
}

class TaskEditDialogInfo extends DialogInfoBase {
  getTitle(): string {
    return messageLocalization.format('dxGantt-dialogTaskDetailsTitle');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFormItems() {
    const readOnly = !this._editingOptions.enabled || !this._editingOptions.allowTaskUpdating;
    const readOnlyRange = readOnly || !this._parameters.enableRangeEdit;
    return [
      {
        dataField: 'title',
        editorType: 'dxTextBox',
        label: { text: messageLocalization.format('dxGantt-dialogTitle') },
        editorOptions: { readOnly: readOnly || this._isReadOnlyField('title') },
        visible: !this._isHiddenField('title'),
      },
      {
        dataField: 'start',
        editorType: 'dxDateBox',
        label: { text: messageLocalization.format('dxGantt-dialogStartTitle') },
        editorOptions: {
          type: 'datetime',
          width: '100%',
          readOnly: readOnlyRange || this._isReadOnlyField('start'),
        },
        visible: !this._isHiddenField('start'),
        validationRules: [
          {
            type: 'required',
            message: messageLocalization.format(
              'validation-required-formatted',
              // @ts-expect-error ts-error
              messageLocalization.format('dxGantt-dialogStartTitle'),
            ),
          },
          {
            type: 'custom',
            validationCallback: (e): boolean => {
              if (this._parameters.isValidationRequired) {
                const correctDateRange = this._parameters.getCorrectDateRange(
                  this._parameters.id,
                  e.value,
                  this._parameters.end,
                );
                if (correctDateRange.start.getTime() !== e.value.getTime()) {
                  e.rule.message = this._getValidationMessage(
                    true,
                    correctDateRange.start,
                  );
                  return false;
                }
              }
              return true;
            },
          },
        ],
      },
      {
        dataField: 'end',
        editorType: 'dxDateBox',
        label: { text: messageLocalization.format('dxGantt-dialogEndTitle') },
        editorOptions: {
          type: 'datetime',
          width: '100%',
          readOnly: readOnlyRange || this._isReadOnlyField('end'),
        },
        visible: !this._isHiddenField('end'),
        validationRules: [
          {
            type: 'required',
            message: messageLocalization.format(
              'validation-required-formatted',
              // @ts-expect-error ts-error
              messageLocalization.format('dxGantt-dialogEndTitle'),
            ),
          },
          {
            type: 'custom',
            validationCallback: (e): boolean => {
              if (this._parameters.isValidationRequired) {
                const correctDateRange = this._parameters.getCorrectDateRange(
                  this._parameters.id,
                  this._parameters.start,
                  e.value,
                );
                if (correctDateRange.end.getTime() !== e.value.getTime()) {
                  e.rule.message = this._getValidationMessage(
                    false,
                    correctDateRange.end,
                  );
                  return false;
                }
              }
              return true;
            },
          },
        ],
      },
      {
        dataField: 'progress',
        editorType: 'dxNumberBox',
        label: {
          text: messageLocalization.format('dxGantt-dialogProgressTitle'),
        },
        editorOptions: {
          showSpinButtons: true,
          min: 0,
          max: 1,
          format: '#0%',
          step: 0.01,
          readOnly: readOnlyRange || this._isReadOnlyField('progress'),
        },
        visible: !this._isHiddenField('progress'),
      },
      {
        dataField: 'assigned.items',
        editorType: 'dxTagBox',
        label: {
          text: messageLocalization.format('dxGantt-dialogResourcesTitle'),
        },
        editorOptions: {
          readOnly: readOnly || !this._editingOptions.allowTaskResourceUpdating,
          dataSource: this._parameters.resources.items,
          displayExpr: 'text',
          buttons: [
            {
              name: 'editResources',
              location: 'after',
              options: {
                disabled:
                  !this._editingOptions.allowResourceAdding
                  && !this._editingOptions.allowResourceDeleting,
                text: '...',
                hint: messageLocalization.format(
                  'dxGantt-dialogEditResourceListHint',
                ),
                onClick: (): void => {
                  const formData = this.getFormData();

                  const showTaskEditDialogCallback = (): void => {
                    this._parameters.showTaskEditDialogCommand.execute();

                    this._restoreFormData(formData);
                  };

                  this._parameters.showResourcesDialogCommand.execute(
                    showTaskEditDialogCallback,
                  );
                },
              },
            },
          ],
        },
      },
    ];
  }

  _restoreFormData(formData): void {
    const newForm = this._owner._dialogInfo._form;

    const titleEdit = newForm.getEditor('title');
    const assignedEdit = newForm.getEditor('assigned.items');
    const startEdit = newForm.getEditor('start');
    const endEdit = newForm.getEditor('end');
    const progressEdit = newForm.getEditor('progress');

    titleEdit.option('value', formData.title);
    assignedEdit.option('value', formData.assigned.items);
    startEdit.option('value', formData.start);
    endEdit.option('value', formData.end);
    progressEdit.option('value', formData.progress);
  }

  _getValidationMessage(isStartDependencies, correctDate): string {
    if (isStartDependencies) {
      return messageLocalization.format(
        'dxGantt-dialogStartDateValidation',
        // @ts-expect-error ts-error
        this._getFormattedDateText(correctDate),
      );
    }
    return messageLocalization.format(
      'dxGantt-dialogEndDateValidation',
      // @ts-expect-error ts-error
      this._getFormattedDateText(correctDate),
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFormattedDateText(date) {
    return date ? dateLocalization.format(date, 'shortDateShortTime') : '';
  }

  _isReadOnlyField(field): boolean {
    return this._parameters.readOnlyFields.indexOf(field) > -1;
  }

  _isHiddenField(field): boolean {
    return this._parameters.hiddenFields.indexOf(field) > -1;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFormData() {
    const data = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const field in this._parameters) {
      data[field] = field === 'progress'
        ? this._parameters[field] / 100
        : this._parameters[field];
    }
    return data;
  }

  _updateParameters(formData): void {
    this._parameters.title = formData.title;
    this._parameters.start = formData.start;
    this._parameters.end = formData.end;
    this._parameters.progress = Math.round(formData.progress * 100);
    this._parameters.assigned = formData.assigned;
  }

  isValidated(): boolean {
    const validationResult = this._form?.validate();
    // @ts-expect-error ts-error
    return validationResult?.isValid;
  }
}

class ResourcesEditDialogInfo extends DialogInfoBase {
  getTitle(): string {
    return messageLocalization.format('dxGantt-dialogResourceManagerTitle');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFormItems() {
    return [
      {
        label: { visible: false },
        dataField: 'resources.items',
        editorType: 'dxList',
        editorOptions: {
          allowItemDeleting:
            this._editingOptions.enabled
            && this._editingOptions.allowResourceDeleting,
          itemDeleteMode: 'static',
          selectionMode: 'none',
          items: this._parameters.resources.items,
          height: 250,
          noDataText: messageLocalization.format(
            'dxGantt-dialogEditNoResources',
          ),
          onInitialized: (e): void => {
            // @ts-expect-error ts-error
            this.list = e.component;
          },
          onItemDeleted: (e): void => {
            this._parameters.resources.remove(e.itemData);
          },
        },
      },
      {
        label: { visible: false },
        editorType: 'dxTextBox',
        editorOptions: {
          readOnly:
            !this._editingOptions.enabled
            || !this._editingOptions.allowResourceAdding,
          onInitialized: (e): void => {
            // @ts-expect-error ts-error
            this.textBox = e.component;
          },
          onInput: (e): void => {
            const addButton = e.component.getButton('addResource');
            const resourceName = e.component.option('text');
            addButton.option('disabled', resourceName.length === 0);
          },
          buttons: [
            {
              name: 'addResource',
              location: 'after',
              options: {
                text: messageLocalization.format('dxGantt-dialogButtonAdd'),
                disabled: true,
                onClick: (e): void => {
                  const newItem = this._parameters.resources.createItem();
                  // @ts-expect-error ts-error
                  newItem.text = this.textBox.option('text');
                  this._parameters.resources.add(newItem);
                  // @ts-expect-error ts-error
                  this.list.option('items', this._parameters.resources.items);
                  // @ts-expect-error ts-error
                  this.list.scrollToItem(newItem);
                  // @ts-expect-error ts-error
                  this.textBox.clear();
                  e.component.option('disabled', true);
                },
              },
            },
          ],
        },
      },
    ];
  }

  shouldHidePopup(): boolean {
    return false;
  }
}

class ConfirmDialogInfo extends DialogInfoBase {
  getContentTemplate() {
    return (): string => this._getConfirmMessage();
  }

  _getConfirmMessage(): string {
    switch (this._parameters.type) {
      case 0:
        return messageLocalization.format(
          'dxGantt-dialogTaskDeleteConfirmation',
        );
      case 1:
        return messageLocalization.format(
          'dxGantt-dialogDependencyDeleteConfirmation',
        );
      case 2:
        return messageLocalization.format(
          'dxGantt-dialogResourcesDeleteConfirmation',
          // @ts-expect-error ts-error
          this._parameters.message,
        );
      default:
        return '';
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getToolbarItems() {
    return [this._getYesToolbarItem(), this._getNoToolbarItem()];
  }
}

class ConstraintViolationDialogInfo extends DialogInfoBase {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getFormItems() {
    const { hasCriticalErrors } = this._parameters;
    const severalErrors = this._parameters.errorsCount > 1;
    const items: { text?: string; value?: number }[] = [];
    const deleteMessage = severalErrors
      ? 'dxGantt-dialogDeleteDependenciesMessage'
      : 'dxGantt-dialogDeleteDependencyMessage';
    const moveMessage = severalErrors
      ? 'dxGantt-dialogMoveTaskAndKeepDependenciesMessage'
      : 'dxGantt-dialogMoveTaskAndKeepDependencyMessage';
    let titleMessage = '';
    if (hasCriticalErrors) {
      titleMessage = severalErrors
        ? 'dxGantt-dialogConstraintCriticalViolationSeveralTasksMessage'
        : 'dxGantt-dialogConstraintCriticalViolationMessage';
    } else {
      titleMessage = severalErrors
        ? 'dxGantt-dialogConstraintViolationSeveralTasksMessage'
        : 'dxGantt-dialogConstraintViolationMessage';
    }
    items.push({
      text: messageLocalization.format('dxGantt-dialogCancelOperationMessage'),
      value: 0,
    });
    items.push({ text: messageLocalization.format(deleteMessage), value: 1 });
    if (!hasCriticalErrors) {
      items.push({ text: messageLocalization.format(moveMessage), value: 2 });
    }

    return [
      {
        template: messageLocalization.format(titleMessage),
      },
      {
        cssClass: 'dx-cv-dialog-row',
        dataField: 'option',
        label: { visible: false },
        editorType: 'dxRadioGroup',
        editorOptions: {
          items,
          valueExpr: 'value',
          value: 0,
        },
      },
    ];
  }

  _getFormCssClass(): string {
    return 'dx-cv-dialog';
  }

  _updateParameters(formData): void {
    this._parameters.option = formData.option;
  }
}

export class GanttDialog {
  _popupInstance?: Popup;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  infoMap: Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dialogInfo: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _callback: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _afterClosing: any;

  constructor(owner, $element) {
    this._popupInstance = owner._createComponent($element, Popup);

    this.infoMap = {
      TaskEdit: TaskEditDialogInfo,
      Resources: ResourcesEditDialogInfo,
      Confirmation: ConfirmDialogInfo,
      ConstraintViolation: ConstraintViolationDialogInfo,
    };
  }

  _apply(): void {
    if (this._dialogInfo.isValidated()) {
      const result = this._dialogInfo.getResult();
      this._callback(result);
      this.hide();
    }
  }

  show(name, parameters, callback, afterClosing, editingOptions): void {
    this._callback = callback;
    this._afterClosing = afterClosing;

    if (!this.infoMap[name]) {
      return;
    }
    const isRefresh = this._popupInstance?._isVisible()
      && this._dialogInfo
      && this._dialogInfo instanceof this.infoMap[name];
    this._dialogInfo = new this.infoMap[name](
      parameters,
      this._apply.bind(this),
      this.hide.bind(this),
      editingOptions,
      this,
    );
    this._popupInstance?.option({
      showTitle: !!this._dialogInfo.getTitle(),
      title: this._dialogInfo.getTitle(),
      toolbarItems: this._dialogInfo.getToolbarItems(),
      maxWidth: this._dialogInfo.getMaxWidth(),
      height: this._dialogInfo.getHeight(),
      contentTemplate: this._dialogInfo.getContentTemplate(),
    });
    if (this._afterClosing) {
      this._popupInstance?.option('onHidden', this._afterClosing);
    }
    if (!isRefresh) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._popupInstance?.show();
    }
  }

  hide(): void {
    if (this._dialogInfo.shouldHidePopup()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._popupInstance?.hide();
    }

    if (this._afterClosing) {
      this._afterClosing();
    }
  }
}
