import localizationMessage from '@js/common/core/localization/message';
import type { DxElement } from '@js/core/element';
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
import type {
  Item as FormItem,
  Properties as FormProperties,
  SimpleItem,
  SimpleItemTemplateData,
} from '@js/ui/form';
import Form from '@js/ui/form';
import type { dxHtmlEditorImageUpload } from '@js/ui/html_editor';
import type { Properties as PopupProperties } from '@js/ui/popup';
import ScrollView from '@js/ui/scroll_view';

import type HtmlEditor from '../html_editor';
import { getQuill } from '../m_quill_importer';
import type { BaseHtmlEditorModule } from '../modules/m_base';
import type {
  AITextTransformOptions,
  FormatHandler,
  FormatHandlerArgs,
  FormatHandlers,
} from '../types';
import type {
  BlotConstructor,
  FormatBlotInstance,
  QuillInstance,
  RangeStatic,
} from '../types/quill';
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

/** The toolbar module (modules/m_toolbar.ts) as the format handlers use it. */
interface ToolbarModuleInstance {
  _updateFormatWidget: (name: string, isApplied: boolean, formats: Record<string, unknown>) => void;
  updateFormatWidgets: (isResetRequired?: boolean) => void;
}

/** The toolbar or the table context menu module; the toolbar members are read when present. */
interface FormatHandlersModule extends BaseHtmlEditorModule, Partial<ToolbarModuleInstance> {
  _tableFormats: string[];
}

interface LinkFormData {
  href: string;
  text?: string;
  target: boolean;
}

interface TableFormData {
  rows: number | null;
  columns: number | null;
}

/** A Quill format value: an array when the range holds several values (see Findings). */
type FormatValue = string | string[];

interface TableFormats {
  tableWidth?: FormatValue;
  tableHeight?: FormatValue;
  tableAlign?: FormatValue;
  tableBackgroundColor?: FormatValue;
  tableBorderStyle?: FormatValue;
  tableBorderColor?: FormatValue;
  tableBorderWidth?: FormatValue;
  cellWidth?: FormatValue;
  cellHeight?: FormatValue;
  cellTextAlign?: FormatValue;
  cellVerticalAlign?: FormatValue;
  cellBackgroundColor?: FormatValue;
  cellBorderStyle?: FormatValue;
  cellBorderColor?: FormatValue;
  cellBorderWidth?: FormatValue;
  cellPadding?: FormatValue;
  cellPaddingTop?: FormatValue;
  cellPaddingLeft?: FormatValue;
}

/** The table row blot of devextreme-quill: `getTable()[1]`. */
interface TableRowBlot {
  childFormatName: string;
  children: { forEach: (callback: (cell: FormatBlotInstance) => void) => void };
}

interface TablePropertiesFormArgs {
  $element: dxElementWrapper;
  formats: TableFormats;
  tableBlot: FormatBlotInstance;
  rowBlot: TableRowBlot;
}

interface PropertiesFormConfig {
  formOptions: FormProperties;
  applyHandler: (formInstance: Form) => void;
}

type PropertiesFormConfigBuilder = (
  module: FormatHandlersModule,
  args: TablePropertiesFormArgs,
) => PropertiesFormConfig;

interface TableDimensionChanges {
  $table: dxElementWrapper;
  newHeight: number | null;
  newWidth: number | null;
  tableBlot: FormatBlotInstance;
}

interface CellDimensionChanges {
  $cell: dxElementWrapper;
  newHeight: number | null;
  newWidth: number | null;
  tableBlot: FormatBlotInstance;
  rowBlot: TableRowBlot;
}

type DialogOptions = Pick<PopupProperties, 'contentTemplate' | 'title' | 'minHeight' | 'minWidth' | 'maxWidth'>;

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

const DIALOG_TABLE_FIELD_ROWS = 'dxHtmlEditor-dialogInsertTableRowsField';
const DIALOG_TABLE_FIELD_COLUMNS = 'dxHtmlEditor-dialogInsertTableColumnsField';

const DEFAULT_TEXT_ALIGNMENT = 'left';
const DEFAULT_TH_TEXT_ALIGNMENT = 'center';
const DEFAULT_VERTICAL_ALIGN = 'middle';

const ICON_MAP = {
  insertHeaderRow: 'header',
  clear: 'clearformat',
};

function getBorderStylesTranslated(): { id: string; value: string }[] {
  return BORDER_STYLES.map((style) => ({
    id: style,
    value: localizationMessage.format(`dxHtmlEditor-borderStyle${camelize(style, true)}`),
  }));
}

function prepareAITextTrasformHandler(module: FormatHandlersModule): FormatHandlers['ai'] {
  return (options: AITextTransformOptions): void => {
    const {
      command,
      commandsMap,
      parentCommand,
      prompt,
    } = options;

    const { quill } = module;
    const selection = quill.getSelection();
    const hasSelection = !!selection && selection.length > 0;
    const text = hasSelection ? quill.getText(selection) : quill.getText();

    const aiDialogConfig: AIDialogShowPayload = {
      currentCommand: parentCommand ?? command,
      currentCommandOption: parentCommand ? command : undefined,
      text,
      commandsMap,
      prompt,
    };

    const promise = module.editorInstance.showAIDialog(aiDialogConfig);

    promise?.done(({
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

function resetFormDialogOptions(editorInstance: HtmlEditor, {
  contentTemplate, title, minHeight, minWidth, maxWidth,
}: DialogOptions): void {
  editorInstance.formDialogOption({
    contentTemplate,
    title,
    minHeight: minHeight ?? 0,
    minWidth: minWidth ?? 0,
    maxWidth: maxWidth ?? 'none',
  });
}

function applyFormat(
  module: BaseHtmlEditorModule,
  formatArgs: Parameters<QuillInstance['format']>,
  event: Event | undefined,
): void {
  module.saveValueChangeEvent(event);
  module.quill.format(...formatArgs);
}

function getTargetTableNode(module: FormatHandlersModule, partName: 'cell' | 'table'): HTMLElement {
  const currentSelectionParts = module.quill.getModule('table').getTable();
  // @ts-expect-error getTable returns null outside a table; the callers run inside one
  return partName === 'table' ? currentSelectionParts[0].domNode : currentSelectionParts[2].domNode;
}

function getLinkRange(module: FormatHandlersModule, range: RangeStatic): RangeStatic | null {
  const Quill = getQuill();
  const LinkBlot: BlotConstructor = Quill.import('formats/link');
  let [link, linkOffset] = module.quill.scroll.descendant(
    LinkBlot,
    range.index,
  );

  if (!link && range.length === 0) {
    // NOTE:
    // See T1157840
    // When a mouse pointer is placed on the link's right border, the quill.scroll.descendant
    // method does not return information about the link.
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

function getColorFromFormat(value: FormatValue | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getLinkFormItems(selectionHasEmbedContent: boolean): SimpleItem[] {
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

function prepareLinkHandler(module: FormatHandlersModule): FormatHandlers['link'] {
  return (): void => {
    module.quill.focus();

    let selection = module.quill.getSelection();
    const formats = selection ? module.quill.getFormat() : {};
    const isCursorAtLink = formats.link !== undefined && selection?.length === 0;
    let href = formats.link || '';

    if (isCursorAtLink) {
      // @ts-expect-error isCursorAtLink implies a selection; TS does not narrow a reassigned let
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

    const promise = module.editorInstance.showFormDialog<LinkFormData>({
      formData,
      items: getLinkFormItems(selectionHasEmbedContent),
    });

    promise?.done((data: LinkFormData, event: Event | undefined): void => {
      if (selection && !selectionHasEmbedContent) {
        const text = data.text || data.href;
        const { index, length } = selection;

        data.text = undefined;
        module.saveValueChangeEvent(event);

        if (length) {
          module.quill.deleteText(index, length, SILENT_ACTION);
        }
        module.quill.insertText(index, text, 'link', data, USER_ACTION);
        module.quill.setSelection(index + text.length, 0, USER_ACTION);
      } else {
        data.text = !selection && !data.text ? data.href : data.text;
        applyFormat(module, ['link', data, USER_ACTION], event);
      }
    });

    promise?.fail(() => {
      module.quill.focus();
    });
  };
}

function prepareImageHandler(
  module: FormatHandlersModule,
  imageUploadOption: dxHtmlEditorImageUpload | undefined,
): FormatHandlers['image'] {
  const imageUploader = new ImageUploader(module, imageUploadOption);
  return (): void => {
    imageUploader.render();
  };
}

function prepareColorClickHandler(
  module: FormatHandlersModule,
  name: 'color' | 'background',
): FormatHandlers['color'] {
  return (): void => {
    const formData = module.quill.getFormat();
    const caption = name === 'color' ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;

    module.editorInstance.formDialogOption('title', localizationMessage.format(caption));

    const promise = module.editorInstance.showFormDialog<Record<string, unknown>>({
      formData,
      items: [{
        dataField: name,
        // @ts-expect-error dxColorView is not in FormItemComponent (form.d.ts)
        editorType: 'dxColorView',
        editorOptions: {
          focusStateEnabled: false,
        },
        label: { visible: false },
      }],
    });

    promise?.done((data: Record<string, unknown>, event: Event | undefined): void => {
      applyFormat(module, [name, data[name], USER_ACTION], event);
    });
    promise?.fail(() => {
      module.quill.focus();
    });
  };
}

function getToolbarModule(module: FormatHandlersModule): ToolbarModuleInstance | undefined {
  return module._updateFormatWidget
    // @ts-expect-error a truthy check on one member does not narrow module to ToolbarModuleInstance
    ? module
    : module.quill.getModule<ToolbarModuleInstance>('toolbar');
}

function prepareShortcutHandler(
  module: FormatHandlersModule,
  name: string,
  shortcutValue: string,
): FormatHandler {
  return ({ event }: FormatHandlerArgs): void => {
    const formats = module.quill.getFormat();
    const value = formats[name] === shortcutValue ? false : shortcutValue;

    applyFormat(module, [name, value, USER_ACTION], event);

    getToolbarModule(module)?.updateFormatWidgets(true);
  };
}

function getDefaultClickHandler(module: FormatHandlersModule, name: string): FormatHandler {
  return ({ event }: FormatHandlerArgs): void => {
    const formats = module.quill.getFormat();
    const value = formats[name];
    const newValue = !(isBoolean(value) ? value : isDefined(value));

    applyFormat(module, [name, newValue, USER_ACTION], event);

    getToolbarModule(module)?._updateFormatWidget(name, newValue, formats);
  };
}

function insertTableFormItems(): SimpleItem[] {
  return [
    {
      dataField: 'rows',
      editorType: 'dxNumberBox',
      editorOptions: {
        min: 1,
      },
      label: { text: localizationMessage.format(DIALOG_TABLE_FIELD_ROWS) },
    },
    {
      dataField: 'columns',
      editorType: 'dxNumberBox',
      editorOptions: {
        min: 1,
      },
      label: { text: localizationMessage.format(DIALOG_TABLE_FIELD_COLUMNS) },
    },
  ];
}

function prepareInsertTableHandler(module: FormatHandlersModule): FormatHandlers['insertTable'] {
  return (): void => {
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

    const promise = module.editorInstance.showFormDialog<TableFormData>({
      formData,
      items: insertTableFormItems(),
    });

    promise
      ?.done((data: TableFormData, event: Event | undefined): void => {
        module.quill.focus();

        const table = module.quill.getModule('table');
        if (table) {
          module.saveValueChangeEvent(event);

          const { columns, rows } = data;
          // @ts-expect-error a cleared NumberBox gives null (see Findings)
          table.insertTable(rows, columns);
        }
      })
      .always(() => {
        module.quill.focus();
      });
  };
}

function applyTableDimensionChanges(module: FormatHandlersModule, {
  $table, newHeight, newWidth, tableBlot,
}: TableDimensionChanges): void {
  if (isDefined(newWidth)) {
    const autoWidthColumns = getAutoSizedElements($table);

    if (autoWidthColumns.length > 0) {
      module.editorInstance.format('tableWidth', `${newWidth}px`);
    } else {
      const $columns = getColumnElements($table);
      const oldTableWidth = getOuterWidth($table);
      unfixTableWidth($table, { tableBlot });

      each($columns, (i: number, element: Element) => {
        const $element = $(element);
        const newElementWidth = (newWidth / oldTableWidth) * getOuterWidth($element);

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

    each($rows, (i: number, element: Element) => {
      const $element = $(element);
      // @ts-expect-error a cleared height editor gives null (see Findings)
      const newElementHeight = (newHeight / oldTableHeight) * getOuterHeight($element);
      const $lineElements = getLineElements($table, i, 'vertical');
      setLineElementsFormat(module, {
        elements: $lineElements,
        property: 'height',
        value: newElementHeight,
      });
    });
  }
}

function applyCellDimensionChanges(module: FormatHandlersModule, {
  $cell, newHeight, newWidth, tableBlot, rowBlot,
}: CellDimensionChanges): void {
  const $table = $($cell.closest('table'));
  if (isDefined(newWidth)) {
    const index = $($cell).index();
    let $verticalCells = getLineElements($table, index);

    const widthDiff = newWidth - getOuterWidth($cell);
    const tableWidth = getOuterWidth($table);

    if (newWidth > tableWidth) {
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
      unfixTableWidth($table, { tableBlot });
      if ($nextColumnCell.length === 1) {
        $verticalCells = getLineElements($table, index + 1);
        const nextColumnWidth = getOuterWidth($verticalCells.eq(0)) - widthDiff;
        setLineElementsFormat(module, {
          elements: $verticalCells,
          property: 'width',
          value: Math.max(nextColumnWidth, 0),
        });
      } else if ($cell.prev().length === 1) {
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

  rowBlot.children.forEach((rowCell) => {
    rowCell.format('cellHeight', `${newHeight}px`);
  });

  const autoHeightRows = getAutoSizedElements($table, 'vertical');

  if (autoHeightRows.length === 0) {
    $table.css('height', 'auto');
  }
}

function getTablePropertiesFormConfig(
  module: FormatHandlersModule,
  {
    $element: $table,
    formats,
    tableBlot,
  }: TablePropertiesFormArgs,
): PropertiesFormConfig {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the form templates
  let alignmentEditorInstance: ButtonGroup;
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the form templates
  let borderColorEditorInstance: ColorBox;
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the form templates
  let backgroundColorEditorInstance: ColorBox;

  const { editorInstance } = module;

  const rawTableWidth = parseFloat(String(formats.tableWidth));
  const tableWidth = isNaN(rawTableWidth) ? null : rawTableWidth;
  const alignment = formats.tableAlign || DEFAULT_TEXT_ALIGNMENT;

  const formData = {
    width: tableWidth,
    height: isDefined(formats.tableHeight) ? parseFloat(String(formats.tableHeight)) : null,
    backgroundColor: formats.tableBackgroundColor || null,
    borderStyle: formats.tableBorderStyle || null,
    borderColor: formats.tableBorderColor || null,
    borderWidth: isDefined(formats.tableBorderWidth)
      ? parseFloat(String(formats.tableBorderWidth))
      : null,
    alignment,
  };

  const items: FormItem[] = [
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
                // @ts-expect-error component is optional in InitializedEventInfo; it is always set
                borderColorEditorInstance = event.component;
              },
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
                // @ts-expect-error component is optional in InitializedEventInfo; it is always set
                backgroundColorEditorInstance = event.component;
              },
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
                // @ts-expect-error component is optional in InitializedEventInfo; it is always set
                alignmentEditorInstance = event.component;
              },
            });
            return $content;
          },
        },
      ],
    },
  ];

  const formOptions: FormProperties = {
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
    // @ts-expect-error selectedItemKeys is optional in button_group.d.ts
    module.editorInstance.format('tableTextAlign', alignmentEditorInstance.option('selectedItemKeys')[0]);
  };

  return {
    formOptions,
    applyHandler,
  };
}

function getCellPropertiesFormConfig(
  module: FormatHandlersModule,
  {
    $element: $cell,
    formats,
    tableBlot,
    rowBlot,
  }: TablePropertiesFormArgs,
): PropertiesFormConfig {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the form templates
  let alignmentEditorInstance: ButtonGroup;
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the form templates
  let verticalAlignmentEditorInstance: ButtonGroup;
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the form templates
  let borderColorEditorInstance: ColorBox;
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the form templates
  let backgroundColorEditorInstance: ColorBox;

  const { editorInstance } = module;

  const cellWidth = isDefined(formats.cellWidth) ? parseFloat(String(formats.cellWidth)) : null;
  const defaultAlignment = rowBlot.childFormatName === 'tableHeaderCell' ? DEFAULT_TH_TEXT_ALIGNMENT : DEFAULT_TEXT_ALIGNMENT;
  const alignment = formats.cellTextAlign || defaultAlignment;
  const verticalAlignment = formats.cellVerticalAlign || DEFAULT_VERTICAL_ALIGN;
  // @ts-expect-error a multi-value cellPadding is an array without split (see Findings)
  const rawVerticalPadding: FormatValue | undefined = formats.cellPaddingTop ?? formats.cellPadding?.split(' ')[0];
  // @ts-expect-error see above
  const rawHorizontalPadding: FormatValue | undefined = formats.cellPaddingLeft ?? formats.cellPadding?.split(' ')[1];

  const formData = {
    width: cellWidth,
    height: isDefined(formats.cellHeight) ? parseFloat(String(formats.cellHeight)) : null,
    backgroundColor: getColorFromFormat(formats.cellBackgroundColor) || null,
    borderStyle: formats.cellBorderStyle || null,
    borderColor: getColorFromFormat(formats.cellBorderColor) || null,
    borderWidth: isDefined(formats.cellBorderWidth)
      ? parseFloat(String(formats.cellBorderWidth))
      : null,
    alignment,
    verticalAlignment,
    verticalPadding: isDefined(rawVerticalPadding)
      ? parseFloat(String(rawVerticalPadding))
      : null,
    horizontalPadding: isDefined(rawHorizontalPadding)
      ? parseFloat(String(rawHorizontalPadding))
      : null,
  };

  const items: FormItem[] = [
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
                // @ts-expect-error component is optional in InitializedEventInfo; it is always set
                borderColorEditorInstance = event.component;
              },
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
                // @ts-expect-error component is optional in InitializedEventInfo; it is always set
                backgroundColorEditorInstance = event.component;
              },
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
                // @ts-expect-error component is optional in InitializedEventInfo; it is always set
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
                // @ts-expect-error component is optional in InitializedEventInfo; it is always set
                verticalAlignmentEditorInstance = event.component;
              },
            });
            return $content;
          },
        },
      ],
    },
  ];

  const formOptions: FormProperties = {
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
    // @ts-expect-error selectedItemKeys is optional in button_group.d.ts
    module.editorInstance.format('cellTextAlign', alignmentEditorInstance.option('selectedItemKeys')[0]);
    // @ts-expect-error see above
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

function getFormConfigConstructor(type: 'cell' | 'table'): PropertiesFormConfigBuilder {
  return type === 'cell' ? getCellPropertiesFormConfig : getTablePropertiesFormConfig;
}

function prepareShowFormProperties(
  module: FormatHandlersModule,
  type: 'cell' | 'table',
): FormatHandlers['cellProperties'] {
  return ($element?: dxElementWrapper | FormatHandlerArgs): void => {
    // @ts-expect-error a toolbar click passes its event here, which has no length (see Findings)
    const $target: dxElementWrapper = $element?.length
      ? $element
      : $(getTargetTableNode(module, type));
    const [tableBlot, rowBlot] = module.quill.getModule('table').getTable() ?? [];

    const formats = module.quill.getFormat(module.editorInstance.getSelection(true));

    const tablePropertiesFormConfig = getFormConfigConstructor(type)(module, {
      // @ts-expect-error getFormat and getTable are typed too loosely (types/quill.ts)
      $element: $target, formats, tableBlot, rowBlot,
    });

    const {
      contentTemplate, title, minHeight, minWidth, maxWidth,
    } = module.editorInstance._formDialog._popup.option();
    const savedOptions = {
      contentTemplate, title, minHeight, minWidth, maxWidth,
    };

    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in contentTemplate
    let formInstance: Form;

    module.editorInstance.formDialogOption({
      contentTemplate: (container: DxElement): dxElementWrapper => {
        const $content = $('<div>').appendTo(container);
        const $form = $('<div>').appendTo($content);
        formInstance = module.editorInstance._createComponent<Form, FormProperties>(
          $form,
          Form,
          tablePropertiesFormConfig.formOptions,
        );
        module.editorInstance._createComponent($content, ScrollView, {});

        return $content;
      },
      title: localizationMessage.format(`dxHtmlEditor-${type}Properties`),
      minHeight: MIN_HEIGHT,
      minWidth: Math.min(800, getWidth(getWindow()) * 0.9 - 1),
      maxWidth: getWidth(getWindow()) * 0.9,
    });

    const promise = module.editorInstance.showFormDialog<Record<string, unknown>>();

    promise?.done((formData: Record<string, unknown>, event: Event | undefined): void => {
      module.saveValueChangeEvent(event);
      tablePropertiesFormConfig.applyHandler(formInstance);
      resetFormDialogOptions(module.editorInstance, savedOptions);
    });

    promise?.fail(() => {
      module.quill.focus();
      resetFormDialogOptions(module.editorInstance, savedOptions);
    });
  };
}

function getFormatHandlers(module: FormatHandlersModule): FormatHandlers {
  return {
    clear: ({ event }: FormatHandlerArgs): void => {
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
    undo: ({ event }: FormatHandlerArgs): void => {
      module.saveValueChangeEvent(event);
      module.quill.history.undo();
    },
    redo: ({ event }: FormatHandlerArgs): void => {
      module.saveValueChangeEvent(event);
      module.quill.history.redo();
    },
    increaseIndent: ({ event }: FormatHandlerArgs): void => {
      applyFormat(module, ['indent', '+1', USER_ACTION], event);
    },
    decreaseIndent: ({ event }: FormatHandlerArgs): void => {
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

export {
  applyFormat,
  getDefaultClickHandler,
  getFormatHandlers,
  ICON_MAP,
};
