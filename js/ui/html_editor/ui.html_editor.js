import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { isDefined, isFunction } from '../../core/utils/type';
import { resetActiveElement } from '../../core/utils/dom';
import domAdapter from '../../core/dom_adapter';
import { getPublicElement } from '../../core/element';
import { executeAsync, noop, ensureDefined, deferRender } from '../../core/utils/common';
import registerComponent from '../../core/component_registrator';
import { EmptyTemplate } from '../../core/templates/empty_template';
import Editor from '../editor/editor';
import Errors from '../widget/ui.errors';
import Callbacks from '../../core/utils/callbacks';
import { Deferred } from '../../core/utils/deferred';
import eventsEngine from '../../events/core/events_engine';
import { addNamespace } from '../../events/utils/index';
import { Event as dxEvent } from '../../events/index';
import scrollEvents from '../scroll_view/ui.events.emitter.gesture.scroll';
import { prepareScrollData } from '../text_box/utils.scroll';

import QuillRegistrator from './quill_registrator';
import './converters/delta';
import ConverterController from './converterController';
import getWordMatcher from './matchers/wordLists';
import FormDialog from './ui/formDialog';

// STYLE htmlEditor

const HTML_EDITOR_CLASS = 'dx-htmleditor';
const QUILL_CONTAINER_CLASS = 'dx-quill-container';
const QUILL_CLIPBOARD_CLASS = 'ql-clipboard';
const HTML_EDITOR_SUBMIT_ELEMENT_CLASS = 'dx-htmleditor-submit-element';
const HTML_EDITOR_CONTENT_CLASS = 'dx-htmleditor-content';

const MARKDOWN_VALUE_TYPE = 'markdown';

const ANONYMOUS_TEMPLATE_NAME = 'htmlContent';

const HtmlEditor = Editor.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            focusStateEnabled: true,


            valueType: 'html',
            placeholder: '',
            toolbar: null,
            variables: null,
            mediaResizing: null,
            mentions: null,
            customizeModules: null,

            formDialogOptions: null,

            stylingMode: 'outlined'
        });
    },

    _init: function() {
        this.callBase();
        this._cleanCallback = Callbacks();
        this._contentInitializedCallback = Callbacks();
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _initTemplates: function() {
        this._templateManager.addDefaultTemplates({
            [ANONYMOUS_TEMPLATE_NAME]: new EmptyTemplate()
        });
        this.callBase();
    },

    _focusTarget: function() {
        return this._getContent();
    },

    _getContent: function() {
        return this.$element().find(`.${HTML_EDITOR_CONTENT_CLASS}`);
    },

    _focusInHandler: function({ relatedTarget }) {
        if(this._shouldSkipFocusEvent(relatedTarget)) {
            return;
        }

        this._toggleFocusClass(true, this.$element());

        this.callBase.apply(this, arguments);
    },

    _focusOutHandler: function({ relatedTarget }) {
        if(this._shouldSkipFocusEvent(relatedTarget)) {
            return;
        }

        this._toggleFocusClass(false, this.$element());

        this.callBase.apply(this, arguments);
    },

    _shouldSkipFocusEvent: function(relatedTarget) {
        return $(relatedTarget).hasClass(QUILL_CLIPBOARD_CLASS);
    },

    _initMarkup: function() {
        this._$htmlContainer = $('<div>').addClass(QUILL_CONTAINER_CLASS);

        this.$element()
            .addClass(HTML_EDITOR_CLASS)
            .wrapInner(this._$htmlContainer);

        this._renderStylingMode();

        const template = this._getTemplate(ANONYMOUS_TEMPLATE_NAME);
        const transclude = true;

        this._$templateResult = template && template.render({
            container: getPublicElement(this._$htmlContainer),
            noModel: true,
            transclude
        });

        this._renderSubmitElement();
        this.callBase();

        this._updateContainerMarkup();
    },

    _renderSubmitElement: function() {
        this._$submitElement = $('<textarea>')
            .addClass(HTML_EDITOR_SUBMIT_ELEMENT_CLASS)
            .attr('hidden', true)
            .appendTo(this.$element());

        this._setSubmitValue(this.option('value'));
    },

    _setSubmitValue: function(value) {
        this._getSubmitElement().val(value);
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _updateContainerMarkup: function() {
        let markup = this.option('value');

        if(this._isMarkdownValue()) {
            this._prepareMarkdownConverter();
            markup = this._markdownConverter.toHtml(markup);
        }

        if(markup) {
            this._$htmlContainer.html(markup);
        }
    },

    _prepareMarkdownConverter: function() {
        const MarkdownConverter = ConverterController.getConverter('markdown');

        if(MarkdownConverter) {
            this._markdownConverter = new MarkdownConverter();
        } else {
            throw Errors.Error('E1051', 'markdown');
        }
    },

    _render: function() {
        this._prepareConverters();

        this.callBase();
    },

    _prepareQuillRegistrator: function() {
        if(!this._quillRegistrator) {
            this._quillRegistrator = new QuillRegistrator();
        }
    },

    _getRegistrator: function() {
        this._prepareQuillRegistrator();
        return this._quillRegistrator;
    },

    _prepareConverters: function() {
        if(!this._deltaConverter) {
            const DeltaConverter = ConverterController.getConverter('delta');

            if(DeltaConverter) {
                this._deltaConverter = new DeltaConverter();
            }
        }

        if(this.option('valueType') === MARKDOWN_VALUE_TYPE && !this._markdownConverter) {
            this._prepareMarkdownConverter();
        }
    },

    _renderContentImpl: function() {
        this._contentRenderedDeferred = new Deferred();

        const renderContentPromise = this._contentRenderedDeferred.promise();

        this.callBase();
        this._renderHtmlEditor();
        this._renderFormDialog();
        this._addKeyPressHandler();

        return renderContentPromise;
    },

    _attachFocusEvents: function() {
        deferRender(this.callBase.bind(this));
    },

    _addKeyPressHandler: function() {
        const keyDownEvent = addNamespace('keydown', `${this.NAME}TextChange`);

        eventsEngine.on(this._$htmlContainer, keyDownEvent, this._keyDownHandler.bind(this));
    },

    _keyDownHandler: function(e) {
        this._saveValueChangeEvent(e);
    },

    _renderHtmlEditor: function() {
        const customizeModules = this.option('customizeModules');
        const modulesConfig = this._getModulesConfig();

        if(isFunction(customizeModules)) {
            customizeModules(modulesConfig);
        }

        this._quillInstance = this._getRegistrator().createEditor(this._$htmlContainer[0], {
            placeholder: this.option('placeholder'),
            readOnly: this.option('readOnly') || this.option('disabled'),
            modules: modulesConfig,
            theme: 'basic'
        });

        this._deltaConverter.setQuillInstance(this._quillInstance);
        this._textChangeHandlerWithContext = this._textChangeHandler.bind(this);
        this._quillInstance.on('text-change', this._textChangeHandlerWithContext);
        this._renderScrollHandler();
        if(this._hasTranscludedContent()) {
            this._updateContentTask = executeAsync(() => {
                this._applyTranscludedContent();
            });
        } else {
            this._finalizeContentRendering();
        }
    },

    _renderScrollHandler: function() {
        const $scrollContainer = this._getContent();

        const initScrollData = prepareScrollData($scrollContainer);

        eventsEngine.on($scrollContainer, addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);
    },

    _applyTranscludedContent: function() {
        const valueOption = this.option('value');
        if(!isDefined(valueOption)) {
            const html = this._deltaConverter.toHtml();
            const newDelta = this._quillInstance.clipboard.convert({ html });

            if(newDelta.ops.length) {
                this._quillInstance.setContents(newDelta);
                return;
            }
        }

        this._finalizeContentRendering();
    },

    _hasTranscludedContent: function() {
        return this._$templateResult && this._$templateResult.length;
    },

    _getModulesConfig: function() {
        const quill = this._getRegistrator().getQuill();
        const wordListMatcher = getWordMatcher(quill);
        const modulesConfig = extend({}, {
            table: true,
            toolbar: this._getModuleConfigByOption('toolbar'),
            variables: this._getModuleConfigByOption('variables'),
            // TODO: extract some IE11 tweaks for the Quill uploader module
            // dropImage: this._getBaseModuleConfig(),
            resizing: this._getModuleConfigByOption('mediaResizing'),
            mentions: this._getModuleConfigByOption('mentions'),
            uploader: {
                onDrop: (e) => this._saveValueChangeEvent(dxEvent(e)),
                imageBlot: 'extendedImage'
            },
            keyboard: {
                onKeydown: (e) => this._saveValueChangeEvent(dxEvent(e))
            },
            clipboard: {
                onPaste: (e) => this._saveValueChangeEvent(dxEvent(e)),
                onCut: (e) => this._saveValueChangeEvent(dxEvent(e)),
                matchers: [
                    ['p.MsoListParagraphCxSpFirst', wordListMatcher],
                    ['p.MsoListParagraphCxSpMiddle', wordListMatcher],
                    ['p.MsoListParagraphCxSpLast', wordListMatcher]
                ]
            }
        }, this._getCustomModules());

        return modulesConfig;
    },

    _getModuleConfigByOption: function(userOptionName) {
        const optionValue = this.option(userOptionName);
        let config = {};

        if(!isDefined(optionValue)) {
            return undefined;
        }

        if(Array.isArray(optionValue)) {
            config[userOptionName] = optionValue;
        } else {
            config = optionValue;
        }

        return extend(this._getBaseModuleConfig(), config);
    },

    _getBaseModuleConfig: function() {
        return { editorInstance: this };
    },

    _getCustomModules: function() {
        const modules = {};
        const moduleNames = this._getRegistrator().getRegisteredModuleNames();

        moduleNames.forEach(modulePath => {
            modules[modulePath] = this._getBaseModuleConfig();
        });

        return modules;
    },

    _textChangeHandler: function(newDelta, oldDelta, source) {
        const htmlMarkup = this._deltaConverter.toHtml();
        const convertedValue = this._isMarkdownValue() ? this._updateValueByType(MARKDOWN_VALUE_TYPE, htmlMarkup) : htmlMarkup;
        const currentValue = this.option('value');

        if(currentValue !== convertedValue && !this._isNullValueConverted(currentValue, convertedValue)) {
            this._isEditorUpdating = true;
            this.option('value', convertedValue);
        }

        this._finalizeContentRendering();
    },

    _isNullValueConverted: function(currentValue, convertedValue) {
        return currentValue === null && convertedValue === '';
    },

    _finalizeContentRendering: function() {
        if(this._contentRenderedDeferred) {
            this.clearHistory();
            this._contentInitializedCallback.fire();
            this._contentRenderedDeferred.resolve();
            this._contentRenderedDeferred = undefined;
        }
    },

    _updateValueByType: function(valueType, value) {
        const converter = this._markdownConverter;

        if(!isDefined(converter)) {
            return;
        }

        const currentValue = ensureDefined(value, this.option('value'));

        return valueType === MARKDOWN_VALUE_TYPE ? converter.toMarkdown(currentValue) : converter.toHtml(currentValue);
    },

    _isMarkdownValue: function() {
        return this.option('valueType') === MARKDOWN_VALUE_TYPE;
    },

    _resetEnabledState: function() {
        if(this._quillInstance) {
            const isEnabled = !(this.option('readOnly') || this.option('disabled'));

            this._quillInstance.enable(isEnabled);
        }
    },

    _renderFormDialog: function() {
        const userOptions = extend(true, {
            width: 'auto',
            height: 'auto',
            closeOnOutsideClick: true
        }, this.option('formDialogOptions'));

        this._formDialog = new FormDialog(this, userOptions);
    },

    _getStylingModePrefix: function() {
        return 'dx-htmleditor-';
    },

    _getQuillContainer: function() {
        return this._$htmlContainer;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'value':
                if(this._quillInstance) {
                    if(this._isEditorUpdating) {
                        this._isEditorUpdating = false;
                    } else {
                        const updatedValue = this._isMarkdownValue() ? this._updateValueByType('HTML', args.value) : args.value;
                        this._updateHtmlContent(updatedValue);
                    }
                } else {
                    this._$htmlContainer.html(args.value);
                }

                this._setSubmitValue(args.value);

                this.callBase(args);
                break;
            case 'placeholder':
            case 'variables':
            case 'toolbar':
            case 'mentions':
            case 'customizeModules':
                this._invalidate();
                break;
            case 'valueType': {
                this._prepareConverters();
                const newValue = this._updateValueByType(args.value);

                if(args.value === 'html' && this._quillInstance) {
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
            case 'mediaResizing':
                if(!args.previousValue || !args.value) {
                    this._invalidate();
                } else {
                    this._quillInstance.getModule('resizing').option(args.name, args.value);
                }
                break;
            case 'width':
                this.callBase(args);
                this._repaintToolbar();
                break;
            default:
                this.callBase(args);
        }
    },

    _repaintToolbar: function() {
        const toolbar = this._quillInstance.getModule('toolbar');
        toolbar && toolbar.repaint();
    },

    _updateHtmlContent: function(html) {
        const newDelta = this._quillInstance.clipboard.convert({ html });
        this._quillInstance.setContents(newDelta);
    },

    _clean: function() {
        if(this._quillInstance) {
            eventsEngine.off(this._getContent(), `.${this.NAME}`);
            this._quillInstance.off('text-change', this._textChangeHandlerWithContext);
            this._cleanCallback.fire();
        }

        this._abortUpdateContentTask();
        this._cleanCallback.empty();
        this._contentInitializedCallback.empty();
        this.callBase();
    },

    _abortUpdateContentTask: function() {
        if(this._updateContentTask) {
            this._updateContentTask.abort();
            this._updateContentTask = undefined;
        }
    },

    _applyQuillMethod(methodName, args) {
        if(this._quillInstance) {
            return this._quillInstance[methodName].apply(this._quillInstance, args);
        }
    },

    _applyQuillHistoryMethod(methodName) {
        if(this._quillInstance && this._quillInstance.history) {
            this._quillInstance.history[methodName]();
        }
    },

    addCleanCallback(callback) {
        this._cleanCallback.add(callback);
    },

    addContentInitializedCallback(callback) {
        this._contentInitializedCallback.add(callback);
    },

    register: function(components) {
        this._getRegistrator().registerModules(components);

        if(this._quillInstance) {
            this.repaint();
        }
    },

    get: function(modulePath) {
        return this._getRegistrator().getQuill().import(modulePath);
    },

    getModule: function(moduleName) {
        return this._applyQuillMethod('getModule', arguments);
    },

    getQuillInstance: function() {
        return this._quillInstance;
    },

    getSelection: function() {
        return this._applyQuillMethod('getSelection');
    },

    setSelection: function(index, length) {
        this._applyQuillMethod('setSelection', arguments);
    },

    getText: function(index, length) {
        return this._applyQuillMethod('getText', arguments);
    },

    format: function(formatName, formatValue) {
        this._applyQuillMethod('format', arguments);
    },

    formatText: function(index, length, formatName, formatValue) {
        this._applyQuillMethod('formatText', arguments);
    },

    formatLine: function(index, length, formatName, formatValue) {
        this._applyQuillMethod('formatLine', arguments);
    },

    getFormat: function(index, length) {
        return this._applyQuillMethod('getFormat', arguments);
    },

    removeFormat: function(index, length) {
        return this._applyQuillMethod('removeFormat', arguments);
    },

    clearHistory: function() {
        this._applyQuillHistoryMethod('clear');
    },

    undo: function() {
        this._applyQuillHistoryMethod('undo');

    },

    redo: function() {
        this._applyQuillHistoryMethod('redo');

    },

    getLength: function() {
        return this._applyQuillMethod('getLength');
    },

    getBounds: function(index, length) {
        return this._applyQuillMethod('getBounds', arguments);
    },

    delete: function(index, length) {
        this._applyQuillMethod('deleteText', arguments);
    },

    insertText: function(index, text, formats) {
        this._applyQuillMethod('insertText', arguments);
    },

    insertEmbed: function(index, type, config) {
        this._applyQuillMethod('insertEmbed', arguments);
    },

    showFormDialog: function(formConfig) {
        return this._formDialog.show(formConfig);
    },

    formDialogOption: function(optionName, optionValue) {
        return this._formDialog.popupOption.apply(this._formDialog, arguments);
    },

    update: function() {
        this._applyQuillMethod('update');
    },

    focus: function() {
        this.callBase();

        this._applyQuillMethod('focus');
    },

    blur: function() {
        if(this.$element().find(domAdapter.getActiveElement())) {
            resetActiveElement();
        }
        this._applyQuillMethod('blur');
    }
});

registerComponent('dxHtmlEditor', HtmlEditor);

export default HtmlEditor;
