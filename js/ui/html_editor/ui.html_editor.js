import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isDefined } from "../../core/utils/type";
import { getPublicElement } from "../../core/utils/dom";
import registerComponent from "../../core/component_registrator";
import EmptyTemplate from "../widget/empty_template";
import Editor from "../editor/editor";
import Errors from "../widget/ui.errors";

import QuillRegistrator from "./quill_registrator";
import "./converters/delta";
import ConverterController from "./converterController";
import getWordMatcher from "./matchers/wordLists";

const HTML_EDITOR_CLASS = "dx-htmleditor";
const QUILL_CONTAINER_CLASS = "dx-quill-container";

const ANONYMOUS_TEMPLATE_NAME = "content";

const HtmlEditor = Editor.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxHtmlEditorOptions.valueType
            * @type Enums.HtmlEditorValueType
            * @default "HTML"
            */
            valueType: "HTML",
            /**
            * @name dxHtmlEditorOptions.placeholder
            * @type string
            * @default ""
            */
            placeholder: "",
            toolbar: null, // container, items
            mention: null,
            allowImageResizing: false,
            resizing: null
        });
    },

    _init: function() {
        this.callBase();

        this._quillRegistrator = new QuillRegistrator();
        this._prepareConverters();
    },

    _prepareConverters: function() {
        if(!this._deltaConverter) {
            const DeltaConverter = ConverterController.getConverter("delta");

            if(DeltaConverter) {
                this._deltaConverter = new DeltaConverter();
            } else {
                throw Errors.Error("E1050", "delta");
            }
        }

        if(this.option("valueType") === "Markdown" && !this._markdownConverter) {
            const MarkdownConverter = ConverterController.getConverter("markdown");

            if(MarkdownConverter) {
                this._markdownConverter = new MarkdownConverter();
            } else {
                throw Errors.Error("E1050", "markdown");
            }
        }
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["content"] = new EmptyTemplate(this);
    },

    _initMarkup: function() {
        let template = this._getTemplate("content");
        this._$htmlContainer = $("<div>").addClass(QUILL_CONTAINER_CLASS);

        this.$element()
            .addClass(HTML_EDITOR_CLASS)
            .wrapInner(this._$htmlContainer);

        template && template.render({
            container: getPublicElement(this._$htmlContainer),
            noModel: true
        });

        this.callBase();

        this._updateContainerMarkup();
    },

    _updateContainerMarkup: function() {
        let markup = this.option("value");

        if(this._isMarkdownValue()) {
            markup = this._markdownConverter.toHtml(markup);
        }

        if(markup) {
            this._$htmlContainer.html(markup);
        }
    },

    _render: function() {
        this._renderHtmlEditor();
        this.callBase();
    },

    _renderHtmlEditor: function() {
        const modulesConfig = this._getModulesConfig();

        this._quillInstance = this._quillRegistrator.createEditor(this._$htmlContainer[0], {
            placeholder: this.option("placeholder"),
            readOnly: this.option("readOnly") || this.option("disabled"),
            modules: modulesConfig,
            theme: "basic"
        });

        this._textChangeHandlerWithContext = this._textChangeHandler.bind(this);

        this._quillInstance.on("text-change", this._textChangeHandlerWithContext);
    },

    _getModulesConfig: function() {
        const wordListMatcher = getWordMatcher(this._quillRegistrator.getQuill());
        let modulesConfig = {
            mention: this._getModuleConfigByOption("mention"),
            toolbar: this._getToolbarConfig(),
            placeholder: this._getModuleConfigByOption("dataPlaceholder"),
            dropImage: this._getBaseModuleConfig(),
            clipboard: {
                matchers: [
                    ['p.MsoListParagraphCxSpFirst', wordListMatcher],
                    ['p.MsoListParagraphCxSpMiddle', wordListMatcher],
                    ['p.MsoListParagraphCxSpLast', wordListMatcher]
                ]
            }
        };

        if(this.option("allowImageResizing")) {
            modulesConfig.resizing = this._getBaseModuleConfig();
        }

        return modulesConfig;
    },

    _getToolbarConfig: function() {
        const toolbarConfig = this.option("toolbar");
        let resultConfig;

        if(Array.isArray(toolbarConfig)) {
            resultConfig = {
                editorInstance: this,
                items: toolbarConfig
            };
        } else {
            resultConfig = this._getModuleConfigByOption("toolbar");
        }

        return resultConfig;
    },

    _getModuleConfigByOption: function(userOptionName) {
        let userConfig = this.option(userOptionName);

        if(!isDefined(userConfig)) {
            return undefined;
        }

        return extend(this._getBaseModuleConfig(), userConfig);
    },

    _getBaseModuleConfig: function() {
        return { editorInstance: this };
    },

    _textChangeHandler: function(newDelta, oldDelta, source) {
        let delta = this._quillInstance.getContents(),
            htmlMarkup = this._deltaConverter.toHtml(delta.ops);

        this._isEditorUpdating = true;

        const value = this._isMarkdownValue() ? this._updateValueByType("Markdown", htmlMarkup) : htmlMarkup;

        this.option("value", value);
    },

    _updateValueByType: function(valueType, value) {
        const converter = this._markdownConverter;

        if(!isDefined(converter)) {
            return;
        }

        const currentValue = value || this.option("value");

        return valueType === "Markdown" ? converter.toMarkdown(currentValue) : converter.toHtml(currentValue);
    },

    _isMarkdownValue: function() {
        return this.option("valueType") === "Markdown";
    },

    _resetEnabledState: function() {
        if(this._quillInstance) {
            const isEnabled = !(this.option("readOnly") || this.option("disabled"));

            this._quillInstance.enable(isEnabled);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "value":
                if(!this._quillInstance) {
                    this._$htmlContainer.html(args.value);
                    return;
                }

                if(this._isEditorUpdating) {
                    delete this._isEditorUpdating;
                } else {
                    const updatedValue = this._isMarkdownValue() ? this._updateValueByType("HTML", args.value) : args.value;
                    const newDelta = this._quillInstance.clipboard.convert(updatedValue);

                    this._quillInstance.setContents(newDelta);
                }
                this.callBase(args);
                break;
            case "placeholder":
            case "mention":
            case "dataPlaceholder":
            case "allowImageResizing":
            case "resizing":
            case "toolbar":
                this._invalidate();
                break;
            case "valueType":
                this._prepareConverters();
                this.option("value", this._updateValueByType(args.value));
                break;
            case "readOnly":
            case "disabled":
                this.callBase(args);
                this._resetEnabledState();
                break;
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        if(this._quillInstance) {
            this._quillInstance.off("text-change", this._textChangeHandlerWithContext);
        }

        this.callBase();
    },

    /**
    * @name dxHtmlEditorMethods.registerModules
    * @publicName registerModules(modules)
    * @param1 modules:Object
    */
    registerModules: function(modules) {
        QuillRegistrator.registerModules(modules);
    },

    /**
    * @name dxHtmlEditorMethods.getSelection
    * @publicName getSelection()
    */
    getSelection: function() {
        if(this._quillInstance) {
            return this._quillInstance.getSelection();
        }
    },

    /**
    * @name dxHtmlEditorMethods.setSelection
    * @publicName setSelection(index, length)
    * @param1 index:number
    * @param2 length:number
    */
    setSelection: function(index, length) {
        if(this._quillInstance) {
            return this._quillInstance.setSelection(index, length);
        }
    },

    /**
    * @name dxHtmlEditorMethods.format
    * @publicName format(name, value)
    * @param1 name:string
    * @param2 value:any
    */
    format: function(name, value) {
        if(this._quillInstance) {
            return this._quillInstance.format(name, value);
        }
    },

    /**
    * @name dxHtmlEditorMethods.setSelection
    * @publicName setSelection(index, length)
    * @param1 index:number
    * @param2 length:number
    */
    removeFormat: function(index, length) {
        if(this._quillInstance) {
            return this._quillInstance.removeFormat(index, length);
        }
    }
});

registerComponent("dxHtmlEditor", HtmlEditor);

module.exports = HtmlEditor;
