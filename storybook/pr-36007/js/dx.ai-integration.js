/*!
* DevExtreme (dx.ai-integration.js)
* Version: 26.2.0
* Build date: Wed Oct 28 2026
*
* Copyright (c) 2012 - 2026 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 24267
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = exports.Color = void 0;
var _color = __webpack_require__(98034);
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
class Color {
  constructor(value) {
    this.colorIsInvalid = false;
    this.baseColor = value;
    let color = null;
    if (value) {
      let colorStr = String(value).toLowerCase().replace(/ /g, '');
      colorStr = standardColorNames[colorStr] ? `#${standardColorNames[colorStr]}` : colorStr;
      color = (0, _color.parseColor)(colorStr);
    }
    if (!color) {
      this.colorIsInvalid = true;
    }
    const parts = color ?? [];
    this.r = (0, _color.normalize)(parts[0]);
    this.g = (0, _color.normalize)(parts[1]);
    this.b = (0, _color.normalize)(parts[2]);
    this.a = (0, _color.normalize)(parts[3], 1, 1);
    const hsvData = parts[4];
    if (hsvData) {
      this.hsv = {
        h: hsvData[0],
        s: hsvData[1],
        v: hsvData[2]
      };
    } else {
      this.hsv = (0, _color.toHsvFromRgb)(this.r, this.g, this.b);
    }
    const hslData = parts[5];
    if (hslData) {
      this.hsl = {
        h: hslData[0],
        s: hslData[1],
        l: hslData[2]
      };
    } else {
      this.hsl = (0, _color.toHslFromRgb)(this.r, this.g, this.b);
    }
  }
  highlight(step) {
    const stepValue = step ?? 10;
    return this.alter(stepValue).toHex();
  }
  darken(step) {
    const stepValue = step ?? 10;
    return this.alter(-stepValue).toHex();
  }
  alter(step) {
    const result = new Color();
    result.r = (0, _color.normalize)(this.r + step);
    result.g = (0, _color.normalize)(this.g + step);
    result.b = (0, _color.normalize)(this.b + step);
    return result;
  }
  blend(blendColor, opacity) {
    const other = blendColor instanceof Color ? blendColor : new Color(blendColor);
    const result = new Color();
    result.r = (0, _color.normalize)(Math.round(this.r * (1 - opacity) + other.r * opacity));
    result.g = (0, _color.normalize)(Math.round(this.g * (1 - opacity) + other.g * opacity));
    result.b = (0, _color.normalize)(Math.round(this.b * (1 - opacity) + other.b * opacity));
    return result;
  }
  toHex() {
    return (0, _color.toHexFromRgb)(this.r, this.g, this.b);
  }
  getPureColor() {
    const rgb = (0, _color.hsvToRgb)(this.hsv.h, 100, 100);
    return new Color(`rgb(${rgb.join(',')})`);
  }
  static isValidHex(hex) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
  }
  static isValidRGB(r, g, b) {
    if (!(0, _color.isIntegerBetweenMinAndMax)(r) || !(0, _color.isIntegerBetweenMinAndMax)(g) || !(0, _color.isIntegerBetweenMinAndMax)(b)) {
      return false;
    }
    return true;
  }
  static isValidAlpha(a) {
    if (typeof a !== 'number' || isNaN(a) || a < 0 || a > 1) {
      return false;
    }
    return true;
  }
  static fromHSL(hsl) {
    const color = new Color();
    const rgb = (0, _color.hslToRgb)(hsl.h, hsl.s, hsl.l);
    // eslint-disable-next-line prefer-destructuring
    color.r = rgb[0];
    // eslint-disable-next-line prefer-destructuring
    color.g = rgb[1];
    // eslint-disable-next-line prefer-destructuring
    color.b = rgb[2];
    color.hsl = Object.assign({}, hsl);
    color.hsv = (0, _color.toHsvFromRgb)(color.r, color.g, color.b);
    color.colorIsInvalid = false;
    return color;
  }
}
exports.Color = Color;
var _default = exports["default"] = Color;

/***/ },

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

/***/ 714
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ExecuteGridAssistantCommand = void 0;
var _base = __webpack_require__(55390);
class ExecuteGridAssistantCommand extends _base.BaseCommand {
  getTemplateName() {
    return 'executeGridAssistant';
  }
  buildPromptData(params) {
    return {
      user: {
        text: params.text,
        context: JSON.stringify(params.context)
      }
    };
  }
  parseResult(response) {
    if (typeof response === 'string') {
      if (response === '') {
        return {
          actions: []
        };
      }
      return JSON.parse(response);
    }
    const actions = typeof response.actions === 'string' ? JSON.parse(response.actions) : response.actions;
    return {
      actions
    };
  }
}
exports.ExecuteGridAssistantCommand = ExecuteGridAssistantCommand;

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
Object.defineProperty(exports, "ExecuteGridAssistantCommand", ({
  enumerable: true,
  get: function () {
    return _executeGridAssistant.ExecuteGridAssistantCommand;
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
var _executeGridAssistant = __webpack_require__(714);

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
          if (!(0, _date.isValidDate)(single)) {
            throw _ui.default.Error('E1064', fieldName, errorValue, 'date');
          }
          return new Date(single);
        }
      case 'dateRange':
        {
          if (!arr || arr.length > 2 || !arr.every(_date.isValidDate)) {
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
var _executeGridAssistant = __webpack_require__(714);
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
  CommandNames["ExecuteGridAssistant"] = "executeGridAssistant";
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
  [CommandNames.GenerateGridColumn]: _generateGridColumn.GenerateGridColumnCommand,
  [CommandNames.ExecuteGridAssistant]: _executeGridAssistant.ExecuteGridAssistantCommand
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
  executeGridAssistant(params, callbacks) {
    return this.executeCommand(CommandNames.ExecuteGridAssistant, params, callbacks);
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
  },
  executeGridAssistant: {
    system: 'You are a helpful AI assistant for a data grid component. The user sends a natural language request describing an operation on the grid (e.g., sorting, filtering, grouping). You receive the user\'s message, a context object describing the current grid state, and a JSON schema describing the available commands and their arguments. Your task is to interpret the user\'s request and return a JSON object with one field: "actions" — an array of command objects, each with "name" (the command name) and "args" (an object of arguments matching the schema). Output must be a valid JSON string, directly parsable by JSON.parse. Do not include any markdown, formatting, or extra text — only the raw JSON object.\n\nCRITICAL RULE FOR OPTIONAL ARGUMENTS: If an optional argument is not used, the field MUST be ENTIRELY ABSENT from the JSON object — the key must not appear at all. NEVER emit an optional field with value null, empty string "", empty array [], or any placeholder. This rule overrides any instinct to "complete" the object — omitted IS the value.\n\nCRITICAL RULE FOR UNRECOGNIZED REQUESTS: If the user\'s request text is unclear, meaningless, or not related to any grid operation, you MUST return {"actions": []}. Do NOT guess, infer, or invent actions. Numbers, random characters, greetings, or off-topic text are NOT grid commands. Only produce actions when the request explicitly and clearly maps to one or more supported grid commands.\n\nExamples of meaningless user requests that MUST return {"actions": []}:\n- "User request: 1." → {"actions": []}\n- "User request: 123." → {"actions": []}\n- "User request: hello." → {"actions": []}',
    user: 'User request: {{text}}. Grid context: {{context}}.'
  }
};

/***/ },

/***/ 96446
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _errors = _interopRequireDefault(__webpack_require__(87129));
var _extend = __webpack_require__(52576);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/* global DevExpress */

const normalizeToJSONString = optionsString => optionsString.replace(/'/g, '"') // replace all ' to "
.replace(/,\s*([\]}])/g, '$1') // remove trailing commas
.replace(/([{,])\s*([^":\s]+)\s*:/g, '$1"$2":'); // add quotes for unquoted keys
const config = {
  rtlEnabled: false,
  defaultCurrency: 'USD',
  defaultUseCurrencyAccountingStyle: true,
  oDataFilterToLower: true,
  serverDecimalSeparator: '.',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  forceIsoDateParsing: true,
  wrapActionsBeforeExecute: true,
  useLegacyStoreResult: false,
  useJQuery: undefined,
  editorStylingMode: undefined,
  useLegacyVisibleIndex: false,
  versionAssertions: [],
  copyStylesToShadowDom: true,
  dateFormat: undefined,
  timeFormat: undefined,
  dateTimeFormat: undefined,
  numberFormat: undefined,
  dateTimeFormatPresets: undefined,
  licenseKey: '/* ___$$$$$___devextreme___lcp___placeholder____$$$$$ */',
  floatingActionButtonConfig: {
    icon: 'add',
    closeIcon: 'close',
    label: '',
    position: {
      at: 'right bottom',
      my: 'right bottom',
      offset: {
        x: -16,
        y: -16
      }
    },
    maxSpeedDialActionCount: 5,
    shading: false,
    direction: 'auto'
  },
  optionsParser: optionsString => {
    const normalizedString = !optionsString.trim().startsWith('{') ? `{${optionsString}}` : optionsString;
    try {
      return JSON.parse(normalizedString);
    } catch (ex) {
      try {
        return JSON.parse(normalizeToJSONString(normalizedString));
      } catch (exNormalize) {
        throw _errors.default.Error('E3018', ex, normalizedString);
      }
    }
  }
};
const deprecatedFields = ['decimalSeparator', 'thousandsSeparator'];
const configMethod = function () {
  if (!arguments.length) {
    return config;
  }
  const newConfig = arguments.length <= 0 ? undefined : arguments[0];
  deprecatedFields.forEach(deprecatedField => {
    if (newConfig[deprecatedField]) {
      const message = `Now, the ${deprecatedField} is selected based on the specified locale.`;
      _errors.default.log('W0003', 'config', deprecatedField, '19.2', message);
    }
  });
  (0, _extend.extend)(config, newConfig);
  return undefined;
};
// @ts-expect-error typescript cant see global
if (typeof DevExpress !== 'undefined' && DevExpress.config) {
  // @ts-expect-error typescript cant see global
  configMethod(DevExpress.config);
}
var _default = exports["default"] = configMethod;

/***/ },

/***/ 83867
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
  E0123: 'Disallowed property name in expression: \'{0}\'',
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
  W0023: 'DevExtreme: the following \'devextreme\' package version does not match versions of other DevExpress products used in this application:\n\n' + '{0}\n\n' + 'Interoperability between different versions of the products listed herein cannot be guaranteed.\n\n',
  W0024: 'Invalid accent color: \'{0}\'. The previous accent color remains in effect.',
  W0025: 'The \'{0}\' theme does not support custom accent colors. Apply a Fluent Next theme to use the \'customAccentColor\' method.'
});

/***/ },

/***/ 28197
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Guid = void 0;
class Guid {
  constructor(value) {
    const initialValue = value ? String(value) : '';
    this._value = this._normalize(initialValue || this._generate());
  }
  _normalize(value) {
    let normalizedValue = value.replace(/[^a-f0-9]/ig, '').toLowerCase();
    while (normalizedValue.length < 32) {
      normalizedValue += '0';
    }
    return [normalizedValue.slice(0, 8), normalizedValue.slice(8, 12), normalizedValue.slice(12, 16), normalizedValue.slice(16, 20), normalizedValue.slice(20, 32)].join('-');
  }
  _generate() {
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  toString() {
    return this._value;
  }
  valueOf() {
    return this._value;
  }
  toJSON() {
    return this._value;
  }
}
exports.Guid = Guid;

/***/ },

/***/ 4445
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _iterator = __webpack_require__(80892);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['AM', 'PM'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
// TODO: optimize
const cutCaptions = (captions, format) => {
  const lengthByFormat = {
    abbreviated: 3,
    short: 2,
    narrow: 1
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (0, _iterator.map)(captions, caption => caption.substr(0, lengthByFormat[format]));
};
var _default = exports["default"] = {
  getMonthNames(format) {
    return cutCaptions(MONTHS, format);
  },
  getDayNames(format) {
    return cutCaptions(DAYS, format);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getQuarterNames(_format) {
    return QUARTERS;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPeriodNames(_format) {
    return PERIODS;
  }
};

/***/ },

/***/ 19632
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getFormatter = getFormatter;
function leftPad(text, length) {
  while (text.length < length) {
    // eslint-disable-next-line no-param-reassign
    text = `0${text}`;
  }
  return text;
}
const FORMAT_TYPES = {
  3: 'abbreviated',
  4: 'wide',
  5: 'narrow'
};
const LDML_FORMATTERS = {
  y(date, count, useUtc) {
    let year = date[useUtc ? 'getUTCFullYear' : 'getFullYear']();
    if (count === 2) {
      year %= 100;
    }
    return leftPad(year.toString(), count);
  },
  M(date, count, useUtc, dateParts) {
    const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
    const formatType = FORMAT_TYPES[count];
    if (formatType) {
      return dateParts.getMonthNames(formatType, 'format')[month];
    }
    return leftPad((month + 1).toString(), Math.min(count, 2));
  },
  L(date, count, useUtc, dateParts) {
    const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
    const formatType = FORMAT_TYPES[count];
    if (formatType) {
      return dateParts.getMonthNames(formatType, 'standalone')[month];
    }
    return leftPad((month + 1).toString(), Math.min(count, 2));
  },
  Q(date, count, useUtc, dateParts) {
    const month = date[useUtc ? 'getUTCMonth' : 'getMonth']();
    const quarter = Math.floor(month / 3);
    const formatType = FORMAT_TYPES[count];
    if (formatType) {
      return dateParts.getQuarterNames(formatType)[quarter];
    }
    return leftPad((quarter + 1).toString(), Math.min(count, 2));
  },
  E(date, count, useUtc, dateParts) {
    const day = date[useUtc ? 'getUTCDay' : 'getDay']();
    const formatType = FORMAT_TYPES[count < 3 ? 3 : count];
    return dateParts.getDayNames(formatType)[day];
  },
  a(date, count, useUtc, dateParts) {
    const hours = date[useUtc ? 'getUTCHours' : 'getHours']();
    const period = hours < 12 ? 0 : 1;
    const formatType = FORMAT_TYPES[count];
    return dateParts.getPeriodNames(formatType)[period];
  },
  d(date, count, useUtc) {
    return leftPad(date[useUtc ? 'getUTCDate' : 'getDate']().toString(), Math.min(count, 2));
  },
  H(date, count, useUtc) {
    return leftPad(date[useUtc ? 'getUTCHours' : 'getHours']().toString(), Math.min(count, 2));
  },
  h(date, count, useUtc) {
    const hours = date[useUtc ? 'getUTCHours' : 'getHours']();
    return leftPad((hours % 12 || 12).toString(), Math.min(count, 2));
  },
  m(date, count, useUtc) {
    return leftPad(date[useUtc ? 'getUTCMinutes' : 'getMinutes']().toString(), Math.min(count, 2));
  },
  s(date, count, useUtc) {
    return leftPad(date[useUtc ? 'getUTCSeconds' : 'getSeconds']().toString(), Math.min(count, 2));
  },
  S(date, count, useUtc) {
    return leftPad(date[useUtc ? 'getUTCMilliseconds' : 'getMilliseconds']().toString(), 3).slice(0, count);
  },
  x(date, count, useUtc) {
    const timezoneOffset = useUtc ? 0 : date.getTimezoneOffset();
    const signPart = timezoneOffset > 0 ? '-' : '+';
    const timezoneOffsetAbs = Math.abs(timezoneOffset);
    const hours = Math.floor(timezoneOffsetAbs / 60);
    const minutes = timezoneOffsetAbs % 60;
    const hoursPart = leftPad(hours.toString(), 2);
    const minutesPart = leftPad(minutes.toString(), 2);
    return signPart + hoursPart + (count >= 3 ? ':' : '') + (count > 1 || minutes ? minutesPart : '');
  },
  X(date, count, useUtc) {
    if (useUtc || !date.getTimezoneOffset()) {
      return 'Z';
    }
    return LDML_FORMATTERS.x(date, count, useUtc);
  },
  Z(date, count, useUtc) {
    return LDML_FORMATTERS.X(date, count >= 5 ? 3 : 2, useUtc);
  }
};
function getFormatter(format, dateParts) {
  return date => {
    if (!date) {
      return null;
    }
    if (!format) {
      return date;
    }
    const separator = '\'';
    const useUtc = format.endsWith('Z') || format.endsWith('\'Z\'');
    let charCount = 0;
    let isEscaping = false;
    let result = '';
    for (let charIndex = 0; charIndex < format.length; charIndex += 1) {
      const char = format[charIndex];
      const formatter = LDML_FORMATTERS[char];
      const isCurrentCharEqualsNext = char === format[charIndex + 1];
      charCount += 1;
      if (!isCurrentCharEqualsNext) {
        if (formatter && !isEscaping) {
          result += formatter(date, charCount, useUtc, dateParts);
        }
        charCount = 0;
      }
      if (char === separator && !isCurrentCharEqualsNext) {
        isEscaping = !isEscaping;
      } else if (isEscaping || !formatter) {
        result += char;
      }
      if (char === separator && isCurrentCharEqualsNext) {
        charIndex += 1;
      }
    }
    return result;
  };
}

/***/ },

/***/ 93373
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getCurrentTemplateEngine = getCurrentTemplateEngine;
exports.registerTemplateEngine = registerTemplateEngine;
exports.setTemplateEngine = setTemplateEngine;
var _errors = _interopRequireDefault(__webpack_require__(87129));
var _type = __webpack_require__(11528);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const templateEngines = {};
// eslint-disable-next-line @typescript-eslint/init-declarations
let currentTemplateEngine;
function registerTemplateEngine(name, templateEngine) {
  // @ts-expect-error TemplateEngine<TCompiled> is not assignable to TemplateEngine<unknown>
  templateEngines[name] = templateEngine;
}
function setTemplateEngine(templateEngine) {
  if ((0, _type.isString)(templateEngine)) {
    currentTemplateEngine = templateEngines[templateEngine];
    if (!currentTemplateEngine) {
      throw _errors.default.Error('E0020', templateEngine);
    }
  } else {
    currentTemplateEngine = templateEngine;
  }
}
function getCurrentTemplateEngine() {
  return currentTemplateEngine;
}

/***/ },

/***/ 24061
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.logger = exports["default"] = exports.debug = void 0;
var _type = __webpack_require__(11528);
/* global console */
/* eslint no-console: off */

const noop = function noop() {};
const getConsoleMethod = function getConsoleMethod(method) {
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
const debug = exports.debug = function createDebug() {
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

/***/ 55594
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isValidDate = exports.dateUtils = exports.addOffsets = void 0;
var _date_serialization = _interopRequireDefault(__webpack_require__(71051));
var _iterator = __webpack_require__(21274);
var _math = __webpack_require__(50254);
var _type = __webpack_require__(11528);
var _toMilliseconds = __webpack_require__(24491);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DAYS_IN_WEEK = 7;
const THURSDAY_WEEK_NUMBER = 4;
const SUNDAY_WEEK_NUMBER = 7;
const USUAL_WEEK_COUNT_IN_YEAR = 52;
const dateUnitIntervals = ['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'];
function convertDateUnitToMilliseconds(dateUnit, count) {
  return (0, _toMilliseconds.toMilliseconds)(dateUnit) * count;
}
function getDateUnitInterval(tickInterval) {
  let maxInterval = -1;
  if ((0, _type.isString)(tickInterval)) {
    return tickInterval;
  }
  if ((0, _type.isObject)(tickInterval)) {
    (0, _iterator.each)(tickInterval, (key, value) => {
      for (let i = 0; i < dateUnitIntervals.length; i += 1) {
        if (value && (key === `${dateUnitIntervals[i]}s` || key === dateUnitIntervals[i]) && maxInterval < i) {
          maxInterval = i;
        }
      }
    });
    return dateUnitIntervals[maxInterval];
  }
  return '';
}
const dateIntervalByUnit = {
  year: {
    years: 1
  },
  month: {
    months: 1
  },
  quarter: {
    months: 3
  },
  week: {
    weeks: 1
  },
  day: {
    days: 1
  },
  hour: {
    hours: 1
  },
  minute: {
    minutes: 1
  },
  second: {
    seconds: 1
  },
  millisecond: {
    milliseconds: 1
  }
};
function getDateIntervalByString(intervalString) {
  return Object.assign({}, dateIntervalByUnit[intervalString]);
}
const createDateWithFullYear = function createDateWithFullYear(year) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  const result = new Date(year, ...args);
  result.setFullYear(year);
  return result;
};
function getLastMonthDay(date) {
  const resultDate = createDateWithFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return resultDate.getDate();
}
function getFirstDecadeInCentury(date) {
  return date && date.getFullYear() - date.getFullYear() % 100;
}
function getFirstYearInDecade(date) {
  return date && date.getFullYear() - date.getFullYear() % 10;
}
function getFirstWeekDate(date, firstDayOfWeek) {
  const delta = (date.getDay() - firstDayOfWeek + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const result = new Date(date);
  result.setDate(date.getDate() - delta);
  return result;
}
function getFirstDateInYear(year) {
  return new Date(year, 0, 1);
}
function fixTimezoneGap(oldDate, newDate) {
  // NOTE: T182866
  if (!(0, _type.isDefined)(oldDate)) {
    return;
  }
  const diff = newDate.getHours() - oldDate.getHours();
  if (diff === 0) {
    return;
  }
  const sign = diff === 1 || diff === -23 ? -1 : 1;
  const trial = new Date(newDate.getTime() + sign * 3600000);
  if (sign > 0 || trial.getDate() === newDate.getDate()) {
    newDate.setTime(trial.getTime());
  }
}
function getTimezonesDifference(min, max) {
  return (max.getTimezoneOffset() - min.getTimezoneOffset()) * 60 * 1000;
}
function normalizeDate(date, min, max) {
  let normalizedDate = date;
  if (!(0, _type.isDefined)(date)) {
    return date;
  }
  if ((0, _type.isDefined)(min) && date < min) {
    normalizedDate = min;
  }
  if ((0, _type.isDefined)(max) && date > max) {
    normalizedDate = max;
  }
  return normalizedDate;
}
const getDatesInterval = function getDatesInterval(startDate, endDate, intervalUnit) {
  const delta = endDate.getTime() - startDate.getTime();
  const millisecondCount = (0, _toMilliseconds.toMilliseconds)(intervalUnit) || 1;
  return Math.floor(delta / millisecondCount);
};
const getNextDateUnit = function getNextDateUnit(unit, withWeeks) {
  const interval = getDateUnitInterval(unit);
  switch (interval) {
    case 'millisecond':
      return 'second';
    case 'second':
      return 'minute';
    case 'minute':
      return 'hour';
    case 'hour':
      return 'day';
    case 'day':
      return withWeeks ? 'week' : 'month';
    case 'week':
      return 'month';
    case 'month':
      return 'quarter';
    case 'quarter':
      return 'year';
    case 'year':
      return 'year';
    default:
      return 0;
  }
};
const convertMillisecondsToDateUnits = function convertMillisecondsToDateUnits(value) {
  const units = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];
  const result = {};
  let rest = value;
  for (let i = units.length - 1; i >= 0; i -= 1) {
    const dateUnitInterval = units[i];
    const dateUnitCount = Math.floor(rest / (0, _toMilliseconds.toMilliseconds)(dateUnitInterval));
    if (dateUnitCount > 0) {
      result[`${dateUnitInterval}s`] = dateUnitCount;
      rest -= convertDateUnitToMilliseconds(dateUnitInterval, dateUnitCount);
    }
  }
  return result;
};
const unitByIntervalKey = {
  milliseconds: 'millisecond',
  seconds: 'second',
  minutes: 'minute',
  hours: 'hour',
  days: 'day',
  weeks: 'week',
  months: 'month',
  quarters: 'quarter',
  years: 'year'
};
const dateToMilliseconds = function dateToMilliseconds(tickInterval) {
  let milliseconds = 0;
  if ((0, _type.isObject)(tickInterval)) {
    (0, _iterator.each)(tickInterval, (key, value) => {
      milliseconds += convertDateUnitToMilliseconds(unitByIntervalKey[key], value);
    });
  }
  if ((0, _type.isString)(tickInterval)) {
    milliseconds = convertDateUnitToMilliseconds(tickInterval, 1);
  }
  return milliseconds;
};
// T375972
const tickIntervalToFormatMap = {
  millisecond: 'millisecond',
  second: 'longtime',
  minute: 'shorttime',
  hour: 'shorttime',
  day: 'day',
  week: 'day',
  month: 'month',
  quarter: 'quarter',
  year: 'year'
};
function getDateFormatByTickInterval(tickInterval) {
  const dateUnitInterval = getDateUnitInterval(tickInterval);
  return (dateUnitInterval && tickIntervalToFormatMap[dateUnitInterval]) ?? '';
}
const getQuarter = function getQuarter(month) {
  return Math.floor(month / 3);
};
const getFirstQuarterMonth = function getFirstQuarterMonth(month) {
  return getQuarter(month) * 3;
};
function correctDateWithUnitBeginning(date, dateInterval, withCorrection, firstDayOfWeek) {
  let result = new Date(date.getTime());
  const oldDate = new Date(date.getTime());
  const dateUnitInterval = getDateUnitInterval(dateInterval);
  switch (dateUnitInterval) {
    case 'second':
      result = new Date(Math.floor(oldDate.getTime() / 1000) * 1000);
      break;
    case 'minute':
      result = new Date(Math.floor(oldDate.getTime() / 60000) * 60000);
      break;
    case 'hour':
      result = new Date(Math.floor(oldDate.getTime() / 3600000) * 3600000);
      break;
    case 'year':
      result.setMonth(0);
    /* falls through */
    case 'month':
      result.setDate(1);
    /* falls through */
    case 'day':
      result.setHours(0, 0, 0, 0);
      break;
    case 'week':
      result = getFirstWeekDate(result, firstDayOfWeek || 0);
      result.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      {
        const firstQuarterMonth = getFirstQuarterMonth(result.getMonth());
        const month = result.getMonth();
        result.setDate(1);
        result.setHours(0, 0, 0, 0);
        if (month !== firstQuarterMonth) {
          result.setMonth(firstQuarterMonth);
        }
        break;
      }
    default:
      break;
  }
  if (withCorrection && dateUnitInterval !== 'hour' && dateUnitInterval !== 'minute' && dateUnitInterval !== 'second') {
    fixTimezoneGap(oldDate, result);
  }
  return result;
}
function trimTime(date) {
  return correctDateWithUnitBeginning(date, 'day');
}
const setToDayEnd = function setToDayEnd(date) {
  const result = trimTime(date);
  result.setDate(result.getDate() + 1);
  return new Date(result.getTime() - 1);
};
const getDatesDifferences = function getDatesDifferences(date1, date2) {
  let counter = 0;
  const differences = {
    year: date1.getFullYear() !== date2.getFullYear(),
    month: date1.getMonth() !== date2.getMonth(),
    day: date1.getDate() !== date2.getDate(),
    hour: date1.getHours() !== date2.getHours(),
    minute: date1.getMinutes() !== date2.getMinutes(),
    second: date1.getSeconds() !== date2.getSeconds(),
    millisecond: date1.getMilliseconds() !== date2.getMilliseconds(),
    count: 0
  };
  (0, _iterator.each)(differences, (key, value) => {
    if (value) {
      counter += 1;
    }
  });
  if (counter === 0 && getTimezonesDifference(date1, date2) !== 0) {
    differences.hour = true;
    counter += 1;
  }
  differences.count = counter;
  return differences;
};
function toDateInterval(interval) {
  if ((0, _type.isString)(interval)) {
    return getDateIntervalByString(interval.toLowerCase());
  }
  if ((0, _type.isNumeric)(interval)) {
    return convertMillisecondsToDateUnits(interval);
  }
  return interval;
}
function addDateInterval(value, interval, dir) {
  const result = new Date(value.getTime());
  const intervalObject = toDateInterval(interval);
  if (intervalObject.years) {
    result.setFullYear(result.getFullYear() + intervalObject.years * dir);
  }
  if (intervalObject.quarters) {
    result.setMonth(result.getMonth() + 3 * intervalObject.quarters * dir);
  }
  if (intervalObject.months) {
    result.setMonth(result.getMonth() + intervalObject.months * dir);
  }
  if (intervalObject.weeks) {
    result.setDate(result.getDate() + 7 * intervalObject.weeks * dir);
  }
  if (intervalObject.days) {
    result.setDate(result.getDate() + intervalObject.days * dir);
  }
  if (intervalObject.hours) {
    result.setTime(result.getTime() + intervalObject.hours * 3600000 * dir);
  }
  if (intervalObject.minutes) {
    result.setTime(result.getTime() + intervalObject.minutes * 60000 * dir);
  }
  if (intervalObject.seconds) {
    result.setTime(result.getTime() + intervalObject.seconds * 1000 * dir);
  }
  if (intervalObject.milliseconds) {
    result.setTime(result.getTime() + intervalObject.milliseconds * dir);
  }
  return result;
}
function addInterval(value, interval, isNegative) {
  const dir = isNegative ? -1 : +1;
  return (0, _type.isDate)(value) ? addDateInterval(value, interval, dir) : (0, _math.adjust)(value + Number(interval) * dir, Number(interval));
}
const getSequenceByInterval = function getSequenceByInterval(min, max, interval) {
  const intervals = [];
  let cur = min;
  intervals.push((0, _type.isDate)(min) ? new Date(min.getTime()) : min);
  while (cur < max) {
    cur = addInterval(cur, interval);
    intervals.push(cur);
  }
  return intervals;
};
const getViewFirstCellDate = function getViewFirstCellDate(viewType, date) {
  if (viewType === 'month') {
    return createDateWithFullYear(date.getFullYear(), date.getMonth(), 1);
  }
  if (viewType === 'year') {
    return createDateWithFullYear(date.getFullYear(), 0, date.getDate());
  }
  if (viewType === 'decade') {
    return createDateWithFullYear(getFirstYearInDecade(date), date.getMonth(), date.getDate());
  }
  if (viewType === 'century') {
    return createDateWithFullYear(getFirstDecadeInCentury(date), date.getMonth(), date.getDate());
  }
  return undefined;
};
const getViewLastCellDate = function getViewLastCellDate(viewType, date) {
  if (viewType === 'month') {
    return createDateWithFullYear(date.getFullYear(), date.getMonth(), getLastMonthDay(date));
  }
  if (viewType === 'year') {
    return createDateWithFullYear(date.getFullYear(), 11, date.getDate());
  }
  if (viewType === 'decade') {
    return createDateWithFullYear(getFirstYearInDecade(date) + 9, date.getMonth(), date.getDate());
  }
  if (viewType === 'century') {
    return createDateWithFullYear(getFirstDecadeInCentury(date) + 90, date.getMonth(), date.getDate());
  }
  return undefined;
};
const getViewMinBoundaryDate = function getViewMinBoundaryDate(viewType, date) {
  const resultDate = createDateWithFullYear(date.getFullYear(), date.getMonth(), 1);
  if (viewType === 'month') {
    return resultDate;
  }
  resultDate.setMonth(0);
  if (viewType === 'year') {
    return resultDate;
  }
  if (viewType === 'decade') {
    resultDate.setFullYear(getFirstYearInDecade(date));
  }
  if (viewType === 'century') {
    resultDate.setFullYear(getFirstDecadeInCentury(date));
  }
  return resultDate;
};
const getViewMaxBoundaryDate = function getViewMaxBoundaryDate(viewType, date) {
  const resultDate = new Date(date);
  resultDate.setDate(getLastMonthDay(date));
  if (viewType === 'month') {
    return resultDate;
  }
  resultDate.setMonth(11);
  resultDate.setDate(getLastMonthDay(resultDate));
  if (viewType === 'year') {
    return resultDate;
  }
  if (viewType === 'decade') {
    resultDate.setFullYear(getFirstYearInDecade(date) + 9);
  }
  if (viewType === 'century') {
    resultDate.setFullYear(getFirstDecadeInCentury(date) + 99);
  }
  return resultDate;
};
const getViewUp = function getViewUp(typeView) {
  switch (typeView) {
    case 'month':
      return 'year';
    case 'year':
      return 'decade';
    case 'decade':
      return 'century';
    default:
      break;
  }
  return undefined;
};
const getViewDown = function getViewDown(typeView) {
  switch (typeView) {
    case 'century':
      return 'decade';
    case 'decade':
      return 'year';
    case 'year':
      return 'month';
    default:
      break;
  }
  return undefined;
};
const getDifferenceInMonth = function getDifferenceInMonth(typeView) {
  let difference = 1;
  if (typeView === 'year') {
    difference = 12;
  }
  if (typeView === 'decade') {
    difference = 12 * 10;
  }
  if (typeView === 'century') {
    difference = 12 * 100;
  }
  return difference;
};
const getDifferenceInMonthForCells = function getDifferenceInMonthForCells(typeView) {
  let difference = 1;
  if (typeView === 'decade') {
    difference = 12;
  }
  if (typeView === 'century') {
    difference = 12 * 10;
  }
  return difference;
};
function sameYear(date1, date2) {
  return date1 && date2 && date1.getFullYear() === date2.getFullYear();
}
function sameMonthAndYear(date1, date2) {
  return date1 && date2 && sameYear(date1, date2) && date1.getMonth() === date2.getMonth();
}
function sameDate(date1, date2) {
  return date1 && date2 && sameMonthAndYear(date1, date2) && date1.getDate() === date2.getDate();
}
function sameHoursAndMinutes(date1, date2) {
  return date1 && date2 && date1.getHours() === date2.getHours() && date1.getMinutes() === date2.getMinutes();
}
const sameDecade = function sameDecade(date1, date2) {
  if (!(0, _type.isDefined)(date1) || !(0, _type.isDefined)(date2)) {
    return false;
  }
  const startDecadeDate1 = date1.getFullYear() - date1.getFullYear() % 10;
  const startDecadeDate2 = date2.getFullYear() - date2.getFullYear() % 10;
  return date1 && date2 && startDecadeDate1 === startDecadeDate2;
};
const sameCentury = function sameCentury(date1, date2) {
  if (!(0, _type.isDefined)(date1) || !(0, _type.isDefined)(date2)) {
    return false;
  }
  const startCenturyDate1 = date1.getFullYear() - date1.getFullYear() % 100;
  const startCenturyDate2 = date2.getFullYear() - date2.getFullYear() % 100;
  return date1 && date2 && startCenturyDate1 === startCenturyDate2;
};
const sameDatesArrays = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((date1, index) => {
    const date2 = arr2[index];
    if ([date1, date2].some(date => date !== null && !(date instanceof Date))) {
      return false;
    }
    if (date1 instanceof Date && date2 instanceof Date) {
      return sameDate(date1, date2);
    }
    return date1 === date2;
  });
};
const getShortDateFormat = function getShortDateFormat() {
  return 'yyyy/MM/dd';
};
function getFirstMonthDate(date) {
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!(0, _type.isDefined)(date)) {
    return undefined;
  }
  const currentDate = new Date(date.getTime());
  const month = currentDate.getMonth() + offset;
  currentDate.setMonth(month);
  return createDateWithFullYear(currentDate.getFullYear(), month, 1);
}
function getLastMonthDate(date) {
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!(0, _type.isDefined)(date)) {
    return undefined;
  }
  const currentDate = new Date(date.getTime());
  const month = currentDate.getMonth() + offset;
  currentDate.setMonth(month);
  return createDateWithFullYear(currentDate.getFullYear(), month + 1, 0);
}
function getUTCTime(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}
function getDayNumber(date) {
  const ms = getUTCTime(date) - getUTCTime(getFirstDateInYear(date.getFullYear()));
  return 1 + Math.floor(ms / (0, _toMilliseconds.toMilliseconds)('day'));
}
function getLastDateInYear(year) {
  return new Date(year, 11, 31);
}
function getDayWeekNumber(date, firstDayOfWeek) {
  let day = date.getDay() - firstDayOfWeek + 1;
  if (day <= 0) {
    day += DAYS_IN_WEEK;
  }
  return day;
}
function getWeekNumber(date, firstDayOfWeek, rule) {
  const firstWeekDayInYear = getDayWeekNumber(getFirstDateInYear(date.getFullYear()), firstDayOfWeek);
  const lastWeekDayInYear = getDayWeekNumber(getLastDateInYear(date.getFullYear()), firstDayOfWeek);
  const daysInFirstWeek = DAYS_IN_WEEK - firstWeekDayInYear + 1;
  let weekNumber = Math.ceil((getDayNumber(date) - daysInFirstWeek) / 7);
  switch (rule) {
    case 'fullWeek':
      {
        if (daysInFirstWeek === DAYS_IN_WEEK) {
          weekNumber += 1;
        }
        if (weekNumber === 0) {
          const lastDateInPreviousYear = getLastDateInYear(date.getFullYear() - 1);
          return getWeekNumber(lastDateInPreviousYear, firstDayOfWeek, rule);
        }
        return weekNumber;
      }
    case 'firstDay':
      {
        if (daysInFirstWeek > 0) {
          weekNumber += 1;
        }
        const isSunday = firstWeekDayInYear === SUNDAY_WEEK_NUMBER || lastWeekDayInYear === SUNDAY_WEEK_NUMBER;
        if (weekNumber > USUAL_WEEK_COUNT_IN_YEAR && !isSunday || weekNumber === 54) {
          weekNumber = 1;
        }
        return weekNumber;
      }
    case 'firstFourDays':
      {
        if (daysInFirstWeek > 3) {
          weekNumber += 1;
        }
        const isThursday = firstWeekDayInYear === THURSDAY_WEEK_NUMBER || lastWeekDayInYear === THURSDAY_WEEK_NUMBER;
        if (weekNumber > USUAL_WEEK_COUNT_IN_YEAR && !isThursday) {
          weekNumber = 1;
        }
        if (weekNumber === 0) {
          const lastDateInPreviousYear = getLastDateInYear(date.getFullYear() - 1);
          return getWeekNumber(lastDateInPreviousYear, firstDayOfWeek, rule);
        }
        return weekNumber;
      }
    default:
      return weekNumber;
      // removed by dead control flow

  }
}
const normalizeDateByWeek = function normalizeDateByWeek(date, currentDate) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- dateUtils is set below
  const differenceInDays = dateUtils.getDatesInterval(date, currentDate, 'day');
  let resultDate = new Date(date);
  if (differenceInDays >= 6) {
    resultDate = new Date(resultDate.setDate(resultDate.getDate() + 7));
  }
  return resultDate;
};
function dateInRange(date, min, max, format) {
  let dateValue = date;
  let minValue = min;
  let maxValue = max;
  if (format === 'date') {
    minValue = (0, _type.isDate)(minValue) ? trimTime(minValue) : minValue;
    maxValue = (0, _type.isDate)(maxValue) ? trimTime(maxValue) : maxValue;
    dateValue = (0, _type.isDate)(dateValue) ? trimTime(dateValue) : dateValue;
  }
  return normalizeDate(dateValue, minValue, maxValue) === dateValue;
}
const intervalsOverlap = function intervalsOverlap(options) {
  const {
    firstMin,
    firstMax,
    secondMin,
    secondMax
  } = options;
  return firstMin <= secondMin && secondMin <= firstMax || firstMin > secondMin && firstMin < secondMax || firstMin < secondMax && firstMax > secondMax;
};
const dateTimeFromDecimal = function dateTimeFromDecimal(number) {
  const hours = Math.floor(number);
  const minutes = Math.round(number % 1 * 60);
  return {
    hours,
    minutes
  };
};
const roundDateByStartDayHour = function roundDateByStartDayHour(date, startDayHour) {
  const startTime = this.dateTimeFromDecimal(startDayHour);
  const result = new Date(date);
  if (date.getHours() === startTime.hours && date.getMinutes() < startTime.minutes || date.getHours() < startTime.hours) {
    result.setHours(startTime.hours, startTime.minutes, 0, 0);
  }
  return result;
};
const roundToHour = function roundToHour(date) {
  const result = new Date(date.getTime());
  result.setHours(result.getHours() + 1);
  result.setMinutes(0);
  return result;
};
const makeDate = function makeDate(date) {
  return new Date(date);
};
const getDatesOfInterval = function getDatesOfInterval(startDate, endDate, step) {
  const result = [];
  let currentDate = new Date(startDate.getTime());
  while (currentDate < endDate) {
    result.push(new Date(currentDate.getTime()));
    currentDate = this.addInterval(currentDate, step);
  }
  return result;
};
const getMachineTimezoneName = () => {
  const hasIntl = typeof Intl !== 'undefined';
  return hasIntl ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
};
const getRangesByDates = dates => {
  const datesInMilliseconds = dates.map(value => correctDateWithUnitBeginning(value, 'day').getTime());
  const sortedDates = datesInMilliseconds.sort((a, b) => a - b);
  const msInDay = (0, _toMilliseconds.toMilliseconds)('day');
  const ranges = [];
  let startDate = sortedDates[0];
  for (let i = 1; i <= sortedDates.length; i += 1) {
    const nextDate = sortedDates[i];
    const currentDate = sortedDates[i - 1];
    const isNewRange = nextDate - currentDate > msInDay;
    if (isNewRange || i === sortedDates.length) {
      const serializedRange = startDate === sortedDates[i - 1] ? [_date_serialization.default.deserializeDate(startDate)] : [_date_serialization.default.deserializeDate(startDate), _date_serialization.default.deserializeDate(sortedDates[i - 1])];
      ranges.push(serializedRange);
      startDate = nextDate;
    }
  }
  return ranges;
};
const sameViewFunctions = {
  month: sameMonthAndYear,
  year: sameYear,
  decade: sameDecade,
  century: sameCentury
};
function sameView(view, date1, date2) {
  return sameViewFunctions[view](date1, date2);
}
const dateUtils = exports.dateUtils = {
  dateUnitIntervals,
  convertMillisecondsToDateUnits,
  dateToMilliseconds,
  getNextDateUnit,
  convertDateUnitToMilliseconds,
  getDateUnitInterval,
  getDateFormatByTickInterval,
  // T375972
  getDatesDifferences,
  correctDateWithUnitBeginning,
  trimTime,
  setToDayEnd,
  roundDateByStartDayHour,
  dateTimeFromDecimal,
  addDateInterval,
  addInterval,
  getSequenceByInterval,
  getDateIntervalByString,
  sameHoursAndMinutes,
  sameDate,
  sameMonthAndYear,
  sameMonth: sameMonthAndYear,
  sameYear,
  sameDecade,
  sameCentury,
  sameView,
  sameDatesArrays,
  getDifferenceInMonth,
  getDifferenceInMonthForCells,
  getFirstYearInDecade,
  getFirstDecadeInCentury,
  getShortDateFormat,
  getViewFirstCellDate,
  getViewLastCellDate,
  getViewDown,
  getViewUp,
  getLastMonthDay,
  getLastMonthDate,
  getFirstMonthDate,
  getFirstWeekDate,
  getWeekNumber,
  normalizeDateByWeek,
  getQuarter,
  getFirstQuarterMonth,
  dateInRange,
  intervalsOverlap,
  roundToHour,
  normalizeDate,
  getViewMinBoundaryDate,
  getViewMaxBoundaryDate,
  fixTimezoneGap,
  getTimezonesDifference,
  makeDate,
  getDatesInterval,
  getDatesOfInterval,
  createDateWithFullYear,
  getMachineTimezoneName,
  getRangesByDates
};
const addOffsets = function (date) {
  for (var _len2 = arguments.length, offsets = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    offsets[_key2 - 1] = arguments[_key2];
  }
  const newDateMs = offsets.reduce((result, offset) => result + offset, date.getTime());
  return new Date(newDateMs);
};
exports.addOffsets = addOffsets;
const isValidDate = date => Boolean(date && !isNaN(new Date(date).valueOf()));
exports.isValidDate = isValidDate;

/***/ },

/***/ 19153
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.dateSerialization = void 0;
var _default_date_names = _interopRequireDefault(__webpack_require__(81179));
var _date = __webpack_require__(86670);
var _config = _interopRequireDefault(__webpack_require__(66636));
var _type = __webpack_require__(11528);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const NUMBER_SERIALIZATION_FORMAT = 'number';
const DATE_SERIALIZATION_FORMAT = 'yyyy/MM/dd';
const DATETIME_SERIALIZATION_FORMAT = 'yyyy/MM/dd HH:mm:ss';
const ISO_PARTIAL_DATE_PATTERN = /^\d{4,}(-\d{2})?$/;
const ISO8601_PATTERN = /^(\d{4,})(-)?(\d{2})(-)?(\d{2})(?:T(\d{2})(:)?(\d{2})?(:)?(\d{2}(?:\.(\d{1,3})\d*)?)?)?(Z|([+-])(\d{2})(:)?(\d{2})?)?$/;
const ISO8601_TIME_PATTERN = /^(\d{2}):(\d{2})(:(\d{2}))?$/;
const ISO8601_PATTERN_PARTS = ['', 'yyyy', '', 'MM', '', 'dd', 'THH', '', 'mm', '', 'ss', '.SSS'];
const DATE_SERIALIZATION_PATTERN = /^(\d{4})\/(\d{2})\/(\d{2})$/;
const MILLISECOND_LENGHT = 3;
function getTimePart(part) {
  return +part || 0;
}
function createLocalDateFromUTCTimestamp(timestamp) {
  const utc = new Date(timestamp);
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}
function isISOPartialDateString(text) {
  return ISO_PARTIAL_DATE_PATTERN.test(text);
}
const getIso8601Format = function getIso8601Format(text,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
useUtc) {
  let parts = ISO8601_PATTERN.exec(text);
  let result = '';
  if (!parts) {
    parts = ISO8601_TIME_PATTERN.exec(text);
    if (parts) {
      return parts[3] ? 'HH:mm:ss' : 'HH:mm';
    }
    return undefined;
  }
  for (let i = 1; i < ISO8601_PATTERN_PARTS.length; i += 1) {
    if (parts[i]) {
      result += ISO8601_PATTERN_PARTS[i] || parts[i];
    }
  }
  if (parts[12] === 'Z') {
    result += '\'Z\'';
  }
  if (parts[14]) {
    if (parts[15]) {
      result += 'xxx';
    } else if (parts[16]) {
      result += 'xx';
    } else {
      result += 'x';
    }
  }
  return result;
};
const getDateSerializationFormat = function getDateSerializationFormat(value) {
  if (typeof value === 'number') {
    return NUMBER_SERIALIZATION_FORMAT;
  }
  if ((0, _type.isString)(value)) {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if below
    let format;
    if ((0, _config.default)().forceIsoDateParsing) {
      format = getIso8601Format(value);
    }
    if (format) {
      return format;
    }
    if (value.includes(':')) {
      return DATETIME_SERIALIZATION_FORMAT;
    }
    return DATE_SERIALIZATION_FORMAT;
  }
  if (value) {
    return null;
  }
  return undefined;
};
function parseDate(text) {
  const parsedValue = !(0, _type.isDate)(text) && Date.parse(String(text));
  if (!parsedValue && (0, _type.isString)(text) && getDateSerializationFormat(text) === DATE_SERIALIZATION_FORMAT) {
    const parts = DATE_SERIALIZATION_PATTERN.exec(text);
    if (parts) {
      const newDate = new Date(getTimePart(parts[1]), getTimePart(parts[2]), getTimePart(parts[3]));
      newDate.setFullYear(getTimePart(parts[1]));
      newDate.setMonth(getTimePart(parts[2]) - 1);
      newDate.setDate(getTimePart(parts[3]));
      return newDate;
    }
  }
  if (!(0, _type.isNumeric)(parsedValue)) {
    return text;
  }
  return isISOPartialDateString(String(text)) ? createLocalDateFromUTCTimestamp(parsedValue) : new Date(parsedValue);
}
function parseISO8601String(text) {
  let parts = ISO8601_PATTERN.exec(text);
  if (!parts) {
    parts = ISO8601_TIME_PATTERN.exec(text);
    if (parts) {
      return new Date(0, 0, 0, getTimePart(parts[1]), getTimePart(parts[2]), getTimePart(parts[4]));
    }
    return undefined;
  }
  const year = getTimePart(parts[1]);
  const month = Number(parts[3]) - 1;
  const day = Number(parts[5]);
  let timeZoneHour = 0;
  let timeZoneMinute = 0;
  const correctYear = d => {
    if (year < 100) {
      d.setFullYear(year);
    }
    return d;
  };
  timeZoneHour = getTimePart(parts[14]);
  timeZoneMinute = getTimePart(parts[16]);
  if (parts[13] === '-') {
    timeZoneHour = -timeZoneHour;
    timeZoneMinute = -timeZoneMinute;
  }
  const hour = getTimePart(parts[6]) - timeZoneHour;
  const minute = getTimePart(parts[8]) - timeZoneMinute;
  const second = getTimePart(parts[10]);
  const parseMilliseconds = function parseMilliseconds() {
    let part = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return getTimePart(part) * 10 ** (MILLISECOND_LENGHT - part.length);
  };
  const millisecond = parseMilliseconds(parts[11]);
  if (parts[12]) {
    return correctYear(new Date(Date.UTC(year, month, day, hour, minute, second, millisecond)));
  }
  return correctYear(new Date(year, month, day, hour, minute, second, millisecond));
}
function dateParser(text, skipISO8601Parsing) {
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if below
  let result;
  if ((0, _type.isString)(text) && !skipISO8601Parsing) {
    result = parseISO8601String(text);
  }
  return result ?? parseDate(text);
}
function deserializeDate(value) {
  if (typeof value === 'number') {
    return new Date(value);
  }
  return dateParser(value, !(0, _config.default)().forceIsoDateParsing);
}
function serializeDate(value, serializationFormat) {
  if (!serializationFormat) {
    return value;
  }
  if (!(0, _type.isDate)(value)) {
    return null;
  }
  if (serializationFormat === NUMBER_SERIALIZATION_FORMAT) {
    return value !== null && value !== void 0 && value.valueOf ? value.valueOf() : null;
  }
  return (0, _date.getFormatter)(serializationFormat, _default_date_names.default)(value);
}
const dateSerialization = exports.dateSerialization = {
  createLocalDateFromUTCTimestamp,
  dateParser,
  deserializeDate,
  serializeDate,
  getDateSerializationFormat
};

/***/ },

/***/ 54034
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
exports.error = error;
var _extend = __webpack_require__(52576);
var _string = __webpack_require__(54497);
var _version = __webpack_require__(1956);
var _console = _interopRequireDefault(__webpack_require__(24061));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ERROR_URL = `https://js.devexpress.com/error/${_version.version.split('.').slice(0, 2).join('_')}/`;
function error(baseErrors, errors) {
  function getErrorUrl(id) {
    return ERROR_URL + id;
  }
  function formatDetails(id, args) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- exports comes below
    const formatArgs = [exports.ERROR_MESSAGES[id], ...args];
    return _string.format.apply(this, formatArgs).replace(/\.*\s*?$/, '');
  }
  function formatMessage(id, details) {
    const kind = id !== null && id !== void 0 && id.startsWith('W') ? 'warning' : 'error';
    return _string.format.apply(this, ['{0} - {1}.\n\nFor additional information on this {2} message, see: {3}', id, details, kind, getErrorUrl(id)]);
  }
  function combineMessage(_ref) {
    let [id, ...details] = _ref;
    return formatMessage(id, formatDetails(id, details));
  }
  function makeError(_ref2) {
    let [id, ...args] = _ref2;
    const details = formatDetails(id, args);
    const url = getErrorUrl(id);
    const message = formatMessage(id, details);
    return (0, _extend.extend)(new Error(message), {
      __id: id,
      __details: details,
      url
    });
  }
  const exports = {
    ERROR_MESSAGES: (0, _extend.extend)(errors, baseErrors),
    Error: function Error() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return makeError(args);
    },
    log() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      const [id] = args;
      let method = 'log';
      if (/^E\d+$/.test(id)) {
        method = 'error';
      } else if (/^W\d+$/.test(id)) {
        method = 'warn';
      }
      _console.default.logger[method](method === 'log' ? id : combineMessage(args));
    }
  };
  return exports;
}
var _default = exports["default"] = error;

/***/ },

/***/ 35306
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.extendFromObject = exports.extend = void 0;
var _type = __webpack_require__(11528);
const extendFromObject = exports.extendFromObject = function extendFromObject(target, source, overrideExistingValues) {
  const result = target || {};
  // eslint-disable-next-line no-restricted-syntax -- the own keys are checked in the loop
  for (const prop in source) {
    if (Object.prototype.hasOwnProperty.call(source, prop)) {
      const value = source[prop];
      if (!(prop in result) || overrideExistingValues) {
        result[prop] = value;
      }
    }
  }
  return result;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the overloads type the result
const extend = exports.extend = function extend() {
  let target = (arguments.length <= 0 ? undefined : arguments[0]) || {};
  let i = 1;
  let deep = false;
  if (typeof target === 'boolean') {
    deep = target;
    target = (arguments.length <= 1 ? undefined : arguments[1]) || {};
    i += 1;
  }
  for (; i < arguments.length; i += 1) {
    const source = i < 0 || arguments.length <= i ? undefined : arguments[i];
    if (source == null) {
      // eslint-disable-next-line no-continue -- the sources that are not set are skipped
      continue;
    }
    // eslint-disable-next-line no-restricted-syntax, guard-for-in -- inherited keys are copied too
    for (const key in source) {
      const targetValue = target[key];
      const sourceValue = source[key];
      let sourceValueIsArray = false;
      // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the branches
      let clone;
      if (key === '__proto__' || key === 'constructor' || target === sourceValue) {
        // eslint-disable-next-line no-continue -- the keys that are not copied are skipped
        continue;
      }
      if (deep && sourceValue && ((0, _type.isPlainObject)(sourceValue)
      // eslint-disable-next-line no-cond-assign
      || (sourceValueIsArray = Array.isArray(sourceValue)))) {
        // eslint-disable-next-line max-depth -- the branch of the deep copy
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

/***/ },

/***/ 80892
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.each = each;
exports.map = map;
exports.reverseEach = reverseEach;
const hasLength = values => 'length' in values;
function map(values, callback) {
  if (Array.isArray(values)) {
    return values.map(callback);
  }
  const result = [];
  /* eslint-disable-next-line
    no-restricted-syntax, guard-for-in, @typescript-eslint/no-for-in-array
    -- inherited keys are mapped too */
  for (const key in values) {
    result.push(callback(values[key], key));
  }
  return result;
}
function each(values, callback) {
  if (!values) return undefined;
  if (hasLength(values)) {
    for (let i = 0; i < values.length; i += 1) {
      if (callback.call(values[i], i, values[i]) === false) {
        break;
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in values) {
      if (callback.call(values[key], key, values[key]) === false) {
        break;
      }
    }
  }
  return values;
}
function reverseEach(array, callback) {
  if (!array || !('length' in array) || array.length === 0) return;
  for (let i = array.length - 1; i >= 0; i -= 1) {
    if (callback.call(array[i], i, array[i]) === false) {
      break;
    }
  }
}

/***/ },

/***/ 12220
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.adjust = adjust;
exports.fitIntoRange = void 0;
exports.getExponent = getExponent;
exports.getExponentLength = getExponentLength;
exports.getPrecision = getPrecision;
exports.getRemainderByDivision = getRemainderByDivision;
exports.getRoot = getRoot;
exports.inRange = void 0;
exports.multiplyInExponentialForm = multiplyInExponentialForm;
exports.roundFloatPart = roundFloatPart;
exports.sign = exports.shiftIntegerByModule = void 0;
exports.solveCubicEquation = solveCubicEquation;
exports.trunc = trunc;
var _type = __webpack_require__(11528);
const sign = exports.sign = function sign(value) {
  if (value === 0) {
    return 0;
  }
  return value / Math.abs(value);
};
const fitIntoRange = exports.fitIntoRange = function fitIntoRange(value, minValue, maxValue) {
  const isMinValueUndefined = !minValue && minValue !== 0;
  const isMaxValueUndefined = !maxValue && maxValue !== 0;
  let min = value;
  let max = value;
  if (!isMinValueUndefined) {
    min = minValue;
  } else if (!isMaxValueUndefined) {
    min = Math.min(value, maxValue);
  }
  if (!isMaxValueUndefined) {
    max = maxValue;
  } else if (!isMinValueUndefined) {
    max = Math.max(value, minValue);
  }
  return Math.min(Math.max(value, min), max);
};
const inRange = exports.inRange = function inRange(value, minValue, maxValue) {
  // @ts-expect-error a missing bound makes the check false
  return value >= minValue && value <= maxValue;
};
function getExponent(value) {
  /* eslint-disable-next-line @typescript-eslint/naming-convention,
    @typescript-eslint/no-unused-vars */
  const [_, exponentString] = value.toExponential().split('e');
  return Math.abs(parseInt(exponentString, 10));
}
function getExponentialNotation(value) {
  const parts = value.toExponential().split('e');
  const mantissa = parseFloat(parts[0]);
  const exponent = parseInt(parts[1], 10);
  return {
    exponent,
    mantissa
  };
}
function multiplyInExponentialForm(value, exponentShift) {
  const exponentialNotation = getExponentialNotation(value);
  return parseFloat(`${exponentialNotation.mantissa}e${exponentialNotation.exponent + exponentShift}`);
}
const EXP_TO_CHANGE_NOTATION = 7;
const MAX_PRECISION = 15;
const MIN_PRECISION = 7;
function adjustExponential(value, precision) {
  const expValue = value.toExponential();
  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  const [mantissa, _exponent] = expValue.split('e');
  if (!mantissa.includes('.')) {
    return parseFloat(expValue);
  }
  return parseFloat(value.toPrecision(precision));
}
function getPrecision(value) {
  const str = value.toString();
  if (!str.includes('.')) {
    return 0;
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars,
    @typescript-eslint/naming-convention */
  const [_, fractionalPart] = str.split('.');
  const positionOfDelimiter = fractionalPart.indexOf('e');
  return positionOfDelimiter >= 0 ? positionOfDelimiter : fractionalPart.length;
}
function adjust(value, interval) {
  const absValue = Math.abs(value);
  const integerPart = absValue > 1 ? 10 : 0;
  const precision = getPrecision(interval ?? 0) + 2;
  const finalPrecision = precision > EXP_TO_CHANGE_NOTATION ? MAX_PRECISION : MIN_PRECISION;
  const [integerValuePart, fractionalValuePart] = value.toString().split('.');
  const sourceValue = value;
  const isExponentValue = (0, _type.isExponential)(value);
  if (isExponentValue) {
    return adjustExponential(value, finalPrecision);
  }
  if (!fractionalValuePart) {
    return value;
  }
  if ((0, _type.isExponential)(interval)) {
    const expPrecision = integerValuePart.length + getExponent(interval);
    return parseFloat(sourceValue.toPrecision(expPrecision));
  }
  const fractionalPart = absValue - Math.floor(absValue);
  const adjustedValue = integerPart + fractionalPart;
  const separatedAdjustedValue = parseFloat(adjustedValue.toPrecision(finalPrecision)).toString().split('.');
  const isIntPartNotChanged = separatedAdjustedValue[0] === integerPart.toString();
  if (isIntPartNotChanged) {
    return parseFloat(`${integerValuePart}.${separatedAdjustedValue[1]}`);
  }
  return parseFloat(sourceValue.toPrecision(finalPrecision));
}
function getRoot(x, n) {
  if (x < 0 && n % 2 !== 1) {
    return NaN;
  }
  const y = Math.abs(x) ** (1 / n);
  return n % 2 === 1 && x < 0 ? -y : y;
}
function solveCubicEquation(coefA, coefB, coefC, d) {
  let a = coefA;
  let b = coefB;
  let c = coefC;
  const min = 1e-8;
  if (Math.abs(a) < min) {
    a = b;
    b = c;
    c = d;
    if (Math.abs(a) < min) {
      a = b;
      b = c;
      if (Math.abs(a) < min) {
        return [];
      }
      return [-b / a];
    }
    const D2 = b * b - 4 * a * c;
    if (Math.abs(D2) < min) {
      return [-b / (2 * a)];
    }
    if (D2 > 0) {
      return [(-b + Math.sqrt(D2)) / (2 * a), (-b - Math.sqrt(D2)) / (2 * a)];
    }
    return [];
  }
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  let roots = [];
  if (Math.abs(p) < min) {
    roots = [getRoot(-q, 3)];
  } else if (Math.abs(q) < min) {
    roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
  } else {
    const D3 = q * q / 4 + p * p * p / 27;
    if (Math.abs(D3) < min) {
      roots = [-1.5 * q / p, 3 * q / p];
    } else if (D3 > 0) {
      const u = getRoot(-q / 2 - Math.sqrt(D3), 3);
      roots = [u - p / (3 * u)];
    } else {
      const u = 2 * Math.sqrt(-p / 3);
      const t = Math.acos(3 * q / p / u) / 3;
      const k = 2 * Math.PI / 3;
      roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
    }
  }
  for (let i = 0; i < roots.length; i += 1) {
    roots[i] -= b / (3 * a);
  }
  return roots;
}
function trunc(value) {
  if (Math.trunc) {
    return Math.trunc(value);
  }
  return value > 0 ? Math.floor(value) : Math.ceil(value);
}
function roundFloatPart(value) {
  let digitsCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return parseFloat(value.toFixed(digitsCount));
}
function getRemainderByDivision(dividend, divider, digitsCount) {
  // @ts-expect-error parseInt truncates the number
  if (divider === parseInt(divider, 10)) {
    return dividend % divider;
  }
  const quotient = roundFloatPart(dividend / divider, digitsCount);
  // @ts-expect-error parseInt truncates the number
  return (quotient - parseInt(quotient, 10)) * divider;
}
function getExponentLength(value) {
  var _valueString$split$;
  const valueString = value.toString();
  return ((_valueString$split$ = valueString.split('.')[1]) === null || _valueString$split$ === void 0 ? void 0 : _valueString$split$.length) || parseInt(valueString.split('e-')[1], 10) || 0;
}
const shiftIntegerByModule = (integerValue, moduleValue) => {
  if (!Number.isInteger(integerValue)) {
    throw Error(`Passed integer value ${integerValue} is not an integer.`);
  }
  if (!Number.isInteger(moduleValue)) {
    throw Error(`Passed module value ${moduleValue} is not an integer.`);
  }
  if (moduleValue <= 0) {
    throw Error(`Passed module value ${moduleValue} must be > 0.`);
  }
  const normalizedInteger = integerValue % moduleValue;
  switch (true) {
    // NOTE: In some cases we can have -0 or +0 values.
    // So this is why we handle zero as separate case here.
    case normalizedInteger === 0:
      return 0;
    case normalizedInteger > 0:
      return normalizedInteger;
    case normalizedInteger < 0:
      return moduleValue + normalizedInteger;
    default:
      throw Error(`Unexpected division (${integerValue} % ${moduleValue}) occurred.`);
  }
};
exports.shiftIntegerByModule = shiftIntegerByModule;

/***/ },

/***/ 40335
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.encodeHtml = void 0;
exports.format = format;
exports.quadToObject = exports.isEmpty = void 0;
var _type = __webpack_require__(11528);
const encodeHtml = exports.encodeHtml = function createEncodeHtml() {
  const encodeRegExp = [new RegExp('&', 'g'), new RegExp('"', 'g'), new RegExp('\'', 'g'), new RegExp('<', 'g'), new RegExp('>', 'g')];
  return function encode(str) {
    return String(str).replace(encodeRegExp[0], '&amp;').replace(encodeRegExp[1], '&quot;').replace(encodeRegExp[2], '&#39;').replace(encodeRegExp[3], '&lt;').replace(encodeRegExp[4], '&gt;');
  };
}();
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the parts, or the raw value itself
const splitQuad = function splitQuad(raw) {
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
const quadToObject = exports.quadToObject = function quadToObject(raw) {
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
function format(template) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }
  if ((0, _type.isFunction)(template)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- the function is untyped
    return template(...values);
  }
  let result = template;
  values.forEach((value, index) => {
    const replacement = (0, _type.isString)(value) ? value.replace(/\$/g, '$$$$') : value;
    const placeholderReg = new RegExp(`\\{${index}\\}`, 'gm');
    result = result.replace(placeholderReg, replacement);
  });
  return result;
}
const isEmpty = exports.isEmpty = function createIsEmpty() {
  const SPACE_REGEXP = /\s/g;
  return function isEmptyText(text) {
    return !text || !text.replace(SPACE_REGEXP, '');
  };
}();

/***/ },

/***/ 71374
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
const type = exports.type = function type(object) {
  if (object === null) {
    return 'null';
  }
  const typeOfObject = Object.prototype.toString.call(object);
  return typeof object === 'object' ? types[typeOfObject] ?? 'object' : typeof object;
};
const isBoolean = exports.isBoolean = function isBoolean(object) {
  return typeof object === 'boolean';
};
const isNumeric = exports.isNumeric = function isNumeric(object) {
  return typeof object === 'number' && isFinite(object)
  // @ts-expect-error the check converts any value to a number
  || !isNaN(object - parseFloat(object));
};
const isExponential = exports.isExponential = function isExponential(value) {
  // @ts-expect-error a numeric value is neither null nor undefined
  return isNumeric(value) && value.toString().indexOf('e') !== -1;
};
const isDate = exports.isDate = function isDate(object) {
  return type(object) === 'date';
};
const isDefined = exports.isDefined = function isDefined(object) {
  return object !== null && object !== undefined;
};
const isFunction = exports.isFunction = function isFunction(object) {
  return typeof object === 'function';
};
const isString = exports.isString = function isString(object) {
  return typeof object === 'string';
};
const isObject = exports.isObject = function isObject(object) {
  return type(object) === 'object';
};
const isEmptyObject = exports.isEmptyObject = function isEmptyObject(object) {
  // @ts-expect-error for...in reads the keys of any value
  // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unreachable-loop -- any key
  for (const property in object) {
    return false;
  }
  return true;
};
const isPlainObject = exports.isPlainObject = function isPlainObject(object) {
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
const isPrimitive = exports.isPrimitive = function isPrimitive(value) {
  return !['object', 'array', 'function'].includes(type(value));
};
const isWindow = exports.isWindow = function isWindow(object) {
  return object != null && object === object.window;
};
const isRenderer = exports.isRenderer = function isRenderer(object) {
  const wrapper = object;
  return !!wrapper && !!(wrapper.jquery || wrapper.dxRenderer);
};
const isPromise = exports.isPromise = function isPromise(object) {
  return !!object && isFunction(object.then);
};
const isDeferred = exports.isDeferred = function isDeferred(object) {
  return !!object && isFunction(object.done) && isFunction(object.fail);
};
const isEvent = exports.isEvent = function isEvent(object) {
  return !!(object && object.preventDefault);
};
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

/***/ 93652
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _errors = _interopRequireDefault(__webpack_require__(83867));
var _error = _interopRequireDefault(__webpack_require__(54034));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports["default"] = (0, _error.default)(_errors.default.ERROR_MESSAGES, {
  E1001: 'Module \'{0}\'. Controller \'{1}\' is already registered',
  E1002: 'Module \'{0}\'. Controller \'{1}\' does not inherit from DevExpress.ui.dxDataGrid.Controller',
  E1003: 'Module \'{0}\'. View \'{1}\' is already registered',
  E1004: 'Module \'{0}\'. View \'{1}\' does not inherit from DevExpress.ui.dxDataGrid.View',
  E1005: 'Public method \'{0}\' is already registered',
  E1006: 'Public method \'{0}.{1}\' does not exist',
  E1007: 'State storing cannot be provided due to the restrictions of the browser',
  E1010: 'The template does not contain the TextBox widget',
  E1011: 'Items cannot be deleted from the List. Implement the "remove" function in the data store',
  E1012: 'Editing type \'{0}\' with the name \'{1}\' is unsupported',
  E1016: 'Unexpected type of data source is provided for a lookup column',
  E1018: 'The \'collapseAll\' method cannot be called if you use a remote data source',
  E1019: 'Search mode \'{0}\' is unavailable',
  E1020: 'The type cannot be changed after initialization',
  E1021: '{0} \'{1}\' you are trying to remove does not exist',
  E1022: 'The "markers" option is given an invalid value. Assign an array instead',
  E1023: 'The "routes" option is given an invalid value. Assign an array instead',
  E1025: 'This layout is too complex to render',
  E1026: 'The "calculateCustomSummary" function is missing from a field whose "summaryType" option is set to "custom"',
  E1031: 'Unknown subscription in the Scheduler widget: \'{0}\'',
  E1032: 'Unknown start date in an appointment: \'{0}\'',
  E1033: 'Unknown step in the date navigator: \'{0}\'',
  E1034: 'The browser does not implement an API for saving files',
  E1035: 'The editor cannot be created: {0}',
  E1037: 'Invalid structure of grouped data',
  E1038: 'The browser does not support local storages for local web pages',
  E1039: 'A cell\'s position cannot be calculated',
  E1040: 'The \'{0}\' key value is not unique within the data array',
  E1041: 'The \'{0}\' script is referenced after the DevExtreme scripts or not referenced at all',
  E1042: '{0} requires the key field to be specified',
  E1043: 'Changes cannot be processed due to the incorrectly set key',
  E1044: 'The key field specified by the keyExpr option does not match the key field specified in the data store',
  E1045: 'Editing requires the key field to be specified in the data store',
  E1046: 'The \'{0}\' key field is not found in data objects',
  E1047: 'The "{0}" field is not found in the fields array',
  E1048: 'The "{0}" operation is not found in the filterOperations array',
  E1049: 'Column \'{0}\': filtering is allowed but the \'dataField\' or \'name\' option is not specified',
  E1050: 'The validationRules option does not apply to third-party editors defined in the editCellTemplate',
  E1052: '{0} should have the "dataSource" option specified',
  E1053: 'The "buttons" option accepts an array that contains only objects or string values',
  E1054: 'All text editor buttons must have names',
  E1055: 'One or several text editor buttons have invalid or non-unique "name" values',
  E1056: 'The {0} widget does not support buttons of the "{1}" type',
  // NOTE:
  // E1057 is reserved. See https://js.devexpress.com/Documentation/19_2/ApiReference/UI_Widgets/Errors_and_Warnings/#E1057
  E1058: 'The "startDayHour" and "endDayHour" options must be integers in the [0, 24] range, with "endDayHour" being greater than "startDayHour".',
  E1059: 'The following column names are not unique: {0}',
  E1060: 'All editable columns must have names',
  E1061: 'The "offset" option must be an integer in the [-1440, 1440] range, divisible by 5 without a remainder.',
  E1062: 'The "cellDuration" must be a positive integer, evenly dividing the ("endDayHour" - "startDayHour") interval into minutes.',
  E1063: 'The \'smartPaste(text)\' method was called, but \'aiIntegration\' is not configured.',
  E1064: 'AI returned {1} for the {0} field, but this field only accepts {2} values. Update the \'instruction\' for this field.',
  E1065: 'The browser does not support Web Speech API (SpeechRecognition)',
  E1066: 'All AI columns must have names.',
  E1067: '\'aiIntegration\' is not configured in the {0} column.',
  E1068: '\'aiIntegration\' is not configured for the AI Assistant.',
  E1069: 'Could not find a compatible version of OpenLayers. Load a supported version before Map initialization.',
  W1001: 'The "key" option cannot be modified after initialization',
  W1002: 'An item with the key \'{0}\' does not exist',
  W1003: 'A group with the key \'{0}\' in which you are trying to select items does not exist',
  W1004: 'The item \'{0}\' you are trying to select in the group \'{1}\' does not exist',
  W1005: 'Due to column data types being unspecified, data has been loaded twice in order to apply initial filter settings. To resolve this issue, specify data types for all grid columns.',
  W1006: 'The map service returned the following error: \'{0}\'',
  W1007: 'No item with key {0} was found in the data source, but this key was used as the parent key for item {1}',
  W1008: 'Cannot scroll to the \'{0}\' date because it does not exist on the current view',
  W1009: 'Searching works only if data is specified using the dataSource option',
  W1010: 'The capability to select all items works with source data of plain structure only',
  W1011: 'The "keyExpr" option is not applied when dataSource is not an array',
  W1012: 'The \'{0}\' key field is not found in data objects',
  W1013: 'The "message" field in the dialog component was renamed to "messageHtml". Change your code correspondingly. In addition, if you used HTML code in the message, make sure that it is secure',
  W1014: 'The Floating Action Button exceeds the recommended speed dial action count. If you need to display more speed dial actions, increase the maxSpeedDialActionCount option value in the global config.',
  W1017: 'The \'key\' property is not specified for a lookup data source. Please specify it to prevent requests for the entire dataset when users filter data.',
  W1018: 'Infinite scrolling may not work properly with multiple selection. To use these features together, set \'selection.deferred\' to true or set \'selection.selectAllMode\' to \'page\'.',
  W1019: 'Filter query string exceeds maximum length limit of {0} characters.',
  W1020: 'hideEvent is ignored when the shading property is true',
  W1021: 'The \'{0}\' is not rendered because none of the DOM elements match the value of the "container" property.',
  W1022: '{0} JSON parsing error: \'{1}\'',
  W1023: 'Appointments require unique keys. Otherwise, the agenda view may not work correctly.',
  W1024: 'The client-side export is enabled. Implement the \'onExporting\' function.',
  W1025: '\'scrolling.mode\' is set to \'virtual\' or \'infinite\'. Specify the height of the component.',
  W1026: 'The \'ai\' toolbar item is defined, but aiIntegration is missing.',
  W1027: 'A prompt should be specified for a custom command.',
  W1028: 'Nested/banded columns do not support the following properties: {0}.',
  W1029: '\'hiddenWeekDays\' must leave at least one weekday visible.',
  W1030: '\'tileServer\' is not configured for the OSM map provider.',
  W1031: '\'calculateLocation\' is not configured for the OSM map provider.',
  W1032: '\'attribution\' is not configured for the OSM tile server.',
  W1033: '\'calculateRoute\' is not configured for the OSM map provider.'
});

/***/ },

/***/ 98034
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convertTo01Bounds = convertTo01Bounds;
exports.getRelativeLuminance = getRelativeLuminance;
exports.hslToRgb = hslToRgb;
exports.hsvToRgb = hsvToRgb;
exports.hueToRgb = hueToRgb;
exports.isIntegerBetweenMinAndMax = isIntegerBetweenMinAndMax;
exports.makeColorTint = makeColorTint;
exports.modifyColorTint = modifyColorTint;
exports.normalize = normalize;
exports.parseColor = parseColor;
exports.toHexFromRgb = toHexFromRgb;
exports.toHslFromRgb = toHslFromRgb;
exports.toHsvFromRgb = toHsvFromRgb;
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
  let tint = colorTint;
  if (tint < 0) {
    tint += 1;
  }
  if (tint > 1) {
    tint -= 1;
  }
  return tint;
}
function hueToRgb(p, q, colorTint) {
  const tint = modifyColorTint(colorTint);
  if (tint < 1 / 6) {
    return p + (q - p) * 6 * tint;
  }
  if (tint < 1 / 2) {
    return q;
  }
  if (tint < 2 / 3) {
    return p + (q - p) * (2 / 3 - tint) * 6;
  }
  return p;
}
function convertTo01Bounds(n, max) {
  const bounded = Math.min(max, Math.max(0, n));
  if (Math.abs(bounded - max) < 0.000001) {
    return 1;
  }
  return bounded % max / max;
}
function hsvToRgb(h, s, v) {
  const index = Math.floor(h % 360 / 60);
  const vMin = (100 - s) * v / 100;
  const a = (v - vMin) * (h % 60 / 60);
  const vInc = vMin + a;
  const vDec = v - a;
  let r = 0;
  let g = 0;
  let b = 0;
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
function hslToRgb(h, s, l) {
  let r = 0;
  let g = 0;
  let b = 0;
  const h01 = convertTo01Bounds(h, 360);
  const s01 = convertTo01Bounds(s, 100);
  const l01 = convertTo01Bounds(l, 100);
  if (s01 === 0) {
    r = l01;
    g = l01;
    b = l01;
  } else {
    const q = l01 < 0.5 ? l01 * (1 + s01) : l01 + s01 - l01 * s01;
    const p = 2 * l01 - q;
    r = hueToRgb(p, q, makeColorTint('r', h01));
    g = hueToRgb(p, q, makeColorTint('g', h01));
    b = hueToRgb(p, q, makeColorTint('b', h01));
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
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
function parseColor(color) {
  if (color === 'transparent') {
    return [0, 0, 0, 0];
  }
  for (const colorType of standardColorTypes) {
    const match = colorType.re.exec(color);
    if (match) {
      return colorType.process(match);
    }
  }
  return null;
}
function normalize(colorComponent) {
  let def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 255;
  if (colorComponent === undefined || Number.isNaN(colorComponent) || colorComponent < 0) {
    return def;
  }
  return colorComponent > max ? max : colorComponent;
}
function toHexFromRgb(r, g, b) {
  // eslint-disable-next-line no-bitwise
  return `#${(0X01000000 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
function toHsvFromRgb(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let H = 0;
  let S = 0;
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
      return 0;
    // unreachable: max is always one of r, g, b
  }
}
function toHslFromRgb(r, g, b) {
  const r01 = convertTo01Bounds(r, 255);
  const g01 = convertTo01Bounds(g, 255);
  const b01 = convertTo01Bounds(b, 255);
  const max = Math.max(r01, g01, b01);
  const min = Math.min(r01, g01, b01);
  const maxMinSum = max + min;
  let h = 0;
  let s = 0;
  const l = maxMinSum / 2;
  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const delta = max - min;
    if (l > 0.5) {
      s = delta / (2 - maxMinSum);
    } else {
      s = delta / maxMinSum;
    }
    h = calculateHue(r01, g01, b01, delta);
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
function toLinearChannel(value) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}
// eslint-disable-next-line spellcheck/spell-checker
function getRelativeLuminance(r, g, b) {
  return 0.2126 * toLinearChannel(r) + 0.7152 * toLinearChannel(g) + 0.0722 * toLinearChannel(b);
}
function isIntegerBetweenMinAndMax(value) {
  let min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 255;
  if (typeof value !== 'number' || value % 1 !== 0 || value < min || value > max || isNaN(value)) {
    return false;
  }
  return true;
}

/***/ },

/***/ 24491
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.toMilliseconds = toMilliseconds;
const timeIntervals = {
  millisecond: 1,
  second: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  quarter: 1000 * 60 * 60 * 24 * 30 * 3,
  year: 1000 * 60 * 60 * 24 * 365
};
function toMilliseconds(value) {
  return timeIntervals[value];
}

/***/ },

/***/ 63223
(module, __unused_webpack_exports, __webpack_require__) {



var _aiIntegration = __webpack_require__(94977);
/* global DevExpress */
/* eslint-disable import/no-commonjs */

DevExpress.aiIntegration = {};
module.exports = DevExpress.aiIntegration.AIIntegration = _aiIntegration.AIIntegration;

/***/ },

/***/ 43101
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _color = _interopRequireDefault(__webpack_require__(24267));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// deprecated
var _default = exports["default"] = _color.default;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 83077
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "Guid", ({
  enumerable: true,
  get: function () {
    return _guid.default;
  }
}));
Object.defineProperty(exports, "config", ({
  enumerable: true,
  get: function () {
    return _config.default;
  }
}));
Object.defineProperty(exports, "setTemplateEngine", ({
  enumerable: true,
  get: function () {
    return _set_template_engine.default;
  }
}));
var _config = _interopRequireDefault(__webpack_require__(66518));
var _guid = _interopRequireDefault(__webpack_require__(71037));
var _set_template_engine = _interopRequireDefault(__webpack_require__(32480));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }

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

/***/ 66518
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _config = _interopRequireDefault(__webpack_require__(96446));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
    * @name GlobalConfig.useJQuery
    * @type boolean
    * @hidden
    */
var _default = exports["default"] = _config.default;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 81179
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _default_date_names = _interopRequireDefault(__webpack_require__(4445));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// deprecated
var _default = exports["default"] = _default_date_names.default;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 86670
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "getFormatter", ({
  enumerable: true,
  get: function () {
    return _date.getFormatter;
  }
}));
var _date = __webpack_require__(19632);

/***/ },

/***/ 71037
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _guid = __webpack_require__(28197);
/**
    * @name Guid.ctor
    * @publicName ctor()
    */
/**
    * @name Guid.ctor
    * @publicName ctor(value)
    * @param1 value:string
    */
var _default = exports["default"] = _guid.Guid;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 32480
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _template_engine_registry = __webpack_require__(35155);
var _default = exports["default"] = _template_engine_registry.setTemplateEngine;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 66636
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _common = __webpack_require__(83077);
var _default = exports["default"] = _common.config;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 87129
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _errors = _interopRequireDefault(__webpack_require__(83867));
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
    * @name ErrorsCore.E0123
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
    * @name ErrorsCore.W0023
    */
/**
    * @name ErrorsCore.W0024
    */
/**
    * @name ErrorsCore.W0025
    */
var _default = exports["default"] = _errors.default;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 35155
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "getCurrentTemplateEngine", ({
  enumerable: true,
  get: function () {
    return _template_engine_registry.getCurrentTemplateEngine;
  }
}));
Object.defineProperty(exports, "registerTemplateEngine", ({
  enumerable: true,
  get: function () {
    return _template_engine_registry.registerTemplateEngine;
  }
}));
Object.defineProperty(exports, "setTemplateEngine", ({
  enumerable: true,
  get: function () {
    return _template_engine_registry.setTemplateEngine;
  }
}));
var _template_engine_registry = __webpack_require__(93373);

/***/ },

/***/ 71051
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _date_serialization = __webpack_require__(19153);
// deprecated
var _default = exports["default"] = _date_serialization.dateSerialization;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 67264
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _error = __webpack_require__(54034);
// deprecated
var _default = exports["default"] = _error.error;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ },

/***/ 52576
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "extend", ({
  enumerable: true,
  get: function () {
    return _extend.extend;
  }
}));
Object.defineProperty(exports, "extendFromObject", ({
  enumerable: true,
  get: function () {
    return _extend.extendFromObject;
  }
}));
var _extend = __webpack_require__(35306);

/***/ },

/***/ 21274
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "each", ({
  enumerable: true,
  get: function () {
    return _iterator.each;
  }
}));
Object.defineProperty(exports, "map", ({
  enumerable: true,
  get: function () {
    return _iterator.map;
  }
}));
Object.defineProperty(exports, "reverseEach", ({
  enumerable: true,
  get: function () {
    return _iterator.reverseEach;
  }
}));
var _iterator = __webpack_require__(80892);

/***/ },

/***/ 50254
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "adjust", ({
  enumerable: true,
  get: function () {
    return _math.adjust;
  }
}));
Object.defineProperty(exports, "fitIntoRange", ({
  enumerable: true,
  get: function () {
    return _math.fitIntoRange;
  }
}));
Object.defineProperty(exports, "getExponent", ({
  enumerable: true,
  get: function () {
    return _math.getExponent;
  }
}));
Object.defineProperty(exports, "getExponentLength", ({
  enumerable: true,
  get: function () {
    return _math.getExponentLength;
  }
}));
Object.defineProperty(exports, "getPrecision", ({
  enumerable: true,
  get: function () {
    return _math.getPrecision;
  }
}));
Object.defineProperty(exports, "getRemainderByDivision", ({
  enumerable: true,
  get: function () {
    return _math.getRemainderByDivision;
  }
}));
Object.defineProperty(exports, "getRoot", ({
  enumerable: true,
  get: function () {
    return _math.getRoot;
  }
}));
Object.defineProperty(exports, "inRange", ({
  enumerable: true,
  get: function () {
    return _math.inRange;
  }
}));
Object.defineProperty(exports, "multiplyInExponentialForm", ({
  enumerable: true,
  get: function () {
    return _math.multiplyInExponentialForm;
  }
}));
Object.defineProperty(exports, "roundFloatPart", ({
  enumerable: true,
  get: function () {
    return _math.roundFloatPart;
  }
}));
Object.defineProperty(exports, "sign", ({
  enumerable: true,
  get: function () {
    return _math.sign;
  }
}));
Object.defineProperty(exports, "solveCubicEquation", ({
  enumerable: true,
  get: function () {
    return _math.solveCubicEquation;
  }
}));
Object.defineProperty(exports, "trunc", ({
  enumerable: true,
  get: function () {
    return _math.trunc;
  }
}));
var _math = __webpack_require__(12220);

/***/ },

/***/ 54497
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "encodeHtml", ({
  enumerable: true,
  get: function () {
    return _string.encodeHtml;
  }
}));
Object.defineProperty(exports, "format", ({
  enumerable: true,
  get: function () {
    return _string.format;
  }
}));
Object.defineProperty(exports, "isEmpty", ({
  enumerable: true,
  get: function () {
    return _string.isEmpty;
  }
}));
Object.defineProperty(exports, "quadToObject", ({
  enumerable: true,
  get: function () {
    return _string.quadToObject;
  }
}));
var _string = __webpack_require__(40335);

/***/ },

/***/ 11528
(__unused_webpack_module, exports, __webpack_require__) {



Object.defineProperty(exports, "isBoolean", ({
  enumerable: true,
  get: function () {
    return _type.isBoolean;
  }
}));
Object.defineProperty(exports, "isDate", ({
  enumerable: true,
  get: function () {
    return _type.isDate;
  }
}));
Object.defineProperty(exports, "isDeferred", ({
  enumerable: true,
  get: function () {
    return _type.isDeferred;
  }
}));
Object.defineProperty(exports, "isDefined", ({
  enumerable: true,
  get: function () {
    return _type.isDefined;
  }
}));
Object.defineProperty(exports, "isEmptyObject", ({
  enumerable: true,
  get: function () {
    return _type.isEmptyObject;
  }
}));
Object.defineProperty(exports, "isEvent", ({
  enumerable: true,
  get: function () {
    return _type.isEvent;
  }
}));
Object.defineProperty(exports, "isExponential", ({
  enumerable: true,
  get: function () {
    return _type.isExponential;
  }
}));
Object.defineProperty(exports, "isFunction", ({
  enumerable: true,
  get: function () {
    return _type.isFunction;
  }
}));
Object.defineProperty(exports, "isNumeric", ({
  enumerable: true,
  get: function () {
    return _type.isNumeric;
  }
}));
Object.defineProperty(exports, "isObject", ({
  enumerable: true,
  get: function () {
    return _type.isObject;
  }
}));
Object.defineProperty(exports, "isPlainObject", ({
  enumerable: true,
  get: function () {
    return _type.isPlainObject;
  }
}));
Object.defineProperty(exports, "isPrimitive", ({
  enumerable: true,
  get: function () {
    return _type.isPrimitive;
  }
}));
Object.defineProperty(exports, "isPromise", ({
  enumerable: true,
  get: function () {
    return _type.isPromise;
  }
}));
Object.defineProperty(exports, "isRenderer", ({
  enumerable: true,
  get: function () {
    return _type.isRenderer;
  }
}));
Object.defineProperty(exports, "isString", ({
  enumerable: true,
  get: function () {
    return _type.isString;
  }
}));
Object.defineProperty(exports, "isWindow", ({
  enumerable: true,
  get: function () {
    return _type.isWindow;
  }
}));
Object.defineProperty(exports, "type", ({
  enumerable: true,
  get: function () {
    return _type.type;
  }
}));
var _type = __webpack_require__(71374);

/***/ },

/***/ 1956
(__unused_webpack_module, exports) {



exports.version = exports.fullVersion = void 0;
const version = exports.version = '26.2.0';
const fullVersion = exports.fullVersion = '26.2.0';

/***/ },

/***/ 35185
(module, exports, __webpack_require__) {



exports["default"] = void 0;
var _errors = _interopRequireDefault(__webpack_require__(93652));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
    * @docid
    * @name ErrorsUIWidgets
    */
/**
    * @name ErrorsUIWidgets.E1001
    */
/**
    * @name ErrorsUIWidgets.E1002
    */
/**
    * @name ErrorsUIWidgets.E1003
    */
/**
    * @name ErrorsUIWidgets.E1004
    */
/**
    * @name ErrorsUIWidgets.E1005
    */
/**
    * @name ErrorsUIWidgets.E1006
    */
/**
    * @name ErrorsUIWidgets.E1007
    */
/**
    * @name ErrorsUIWidgets.E1010
    */
/**
    * @name ErrorsUIWidgets.E1011
    */
/**
    * @name ErrorsUIWidgets.E1012
    */
/**
    * @name ErrorsUIWidgets.E1016
    */
/**
    * @name ErrorsUIWidgets.E1018
    */
/**
    * @name ErrorsUIWidgets.E1019
    */
/**
    * @name ErrorsUIWidgets.E1020
    */
/**
    * @name ErrorsUIWidgets.E1021
    */
/**
    * @name ErrorsUIWidgets.E1022
    */
/**
    * @name ErrorsUIWidgets.E1023
    */
/**
    * @name ErrorsUIWidgets.E1025
    */
/**
    * @name ErrorsUIWidgets.E1026
    */
/**
    * @name ErrorsUIWidgets.E1031
    */
/**
    * @name ErrorsUIWidgets.E1032
    */
/**
    * @name ErrorsUIWidgets.E1033
    */
/**
    * @name ErrorsUIWidgets.E1034
    */
/**
    * @name ErrorsUIWidgets.E1035
    */
/**
    * @name ErrorsUIWidgets.E1037
    */
/**
    * @name ErrorsUIWidgets.E1038
    */
/**
    * @name ErrorsUIWidgets.E1039
    */
/**
    * @name ErrorsUIWidgets.E1040
    */
/**
    * @name ErrorsUIWidgets.E1041
    */
/**
    * @name ErrorsUIWidgets.E1042
    */
/**
    * @name ErrorsUIWidgets.E1043
    */
/**
    * @name ErrorsUIWidgets.E1044
    */
/**
    * @name ErrorsUIWidgets.E1045
    */
/**
    * @name ErrorsUIWidgets.E1046
    */
/**
    * @name ErrorsUIWidgets.E1047
    */
/**
    * @name ErrorsUIWidgets.E1048
    */
/**
    * @name ErrorsUIWidgets.E1049
    */
/**
    * @name ErrorsUIWidgets.E1050
    */
/**
    * @name ErrorsUIWidgets.E1052
    */
/**
    * @name ErrorsUIWidgets.E1053
    */
/**
    * @name ErrorsUIWidgets.E1054
    */
/**
    * @name ErrorsUIWidgets.E1055
    */
/**
    * @name ErrorsUIWidgets.E1056
    */
/**
    * @name ErrorsUIWidgets.E1058
    */
/**
    * @name ErrorsUIWidgets.E1059
    */
/**
    * @name ErrorsUIWidgets.E1060
    */
/**
    * @name ErrorsUIWidgets.E1061
    */
/**
    * @name ErrorsUIWidgets.E1062
    */
/**
    * @name ErrorsUIWidgets.E1063
    */
/**
    * @name ErrorsUIWidgets.E1064
    */
/**
    * @name ErrorsUIWidgets.E1065
    */
/**
    * @name ErrorsUIWidgets.E1066
    */
/**
    * @name ErrorsUIWidgets.E1067
    */
/**
    * @name ErrorsUIWidgets.E1068
    */
/**
    * @name ErrorsUIWidgets.E1069
    */
/**
    * @name ErrorsUIWidgets.W1001
    */
/**
    * @name ErrorsUIWidgets.W1002
    */
/**
    * @name ErrorsUIWidgets.W1003
    */
/**
    * @name ErrorsUIWidgets.W1004
    */
/**
    * @name ErrorsUIWidgets.W1005
    */
/**
    * @name ErrorsUIWidgets.W1006
    */
/**
    * @name ErrorsUIWidgets.W1007
    */
/**
    * @name ErrorsUIWidgets.W1008
    */
/**
    * @name ErrorsUIWidgets.W1009
    */
/**
    * @name ErrorsUIWidgets.W1010
    */
/**
    * @name ErrorsUIWidgets.W1011
    */
/**
    * @name ErrorsUIWidgets.W1013
    */
/**
    * @name ErrorsUIWidgets.W1014
    */
/**
    * @name ErrorsUIWidgets.W1017
    */
/**
    * @name ErrorsUIWidgets.W1018
    */
/**
    * @name ErrorsUIWidgets.W1019
    */
/**
    * @name ErrorsUIWidgets.W1020
    */
/**
    * @name ErrorsUIWidgets.W1021
    */
/**
    * @name ErrorsUIWidgets.W1022
    */
/**
    * @name ErrorsUIWidgets.W1023
    */
/**
    * @name ErrorsUIWidgets.W1024
    */
/**
    * @name ErrorsUIWidgets.W1025
    */
/**
    * @name ErrorsUIWidgets.W1026
    */
/**
    * @name ErrorsUIWidgets.W1027
    */
/**
    * @name ErrorsUIWidgets.W1028
    */
/**
    * @name ErrorsUIWidgets.W1029
    */
/**
    * @name ErrorsUIWidgets.W1030
    */
/**
    * @name ErrorsUIWidgets.W1031
    */
/**
    * @name ErrorsUIWidgets.W1032
    */
/**
    * @name ErrorsUIWidgets.W1033
    */
var _default = exports["default"] = _errors.default;
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