import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isDefined, isFunction } from "../../core/utils/type";
import { getPublicElement } from "../../core/utils/dom";
import { executeAsync } from "../../core/utils/common";
import registerComponent from "../../core/component_registrator";
import EmptyTemplate from "../widget/empty_template";
import Editor from "../editor/editor";
import Errors from "../widget/ui.errors";
import Callbacks from "../../core/utils/callbacks";
import { Deferred } from "../../core/utils/deferred";

import QuillRegistrator from "./quill_registrator";
import "./converters/delta";
import ConverterController from "./converterController";
import getWordMatcher from "./matchers/wordLists";
import FormDialog from "./ui/formDialog";

const HTML_EDITOR_CLASS = "dx-htmleditor";
const QUILL_CONTAINER_CLASS = "dx-quill-container";
const HTML_EDITOR_SUBMIT_ELEMENT_CLASS = "dx-htmleditor-submit-element";
const HTML_EDITOR_CONTENT_CLASS = "dx-htmleditor-content";

const MARKDOWN_VALUE_TYPE = "markdown";

const ANONYMOUS_TEMPLATE_NAME = "htmlContent";

const HtmlEditor = Editor.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
             * @name dxHtmlEditorOptions.focusStateEnabled
             * @type boolean
             * @default true
             */
            focusStateEnabled: true,

            /**
            * @name dxHtmlEditorOptions.onFocusIn
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 event:event
            * @action
            */
            /**
            * @name dxHtmlEditorOptions.onFocusOut
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 event:event
            * @action
            */
            /**
            * @name dxHtmlEditorOptions.name
            * @type string
            * @hidden false
            */

            /**
            * @name dxHtmlEditorOptions.valueType
            * @type Enums.HtmlEditorValueType
            * @default "html"
            */
            valueType: "html",
            /**
            * @name dxHtmlEditorOptions.placeholder
            * @type string
            * @default ""
            */
            placeholder: "",
            /**
            * @name dxHtmlEditorOptions.toolbar
            * @type dxHtmlEditorToolbar
            * @default null
            */
            toolbar: null,
            /**
            * @name dxHtmlEditorOptions.variables
            * @type dxHtmlEditorVariables
            * @default null
            */
            variables: null,
            /**
            * @name dxHtmlEditorOptions.mediaResizing
            * @type dxHtmlEditorMediaResizing
            * @default null
            */
            mediaResizing: null,
            /**
            * @name dxHtmlEditorOptions.mentions
            * @type Array<dxHtmlEditorMention>
            * @default null
            */
            mentions: null,
            /**
             * @name dxHtmlEditorOptions.customizeModules
             * @type function
             * @type_function_param1 config:object
             */
            customizeModules: null,

            formDialogOptions: null

            /**
            * @name dxHtmlEditorToolbar
            * @type object
            */
            /**
            * @name dxHtmlEditorToolbar.container
            * @type string|Node|jQuery
            */
            /**
            * @name dxHtmlEditorToolbar.items
            * @type Array<dxHtmlEditorToolbarItem,string>
            */

            /**
            * @name dxHtmlEditorToolbarItem
            * @inherits dxToolbarItem
            */
            /**
            * @name dxHtmlEditorToolbarItem.formatName
            * @type string
            */
            /**
            * @name dxHtmlEditorToolbarItem.formatValues
            * @type Array<string,number,boolean>
            */
            /**
            * @name dxHtmlEditorToolbarItem.location
            * @default "before"
            */

            /**
            * @name dxHtmlEditorVariables
            * @type object
            */
            /**
            * @name dxHtmlEditorVariables.dataSource
            * @type string|Array<string>|DataSource|DataSourceOptions
            * @default null
            */
            /**
            * @name dxHtmlEditorVariables.escapeChar
            * @type string|Array<string>
            * @default ""
            */

            /**
            * @name dxHtmlEditorMediaResizing
            * @type object
            */
            /**
            * @name dxHtmlEditorMediaResizing.enabled
            * @type boolean
            * @default false
            */
            /**
            * @name dxHtmlEditorMediaResizing.allowedTargets
            * @type Array<string>
            * @default ["images"]
            */

            /**
            * @name dxHtmlEditorMention
            * @type object
            */
            /**
            * @name dxHtmlEditorMention.dataSource
            * @type Array<string>|DataSource|DataSourceOptions
            * @default null
            */
            /**
            * @name dxHtmlEditorMention.marker
            * @type string
            * @default "@"
            */
            /**
            * @name dxHtmlEditorMention.minSearchLength
            * @type number
            * @default 0
            */
            /**
            * @name dxHtmlEditorMention.searchTimeout
            * @type number
            * @default 500
            */
            /**
            * @name dxHtmlEditorMention.itemTemplate
            * @type template|function
            * @default "item"
            * @type_function_param1 itemData:object
            * @type_function_param2 itemIndex:number
            * @type_function_param3 itemElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            /**
            * @name dxHtmlEditorMention.displayExpr
            * @type string|function(item)
            * @default "this"
            * @type_function_param1 item:object
            * @type_function_return string
            */
            /**
            * @name dxHtmlEditorMention.searchExpr
            * @type getter|Array<getter>
            * @default "this"
            */
            /**
            * @name dxHtmlEditorMention.valueExpr
            * @type string|function
            * @default "this"
            */
            /**
            * @name dxHtmlEditorMention.template
            * @type template|function
            * @default null
            * @type_function_param1 mentionData:object
            * @type_function_param1_field1 marker:string
            * @type_function_param1_field2 id:string|number
            * @type_function_param1_field3 value:any
            * @type_function_param2 contentElement:dxElement
            * @type_function_return string|Node|jQuery
            */
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
        this.callBase();

        this._defaultTemplates[ANONYMOUS_TEMPLATE_NAME] = new EmptyTemplate(this);
    },

    _focusTarget: function() {
        return this.$element().find(`.${HTML_EDITOR_CONTENT_CLASS}`);
    },

    _focusInHandler: function() {
        this._toggleFocusClass(true, this.$element());

        this.callBase.apply(this, arguments);
    },

    _focusOutHandler: function() {
        this._toggleFocusClass(false, this.$element());

        this.callBase.apply(this, arguments);
    },

    _initMarkup: function() {
        this._$htmlContainer = $("<div>").addClass(QUILL_CONTAINER_CLASS);

        this.$element()
            .addClass(HTML_EDITOR_CLASS)
            .wrapInner(this._$htmlContainer);

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
        this._$submitElement = $("<textarea>")
            .addClass(HTML_EDITOR_SUBMIT_ELEMENT_CLASS)
            .attr("hidden", true)
            .appendTo(this.$element());

        this._setSubmitValue(this.option("value"));
    },

    _setSubmitValue: function(value) {
        this._getSubmitElement().val(value);
    },

    _getSubmitElement: function() {
        return this._$submitElement;
    },

    _updateContainerMarkup: function() {
        let markup = this.option("value");

        if(this._isMarkdownValue()) {
            this._prepareMarkdownConverter();
            markup = this._markdownConverter.toHtml(markup);
        }

        if(markup) {
            this._$htmlContainer.html(markup);
        }
    },

    _prepareMarkdownConverter: function() {
        const MarkdownConverter = ConverterController.getConverter("markdown");

        if(MarkdownConverter) {
            this._markdownConverter = new MarkdownConverter();
        } else {
            throw Errors.Error("E1051", "markdown");
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
            const DeltaConverter = ConverterController.getConverter("delta");

            if(DeltaConverter) {
                this._deltaConverter = new DeltaConverter();
            }
        }

        if(this.option("valueType") === MARKDOWN_VALUE_TYPE && !this._markdownConverter) {
            this._prepareMarkdownConverter();
        }
    },

    _renderContentImpl: function() {
        this._contentRenderedDeferred = new Deferred();

        const renderContentPromise = this._contentRenderedDeferred.promise();

        this.callBase();
        this._renderHtmlEditor();
        this._renderFormDialog();

        return renderContentPromise;
    },

    _renderHtmlEditor: function() {
        const customizeModules = this.option("customizeModules");
        const modulesConfig = this._getModulesConfig();

        if(isFunction(customizeModules)) {
            customizeModules(modulesConfig);
        }

        this._quillInstance = this._getRegistrator().createEditor(this._$htmlContainer[0], {
            placeholder: this.option("placeholder"),
            readOnly: this.option("readOnly") || this.option("disabled"),
            modules: modulesConfig,
            theme: "basic"
        });

        this._deltaConverter.setQuillInstance(this._quillInstance);
        this._textChangeHandlerWithContext = this._textChangeHandler.bind(this);
        this._quillInstance.on("text-change", this._textChangeHandlerWithContext);

        if(this._hasTranscludedContent()) {
            this._updateContentTask = executeAsync(() => {
                this._applyTranscludedContent();
            });
        } else {
            this._finalizeContentRendering();
        }
    },

    _applyTranscludedContent: function() {
        const markup = this._deltaConverter.toHtml();
        const newDelta = this._quillInstance.clipboard.convert(markup);

        if(newDelta.ops.length) {
            this._quillInstance.setContents(newDelta);
        } else {
            this._finalizeContentRendering();
        }
    },

    _hasTranscludedContent: function() {
        return this._$templateResult && this._$templateResult.length;
    },

    _getModulesConfig: function() {
        const wordListMatcher = getWordMatcher(this._getRegistrator().getQuill());
        let modulesConfig = extend({
            toolbar: this._getModuleConfigByOption("toolbar"),
            variables: this._getModuleConfigByOption("variables"),
            dropImage: this._getBaseModuleConfig(),
            resizing: this._getModuleConfigByOption("mediaResizing"),
            mentions: this._getModuleConfigByOption("mentions"),
            clipboard: {
                matchVisual: false,
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
        const value = this._isMarkdownValue() ? this._updateValueByType(MARKDOWN_VALUE_TYPE, htmlMarkup) : htmlMarkup;

        if(this.option("value") !== value) {
            this._isEditorUpdating = true;
            this.option("value", value);
        }

        this._finalizeContentRendering();
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

        const currentValue = value || this.option("value");

        return valueType === MARKDOWN_VALUE_TYPE ? converter.toMarkdown(currentValue) : converter.toHtml(currentValue);
    },

    _isMarkdownValue: function() {
        return this.option("valueType") === MARKDOWN_VALUE_TYPE;
    },

    _resetEnabledState: function() {
        if(this._quillInstance) {
            const isEnabled = !(this.option("readOnly") || this.option("disabled"));

            this._quillInstance.enable(isEnabled);
        }
    },

    _renderFormDialog: function() {
        const userOptions = extend(true, {
            width: "auto",
            height: "auto",
            closeOnOutsideClick: true
        }, this.option("formDialogOptions"));

        this._formDialog = new FormDialog(this, userOptions);
    },

    _getQuillContainer: function() {
        return this._$htmlContainer;
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "value":
                if(this._quillInstance) {
                    if(this._isEditorUpdating) {
                        this._isEditorUpdating = false;
                    } else {
                        const updatedValue = this._isMarkdownValue() ? this._updateValueByType("HTML", args.value) : args.value;
                        this._updateHtmlContent(updatedValue);
                    }
                } else {
                    this._$htmlContainer.html(args.value);
                }

                this._setSubmitValue(args.value);

                this.callBase(args);
                break;
            case "placeholder":
            case "variables":
            case "toolbar":
            case "mentions":
            case "customizeModules":
                this._invalidate();
                break;
            case "valueType": {
                this._prepareConverters();
                const newValue = this._updateValueByType(args.value);

                if(args.value === "html" && this._quillInstance) {
                    this._updateHtmlContent(newValue);
                } else {
                    this.option("value", newValue);
                }
                break;
            }
            case "readOnly":
            case "disabled":
                this.callBase(args);
                this._resetEnabledState();
                break;
            case "formDialogOptions":
                this._renderFormDialog();
                break;
            case "mediaResizing":
                if(!args.previousValue || !args.value) {
                    this._invalidate();
                } else {
                    this._quillInstance.getModule("resizing").option(args.name, args.value);
                }
                break;
            default:
                this.callBase(args);
        }
    },

    _updateHtmlContent: function(newMarkup) {
        const newDelta = this._quillInstance.clipboard.convert(newMarkup);
        this._quillInstance.setContents(newDelta);
    },

    _clean: function() {
        if(this._quillInstance) {
            this._quillInstance.off("text-change", this._textChangeHandlerWithContext);
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

    /**
    * @name dxHtmlEditorMethods.register
    * @publicName register(components)
    * @param1 modules:Object
    */
    register: function(components) {
        this._getRegistrator().registerModules(components);

        this.repaint();
    },

    /**
    * @name dxHtmlEditorMethods.get
    * @publicName get(componentPath)
    * @param1 componentPath:string
    * @return Object
    */
    get: function(modulePath) {
        return this._getRegistrator().getQuill().import(modulePath);
    },

    /**
    * @name dxHtmlEditorMethods.getQuillInstance
    * @publicName getQuillInstance()
    * @return Object
    */
    getQuillInstance: function() {
        return this._quillInstance;
    },

    /**
    * @name dxHtmlEditorMethods.getSelection
    * @publicName getSelection()
    * @return Object
    */
    getSelection: function() {
        return this._applyQuillMethod("getSelection");
    },

    /**
    * @name dxHtmlEditorMethods.setSelection
    * @publicName setSelection(index, length)
    * @param1 index:number
    * @param2 length:number
    */
    setSelection: function(index, length) {
        this._applyQuillMethod("setSelection", arguments);
    },

    /**
    * @name dxHtmlEditorMethods.format
    * @publicName format(formatName, formatValue)
    * @param1 formatName:string
    * @param2 formatValue:any
    */
    format: function(formatName, formatValue) {
        this._applyQuillMethod("format", arguments);
    },

    /**
    * @name dxHtmlEditorMethods.formatText
    * @publicName formatText(index, length, formatName, formatValue)
    * @param1 index:number
    * @param2 length:number
    * @param3 formatName:string
    * @param4 formatValue:any
    */
    /**
    * @name dxHtmlEditorMethods.formatText
    * @publicName formatText(index, length, formats)
    * @param1 index:number
    * @param2 length:number
    * @param3 formats:object
    */
    formatText: function(index, length, formatName, formatValue) {
        this._applyQuillMethod("formatText", arguments);
    },

    /**
    * @name dxHtmlEditorMethods.formatLine
    * @publicName formatLine(index, length, formatName, formatValue)
    * @param1 index:number
    * @param2 length:number
    * @param3 formatName:string
    * @param4 formatValue:any
    */
    /**
    * @name dxHtmlEditorMethods.formatLine
    * @publicName formatLine(index, length, formats)
    * @param1 index:number
    * @param2 length:number
    * @param3 formats:object
    */
    formatLine: function(index, length, formatName, formatValue) {
        this._applyQuillMethod("formatLine", arguments);
    },

    /**
    * @name dxHtmlEditorMethods.getFormat
    * @publicName getFormat(index, length)
    * @param1 index:number
    * @param2 length:number
    * @return Object
    */
    getFormat: function(index, length) {
        return this._applyQuillMethod("getFormat", arguments);
    },

    /**
    * @name dxHtmlEditorMethods.removeFormat
    * @publicName removeFormat(index, length)
    * @param1 index:number
    * @param2 length:number
    */
    removeFormat: function(index, length) {
        return this._applyQuillMethod("removeFormat", arguments);
    },

    /**
    * @name dxHtmlEditorMethods.clearHistory
    * @publicName clearHistory()
    */
    clearHistory: function() {
        this._applyQuillHistoryMethod("clear");
    },

    /**
    * @name dxHtmlEditorMethods.undo
    * @publicName undo()
    */
    undo: function() {
        this._applyQuillHistoryMethod("undo");

    },

    /**
    * @name dxHtmlEditorMethods.redo
    * @publicName redo()
    */
    redo: function() {
        this._applyQuillHistoryMethod("redo");

    },

    /**
    * @name dxHtmlEditorMethods.getLength
    * @publicName getLength()
    * @return number
    */
    getLength: function() {
        return this._applyQuillMethod("getLength");
    },

    /**
    * @name dxHtmlEditorMethods.delete
    * @publicName delete(index, length)
    * @param1 index:number
    * @param2 length:number
    */
    delete: function(index, length) {
        this._applyQuillMethod("deleteText", arguments);
    },

    /**
    * @name dxHtmlEditorMethods.insertText
    * @publicName insertText(index, text, formats)
    * @param1 index:number
    * @param2 text:string
    * @param3 formats:object
    */
    insertText: function(index, text, formats) {
        this._applyQuillMethod("insertText", arguments);
    },

    /**
    * @name dxHtmlEditorMethods.insertEmbed
    * @publicName insertEmbed(index, type, config)
    * @param1 index:number
    * @param2 type:string
    * @param3 config:any
    */
    insertEmbed: function(index, type, config) {
        this._applyQuillMethod("insertEmbed", arguments);
    },

    showFormDialog: function(formConfig) {
        return this._formDialog.show(formConfig);
    },

    formDialogOption: function(optionName, optionValue) {
        return this._formDialog.popupOption.apply(this._formDialog, arguments);
    },

    focus: function() {
        this.callBase();

        this._applyQuillMethod("focus");
    }
});

registerComponent("dxHtmlEditor", HtmlEditor);

module.exports = HtmlEditor;
