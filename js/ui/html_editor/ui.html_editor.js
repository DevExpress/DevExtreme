import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isDefined } from "../../core/utils/type";
import { getPublicElement } from "../../core/utils/dom";
import registerComponent from "../../core/component_registrator";
import EmptyTemplate from "../widget/empty_template";
import Editor from "../editor/editor";

import QuillRegistrator from "./quill_registrator";
import DeltaConverter from "./converters/deltaConverter";
import MarkdownConverter from "./converters/markdownConverter";

const HTML_EDITOR_CLASS = "dx-htmleditor";

const ANONYMOUS_TEMPLATE_NAME = "content";

const HtmlEditor = Editor.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            valueType: "HTML",
            placeholder: "Type something",
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
        if(!this._quillDeltaConverter) {
            this._deltaConverter = new DeltaConverter();
        }

        if(this.option("valueType") === "Markdown" && !this._markdownConverter) {
            this._markdownConverter = new MarkdownConverter();
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
        this._$htmlContainer = $("<div>");

        this.$element()
            .addClass(HTML_EDITOR_CLASS)
            .wrapInner(this._$htmlContainer);

        template && template.render({
            container: getPublicElement(this._$htmlContainer),
            noModel: true
        });

        this.callBase();
    },

    _render: function() {
        let markup = this.option("value");

        if(this._isMarkdownValue()) {
            markup = this._markdownConverter.toHtml(markup);
        }

        if(markup) {
            this._$htmlContainer.html(markup);
        }

        this._renderHtmlEditor();
        this.callBase();
    },

    _renderHtmlEditor: function() {
        let that = this,
            modulesConfig = that._getModulesConfig();

        this._htmlEditor = this._quillRegistrator.createEditor(this._$htmlContainer[0], {
            placeholder: this.option("placeholder"),
            modules: modulesConfig,
            theme: "basic"
        });

        this._htmlEditor.on("text-change", function(newDelta, oldDelta, source) {
            let resultMarkup,
                delta = that._htmlEditor.getContents(),
                htmlMarkup = that._deltaConverter.toHtml(delta.ops);

            that._isEditorUpdating = true;

            if(that._isMarkdownValue()) {
                resultMarkup = that._updateValueByType("Markdown", htmlMarkup);
            } else {
                resultMarkup = htmlMarkup;
            }
            that.option("value", resultMarkup);
        });
    },

    _getModulesConfig: function() {
        let modulesConfig = extend({}, {
            mention: this._getModuleConfigByOption("mention"),
            toolbar: this._getToolbarConfig(),
            dataPlaceholders: this._getModuleConfigByOption("dataPlaceholders")
        });

        if(this.option("allowImageResizing")) {
            modulesConfig.resizing = { editorInstance: this };
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

        return extend({
            editorInstance: this
        }, userConfig);
    },

    _updateValueByType: function(valueType, value) {
        if(!isDefined(this._markdownConverter)) {
            return;
        }

        const currentValue = value || this.option("value");
        let updatedValue;

        if(valueType === "Markdown") {
            updatedValue = this._markdownConverter.toMarkdown(currentValue);
        } else {
            updatedValue = this._markdownConverter.toHtml(currentValue);
        }

        return updatedValue;
    },

    _isMarkdownValue: function() {
        return this.option("valueType") === "Markdown";
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "value":
                if(!this._htmlEditor) {
                    this._$htmlContainer.html(args.value);
                    return;
                }

                if(this._isEditorUpdating) {
                    delete this._isEditorUpdating;
                } else {
                    let updatedValue;

                    if(this._isMarkdownValue()) {
                        updatedValue = this._updateValueByType("HTML", args.value);
                    } else {
                        updatedValue = args.value;
                    }

                    let newDelta = this._htmlEditor.clipboard.convert(updatedValue);
                    this._htmlEditor.setContents(newDelta);
                }
                this.callBase(args);
                break;
            case "placeholder":
            case "mention":
            case "dataPlaceholders":
            case "allowImageResizing":
            case "resizing":
            case "toolbar":
                this._invalidate();
                break;
            case "valueType":
                this._prepareConverters();
                this.option("value", this._updateValueByType(args.value));
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxHtmlEditor", HtmlEditor);

module.exports = HtmlEditor;
