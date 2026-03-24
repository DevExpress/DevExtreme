/*!
* DevExtreme (dx.ai-integration.js)
* Version: 26.1.0
* Build date: Tue Mar 24 2026
*
* Copyright (c) 2012 - 2026 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 55390
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseCommand = void 0;
class BaseCommand {
  constructor(promptManager, requestManager) {
    this.promptManager = promptManager;
    this.requestManager = requestManager;
  }
  execute(params, callbacks) {
    const templateName = this.getTemplateName();
    const data = this.buildPromptData(params);
    const options = this.getBuildPromptOptions();
    const prompt = this.promptManager.buildPrompt(templateName, data, options);
    const requestManagerCallbacks = {
      onChunk: chunk => {
        var _callbacks$onChunk;
        callbacks === null || callbacks === void 0 || (_callbacks$onChunk = callbacks.onChunk) === null || _callbacks$onChunk === void 0 || _callbacks$onChunk.call(callbacks, chunk);
      },
      onComplete: result => {
        var _callbacks$onComplete;
        const finalResponse = this.parseResult(result, params);
        callbacks === null || callbacks === void 0 || (_callbacks$onComplete = callbacks.onComplete) === null || _callbacks$onComplete === void 0 || _callbacks$onComplete.call(callbacks, finalResponse);
      },
      onError: error => {
        var _callbacks$onError;
        callbacks === null || callbacks === void 0 || (_callbacks$onError = callbacks.onError) === null || _callbacks$onError === void 0 || _callbacks$onError.call(callbacks, error);
      }
    };
    const abort = this.requestManager.sendRequest(prompt, requestManagerCallbacks, params);
    return abort;
  }
  getBuildPromptOptions() {
    return {
      applyMetaTemplates: true
    };
  }
}
exports.BaseCommand = BaseCommand;

/***/ },

/***/ 5654
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ChangeStyleCommand = void 0;
var _base = __webpack_require__(55390);
class ChangeStyleCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'changeStyle';
  }
  buildPromptData(params) {
    return {
      system: {
        writingStyle: params.writingStyle
      },
      user: {
        text: params.text
      }
    };
  }
  parseResult(response) {
    return response;
  }
}
exports.ChangeStyleCommand = ChangeStyleCommand;

/***/ },

/***/ 16927
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ChangeToneCommand = void 0;
var _base = __webpack_require__(55390);
class ChangeToneCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'changeTone';
  }
  buildPromptData(params) {
    return {
      system: {
        tone: params.tone
      },
      user: {
        text: params.text
      }
    };
  }
  parseResult(response) {
    return response;
  }
}
exports.ChangeToneCommand = ChangeToneCommand;

/***/ },

/***/ 15436
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ExecuteCommand = void 0;
var _base = __webpack_require__(55390);
class ExecuteCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'execute';
  }
  buildPromptData(params) {
    return {
      user: {
        text: params.text
      }
    };
  }
  parseResult(response) {
    return response;
  }
}
exports.ExecuteCommand = ExecuteCommand;

/***/ },

/***/ 37887
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ExpandCommand = void 0;
var _base = __webpack_require__(55390);
class ExpandCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'expand';
  }
  buildPromptData(params) {
    return {
      user: {
        text: params.text
      }
    };
  }
  parseResult(response) {
    return response;
  }
}
exports.ExpandCommand = ExpandCommand;

/***/ },

/***/ 88890
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GenerateGridColumnCommand = void 0;
var _base = __webpack_require__(55390);
class GenerateGridColumnCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'generateGridColumn';
  }
  buildPromptData(params) {
    const dataDescription = this.generateDataDescription(params.data);
    return {
      user: {
        text: params.text,
        data: dataDescription
      }
    };
  }
  parseResult(response) {
    if (typeof response === 'string') {
      if (response === '') {
        return {
          data: {}
        };
      }
      return {
        data: JSON.parse(response)
      };
    }
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    return {
      data
    };
  }
  generateDataDescription(data) {
    const result = JSON.stringify(data);
    return result;
  }
}
exports.GenerateGridColumnCommand = GenerateGridColumnCommand;

/***/ },

/***/ 39171
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "BaseCommand", ({
  enumerable: true,
  get: function () {
    return _base.BaseCommand;
  }
}));
Object.defineProperty(exports, "ChangeStyleCommand", ({
  enumerable: true,
  get: function () {
    return _changeStyle.ChangeStyleCommand;
  }
}));
Object.defineProperty(exports, "ChangeToneCommand", ({
  enumerable: true,
  get: function () {
    return _changeTone.ChangeToneCommand;
  }
}));
Object.defineProperty(exports, "ExecuteCommand", ({
  enumerable: true,
  get: function () {
    return _execute.ExecuteCommand;
  }
}));
Object.defineProperty(exports, "ExpandCommand", ({
  enumerable: true,
  get: function () {
    return _expand.ExpandCommand;
  }
}));
Object.defineProperty(exports, "ProofreadCommand", ({
  enumerable: true,
  get: function () {
    return _proofread.ProofreadCommand;
  }
}));
Object.defineProperty(exports, "ShortenCommand", ({
  enumerable: true,
  get: function () {
    return _shorten.ShortenCommand;
  }
}));
Object.defineProperty(exports, "SmartPasteCommand", ({
  enumerable: true,
  get: function () {
    return _smartPaste.SmartPasteCommand;
  }
}));
Object.defineProperty(exports, "SummarizeCommand", ({
  enumerable: true,
  get: function () {
    return _summarize.SummarizeCommand;
  }
}));
Object.defineProperty(exports, "TranslateCommand", ({
  enumerable: true,
  get: function () {
    return _translate.TranslateCommand;
  }
}));
var _base = __webpack_require__(55390);
var _changeStyle = __webpack_require__(5654);
var _changeTone = __webpack_require__(16927);
var _execute = __webpack_require__(15436);
var _expand = __webpack_require__(37887);
var _proofread = __webpack_require__(11121);
var _shorten = __webpack_require__(36050);
var _smartPaste = __webpack_require__(32067);
var _summarize = __webpack_require__(15162);
var _translate = __webpack_require__(37025);

/***/ },

/***/ 11121
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ProofreadCommand = void 0;
var _base = __webpack_require__(55390);
class ProofreadCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'proofread';
  }
  buildPromptData(params) {
    return {
      user: {
        text: params.text
      }
    };
  }
  parseResult(response) {
    return response;
  }
}
exports.ProofreadCommand = ProofreadCommand;

/***/ },

/***/ 36050
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShortenCommand = void 0;
var _base = __webpack_require__(55390);
class ShortenCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'shorten';
  }
  buildPromptData(params) {
    return {
      user: {
        text: params.text
      }
    };
  }
  parseResult(response) {
    return response;
  }
}
exports.ShortenCommand = ShortenCommand;

/***/ },

/***/ 32067
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SmartPasteCommand = void 0;
var _color = _interopRequireDefault(__webpack_require__(43101));
var _ui = _interopRequireDefault(__webpack_require__(35185));
var _base = __webpack_require__(55390);
var _date = __webpack_require__(55594);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class SmartPasteCommand extends _base.BaseCommand {
  static toTyped(values, desiredType, fieldName) {
    const errorValue = JSON.stringify(values);
    const single = values.length <= 1 ? values[0] : undefined;
    const arr = values.length > 1 ? values : undefined;
    if (!single && !arr) {
      return undefined;
    }
    switch (desiredType) {
      case 'color':
        {
          if (new _color.default(single).colorIsInvalid) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'color');
          }
          return single;
        }
      case 'boolean':
        {
          if (single === 'true') return true;
          if (single === 'false') return false;
          throw _ui.default.Error('E1064', fieldName, errorValue, 'boolean');
        }
      case 'string':
        {
          if (!single) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'string');
          }
          return single;
        }
      case 'stringArray':
        {
          if (!arr) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'string array');
          }
          return arr;
        }
      case 'number':
        {
          if (single === undefined || !Number.isFinite(parseFloat(single))) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'number');
          }
          return parseFloat(single);
        }
      case 'numberRange':
        {
          if (!arr || arr.length > 2) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'number range');
          }
          const numbers = arr.map(v => parseFloat(v));
          if (!numbers.every(Number.isFinite)) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'number range');
          }
          return [numbers[0], numbers[1]];
        }
      case 'date':
        {
          if (!_date.dateUtilsTs.isValidDate(single)) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'date');
          }
          return new Date(single);
        }
      case 'dateRange':
        {
          if (!arr || arr.length > 2 || !arr.every(_date.dateUtilsTs.isValidDate)) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'date range');
          }
          return arr.map(v => new Date(v));
        }
      default:
        return arr ?? single;
    }
  }
  getTemplateName() {
    return 'smartPaste';
  }
  buildPromptData(params) {
    const fieldsInstructions = this.generateFieldsInstructions(params.fields);
    return {
      user: {
        text: params.text,
        fields: fieldsInstructions
      }
    };
  }
  parseResult(response, params) {
    const result = [];
    response.split(';;;').forEach(data => {
      if (!data) {
        return;
      }
      const [name, ...rawValues] = data.split(':::');
      const values = rawValues.map(value => value.trim());
      const fieldParams = params.fields.find(v => v.name === name);
      const value = SmartPasteCommand.toTyped(values, fieldParams === null || fieldParams === void 0 ? void 0 : fieldParams.type, fieldParams === null || fieldParams === void 0 ? void 0 : fieldParams.name);
      if (value) {
        result.push({
          name,
          value
        });
      }
    });
    return result;
  }
  generateFieldsInstructions(fields) {
    const fieldData = fields.map(field => {
      const instruction = field.instruction ?? '';
      return `fieldName: ${field.name}, format: ${field.format}${instruction ? `, instruction: ${instruction}` : ''}`;
    });
    return fieldData.join(';;;');
  }
}
exports.SmartPasteCommand = SmartPasteCommand;

/***/ },

/***/ 15162
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SummarizeCommand = void 0;
var _base = __webpack_require__(55390);
class SummarizeCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'summarize';
  }
  buildPromptData(params) {
    return {
      user: {
        text: params.text
      }
    };
  }
  parseResult(response) {
    return response;
  }
}
exports.SummarizeCommand = SummarizeCommand;

/***/ },

/***/ 37025
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TranslateCommand = void 0;
var _base = __webpack_require__(55390);
class TranslateCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'translate';
  }
  getBuildPromptOptions() {
    return {
      applyMetaTemplates: false
    };
  }
  buildPromptData(params) {
    return {
      system: {
        lang: params.lang
      },
      user: {
        text: params.text
      }
    };
  }
  parseResult(response) {
    return response;
  }
}
exports.TranslateCommand = TranslateCommand;

/***/ },

/***/ 49691
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CommandNames = exports.COMMANDS = exports.AIIntegration = void 0;
var _index = __webpack_require__(39171);
var _prompt_manager = __webpack_require__(76542);
var _request_manager = __webpack_require__(17083);
var _generateGridColumn = __webpack_require__(88890);
var CommandNames;
(function (CommandNames) {
  CommandNames["ChangeStyle"] = "changeStyle";
  CommandNames["ChangeTone"] = "changeTone";
  CommandNames["Execute"] = "execute";
  CommandNames["Expand"] = "expand";
  CommandNames["Proofread"] = "proofread";
  CommandNames["Shorten"] = "shorten";
  CommandNames["Summarize"] = "summarize";
  CommandNames["Translate"] = "translate";
  CommandNames["SmartPaste"] = "smartPaste";
  CommandNames["GenerateGridColumn"] = "generateGridColumn";
})(CommandNames || (exports.CommandNames = CommandNames = {}));
const COMMANDS = exports.COMMANDS = {
  [CommandNames.ChangeStyle]: _index.ChangeStyleCommand,
  [CommandNames.ChangeTone]: _index.ChangeToneCommand,
  [CommandNames.Execute]: _index.ExecuteCommand,
  [CommandNames.Expand]: _index.ExpandCommand,
  [CommandNames.Proofread]: _index.ProofreadCommand,
  [CommandNames.Shorten]: _index.ShortenCommand,
  [CommandNames.Summarize]: _index.SummarizeCommand,
  [CommandNames.Translate]: _index.TranslateCommand,
  [CommandNames.SmartPaste]: _index.SmartPasteCommand,
  [CommandNames.GenerateGridColumn]: _generateGridColumn.GenerateGridColumnCommand
};
class AIIntegration {
  constructor(provider, options) {
    this.promptManager = new _prompt_manager.PromptManager({
      lang: options === null || options === void 0 ? void 0 : options.lang
    });
    this.requestManager = new _request_manager.RequestManager(provider);
    this.commands = new Map();
  }
  executeCommand(commandName, params, callbacks) {
    let command = this.commands.get(commandName);
    if (!command) {
      const Command = COMMANDS[commandName];
      command = new Command(this.promptManager, this.requestManager);
      this.commands.set(commandName, command);
    }
    return command.execute(params, callbacks);
  }
  changeStyle(params, callbacks) {
    return this.executeCommand(CommandNames.ChangeStyle, params, callbacks);
  }
  changeTone(params, callbacks) {
    return this.executeCommand(CommandNames.ChangeTone, params, callbacks);
  }
  execute(params, callbacks) {
    return this.executeCommand(CommandNames.Execute, params, callbacks);
  }
  expand(params, callbacks) {
    return this.executeCommand(CommandNames.Expand, params, callbacks);
  }
  proofread(params, callbacks) {
    return this.executeCommand(CommandNames.Proofread, params, callbacks);
  }
  shorten(params, callbacks) {
    return this.executeCommand(CommandNames.Shorten, params, callbacks);
  }
  summarize(params, callbacks) {
    return this.executeCommand(CommandNames.Summarize, params, callbacks);
  }
  translate(params, callbacks) {
    return this.executeCommand(CommandNames.Translate, params, callbacks);
  }
  smartPaste(params, callbacks) {
    return this.executeCommand(CommandNames.SmartPaste, params, callbacks);
  }
  generateGridColumn(params, callbacks) {
    return this.executeCommand(CommandNames.GenerateGridColumn, params, callbacks);
  }
}
exports.AIIntegration = AIIntegration;

/***/ },

/***/ 76542
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PromptManager = exports.LANG_TEMPLATE_NAME = exports.ERROR_MESSAGES = void 0;
var _index = __webpack_require__(31764);
const ERROR_MESSAGES = exports.ERROR_MESSAGES = {
  TEMPLATE_NOT_FOUND: 'Template not found'
};
const LANG_TEMPLATE_NAME = exports.LANG_TEMPLATE_NAME = 'addLanguage';
class PromptManager {
  constructor(options) {
    this.templates = new Map(Object.entries(_index.templates));
    this.metaTemplates = new Map(Object.entries(_index.metaTemplates));
    this.lang = options === null || options === void 0 ? void 0 : options.lang;
  }
  buildPrompt(templateName, data, options) {
    const template = this.templates.get(templateName);
    const langTemplate = this.metaTemplates.get(LANG_TEMPLATE_NAME);
    if (!template) {
      throw new Error(ERROR_MESSAGES.TEMPLATE_NOT_FOUND);
    }
    const baseSystem = this.generateMessage(template.system, data.system);
    const system = options.applyMetaTemplates && this.lang && langTemplate ? this.generateMessage(langTemplate.system, {
      message: baseSystem ?? '',
      lang: this.lang
    }) : baseSystem;
    const user = this.generateMessage(template.user, data.user);
    const prompt = {
      system,
      user
    };
    return prompt;
  }
  generateMessage(promptTemplate, placeholders) {
    if (!placeholders && !promptTemplate) {
      return undefined;
    }
    if (!promptTemplate && placeholders) {
      return Object.keys(placeholders).reduce((acc, key) => `${acc} ${placeholders[key]}`, '').trim();
    }
    if (!placeholders && promptTemplate) {
      return promptTemplate;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = this.replacePlaceholders(promptTemplate, placeholders);
    return result;
  }
  replacePlaceholders(promptTemplate, placeholders) {
    const result = Object.entries(placeholders).reduce(
    // @ts-expect-error 'replaceAll' does not exist on type 'string'
    (acc, _ref) => {
      let [key, value] = _ref;
      return acc.replaceAll(`{{${key}}}`, value);
    }, promptTemplate);
    return result;
  }
}
exports.PromptManager = PromptManager;

/***/ },

/***/ 17083
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RequestManager = void 0;
var _errors = _interopRequireDefault(__webpack_require__(87129));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class RequestManager {
  constructor(provider) {
    this.provider = provider;
    this.validateProvider();
  }
  validateProvider() {
    if (typeof this.provider.sendRequest !== 'function') {
      throw _errors.default.Error('E0122');
    }
  }
  sendRequest(prompt, callbacks, data) {
    let aborted = false;
    const params = {
      prompt,
      data,
      onChunk: chunk => {
        if (!aborted) {
          var _callbacks$onChunk;
          callbacks === null || callbacks === void 0 || (_callbacks$onChunk = callbacks.onChunk) === null || _callbacks$onChunk === void 0 || _callbacks$onChunk.call(callbacks, chunk);
        }
      }
    };
    const {
      promise,
      abort: abortRequest
    } = this.provider.sendRequest(params);
    promise.then(response => {
      if (!aborted) {
        var _callbacks$onComplete;
        callbacks === null || callbacks === void 0 || (_callbacks$onComplete = callbacks.onComplete) === null || _callbacks$onComplete === void 0 || _callbacks$onComplete.call(callbacks, response);
      }
    }).catch(e => {
      if (!aborted) {
        var _callbacks$onError;
        callbacks === null || callbacks === void 0 || (_callbacks$onError = callbacks.onError) === null || _callbacks$onError === void 0 || _callbacks$onError.call(callbacks, e);
      }
    });
    const abort = () => {
      aborted = true;
      abortRequest === null || abortRequest === void 0 || abortRequest();
    };
    return abort;
  }
}
exports.RequestManager = RequestManager;

/***/ },

/***/ 31764
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.templates = exports.metaTemplates = void 0;
const metaTemplates = exports.metaTemplates = {
  addLanguage: {
    system: '{{message}} Provide an answer in {{lang}} language.'
  }
};
const templates = exports.templates = {
  changeStyle: {
    system: 'Rewrite the text provided to match the {{writingStyle}} writing style. Ensure the rewritten text follows the grammatical rules and stylistic conventions of the specified style. Preserve the original meaning and context. Use complete sentences and a professional tone. Return answer with no markdown formatting.'
  },
  changeTone: {
    system: 'Rewrite the following text to keep its original meaning but change its tone to {{tone}}. Provide only the rewritten text as plain text without any comments or formatting.'
  },
  execute: {
    system: 'Return answer with no markdown formatting.'
  },
  expand: {
    system: 'Expand the following text by adding relevant details, examples, and context while keeping the main point intact. Ensure the expanded text is coherent and logically structured. Return answer with no markdown formatting.'
  },
  proofread: {
    system: 'Proofread the following text for grammar, punctuation, and style errors. Make corrections to ensure clarity and conciseness while preserving the original meaning. Use a formal writing style unless otherwise specified. Return only the revised text without any formatting or explanations.'
  },
  shorten: {
    system: 'Please shorten the text provided by summarizing its content while retaining the main point and essential details. Aim to reduce the text to approximately 50% of its original length. Ensure that the key message remains clear and intact. Return answer with no markdown formatting.'
  },
  summarize: {
    system: 'First, identify the key points of the provided text. Then, generate an abstractive summary by paraphrasing these points, ensuring the summary captures the core ideas and is approximately 20% of the text\'s length. Return answer with no markdown formatting.'
  },
  translate: {
    system: 'Translate the text provided into {{lang}}. Ensure the translation retains the original meaning and tone. Provide only the translated text in your response, without any additional formatting or commentary.'
  },
  smartPaste: {
    system: 'You are a helpful assistant that helps to fill fields based on the text provided. You will get a text and a list of fields that should be filled using info from the text. It can include the name of field, suitable format, optionally some additional instruction about what it should include. You need to return data for all the fields in the following format without any preamble, introduction, or explanatory text: {fieldName}:::{fieldValue};;;{fieldName}:::{fieldValue} and so on, where {fieldName} - is a variable for a field name and {fieldValue} - is a variable for a string to fill. If there is no info to fill, field value should be empty (like Name:::;;;)- do not use placeholders like (empty), N/A, null, or similar. Only fill in date fields if a complete date is explicitly present. If the date is missing or incomplete, leave the field empty.',
    user: 'Text: {{text}}. Fields: {{fields}}.'
  },
  generateGridColumn: {
    system: 'You are a helpful AI assistant that generates values for a new column in a dataset, based on a given user instruction and existing row data. Input: A user prompt that describes what should be generated. A dataset in the format: { "rowKey1": {column1: value1, column2: value2, ...}, "rowKey2": {...}, ... }. Task: Generate a single value for each row that satisfies the user\'s prompt, using the provided row data as context. Instructions: Output your result strictly in this format: { "rowKey1": "generatedValue1", "rowKey2": "generatedValue2", ... }. The output must be a valid JSON string, directly parsable by JSON.parse. Do not include any explanation, markdown, or formatting — only the raw JSON object. If a value cannot be generated for a specific row, assign an empty string ("") for that row. Example Output: { "rowKey1": "valueA", "rowKey2": "" }. You must follow this output format exactly. Any deviation will result in a parsing error.',
    user: 'User prompt text: {{text}}. Dataset: {{data}}.'
  }
};

/***/ },

/***/ 5583
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _error = _interopRequireDefault(__webpack_require__(67264));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports["default"] = (0, _error.default)({
  E0001: 'Method is not implemented',
  E0002: 'Member name collision: {0}',
  E0003: 'A class must be instantiated using the \'new\' keyword',
  E0004: 'The NAME property of the component is not specified',
  E0005: 'Unknown device',
  E0006: 'Unknown endpoint key is requested',
  E0007: '\'Invalidate\' method is called outside the update transaction',
  E0008: 'Type of the option name is not appropriate to create an action',
  E0009: 'Component \'{0}\' has not been initialized for an element',
  E0010: 'Animation configuration with the \'{0}\' type requires \'{1}\' configuration as {2}',
  E0011: 'Unknown animation type \'{0}\'',
  E0012: 'jQuery version is too old. Please upgrade jQuery to 1.10.0 or later',
  E0013: 'KnockoutJS version is too old. Please upgrade KnockoutJS to 2.3.0 or later',
  E0014: 'The \'release\' method shouldn\'t be called for an unlocked Lock object',
  E0015: 'Queued task returned an unexpected result',
  E0017: 'Event namespace is not defined',
  E0018: 'DevExpress.ui.DevExpressPopup widget is required',
  E0020: 'Template engine \'{0}\' is not supported',
  E0021: 'Unknown theme is set: {0}',
  E0022: 'LINK[rel=DevExpress-theme] tags must go before DevExpress included scripts',
  E0023: 'Template name is not specified',
  E0024: 'DevExtreme bundle already included',
  E0025: 'Unexpected argument type',
  E0100: 'Unknown validation type is detected',
  E0101: 'Misconfigured range validation rule is detected',
  E0102: 'Misconfigured comparison validation rule is detected',
  E0103: 'validationCallback of an asynchronous rule should return a jQuery or a native promise',
  E0110: 'Unknown validation group is detected',
  E0120: 'Adapter for a DevExpressValidator component cannot be configured',
  E0121: 'The \'customItem\' parameter of the \'onCustomItemCreating\' function is empty or contains invalid data. Assign a custom object or a Promise that is resolved after the item is created.',
  E0122: 'AIIntegration: The sendRequest method is missing.',
  W0000: '\'{0}\' is deprecated in {1}. {2}',
  W0001: '{0} - \'{1}\' option is deprecated in {2}. {3}',
  W0002: '{0} - \'{1}\' method is deprecated in {2}. {3}',
  W0003: '{0} - \'{1}\' property is deprecated in {2}. {3}',
  W0004: 'Timeout for theme loading is over: {0}',
  W0005: '\'{0}\' event is deprecated in {1}. {2}',
  W0006: 'Invalid recurrence rule: \'{0}\'',
  W0007: '\'{0}\' Globalize culture is not defined',
  W0008: 'Invalid view type: {0}',
  W0009: 'Invalid time zone name: \'{0}\'',
  W0010: '{0} is deprecated in {1}. {2}',
  W0011: 'Number parsing is invoked while the parser is not defined',
  W0012: 'Date parsing is invoked while the parser is not defined',
  W0013: '\'{0}\' file is deprecated in {1}. {2}',
  W0014: '{0} - \'{1}\' type is deprecated in {2}. {3}',
  W0015: 'Instead of returning a value from the \'{0}\' function, write it into the \'{1}\' field of the function\'s parameter.',
  W0016: 'The "{0}" option does not accept the "{1}" value since v{2}. {3}.',
  W0017: 'Setting the "{0}" property with a function is deprecated since v21.2',
  W0018: 'Setting the "position" property with a function is deprecated since v21.2',
  W0019: 'DevExtreme: Unable to Locate a Valid License Key.\n\n' + 'Detailed license/registration related information and instructions: https://js.devexpress.com/Documentation/Licensing/.\n\n' + 'If you are using a 30-day trial version of DevExtreme, you must uninstall all copies of DevExtreme once your 30-day trial period expires. For terms and conditions that govern use of DevExtreme UI components/libraries, please refer to the DevExtreme End User License Agreement: https://js.devexpress.com/EULAs/DevExtremeComplete.\n\n' + 'To use DevExtreme in a commercial project, you must purchase a license. For pricing/licensing options, please visit: https://js.devexpress.com/Buy.\n\n' + 'If you have licensing-related questions or need help with a purchase, please email clientservices@devexpress.com.\n\n',
  W0020: 'DevExtreme: License Key Has Expired.\n\n' + 'Detailed license/registration related information and instructions: https://js.devexpress.com/Documentation/Licensing/.\n\n' + 'A mismatch exists between the license key used and the DevExtreme version referenced in this project.\n\n' + 'To proceed, you can:\n' + '• use a version of DevExtreme linked to your license key: https://www.devexpress.com/ClientCenter/DownloadManager\n' + '• renew your DevExpress Subscription: https://www.devexpress.com/buy/renew (once you renew your subscription, you will be entitled to product updates and support service as defined in the DevExtreme End User License Agreement)\n\n' + 'If you have licensing-related questions or need help with a renewal, please email clientservices@devexpress.com.\n\n',
  W0021: 'DevExtreme: License Key Verification Has Failed.\n\n' + 'Detailed license/registration related information and instructions: https://js.devexpress.com/Documentation/Licensing/.\n\n' + 'To verify your DevExtreme license, make certain to specify a correct key in the GlobalConfig. If you continue to encounter this error, please visit https://www.devexpress.com/ClientCenter/DownloadManager to obtain a valid license key.\n\n' + 'If you have a valid license and this problem persists, please submit a support ticket via the DevExpress Support Center. We will be happy to follow-up: https://supportcenter.devexpress.com/ticket/create.\n\n',
  W0022: 'DevExtreme: Pre-release software. Not suitable for commercial use.\n\n' + 'Detailed license/registration related information and instructions: https://js.devexpress.com/Documentation/Licensing/.\n\n' + 'Pre-release software may contain deficiencies and as such, should not be considered for use or integrated in any mission critical application.\n\n',
  W0023: 'DevExtreme: the following \'devextreme\' package version does not match versions of other DevExpress products used in this application:\n\n' + '{0}\n\n' + 'Interoperability between different versions of the products listed herein cannot be guaranteed.\n\n',
  W0024: 'DevExtreme: Use Your DevExtreme License Key - Not Your DevExpress .NET License Key\n\n' + 'Invalid/incorrect license key. You used your DevExpress .NET license key instead of your DevExtreme (React, Angular, Vue, JS) license key. Please copy your DevExtreme license key and try again. \n\n' + 'Go to https://www.devexpress.com/ClientCenter/DownloadManager (navigate to the DevExtreme Subscription section) to obtain a valid DevExtreme license key. To validate your license, specify the correct key within GlobalConfig.\n\n' + 'For detailed license/registration information, visit https://js.devexpress.com/Documentation/Licensing/.\n\n' + 'If you have a valid license and the issue persists, submit a support ticket via the DevExpress Support Center. We will be happy to follow-up: https://supportcenter.devexpress.com/ticket/create.\n\n'
});

/***/ },

/***/ 55594
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dateUtilsTs = void 0;
const addOffsets = function (date) {
  for (var _len = arguments.length, offsets = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    offsets[_key - 1] = arguments[_key];
  }
  const newDateMs = offsets.reduce((result, offset) => result + offset, date.getTime());
  return new Date(newDateMs);
};
const isValidDate = date => Boolean(date && !isNaN(new Date(date).valueOf()));
const dateUtilsTs = exports.dateUtilsTs = {
  addOffsets,
  isValidDate
};

/***/ },

/***/ 35005
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.logger = exports["default"] = exports.debug = void 0;
var _type = __webpack_require__(11528);
/* global console */
/* eslint no-console: off */

const noop = function () {};
const getConsoleMethod = function (method) {
  if (typeof console === 'undefined' || !(0, _type.isFunction)(console[method])) {
    return noop;
  }
  return console[method].bind(console);
};
const logger = exports.logger = {
  log: getConsoleMethod('log'),
  info: getConsoleMethod('info'),
  warn: getConsoleMethod('warn'),
  error: getConsoleMethod('error')
};
const debug = exports.debug = function () {
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
  function assertParam(parameter, message) {
    assert(parameter !== null && parameter !== undefined, message);
  }
  return {
    assert,
    assertParam
  };
}();
var _default = exports["default"] = {
  logger,
  debug
};

/***/ },

/***/ 40818
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
exports.error = error;
var _extend = __webpack_require__(52576);
var _string = __webpack_require__(54497);
var _version = __webpack_require__(1956);
var _m_console = _interopRequireDefault(__webpack_require__(35005));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* eslint-disable import/no-commonjs */

const ERROR_URL = `https://js.devexpress.com/error/${_version.version.split('.').slice(0, 2).join('_')}/`;
function error(baseErrors, errors) {
  const exports = {
    ERROR_MESSAGES: (0, _extend.extend)(errors, baseErrors),
    // eslint-disable-next-line object-shorthand
    Error: function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return makeError(args);
    },
    log() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      const id = args[0];
      let method = 'log';
      if (/^E\d+$/.test(id)) {
        method = 'error';
      } else if (/^W\d+$/.test(id)) {
        method = 'warn';
      }
      _m_console.default.logger[method](method === 'log' ? id : combineMessage(args));
    }
  };
  function combineMessage(args) {
    const id = args[0];
    args = args.slice(1);
    return formatMessage(id, formatDetails(id, args));
  }
  function formatDetails(id, args) {
    args = [exports.ERROR_MESSAGES[id]].concat(args);
    return _string.format.apply(this, args).replace(/\.*\s*?$/, '');
  }
  function formatMessage(id, details) {
    const kind = id !== null && id !== void 0 && id.startsWith('W') ? 'warning' : 'error';
    return _string.format.apply(this, ['{0} - {1}.\n\nFor additional information on this {2} message, see: {3}', id, details, kind, getErrorUrl(id)]);
  }
  function makeError(args) {
    const id = args[0];
    args = args.slice(1);
    const details = formatDetails(id, args);
    const url = getErrorUrl(id);
    const message = formatMessage(id, details);
    return (0, _extend.extend)(new Error(message), {
      __id: id,
      __details: details,
      url
    });
  }
  function getErrorUrl(id) {
    return ERROR_URL + id;
  }
  return exports;
}
var _default = exports["default"] = error;

/***/ },

/***/ 96298
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.extendFromObject = exports.extend = void 0;
var _type = __webpack_require__(11528);
const extendFromObject = function (target, source, overrideExistingValues) {
  target = target || {};
  for (const prop in source) {
    if (Object.prototype.hasOwnProperty.call(source, prop)) {
      const value = source[prop];
      if (!(prop in target) || overrideExistingValues) {
        target[prop] = value;
      }
    }
  }
  return target;
};
exports.extendFromObject = extendFromObject;
const extend = function (target) {
  target = target || {};
  let i = 1;
  let deep = false;
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i++;
  }
  for (; i < arguments.length; i++) {
    const source = arguments[i];
    if (source == null) {
      continue;
    }
    for (const key in source) {
      const targetValue = target[key];
      const sourceValue = source[key];
      let sourceValueIsArray = false;
      let clone;
      if (key === '__proto__' || key === 'constructor' || target === sourceValue) {
        continue;
      }
      if (deep && sourceValue && ((0, _type.isPlainObject)(sourceValue)
      // eslint-disable-next-line no-cond-assign
      || (sourceValueIsArray = Array.isArray(sourceValue)))) {
        if (sourceValueIsArray) {
          clone = targetValue && Array.isArray(targetValue) ? targetValue : [];
        } else {
          clone = targetValue && (0, _type.isPlainObject)(targetValue) ? targetValue : {};
        }
        target[key] = extend(deep, clone, sourceValue);
      } else if (sourceValue !== undefined) {
        target[key] = sourceValue;
      }
    }
  }
  return target;
};
exports.extend = extend;

/***/ },

/***/ 32527
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.encodeHtml = void 0;
exports.format = format;
exports.quadToObject = exports.isEmpty = void 0;
var _type = __webpack_require__(11528);
const encodeHtml = exports.encodeHtml = function () {
  const encodeRegExp = [new RegExp('&', 'g'), new RegExp('"', 'g'), new RegExp('\'', 'g'), new RegExp('<', 'g'), new RegExp('>', 'g')];
  return function (str) {
    return String(str).replace(encodeRegExp[0], '&amp;').replace(encodeRegExp[1], '&quot;').replace(encodeRegExp[2], '&#39;').replace(encodeRegExp[3], '&lt;').replace(encodeRegExp[4], '&gt;');
  };
}();
const splitQuad = function (raw) {
  switch (typeof raw) {
    case 'string':
      return raw.split(/\s+/, 4);
    case 'object':
      return [raw.x || raw.h || raw.left, raw.y || raw.v || raw.top, raw.x || raw.h || raw.right, raw.y || raw.v || raw.bottom];
    case 'number':
      return [raw];
    default:
      return raw;
  }
};
const quadToObject = function (raw) {
  const quad = splitQuad(raw);
  let left = parseInt(quad && quad[0], 10);
  let top = parseInt(quad && quad[1], 10);
  let right = parseInt(quad && quad[2], 10);
  let bottom = parseInt(quad && quad[3], 10);
  if (!isFinite(left)) {
    left = 0;
  }
  if (!isFinite(top)) {
    top = left;
  }
  if (!isFinite(right)) {
    right = left;
  }
  if (!isFinite(bottom)) {
    bottom = top;
  }
  return {
    top,
    right,
    bottom,
    left
  };
};
exports.quadToObject = quadToObject;
function format(template) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }
  if ((0, _type.isFunction)(template)) {
    return template(...values);
  }
  values.forEach((value, index) => {
    if ((0, _type.isString)(value)) {
      value = value.replace(/\$/g, '$$$$');
    }
    const placeholderReg = new RegExp(`\\{${index}\\}`, 'gm');
    template = template.replace(placeholderReg, value);
  });
  return template;
}
const isEmpty = exports.isEmpty = function () {
  const SPACE_REGEXP = /\s/g;
  return function (text) {
    return !text || !text.replace(SPACE_REGEXP, '');
  };
}();

/***/ },

/***/ 39918
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.type = exports.isWindow = exports.isString = exports.isRenderer = exports.isPromise = exports.isPrimitive = exports.isPlainObject = exports.isObject = exports.isNumeric = exports.isFunction = exports.isExponential = exports.isEvent = exports.isEmptyObject = exports.isDefined = exports.isDeferred = exports.isDate = exports.isBoolean = exports["default"] = void 0;
const types = {
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object Object]': 'object',
  '[object String]': 'string'
};
const type = function (object) {
  if (object === null) {
    return 'null';
  }
  const typeOfObject = Object.prototype.toString.call(object);
  return typeof object === 'object' ? types[typeOfObject] || 'object' : typeof object;
};
exports.type = type;
const isBoolean = function (object) {
  return typeof object === 'boolean';
};
exports.isBoolean = isBoolean;
const isExponential = function (value) {
  return isNumeric(value) && value.toString().indexOf('e') !== -1;
};
exports.isExponential = isExponential;
const isDate = function (object) {
  return type(object) === 'date';
};
exports.isDate = isDate;
const isDefined = function (object) {
  return object !== null && object !== undefined;
};
exports.isDefined = isDefined;
const isFunction = function (object) {
  return typeof object === 'function';
};
exports.isFunction = isFunction;
const isString = function (object) {
  return typeof object === 'string';
};
exports.isString = isString;
const isNumeric = function (object) {
  return typeof object === 'number' && isFinite(object) || !isNaN(object - parseFloat(object));
};
exports.isNumeric = isNumeric;
const isObject = function (object) {
  return type(object) === 'object';
};
exports.isObject = isObject;
const isEmptyObject = function (object) {
  let property;
  // eslint-disable-next-line no-unreachable-loop
  for (property in object) {
    return false;
  }
  return true;
};
exports.isEmptyObject = isEmptyObject;
const isPlainObject = function (object) {
  if (!object || type(object) !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(object);
  if (!proto) {
    return true;
  }
  const ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof ctor === 'function' && Object.toString.call(ctor) === Object.toString.call(Object);
};
exports.isPlainObject = isPlainObject;
const isPrimitive = function (value) {
  return !['object', 'array', 'function'].includes(type(value));
};
exports.isPrimitive = isPrimitive;
const isWindow = function (object) {
  return object != null && object === object.window;
};
exports.isWindow = isWindow;
const isRenderer = function (object) {
  return !!object && !!(object.jquery || object.dxRenderer);
};
exports.isRenderer = isRenderer;
const isPromise = function (object) {
  return !!object && isFunction(object.then);
};
exports.isPromise = isPromise;
const isDeferred = function (object) {
  return !!object && isFunction(object.done) && isFunction(object.fail);
};
exports.isDeferred = isDeferred;
const isEvent = function (object) {
  return !!(object && object.preventDefault);
};
exports.isEvent = isEvent;
var _default = exports["default"] = {
  isBoolean,
  isDate,
  isDeferred,
  isDefined,
  isEmptyObject,
  isEvent,
  isExponential,
  isFunction,
  isNumeric,
  isObject,
  isPlainObject,
  isPrimitive,
  isPromise,
  isRenderer,
  isString,
  isWindow,
  type
};

/***/ },

/***/ 54699
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
/* eslint-disable spellcheck/spell-checker */
const standardColorNames = {
  aliceblue: 'f0f8ff',
  antiquewhite: 'faebd7',
  aqua: '00ffff',
  aquamarine: '7fffd4',
  azure: 'f0ffff',
  beige: 'f5f5dc',
  bisque: 'ffe4c4',
  black: '000000',
  blanchedalmond: 'ffebcd',
  blue: '0000ff',
  blueviolet: '8a2be2',
  brown: 'a52a2a',
  burlywood: 'deb887',
  cadetblue: '5f9ea0',
  chartreuse: '7fff00',
  chocolate: 'd2691e',
  coral: 'ff7f50',
  cornflowerblue: '6495ed',
  cornsilk: 'fff8dc',
  crimson: 'dc143c',
  cyan: '00ffff',
  darkblue: '00008b',
  darkcyan: '008b8b',
  darkgoldenrod: 'b8860b',
  darkgray: 'a9a9a9',
  darkgreen: '006400',
  darkgrey: 'a9a9a9',
  darkkhaki: 'bdb76b',
  darkmagenta: '8b008b',
  darkolivegreen: '556b2f',
  darkorange: 'ff8c00',
  darkorchid: '9932cc',
  darkred: '8b0000',
  darksalmon: 'e9967a',
  darkseagreen: '8fbc8f',
  darkslateblue: '483d8b',
  darkslategray: '2f4f4f',
  darkslategrey: '2f4f4f',
  darkturquoise: '00ced1',
  darkviolet: '9400d3',
  deeppink: 'ff1493',
  deepskyblue: '00bfff',
  dimgray: '696969',
  dimgrey: '696969',
  dodgerblue: '1e90ff',
  feldspar: 'd19275',
  firebrick: 'b22222',
  floralwhite: 'fffaf0',
  forestgreen: '228b22',
  fuchsia: 'ff00ff',
  gainsboro: 'dcdcdc',
  ghostwhite: 'f8f8ff',
  gold: 'ffd700',
  goldenrod: 'daa520',
  gray: '808080',
  green: '008000',
  greenyellow: 'adff2f',
  grey: '808080',
  honeydew: 'f0fff0',
  hotpink: 'ff69b4',
  indianred: 'cd5c5c',
  indigo: '4b0082',
  ivory: 'fffff0',
  khaki: 'f0e68c',
  lavender: 'e6e6fa',
  lavenderblush: 'fff0f5',
  lawngreen: '7cfc00',
  lemonchiffon: 'fffacd',
  lightblue: 'add8e6',
  lightcoral: 'f08080',
  lightcyan: 'e0ffff',
  lightgoldenrodyellow: 'fafad2',
  lightgray: 'd3d3d3',
  lightgreen: '90ee90',
  lightgrey: 'd3d3d3',
  lightpink: 'ffb6c1',
  lightsalmon: 'ffa07a',
  lightseagreen: '20b2aa',
  lightskyblue: '87cefa',
  lightslateblue: '8470ff',
  lightslategray: '778899',
  lightslategrey: '778899',
  lightsteelblue: 'b0c4de',
  lightyellow: 'ffffe0',
  lime: '00ff00',
  limegreen: '32cd32',
  linen: 'faf0e6',
  magenta: 'ff00ff',
  maroon: '800000',
  mediumaquamarine: '66cdaa',
  mediumblue: '0000cd',
  mediumorchid: 'ba55d3',
  mediumpurple: '9370d8',
  mediumseagreen: '3cb371',
  mediumslateblue: '7b68ee',
  mediumspringgreen: '00fa9a',
  mediumturquoise: '48d1cc',
  mediumvioletred: 'c71585',
  midnightblue: '191970',
  mintcream: 'f5fffa',
  mistyrose: 'ffe4e1',
  moccasin: 'ffe4b5',
  navajowhite: 'ffdead',
  navy: '000080',
  oldlace: 'fdf5e6',
  olive: '808000',
  olivedrab: '6b8e23',
  orange: 'ffa500',
  orangered: 'ff4500',
  orchid: 'da70d6',
  palegoldenrod: 'eee8aa',
  palegreen: '98fb98',
  paleturquoise: 'afeeee',
  palevioletred: 'd87093',
  papayawhip: 'ffefd5',
  peachpuff: 'ffdab9',
  peru: 'cd853f',
  pink: 'ffc0cb',
  plum: 'dda0dd',
  powderblue: 'b0e0e6',
  purple: '800080',
  rebeccapurple: '663399',
  red: 'ff0000',
  rosybrown: 'bc8f8f',
  royalblue: '4169e1',
  saddlebrown: '8b4513',
  salmon: 'fa8072',
  sandybrown: 'f4a460',
  seagreen: '2e8b57',
  seashell: 'fff5ee',
  sienna: 'a0522d',
  silver: 'c0c0c0',
  skyblue: '87ceeb',
  slateblue: '6a5acd',
  slategray: '708090',
  slategrey: '708090',
  snow: 'fffafa',
  springgreen: '00ff7f',
  steelblue: '4682b4',
  tan: 'd2b48c',
  teal: '008080',
  thistle: 'd8bfd8',
  tomato: 'ff6347',
  turquoise: '40e0d0',
  violet: 'ee82ee',
  violetred: 'd02090',
  wheat: 'f5deb3',
  white: 'ffffff',
  whitesmoke: 'f5f5f5',
  yellow: 'ffff00',
  yellowgreen: '9acd32'
};
// array of color definition objects
const standardColorTypes = [{
  re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
  process(colorString) {
    return [parseInt(colorString[1], 10), parseInt(colorString[2], 10), parseInt(colorString[3], 10)];
  }
}, {
  re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*\.*\d+)\)$/,
  process(colorString) {
    return [parseInt(colorString[1], 10), parseInt(colorString[2], 10), parseInt(colorString[3], 10), parseFloat(colorString[4])];
  }
}, {
  re: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/,
  process(colorString) {
    return [parseInt(colorString[1], 16), parseInt(colorString[2], 16), parseInt(colorString[3], 16)];
  }
}, {
  re: /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/,
  process(colorString) {
    return [parseInt(colorString[1], 16), parseInt(colorString[2], 16), parseInt(colorString[3], 16), Number((parseInt(colorString[4], 16) / 255).toFixed(2))];
  }
}, {
  re: /^#([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$/,
  process(colorString) {
    return [parseInt(colorString[1] + colorString[1], 16), parseInt(colorString[2] + colorString[2], 16), parseInt(colorString[3] + colorString[3], 16), Number((parseInt(colorString[4] + colorString[4], 16) / 255).toFixed(2))];
  }
}, {
  re: /^#([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$/,
  process(colorString) {
    return [parseInt(colorString[1] + colorString[1], 16), parseInt(colorString[2] + colorString[2], 16), parseInt(colorString[3] + colorString[3], 16)];
  }
}, {
  re: /^hsv\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
  process(colorString) {
    const h = parseInt(colorString[1], 10);
    const s = parseInt(colorString[2], 10);
    const v = parseInt(colorString[3], 10);
    const rgb = hsvToRgb(h, s, v);
    return [rgb[0], rgb[1], rgb[2], 1, [h, s, v]];
  }
}, {
  re: /^hsl\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
  process(colorString) {
    const h = parseInt(colorString[1], 10);
    const s = parseInt(colorString[2], 10);
    const l = parseInt(colorString[3], 10);
    const rgb = hslToRgb(h, s, l);
    return [rgb[0], rgb[1], rgb[2], 1, null, [h, s, l]];
  }
}];
// eslint-disable-next-line @typescript-eslint/naming-convention
const _round = Math.round;
function Color(value) {
  this.baseColor = value;
  let color;
  if (value) {
    color = String(value).toLowerCase().replace(/ /g, '');
    color = standardColorNames[color] ? `#${standardColorNames[color]}` : color;
    color = parseColor(color);
  }
  if (!color) {
    this.colorIsInvalid = true;
  }
  color = color || {};
  this.r = normalize(color[0]);
  this.g = normalize(color[1]);
  this.b = normalize(color[2]);
  this.a = normalize(color[3], 1, 1);
  if (color[4]) {
    this.hsv = {
      h: color[4][0],
      s: color[4][1],
      v: color[4][2]
    };
  } else {
    this.hsv = toHsvFromRgb(this.r, this.g, this.b);
  }
  if (color[5]) {
    this.hsl = {
      h: color[5][0],
      s: color[5][1],
      l: color[5][2]
    };
  } else {
    this.hsl = toHslFromRgb(this.r, this.g, this.b);
  }
}
function parseColor(color) {
  if (color === 'transparent') {
    return [0, 0, 0, 0];
  }
  let i = 0;
  const ii = standardColorTypes.length;
  let str;
  for (; i < ii; ++i) {
    str = standardColorTypes[i].re.exec(color);
    if (str) {
      return standardColorTypes[i].process(str);
    }
  }
  return null;
}
function normalize(colorComponent, def, max) {
  def = def || 0;
  max = max || 255;
  return colorComponent < 0 || isNaN(colorComponent) ? def : colorComponent > max ? max : colorComponent;
}
function toHexFromRgb(r, g, b) {
  return `#${(0X01000000 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
function toHsvFromRgb(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let H;
  let S;
  let V = max;
  S = max === 0 ? 0 : 1 - min / max;
  if (max === min) {
    H = 0;
  } else {
    switch (max) {
      case r:
        H = 60 * ((g - b) / delta);
        if (g < b) {
          H += 360;
        }
        break;
      case g:
        H = 60 * ((b - r) / delta) + 120;
        break;
      case b:
        H = 60 * ((r - g) / delta) + 240;
        break;
      default:
        break;
    }
  }
  S *= 100;
  V *= 100 / 255;
  return {
    h: Math.round(H),
    s: Math.round(S),
    v: Math.round(V)
  };
}
function hsvToRgb(h, s, v) {
  const index = Math.floor(h % 360 / 60);
  const vMin = (100 - s) * v / 100;
  const a = (v - vMin) * (h % 60 / 60);
  const vInc = vMin + a;
  const vDec = v - a;
  let r;
  let g;
  let b;
  switch (index) {
    case 0:
      r = v;
      g = vInc;
      b = vMin;
      break;
    case 1:
      r = vDec;
      g = v;
      b = vMin;
      break;
    case 2:
      r = vMin;
      g = v;
      b = vInc;
      break;
    case 3:
      r = vMin;
      g = vDec;
      b = v;
      break;
    case 4:
      r = vInc;
      g = vMin;
      b = v;
      break;
    case 5:
      r = v;
      g = vMin;
      b = vDec;
      break;
    default:
      break;
  }
  return [Math.round(r * 2.55), Math.round(g * 2.55), Math.round(b * 2.55)];
}
function calculateHue(r, g, b, delta) {
  const max = Math.max(r, g, b);
  switch (max) {
    case r:
      return (g - b) / delta + (g < b ? 6 : 0);
    case g:
      return (b - r) / delta + 2;
    case b:
      return (r - g) / delta + 4;
    default:
      return undefined;
    // should never happen
  }
}
function toHslFromRgb(r, g, b) {
  r = convertTo01Bounds(r, 255);
  g = convertTo01Bounds(g, 255);
  b = convertTo01Bounds(b, 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const maxMinSum = max + min;
  let h;
  let s;
  const l = maxMinSum / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const delta = max - min;
    if (l > 0.5) {
      s = delta / (2 - maxMinSum);
    } else {
      s = delta / maxMinSum;
    }
    h = calculateHue(r, g, b, delta);
    h /= 6;
  }
  return {
    h: _round(h * 360),
    s: _round(s * 100),
    l: _round(l * 100)
  };
}
function makeColorTint(colorPart, h) {
  let colorTint = h;
  if (colorPart === 'r') {
    colorTint = h + 1 / 3;
  }
  if (colorPart === 'b') {
    colorTint = h - 1 / 3;
  }
  return colorTint;
}
function modifyColorTint(colorTint) {
  if (colorTint < 0) {
    colorTint += 1;
  }
  if (colorTint > 1) {
    colorTint -= 1;
  }
  return colorTint;
}
function hueToRgb(p, q, colorTint) {
  colorTint = modifyColorTint(colorTint);
  if (colorTint < 1 / 6) {
    return p + (q - p) * 6 * colorTint;
  }
  if (colorTint < 1 / 2) {
    return q;
  }
  if (colorTint < 2 / 3) {
    return p + (q - p) * (2 / 3 - colorTint) * 6;
  }
  return p;
}
function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;
  h = convertTo01Bounds(h, 360);
  s = convertTo01Bounds(s, 100);
  l = convertTo01Bounds(l, 100);
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, makeColorTint('r', h));
    g = hueToRgb(p, q, makeColorTint('g', h));
    b = hueToRgb(p, q, makeColorTint('b', h));
  }
  return [_round(r * 255), _round(g * 255), _round(b * 255)];
}
function convertTo01Bounds(n, max) {
  n = Math.min(max, Math.max(0, parseFloat(n)));
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }
  return n % max / parseFloat(max);
}
function isIntegerBetweenMinAndMax(number, min, max) {
  min = min || 0;
  max = max || 255;
  if (number % 1 !== 0 || number < min || number > max || typeof number !== 'number' || isNaN(number)) {
    return false;
  }
  return true;
}
Color.prototype = {
  constructor: Color,
  highlight(step) {
    step = step || 10;
    return this.alter(step).toHex();
  },
  darken(step) {
    step = step || 10;
    return this.alter(-step).toHex();
  },
  alter(step) {
    const result = new Color();
    result.r = normalize(this.r + step);
    result.g = normalize(this.g + step);
    result.b = normalize(this.b + step);
    return result;
  },
  blend(blendColor, opacity) {
    const other = blendColor instanceof Color ? blendColor : new Color(blendColor);
    const result = new Color();
    result.r = normalize(_round(this.r * (1 - opacity) + other.r * opacity));
    result.g = normalize(_round(this.g * (1 - opacity) + other.g * opacity));
    result.b = normalize(_round(this.b * (1 - opacity) + other.b * opacity));
    return result;
  },
  toHex() {
    return toHexFromRgb(this.r, this.g, this.b);
  },
  getPureColor() {
    const rgb = hsvToRgb(this.hsv.h, 100, 100);
    return new Color(`rgb(${rgb.join(',')})`);
  },
  isValidHex(hex) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
  },
  isValidRGB(r, g, b) {
    if (!isIntegerBetweenMinAndMax(r) || !isIntegerBetweenMinAndMax(g) || !isIntegerBetweenMinAndMax(b)) {
      return false;
    }
    return true;
  },
  isValidAlpha(a) {
    if (isNaN(a) || a < 0 || a > 1 || typeof a !== 'number') {
      return false;
    }
    return true;
  },
  colorIsInvalid: false,
  fromHSL(hsl) {
    const color = new Color();
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    // eslint-disable-next-line prefer-destructuring
    color.r = rgb[0];
    // eslint-disable-next-line prefer-destructuring
    color.g = rgb[1];
    // eslint-disable-next-line prefer-destructuring
    color.b = rgb[2];
    return color;
  }
};
var _default = exports["default"] = Color;

/***/ },

/***/ 63223
(module, __unused_webpack_exports, __webpack_require__) {



var _aiIntegration = __webpack_require__(94977);
/* global DevExpress */
/* eslint-disable import/no-commonjs */

module.exports = DevExpress.aiIntegration = _aiIntegration.AIIntegration;

/***/ },

/***/ 43101
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _m_color = _interopRequireDefault(__webpack_require__(54699));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// deprecated
var _default = exports["default"] = _m_color.default;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 94977
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "AIIntegration", ({
  enumerable: true,
  get: function () {
    return _ai_integration.AIIntegration;
  }
}));
var _ai_integration = __webpack_require__(49691);

/***/ },

/***/ 87129
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _m_errors = _interopRequireDefault(__webpack_require__(5583));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// deprecated
/**
* @docid
* @name ErrorsCore
*/
/**
    * @name ErrorsCore.E0001
    */
/**
    * @name ErrorsCore.E0002
    */
/**
    * @name ErrorsCore.E0003
    */
/**
    * @name ErrorsCore.E0004
    */
/**
    * @name ErrorsCore.E0005
    */
/**
    * @name ErrorsCore.E0006
    */
/**
    * @name ErrorsCore.E0007
    */
/**
    * @name ErrorsCore.E0008
    */
/**
    * @name ErrorsCore.E0009
    */
/**
    * @name ErrorsCore.E0010
    */
/**
    * @name ErrorsCore.E0011
    */
/**
    * @name ErrorsCore.E0012
    */
/**
    * @name ErrorsCore.E0013
    */
/**
    * @name ErrorsCore.E0014
    */
/**
    * @name ErrorsCore.E0015
    */
/**
    * @name ErrorsCore.E0017
    */
/**
    * @name ErrorsCore.E0018
    */
/**
    * @name ErrorsCore.E0020
    */
/**
    * @name ErrorsCore.E0021
    */
/**
    * @name ErrorsCore.E0022
    */
/**
    * @name ErrorsCore.E0023
    */
/**
    * @name ErrorsCore.E0024
    */
/**
    * @name ErrorsCore.E0025
    */
/**
    * @name ErrorsCore.E0100
    */
/**
    * @name ErrorsCore.E0101
    */
/**
    * @name ErrorsCore.E0102
    */
/**
    * @name ErrorsCore.E0103
    */
/**
    * @name ErrorsCore.E0110
    */
/**
    * @name ErrorsCore.E0120
    */
/**
    * @name ErrorsCore.E0121
    */
/**
    * @name ErrorsCore.E0122
    */
/**
    * @name ErrorsCore.W0000
    */
/**
    * @name ErrorsCore.W0001
    */
/**
    * @name ErrorsCore.W0002
    */
/**
    * @name ErrorsCore.W0003
    */
/**
    * @name ErrorsCore.W0004
    */
/**
    * @name ErrorsCore.W0005
    */
/**
    * @name ErrorsCore.W0006
    */
/**
    * @name ErrorsCore.W0007
    */
/**
    * @name ErrorsCore.W0008
    */
/**
    * @name ErrorsCore.W0009
    */
/**
    * @name ErrorsCore.W0010
    */
/**
    * @name ErrorsCore.W0011
    */
/**
    * @name ErrorsCore.W0012
    */
/**
    * @name ErrorsCore.W0013
    */
/**
    * @name ErrorsCore.W0014
    */
/**
    * @name ErrorsCore.W0015
    */
/**
    * @name ErrorsCore.W0016
    */
/**
    * @name ErrorsCore.W0017
    */
/**
    * @name ErrorsCore.W0018
    */
/**
    * @name ErrorsCore.W0019
    */
/**
    * @name ErrorsCore.W0020
    */
/**
    * @name ErrorsCore.W0021
    */
/**
    * @name ErrorsCore.W0022
    */
/**
    * @name ErrorsCore.W0023
    */
/**
    * @name ErrorsCore.W0024
    */
var _default = exports["default"] = _m_errors.default;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 67264
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _m_error = __webpack_require__(40818);
// deprecated
var _default = exports["default"] = _m_error.error;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 52576
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "extend", ({
  enumerable: true,
  get: function () {
    return _m_extend.extend;
  }
}));
Object.defineProperty(exports, "extendFromObject", ({
  enumerable: true,
  get: function () {
    return _m_extend.extendFromObject;
  }
}));
var _m_extend = __webpack_require__(96298);

/***/ },

/***/ 54497
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "encodeHtml", ({
  enumerable: true,
  get: function () {
    return _m_string.encodeHtml;
  }
}));
Object.defineProperty(exports, "format", ({
  enumerable: true,
  get: function () {
    return _m_string.format;
  }
}));
Object.defineProperty(exports, "isEmpty", ({
  enumerable: true,
  get: function () {
    return _m_string.isEmpty;
  }
}));
Object.defineProperty(exports, "quadToObject", ({
  enumerable: true,
  get: function () {
    return _m_string.quadToObject;
  }
}));
var _m_string = __webpack_require__(32527);

/***/ },

/***/ 11528
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "isBoolean", ({
  enumerable: true,
  get: function () {
    return _m_type.isBoolean;
  }
}));
Object.defineProperty(exports, "isDate", ({
  enumerable: true,
  get: function () {
    return _m_type.isDate;
  }
}));
Object.defineProperty(exports, "isDeferred", ({
  enumerable: true,
  get: function () {
    return _m_type.isDeferred;
  }
}));
Object.defineProperty(exports, "isDefined", ({
  enumerable: true,
  get: function () {
    return _m_type.isDefined;
  }
}));
Object.defineProperty(exports, "isEmptyObject", ({
  enumerable: true,
  get: function () {
    return _m_type.isEmptyObject;
  }
}));
Object.defineProperty(exports, "isEvent", ({
  enumerable: true,
  get: function () {
    return _m_type.isEvent;
  }
}));
Object.defineProperty(exports, "isExponential", ({
  enumerable: true,
  get: function () {
    return _m_type.isExponential;
  }
}));
Object.defineProperty(exports, "isFunction", ({
  enumerable: true,
  get: function () {
    return _m_type.isFunction;
  }
}));
Object.defineProperty(exports, "isNumeric", ({
  enumerable: true,
  get: function () {
    return _m_type.isNumeric;
  }
}));
Object.defineProperty(exports, "isObject", ({
  enumerable: true,
  get: function () {
    return _m_type.isObject;
  }
}));
Object.defineProperty(exports, "isPlainObject", ({
  enumerable: true,
  get: function () {
    return _m_type.isPlainObject;
  }
}));
Object.defineProperty(exports, "isPrimitive", ({
  enumerable: true,
  get: function () {
    return _m_type.isPrimitive;
  }
}));
Object.defineProperty(exports, "isPromise", ({
  enumerable: true,
  get: function () {
    return _m_type.isPromise;
  }
}));
Object.defineProperty(exports, "isRenderer", ({
  enumerable: true,
  get: function () {
    return _m_type.isRenderer;
  }
}));
Object.defineProperty(exports, "isString", ({
  enumerable: true,
  get: function () {
    return _m_type.isString;
  }
}));
Object.defineProperty(exports, "isWindow", ({
  enumerable: true,
  get: function () {
    return _m_type.isWindow;
  }
}));
Object.defineProperty(exports, "type", ({
  enumerable: true,
  get: function () {
    return _m_type.type;
  }
}));
var _m_type = __webpack_require__(39918);

/***/ },

/***/ 1956
(__unused_webpack_module, exports) {



exports.version = exports.fullVersion = void 0;
const version = exports.version = '26.1.0';
const fullVersion = exports.fullVersion = '26.1.0';

/***/ },

/***/ 35185
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _error = _interopRequireDefault(__webpack_require__(67264));
var _errors = _interopRequireDefault(__webpack_require__(87129));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
* @docid
* @name ErrorsUIWidgets
*/
var _default = exports["default"] = (0, _error.default)(_errors.default.ERROR_MESSAGES, {
  /**
  * @name ErrorsUIWidgets.E1001
  */
  E1001: 'Module \'{0}\'. Controller \'{1}\' is already registered',
  /**
  * @name ErrorsUIWidgets.E1002
  */
  E1002: 'Module \'{0}\'. Controller \'{1}\' does not inherit from DevExpress.ui.dxDataGrid.Controller',
  /**
  * @name ErrorsUIWidgets.E1003
  */
  E1003: 'Module \'{0}\'. View \'{1}\' is already registered',
  /**
  * @name ErrorsUIWidgets.E1004
  */
  E1004: 'Module \'{0}\'. View \'{1}\' does not inherit from DevExpress.ui.dxDataGrid.View',
  /**
  * @name ErrorsUIWidgets.E1005
  */
  E1005: 'Public method \'{0}\' is already registered',
  /**
  * @name ErrorsUIWidgets.E1006
  */
  E1006: 'Public method \'{0}.{1}\' does not exist',
  /**
  * @name ErrorsUIWidgets.E1007
  */
  E1007: 'State storing cannot be provided due to the restrictions of the browser',
  /**
  * @name ErrorsUIWidgets.E1010
  */
  E1010: 'The template does not contain the TextBox widget',
  /**
  * @name ErrorsUIWidgets.E1011
  */
  E1011: 'Items cannot be deleted from the List. Implement the "remove" function in the data store',
  /**
  * @name ErrorsUIWidgets.E1012
  */
  E1012: 'Editing type \'{0}\' with the name \'{1}\' is unsupported',
  /**
  * @name ErrorsUIWidgets.E1016
  */
  E1016: 'Unexpected type of data source is provided for a lookup column',
  /**
  * @name ErrorsUIWidgets.E1018
  */
  E1018: 'The \'collapseAll\' method cannot be called if you use a remote data source',
  /**
  * @name ErrorsUIWidgets.E1019
  */
  E1019: 'Search mode \'{0}\' is unavailable',
  /**
  * @name ErrorsUIWidgets.E1020
  */
  E1020: 'The type cannot be changed after initialization',
  /**
  * @name ErrorsUIWidgets.E1021
  */
  E1021: '{0} \'{1}\' you are trying to remove does not exist',
  /**
  * @name ErrorsUIWidgets.E1022
  */
  E1022: 'The "markers" option is given an invalid value. Assign an array instead',
  /**
  * @name ErrorsUIWidgets.E1023
  */
  E1023: 'The "routes" option is given an invalid value. Assign an array instead',
  /**
  * @name ErrorsUIWidgets.E1025
  */
  E1025: 'This layout is too complex to render',
  /**
  * @name ErrorsUIWidgets.E1026
  */
  E1026: 'The "calculateCustomSummary" function is missing from a field whose "summaryType" option is set to "custom"',
  /**
  * @name ErrorsUIWidgets.E1031
  */
  E1031: 'Unknown subscription in the Scheduler widget: \'{0}\'',
  /**
  * @name ErrorsUIWidgets.E1032
  */
  E1032: 'Unknown start date in an appointment: \'{0}\'',
  /**
  * @name ErrorsUIWidgets.E1033
  */
  E1033: 'Unknown step in the date navigator: \'{0}\'',
  /**
  * @name ErrorsUIWidgets.E1034
  */
  E1034: 'The browser does not implement an API for saving files',
  /**
   * @name ErrorsUIWidgets.E1035
   */
  E1035: 'The editor cannot be created: {0}',
  /**
   * @name ErrorsUIWidgets.E1037
   */
  E1037: 'Invalid structure of grouped data',
  /**
   * @name ErrorsUIWidgets.E1038
   */
  E1038: 'The browser does not support local storages for local web pages',
  /**
  * @name ErrorsUIWidgets.E1039
  */
  E1039: 'A cell\'s position cannot be calculated',
  /**
   * @name ErrorsUIWidgets.E1040
   */
  E1040: 'The \'{0}\' key value is not unique within the data array',
  /**
   * @name ErrorsUIWidgets.E1041
   */
  E1041: 'The \'{0}\' script is referenced after the DevExtreme scripts or not referenced at all',
  /**
  * @name ErrorsUIWidgets.E1042
  */
  E1042: '{0} requires the key field to be specified',
  /**
  * @name ErrorsUIWidgets.E1043
  */
  E1043: 'Changes cannot be processed due to the incorrectly set key',
  /**
  * @name ErrorsUIWidgets.E1044
  */
  E1044: 'The key field specified by the keyExpr option does not match the key field specified in the data store',
  /**
  * @name ErrorsUIWidgets.E1045
  */
  E1045: 'Editing requires the key field to be specified in the data store',
  /**
  * @name ErrorsUIWidgets.E1046
  */
  E1046: 'The \'{0}\' key field is not found in data objects',
  /**
  * @name ErrorsUIWidgets.E1047
  */
  E1047: 'The "{0}" field is not found in the fields array',
  /**
  * @name ErrorsUIWidgets.E1048
  */
  E1048: 'The "{0}" operation is not found in the filterOperations array',
  /**
  * @name ErrorsUIWidgets.E1049
  */
  E1049: 'Column \'{0}\': filtering is allowed but the \'dataField\' or \'name\' option is not specified',
  /**
  * @name ErrorsUIWidgets.E1050
  */
  E1050: 'The validationRules option does not apply to third-party editors defined in the editCellTemplate',
  /**
  * @name ErrorsUIWidgets.E1052
  */
  E1052: '{0} should have the "dataSource" option specified',
  /**
  * @name ErrorsUIWidgets.E1053
  */
  E1053: 'The "buttons" option accepts an array that contains only objects or string values',
  /**
  * @name ErrorsUIWidgets.E1054
  */
  E1054: 'All text editor buttons must have names',
  /**
  * @name ErrorsUIWidgets.E1055
  */
  E1055: 'One or several text editor buttons have invalid or non-unique "name" values',
  /**
  * @name ErrorsUIWidgets.E1056
  */
  E1056: 'The {0} widget does not support buttons of the "{1}" type',
  // NOTE:
  // E1057 is reserved. See https://js.devexpress.com/Documentation/19_2/ApiReference/UI_Widgets/Errors_and_Warnings/#E1057

  /**
  * @name ErrorsUIWidgets.E1058
  */
  E1058: 'The "startDayHour" and "endDayHour" options must be integers in the [0, 24] range, with "endDayHour" being greater than "startDayHour".',
  /**
  * @name ErrorsUIWidgets.E1059
  */
  E1059: 'The following column names are not unique: {0}',
  /**
  * @name ErrorsUIWidgets.E1060
  */
  E1060: 'All editable columns must have names',
  /**
   * @name ErrorsUIWidgets.E1061
   */
  E1061: 'The "offset" option must be an integer in the [-1440, 1440] range, divisible by 5 without a remainder.',
  /**
   * @name ErrorsUIWidgets.E1062
   */
  E1062: 'The "cellDuration" must be a positive integer, evenly dividing the ("endDayHour" - "startDayHour") interval into minutes.',
  /**
   * @name ErrorsUIWidgets.E1063
   */
  E1063: 'The \'smartPaste(text)\' method was called, but \'aiIntegration\' is not configured.',
  /**
   * @name ErrorsUIWidgets.E1064
   */
  E1064: 'AI returned {1} for the {0} field, but this field only accepts {2} values. Update the \'instruction\' for this field.',
  /**
   * @name ErrorsUIWidgets.E1065
   */
  E1065: 'The browser does not support Web Speech API (SpeechRecognition)',
  /**
  * @name ErrorsUIWidgets.E1066
  */
  E1066: 'All AI columns must have names.',
  /**
  * @name ErrorsUIWidgets.E1067
  */
  E1067: '\'aiIntegration\' is not configured in the {0} column.',
  /**
  * @name ErrorsUIWidgets.W1001
  */
  W1001: 'The "key" option cannot be modified after initialization',
  /**
  * @name ErrorsUIWidgets.W1002
  */
  W1002: 'An item with the key \'{0}\' does not exist',
  /**
  * @name ErrorsUIWidgets.W1003
  */
  W1003: 'A group with the key \'{0}\' in which you are trying to select items does not exist',
  /**
  * @name ErrorsUIWidgets.W1004
  */
  W1004: 'The item \'{0}\' you are trying to select in the group \'{1}\' does not exist',
  /**
  * @name ErrorsUIWidgets.W1005
  */
  W1005: 'Due to column data types being unspecified, data has been loaded twice in order to apply initial filter settings. To resolve this issue, specify data types for all grid columns.',
  /**
  * @name ErrorsUIWidgets.W1006
  */
  W1006: 'The map service returned the following error: \'{0}\'',
  /**
   * @name ErrorsUIWidgets.W1007
   */
  W1007: 'No item with key {0} was found in the data source, but this key was used as the parent key for item {1}',
  /**
   * @name ErrorsUIWidgets.W1008
   */
  W1008: 'Cannot scroll to the \'{0}\' date because it does not exist on the current view',
  /**
   * @name ErrorsUIWidgets.W1009
   */
  W1009: 'Searching works only if data is specified using the dataSource option',
  /**
   * @name ErrorsUIWidgets.W1010
   */
  W1010: 'The capability to select all items works with source data of plain structure only',
  /**
   * @name ErrorsUIWidgets.W1011
   */
  W1011: 'The "keyExpr" option is not applied when dataSource is not an array',
  W1012: 'The \'{0}\' key field is not found in data objects',
  /**
  * @name ErrorsUIWidgets.W1013
  */
  W1013: 'The "message" field in the dialog component was renamed to "messageHtml". Change your code correspondingly. In addition, if you used HTML code in the message, make sure that it is secure',
  /**
  * @name ErrorsUIWidgets.W1014
  */
  W1014: 'The Floating Action Button exceeds the recommended speed dial action count. If you need to display more speed dial actions, increase the maxSpeedDialActionCount option value in the global config.',
  /**
  * @name ErrorsUIWidgets.W1017
  */
  W1017: 'The \'key\' property is not specified for a lookup data source. Please specify it to prevent requests for the entire dataset when users filter data.',
  /**
  * @name ErrorsUIWidgets.W1018
  */
  W1018: 'Infinite scrolling may not work properly with multiple selection. To use these features together, set \'selection.deferred\' to true or set \'selection.selectAllMode\' to \'page\'.',
  /**
  * @name ErrorsUIWidgets.W1019
  */
  W1019: 'Filter query string exceeds maximum length limit of {0} characters.',
  /**
  * @name ErrorsUIWidgets.W1020
  */
  W1020: 'hideEvent is ignored when the shading property is true',
  /**
  * @name ErrorsUIWidgets.W1021
  */
  W1021: 'The \'{0}\' is not rendered because none of the DOM elements match the value of the "container" property.',
  /**
   * @name ErrorsUIWidgets.W1022
   */
  W1022: '{0} JSON parsing error: \'{1}\'',
  /**
   * @name ErrorsUIWidgets.W1023
   */
  W1023: 'Appointments require unique keys. Otherwise, the agenda view may not work correctly.',
  /**
   * @name ErrorsUIWidgets.W1024
   */
  W1024: 'The client-side export is enabled. Implement the \'onExporting\' function.',
  /**
   * @name ErrorsUIWidgets.W1025
   */
  W1025: '\'scrolling.mode\' is set to \'virtual\' or \'infinite\'. Specify the height of the component.',
  /**
   * @name ErrorsUIWidgets.W1026
   */
  W1026: 'The \'ai\' toolbar item is defined, but aiIntegration is missing.',
  /**
   * @name ErrorsUIWidgets.W1027
   */
  W1027: 'A prompt should be specified for a custom command.',
  /**
   * @name ErrorsUIWidgets.W1028
   */
  W1028: 'Nested/banded columns do not support the following properties: {0}.'
});
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(63223);
/******/ 	
/******/ })()
;
