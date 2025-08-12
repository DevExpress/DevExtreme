import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { camelize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import { getOuterHeight, getOuterWidth, getWidth } from '@js/core/utils/size';
import { isBoolean, isDefined } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { InitializedEvent as InitializedButtonGroupEvent } from '@js/ui/button_group';
import ButtonGroup from '@js/ui/button_group';
import type { InitializedEvent as InitializedColorBoxEvent } from '@js/ui/color_box';
import ColorBox from '@js/ui/color_box';
import type { SimpleItemTemplateData } from '@js/ui/form';
import Form from '@js/ui/form';
import ScrollView from '@js/ui/scroll_view';

import { getQuill } from '../m_quill_importer';
import type { AIDialogResult, AIDialogShowPayload } from '../ui/aiDialog';
import { ImageUploader } from './m_image_uploader_helper';
import {
  getAutoSizedElements,
  getColumnElements,
  getLineElements,
  getRowElements,
  getTableOperationHandler,
  hasEmbedContent,
  setLineElementsFormat,
  unfixTableWidth,
} from './m_table_helper';

const MIN_HEIGHT = 400;
const BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];

const USER_ACTION = 'user';
const SILENT_ACTION = 'silent';

const DIALOG_COLOR_CAPTION = 'dxHtmlEditor-dialogColorCaption';
const DIALOG_BACKGROUND_CAPTION = 'dxHtmlEditor-dialogBackgroundCaption';
const DIALOG_LINK_CAPTION = 'dxHtmlEditor-dialogLinkCaption';
const DIALOG_TABLE_CAPTION = 'dxHtmlEditor-dialogInsertTableCaption';

const DIALOG_LINK_FIELD_URL = 'dxHtmlEditor-dialogLinkUrlField';
const DIALOG_LINK_FIELD_TEXT = 'dxHtmlEditor-dialogLinkTextField';
const DIALOG_LINK_FIELD_TARGET = 'dxHtmlEditor-dialogLinkTargetField';
const DIALOG_LINK_FIELD_TARGET_CLASS = 'dx-formdialog-field-target';

const DIALOG_TABLE_FIELD_COLUMNS = 'dxHtmlEditor-dialogInsertTableRowsField';
const DIALOG_TABLE_FIELD_ROWS = 'dxHtmlEditor-dialogInsertTableColumnsField';

const DEFAULT_TEXT_ALIGNMENT = 'left';
const DEFAULT_TH_TEXT_ALIGNMENT = 'center';
const DEFAULT_VERTICAL_ALIGN = 'middle';

const ICON_MAP = {
  insertHeaderRow: 'header',
  clear: 'clearformat',
};

function getBorderStylesTranslated() {
  return BORDER_STYLES.map((style) => ({
    id: style,
    value: localizationMessage.format(`dxHtmlEditor-borderStyle${camelize(style, true)}`),
  }));
}

function getFormatHandlers(module) {
  return {
    clear: ({ event }) => {
      const range = module.quill.getSelection();
      if (range) {
        module.saveValueChangeEvent(event);
        module.quill.removeFormat(range);
        getToolbarModule(module)?.updateFormatWidgets();
      }
    },
    link: prepareLinkHandler(module),
    image: prepareImageHandler(module, module.editorInstance.option('imageUpload')),
    color: prepareColorClickHandler(module, 'color'),
    background: prepareColorClickHandler(module, 'background'),
    orderedList: prepareShortcutHandler(module, 'list', 'ordered'),
    bulletList: prepareShortcutHandler(module, 'list', 'bullet'),
    alignLeft: prepareShortcutHandler(module, 'align', 'left'),
    alignCenter: prepareShortcutHandler(module, 'align', 'center'),
    alignRight: prepareShortcutHandler(module, 'align', 'right'),
    alignJustify: prepareShortcutHandler(module, 'align', 'justify'),
    codeBlock: getDefaultClickHandler(module, 'code-block'),
    undo: ({ event }) => {
      module.saveValueChangeEvent(event);
      module.quill.history.undo();
    },
    redo: ({ event }) => {
      module.saveValueChangeEvent(event);
      module.quill.history.redo();
    },
    increaseIndent: ({ event }) => {
      applyFormat(module, ['indent', '+1', USER_ACTION], event);
    },
    decreaseIndent: ({ event }) => {
      applyFormat(module, ['indent', '-1', USER_ACTION], event);
    },
    superscript: prepareShortcutHandler(module, 'script', 'super'),
    subscript: prepareShortcutHandler(module, 'script', 'sub'),
    insertTable: prepareInsertTableHandler(module),
    insertHeaderRow: getTableOperationHandler(module.quill, 'insertHeaderRow'),
    insertRowAbove: getTableOperationHandler(module.quill, 'insertRowAbove'),
    insertRowBelow: getTableOperationHandler(module.quill, 'insertRowBelow'),
    insertColumnLeft: getTableOperationHandler(module.quill, 'insertColumnLeft'),
    insertColumnRight: getTableOperationHandler(module.quill, 'insertColumnRight'),
    deleteColumn: getTableOperationHandler(module.quill, 'deleteColumn'),
    deleteRow: getTableOperationHandler(module.quill, 'deleteRow'),
    deleteTable: getTableOperationHandler(module.quill, 'deleteTable'),
    cellProperties: prepareShowFormProperties(module, 'cell'),
    tableProperties: prepareShowFormProperties(module, 'table'),
    ai: prepareAITextTrasformHandler(module),
  };
}

function prepareAITextTrasformHandler(module) {
  return (options): void => {
    const {
      command,
      commandsMap,
      parentCommand,
      prompt,
    } = options;

    const { quill } = module;
    const selection = quill.getSelection();
    const hasSelection = selection?.length > 0;
    const text = hasSelection ? quill.getText(selection) : quill.getText();

    const aiDialogConfig: AIDialogShowPayload = {
      currentCommand: parentCommand ?? command,
      currentCommandOption: parentCommand ? command : undefined,
      text,
      commandsMap,
      prompt,
    };

    const promise = module.editorInstance.showAIDialog(aiDialogConfig);

    promise.done(({
      resultText,
      event: eventData,
    }: AIDialogResult) => {
      const insertionMode = eventData.itemData.id;
      let insertIndex = 0;
      let textToInsert = resultText;

      switch (insertionMode) {
        case 'replace': {
          insertIndex = hasSelection ? selection.index : 0;
          quill.deleteText(
            insertIndex,
            hasSelection ? selection.length : quill.getLength(),
            SILENT_ACTION,
          );
          break;
        }
        case 'insertAbove': {
          insertIndex = hasSelection ? selection.index : 0;
          textToInsert = `${resultText}\n`;
          break;
        }
        case 'insertBelow': {
          insertIndex = hasSelection ? selection.index + selection.length : quill.getLength();
          break;
        }
        default:
          return;
      }

      module.saveValueChangeEvent(eventData.event);

      quill.insertText(insertIndex, textToInsert, USER_ACTION);
      quill.setSelection(insertIndex, textToInsert.length, USER_ACTION);
    });
  };
}

function resetFormDialogOptions(editorInstance, {
  contentTemplate, title, minHeight, minWidth, maxWidth,
}) {
  editorInstance.formDialogOption({
    contentTemplate,
    title,
    minHeight: minHeight ?? 0,
    minWidth: minWidth ?? 0,
    maxWidth: maxWidth ?? 'none',
  });
}

function prepareShowFormProperties(module, type) {
  return ($element) => {
    if (!$element?.length) {
      $element = $(getTargetTableNode(module, type));
    }
    const [tableBlot, rowBlot] = module.quill.getModule('table').getTable() ?? [];

    const formats = module.quill.getFormat(module.editorInstance.getSelection(true));

    const tablePropertiesFormConfig = getFormConfigConstructor(type)(module, {
      $element, formats, tableBlot, rowBlot,
    });

    const {
      contentTemplate, title, minHeight, minWidth, maxWidth,
    } = module.editorInstance._formDialog._popup.option();
    const savedOptions = {
      contentTemplate, title, minHeight, minWidth, maxWidth,
    };

    let formInstance;

    module.editorInstance.formDialogOption({
      contentTemplate: (container) => {
        const $content = $('<div>').appendTo(container);
        const $form = $('<div>').appendTo($content);
        module.editorInstance._createComponent($form, Form, tablePropertiesFormConfig.formOptions);
        module.editorInstance._createComponent($content, ScrollView, {});
        // @ts-expect-error
        formInstance = $form.dxForm('instance');

        return $content;
      },
      title: localizationMessage.format(`dxHtmlEditor-${type}Properties`),
      minHeight: MIN_HEIGHT,
      minWidth: Math.min(800, getWidth(getWindow()) * 0.9 - 1),
      maxWidth: getWidth(getWindow()) * 0.9,
    });

    const promise = module.editorInstance.showFormDialog();

    promise.done((formData, event) => {
      module.saveValueChangeEvent(event);
      tablePropertiesFormConfig.applyHandler(formInstance);
      resetFormDialogOptions(module.editorInstance, savedOptions);
    });

    promise.fail(() => {
      module.quill.focus();
      resetFormDialogOptions(module.editorInstance, savedOptions);
    });
  };
}

function applyFormat(module, formatArgs, event) {
  module.saveValueChangeEvent(event);
  module.quill.format(...formatArgs);
}

function getTargetTableNode(module, partName) {
  const currentSelectionParts = module.quill.getModule('table').getTable();
  return partName === 'table' ? currentSelectionParts[0].domNode : currentSelectionParts[2].domNode;
}

function getLinkRange(module, range) {
  const Quill = getQuill();
  const LinkBlot = Quill.import('formats/link');
  let link;
  let linkOffset;

  [link, linkOffset] = module.quill.scroll.descendant(
    LinkBlot,
    range.index,
  );

  if (!link && range.length === 0) {
    // NOTE:
    // See T1157840
    // When a mouse pointer is placed on the link's right border, the quill.scroll.descendant method does not return information about the link.
    // In this case, we receive a necessary information from the previous index.
    [link, linkOffset] = module.quill.scroll.descendant(
      LinkBlot,
      range.index - 1,
    );
    if (link) {
      linkOffset += 1;
    }
  }

  const result = !link ? null : {
    index: range.index - linkOffset,
    length: link.length(),
  };

  return result;
}

function getColorFromFormat(value) {
  return Array.isArray(value) ? value[0] : value;
}

function prepareLinkHandler(module) {
  return () => {
    module.quill.focus();

    let selection = module.quill.getSelection();
    const formats = selection ? module.quill.getFormat() : {};
    const isCursorAtLink = formats.link !== undefined && selection?.length === 0;
    let href = formats.link || '';

    if (isCursorAtLink) {
      const linkRange = getLinkRange(module, selection);
      if (linkRange) {
        selection = linkRange;
      } else {
        href = '';
      }
    }

    const selectionHasEmbedContent = hasEmbedContent(module, selection);
    const formData = {
      href,
      text: selection && !selectionHasEmbedContent ? module.quill.getText(selection) : '',
      target: Object.prototype.hasOwnProperty.call(formats, 'target') ? !!formats.target : true,
    };

    module.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_LINK_CAPTION));

    const promise = module.editorInstance.showFormDialog({
      formData,
      items: getLinkFormItems(selectionHasEmbedContent),
    });

    promise.done((formData, event) => {
      if (selection && !selectionHasEmbedContent) {
        const text = formData.text || formData.href;
        const { index, length } = selection;

        formData.text = undefined;
        module.saveValueChangeEvent(event);

        length && module.quill.deleteText(index, length, SILENT_ACTION);
        module.quill.insertText(index, text, 'link', formData, USER_ACTION);
        module.quill.setSelection(index + text.length, 0, USER_ACTION);
      } else {
        formData.text = !selection && !formData.text ? formData.href : formData.text;
        applyFormat(module, ['link', formData, USER_ACTION], event);
      }
    });

    promise.fail(() => {
      module.quill.focus();
    });
  };
}

function prepareImageHandler(module, imageUploadOption) {
  const imageUploader = new ImageUploader(module, imageUploadOption);
  return () => {
    imageUploader.render();
  };
}

function getLinkFormItems(selectionHasEmbedContent) {
  return [
    { dataField: 'href', label: { text: localizationMessage.format(DIALOG_LINK_FIELD_URL) } },
    {
      dataField: 'text',
      label: { text: localizationMessage.format(DIALOG_LINK_FIELD_TEXT) },
      visible: !selectionHasEmbedContent,
    },
    {
      dataField: 'target',
      editorType: 'dxCheckBox',
      editorOptions: {
        text: localizationMessage.format(DIALOG_LINK_FIELD_TARGET),
      },
      cssClass: DIALOG_LINK_FIELD_TARGET_CLASS,
      label: { visible: false },
    },
  ];
}

function prepareColorClickHandler(module, name) {
  return () => {
    const formData = module.quill.getFormat();
    const caption = name === 'color' ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;

    module.editorInstance.formDialogOption('title', localizationMessage.format(caption));

    const promise = module.editorInstance.showFormDialog({
      formData,
      items: [{
        dataField: name,
        editorType: 'dxColorView',
        editorOptions: {
          focusStateEnabled: false,
        },
        label: { visible: false },
      }],
    });

    promise.done((formData, event) => {
      applyFormat(module, [name, formData[name], USER_ACTION], event);
    });
    promise.fail(() => {
      module.quill.focus();
    });
  };
}

function prepareShortcutHandler(module, name, shortcutValue) {
  return ({ event }) => {
    const formats = module.quill.getFormat();
    const value = formats[name] === shortcutValue ? false : shortcutValue;

    applyFormat(module, [name, value, USER_ACTION], event);

    getToolbarModule(module)?.updateFormatWidgets(true);
  };
}

function getToolbarModule(module) {
  return module._updateFormatWidget ? module : module.quill.getModule('toolbar');
}

function getDefaultClickHandler(module, name) {
  return ({ event }) => {
    const formats = module.quill.getFormat();
    const value = formats[name];
    const newValue = !(isBoolean(value) ? value : isDefined(value));

    applyFormat(module, [name, newValue, USER_ACTION], event);

    getToolbarModule(module)?._updateFormatWidget(name, newValue, formats);
  };
}

function insertTableFormItems() {
  return [
    {
      dataField: 'columns',
      editorType: 'dxNumberBox',
      editorOptions: {
        min: 1,
      },
      label: { text: localizationMessage.format(DIALOG_TABLE_FIELD_COLUMNS) },
    },
    {
      dataField: 'rows',
      editorType: 'dxNumberBox',
      editorOptions: {
        min: 1,
      },
      label: { text: localizationMessage.format(DIALOG_TABLE_FIELD_ROWS) },
    },
  ];
}

function prepareInsertTableHandler(module) {
  return () => {
    const formats = module.quill.getFormat();
    const isTableFocused = module._tableFormats.some(
      (format) => Object.prototype.hasOwnProperty.call(formats, format),
    );
    const formData = { rows: 1, columns: 1 };

    if (isTableFocused) {
      module.quill.focus();
      return;
    }

    module.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_TABLE_CAPTION));

    const promise = module.editorInstance.showFormDialog({
      formData,
      items: insertTableFormItems(),
    });

    promise
      .done((formData, event) => {
        module.quill.focus();

        const table = module.quill.getModule('table');
        if (table) {
          module.saveValueChangeEvent(event);

          const { columns, rows } = formData;
          table.insertTable(columns, rows);
        }
      })
      .always(() => {
        module.quill.focus();
      });
  };
}

function getTablePropertiesFormConfig(
  module,
  {
    $element: $table,
    formats,
    tableBlot,
  },
): {
    formOptions: unknown;
    applyHandler: (formInstance: Form) => void;
  } {
  let alignmentEditorInstance;
  let borderColorEditorInstance;
  let backgroundColorEditorInstance;

  const { editorInstance } = module;

  const rawTableWidth = parseFloat(formats.tableWidth);
  const tableWidth = isNaN(rawTableWidth) ? null : rawTableWidth;
  const alignment = formats.tableAlign || DEFAULT_TEXT_ALIGNMENT;

  const formData = {
    width: tableWidth,
    height: isDefined(formats.tableHeight) ? parseFloat(formats.tableHeight) : null,
    backgroundColor: formats.tableBackgroundColor || null,
    borderStyle: formats.tableBorderStyle || null,
    borderColor: formats.tableBorderColor || null,
    borderWidth: isDefined(formats.tableBorderWidth) ? parseFloat(formats.tableBorderWidth) : null,
    alignment,
  };

  const items = [
    {
      itemType: 'group',
      caption: localizationMessage.format('dxHtmlEditor-border'),
      colCountByScreen: {
        xs: 2,
      },
      colCount: 2,
      items: [
        {
          dataField: 'borderStyle',
          label: {
            text: localizationMessage.format('dxHtmlEditor-style'),
          },
          editorType: 'dxSelectBox',
          editorOptions: {
            items: getBorderStylesTranslated(),
            valueExpr: 'id',
            displayExpr: 'value',
            placeholder: 'Select style',
            _ignoreFieldTemplateDeprecation: true,
          },
        },
        {
          dataField: 'borderWidth',
          label: {
            text: localizationMessage.format('dxHtmlEditor-borderWidth'),
          },
          editorOptions: {
            placeholder: localizationMessage.format('dxHtmlEditor-pixels'),
          },
        },
        {
          itemType: 'simple',
          dataField: 'borderColor',
          label: {
            text: localizationMessage.format('dxHtmlEditor-borderColor'),
          },
          colSpan: 2,
          template: (e: SimpleItemTemplateData): dxElementWrapper => {
            const $content = $('<div>');
            editorInstance._createComponent($content, ColorBox, {
              editAlphaChannel: true,
              value: e.component.option('formData').borderColor,
              onInitialized: (event: InitializedColorBoxEvent): void => {
                borderColorEditorInstance = event.component;
              },
              _ignoreFieldTemplateDeprecation: true,
            });
            return $content;
          },
        },
      ],
    },
    {
      itemType: 'group',
      caption: localizationMessage.format('dxHtmlEditor-dimensions'),
      colCountByScreen: {
        xs: 2,
      },
      colCount: 2,
      items: [
        {
          dataField: 'width',
          label: {
            text: localizationMessage.format('dxHtmlEditor-width'),
          },
          editorOptions: {
            min: 0,
            placeholder: localizationMessage.format('dxHtmlEditor-pixels'),
          },
        },
        {
          dataField: 'height',
          label: {
            text: localizationMessage.format('dxHtmlEditor-height'),
          },
          editorOptions: {
            min: 0,
            placeholder: localizationMessage.format('dxHtmlEditor-pixels'),
          },
        },
      ],
    },
    {
      itemType: 'group',
      caption: localizationMessage.format('dxHtmlEditor-tableBackground'),
      items: [
        {
          itemType: 'simple',
          dataField: 'backgroundColor',
          label: {
            text: localizationMessage.format('dxHtmlEditor-borderColor'),
          },
          template: (e: SimpleItemTemplateData): dxElementWrapper => {
            const $content = $('<div>');
            editorInstance._createComponent($content, ColorBox, {
              editAlphaChannel: true,
              value: e.component.option('formData').backgroundColor,
              onInitialized: (event: InitializedColorBoxEvent): void => {
                backgroundColorEditorInstance = event.component;
              },
              _ignoreFieldTemplateDeprecation: true,
            });
            return $content;
          },
        },
      ],
    },
    {
      itemType: 'group',
      caption: localizationMessage.format('dxHtmlEditor-alignment'),
      items: [
        {
          itemType: 'simple',
          label: {
            text: localizationMessage.format('dxHtmlEditor-horizontal'),
          },
          template: (): dxElementWrapper => {
            const $content = $('<div>');
            editorInstance._createComponent($content, ButtonGroup, {
              items: [
                { value: 'left', icon: 'alignleft' },
                { value: 'center', icon: 'aligncenter' },
                { value: 'right', icon: 'alignright' },
                { value: 'justify', icon: 'alignjustify' },
              ],
              keyExpr: 'value',
              selectedItemKeys: [alignment === 'start' ? 'left' : alignment],
              onInitialized: (event: InitializedButtonGroupEvent): void => {
                alignmentEditorInstance = event.component;
              },
            });
            return $content;
          },
        },
      ],
    },
  ];

  const formOptions = {
    formData,
    items,
    colCount: 2,
    showColonAfterLabel: true,
    labelLocation: 'top',
    minColWidth: 400,
  };

  const applyHandler = (formInstance: Form): void => {
    const { formData: data } = formInstance.option();

    const newWidth = data.width === tableWidth ? null : data.width;
    const newHeight = data.height;

    applyTableDimensionChanges(
      module,
      {
        $table,
        newHeight,
        newWidth,
        tableBlot,
      },
    );

    module.editorInstance.format('tableBorderStyle', data.borderStyle);
    module.editorInstance.format('tableBorderWidth', `${data.borderWidth}px`);
    module.editorInstance.format('tableBorderColor', borderColorEditorInstance.option('value'));
    module.editorInstance.format('tableBackgroundColor', backgroundColorEditorInstance.option('value'));
    module.editorInstance.format('tableTextAlign', alignmentEditorInstance.option('selectedItemKeys')[0]);
  };

  return {
    formOptions,
    applyHandler,
  };
}

function getCellPropertiesFormConfig(
  module,
  {
    $element: $cell,
    formats,
    tableBlot,
    rowBlot,
  },
): {
    formOptions: unknown;
    applyHandler: (formInstance: Form) => void;
  } {
  let alignmentEditorInstance;
  let verticalAlignmentEditorInstance;
  let borderColorEditorInstance;
  let backgroundColorEditorInstance;

  const { editorInstance } = module;

  const cellWidth = isDefined(formats.cellWidth) ? parseFloat(formats.cellWidth) : null;
  const defaultAlignment = rowBlot.childFormatName === 'tableHeaderCell' ? DEFAULT_TH_TEXT_ALIGNMENT : DEFAULT_TEXT_ALIGNMENT;
  const alignment = formats.cellTextAlign || defaultAlignment;
  const verticalAlignment = formats.cellVerticalAlign || DEFAULT_VERTICAL_ALIGN;
  const rawVerticalPadding = formats.cellPaddingTop ?? formats.cellPadding?.split(' ')[0];
  const rawHorizontalPadding = formats.cellPaddingLeft ?? formats.cellPadding?.split(' ')[1];

  const formData = {
    width: cellWidth,
    height: isDefined(formats.cellHeight) ? parseFloat(formats.cellHeight) : null,
    backgroundColor: getColorFromFormat(formats.cellBackgroundColor) || null,
    borderStyle: formats.cellBorderStyle || null,
    borderColor: getColorFromFormat(formats.cellBorderColor) || null,
    borderWidth: isDefined(formats.cellBorderWidth) ? parseFloat(formats.cellBorderWidth) : null,
    alignment,
    verticalAlignment,
    verticalPadding: isDefined(rawVerticalPadding) ? parseFloat(rawVerticalPadding) : null,
    horizontalPadding: isDefined(rawHorizontalPadding) ? parseFloat(rawHorizontalPadding) : null,
  };

  const items = [
    {
      itemType: 'group',
      caption: localizationMessage.format('dxHtmlEditor-border'),
      colCountByScreen: {
        xs: 2,
      },
      colCount: 2,
      items: [
        {
          dataField: 'borderStyle',
          label: {
            text: localizationMessage.format('dxHtmlEditor-style'),
          },
          editorType: 'dxSelectBox',
          editorOptions: {
            items: getBorderStylesTranslated(),
            valueExpr: 'id',
            displayExpr: 'value',
            _ignoreFieldTemplateDeprecation: true,
          },
        },
        {
          dataField: 'borderWidth',
          label: {
            text: localizationMessage.format('dxHtmlEditor-borderWidth'),
          },
          editorOptions: {
            placeholder: localizationMessage.format('dxHtmlEditor-pixels'),
          },
        },
        {
          itemType: 'simple',
          dataField: 'borderColor',
          colSpan: 2,
          label: {
            text: localizationMessage.format('dxHtmlEditor-borderColor'),
          },
          template: (e: SimpleItemTemplateData): dxElementWrapper => {
            const $content = $('<div>');
            editorInstance._createComponent($content, ColorBox, {
              editAlphaChannel: true,
              value: e.component.option('formData').borderColor,
              onInitialized: (event: InitializedColorBoxEvent): void => {
                borderColorEditorInstance = event.component;
              },
              _ignoreFieldTemplateDeprecation: true,
            });
            return $content;
          },
        },
      ],
    },
    {
      itemType: 'group',
      caption: localizationMessage.format('dxHtmlEditor-dimensions'),
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        {
          dataField: 'width',
          label: { text: localizationMessage.format('dxHtmlEditor-width') },
          editorOptions: {
            min: 0,
            placeholder: localizationMessage.format('dxHtmlEditor-pixels'),
          },
        },
        {
          dataField: 'height',
          label: { text: localizationMessage.format('dxHtmlEditor-height') },
          editorOptions: {
            min: 0,
            placeholder: localizationMessage.format('dxHtmlEditor-pixels'),
          },
        },
        {
          dataField: 'verticalPadding',
          label: { text: localizationMessage.format('dxHtmlEditor-paddingVertical') },
          editorOptions: {
            placeholder: localizationMessage.format('dxHtmlEditor-pixels'),
          },
        },
        {
          label: { text: localizationMessage.format('dxHtmlEditor-paddingHorizontal') },
          dataField: 'horizontalPadding',
          editorOptions: {
            placeholder: localizationMessage.format('dxHtmlEditor-pixels'),
          },
        },
      ],
    },
    {
      itemType: 'group',
      caption: localizationMessage.format('dxHtmlEditor-tableBackground'),
      items: [
        {
          itemType: 'simple',
          dataField: 'backgroundColor',
          label: {
            text: localizationMessage.format('dxHtmlEditor-borderColor'),
          },
          template: (e: SimpleItemTemplateData): dxElementWrapper => {
            const $content = $('<div>');
            editorInstance._createComponent($content, ColorBox, {
              editAlphaChannel: true,
              value: e.component.option('formData').backgroundColor,
              onInitialized: (event: InitializedColorBoxEvent): void => {
                backgroundColorEditorInstance = event.component;
              },
              _ignoreFieldTemplateDeprecation: true,
            });
            return $content;
          },
        },
      ],
    },
    {
      itemType: 'group',
      caption: localizationMessage.format('dxHtmlEditor-alignment'),
      colCount: 2,
      items: [
        {
          itemType: 'simple',
          label: {
            text: localizationMessage.format('dxHtmlEditor-horizontal'),
          },
          template: (): dxElementWrapper => {
            const $content = $('<div>');
            editorInstance._createComponent($content, ButtonGroup, {
              items: [
                { value: 'left', icon: 'alignleft' },
                { value: 'center', icon: 'aligncenter' },
                { value: 'right', icon: 'alignright' },
                { value: 'justify', icon: 'alignjustify' },
              ],
              keyExpr: 'value',
              selectedItemKeys: [alignment === 'start' ? 'left' : alignment],
              onInitialized: (event: InitializedButtonGroupEvent): void => {
                alignmentEditorInstance = event.component;
              },
            });
            return $content;
          },
        },
        {
          itemType: 'simple',
          label: { text: localizationMessage.format('dxHtmlEditor-vertical') },
          template: (): dxElementWrapper => {
            const $content = $('<div>');
            editorInstance._createComponent($content, ButtonGroup, {
              items: [
                { value: 'top', icon: 'verticalaligntop' },
                { value: 'middle', icon: 'verticalaligncenter' },
                { value: 'bottom', icon: 'verticalalignbottom' },
              ],
              keyExpr: 'value',
              selectedItemKeys: [verticalAlignment],
              onInitialized: (event: InitializedButtonGroupEvent): void => {
                verticalAlignmentEditorInstance = event.component;
              },
            });
            return $content;
          },
        },
      ],
    },
  ];

  const formOptions = {
    formData,
    items,
    colCount: 2,
    showColonAfterLabel: true,
    labelLocation: 'top',
    minColWidth: 400,
  };

  const applyHandler = (formInstance: Form): void => {
    const { formData: data } = formInstance.option();

    const newWidth = data.width === cellWidth ? null : data.width;
    const newHeight = data.height;

    applyCellDimensionChanges(
      module,
      {
        $cell,
        newHeight,
        newWidth,
        tableBlot,
        rowBlot,
      },
    );

    module.editorInstance.format('cellBorderWidth', data.borderWidth && `${data.borderWidth}px`);
    module.editorInstance.format('cellBorderColor', borderColorEditorInstance.option('value'));
    module.editorInstance.format('cellBorderStyle', data.borderStyle);
    module.editorInstance.format('cellBackgroundColor', backgroundColorEditorInstance.option('value'));
    module.editorInstance.format('cellTextAlign', alignmentEditorInstance.option('selectedItemKeys')[0]);
    module.editorInstance.format('cellVerticalAlign', verticalAlignmentEditorInstance.option('selectedItemKeys')[0]);
    module.editorInstance.format('cellPaddingLeft', data.horizontalPadding && `${data.horizontalPadding}px`);
    module.editorInstance.format('cellPaddingRight', data.horizontalPadding && `${data.horizontalPadding}px`);
    module.editorInstance.format('cellPaddingTop', data.verticalPadding && `${data.verticalPadding}px`);
    module.editorInstance.format('cellPaddingBottom', data.verticalPadding && `${data.verticalPadding}px`);
  };

  return {
    formOptions,
    applyHandler,
  };
}

function getFormConfigConstructor(type) {
  return type === 'cell' ? getCellPropertiesFormConfig : getTablePropertiesFormConfig;
}

function applyTableDimensionChanges(module, {
  $table, newHeight, newWidth, tableBlot,
}) {
  if (isDefined(newWidth)) {
    const autoWidthColumns = getAutoSizedElements($table);

    if (autoWidthColumns.length > 0) {
      module.editorInstance.format('tableWidth', `${newWidth}px`);
    } else {
      const $columns = getColumnElements($table);
      const oldTableWidth = getOuterWidth($table);
      // @ts-expect-error
      unfixTableWidth($table, { tableBlot });

      each($columns, (i, element) => {
        const $element = $(element);
        const newElementWidth = newWidth / oldTableWidth * getOuterWidth($element);

        const $lineElements = getLineElements($table, $element.index(), 'horizontal');

        setLineElementsFormat(module, {
          elements: $lineElements,
          property: 'width',
          value: newElementWidth,
        });
      });
    }
  }

  const autoHeightRows = getAutoSizedElements($table, 'vertical');

  if (autoHeightRows?.length > 0) {
    tableBlot.format('tableHeight', `${newHeight}px`);
  } else {
    const $rows = getRowElements($table);
    const oldTableHeight = getOuterHeight($table);

    each($rows, (i, element) => {
      const $element = $(element);
      const newElementHeight = newHeight / oldTableHeight * getOuterHeight($element);
      const $lineElements = getLineElements($table, i, 'vertical');
      setLineElementsFormat(module, {
        elements: $lineElements,
        property: 'height',
        value: newElementHeight,
      });
    });
  }
}

function applyCellDimensionChanges(module, {
  $cell, newHeight, newWidth, tableBlot, rowBlot,
}) {
  const $table = $($cell.closest('table'));
  if (isDefined(newWidth)) {
    const index = $($cell).index();
    let $verticalCells = getLineElements($table, index);

    const widthDiff = newWidth - getOuterWidth($cell);
    const tableWidth = getOuterWidth($table);

    if (newWidth > tableWidth) {
      // @ts-expect-error
      unfixTableWidth($table, { tableBlot });
    }

    setLineElementsFormat(module, {
      elements: $verticalCells,
      property: 'width',
      value: newWidth,
    });

    const $nextColumnCell = $cell.next();
    const shouldUpdateNearestColumnWidth = getAutoSizedElements($table).length === 0;

    if (shouldUpdateNearestColumnWidth) {
      // @ts-expect-error
      unfixTableWidth($table, { tableBlot });
      if ($nextColumnCell.length === 1) {
        $verticalCells = getLineElements($table, index + 1);
        const nextColumnWidth = getOuterWidth($verticalCells.eq(0)) - widthDiff;
        setLineElementsFormat(module, {
          elements: $verticalCells,
          property: 'width',
          value: Math.max(nextColumnWidth, 0),
        });
      } else {
        const $prevColumnCell = $cell.prev();
        if ($prevColumnCell.length === 1) {
          $verticalCells = getLineElements($table, index - 1);
          const prevColumnWidth = getOuterWidth($verticalCells.eq(0)) - widthDiff;
          setLineElementsFormat(module, {
            elements: $verticalCells,
            property: 'width',
            value: Math.max(prevColumnWidth, 0),
          });
        }
      }
    }
  }

  rowBlot.children.forEach((rowCell) => {
    rowCell.format('cellHeight', `${newHeight}px`);
  });

  const autoHeightRows = getAutoSizedElements($table, 'vertical');

  if (autoHeightRows.length === 0) {
    $table.css('height', 'auto');
  }
}

export {
  applyFormat,
  getDefaultClickHandler,
  getFormatHandlers,
  ICON_MAP,
};
