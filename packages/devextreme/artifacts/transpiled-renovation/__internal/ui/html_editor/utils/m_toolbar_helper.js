"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ICON_MAP = void 0;
exports.applyFormat = applyFormat;
exports.getDefaultClickHandler = getDefaultClickHandler;
exports.getFormatHandlers = getFormatHandlers;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _inflector = require("../../../../core/utils/inflector");
var _iterator = require("../../../../core/utils/iterator");
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _button_group = _interopRequireDefault(require("../../../../ui/button_group"));
var _color_box = _interopRequireDefault(require("../../../../ui/color_box"));
var _form = _interopRequireDefault(require("../../../../ui/form"));
var _scroll_view = _interopRequireDefault(require("../../../../ui/scroll_view"));
var _m_quill_importer = require("../m_quill_importer");
var _m_image_uploader_helper = require("./m_image_uploader_helper");
var _m_table_helper = require("./m_table_helper");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MIN_HEIGHT = 400;
const BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];
const BORDER_STYLES_TRANSLATED = BORDER_STYLES.map(style => ({
  id: style,
  value: _message.default.format(`dxHtmlEditor-borderStyle${(0, _inflector.camelize)(style, true)}`)
}));
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
const ICON_MAP = exports.ICON_MAP = {
  insertHeaderRow: 'header',
  clear: 'clearformat'
};
function getFormatHandlers(module) {
  return {
    clear: _ref => {
      let {
        event
      } = _ref;
      const range = module.quill.getSelection();
      if (range) {
        var _getToolbarModule;
        module.saveValueChangeEvent(event);
        module.quill.removeFormat(range);
        (_getToolbarModule = getToolbarModule(module)) === null || _getToolbarModule === void 0 || _getToolbarModule.updateFormatWidgets();
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
    undo: _ref2 => {
      let {
        event
      } = _ref2;
      module.saveValueChangeEvent(event);
      module.quill.history.undo();
    },
    redo: _ref3 => {
      let {
        event
      } = _ref3;
      module.saveValueChangeEvent(event);
      module.quill.history.redo();
    },
    increaseIndent: _ref4 => {
      let {
        event
      } = _ref4;
      applyFormat(module, ['indent', '+1', USER_ACTION], event);
    },
    decreaseIndent: _ref5 => {
      let {
        event
      } = _ref5;
      applyFormat(module, ['indent', '-1', USER_ACTION], event);
    },
    superscript: prepareShortcutHandler(module, 'script', 'super'),
    subscript: prepareShortcutHandler(module, 'script', 'sub'),
    insertTable: prepareInsertTableHandler(module),
    insertHeaderRow: (0, _m_table_helper.getTableOperationHandler)(module.quill, 'insertHeaderRow'),
    insertRowAbove: (0, _m_table_helper.getTableOperationHandler)(module.quill, 'insertRowAbove'),
    insertRowBelow: (0, _m_table_helper.getTableOperationHandler)(module.quill, 'insertRowBelow'),
    insertColumnLeft: (0, _m_table_helper.getTableOperationHandler)(module.quill, 'insertColumnLeft'),
    insertColumnRight: (0, _m_table_helper.getTableOperationHandler)(module.quill, 'insertColumnRight'),
    deleteColumn: (0, _m_table_helper.getTableOperationHandler)(module.quill, 'deleteColumn'),
    deleteRow: (0, _m_table_helper.getTableOperationHandler)(module.quill, 'deleteRow'),
    deleteTable: (0, _m_table_helper.getTableOperationHandler)(module.quill, 'deleteTable'),
    cellProperties: prepareShowFormProperties(module, 'cell'),
    tableProperties: prepareShowFormProperties(module, 'table')
  };
}
function resetFormDialogOptions(editorInstance, _ref6) {
  let {
    contentTemplate,
    title,
    minHeight,
    minWidth,
    maxWidth
  } = _ref6;
  editorInstance.formDialogOption({
    contentTemplate,
    title,
    minHeight: minHeight ?? 0,
    minWidth: minWidth ?? 0,
    maxWidth: maxWidth ?? 'none'
  });
}
function prepareShowFormProperties(module, type) {
  return $element => {
    var _$element;
    if (!((_$element = $element) !== null && _$element !== void 0 && _$element.length)) {
      $element = (0, _renderer.default)(getTargetTableNode(module, type));
    }
    const [tableBlot, rowBlot] = module.quill.getModule('table').getTable() ?? [];
    const formats = module.quill.getFormat(module.editorInstance.getSelection(true));
    const tablePropertiesFormConfig = getFormConfigConstructor(type)(module, {
      $element,
      formats,
      tableBlot,
      rowBlot
    });
    const {
      contentTemplate,
      title,
      minHeight,
      minWidth,
      maxWidth
    } = module.editorInstance._formDialog._popup.option();
    const savedOptions = {
      contentTemplate,
      title,
      minHeight,
      minWidth,
      maxWidth
    };
    let formInstance;
    module.editorInstance.formDialogOption({
      contentTemplate: container => {
        const $content = (0, _renderer.default)('<div>').appendTo(container);
        const $form = (0, _renderer.default)('<div>').appendTo($content);
        module.editorInstance._createComponent($form, _form.default, tablePropertiesFormConfig.formOptions);
        module.editorInstance._createComponent($content, _scroll_view.default, {});
        // @ts-expect-error
        formInstance = $form.dxForm('instance');
        return $content;
      },
      title: _message.default.format(`dxHtmlEditor-${type}Properties`),
      minHeight: MIN_HEIGHT,
      minWidth: Math.min(800, (0, _size.getWidth)((0, _window.getWindow)()) * 0.9 - 1),
      maxWidth: (0, _size.getWidth)((0, _window.getWindow)()) * 0.9
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
  const Quill = (0, _m_quill_importer.getQuill)();
  const LinkBlot = Quill.import('formats/link');
  let link;
  let linkOffset;
  [link, linkOffset] = module.quill.scroll.descendant(LinkBlot, range.index);
  if (!link && range.length === 0) {
    // NOTE:
    // See T1157840
    // When a mouse pointer is placed on the link's right border, the quill.scroll.descendant method does not return information about the link.
    // In this case, we receive a necessary information from the previous index.
    [link, linkOffset] = module.quill.scroll.descendant(LinkBlot, range.index - 1);
    if (link) {
      linkOffset += 1;
    }
  }
  const result = !link ? null : {
    index: range.index - linkOffset,
    length: link.length()
  };
  return result;
}
function getColorFromFormat(value) {
  return Array.isArray(value) ? value[0] : value;
}
function prepareLinkHandler(module) {
  return () => {
    var _selection;
    module.quill.focus();
    let selection = module.quill.getSelection();
    const formats = selection ? module.quill.getFormat() : {};
    const isCursorAtLink = formats.link !== undefined && ((_selection = selection) === null || _selection === void 0 ? void 0 : _selection.length) === 0;
    let href = formats.link || '';
    if (isCursorAtLink) {
      const linkRange = getLinkRange(module, selection);
      if (linkRange) {
        selection = linkRange;
      } else {
        href = '';
      }
    }
    const selectionHasEmbedContent = (0, _m_table_helper.hasEmbedContent)(module, selection);
    const formData = {
      href,
      text: selection && !selectionHasEmbedContent ? module.quill.getText(selection) : '',
      target: Object.prototype.hasOwnProperty.call(formats, 'target') ? !!formats.target : true
    };
    module.editorInstance.formDialogOption('title', _message.default.format(DIALOG_LINK_CAPTION));
    const promise = module.editorInstance.showFormDialog({
      formData,
      items: getLinkFormItems(selectionHasEmbedContent)
    });
    promise.done((formData, event) => {
      if (selection && !selectionHasEmbedContent) {
        const text = formData.text || formData.href;
        const {
          index,
          length
        } = selection;
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
  const imageUploader = new _m_image_uploader_helper.ImageUploader(module, imageUploadOption);
  return () => {
    imageUploader.render();
  };
}
function getLinkFormItems(selectionHasEmbedContent) {
  return [{
    dataField: 'href',
    label: {
      text: _message.default.format(DIALOG_LINK_FIELD_URL)
    }
  }, {
    dataField: 'text',
    label: {
      text: _message.default.format(DIALOG_LINK_FIELD_TEXT)
    },
    visible: !selectionHasEmbedContent
  }, {
    dataField: 'target',
    editorType: 'dxCheckBox',
    editorOptions: {
      text: _message.default.format(DIALOG_LINK_FIELD_TARGET)
    },
    cssClass: DIALOG_LINK_FIELD_TARGET_CLASS,
    label: {
      visible: false
    }
  }];
}
function prepareColorClickHandler(module, name) {
  return () => {
    const formData = module.quill.getFormat();
    const caption = name === 'color' ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;
    module.editorInstance.formDialogOption('title', _message.default.format(caption));
    const promise = module.editorInstance.showFormDialog({
      formData,
      items: [{
        dataField: name,
        editorType: 'dxColorView',
        editorOptions: {
          focusStateEnabled: false
        },
        label: {
          visible: false
        }
      }]
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
  return _ref7 => {
    var _getToolbarModule2;
    let {
      event
    } = _ref7;
    const formats = module.quill.getFormat();
    const value = formats[name] === shortcutValue ? false : shortcutValue;
    applyFormat(module, [name, value, USER_ACTION], event);
    (_getToolbarModule2 = getToolbarModule(module)) === null || _getToolbarModule2 === void 0 || _getToolbarModule2.updateFormatWidgets(true);
  };
}
function getToolbarModule(module) {
  return module._updateFormatWidget ? module : module.quill.getModule('toolbar');
}
function getDefaultClickHandler(module, name) {
  return _ref8 => {
    var _getToolbarModule3;
    let {
      event
    } = _ref8;
    const formats = module.quill.getFormat();
    const value = formats[name];
    const newValue = !((0, _type.isBoolean)(value) ? value : (0, _type.isDefined)(value));
    applyFormat(module, [name, newValue, USER_ACTION], event);
    (_getToolbarModule3 = getToolbarModule(module)) === null || _getToolbarModule3 === void 0 || _getToolbarModule3._updateFormatWidget(name, newValue, formats);
  };
}
function insertTableFormItems() {
  return [{
    dataField: 'columns',
    editorType: 'dxNumberBox',
    editorOptions: {
      min: 1
    },
    label: {
      text: _message.default.format(DIALOG_TABLE_FIELD_COLUMNS)
    }
  }, {
    dataField: 'rows',
    editorType: 'dxNumberBox',
    editorOptions: {
      min: 1
    },
    label: {
      text: _message.default.format(DIALOG_TABLE_FIELD_ROWS)
    }
  }];
}
function prepareInsertTableHandler(module) {
  return () => {
    const formats = module.quill.getFormat();
    const isTableFocused = module._tableFormats.some(format => Object.prototype.hasOwnProperty.call(formats, format));
    const formData = {
      rows: 1,
      columns: 1
    };
    if (isTableFocused) {
      module.quill.focus();
      return;
    }
    module.editorInstance.formDialogOption('title', _message.default.format(DIALOG_TABLE_CAPTION));
    const promise = module.editorInstance.showFormDialog({
      formData,
      items: insertTableFormItems()
    });
    promise.done((formData, event) => {
      module.quill.focus();
      const table = module.quill.getModule('table');
      if (table) {
        module.saveValueChangeEvent(event);
        const {
          columns,
          rows
        } = formData;
        table.insertTable(columns, rows);
      }
    }).always(() => {
      module.quill.focus();
    });
  };
}
function getTablePropertiesFormConfig(module, _ref9) {
  let {
    $element,
    formats,
    tableBlot
  } = _ref9;
  const window = (0, _window.getWindow)();
  let alignmentEditorInstance;
  let borderColorEditorInstance;
  let backgroundColorEditorInstance;
  const $table = $element;
  const {
    editorInstance
  } = module;
  // eslint-disable-next-line radix
  const startTableWidth = parseInt(formats.tableWidth) || (0, _size.getOuterWidth)($table);
  const tableStyles = window.getComputedStyle($table.get(0));
  const startTextAlign = tableStyles.textAlign === 'start' ? 'left' : tableStyles.textAlign;
  const formOptions = {
    colCount: 2,
    formData: {
      width: startTableWidth,
      // eslint-disable-next-line radix
      height: (0, _type.isDefined)(formats.tableHeight) ? parseInt(formats.tableHeight) : (0, _size.getOuterHeight)($table),
      backgroundColor: formats.tableBackgroundColor || tableStyles.backgroundColor,
      borderStyle: formats.tableBorderStyle || tableStyles.borderTopStyle,
      borderColor: formats.tableBorderColor || tableStyles.borderTopColor,
      // eslint-disable-next-line radix
      borderWidth: parseInt((0, _type.isDefined)(formats.tableBorderWidth) ? formats.tableBorderWidth : tableStyles.borderTopWidth),
      alignment: formats.tableAlign || startTextAlign
    },
    items: [{
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-border'),
      colCountByScreen: {
        xs: 2
      },
      colCount: 2,
      items: [{
        dataField: 'borderStyle',
        label: {
          text: _message.default.format('dxHtmlEditor-style')
        },
        editorType: 'dxSelectBox',
        editorOptions: {
          items: BORDER_STYLES_TRANSLATED,
          valueExpr: 'id',
          displayExpr: 'value',
          placeholder: 'Select style'
        }
      }, {
        dataField: 'borderWidth',
        label: {
          text: _message.default.format('dxHtmlEditor-borderWidth')
        },
        editorOptions: {
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        itemType: 'simple',
        dataField: 'borderColor',
        label: {
          text: _message.default.format('dxHtmlEditor-borderColor')
        },
        colSpan: 2,
        template: e => {
          const $content = (0, _renderer.default)('<div>');
          editorInstance._createComponent($content, _color_box.default, {
            editAlphaChannel: true,
            value: e.component.option('formData').borderColor,
            onInitialized: e => {
              borderColorEditorInstance = e.component;
            }
          });
          return $content;
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-dimensions'),
      colCountByScreen: {
        xs: 2
      },
      colCount: 2,
      items: [{
        dataField: 'width',
        label: {
          text: _message.default.format('dxHtmlEditor-width')
        },
        editorOptions: {
          min: 0,
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        dataField: 'height',
        label: {
          text: _message.default.format('dxHtmlEditor-height')
        },
        editorOptions: {
          min: 0,
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-tableBackground'),
      items: [{
        itemType: 'simple',
        dataField: 'backgroundColor',
        label: {
          text: _message.default.format('dxHtmlEditor-borderColor')
        },
        template: e => {
          const $content = (0, _renderer.default)('<div>');
          editorInstance._createComponent($content, _color_box.default, {
            editAlphaChannel: true,
            value: e.component.option('formData').backgroundColor,
            onInitialized: e => {
              backgroundColorEditorInstance = e.component;
            }
          });
          return $content;
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-alignment'),
      items: [{
        itemType: 'simple',
        label: {
          text: _message.default.format('dxHtmlEditor-horizontal')
        },
        template: () => {
          const $content = (0, _renderer.default)('<div>');
          editorInstance._createComponent($content, _button_group.default, {
            items: [{
              value: 'left',
              icon: 'alignleft'
            }, {
              value: 'center',
              icon: 'aligncenter'
            }, {
              value: 'right',
              icon: 'alignright'
            }, {
              value: 'justify',
              icon: 'alignjustify'
            }],
            keyExpr: 'value',
            selectedItemKeys: [startTextAlign],
            onInitialized: e => {
              alignmentEditorInstance = e.component;
            }
          });
          return $content;
        }
      }]
    }],
    showColonAfterLabel: true,
    labelLocation: 'top',
    minColWidth: 400
  };
  const applyHandler = formInstance => {
    const formData = formInstance.option('formData');
    const newWidth = formData.width === startTableWidth ? undefined : formData.width;
    const newHeight = formData.height;
    applyTableDimensionChanges(module, {
      $table,
      newHeight,
      newWidth,
      tableBlot
    });
    module.editorInstance.format('tableBorderStyle', formData.borderStyle);
    module.editorInstance.format('tableBorderWidth', `${formData.borderWidth}px`);
    module.editorInstance.format('tableBorderColor', borderColorEditorInstance.option('value'));
    module.editorInstance.format('tableBackgroundColor', backgroundColorEditorInstance.option('value'));
    module.editorInstance.format('tableTextAlign', alignmentEditorInstance.option('selectedItemKeys')[0]);
  };
  return {
    formOptions,
    applyHandler
  };
}
function getCellPropertiesFormConfig(module, _ref10) {
  let {
    $element,
    formats,
    tableBlot,
    rowBlot
  } = _ref10;
  const window = (0, _window.getWindow)();
  let alignmentEditorInstance;
  let verticalAlignmentEditorInstance;
  let borderColorEditorInstance;
  let backgroundColorEditorInstance;
  const $cell = $element;
  // eslint-disable-next-line radix
  const startCellWidth = (0, _type.isDefined)(formats.cellWidth) ? parseInt(formats.cellWidth) : (0, _size.getOuterWidth)($cell);
  const {
    editorInstance
  } = module;
  const cellStyles = window.getComputedStyle($cell.get(0));
  const startTextAlign = cellStyles.textAlign === 'start' ? 'left' : cellStyles.textAlign;
  const formOptions = {
    colCount: 2,
    formData: {
      width: startCellWidth,
      // eslint-disable-next-line radix
      height: (0, _type.isDefined)(formats.cellHeight) ? parseInt(formats.cellHeight) : (0, _size.getOuterHeight)($cell),
      backgroundColor: getColorFromFormat(formats.cellBackgroundColor) || cellStyles.backgroundColor,
      borderStyle: formats.cellBorderStyle || cellStyles.borderTopStyle,
      borderColor: getColorFromFormat(formats.cellBorderColor) || cellStyles.borderTopColor,
      // eslint-disable-next-line radix
      borderWidth: parseInt((0, _type.isDefined)(formats.cellBorderWidth) ? formats.cellBorderWidth : cellStyles.borderTopWidth),
      alignment: formats.cellTextAlign || startTextAlign,
      verticalAlignment: formats.cellVerticalAlign || cellStyles.verticalAlign,
      // eslint-disable-next-line radix
      verticalPadding: parseInt((0, _type.isDefined)(formats.cellPaddingTop) ? formats.cellPaddingTop : cellStyles.paddingTop),
      // eslint-disable-next-line radix
      horizontalPadding: parseInt((0, _type.isDefined)(formats.cellPaddingLeft) ? formats.cellPaddingLeft : cellStyles.paddingLeft)
    },
    items: [{
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-border'),
      colCountByScreen: {
        xs: 2
      },
      colCount: 2,
      items: [{
        dataField: 'borderStyle',
        label: {
          text: _message.default.format('dxHtmlEditor-style')
        },
        editorType: 'dxSelectBox',
        editorOptions: {
          items: BORDER_STYLES_TRANSLATED,
          valueExpr: 'id',
          displayExpr: 'value'
        }
      }, {
        dataField: 'borderWidth',
        label: {
          text: _message.default.format('dxHtmlEditor-borderWidth')
        },
        editorOptions: {
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        itemType: 'simple',
        dataField: 'borderColor',
        colSpan: 2,
        label: {
          text: _message.default.format('dxHtmlEditor-borderColor')
        },
        template: e => {
          const $content = (0, _renderer.default)('<div>');
          editorInstance._createComponent($content, _color_box.default, {
            editAlphaChannel: true,
            value: e.component.option('formData').borderColor,
            onInitialized: e => {
              borderColorEditorInstance = e.component;
            }
          });
          return $content;
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-dimensions'),
      colCount: 2,
      colCountByScreen: {
        xs: 2
      },
      items: [{
        dataField: 'width',
        label: {
          text: _message.default.format('dxHtmlEditor-width')
        },
        editorOptions: {
          min: 0,
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        dataField: 'height',
        label: {
          text: _message.default.format('dxHtmlEditor-height')
        },
        editorOptions: {
          min: 0,
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        dataField: 'verticalPadding',
        label: {
          text: _message.default.format('dxHtmlEditor-paddingVertical')
        },
        editorOptions: {
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        label: {
          text: _message.default.format('dxHtmlEditor-paddingHorizontal')
        },
        dataField: 'horizontalPadding',
        editorOptions: {
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-tableBackground'),
      items: [{
        itemType: 'simple',
        dataField: 'backgroundColor',
        label: {
          text: _message.default.format('dxHtmlEditor-borderColor')
        },
        template: e => {
          const $content = (0, _renderer.default)('<div>');
          editorInstance._createComponent($content, _color_box.default, {
            editAlphaChannel: true,
            value: e.component.option('formData').backgroundColor,
            onInitialized: e => {
              backgroundColorEditorInstance = e.component;
            }
          });
          return $content;
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-alignment'),
      colCount: 2,
      items: [{
        itemType: 'simple',
        label: {
          text: _message.default.format('dxHtmlEditor-horizontal')
        },
        template: () => {
          const $content = (0, _renderer.default)('<div>');
          editorInstance._createComponent($content, _button_group.default, {
            items: [{
              value: 'left',
              icon: 'alignleft'
            }, {
              value: 'center',
              icon: 'aligncenter'
            }, {
              value: 'right',
              icon: 'alignright'
            }, {
              value: 'justify',
              icon: 'alignjustify'
            }],
            keyExpr: 'value',
            selectedItemKeys: [startTextAlign],
            onInitialized: e => {
              alignmentEditorInstance = e.component;
            }
          });
          return $content;
        }
      }, {
        itemType: 'simple',
        label: {
          text: _message.default.format('dxHtmlEditor-vertical')
        },
        template: () => {
          const $content = (0, _renderer.default)('<div>');
          editorInstance._createComponent($content, _button_group.default, {
            items: [{
              value: 'top',
              icon: 'verticalaligntop'
            }, {
              value: 'middle',
              icon: 'verticalaligncenter'
            }, {
              value: 'bottom',
              icon: 'verticalalignbottom'
            }],
            keyExpr: 'value',
            selectedItemKeys: [cellStyles.verticalAlign],
            onInitialized: e => {
              verticalAlignmentEditorInstance = e.component;
            }
          });
          return $content;
        }
      }]
    }],
    showColonAfterLabel: true,
    labelLocation: 'top',
    minColWidth: 400
  };
  const applyHandler = formInstance => {
    const formData = formInstance.option('formData');
    // eslint-disable-next-line radix
    const newWidth = formData.width === parseInt(startCellWidth) ? undefined : formData.width;
    const newHeight = formData.height;
    applyCellDimensionChanges(module, {
      $cell,
      newHeight,
      newWidth,
      tableBlot,
      rowBlot
    });
    module.editorInstance.format('cellBorderWidth', `${formData.borderWidth}px`);
    module.editorInstance.format('cellBorderColor', borderColorEditorInstance.option('value'));
    module.editorInstance.format('cellBorderStyle', formData.borderStyle);
    module.editorInstance.format('cellBackgroundColor', backgroundColorEditorInstance.option('value'));
    module.editorInstance.format('cellTextAlign', alignmentEditorInstance.option('selectedItemKeys')[0]);
    module.editorInstance.format('cellVerticalAlign', verticalAlignmentEditorInstance.option('selectedItemKeys')[0]);
    module.editorInstance.format('cellPaddingLeft', `${formData.horizontalPadding}px`);
    module.editorInstance.format('cellPaddingRight', `${formData.horizontalPadding}px`);
    module.editorInstance.format('cellPaddingTop', `${formData.verticalPadding}px`);
    module.editorInstance.format('cellPaddingBottom', `${formData.verticalPadding}px`);
  };
  return {
    formOptions,
    applyHandler
  };
}
function getFormConfigConstructor(type) {
  return type === 'cell' ? getCellPropertiesFormConfig : getTablePropertiesFormConfig;
}
function applyTableDimensionChanges(module, _ref11) {
  let {
    $table,
    newHeight,
    newWidth,
    tableBlot
  } = _ref11;
  if ((0, _type.isDefined)(newWidth)) {
    const autoWidthColumns = (0, _m_table_helper.getAutoSizedElements)($table);
    if (autoWidthColumns.length > 0) {
      module.editorInstance.format('tableWidth', `${newWidth}px`);
    } else {
      const $columns = (0, _m_table_helper.getColumnElements)($table);
      const oldTableWidth = (0, _size.getOuterWidth)($table);
      // @ts-expect-error
      (0, _m_table_helper.unfixTableWidth)($table, {
        tableBlot
      });
      (0, _iterator.each)($columns, (i, element) => {
        const $element = (0, _renderer.default)(element);
        const newElementWidth = newWidth / oldTableWidth * (0, _size.getOuterWidth)($element);
        const $lineElements = (0, _m_table_helper.getLineElements)($table, $element.index(), 'horizontal');
        (0, _m_table_helper.setLineElementsFormat)(module, {
          elements: $lineElements,
          property: 'width',
          value: newElementWidth
        });
      });
    }
  }
  const autoHeightRows = (0, _m_table_helper.getAutoSizedElements)($table, 'vertical');
  if ((autoHeightRows === null || autoHeightRows === void 0 ? void 0 : autoHeightRows.length) > 0) {
    tableBlot.format('tableHeight', `${newHeight}px`);
  } else {
    const $rows = (0, _m_table_helper.getRowElements)($table);
    const oldTableHeight = (0, _size.getOuterHeight)($table);
    (0, _iterator.each)($rows, (i, element) => {
      const $element = (0, _renderer.default)(element);
      const newElementHeight = newHeight / oldTableHeight * (0, _size.getOuterHeight)($element);
      const $lineElements = (0, _m_table_helper.getLineElements)($table, i, 'vertical');
      (0, _m_table_helper.setLineElementsFormat)(module, {
        elements: $lineElements,
        property: 'height',
        value: newElementHeight
      });
    });
  }
}
function applyCellDimensionChanges(module, _ref12) {
  let {
    $cell,
    newHeight,
    newWidth,
    tableBlot,
    rowBlot
  } = _ref12;
  const $table = (0, _renderer.default)($cell.closest('table'));
  if ((0, _type.isDefined)(newWidth)) {
    const index = (0, _renderer.default)($cell).index();
    let $verticalCells = (0, _m_table_helper.getLineElements)($table, index);
    const widthDiff = newWidth - (0, _size.getOuterWidth)($cell);
    const tableWidth = (0, _size.getOuterWidth)($table);
    if (newWidth > tableWidth) {
      // @ts-expect-error
      (0, _m_table_helper.unfixTableWidth)($table, {
        tableBlot
      });
    }
    (0, _m_table_helper.setLineElementsFormat)(module, {
      elements: $verticalCells,
      property: 'width',
      value: newWidth
    });
    const $nextColumnCell = $cell.next();
    const shouldUpdateNearestColumnWidth = (0, _m_table_helper.getAutoSizedElements)($table).length === 0;
    if (shouldUpdateNearestColumnWidth) {
      // @ts-expect-error
      (0, _m_table_helper.unfixTableWidth)($table, {
        tableBlot
      });
      if ($nextColumnCell.length === 1) {
        $verticalCells = (0, _m_table_helper.getLineElements)($table, index + 1);
        const nextColumnWidth = (0, _size.getOuterWidth)($verticalCells.eq(0)) - widthDiff;
        (0, _m_table_helper.setLineElementsFormat)(module, {
          elements: $verticalCells,
          property: 'width',
          value: Math.max(nextColumnWidth, 0)
        });
      } else {
        const $prevColumnCell = $cell.prev();
        if ($prevColumnCell.length === 1) {
          $verticalCells = (0, _m_table_helper.getLineElements)($table, index - 1);
          const prevColumnWidth = (0, _size.getOuterWidth)($verticalCells.eq(0)) - widthDiff;
          (0, _m_table_helper.setLineElementsFormat)(module, {
            elements: $verticalCells,
            property: 'width',
            value: Math.max(prevColumnWidth, 0)
          });
        }
      }
    }
  }
  rowBlot.children.forEach(rowCell => {
    rowCell.format('cellHeight', `${newHeight}px`);
  });
  const autoHeightRows = (0, _m_table_helper.getAutoSizedElements)($table, 'vertical');
  if (autoHeightRows.length === 0) {
    $table.css('height', 'auto');
  }
}