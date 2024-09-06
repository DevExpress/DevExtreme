import './converters/m_delta';

import registerComponent from '@js/core/component_registrator';
import config from '@js/core/config';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import Callbacks from '@js/core/utils/callbacks';
import {
  deferRender,
  ensureDefined,
  // @ts-expect-error
  executeAsync,
  noop,
} from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isFunction } from '@js/core/utils/type';
import eventsEngine from '@js/events/core/events_engine';
import scrollEvents from '@js/events/gesture/emitter.gesture.scroll';
// @ts-expect-error
import { Event as dxEvent } from '@js/events/index';
import pointerEvents from '@js/events/pointer';
import { addNamespace } from '@js/events/utils/index';
import Editor from '@js/ui/editor/editor';
import Errors from '@js/ui/widget/ui.errors';
import { prepareScrollData } from '@ts/ui/text_box/m_utils.scroll';

import ConverterController from './m_converterController';
import QuillRegistrator from './m_quill_registrator';
import getWordMatcher from './matchers/m_wordLists';
import FormDialog from './ui/m_formDialog';

const HTML_EDITOR_CLASS = 'dx-htmleditor';
const QUILL_CONTAINER_CLASS = 'dx-quill-container';
const QUILL_CLIPBOARD_CLASS = 'ql-clipboard';
const HTML_EDITOR_SUBMIT_ELEMENT_CLASS = 'dx-htmleditor-submit-element';
const HTML_EDITOR_CONTENT_CLASS = 'dx-htmleditor-content';

const MARKDOWN_VALUE_TYPE = 'markdown';

const ANONYMOUS_TEMPLATE_NAME = 'htmlContent';

const isIos = devices.current().platform === 'ios';

let editorsCount = 0;
// @ts-expect-error
const HtmlEditor = Editor.inherit({

  _getDefaultOptions() {
    return extend(this.callBase(), {
      focusStateEnabled: true,
      valueType: 'html',
      placeholder: '',
      toolbar: null,
      variables: null,
      mediaResizing: null,
      tableResizing: null,
      mentions: null,
      customizeModules: null,
      tableContextMenu: null,
      allowSoftLineBreak: false,

      formDialogOptions: null,

      imageUpload: null,

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      stylingMode: config().editorStylingMode || 'outlined',
    });
  },

  _init() {
    this._mentionKeyInTemplateStorage = editorsCount++;
    this.callBase();
    this._cleanCallback = Callbacks();
    this._contentInitializedCallback = Callbacks();
  },

  _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },

  _initTemplates() {
    this._templateManager.addDefaultTemplates({
      [ANONYMOUS_TEMPLATE_NAME]: new EmptyTemplate(),
    });
    this.callBase();
  },

  _focusTarget() {
    return this._getContent();
  },

  _getContent() {
    return this.$element().find(`.${HTML_EDITOR_CONTENT_CLASS}`);
  },

  _focusInHandler({ relatedTarget }) {
    if (this._shouldSkipFocusEvent(relatedTarget)) {
      return;
    }

    this._toggleFocusClass(true, this.$element());

    this.callBase.apply(this, arguments);
  },

  _focusOutHandler({ relatedTarget }) {
    if (this._shouldSkipFocusEvent(relatedTarget)) {
      return;
    }

    this._toggleFocusClass(false, this.$element());

    this.callBase.apply(this, arguments);
  },

  _shouldSkipFocusEvent(relatedTarget) {
    return $(relatedTarget).hasClass(QUILL_CLIPBOARD_CLASS);
  },

  _initMarkup() {
    this._$htmlContainer = $('<div>').addClass(QUILL_CONTAINER_CLASS);

    this.$element()
      .attr('role', 'application')
      .addClass(HTML_EDITOR_CLASS)
      .wrapInner(this._$htmlContainer);

    this._renderStylingMode();

    const template = this._getTemplate(ANONYMOUS_TEMPLATE_NAME);
    const transclude = true;

    this._$templateResult = template && template.render({
      container: getPublicElement(this._$htmlContainer),
      noModel: true,
      transclude,
    });

    this._renderSubmitElement();
    this.callBase();
    this._updateContainerMarkup();
  },

  _renderValidationState() {
    const $content = this._getContent();

    if ($content.length === 1) {
      this.callBase();
    }
  },

  _renderSubmitElement() {
    this._$submitElement = $('<textarea>')
      .addClass(HTML_EDITOR_SUBMIT_ELEMENT_CLASS)
      .attr('hidden', true)
      .appendTo(this.$element());

    this._setSubmitValue(this.option('value'));
  },

  _setSubmitValue(value) {
    this._getSubmitElement().val(value);
  },

  _getSubmitElement() {
    return this._$submitElement;
  },

  _createNoScriptFrame() {
    return $('<iframe>')
      .css('display', 'none')
      // @ts-expect-error
      .attr({
        // eslint-disable-next-line spellcheck/spell-checker
        srcdoc: '', // NOTE: srcdoc is used to prevent an excess "Blocked script execution" error in Opera. See T1150911.
        id: 'xss-frame',
        sandbox: 'allow-same-origin',
      });
  },

  _removeXSSVulnerableHtml(value) {
    // NOTE: Script tags and inline handlers are removed to prevent XSS attacks.
    // "Blocked script execution in 'about:blank' because the document's frame is sandboxed and the 'allow-scripts' permission is not set."
    // error can be logged to the console if the html value is XSS vulnerable.

    const $frame = this
      ._createNoScriptFrame()
      .appendTo('body');

    const frame = $frame.get(0);
    const frameWindow = frame.contentWindow;
    const frameDocument = frameWindow.document;
    const frameDocumentBody = frameDocument.body;

    frameDocumentBody.innerHTML = value;

    const removeInlineHandlers = (element) => {
      if (element.attributes) {
        for (let i = 0; i < element.attributes.length; i++) {
          const { name } = element.attributes[i];
          if (name.startsWith('on')) {
            element.removeAttribute(name);
          }
        }
      }
      if (element.childNodes) {
        for (let i = 0; i < element.childNodes.length; i++) {
          removeInlineHandlers(element.childNodes[i]);
        }
      }
    };

    removeInlineHandlers(frameDocumentBody);

    // NOTE: Do not use jQuery to prevent an excess "Blocked script execution" error in Safari.
    frameDocumentBody
      .querySelectorAll('script')
      .forEach((scriptNode) => { scriptNode.remove(); });

    const sanitizedHtml = frameDocumentBody.innerHTML;

    $frame.remove();
    return sanitizedHtml;
  },

  _updateContainerMarkup() {
    let markup = this.option('value');

    if (this._isMarkdownValue()) {
      this._prepareMarkdownConverter();
      markup = this._markdownConverter.toHtml(markup);
    }

    if (markup) {
      const sanitizedMarkup = this._removeXSSVulnerableHtml(markup);
      this._$htmlContainer.html(sanitizedMarkup);
    }
  },

  _prepareMarkdownConverter() {
    const MarkdownConverter = ConverterController.getConverter('markdown');

    if (MarkdownConverter) {
      this._markdownConverter = new MarkdownConverter();
    } else {
      throw Errors.Error('E1051', 'markdown');
    }
  },

  _render() {
    this._prepareConverters();

    this.callBase();
    this._toggleReadOnlyState();
  },

  _prepareQuillRegistrator() {
    if (!this._quillRegistrator) {
      this._quillRegistrator = new QuillRegistrator();
    }
  },

  _getRegistrator() {
    this._prepareQuillRegistrator();
    return this._quillRegistrator;
  },

  _prepareConverters() {
    if (!this._deltaConverter) {
      const DeltaConverter = ConverterController.getConverter('delta');

      if (DeltaConverter) {
        this._deltaConverter = new DeltaConverter();
      }
    }

    if (this.option('valueType') === MARKDOWN_VALUE_TYPE && !this._markdownConverter) {
      this._prepareMarkdownConverter();
    }
  },

  _renderContentImpl() {
    this._contentRenderedDeferred = Deferred();

    const renderContentPromise = this._contentRenderedDeferred.promise();

    this.callBase();
    this._renderHtmlEditor();
    this._renderFormDialog();
    this._addKeyPressHandler();

    return renderContentPromise;
  },

  _pointerMoveHandler(e) {
    if (isIos) {
      e.stopPropagation();
    }
  },

  _attachFocusEvents() {
    deferRender(this.callBase.bind(this));
  },

  _addKeyPressHandler() {
    const keyDownEvent = addNamespace('keydown', `${this.NAME}TextChange`);

    eventsEngine.on(this._$htmlContainer, keyDownEvent, this._keyDownHandler.bind(this));
  },

  _keyDownHandler(e) {
    this._saveValueChangeEvent(e);
  },

  _renderHtmlEditor() {
    const customizeModules = this.option('customizeModules');
    const modulesConfig = this._getModulesConfig();

    if (isFunction(customizeModules)) {
      customizeModules(modulesConfig);
    }

    this._quillInstance = this._getRegistrator().createEditor(this._$htmlContainer[0], {
      placeholder: this.option('placeholder'),
      readOnly: this.option('readOnly') || this.option('disabled'),
      modules: modulesConfig,
      theme: 'basic',
    });

    this._renderValidationState();
    this._deltaConverter.setQuillInstance(this._quillInstance);
    this._textChangeHandlerWithContext = this._textChangeHandler.bind(this);
    this._quillInstance.on('text-change', this._textChangeHandlerWithContext);
    this._renderScrollHandler();
    if (this._hasTranscludedContent()) {
      this._updateContentTask = executeAsync(() => {
        this._applyTranscludedContent();
      });
    } else {
      this._finalizeContentRendering();
    }
  },

  _renderScrollHandler() {
    const $scrollContainer = this._getContent();

    const initScrollData = prepareScrollData($scrollContainer);

    eventsEngine.on($scrollContainer, addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);

    eventsEngine.on($scrollContainer, addNamespace(pointerEvents.move, this.NAME), this._pointerMoveHandler.bind(this));
  },

  _applyTranscludedContent() {
    const valueOption = this.option('value');
    if (!isDefined(valueOption)) {
      const html = this._deltaConverter.toHtml();
      const newDelta = this._quillInstance.clipboard.convert({ html });

      if (newDelta.ops.length) {
        this._quillInstance.setContents(newDelta);
        return;
      }
    }

    this._finalizeContentRendering();
  },

  _hasTranscludedContent() {
    return this._$templateResult && this._$templateResult.length;
  },

  _getModulesConfig() {
    const quill = this._getRegistrator().getQuill();
    const wordListMatcher = getWordMatcher(quill);
    const modulesConfig = extend({}, {
      table: true,
      toolbar: this._getModuleConfigByOption('toolbar'),
      variables: this._getModuleConfigByOption('variables'),
      // TODO: extract some IE11 tweaks for the Quill uploader module
      // dropImage: this._getBaseModuleConfig(),
      resizing: this._getModuleConfigByOption('mediaResizing'),
      tableResizing: this._getModuleConfigByOption('tableResizing'),
      tableContextMenu: this._getModuleConfigByOption('tableContextMenu'),
      imageUpload: this._getModuleConfigByOption('imageUpload'),
      imageCursor: this._getBaseModuleConfig(),
      mentions: this._getModuleConfigByOption('mentions'),
      uploader: {
        onDrop: (e) => this._saveValueChangeEvent(dxEvent(e)),
        imageBlot: 'extendedImage',
      },
      keyboard: {
        onKeydown: (e) => this._saveValueChangeEvent(dxEvent(e)),
      },
      clipboard: {
        onPaste: (e) => this._saveValueChangeEvent(dxEvent(e)),
        onCut: (e) => this._saveValueChangeEvent(dxEvent(e)),
        matchers: [
          ['p.MsoListParagraphCxSpFirst', wordListMatcher],
          ['p.MsoListParagraphCxSpMiddle', wordListMatcher],
          ['p.MsoListParagraphCxSpLast', wordListMatcher],
        ],
      },
      multiline: Boolean(this.option('allowSoftLineBreak')),
    }, this._getCustomModules());

    return modulesConfig;
  },

  _getModuleConfigByOption(userOptionName) {
    const optionValue = this.option(userOptionName);
    let config = {};

    if (!isDefined(optionValue)) {
      return undefined;
    }

    if (Array.isArray(optionValue)) {
      config[userOptionName] = optionValue;
    } else {
      config = optionValue;
    }

    return extend(this._getBaseModuleConfig(), config);
  },

  _getBaseModuleConfig() {
    return { editorInstance: this };
  },

  _getCustomModules() {
    const modules = {};
    const moduleNames = this._getRegistrator().getRegisteredModuleNames();

    moduleNames.forEach((modulePath) => {
      modules[modulePath] = this._getBaseModuleConfig();
    });

    return modules;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _textChangeHandler(newDelta, oldDelta, source) {
    const htmlMarkup = this._deltaConverter.toHtml();
    const convertedValue = this._isMarkdownValue() ? this._updateValueByType(MARKDOWN_VALUE_TYPE, htmlMarkup) : htmlMarkup;
    const currentValue = this.option('value');

    if (currentValue !== convertedValue && !this._isNullValueConverted(currentValue, convertedValue)) {
      this._isEditorUpdating = true;
      this.option('value', convertedValue);
    }

    this._finalizeContentRendering();
  },

  _isNullValueConverted(currentValue, convertedValue) {
    return currentValue === null && convertedValue === '';
  },

  _finalizeContentRendering() {
    if (this._contentRenderedDeferred) {
      this.clearHistory();
      this._contentInitializedCallback.fire();
      this._contentRenderedDeferred.resolve();
      this._contentRenderedDeferred = undefined;
    }
  },

  _updateValueByType(valueType, value) {
    const converter = this._markdownConverter;

    if (!isDefined(converter)) {
      return;
    }

    const currentValue = ensureDefined(value, this.option('value'));

    return valueType === MARKDOWN_VALUE_TYPE ? converter.toMarkdown(currentValue) : converter.toHtml(currentValue);
  },

  _isMarkdownValue() {
    return this.option('valueType') === MARKDOWN_VALUE_TYPE;
  },

  _resetEnabledState() {
    if (this._quillInstance) {
      const isEnabled = !(this.option('readOnly') || this.option('disabled'));

      this._quillInstance.enable(isEnabled);
    }
  },

  _renderFormDialog() {
    const userOptions = extend(true, {
      width: 'auto',
      height: 'auto',
      hideOnOutsideClick: true,
    }, this.option('formDialogOptions'));

    this._formDialog = new FormDialog(this, userOptions);
  },

  _getStylingModePrefix() {
    return 'dx-htmleditor-';
  },

  _getQuillContainer() {
    return this._$htmlContainer;
  },

  _prepareModuleOptions(args) {
    const optionData = args.fullName?.split('.');
    let { value } = args;
    const optionName = optionData.length >= 2 ? optionData[1] : args.name;

    if (optionData.length === 3) {
      value = { [optionData[2]]: value };
    }

    return [optionName, value];
  },

  _moduleOptionChanged(moduleName, args) {
    const moduleInstance = this.getModule(moduleName);
    const shouldPassOptionsToModule = Boolean(moduleInstance);

    if (shouldPassOptionsToModule) {
      moduleInstance.option(...this._prepareModuleOptions(args));
    } else {
      this._invalidate();
    }
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'value': {
        if (this._quillInstance) {
          if (this._isEditorUpdating) {
            this._isEditorUpdating = false;
          } else {
            const updatedValue = this._isMarkdownValue() ? this._updateValueByType('HTML', args.value) : args.value;

            this._suppressValueChangeAction();
            this._updateHtmlContent(updatedValue);
            this._resumeValueChangeAction();
          }
        } else {
          this._$htmlContainer.html(args.value);
        }

        // NOTE: value can be optimized by Quill
        const value = this.option('value');
        if (value !== args.previousValue) {
          this._setSubmitValue(value);
          this.callBase({ ...args, value });
        }
        break;
      }
      case 'placeholder':
      case 'variables':
      case 'toolbar':
      case 'mentions':
      case 'customizeModules':
      case 'allowSoftLineBreak':
        this._invalidate();
        break;
      case 'tableResizing':
        this._moduleOptionChanged('tableResizing', args);
        break;
      case 'valueType': {
        this._prepareConverters();
        const newValue = this._updateValueByType(args.value);

        if (args.value === 'html' && this._quillInstance) {
          this._updateHtmlContent(newValue);
        } else {
          this.option('value', newValue);
        }
        break;
      }
      case 'stylingMode':
        this._renderStylingMode();
        break;
      case 'readOnly':
      case 'disabled':
        this.callBase(args);
        this._resetEnabledState();
        break;
      case 'formDialogOptions':
        this._renderFormDialog();
        break;
      case 'tableContextMenu':
        this._moduleOptionChanged('tableContextMenu', args);
        break;
      case 'mediaResizing':
        this._moduleOptionChanged('resizing', args);
        break;
      case 'width':
        this.callBase(args);
        this._repaintToolbar();
        break;
      case 'imageUpload':
        this._moduleOptionChanged('imageUpload', args);
        break;
      default:
        this.callBase(args);
    }
  },

  _repaintToolbar() {
    this._applyToolbarMethod('repaint');
  },

  _updateHtmlContent(html) {
    const newDelta = this._quillInstance.clipboard.convert({ html });
    this._quillInstance.setContents(newDelta);
  },

  _clean() {
    if (this._quillInstance) {
      eventsEngine.off(this._getContent(), `.${this.NAME}`);
      this._quillInstance.off('text-change', this._textChangeHandlerWithContext);
      this._cleanCallback.fire();
    }

    this._abortUpdateContentTask();
    this._cleanCallback.empty();
    this._contentInitializedCallback.empty();
    this.callBase();
  },

  _abortUpdateContentTask() {
    if (this._updateContentTask) {
      this._updateContentTask.abort();
      this._updateContentTask = undefined;
    }
  },

  _applyQuillMethod(methodName, args) {
    if (this._quillInstance) {
      return this._quillInstance[methodName].apply(this._quillInstance, args);
    }
  },

  _applyQuillHistoryMethod(methodName) {
    if (this._quillInstance && this._quillInstance.history) {
      this._quillInstance.history[methodName]();
    }
  },

  _applyToolbarMethod(methodName) {
    this.getModule('toolbar')?.[methodName]();
  },

  addCleanCallback(callback) {
    this._cleanCallback.add(callback);
  },

  addContentInitializedCallback(callback) {
    this._contentInitializedCallback.add(callback);
  },

  register(components) {
    this._getRegistrator().registerModules(components);

    if (this._quillInstance) {
      this.repaint();
    }
  },

  get(modulePath) {
    return this._getRegistrator().getQuill().import(modulePath);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getModule(moduleName) {
    return this._applyQuillMethod('getModule', arguments);
  },

  getQuillInstance() {
    return this._quillInstance;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSelection(focus) {
    return this._applyQuillMethod('getSelection', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSelection(index, length) {
    this._applyQuillMethod('setSelection', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getText(index, length) {
    return this._applyQuillMethod('getText', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  format(formatName, formatValue) {
    this._applyQuillMethod('format', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatText(index, length, formatName, formatValue) {
    this._applyQuillMethod('formatText', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatLine(index, length, formatName, formatValue) {
    this._applyQuillMethod('formatLine', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFormat(index, length) {
    return this._applyQuillMethod('getFormat', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFormat(index, length) {
    return this._applyQuillMethod('removeFormat', arguments);
  },

  clearHistory() {
    this._applyQuillHistoryMethod('clear');
    this._applyToolbarMethod('updateHistoryWidgets');
  },

  undo() {
    this._applyQuillHistoryMethod('undo');
  },

  redo() {
    this._applyQuillHistoryMethod('redo');
  },

  getLength() {
    return this._applyQuillMethod('getLength');
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBounds(index, length) {
    return this._applyQuillMethod('getBounds', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(index, length) {
    this._applyQuillMethod('deleteText', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  insertText(index, text, formats) {
    this._applyQuillMethod('insertText', arguments);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  insertEmbed(index, type, config) {
    this._applyQuillMethod('insertEmbed', arguments);
  },

  showFormDialog(formConfig) {
    return this._formDialog.show(formConfig);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formDialogOption(optionName, optionValue) {
    return this._formDialog.popupOption.apply(this._formDialog, arguments);
  },

  focus() {
    this.callBase();
    this._applyQuillMethod('focus');
  },

  blur() {
    this._applyQuillMethod('blur');
  },

  getMentionKeyInTemplateStorage() {
    return this._mentionKeyInTemplateStorage;
  },
});

registerComponent('dxHtmlEditor', HtmlEditor);

export default HtmlEditor;
