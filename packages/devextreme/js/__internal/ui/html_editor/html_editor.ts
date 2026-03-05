import '@ts/ui/html_editor/converters/m_delta';

// @ts-expect-error ts-error
import { Event as dxEvent } from '@js/common/core/events';
import eventsEngine from '@js/common/core/events/core/events_engine';
import scrollEvents from '@js/common/core/events/gesture/emitter.gesture.scroll';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import config from '@js/core/config';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import {
  deferRender,
  // @ts-expect-error ts-error
  executeAsync,
  noop,
} from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isFunction } from '@js/core/utils/type';
import type { DxEvent } from '@js/events';
import type { Properties as FormProperties } from '@js/ui/form';
import type { Converter, HtmlEditorFormat, Properties } from '@js/ui/html_editor';
import type { OptionChanged } from '@ts/core/widget/types';
import type { ValueChangedEvent } from '@ts/ui/editor/editor';
import Editor from '@ts/ui/editor/editor';
import ConverterController, { type BaseConverter } from '@ts/ui/html_editor/m_converterController';
import { getQuill } from '@ts/ui/html_editor/m_quill_importer';
import QuillRegistrator from '@ts/ui/html_editor/m_quill_registrator';
import getWordMatcher from '@ts/ui/html_editor/matchers/m_wordLists';
import FormDialog from '@ts/ui/html_editor/ui/formDialog';
import { sanitizeHtml } from '@ts/ui/html_editor/utils/html_sanitizer';
import { prepareScrollData } from '@ts/ui/text_box/utils.scroll';

import type { AIDialogResult, AIDialogShowPayload } from './ui/aiDialog';
import AIDialog from './ui/aiDialog';

const QUILL_CONTAINER_CLASS = 'dx-quill-container';
const QUILL_CLIPBOARD_CLASS = 'ql-clipboard';
const HTML_EDITOR_CLASS = 'dx-htmleditor';
const HTML_EDITOR_SUBMIT_ELEMENT_CLASS = 'dx-htmleditor-submit-element';
const HTML_EDITOR_CONTENT_CLASS = 'dx-htmleditor-content';

const ANONYMOUS_TEMPLATE_NAME = 'htmlContent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QuillInstance = any;

type ModulesConfig = Record<string, unknown>;
type FocusEvent = DxEvent & { relatedTarget?: Element };

interface TextSelection {
  index: number;
  length: number;
}

interface Bounds {
  bottom?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  width?: number;
}

const isIos = devices.current().platform === 'ios';
let editorsCount = 0;

class HtmlEditor extends Editor<Properties> {
  _mentionKeyInTemplateStorage?: number;

  _formDialog!: FormDialog;

  _aiDialog?: AIDialog;

  _quillInstance?: QuillInstance;

  _cleanCallback!: Callback;

  _contentInitializedCallback!: Callback;

  _htmlConverter?: Converter;

  _deltaConverter!: BaseConverter;

  _updateContentTask?: DeferredObj<unknown> & { abort: () => void };

  _isEditorUpdating?: boolean;

  _textChangeHandlerWithContext?: () => void;

  _$htmlContainer!: dxElementWrapper;

  _contentRenderedDeferred?: DeferredObj<unknown>;

  _$templateResult?: dxElementWrapper;

  _quillRegistrator!: QuillRegistrator;

  _$submitElement!: dxElementWrapper;

  _getDefaultOptions(): Properties {
    const { editorStylingMode } = config();
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const stylingMode = editorStylingMode || 'outlined';

    return {
      ...super._getDefaultOptions(),
      // @ts-expect-error undefined is not allowed
      aiIntegration: null,
      allowSoftLineBreak: false,
      // @ts-expect-error undefined is not allowed
      converter: null,
      // @ts-expect-error undefined is not allowed
      customizeModules: null,
      focusStateEnabled: true,
      // @ts-expect-error undefined is not allowed
      imageUpload: null,
      // @ts-expect-error undefined is not allowed
      mediaResizing: null,
      // @ts-expect-error undefined is not allowed
      mentions: null,
      placeholder: '',
      stylingMode,
      // @ts-expect-error undefined is not allowed
      tableContextMenu: null,
      // @ts-expect-error undefined is not allowed
      tableResizing: null,
      // @ts-expect-error undefined is not allowed
      toolbar: null,
      // @ts-expect-error undefined is not allowed
      variables: null,
    };
  }

  _init(): void {
    this._mentionKeyInTemplateStorage = editorsCount;

    editorsCount += 1;

    super._init();

    this._cleanCallback = Callbacks();
    this._contentInitializedCallback = Callbacks();
    this._prepareHtmlConverter();
  }

  _prepareHtmlConverter(): void {
    const { converter } = this.option();

    if (converter) {
      this._htmlConverter = converter;
    }
  }

  _getAnonymousTemplateName(): string {
    return ANONYMOUS_TEMPLATE_NAME;
  }

  _initTemplates(): void {
    this._templateManager.addDefaultTemplates({
      [ANONYMOUS_TEMPLATE_NAME]: new EmptyTemplate(),
    });
    super._initTemplates();
  }

  _focusTarget(): dxElementWrapper {
    return this._getContent();
  }

  _getContent(): dxElementWrapper {
    return this.$element().find(`.${HTML_EDITOR_CONTENT_CLASS}`);
  }

  _focusInHandler(e: DxEvent): void {
    const { relatedTarget } = e as FocusEvent;

    if (this._shouldSkipFocusEvent(relatedTarget)) {
      return;
    }

    this._toggleFocusClass(true, this.$element());

    super._focusInHandler(e);
  }

  _focusOutHandler(e: DxEvent): void {
    const { relatedTarget } = e as FocusEvent;

    if (this._shouldSkipFocusEvent(relatedTarget)) {
      return;
    }

    this._toggleFocusClass(false, this.$element());

    super._focusOutHandler(e);
  }

  _shouldSkipFocusEvent(relatedTarget?: Element): boolean {
    return $(relatedTarget).hasClass(QUILL_CLIPBOARD_CLASS);
  }

  _initMarkup(): void {
    this._$htmlContainer = $('<div>').addClass(QUILL_CONTAINER_CLASS);

    this.$element()
      .attr('role', 'application')
      .addClass(HTML_EDITOR_CLASS)
      .wrapInner(this._$htmlContainer);

    this._renderStylingMode();

    const template = this._getTemplate(ANONYMOUS_TEMPLATE_NAME);
    const transclude = true;

    this._$templateResult = template?.render({
      container: getPublicElement(this._$htmlContainer),
      noModel: true,
      transclude,
    });

    this._renderSubmitElement();
    super._initMarkup();
    this._updateContainerMarkup();
  }

  _renderValidationState(): void {
    const $content = this._getContent();

    if ($content.length === 1) {
      super._renderValidationState();
    }
  }

  _renderSubmitElement(): void {
    this._$submitElement = $('<textarea>')
      .addClass(HTML_EDITOR_SUBMIT_ELEMENT_CLASS)
      .attr('hidden', true)
      .appendTo(this.$element());

    const { value } = this.option();

    this._setSubmitValue(value);
  }

  _setSubmitValue(value: Properties['value']): void {
    this._getSubmitElement().val(value);
  }

  _getSubmitElement(): dxElementWrapper {
    return this._$submitElement;
  }

  _convertToHtml(raw: Properties['value']): string {
    const value: string = raw ?? '';

    const result = isFunction(this._htmlConverter?.toHtml)
      ? String(this._htmlConverter?.toHtml(value) ?? '')
      : value;

    return result;
  }

  _convertFromHtml(raw: Properties['value']): string {
    const value: string = raw ?? '';

    const result = isFunction(this._htmlConverter?.fromHtml)
      ? String(this._htmlConverter?.fromHtml(value) ?? '')
      : value;

    return result;
  }

  _updateContainerMarkup(): void {
    const { value } = this.option();
    const html = this._convertToHtml(value);

    if (!html) {
      return;
    }

    const quill = getQuill();
    const sanitizedHtml = sanitizeHtml(quill, html);

    this._$htmlContainer.html(sanitizedHtml);
  }

  _render(): void {
    this._prepareConverters();

    super._render();
    this._toggleReadOnlyState();
  }

  _prepareQuillRegistrator(): void {
    if (!this._quillRegistrator) {
      this._quillRegistrator = new QuillRegistrator();
    }
  }

  _getRegistrator(): QuillRegistrator {
    this._prepareQuillRegistrator();
    return this._quillRegistrator;
  }

  _prepareConverters(): void {
    if (!this._deltaConverter) {
      const DeltaConverter = ConverterController.getConverter('delta');

      if (DeltaConverter) {
        this._deltaConverter = new DeltaConverter();
      }
    }
  }

  // @ts-expect-error ts-error
  _renderContentImpl(): Promise<unknown> {
    this._contentRenderedDeferred = Deferred();

    const renderContentPromise = this._contentRenderedDeferred.promise();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    super._renderContentImpl();

    this._renderHtmlEditor();
    this._renderFormDialog();
    this._renderAIDialog();

    this._addKeyPressHandler();

    return renderContentPromise;
  }

  _pointerMoveHandler(e: PointerEvent): void {
    if (isIos) {
      e.stopPropagation();
    }
  }

  _attachFocusEvents(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferRender(super._attachFocusEvents.bind(this));
  }

  _addKeyPressHandler(): void {
    const keyDownEvent = addNamespace('keydown', `${this.NAME}TextChange`);

    eventsEngine.on(this._$htmlContainer, keyDownEvent, this._keyDownHandler.bind(this));
  }

  _keyDownHandler(e: ValueChangedEvent): void {
    this._saveValueChangeEvent(e);
  }

  _renderHtmlEditor(): void {
    const { customizeModules } = this.option();
    const modulesConfig = this._getModulesConfig();

    if (isFunction(customizeModules)) {
      customizeModules(modulesConfig);
    }
    const { placeholder, readOnly, disabled } = this.option();

    this._quillInstance = this._getRegistrator().createEditor(this._$htmlContainer[0], {
      placeholder,
      readOnly: Boolean(readOnly) || Boolean(disabled),
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
  }

  _renderScrollHandler(): void {
    const $scrollContainer = this._getContent();
    const initScrollData = prepareScrollData($scrollContainer);

    eventsEngine.on(
      $scrollContainer,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addNamespace(scrollEvents.init, this.NAME!),
      initScrollData,
      noop,
    );

    eventsEngine.on(
      $scrollContainer,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addNamespace(pointerEvents.move, this.NAME!),
      this._pointerMoveHandler.bind(this),
    );
  }

  _applyTranscludedContent(): void {
    const { value } = this.option();

    if (!isDefined(value)) {
      const html = this._deltaConverter.toHtml();
      const newDelta = this._quillInstance.clipboard.convert({ html });

      if (newDelta.ops.length) {
        this._quillInstance.setContents(newDelta);

        return;
      }
    }

    this._finalizeContentRendering();
  }

  _hasTranscludedContent(): boolean {
    return Boolean(this._$templateResult?.length);
  }

  _getModulesConfig(): ModulesConfig {
    const modulesConfig: ModulesConfig = extend(
      {},
      {
        clipboard: this._getClipboardConfig(),
        // TODO: extract some IE11 tweaks for the Quill uploader module
        // dropImage: this._getBaseModuleConfig(),
        imageCursor: this._getBaseModuleConfig(),
        imageUpload: this._getModuleConfigByOption('imageUpload'),
        keyboard: this._getKeyboardModuleConfig(),
        mentions: this._getModuleConfigByOption('mentions'),
        multiline: Boolean(this.option('allowSoftLineBreak')),
        resizing: this._getModuleConfigByOption('mediaResizing'),
        table: true,
        tableContextMenu: this._getModuleConfigByOption('tableContextMenu'),
        tableResizing: this._getModuleConfigByOption('tableResizing'),
        toolbar: this._getModuleConfigByOption('toolbar'),
        uploader: this._getUploaderModuleConfig(),
        variables: this._getModuleConfigByOption('variables'),
      },
      this._getCustomModules(),
    );

    return modulesConfig;
  }

  _getUploaderModuleConfig(): {
    onDrop: (e: DxEvent) => void;
    imageBlot: string;
  } {
    return {
      onDrop: (e) => this._saveValueChangeEvent(dxEvent(e)),
      imageBlot: 'extendedImage',
    };
  }

  _getKeyboardModuleConfig(): { onKeydown: (e: DxEvent) => void } {
    return {
      onKeydown: (e) => this._saveValueChangeEvent(dxEvent(e)),
    };
  }

  _getClipboardConfig(): {
    onPaste: (e: DxEvent) => void;
    onCut: (e: DxEvent) => void;
    matchers: [string, unknown][];
  } {
    const quill = this._getRegistrator().getQuill();
    const wordListMatcher = getWordMatcher(quill);

    return {
      onPaste: (e) => this._saveValueChangeEvent(dxEvent(e)),
      onCut: (e) => this._saveValueChangeEvent(dxEvent(e)),
      matchers: [
        ['p.MsoListParagraphCxSpFirst', wordListMatcher],
        ['p.MsoListParagraphCxSpMiddle', wordListMatcher],
        ['p.MsoListParagraphCxSpLast', wordListMatcher],
      ],
    };
  }

  _getModuleConfigByOption(optionName: string): Partial<ModulesConfig> | undefined {
    const optionValue = this.option(optionName);

    if (!isDefined(optionValue)) {
      return undefined;
    }

    const configuration: ModulesConfig | unknown = Array.isArray(optionValue)
      ? { [optionName]: optionValue }
      : optionValue;

    const finalConfiguration: ModulesConfig = extend(
      this._getBaseModuleConfig(),
      configuration,
    );

    return finalConfiguration;
  }

  _getBaseModuleConfig(): ModulesConfig {
    return { editorInstance: this };
  }

  _getCustomModules(): ModulesConfig {
    const modules: ModulesConfig = {};
    const moduleNames = this._getRegistrator().getRegisteredModuleNames();

    moduleNames.forEach((modulePath) => {
      modules[modulePath] = this._getBaseModuleConfig();
    });

    return modules;
  }

  _textChangeHandler(): void {
    const { value } = this.option();

    const html = this._deltaConverter.toHtml();
    const convertedValue = this._convertFromHtml(html);

    if (
      value !== convertedValue
      && !this._isNullValueConverted(value, convertedValue)
    ) {
      this._isEditorUpdating = true;
      this.option({ value: convertedValue });
    }

    this._finalizeContentRendering();
  }

  _isNullValueConverted(
    value: Properties['value'],
    convertedValue: string,
  ): boolean {
    return value === null && convertedValue === '';
  }

  _finalizeContentRendering(): void {
    if (this._contentRenderedDeferred) {
      this.clearHistory();
      this._contentInitializedCallback.fire();
      this._contentRenderedDeferred.resolve();
      this._contentRenderedDeferred = undefined;
    }
  }

  _resetEnabledState(): void {
    if (this._quillInstance) {
      const isEnabled = !(this.option('readOnly') || this.option('disabled'));

      this._quillInstance.enable(isEnabled);
    }
  }

  _renderFormDialog(): void {
    const options = {
      width: 'auto',
      height: 'auto',
      hideOnOutsideClick: true,
    };

    this._formDialog = new FormDialog(this.$element(), options);
  }

  _shouldRenderAIDialog(): boolean {
    const { aiIntegration, toolbar } = this.option();

    if (!(aiIntegration && toolbar?.items)) {
      return false;
    }

    return toolbar.items.some((item) => (typeof item === 'string' ? item === 'ai' : item.name === 'ai'));
  }

  _renderAIDialog(): void {
    const shouldRenderAIDialog = this._shouldRenderAIDialog();

    if (shouldRenderAIDialog) {
      const { aiIntegration } = this.option();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._aiDialog = new AIDialog(this.$element(), aiIntegration!);
    }
  }

  _getStylingModePrefix(): string {
    return `${HTML_EDITOR_CLASS}-`;
  }

  _getQuillContainer(): dxElementWrapper {
    return this._$htmlContainer;
  }

  _prepareModuleOptions(args: OptionChanged<Properties>): [string, unknown] {
    let { value } = args;
    const { fullName, name } = args;

    const optionData = fullName?.split('.');
    const optionName: string = optionData.length >= 2 ? optionData[1] : name;

    if (optionData.length === 3) {
      value = { [optionData[2]]: value };
    }

    return [optionName, value];
  }

  _moduleOptionChanged(moduleName: string, args: OptionChanged<Properties>): void {
    const moduleInstance = this.getModule(moduleName);
    const shouldPassOptionsToModule = Boolean(moduleInstance);

    if (shouldPassOptionsToModule) {
      moduleInstance.option(...this._prepareModuleOptions(args));
    } else {
      this._invalidate();
    }
  }

  _processHtmlContentUpdating(value: Properties['value']): void {
    if (this._quillInstance) {
      if (this._isEditorUpdating) {
        this._isEditorUpdating = false;
      } else {
        const html: string = this._convertToHtml(value);

        this._suppressValueChangeAction();
        this._updateHtmlContent(html);
        this._resumeValueChangeAction();
      }
    } else {
      this._$htmlContainer.html(value);
    }
  }

  _processAIIntegrationUpdate(): void {
    if (isDefined(this._aiDialog)) {
      const { aiIntegration } = this.option();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._aiDialog.updateAIIntegration(aiIntegration!);

      return;
    }
    this._renderAIDialog();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'aiIntegration': {
        this._processAIIntegrationUpdate();
        break;
      }
      case 'converter': {
        this._htmlConverter = value as Properties[typeof name];

        const { value: currentValue } = this.option();

        this._processHtmlContentUpdating(currentValue);
        break;
      }
      case 'value': {
        this._processHtmlContentUpdating(value);

        // NOTE: value can be optimized by Quill
        const { value: currentValue } = this.option();

        if (currentValue !== previousValue) {
          this._setSubmitValue(currentValue);
          super._optionChanged({ ...args, [name]: currentValue });
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
      case 'stylingMode':
        this._renderStylingMode();
        break;
      case 'readOnly':
      case 'disabled':
        super._optionChanged(args);
        this._resetEnabledState();
        break;
      case 'tableContextMenu':
        this._moduleOptionChanged('tableContextMenu', args);
        break;
      case 'mediaResizing':
        this._moduleOptionChanged('resizing', args);
        break;
      case 'width':
        super._optionChanged(args);
        this._repaintToolbar();
        break;
      case 'imageUpload':
        this._moduleOptionChanged('imageUpload', args);
        break;
      default:
        super._optionChanged(args);
    }
  }

  _repaintToolbar(): void {
    this._applyToolbarMethod('repaint');
  }

  _updateHtmlContent(html: string): void {
    const newDelta = this._quillInstance.clipboard.convert({ html });
    this._quillInstance.setContents(newDelta);
  }

  _clean(): void {
    if (this._quillInstance) {
      eventsEngine.off(this._getContent(), `.${this.NAME}`);
      this._quillInstance.off('text-change', this._textChangeHandlerWithContext);
      this._cleanCallback.fire();
    }

    this._abortUpdateContentTask();
    this._cleanCallback.empty();
    this._contentInitializedCallback.empty();
    super._clean();
  }

  _abortUpdateContentTask(): void {
    if (this._updateContentTask) {
      this._updateContentTask.abort();
      this._updateContentTask = undefined;
    }
  }

  _applyQuillMethod<T extends keyof QuillInstance>(
    methodName: T,
    ...args: Parameters<QuillInstance[T]>
  ): ReturnType<QuillInstance[T]> | undefined {
    if (!this._quillInstance) {
      return undefined;
    }

    // eslint-disable-next-line prefer-spread
    return this._quillInstance[methodName].apply(this._quillInstance, args);
  }

  _applyQuillHistoryMethod(methodName: string): void {
    if (this._quillInstance?.history) {
      this._quillInstance.history[methodName]();
    }
  }

  _applyToolbarMethod(methodName: string): void {
    this.getModule('toolbar')?.[methodName]();
  }

  addCleanCallback(callback: () => unknown): void {
    this._cleanCallback.add(callback);
  }

  addContentInitializedCallback(callback: () => unknown): void {
    this._contentInitializedCallback.add(callback);
  }

  register(components: Record<string, unknown>): void {
    this._getRegistrator().registerModules(components);

    if (this._quillInstance) {
      this.repaint();
    }
  }

  get(componentPath: string): unknown {
    return this._getRegistrator().getQuill().import(componentPath);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getModule(moduleName: string): any {
    return this._applyQuillMethod('getModule', moduleName);
  }

  getQuillInstance(): QuillInstance | undefined {
    return this._quillInstance;
  }

  getSelection(focus?: boolean): TextSelection {
    const selection: TextSelection = this._applyQuillMethod('getSelection', focus);

    return selection;
  }

  setSelection(index: number, length: number): void {
    this._applyQuillMethod('setSelection', index, length);
  }

  getText(index: number, length: number): string {
    const text: string = this._applyQuillMethod('getText', index, length);

    return text;
  }

  format(
    formatName: HtmlEditorFormat | string,
    formatValue: unknown,
  ): void {
    this._applyQuillMethod('format', formatName, formatValue);
  }

  formatText(
    index: number,
    length: number,
    formatName: HtmlEditorFormat | string,
    formatValue: unknown,
  ): void {
    this._applyQuillMethod('formatText', index, length, formatName, formatValue);
  }

  formatLine(
    index: number,
    length: number,
    formatName: HtmlEditorFormat | string,
    formatValue: unknown,
  ): void {
    this._applyQuillMethod('formatLine', index, length, formatName, formatValue);
  }

  getFormat(
    index: number,
    length: number,
  ): unknown {
    const formats = this._applyQuillMethod('getFormat', index, length);

    return formats;
  }

  removeFormat(index: number, length: number): void {
    this._applyQuillMethod('removeFormat', index, length);
  }

  clearHistory(): void {
    this._applyQuillHistoryMethod('clear');
    this._applyToolbarMethod('updateHistoryWidgets');
  }

  undo(): void {
    this._applyQuillHistoryMethod('undo');
  }

  redo(): void {
    this._applyQuillHistoryMethod('redo');
  }

  getLength(): number {
    const length: number = this._applyQuillMethod('getLength');

    return length;
  }

  getBounds(index: number, length: number): Bounds {
    const bounds: Bounds = this._applyQuillMethod('getBounds', index, length);

    return bounds;
  }

  delete(index: number, length: number): void {
    this._applyQuillMethod('deleteText', index, length);
  }

  insertText(
    index: number,
    text: string,
    formatName: unknown,
    formatValue?: unknown,
  ): void {
    this._applyQuillMethod('insertText', index, text, formatName, formatValue);
  }

  insertEmbed(
    index: number,
    type: string,
    options: unknown,
  ): void {
    this._applyQuillMethod('insertEmbed', index, type, options);
  }

  showFormDialog(formConfig: FormProperties): Promise<unknown> | undefined {
    return this._formDialog.show(formConfig);
  }

  showAIDialog(payload: AIDialogShowPayload): Promise<AIDialogResult> | undefined {
    return this._aiDialog?.show(payload);
  }

  formDialogOption(
    optionName: string,
    optionValue: unknown,
  ): void {
    return this._formDialog.popupOption.apply(
      this._formDialog,
      [optionName, optionValue],
    );
  }

  focus(): void {
    super.focus();
    this._applyQuillMethod('focus');
  }

  blur(): void {
    this._applyQuillMethod('blur');
  }

  getMentionKeyInTemplateStorage(): number | undefined {
    return this._mentionKeyInTemplateStorage;
  }
}

registerComponent('dxHtmlEditor', HtmlEditor);

export default HtmlEditor;
