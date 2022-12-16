/*!
 * DevExtreme-Quill Editor v.1.15.20
 * https://js.devexpress.com/
 * Copyright (c) 2020, Developer Express Inc.
 * Copyright (c) 2017, Slab
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Quill"] = factory();
	else
		root["DevExpress"] = root["DevExpress"] || {}, root["DevExpress"]["Quill"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 177);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return globalRegistry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return expandConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return overload; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Quill; });
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(quill_delta__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_merge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(37);
/* harmony import */ var lodash_merge__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_merge__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4);
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3);
/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(12);
/* harmony import */ var _selection__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7);
/* harmony import */ var _instances__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(44);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(23);
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(57);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }












var debug = Object(_logger__WEBPACK_IMPORTED_MODULE_9__[/* default */ "a"])('quill');
var globalRegistry = new parchment__WEBPACK_IMPORTED_MODULE_3__["Registry"]();
parchment__WEBPACK_IMPORTED_MODULE_3__["ParentBlot"].uiClass = 'ql-ui';

var Quill = /*#__PURE__*/function () {
  function Quill(container) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Quill);

    this.options = expandConfig(container, options);
    this.container = this.options.container;

    if (this.container == null) {
      return debug.error('Invalid Quill container', container);
    }

    if (this.options.debug) {
      Quill.debug(this.options.debug);
    }

    var html = this.container.innerHTML.trim();
    this.container.classList.add('ql-container');
    this.container.innerHTML = '';
    _instances__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"].set(this.container, this);
    this.root = this.addContainer('ql-editor');
    this.root.classList.add('ql-blank');
    this.scrollingContainer = this.options.scrollingContainer || this.root;
    this.emitter = new _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"]();
    var ScrollBlot = this.options.registry.query(parchment__WEBPACK_IMPORTED_MODULE_3__["ScrollBlot"].blotName);
    this.scroll = new ScrollBlot(this.options.registry, this.root, {
      emitter: this.emitter,
      toggleBlankClass: this.toggleBlankClass.bind(this)
    });
    this.editor = new _editor__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"](this.scroll);
    this.selection = new _selection__WEBPACK_IMPORTED_MODULE_7__[/* default */ "b"](this.scroll, this.emitter);
    this.theme = new this.options.theme(this, this.options); // eslint-disable-line new-cap

    this.keyboard = this.theme.addModule('keyboard');
    this.clipboard = this.theme.addModule('clipboard');
    this.history = this.theme.addModule('history');
    this.uploader = this.theme.addModule('uploader');
    this.theme.init();
    this.emitter.on(_emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].events.EDITOR_CHANGE, function (type) {
      if (type === _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].events.TEXT_CHANGE) {
        _this.toggleBlankClass();
      }
    });
    this.emitter.on(_emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].events.SCROLL_UPDATE, function (source, mutations) {
      var oldRange = _this.selection.lastRange;

      var _this$selection$getRa = _this.selection.getRange(),
          _this$selection$getRa2 = _slicedToArray(_this$selection$getRa, 1),
          newRange = _this$selection$getRa2[0];

      var selectionInfo = oldRange && newRange ? {
        oldRange: oldRange,
        newRange: newRange
      } : undefined;
      modify.call(_this, function () {
        return _this.editor.update(null, mutations, selectionInfo);
      }, source);
    });
    this.setContents(this.getInitialContent(html));
    this.history.clear();

    if (this.options.placeholder) {
      this.root.setAttribute('data-placeholder', this.options.placeholder);
    }

    if (this.options.readOnly) {
      this.disable();
    }

    this.allowReadOnlyEdits = false;
  }

  _createClass(Quill, [{
    key: "getInitialContent",
    value: function getInitialContent(html) {
      return this.clipboard.convert({
        html: "".concat(html, "<p><br></p>"),
        text: '\n'
      });
    }
  }, {
    key: "toggleBlankClass",
    value: function toggleBlankClass() {
      var isComposing = this.selection.composing;
      this.root.classList.toggle('ql-blank', this.editor.isBlank(isComposing));
    }
  }, {
    key: "addContainer",
    value: function addContainer(container) {
      var refNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof container === 'string') {
        var className = container;
        container = document.createElement('div');
        container.classList.add(className);
      }

      this.container.insertBefore(container, refNode);
      return container;
    }
  }, {
    key: "blur",
    value: function blur() {
      this.selection.setRange(null);
    }
  }, {
    key: "deleteText",
    value: function deleteText(index, length, source) {
      var _this2 = this;

      var _overload = overload(index, length, source);

      var _overload2 = _slicedToArray(_overload, 4);

      index = _overload2[0];
      length = _overload2[1];
      source = _overload2[3];
      return modify.call(this, function () {
        return _this2.editor.deleteText(index, length);
      }, source, index, -1 * length);
    }
  }, {
    key: "disable",
    value: function disable() {
      this.enable(false);
    }
  }, {
    key: "editReadOnly",
    value: function editReadOnly(modifier) {
      this.allowReadOnlyEdits = true;
      var value = modifier();
      this.allowReadOnlyEdits = false;
      return value;
    }
  }, {
    key: "enable",
    value: function enable() {
      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.scroll.enable(enabled);
      this.container.classList.toggle('ql-disabled', !enabled);
    }
  }, {
    key: "focus",
    value: function focus() {
      var scrollTop = this.scrollingContainer.scrollTop;
      this.selection.focus();
      this.scrollingContainer.scrollTop = scrollTop;
      this.scrollIntoView();
    }
  }, {
    key: "format",
    value: function format(name, value) {
      var _this3 = this;

      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.API;
      return modify.call(this, function () {
        var range = _this3.getSelection(true);

        var change = new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a();
        if (range == null) return change;

        if (_this3.scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_3__["Scope"].BLOCK)) {
          change = _this3.editor.formatLine(range.index, range.length, _defineProperty({}, name, value));
        } else if (range.length === 0) {
          _this3.selection.format(name, value);

          return change;
        } else {
          change = _this3.editor.formatText(range.index, range.length, _defineProperty({}, name, value));
        }

        _this3.setSelection(range, _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.SILENT);

        return change;
      }, source);
    }
  }, {
    key: "formatLine",
    value: function formatLine(index, length, name, value, source) {
      var _this4 = this;

      var formats; // eslint-disable-next-line prefer-const

      var _overload3 = overload(index, length, name, value, source);

      var _overload4 = _slicedToArray(_overload3, 4);

      index = _overload4[0];
      length = _overload4[1];
      formats = _overload4[2];
      source = _overload4[3];
      return modify.call(this, function () {
        return _this4.editor.formatLine(index, length, formats);
      }, source, index, 0);
    }
  }, {
    key: "formatText",
    value: function formatText(index, length, name, value, source) {
      var _this5 = this;

      var formats; // eslint-disable-next-line prefer-const

      var _overload5 = overload(index, length, name, value, source);

      var _overload6 = _slicedToArray(_overload5, 4);

      index = _overload6[0];
      length = _overload6[1];
      formats = _overload6[2];
      source = _overload6[3];
      return modify.call(this, function () {
        return _this5.editor.formatText(index, length, formats);
      }, source, index, 0);
    }
  }, {
    key: "getBounds",
    value: function getBounds(index) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var bounds;

      if (typeof index === 'number') {
        bounds = this.selection.getBounds(index, length);
      } else {
        bounds = this.selection.getBounds(index.index, index.length);
      }

      var containerBounds = this.container.getBoundingClientRect();
      return {
        bottom: bounds.bottom - containerBounds.top,
        height: bounds.height,
        left: bounds.left - containerBounds.left,
        right: bounds.right - containerBounds.left,
        top: bounds.top - containerBounds.top,
        width: bounds.width
      };
    }
  }, {
    key: "getContents",
    value: function getContents() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;

      var _overload7 = overload(index, length);

      var _overload8 = _slicedToArray(_overload7, 2);

      index = _overload8[0];
      length = _overload8[1];
      return this.editor.getContents(index, length);
    }
  }, {
    key: "getFormat",
    value: function getFormat() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getSelection(true);
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (typeof index === 'number') {
        return this.editor.getFormat(index, length);
      }

      return this.editor.getFormat(index.index, index.length);
    }
  }, {
    key: "getIndex",
    value: function getIndex(blot) {
      return blot.offset(this.scroll);
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.scroll.length();
    }
  }, {
    key: "getLeaf",
    value: function getLeaf(index) {
      return this.scroll.leaf(index);
    }
  }, {
    key: "getLine",
    value: function getLine(index) {
      return this.scroll.line(index);
    }
  }, {
    key: "getLines",
    value: function getLines() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;

      if (typeof index !== 'number') {
        return this.scroll.lines(index.index, index.length);
      }

      return this.scroll.lines(index, length);
    }
  }, {
    key: "getModule",
    value: function getModule(name) {
      return this.theme.modules[name];
    }
  }, {
    key: "getSelection",
    value: function getSelection() {
      var focus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (focus) this.focus();
      this.update(); // Make sure we access getRange with editor in consistent state

      return this.selection.getRange()[0];
    }
  }, {
    key: "getSemanticHTML",
    value: function getSemanticHTML() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;

      var _overload9 = overload(index, length);

      var _overload10 = _slicedToArray(_overload9, 2);

      index = _overload10[0];
      length = _overload10[1];
      return this.editor.getHTML(index, length);
    }
  }, {
    key: "getText",
    value: function getText() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getLength() - index;

      var _overload11 = overload(index, length);

      var _overload12 = _slicedToArray(_overload11, 2);

      index = _overload12[0];
      length = _overload12[1];
      return this.editor.getText(index, length);
    }
  }, {
    key: "hasFocus",
    value: function hasFocus() {
      return this.selection.hasFocus();
    }
  }, {
    key: "insertEmbed",
    value: function insertEmbed(index, embed, value) {
      var _this6 = this;

      var source = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Quill.sources.API;
      return modify.call(this, function () {
        return _this6.editor.insertEmbed(index, embed, value);
      }, source, index);
    }
  }, {
    key: "insertText",
    value: function insertText(index, text, name, value, source) {
      var _this7 = this;

      var formats; // eslint-disable-next-line prefer-const

      var _overload13 = overload(index, 0, name, value, source);

      var _overload14 = _slicedToArray(_overload13, 4);

      index = _overload14[0];
      formats = _overload14[2];
      source = _overload14[3];
      return modify.call(this, function () {
        return _this7.editor.insertText(index, text, formats);
      }, source, index, text.length);
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.scroll.isEnabled();
    }
  }, {
    key: "off",
    value: function off() {
      var _this$emitter;

      return (_this$emitter = this.emitter).off.apply(_this$emitter, arguments);
    }
  }, {
    key: "on",
    value: function on() {
      var _this$emitter2;

      return (_this$emitter2 = this.emitter).on.apply(_this$emitter2, arguments);
    }
  }, {
    key: "once",
    value: function once() {
      var _this$emitter3;

      return (_this$emitter3 = this.emitter).once.apply(_this$emitter3, arguments);
    }
  }, {
    key: "removeFormat",
    value: function removeFormat(index, length, source) {
      var _this8 = this;

      var _overload15 = overload(index, length, source);

      var _overload16 = _slicedToArray(_overload15, 4);

      index = _overload16[0];
      length = _overload16[1];
      source = _overload16[3];
      return modify.call(this, function () {
        return _this8.editor.removeFormat(index, length);
      }, source, index);
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView() {
      this.selection.scrollIntoView(this.scrollingContainer);
    }
  }, {
    key: "setContents",
    value: function setContents(delta) {
      var _this9 = this;

      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.API;
      return modify.call(this, function () {
        delta = new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a(delta);

        var length = _this9.getLength(); // Quill will set empty editor to \n


        var delete1 = _this9.editor.deleteText(0, length); // delta always applied before existing content


        var applied = _this9.editor.applyDelta(delta); // Remove extra \n from empty editor initialization


        var delete2 = _this9.editor.deleteText(_this9.getLength() - 1, 1);

        _this9.emitter.emit(Quill.events.CONTENT_SETTED);

        return delete1.compose(applied).compose(delete2);
      }, source);
    }
  }, {
    key: "setSelection",
    value: function setSelection(index, length, source) {
      if (index == null) {
        this.selection.setRange(null, length || Quill.sources.API);
      } else {
        var _overload17 = overload(index, length, source);

        var _overload18 = _slicedToArray(_overload17, 4);

        index = _overload18[0];
        length = _overload18[1];
        source = _overload18[3];
        this.selection.setRange(new _selection__WEBPACK_IMPORTED_MODULE_7__[/* Range */ "a"](Math.max(0, index), length), source);

        if (source !== _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.SILENT) {
          this.selection.scrollIntoView(this.scrollingContainer);
        }
      }
    }
  }, {
    key: "setText",
    value: function setText(text) {
      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.API;
      var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a().insert(text);
      return this.setContents(delta, source);
    }
  }, {
    key: "update",
    value: function update() {
      var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.USER;
      var change = this.scroll.update(source); // Will update selection before selection.update() does if text changes

      this.selection.update(source); // TODO this is usually undefined

      return change;
    }
  }, {
    key: "updateContents",
    value: function updateContents(delta) {
      var _this10 = this;

      var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.API;
      return modify.call(this, function () {
        delta = new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a(delta);
        return _this10.editor.applyDelta(delta, source);
      }, source, true);
    }
  }], [{
    key: "debug",
    value: function debug(limit) {
      if (limit === true) {
        limit = 'log';
      }

      _logger__WEBPACK_IMPORTED_MODULE_9__[/* default */ "a"].level(limit);
    }
  }, {
    key: "find",
    value: function find(node) {
      return _instances__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"].get(node) || globalRegistry.find(node);
    }
  }, {
    key: "import",
    value: function _import(name) {
      if (this.imports[name] == null) {
        debug.error("Cannot import ".concat(name, ". Are you sure it was registered?"));
      }

      return this.imports[name];
    }
  }, {
    key: "register",
    value: function register(path, target) {
      var _this11 = this;

      var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (typeof path !== 'string') {
        var name = path.attrName || path.blotName;

        if (typeof name === 'string') {
          // register(Blot | Attributor, overwrite)
          this.register("formats/".concat(name), path, target);
        } else {
          Object.keys(path).forEach(function (key) {
            _this11.register(key, path[key], target);
          });
        }
      } else {
        if (this.imports[path] != null && !overwrite) {
          debug.warn("Overwriting ".concat(path, " with"), target);
        }

        this.imports[path] = target;

        if ((path.indexOf('blots/') === 0 || path.indexOf('formats/') === 0) && target.blotName !== 'abstract') {
          globalRegistry.register(target);
        }

        if (typeof target.register === 'function') {
          target.register(globalRegistry);
        }
      }
    }
  }]);

  return Quill;
}();

Quill.DEFAULTS = {
  bounds: null,
  modules: {},
  placeholder: '',
  readOnly: false,
  registry: globalRegistry,
  scrollingContainer: null,
  theme: 'default'
};
Quill.events = _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].events;
Quill.sources = _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources; // eslint-disable-next-line no-undef

Quill.version =  false ? undefined : "1.15.20";
Quill.imports = {
  delta: quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a,
  parchment: parchment__WEBPACK_IMPORTED_MODULE_3__,
  'core/module': _module__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"],
  'core/theme': _theme__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"]
};

function expandConfig(container, userConfig) {
  userConfig = lodash_merge__WEBPACK_IMPORTED_MODULE_2___default()({
    container: container,
    modules: {
      clipboard: true,
      keyboard: true,
      history: true,
      uploader: true
    }
  }, userConfig);

  if (!userConfig.theme || userConfig.theme === Quill.DEFAULTS.theme) {
    userConfig.theme = _theme__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"];
  } else {
    userConfig.theme = Quill.import("themes/".concat(userConfig.theme));

    if (userConfig.theme == null) {
      throw new Error("Invalid theme ".concat(userConfig.theme, ". Did you register it?"));
    }
  }

  var themeConfig = lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default()(userConfig.theme.DEFAULTS);
  [themeConfig, userConfig].forEach(function (config) {
    config.modules = config.modules || {};
    Object.keys(config.modules).forEach(function (module) {
      if (config.modules[module] === true) {
        config.modules[module] = {};
      }
    });
  });
  var moduleNames = Object.keys(themeConfig.modules).concat(Object.keys(userConfig.modules));
  var moduleConfig = moduleNames.reduce(function (config, name) {
    var moduleClass = Quill.import("modules/".concat(name));

    if (moduleClass == null) {
      debug.error("Cannot load ".concat(name, " module. Are you sure you registered it?"));
    } else {
      config[name] = moduleClass.DEFAULTS || {};
    }

    return config;
  }, {}); // Special case toolbar shorthand

  if (userConfig.modules != null && userConfig.modules.toolbar && userConfig.modules.toolbar.constructor !== Object) {
    userConfig.modules.toolbar = {
      container: userConfig.modules.toolbar
    };
  }

  userConfig = lodash_merge__WEBPACK_IMPORTED_MODULE_2___default()({}, Quill.DEFAULTS, {
    modules: moduleConfig
  }, themeConfig, userConfig);
  ['bounds', 'container', 'scrollingContainer'].forEach(function (key) {
    if (typeof userConfig[key] === 'string') {
      userConfig[key] = document.querySelector(userConfig[key]);
    }
  });
  userConfig.modules = Object.keys(userConfig.modules).reduce(function (config, name) {
    if (userConfig.modules[name]) {
      config[name] = userConfig.modules[name];
    }

    return config;
  }, {});
  return userConfig;
} // Handle selection preservation and TEXT_CHANGE emission
// common to modification APIs


function modify(modifier, source, index, shift) {
  if (!this.isEnabled() && source === _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.USER && !this.allowReadOnlyEdits) {
    return new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a();
  }

  var range = index == null ? null : this.getSelection();
  var oldDelta = this.editor.delta;
  var change = modifier();

  if (range != null) {
    if (index === true) {
      index = range.index; // eslint-disable-line prefer-destructuring
    }

    if (shift == null) {
      range = shiftRange(range, change, source);
    } else if (shift !== 0) {
      range = shiftRange(range, index, shift, source);
    }

    this.setSelection(range, _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.SILENT);
  }

  if (change.length() > 0) {
    var _this$emitter4;

    var args = [_emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].events.TEXT_CHANGE, change, oldDelta, source];

    (_this$emitter4 = this.emitter).emit.apply(_this$emitter4, [_emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].events.EDITOR_CHANGE].concat(args));

    if (source !== _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.SILENT) {
      var _this$emitter5;

      (_this$emitter5 = this.emitter).emit.apply(_this$emitter5, args);
    }
  }

  return change;
}

function overload(index, length, name, value, source) {
  var formats = {};

  if (typeof index.index === 'number' && typeof index.length === 'number') {
    // Allow for throwaway end (used by insertText/insertEmbed)
    if (typeof length !== 'number') {
      source = value;
      value = name;
      name = length;
      length = index.length; // eslint-disable-line prefer-destructuring

      index = index.index; // eslint-disable-line prefer-destructuring
    } else {
      length = index.length; // eslint-disable-line prefer-destructuring

      index = index.index; // eslint-disable-line prefer-destructuring
    }
  } else if (typeof length !== 'number') {
    source = value;
    value = name;
    name = length;
    length = 0;
  } // Handle format being object, two format name/value strings or excluded


  if (_typeof(name) === 'object') {
    formats = name;
    source = value;
  } else if (typeof name === 'string') {
    if (value != null) {
      formats[name] = value;
    } else {
      source = name;
    }
  } // Handle optional source


  source = source || _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.API;
  return [index, length, formats, source];
}

function shiftRange(range, index, length, source) {
  if (range == null) return null;
  var start;
  var end;

  if (index instanceof quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a) {
    var _map = [range.index, range.index + range.length].map(function (pos) {
      return index.transformPosition(pos, source !== _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.USER);
    });

    var _map2 = _slicedToArray(_map, 2);

    start = _map2[0];
    end = _map2[1];
  } else {
    var _map3 = [range.index, range.index + range.length].map(function (pos) {
      if (pos < index || pos === index && source === _emitter__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"].sources.USER) return pos;

      if (length >= 0) {
        return pos + length;
      }

      return Math.max(index, pos + length);
    });

    var _map4 = _slicedToArray(_map3, 2);

    start = _map4[0];
    end = _map4[1];
  }

  return new _selection__WEBPACK_IMPORTED_MODULE_7__[/* Range */ "a"](start, end - start);
}



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fast_diff_1 = __importDefault(__webpack_require__(118));
var lodash_clonedeep_1 = __importDefault(__webpack_require__(16));
var lodash_isequal_1 = __importDefault(__webpack_require__(30));
var AttributeMap_1 = __importDefault(__webpack_require__(119));
var Op_1 = __importDefault(__webpack_require__(94));
var NULL_CHARACTER = String.fromCharCode(0); // Placeholder char for embed in diff()
var Delta = /** @class */ (function () {
    function Delta(ops) {
        // Assume we are given a well formed ops
        if (Array.isArray(ops)) {
            this.ops = ops;
        }
        else if (ops != null && Array.isArray(ops.ops)) {
            this.ops = ops.ops;
        }
        else {
            this.ops = [];
        }
    }
    Delta.prototype.insert = function (arg, attributes) {
        var newOp = {};
        if (typeof arg === 'string' && arg.length === 0) {
            return this;
        }
        newOp.insert = arg;
        if (attributes != null &&
            typeof attributes === 'object' &&
            Object.keys(attributes).length > 0) {
            newOp.attributes = attributes;
        }
        return this.push(newOp);
    };
    Delta.prototype.delete = function (length) {
        if (length <= 0) {
            return this;
        }
        return this.push({ delete: length });
    };
    Delta.prototype.retain = function (length, attributes) {
        if (length <= 0) {
            return this;
        }
        var newOp = { retain: length };
        if (attributes != null &&
            typeof attributes === 'object' &&
            Object.keys(attributes).length > 0) {
            newOp.attributes = attributes;
        }
        return this.push(newOp);
    };
    Delta.prototype.push = function (newOp) {
        var index = this.ops.length;
        var lastOp = this.ops[index - 1];
        newOp = lodash_clonedeep_1.default(newOp);
        if (typeof lastOp === 'object') {
            if (typeof newOp.delete === 'number' &&
                typeof lastOp.delete === 'number') {
                this.ops[index - 1] = { delete: lastOp.delete + newOp.delete };
                return this;
            }
            // Since it does not matter if we insert before or after deleting at the same index,
            // always prefer to insert first
            if (typeof lastOp.delete === 'number' && newOp.insert != null) {
                index -= 1;
                lastOp = this.ops[index - 1];
                if (typeof lastOp !== 'object') {
                    this.ops.unshift(newOp);
                    return this;
                }
            }
            if (lodash_isequal_1.default(newOp.attributes, lastOp.attributes)) {
                if (typeof newOp.insert === 'string' &&
                    typeof lastOp.insert === 'string') {
                    this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
                    if (typeof newOp.attributes === 'object') {
                        this.ops[index - 1].attributes = newOp.attributes;
                    }
                    return this;
                }
                else if (typeof newOp.retain === 'number' &&
                    typeof lastOp.retain === 'number') {
                    this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
                    if (typeof newOp.attributes === 'object') {
                        this.ops[index - 1].attributes = newOp.attributes;
                    }
                    return this;
                }
            }
        }
        if (index === this.ops.length) {
            this.ops.push(newOp);
        }
        else {
            this.ops.splice(index, 0, newOp);
        }
        return this;
    };
    Delta.prototype.chop = function () {
        var lastOp = this.ops[this.ops.length - 1];
        if (lastOp && lastOp.retain && !lastOp.attributes) {
            this.ops.pop();
        }
        return this;
    };
    Delta.prototype.filter = function (predicate) {
        return this.ops.filter(predicate);
    };
    Delta.prototype.forEach = function (predicate) {
        this.ops.forEach(predicate);
    };
    Delta.prototype.map = function (predicate) {
        return this.ops.map(predicate);
    };
    Delta.prototype.partition = function (predicate) {
        var passed = [];
        var failed = [];
        this.forEach(function (op) {
            var target = predicate(op) ? passed : failed;
            target.push(op);
        });
        return [passed, failed];
    };
    Delta.prototype.reduce = function (predicate, initialValue) {
        return this.ops.reduce(predicate, initialValue);
    };
    Delta.prototype.changeLength = function () {
        return this.reduce(function (length, elem) {
            if (elem.insert) {
                return length + Op_1.default.length(elem);
            }
            else if (elem.delete) {
                return length - elem.delete;
            }
            return length;
        }, 0);
    };
    Delta.prototype.length = function () {
        return this.reduce(function (length, elem) {
            return length + Op_1.default.length(elem);
        }, 0);
    };
    Delta.prototype.slice = function (start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = Infinity; }
        var ops = [];
        var iter = Op_1.default.iterator(this.ops);
        var index = 0;
        while (index < end && iter.hasNext()) {
            var nextOp = void 0;
            if (index < start) {
                nextOp = iter.next(start - index);
            }
            else {
                nextOp = iter.next(end - index);
                ops.push(nextOp);
            }
            index += Op_1.default.length(nextOp);
        }
        return new Delta(ops);
    };
    Delta.prototype.compose = function (other) {
        var thisIter = Op_1.default.iterator(this.ops);
        var otherIter = Op_1.default.iterator(other.ops);
        var ops = [];
        var firstOther = otherIter.peek();
        if (firstOther != null &&
            typeof firstOther.retain === 'number' &&
            firstOther.attributes == null) {
            var firstLeft = firstOther.retain;
            while (thisIter.peekType() === 'insert' &&
                thisIter.peekLength() <= firstLeft) {
                firstLeft -= thisIter.peekLength();
                ops.push(thisIter.next());
            }
            if (firstOther.retain - firstLeft > 0) {
                otherIter.next(firstOther.retain - firstLeft);
            }
        }
        var delta = new Delta(ops);
        while (thisIter.hasNext() || otherIter.hasNext()) {
            if (otherIter.peekType() === 'insert') {
                delta.push(otherIter.next());
            }
            else if (thisIter.peekType() === 'delete') {
                delta.push(thisIter.next());
            }
            else {
                var length_1 = Math.min(thisIter.peekLength(), otherIter.peekLength());
                var thisOp = thisIter.next(length_1);
                var otherOp = otherIter.next(length_1);
                if (typeof otherOp.retain === 'number') {
                    var newOp = {};
                    if (typeof thisOp.retain === 'number') {
                        newOp.retain = length_1;
                    }
                    else {
                        newOp.insert = thisOp.insert;
                    }
                    // Preserve null when composing with a retain, otherwise remove it for inserts
                    var attributes = AttributeMap_1.default.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === 'number');
                    if (attributes) {
                        newOp.attributes = attributes;
                    }
                    delta.push(newOp);
                    // Optimization if rest of other is just retain
                    if (!otherIter.hasNext() &&
                        lodash_isequal_1.default(delta.ops[delta.ops.length - 1], newOp)) {
                        var rest = new Delta(thisIter.rest());
                        return delta.concat(rest).chop();
                    }
                    // Other op should be delete, we could be an insert or retain
                    // Insert + delete cancels out
                }
                else if (typeof otherOp.delete === 'number' &&
                    typeof thisOp.retain === 'number') {
                    delta.push(otherOp);
                }
            }
        }
        return delta.chop();
    };
    Delta.prototype.concat = function (other) {
        var delta = new Delta(this.ops.slice());
        if (other.ops.length > 0) {
            delta.push(other.ops[0]);
            delta.ops = delta.ops.concat(other.ops.slice(1));
        }
        return delta;
    };
    Delta.prototype.diff = function (other, cursor) {
        if (this.ops === other.ops) {
            return new Delta();
        }
        var strings = [this, other].map(function (delta) {
            return delta
                .map(function (op) {
                if (op.insert != null) {
                    return typeof op.insert === 'string' ? op.insert : NULL_CHARACTER;
                }
                var prep = delta === other ? 'on' : 'with';
                throw new Error('diff() called ' + prep + ' non-document');
            })
                .join('');
        });
        var retDelta = new Delta();
        var diffResult = fast_diff_1.default(strings[0], strings[1], cursor);
        var thisIter = Op_1.default.iterator(this.ops);
        var otherIter = Op_1.default.iterator(other.ops);
        diffResult.forEach(function (component) {
            var length = component[1].length;
            while (length > 0) {
                var opLength = 0;
                switch (component[0]) {
                    case fast_diff_1.default.INSERT:
                        opLength = Math.min(otherIter.peekLength(), length);
                        retDelta.push(otherIter.next(opLength));
                        break;
                    case fast_diff_1.default.DELETE:
                        opLength = Math.min(length, thisIter.peekLength());
                        thisIter.next(opLength);
                        retDelta.delete(opLength);
                        break;
                    case fast_diff_1.default.EQUAL:
                        opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length);
                        var thisOp = thisIter.next(opLength);
                        var otherOp = otherIter.next(opLength);
                        if (lodash_isequal_1.default(thisOp.insert, otherOp.insert)) {
                            retDelta.retain(opLength, AttributeMap_1.default.diff(thisOp.attributes, otherOp.attributes));
                        }
                        else {
                            retDelta.push(otherOp).delete(opLength);
                        }
                        break;
                }
                length -= opLength;
            }
        });
        return retDelta.chop();
    };
    Delta.prototype.eachLine = function (predicate, newline) {
        if (newline === void 0) { newline = '\n'; }
        var iter = Op_1.default.iterator(this.ops);
        var line = new Delta();
        var i = 0;
        while (iter.hasNext()) {
            if (iter.peekType() !== 'insert') {
                return;
            }
            var thisOp = iter.peek();
            var start = Op_1.default.length(thisOp) - iter.peekLength();
            var index = typeof thisOp.insert === 'string'
                ? thisOp.insert.indexOf(newline, start) - start
                : -1;
            if (index < 0) {
                line.push(iter.next());
            }
            else if (index > 0) {
                line.push(iter.next(index));
            }
            else {
                if (predicate(line, iter.next(1).attributes || {}, i) === false) {
                    return;
                }
                i += 1;
                line = new Delta();
            }
        }
        if (line.length() > 0) {
            predicate(line, {}, i);
        }
    };
    Delta.prototype.invert = function (base) {
        var inverted = new Delta();
        this.reduce(function (baseIndex, op) {
            if (op.insert) {
                inverted.delete(Op_1.default.length(op));
            }
            else if (op.retain && op.attributes == null) {
                inverted.retain(op.retain);
                return baseIndex + op.retain;
            }
            else if (op.delete || (op.retain && op.attributes)) {
                var length_2 = (op.delete || op.retain);
                var slice = base.slice(baseIndex, baseIndex + length_2);
                slice.forEach(function (baseOp) {
                    if (op.delete) {
                        inverted.push(baseOp);
                    }
                    else if (op.retain && op.attributes) {
                        inverted.retain(Op_1.default.length(baseOp), AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
                    }
                });
                return baseIndex + length_2;
            }
            return baseIndex;
        }, 0);
        return inverted.chop();
    };
    Delta.prototype.transform = function (arg, priority) {
        if (priority === void 0) { priority = false; }
        priority = !!priority;
        if (typeof arg === 'number') {
            return this.transformPosition(arg, priority);
        }
        var other = arg;
        var thisIter = Op_1.default.iterator(this.ops);
        var otherIter = Op_1.default.iterator(other.ops);
        var delta = new Delta();
        while (thisIter.hasNext() || otherIter.hasNext()) {
            if (thisIter.peekType() === 'insert' &&
                (priority || otherIter.peekType() !== 'insert')) {
                delta.retain(Op_1.default.length(thisIter.next()));
            }
            else if (otherIter.peekType() === 'insert') {
                delta.push(otherIter.next());
            }
            else {
                var length_3 = Math.min(thisIter.peekLength(), otherIter.peekLength());
                var thisOp = thisIter.next(length_3);
                var otherOp = otherIter.next(length_3);
                if (thisOp.delete) {
                    // Our delete either makes their delete redundant or removes their retain
                    continue;
                }
                else if (otherOp.delete) {
                    delta.push(otherOp);
                }
                else {
                    // We retain either their retain or insert
                    delta.retain(length_3, AttributeMap_1.default.transform(thisOp.attributes, otherOp.attributes, priority));
                }
            }
        }
        return delta.chop();
    };
    Delta.prototype.transformPosition = function (index, priority) {
        if (priority === void 0) { priority = false; }
        priority = !!priority;
        var thisIter = Op_1.default.iterator(this.ops);
        var offset = 0;
        while (thisIter.hasNext() && offset <= index) {
            var length_4 = thisIter.peekLength();
            var nextType = thisIter.peekType();
            thisIter.next();
            if (nextType === 'delete') {
                index -= Math.min(length_4, index - offset);
                continue;
            }
            else if (nextType === 'insert' && (offset < index || !priority)) {
                index += length_4;
            }
            offset += length_4;
        }
        return index;
    };
    Delta.Op = Op_1.default;
    Delta.AttributeMap = AttributeMap_1.default;
    return Delta;
}());
module.exports = Delta;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "ParentBlot", function() { return /* reexport */ abstract_parent; });
__webpack_require__.d(__webpack_exports__, "ContainerBlot", function() { return /* reexport */ container; });
__webpack_require__.d(__webpack_exports__, "LeafBlot", function() { return /* reexport */ leaf; });
__webpack_require__.d(__webpack_exports__, "EmbedBlot", function() { return /* reexport */ blot_embed; });
__webpack_require__.d(__webpack_exports__, "ScrollBlot", function() { return /* reexport */ blot_scroll; });
__webpack_require__.d(__webpack_exports__, "BlockBlot", function() { return /* reexport */ block; });
__webpack_require__.d(__webpack_exports__, "InlineBlot", function() { return /* reexport */ inline; });
__webpack_require__.d(__webpack_exports__, "TextBlot", function() { return /* reexport */ blot_text; });
__webpack_require__.d(__webpack_exports__, "Attributor", function() { return /* reexport */ attributor; });
__webpack_require__.d(__webpack_exports__, "ClassAttributor", function() { return /* reexport */ attributor_class; });
__webpack_require__.d(__webpack_exports__, "StyleAttributor", function() { return /* reexport */ style; });
__webpack_require__.d(__webpack_exports__, "AttributorStore", function() { return /* reexport */ store; });
__webpack_require__.d(__webpack_exports__, "Registry", function() { return /* reexport */ registry; });
__webpack_require__.d(__webpack_exports__, "Scope", function() { return /* reexport */ src_scope; });

// CONCATENATED MODULE: ./node_modules/parchment/src/scope.ts
var Scope;

(function (Scope) {
  Scope[Scope["TYPE"] = 3] = "TYPE";
  Scope[Scope["LEVEL"] = 12] = "LEVEL";
  Scope[Scope["ATTRIBUTE"] = 13] = "ATTRIBUTE";
  Scope[Scope["BLOT"] = 14] = "BLOT";
  Scope[Scope["INLINE"] = 7] = "INLINE";
  Scope[Scope["BLOCK"] = 11] = "BLOCK";
  Scope[Scope["BLOCK_BLOT"] = 10] = "BLOCK_BLOT";
  Scope[Scope["INLINE_BLOT"] = 6] = "INLINE_BLOT";
  Scope[Scope["BLOCK_ATTRIBUTE"] = 9] = "BLOCK_ATTRIBUTE";
  Scope[Scope["INLINE_ATTRIBUTE"] = 5] = "INLINE_ATTRIBUTE";
  Scope[Scope["ANY"] = 15] = "ANY";
})(Scope || (Scope = {}));

/* harmony default export */ var src_scope = (Scope);
// CONCATENATED MODULE: ./node_modules/parchment/src/collection/linked-list.ts
var LinkedList =
/** @class */
function () {
  function LinkedList() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  LinkedList.prototype.append = function () {
    var nodes = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      nodes[_i] = arguments[_i];
    }

    this.insertBefore(nodes[0], null);

    if (nodes.length > 1) {
      var rest = nodes.slice(1);
      this.append.apply(this, rest);
    }
  };

  LinkedList.prototype.at = function (index) {
    var next = this.iterator();
    var cur = next();

    while (cur && index > 0) {
      index -= 1;
      cur = next();
    }

    return cur;
  };

  LinkedList.prototype.contains = function (node) {
    var next = this.iterator();
    var cur = next();

    while (cur) {
      if (cur === node) {
        return true;
      }

      cur = next();
    }

    return false;
  };

  LinkedList.prototype.indexOf = function (node) {
    var next = this.iterator();
    var cur = next();
    var index = 0;

    while (cur) {
      if (cur === node) {
        return index;
      }

      index += 1;
      cur = next();
    }

    return -1;
  };

  LinkedList.prototype.insertBefore = function (node, refNode) {
    if (node == null) {
      return;
    }

    this.remove(node);
    node.next = refNode;

    if (refNode != null) {
      node.prev = refNode.prev;

      if (refNode.prev != null) {
        refNode.prev.next = node;
      }

      refNode.prev = node;

      if (refNode === this.head) {
        this.head = node;
      }
    } else if (this.tail != null) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      node.prev = null;
      this.head = this.tail = node;
    }

    this.length += 1;
  };

  LinkedList.prototype.offset = function (target) {
    var index = 0;
    var cur = this.head;

    while (cur != null) {
      if (cur === target) {
        return index;
      }

      index += cur.length();
      cur = cur.next;
    }

    return -1;
  };

  LinkedList.prototype.remove = function (node) {
    if (!this.contains(node)) {
      return;
    }

    if (node.prev != null) {
      node.prev.next = node.next;
    }

    if (node.next != null) {
      node.next.prev = node.prev;
    }

    if (node === this.head) {
      this.head = node.next;
    }

    if (node === this.tail) {
      this.tail = node.prev;
    }

    this.length -= 1;
  };

  LinkedList.prototype.iterator = function (curNode) {
    if (curNode === void 0) {
      curNode = this.head;
    } // TODO use yield when we can


    return function () {
      var ret = curNode;

      if (curNode != null) {
        curNode = curNode.next;
      }

      return ret;
    };
  };

  LinkedList.prototype.find = function (index, inclusive) {
    if (inclusive === void 0) {
      inclusive = false;
    }

    var next = this.iterator();
    var cur = next();

    while (cur) {
      var length = cur.length();

      if (index < length || inclusive && index === length && (cur.next == null || cur.next.length() !== 0)) {
        return [cur, index];
      }

      index -= length;
      cur = next();
    }

    return [null, 0];
  };

  LinkedList.prototype.forEach = function (callback) {
    var next = this.iterator();
    var cur = next();

    while (cur) {
      callback(cur);
      cur = next();
    }
  };

  LinkedList.prototype.forEachAt = function (index, length, callback) {
    if (length <= 0) {
      return;
    }

    var _a = this.find(index),
        startNode = _a[0],
        offset = _a[1];

    var curIndex = index - offset;
    var next = this.iterator(startNode);
    var cur = next();

    while (cur && curIndex < index + length) {
      var curLength = cur.length();

      if (index > curIndex) {
        callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
      } else {
        callback(cur, 0, Math.min(curLength, index + length - curIndex));
      }

      curIndex += curLength;
      cur = next();
    }
  };

  LinkedList.prototype.map = function (callback) {
    return this.reduce(function (memo, cur) {
      memo.push(callback(cur));
      return memo;
    }, []);
  };

  LinkedList.prototype.reduce = function (callback, memo) {
    var next = this.iterator();
    var cur = next();

    while (cur) {
      memo = callback(memo, cur);
      cur = next();
    }

    return memo;
  };

  return LinkedList;
}();

/* harmony default export */ var linked_list = (LinkedList);
// CONCATENATED MODULE: ./node_modules/parchment/src/error.ts
var __extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var ParchmentError =
/** @class */
function (_super) {
  __extends(ParchmentError, _super);

  function ParchmentError(message) {
    var _this = this;

    message = '[Parchment] ' + message;
    _this = _super.call(this, message) || this;
    _this.message = message;
    _this.name = _this.constructor.name;
    return _this;
  }

  return ParchmentError;
}(Error);

/* harmony default export */ var error = (ParchmentError);
// CONCATENATED MODULE: ./node_modules/parchment/src/registry.ts



var registry_Registry =
/** @class */
function () {
  function Registry() {
    this.attributes = {};
    this.classes = {};
    this.tags = {};
    this.types = {};
  }

  Registry.find = function (node, bubble) {
    if (bubble === void 0) {
      bubble = false;
    }

    if (node == null) {
      return null;
    }

    if (this.blots.has(node)) {
      return this.blots.get(node) || null;
    }

    if (bubble) {
      return this.find(node.parentNode, bubble);
    }

    return null;
  };

  Registry.prototype.create = function (scroll, input, value) {
    var match = this.query(input);

    if (match == null) {
      throw new error("Unable to create " + input + " blot");
    }

    var blotClass = match;
    var node = // @ts-ignore
    input instanceof Node || input.nodeType === Node.TEXT_NODE ? input : blotClass.create(value);
    var blot = new blotClass(scroll, node, value);
    Registry.blots.set(blot.domNode, blot);
    return blot;
  };

  Registry.prototype.find = function (node, bubble) {
    if (bubble === void 0) {
      bubble = false;
    }

    return Registry.find(node, bubble);
  };

  Registry.prototype.query = function (query, scope) {
    var _this = this;

    if (scope === void 0) {
      scope = src_scope.ANY;
    }

    var match;

    if (typeof query === 'string') {
      match = this.types[query] || this.attributes[query]; // @ts-ignore
    } else if (query instanceof Text || query.nodeType === Node.TEXT_NODE) {
      match = this.types.text;
    } else if (typeof query === 'number') {
      if (query & src_scope.LEVEL & src_scope.BLOCK) {
        match = this.types.block;
      } else if (query & src_scope.LEVEL & src_scope.INLINE) {
        match = this.types.inline;
      }
    } else if (query instanceof HTMLElement) {
      var names = (query.getAttribute('class') || '').split(/\s+/);
      names.some(function (name) {
        match = _this.classes[name];

        if (match) {
          return true;
        }

        return false;
      });
      match = match || this.tags[query.tagName];
    }

    if (match == null) {
      return null;
    } // @ts-ignore


    if (scope & src_scope.LEVEL & match.scope && scope & src_scope.TYPE & match.scope) {
      return match;
    }

    return null;
  };

  Registry.prototype.register = function () {
    var _this = this;

    var definitions = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      definitions[_i] = arguments[_i];
    }

    if (definitions.length > 1) {
      return definitions.map(function (d) {
        return _this.register(d);
      });
    }

    var definition = definitions[0];

    if (typeof definition.blotName !== 'string' && typeof definition.attrName !== 'string') {
      throw new error('Invalid definition');
    } else if (definition.blotName === 'abstract') {
      throw new error('Cannot register abstract class');
    }

    this.types[definition.blotName || definition.attrName] = definition;

    if (typeof definition.keyName === 'string') {
      this.attributes[definition.keyName] = definition;
    } else {
      if (definition.className != null) {
        this.classes[definition.className] = definition;
      }

      if (definition.tagName != null) {
        if (Array.isArray(definition.tagName)) {
          definition.tagName = definition.tagName.map(function (tagName) {
            return tagName.toUpperCase();
          });
        } else {
          definition.tagName = definition.tagName.toUpperCase();
        }

        var tagNames = Array.isArray(definition.tagName) ? definition.tagName : [definition.tagName];
        tagNames.forEach(function (tag) {
          if (_this.tags[tag] == null || definition.className == null) {
            _this.tags[tag] = definition;
          }
        });
      }
    }

    return definition;
  };

  Registry.blots = new WeakMap();
  return Registry;
}();

/* harmony default export */ var registry = (registry_Registry);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/abstract/shadow.ts




var shadow_ShadowBlot =
/** @class */
function () {
  function ShadowBlot(scroll, domNode) {
    this.scroll = scroll;
    this.domNode = domNode;
    registry.blots.set(domNode, this);
    this.prev = null;
    this.next = null;
  }

  ShadowBlot.create = function (value) {
    if (this.tagName == null) {
      throw new error('Blot definition missing tagName');
    }

    var node;

    if (Array.isArray(this.tagName)) {
      if (typeof value === 'string') {
        value = value.toUpperCase();

        if (parseInt(value, 10).toString() === value) {
          value = parseInt(value, 10);
        }
      }

      if (typeof value === 'number') {
        node = document.createElement(this.tagName[value - 1]);
      } else if (this.tagName.indexOf(value) > -1) {
        node = document.createElement(value);
      } else {
        node = document.createElement(this.tagName[0]);
      }
    } else {
      node = document.createElement(this.tagName);
    }

    if (this.className) {
      node.classList.add(this.className);
    }

    return node;
  };

  Object.defineProperty(ShadowBlot.prototype, "statics", {
    // Hack for accessing inherited static methods
    get: function get() {
      return this.constructor;
    },
    enumerable: false,
    configurable: true
  });

  ShadowBlot.prototype.attach = function () {// Nothing to do
  };

  ShadowBlot.prototype.clone = function () {
    var domNode = this.domNode.cloneNode(false);
    return this.scroll.create(domNode);
  };

  ShadowBlot.prototype.detach = function () {
    if (this.parent != null) {
      this.parent.removeChild(this);
    }

    registry.blots.delete(this.domNode);
  };

  ShadowBlot.prototype.deleteAt = function (index, length) {
    var blot = this.isolate(index, length);
    blot.remove();
  };

  ShadowBlot.prototype.formatAt = function (index, length, name, value) {
    var blot = this.isolate(index, length);

    if (this.scroll.query(name, src_scope.BLOT) != null && value) {
      blot.wrap(name, value);
    } else if (this.scroll.query(name, src_scope.ATTRIBUTE) != null) {
      var parent = this.scroll.create(this.statics.scope);
      blot.wrap(parent);
      parent.format(name, value);
    }
  };

  ShadowBlot.prototype.insertAt = function (index, value, def) {
    var blot = def == null ? this.scroll.create('text', value) : this.scroll.create(value, def);
    var ref = this.split(index);
    this.parent.insertBefore(blot, ref || undefined);
  };

  ShadowBlot.prototype.isolate = function (index, length) {
    var target = this.split(index);

    if (target == null) {
      throw new Error('Attempt to isolate at end');
    }

    target.split(length);
    return target;
  };

  ShadowBlot.prototype.length = function () {
    return 1;
  };

  ShadowBlot.prototype.offset = function (root) {
    if (root === void 0) {
      root = this.parent;
    }

    if (this.parent == null || this === root) {
      return 0;
    }

    return this.parent.children.offset(this) + this.parent.offset(root);
  };

  ShadowBlot.prototype.optimize = function (_context) {
    if (this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer)) {
      this.wrap(this.statics.requiredContainer.blotName);
    }
  };

  ShadowBlot.prototype.remove = function () {
    if (this.domNode.parentNode != null) {
      this.domNode.parentNode.removeChild(this.domNode);
    }

    this.detach();
  };

  ShadowBlot.prototype.replaceWith = function (name, value) {
    var replacement = typeof name === 'string' ? this.scroll.create(name, value) : name;

    if (this.parent != null) {
      this.parent.insertBefore(replacement, this.next || undefined);
      this.remove();
    }

    return replacement;
  };

  ShadowBlot.prototype.split = function (index, _force) {
    return index === 0 ? this : this.next;
  };

  ShadowBlot.prototype.update = function (_mutations, _context) {// Nothing to do by default
  };

  ShadowBlot.prototype.wrap = function (name, value) {
    var wrapper = typeof name === 'string' ? this.scroll.create(name, value) : name;

    if (this.parent != null) {
      this.parent.insertBefore(wrapper, this.next || undefined);
    }

    if (typeof wrapper.appendChild !== 'function') {
      throw new error("Cannot wrap " + name);
    }

    wrapper.appendChild(this);
    return wrapper;
  };

  ShadowBlot.blotName = 'abstract';
  return ShadowBlot;
}();

/* harmony default export */ var shadow = (shadow_ShadowBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/abstract/parent.ts
var parent_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();






function makeAttachedBlot(node, scroll) {
  var blot = scroll.find(node);

  if (blot == null) {
    try {
      blot = scroll.create(node);
    } catch (e) {
      blot = scroll.create(src_scope.INLINE);
      Array.from(node.childNodes).forEach(function (child) {
        // @ts-ignore
        blot.domNode.appendChild(child);
      });

      if (node.parentNode) {
        node.parentNode.replaceChild(blot.domNode, node);
      }

      blot.attach();
    }
  }

  return blot;
}

var parent_ParentBlot =
/** @class */
function (_super) {
  parent_extends(ParentBlot, _super);

  function ParentBlot(scroll, domNode) {
    var _this = _super.call(this, scroll, domNode) || this;

    _this.uiNode = null;

    _this.build();

    return _this;
  }

  ParentBlot.prototype.appendChild = function (other) {
    this.insertBefore(other);
  };

  ParentBlot.prototype.attach = function () {
    _super.prototype.attach.call(this);

    this.children.forEach(function (child) {
      child.attach();
    });
  };

  ParentBlot.prototype.attachUI = function (node) {
    if (this.uiNode != null) {
      this.uiNode.remove();
    }

    this.uiNode = node;

    if (ParentBlot.uiClass) {
      this.uiNode.classList.add(ParentBlot.uiClass);
    }

    this.uiNode.setAttribute('contenteditable', 'false');
    this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  };

  ParentBlot.prototype.build = function () {
    var _this = this;

    this.children = new linked_list(); // Need to be reversed for if DOM nodes already in order

    Array.from(this.domNode.childNodes).filter(function (node) {
      return node !== _this.uiNode;
    }).reverse().forEach(function (node) {
      try {
        var child = makeAttachedBlot(node, _this.scroll);

        _this.insertBefore(child, _this.children.head || undefined);
      } catch (err) {
        if (err instanceof error) {
          return;
        } else {
          throw err;
        }
      }
    });
  };

  ParentBlot.prototype.deleteAt = function (index, length) {
    if (index === 0 && length === this.length()) {
      return this.remove();
    }

    this.children.forEachAt(index, length, function (child, offset, childLength) {
      child.deleteAt(offset, childLength);
    });
  };

  ParentBlot.prototype.descendant = function (criteria, index) {
    if (index === void 0) {
      index = 0;
    }

    var _a = this.children.find(index),
        child = _a[0],
        offset = _a[1];

    if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
      return [child, offset];
    } else if (child instanceof ParentBlot) {
      return child.descendant(criteria, offset);
    } else {
      return [null, -1];
    }
  };

  ParentBlot.prototype.descendants = function (criteria, index, length) {
    if (index === void 0) {
      index = 0;
    }

    if (length === void 0) {
      length = Number.MAX_VALUE;
    }

    var descendants = [];
    var lengthLeft = length;
    this.children.forEachAt(index, length, function (child, childIndex, childLength) {
      if (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) {
        descendants.push(child);
      }

      if (child instanceof ParentBlot) {
        descendants = descendants.concat(child.descendants(criteria, childIndex, lengthLeft));
      }

      lengthLeft -= childLength;
    });
    return descendants;
  };

  ParentBlot.prototype.detach = function () {
    this.children.forEach(function (child) {
      child.detach();
    });

    _super.prototype.detach.call(this);
  };

  ParentBlot.prototype.enforceAllowedChildren = function () {
    var _this = this;

    var done = false;
    this.children.forEach(function (child) {
      if (done) {
        return;
      }

      var allowed = _this.statics.allowedChildren.some(function (def) {
        return child instanceof def;
      });

      if (allowed) {
        return;
      }

      if (child.statics.scope === src_scope.BLOCK_BLOT) {
        if (child.next != null) {
          _this.splitAfter(child);
        }

        if (child.prev != null) {
          _this.splitAfter(child.prev);
        }

        child.parent.unwrap();
        done = true;
      } else if (child instanceof ParentBlot) {
        child.unwrap();
      } else {
        child.remove();
      }
    });
  };

  ParentBlot.prototype.formatAt = function (index, length, name, value) {
    this.children.forEachAt(index, length, function (child, offset, childLength) {
      child.formatAt(offset, childLength, name, value);
    });
  };

  ParentBlot.prototype.insertAt = function (index, value, def) {
    var _a = this.children.find(index),
        child = _a[0],
        offset = _a[1];

    if (child) {
      child.insertAt(offset, value, def);
    } else {
      var blot = def == null ? this.scroll.create('text', value) : this.scroll.create(value, def);
      this.appendChild(blot);
    }
  };

  ParentBlot.prototype.insertBefore = function (childBlot, refBlot) {
    if (childBlot.parent != null) {
      childBlot.parent.children.remove(childBlot);
    }

    var refDomNode = null;
    this.children.insertBefore(childBlot, refBlot || null);
    childBlot.parent = this;

    if (refBlot != null) {
      refDomNode = refBlot.domNode;
    }

    if (this.domNode.parentNode !== childBlot.domNode || this.domNode.nextSibling !== refDomNode) {
      this.domNode.insertBefore(childBlot.domNode, refDomNode);
    }

    childBlot.attach();
  };

  ParentBlot.prototype.length = function () {
    return this.children.reduce(function (memo, child) {
      return memo + child.length();
    }, 0);
  };

  ParentBlot.prototype.moveChildren = function (targetParent, refNode) {
    this.children.forEach(function (child) {
      targetParent.insertBefore(child, refNode);
    });
  };

  ParentBlot.prototype.optimize = function (context) {
    _super.prototype.optimize.call(this, context);

    this.enforceAllowedChildren();

    if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
      this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
    }

    if (this.children.length === 0) {
      if (this.statics.defaultChild != null) {
        var child = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(child); // TODO double check if necessary
        // child.optimize(context);
      } else {
        this.remove();
      }
    }
  };

  ParentBlot.prototype.path = function (index, inclusive) {
    if (inclusive === void 0) {
      inclusive = false;
    }

    var _a = this.children.find(index, inclusive),
        child = _a[0],
        offset = _a[1];

    var position = [[this, index]];

    if (child instanceof ParentBlot) {
      return position.concat(child.path(offset, inclusive));
    } else if (child != null) {
      position.push([child, offset]);
    }

    return position;
  };

  ParentBlot.prototype.removeChild = function (child) {
    this.children.remove(child);
  };

  ParentBlot.prototype.replaceWith = function (name, value) {
    var replacement = typeof name === 'string' ? this.scroll.create(name, value) : name;

    if (replacement instanceof ParentBlot) {
      this.moveChildren(replacement);
    }

    return _super.prototype.replaceWith.call(this, replacement);
  };

  ParentBlot.prototype.split = function (index, force) {
    if (force === void 0) {
      force = false;
    }

    if (!force) {
      if (index === 0) {
        return this;
      }

      if (index === this.length()) {
        return this.next;
      }
    }

    var after = this.clone();

    if (this.parent) {
      this.parent.insertBefore(after, this.next || undefined);
    }

    this.children.forEachAt(index, this.length(), function (child, offset, _length) {
      var split = child.split(offset, force);

      if (split != null) {
        after.appendChild(split);
      }
    });
    return after;
  };

  ParentBlot.prototype.splitAfter = function (child) {
    var after = this.clone();

    while (child.next != null) {
      after.appendChild(child.next);
    }

    if (this.parent) {
      this.parent.insertBefore(after, this.next || undefined);
    }

    return after;
  };

  ParentBlot.prototype.unwrap = function () {
    if (this.parent) {
      this.moveChildren(this.parent, this.next || undefined);
    }

    this.remove();
  };

  ParentBlot.prototype.update = function (mutations, _context) {
    var _this = this;

    var addedNodes = [];
    var removedNodes = [];
    mutations.forEach(function (mutation) {
      if (mutation.target === _this.domNode && mutation.type === 'childList') {
        addedNodes.push.apply(addedNodes, mutation.addedNodes);
        removedNodes.push.apply(removedNodes, mutation.removedNodes);
      }
    });
    removedNodes.forEach(function (node) {
      // Check node has actually been removed
      // One exception is Chrome does not immediately remove IFRAMEs
      // from DOM but MutationRecord is correct in its reported removal
      if (node.parentNode != null && // @ts-ignore
      node.tagName !== 'IFRAME' && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        return;
      }

      var blot = _this.scroll.find(node);

      if (blot == null) {
        return;
      }

      if (blot.domNode.parentNode == null || blot.domNode.parentNode === _this.domNode) {
        blot.detach();
      }
    });
    addedNodes.filter(function (node) {
      return node.parentNode === _this.domNode || node === _this.uiNode;
    }).sort(function (a, b) {
      if (a === b) {
        return 0;
      }

      if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
        return 1;
      }

      return -1;
    }).forEach(function (node) {
      var refBlot = null;

      if (node.nextSibling != null) {
        refBlot = _this.scroll.find(node.nextSibling);
      }

      var blot = makeAttachedBlot(node, _this.scroll);

      if (blot.next !== refBlot || blot.next == null) {
        if (blot.parent != null) {
          blot.parent.removeChild(_this);
        }

        _this.insertBefore(blot, refBlot || undefined);
      }
    });
    this.enforceAllowedChildren();
  };

  ParentBlot.uiClass = '';
  return ParentBlot;
}(shadow);

/* harmony default export */ var abstract_parent = (parent_ParentBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/abstract/container.ts
var container_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();




var container_ContainerBlot =
/** @class */
function (_super) {
  container_extends(ContainerBlot, _super);

  function ContainerBlot() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ContainerBlot.prototype.checkMerge = function () {
    return this.next !== null && this.next.statics.blotName === this.statics.blotName;
  };

  ContainerBlot.prototype.deleteAt = function (index, length) {
    _super.prototype.deleteAt.call(this, index, length);

    this.enforceAllowedChildren();
  };

  ContainerBlot.prototype.formatAt = function (index, length, name, value) {
    _super.prototype.formatAt.call(this, index, length, name, value);

    this.enforceAllowedChildren();
  };

  ContainerBlot.prototype.insertAt = function (index, value, def) {
    _super.prototype.insertAt.call(this, index, value, def);

    this.enforceAllowedChildren();
  };

  ContainerBlot.prototype.optimize = function (context) {
    _super.prototype.optimize.call(this, context);

    if (this.children.length > 0 && this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
  };

  ContainerBlot.blotName = 'container';
  ContainerBlot.scope = src_scope.BLOCK_BLOT;
  return ContainerBlot;
}(abstract_parent);

/* harmony default export */ var container = (container_ContainerBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/abstract/leaf.ts
var leaf_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();




var leaf_LeafBlot =
/** @class */
function (_super) {
  leaf_extends(LeafBlot, _super);

  function LeafBlot() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  LeafBlot.value = function (_domNode) {
    return true;
  };

  LeafBlot.prototype.index = function (node, offset) {
    if (this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      return Math.min(offset, 1);
    }

    return -1;
  };

  LeafBlot.prototype.position = function (index, _inclusive) {
    var childNodes = Array.from(this.parent.domNode.childNodes);
    var offset = childNodes.indexOf(this.domNode);

    if (index > 0) {
      offset += 1;
    }

    return [this.parent.domNode, offset];
  };

  LeafBlot.prototype.value = function () {
    var _a;

    return _a = {}, _a[this.statics.blotName] = this.statics.value(this.domNode) || true, _a;
  };

  LeafBlot.scope = src_scope.INLINE_BLOT;
  return LeafBlot;
}(shadow);

/* harmony default export */ var leaf = (leaf_LeafBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/attributor/attributor.ts


var attributor_Attributor =
/** @class */
function () {
  function Attributor(attrName, keyName, options) {
    if (options === void 0) {
      options = {};
    }

    this.attrName = attrName;
    this.keyName = keyName;
    var attributeBit = src_scope.TYPE & src_scope.ATTRIBUTE;
    this.scope = options.scope != null ? // Ignore type bits, force attribute bit
    options.scope & src_scope.LEVEL | attributeBit : src_scope.ATTRIBUTE;

    if (options.whitelist != null) {
      this.whitelist = options.whitelist;
    }
  }

  Attributor.keys = function (node) {
    return Array.from(node.attributes).map(function (item) {
      return item.name;
    });
  };

  Attributor.prototype.add = function (node, value) {
    if (!this.canAdd(node, value)) {
      return false;
    }

    node.setAttribute(this.keyName, value);
    return true;
  };

  Attributor.prototype.canAdd = function (_node, value) {
    if (this.whitelist == null) {
      return true;
    }

    if (typeof value === 'string') {
      return this.whitelist.indexOf(value.replace(/["']/g, '')) > -1;
    } else {
      return this.whitelist.indexOf(value) > -1;
    }
  };

  Attributor.prototype.remove = function (node) {
    node.removeAttribute(this.keyName);
  };

  Attributor.prototype.value = function (node) {
    var value = node.getAttribute(this.keyName);

    if (this.canAdd(node, value) && value) {
      return value;
    }

    return '';
  };

  return Attributor;
}();

/* harmony default export */ var attributor = (attributor_Attributor);
// CONCATENATED MODULE: ./node_modules/parchment/src/attributor/class.ts
var class_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();



function class_match(node, prefix) {
  var className = node.getAttribute('class') || '';
  return className.split(/\s+/).filter(function (name) {
    return name.indexOf(prefix + "-") === 0;
  });
}

var ClassAttributor =
/** @class */
function (_super) {
  class_extends(ClassAttributor, _super);

  function ClassAttributor() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  ClassAttributor.keys = function (node) {
    return (node.getAttribute('class') || '').split(/\s+/).map(function (name) {
      return name.split('-').slice(0, -1).join('-');
    });
  };

  ClassAttributor.prototype.add = function (node, value) {
    if (!this.canAdd(node, value)) {
      return false;
    }

    this.remove(node);
    node.classList.add(this.keyName + "-" + value);
    return true;
  };

  ClassAttributor.prototype.remove = function (node) {
    var matches = class_match(node, this.keyName);
    matches.forEach(function (name) {
      node.classList.remove(name);
    });

    if (node.classList.length === 0) {
      node.removeAttribute('class');
    }
  };

  ClassAttributor.prototype.value = function (node) {
    var result = class_match(node, this.keyName)[0] || '';
    var value = result.slice(this.keyName.length + 1); // +1 for hyphen

    return this.canAdd(node, value) ? value : '';
  };

  return ClassAttributor;
}(attributor);

/* harmony default export */ var attributor_class = (ClassAttributor);
// CONCATENATED MODULE: ./node_modules/parchment/src/attributor/style.ts
var style_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();



function camelize(name) {
  var parts = name.split('-');
  var rest = parts.slice(1).map(function (part) {
    return part[0].toUpperCase() + part.slice(1);
  }).join('');
  return parts[0] + rest;
}

var StyleAttributor =
/** @class */
function (_super) {
  style_extends(StyleAttributor, _super);

  function StyleAttributor() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  StyleAttributor.keys = function (node) {
    return (node.getAttribute('style') || '').split(';').map(function (value) {
      var arr = value.split(':');
      return arr[0].trim();
    });
  };

  StyleAttributor.prototype.add = function (node, value) {
    if (!this.canAdd(node, value)) {
      return false;
    } // @ts-ignore


    node.style[camelize(this.keyName)] = value;
    return true;
  };

  StyleAttributor.prototype.remove = function (node) {
    // @ts-ignore
    node.style[camelize(this.keyName)] = '';

    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  };

  StyleAttributor.prototype.value = function (node) {
    // @ts-ignore
    var value = node.style[camelize(this.keyName)];
    return this.canAdd(node, value) ? value : '';
  };

  return StyleAttributor;
}(attributor);

/* harmony default export */ var style = (StyleAttributor);
// CONCATENATED MODULE: ./node_modules/parchment/src/attributor/store.ts






var store_AttributorStore =
/** @class */
function () {
  function AttributorStore(domNode) {
    this.attributes = {};
    this.domNode = domNode;
    this.build();
  }

  AttributorStore.prototype.attribute = function (attribute, value) {
    // verb
    if (value) {
      if (attribute.add(this.domNode, value)) {
        if (attribute.value(this.domNode) != null) {
          this.attributes[attribute.attrName] = attribute;
        } else {
          delete this.attributes[attribute.attrName];
        }
      }
    } else {
      attribute.remove(this.domNode);
      delete this.attributes[attribute.attrName];
    }
  };

  AttributorStore.prototype.build = function () {
    var _this = this;

    this.attributes = {};
    var blot = registry.find(this.domNode);

    if (blot == null) {
      return;
    }

    var attributes = attributor.keys(this.domNode);
    var classes = attributor_class.keys(this.domNode);
    var styles = style.keys(this.domNode);
    attributes.concat(classes).concat(styles).forEach(function (name) {
      var attr = blot.scroll.query(name, src_scope.ATTRIBUTE);

      if (attr instanceof attributor) {
        _this.attributes[attr.attrName] = attr;
      }
    });
  };

  AttributorStore.prototype.copy = function (target) {
    var _this = this;

    Object.keys(this.attributes).forEach(function (key) {
      var value = _this.attributes[key].value(_this.domNode);

      target.format(key, value);
    });
  };

  AttributorStore.prototype.move = function (target) {
    var _this = this;

    this.copy(target);
    Object.keys(this.attributes).forEach(function (key) {
      _this.attributes[key].remove(_this.domNode);
    });
    this.attributes = {};
  };

  AttributorStore.prototype.values = function () {
    var _this = this;

    return Object.keys(this.attributes).reduce(function (attributes, name) {
      attributes[name] = _this.attributes[name].value(_this.domNode);
      return attributes;
    }, {});
  };

  return AttributorStore;
}();

/* harmony default export */ var store = (store_AttributorStore);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/inline.ts
var inline_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();





 // Shallow object comparison

function isEqual(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  } // @ts-ignore


  for (var prop in obj1) {
    // @ts-ignore
    if (obj1[prop] !== obj2[prop]) {
      return false;
    }
  }

  return true;
}

var inline_InlineBlot =
/** @class */
function (_super) {
  inline_extends(InlineBlot, _super);

  function InlineBlot(scroll, domNode) {
    var _this = _super.call(this, scroll, domNode) || this;

    _this.attributes = new store(_this.domNode);
    return _this;
  }

  InlineBlot.formats = function (domNode, scroll) {
    var match = scroll.query(InlineBlot.blotName);

    if (match != null && domNode.tagName === match.tagName) {
      return undefined;
    } else if (typeof this.tagName === 'string') {
      return true;
    } else if (Array.isArray(this.tagName)) {
      return domNode.tagName.toLowerCase();
    }

    return undefined;
  };

  InlineBlot.prototype.format = function (name, value) {
    var _this = this;

    if (name === this.statics.blotName && !value) {
      this.children.forEach(function (child) {
        if (!(child instanceof InlineBlot)) {
          child = child.wrap(InlineBlot.blotName, true);
        }

        _this.attributes.copy(child);
      });
      this.unwrap();
    } else {
      var format = this.scroll.query(name, src_scope.INLINE);

      if (format == null) {
        return;
      }

      if (format instanceof attributor) {
        this.attributes.attribute(format, value);
      } else if (value && (name !== this.statics.blotName || this.formats()[name] !== value)) {
        this.replaceWith(name, value);
      }
    }
  };

  InlineBlot.prototype.formats = function () {
    var formats = this.attributes.values();
    var format = this.statics.formats(this.domNode, this.scroll);

    if (format != null) {
      formats[this.statics.blotName] = format;
    }

    return formats;
  };

  InlineBlot.prototype.formatAt = function (index, length, name, value) {
    if (this.formats()[name] != null || this.scroll.query(name, src_scope.ATTRIBUTE)) {
      var blot = this.isolate(index, length);
      blot.format(name, value);
    } else {
      _super.prototype.formatAt.call(this, index, length, name, value);
    }
  };

  InlineBlot.prototype.optimize = function (context) {
    _super.prototype.optimize.call(this, context);

    var formats = this.formats();

    if (Object.keys(formats).length === 0) {
      return this.unwrap(); // unformatted span
    }

    var next = this.next;

    if (next instanceof InlineBlot && next.prev === this && isEqual(formats, next.formats())) {
      next.moveChildren(this);
      next.remove();
    }
  };

  InlineBlot.prototype.replaceWith = function (name, value) {
    var replacement = _super.prototype.replaceWith.call(this, name, value);

    this.attributes.copy(replacement);
    return replacement;
  };

  InlineBlot.prototype.update = function (mutations, context) {
    var _this = this;

    _super.prototype.update.call(this, mutations, context);

    var attributeChanged = mutations.some(function (mutation) {
      return mutation.target === _this.domNode && mutation.type === 'attributes';
    });

    if (attributeChanged) {
      this.attributes.build();
    }
  };

  InlineBlot.prototype.wrap = function (name, value) {
    var wrapper = _super.prototype.wrap.call(this, name, value);

    if (wrapper instanceof InlineBlot) {
      this.attributes.move(wrapper);
    }

    return wrapper;
  };

  InlineBlot.allowedChildren = [InlineBlot, leaf];
  InlineBlot.blotName = 'inline';
  InlineBlot.scope = src_scope.INLINE_BLOT;
  InlineBlot.tagName = 'SPAN';
  return InlineBlot;
}(abstract_parent);

/* harmony default export */ var inline = (inline_InlineBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/block.ts
var block_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();








var block_BlockBlot =
/** @class */
function (_super) {
  block_extends(BlockBlot, _super);

  function BlockBlot(scroll, domNode) {
    var _this = _super.call(this, scroll, domNode) || this;

    _this.attributes = new store(_this.domNode);
    return _this;
  }

  BlockBlot.formats = function (domNode, scroll) {
    var match = scroll.query(BlockBlot.blotName);

    if (match != null && domNode.tagName === match.tagName) {
      return undefined;
    } else if (typeof this.tagName === 'string') {
      return true;
    } else if (Array.isArray(this.tagName)) {
      return domNode.tagName.toLowerCase();
    }
  };

  BlockBlot.prototype.format = function (name, value) {
    var format = this.scroll.query(name, src_scope.BLOCK);

    if (format == null) {
      return;
    } else if (format instanceof attributor) {
      this.attributes.attribute(format, value);
    } else if (name === this.statics.blotName && !value) {
      this.replaceWith(BlockBlot.blotName);
    } else if (value && (name !== this.statics.blotName || this.formats()[name] !== value)) {
      this.replaceWith(name, value);
    }
  };

  BlockBlot.prototype.formats = function () {
    var formats = this.attributes.values();
    var format = this.statics.formats(this.domNode, this.scroll);

    if (format != null) {
      formats[this.statics.blotName] = format;
    }

    return formats;
  };

  BlockBlot.prototype.formatAt = function (index, length, name, value) {
    if (this.scroll.query(name, src_scope.BLOCK) != null) {
      this.format(name, value);
    } else {
      _super.prototype.formatAt.call(this, index, length, name, value);
    }
  };

  BlockBlot.prototype.insertAt = function (index, value, def) {
    if (def == null || this.scroll.query(value, src_scope.INLINE) != null) {
      // Insert text or inline
      _super.prototype.insertAt.call(this, index, value, def);
    } else {
      var after = this.split(index);

      if (after != null) {
        var blot = this.scroll.create(value, def);
        after.parent.insertBefore(blot, after);
      } else {
        throw new Error('Attempt to insertAt after block boundaries');
      }
    }
  };

  BlockBlot.prototype.replaceWith = function (name, value) {
    var replacement = _super.prototype.replaceWith.call(this, name, value);

    this.attributes.copy(replacement);
    return replacement;
  };

  BlockBlot.prototype.update = function (mutations, context) {
    var _this = this;

    _super.prototype.update.call(this, mutations, context);

    var attributeChanged = mutations.some(function (mutation) {
      return mutation.target === _this.domNode && mutation.type === 'attributes';
    });

    if (attributeChanged) {
      this.attributes.build();
    }
  };

  BlockBlot.blotName = 'block';
  BlockBlot.scope = src_scope.BLOCK_BLOT;
  BlockBlot.tagName = 'P';
  BlockBlot.allowedChildren = [inline, BlockBlot, leaf];
  return BlockBlot;
}(abstract_parent);

/* harmony default export */ var block = (block_BlockBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/embed.ts
var embed_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();



var EmbedBlot =
/** @class */
function (_super) {
  embed_extends(EmbedBlot, _super);

  function EmbedBlot() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  EmbedBlot.formats = function (_domNode, _scroll) {
    return undefined;
  };

  EmbedBlot.prototype.format = function (name, value) {
    // super.formatAt wraps, which is what we want in general,
    // but this allows subclasses to overwrite for formats
    // that just apply to particular embeds
    _super.prototype.formatAt.call(this, 0, this.length(), name, value);
  };

  EmbedBlot.prototype.formatAt = function (index, length, name, value) {
    if (index === 0 && length === this.length()) {
      this.format(name, value);
    } else {
      _super.prototype.formatAt.call(this, index, length, name, value);
    }
  };

  EmbedBlot.prototype.formats = function () {
    return this.statics.formats(this.domNode, this.scroll);
  };

  return EmbedBlot;
}(leaf);

/* harmony default export */ var blot_embed = (EmbedBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/scroll.ts
var scroll_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();






var OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true
};
var MAX_OPTIMIZE_ITERATIONS = 100;

var scroll_ScrollBlot =
/** @class */
function (_super) {
  scroll_extends(ScrollBlot, _super);

  function ScrollBlot(registry, node) {
    var _this = // @ts-ignore
    _super.call(this, null, node) || this;

    _this.registry = registry;
    _this.scroll = _this;

    _this.build();

    _this.observer = new MutationObserver(function (mutations) {
      _this.update(mutations);
    });

    _this.observer.observe(_this.domNode, OBSERVER_CONFIG);

    _this.attach();

    return _this;
  }

  ScrollBlot.prototype.create = function (input, value) {
    return this.registry.create(this, input, value);
  };

  ScrollBlot.prototype.find = function (node, bubble) {
    if (bubble === void 0) {
      bubble = false;
    }

    return this.registry.find(node, bubble);
  };

  ScrollBlot.prototype.query = function (query, scope) {
    if (scope === void 0) {
      scope = src_scope.ANY;
    }

    return this.registry.query(query, scope);
  };

  ScrollBlot.prototype.register = function () {
    var _a;

    var definitions = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      definitions[_i] = arguments[_i];
    }

    return (_a = this.registry).register.apply(_a, definitions);
  };

  ScrollBlot.prototype.build = function () {
    if (this.scroll == null) {
      return;
    }

    _super.prototype.build.call(this);
  };

  ScrollBlot.prototype.detach = function () {
    _super.prototype.detach.call(this);

    this.observer.disconnect();
  };

  ScrollBlot.prototype.deleteAt = function (index, length) {
    this.update();

    if (index === 0 && length === this.length()) {
      this.children.forEach(function (child) {
        child.remove();
      });
    } else {
      _super.prototype.deleteAt.call(this, index, length);
    }
  };

  ScrollBlot.prototype.formatAt = function (index, length, name, value) {
    this.update();

    _super.prototype.formatAt.call(this, index, length, name, value);
  };

  ScrollBlot.prototype.insertAt = function (index, value, def) {
    this.update();

    _super.prototype.insertAt.call(this, index, value, def);
  };

  ScrollBlot.prototype.optimize = function (mutations, context) {
    var _this = this;

    if (mutations === void 0) {
      mutations = [];
    }

    if (context === void 0) {
      context = {};
    }

    _super.prototype.optimize.call(this, context);

    var mutationsMap = context.mutationsMap || new WeakMap(); // We must modify mutations directly, cannot make copy and then modify

    var records = Array.from(this.observer.takeRecords()); // Array.push currently seems to be implemented by a non-tail recursive function
    // so we cannot just mutations.push.apply(mutations, this.observer.takeRecords());

    while (records.length > 0) {
      mutations.push(records.pop());
    }

    var mark = function mark(blot, markParent) {
      if (markParent === void 0) {
        markParent = true;
      }

      if (blot == null || blot === _this) {
        return;
      }

      if (blot.domNode.parentNode == null) {
        return;
      }

      if (!mutationsMap.has(blot.domNode)) {
        mutationsMap.set(blot.domNode, []);
      }

      if (markParent) {
        mark(blot.parent);
      }
    };

    var optimize = function optimize(blot) {
      // Post-order traversal
      if (!mutationsMap.has(blot.domNode)) {
        return;
      }

      if (blot instanceof abstract_parent) {
        blot.children.forEach(optimize);
      }

      mutationsMap.delete(blot.domNode);
      blot.optimize(context);
    };

    var remaining = mutations;

    for (var i = 0; remaining.length > 0; i += 1) {
      if (i >= MAX_OPTIMIZE_ITERATIONS) {
        throw new Error('[Parchment] Maximum optimize iterations reached');
      }

      remaining.forEach(function (mutation) {
        var blot = _this.find(mutation.target, true);

        if (blot == null) {
          return;
        }

        if (blot.domNode === mutation.target) {
          if (mutation.type === 'childList') {
            mark(_this.find(mutation.previousSibling, false));
            Array.from(mutation.addedNodes).forEach(function (node) {
              var child = _this.find(node, false);

              mark(child, false);

              if (child instanceof abstract_parent) {
                child.children.forEach(function (grandChild) {
                  mark(grandChild, false);
                });
              }
            });
          } else if (mutation.type === 'attributes') {
            mark(blot.prev);
          }
        }

        mark(blot);
      });
      this.children.forEach(optimize);
      remaining = Array.from(this.observer.takeRecords());
      records = remaining.slice();

      while (records.length > 0) {
        mutations.push(records.pop());
      }
    }
  };

  ScrollBlot.prototype.update = function (mutations, context) {
    var _this = this;

    if (context === void 0) {
      context = {};
    }

    mutations = mutations || this.observer.takeRecords();
    var mutationsMap = new WeakMap();
    mutations.map(function (mutation) {
      var blot = registry.find(mutation.target, true);

      if (blot == null) {
        return null;
      }

      if (mutationsMap.has(blot.domNode)) {
        mutationsMap.get(blot.domNode).push(mutation);
        return null;
      } else {
        mutationsMap.set(blot.domNode, [mutation]);
        return blot;
      }
    }).forEach(function (blot) {
      if (blot != null && blot !== _this && mutationsMap.has(blot.domNode)) {
        blot.update(mutationsMap.get(blot.domNode) || [], context);
      }
    });
    context.mutationsMap = mutationsMap;

    if (mutationsMap.has(this.domNode)) {
      _super.prototype.update.call(this, mutationsMap.get(this.domNode), context);
    }

    this.optimize(mutations, context);
  };

  ScrollBlot.blotName = 'scroll';
  ScrollBlot.defaultChild = block;
  ScrollBlot.allowedChildren = [block, container];
  ScrollBlot.scope = src_scope.BLOCK_BLOT;
  ScrollBlot.tagName = 'DIV';
  return ScrollBlot;
}(abstract_parent);

/* harmony default export */ var blot_scroll = (scroll_ScrollBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/blot/text.ts
var text_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();




var text_TextBlot =
/** @class */
function (_super) {
  text_extends(TextBlot, _super);

  function TextBlot(scroll, node) {
    var _this = _super.call(this, scroll, node) || this;

    _this.text = _this.statics.value(_this.domNode);
    return _this;
  }

  TextBlot.create = function (value) {
    return document.createTextNode(value);
  };

  TextBlot.value = function (domNode) {
    return domNode.data;
  };

  TextBlot.prototype.deleteAt = function (index, length) {
    this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length);
  };

  TextBlot.prototype.index = function (node, offset) {
    if (this.domNode === node) {
      return offset;
    }

    return -1;
  };

  TextBlot.prototype.insertAt = function (index, value, def) {
    if (def == null) {
      this.text = this.text.slice(0, index) + value + this.text.slice(index);
      this.domNode.data = this.text;
    } else {
      _super.prototype.insertAt.call(this, index, value, def);
    }
  };

  TextBlot.prototype.length = function () {
    return this.text.length;
  };

  TextBlot.prototype.optimize = function (context) {
    _super.prototype.optimize.call(this, context);

    this.text = this.statics.value(this.domNode);

    if (this.text.length === 0) {
      this.remove();
    } else if (this.next instanceof TextBlot && this.next.prev === this) {
      this.insertAt(this.length(), this.next.value());
      this.next.remove();
    }
  };

  TextBlot.prototype.position = function (index, _inclusive) {
    if (_inclusive === void 0) {
      _inclusive = false;
    }

    return [this.domNode, index];
  };

  TextBlot.prototype.split = function (index, force) {
    if (force === void 0) {
      force = false;
    }

    if (!force) {
      if (index === 0) {
        return this;
      }

      if (index === this.length()) {
        return this.next;
      }
    }

    var after = this.scroll.create(this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next || undefined);
    this.text = this.statics.value(this.domNode);
    return after;
  };

  TextBlot.prototype.update = function (mutations, _context) {
    var _this = this;

    if (mutations.some(function (mutation) {
      return mutation.type === 'characterData' && mutation.target === _this.domNode;
    })) {
      this.text = this.statics.value(this.domNode);
    }
  };

  TextBlot.prototype.value = function () {
    return this.text;
  };

  TextBlot.blotName = 'text';
  TextBlot.scope = src_scope.INLINE_BLOT;
  return TextBlot;
}(leaf);

/* harmony default export */ var blot_text = (text_TextBlot);
// CONCATENATED MODULE: ./node_modules/parchment/src/parchment.ts
















/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95);
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(eventemitter3__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_has_window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _instances__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(23);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var debug = Object(_logger__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])('quill:events');
var EVENTS = ['selectionchange', 'mousedown', 'mouseup', 'click'];

if (Object(_utils_has_window__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])()) {
  EVENTS.forEach(function (eventName) {
    document.addEventListener(eventName, function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      Array.from(document.querySelectorAll('.ql-container')).forEach(function (node) {
        var quill = _instances__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].get(node);

        if (quill && quill.emitter) {
          var _quill$emitter;

          (_quill$emitter = quill.emitter).handleDOM.apply(_quill$emitter, args);
        }
      });
    });
  });
}

var Emitter = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Emitter, _EventEmitter);

  var _super = _createSuper(Emitter);

  function Emitter() {
    var _this;

    _classCallCheck(this, Emitter);

    _this = _super.call(this);
    _this.listeners = {};

    _this.on('error', debug.error);

    return _this;
  }

  _createClass(Emitter, [{
    key: "emit",
    value: function emit() {
      var _debug$log, _get2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      (_debug$log = debug.log).call.apply(_debug$log, [debug].concat(args));

      (_get2 = _get(_getPrototypeOf(Emitter.prototype), "emit", this)).call.apply(_get2, [this].concat(args));
    }
  }, {
    key: "handleDOM",
    value: function handleDOM(event) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      (this.listeners[event.type] || []).forEach(function (_ref) {
        var node = _ref.node,
            handler = _ref.handler;

        if (event.target === node || node.contains(event.target)) {
          handler.apply(void 0, [event].concat(args));
        }
      });
    }
  }, {
    key: "listenDOM",
    value: function listenDOM(eventName, node, handler) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }

      this.listeners[eventName].push({
        node: node,
        handler: handler
      });
    }
  }]);

  return Emitter;
}(eventemitter3__WEBPACK_IMPORTED_MODULE_0___default.a);

Emitter.events = {
  EDITOR_CHANGE: 'editor-change',
  SCROLL_BEFORE_UPDATE: 'scroll-before-update',
  SCROLL_BLOT_MOUNT: 'scroll-blot-mount',
  SCROLL_BLOT_UNMOUNT: 'scroll-blot-unmount',
  SCROLL_OPTIMIZE: 'scroll-optimize',
  SCROLL_UPDATE: 'scroll-update',
  SELECTION_CHANGE: 'selection-change',
  TEXT_CHANGE: 'text-change',
  CONTENT_SETTED: 'content-setted'
};
Emitter.sources = {
  API: 'api',
  SILENT: 'silent',
  USER: 'user'
};
/* harmony default export */ __webpack_exports__["a"] = (Emitter);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/lodash.clonedeep/index.js
var lodash_clonedeep = __webpack_require__(16);
var lodash_clonedeep_default = /*#__PURE__*/__webpack_require__.n(lodash_clonedeep);

// EXTERNAL MODULE: ./node_modules/lodash.isequal/index.js
var lodash_isequal = __webpack_require__(30);
var lodash_isequal_default = /*#__PURE__*/__webpack_require__.n(lodash_isequal);

// EXTERNAL MODULE: ./node_modules/lodash.merge/index.js
var lodash_merge = __webpack_require__(37);
var lodash_merge_default = /*#__PURE__*/__webpack_require__.n(lodash_merge);

// EXTERNAL MODULE: ./node_modules/quill-delta/dist/Delta.js
var Delta = __webpack_require__(1);
var Delta_default = /*#__PURE__*/__webpack_require__.n(Delta);

// EXTERNAL MODULE: ./node_modules/parchment/src/parchment.ts + 17 modules
var parchment = __webpack_require__(2);

// EXTERNAL MODULE: ./core/selection.js
var selection = __webpack_require__(7);

// EXTERNAL MODULE: ./blots/cursor.js
var cursor = __webpack_require__(24);

// EXTERNAL MODULE: ./blots/block.js + 1 modules
var blots_block = __webpack_require__(6);

// EXTERNAL MODULE: ./blots/break.js
var blots_break = __webpack_require__(10);

// EXTERNAL MODULE: ./blots/text.js
var blots_text = __webpack_require__(9);

// CONCATENATED MODULE: ./utils/remove_class.js
function removeClass(node, className) {
  node.classList.remove(className);

  if (node.classList.length === 0) {
    node.removeAttribute('class');
  }
}
// CONCATENATED MODULE: ./core/editor.js
function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }












var ASCII = /^[ -~]*$/;

var editor_Editor = /*#__PURE__*/function () {
  function Editor(scroll) {
    _classCallCheck(this, Editor);

    this.scroll = scroll;
    this.delta = this.getDelta();
    this.immediateFormats = new Set();
  }

  _createClass(Editor, [{
    key: "addImmediateFormat",
    value: function addImmediateFormat(name) {
      this.immediateFormats.add(name);
    }
  }, {
    key: "applyDelta",
    value: function applyDelta(delta) {
      var _this = this;

      this.scroll.update();
      var scrollLength = this.scroll.length();
      this.scroll.batchStart();
      var normalizedDelta = normalizeDelta(delta);
      var deleteDelta = new Delta_default.a();
      normalizedDelta.reduce(function (index, op) {
        var length = Delta["Op"].length(op);
        var attributes = op.attributes || {};
        var addedNewline = false;

        if (op.insert != null) {
          deleteDelta.retain(length);

          if (typeof op.insert === 'string') {
            var text = op.insert;
            addedNewline = !text.endsWith('\n') && (scrollLength <= index || _this.scroll.descendant(blots_block["a" /* BlockEmbed */], index)[0]);

            _this.scroll.insertAt(index, text);

            var _this$scroll$line = _this.scroll.line(index),
                _this$scroll$line2 = _slicedToArray(_this$scroll$line, 2),
                line = _this$scroll$line2[0],
                offset = _this$scroll$line2[1];

            var formats = lodash_merge_default()({}, Object(blots_block["c" /* bubbleFormats */])(line));

            if (line instanceof blots_block["d" /* default */]) {
              var _line$descendant = line.descendant(parchment["LeafBlot"], offset),
                  _line$descendant2 = _slicedToArray(_line$descendant, 1),
                  leaf = _line$descendant2[0];

              formats = lodash_merge_default()(formats, Object(blots_block["c" /* bubbleFormats */])(leaf));
            }

            attributes = Delta["AttributeMap"].diff(formats, attributes) || {};
          } else if (_typeof(op.insert) === 'object') {
            var key = Object.keys(op.insert)[0]; // There should only be one key

            if (key == null) return index;
            addedNewline = _this.scroll.query(key, parchment["Scope"].INLINE) != null && (scrollLength <= index || _this.scroll.descendant(blots_block["a" /* BlockEmbed */], index)[0]);

            _this.scroll.insertAt(index, key, op.insert[key]);
          }

          scrollLength += length;
        } else {
          deleteDelta.push(op);
        }

        var keys = Object.keys(attributes);

        _this.immediateFormats.forEach(function (format) {
          if (keys.indexOf(format) > -1) {
            _this.scroll.formatAt(index, length, format, attributes[format]);

            delete attributes[format];
          }
        });

        Object.keys(attributes).forEach(function (name) {
          _this.scroll.formatAt(index, length, name, attributes[name]);
        });
        var addedLength = addedNewline ? 1 : 0;
        scrollLength += addedLength;
        deleteDelta.delete(addedLength);
        return index + length + addedLength;
      }, 0);
      deleteDelta.reduce(function (index, op) {
        if (typeof op.delete === 'number') {
          _this.scroll.deleteAt(index, op.delete);

          return index;
        }

        return index + Delta["Op"].length(op);
      }, 0);
      this.scroll.batchEnd();
      this.scroll.optimize();
      return this.update(normalizedDelta);
    }
  }, {
    key: "deleteText",
    value: function deleteText(index, length) {
      this.scroll.deleteAt(index, length);
      return this.update(new Delta_default.a().retain(index).delete(length));
    }
  }, {
    key: "formatLine",
    value: function formatLine(index, length) {
      var _this2 = this;

      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.scroll.update();
      Object.keys(formats).forEach(function (format) {
        _this2.scroll.lines(index, Math.max(length, 1)).forEach(function (line) {
          line.format(format, formats[format]);
        });
      });
      this.scroll.optimize();
      var delta = new Delta_default.a().retain(index).retain(length, lodash_clonedeep_default()(formats));
      return this.update(delta);
    }
  }, {
    key: "formatText",
    value: function formatText(index, length) {
      var _this3 = this;

      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      Object.keys(formats).forEach(function (format) {
        _this3.scroll.formatAt(index, length, format, formats[format]);
      });
      var delta = new Delta_default.a().retain(index).retain(length, lodash_clonedeep_default()(formats));
      return this.update(delta);
    }
  }, {
    key: "getContents",
    value: function getContents(index, length) {
      return this.delta.slice(index, index + length);
    }
  }, {
    key: "getDelta",
    value: function getDelta() {
      return this.scroll.lines().reduce(function (delta, line) {
        return delta.concat(line.delta());
      }, new Delta_default.a());
    }
  }, {
    key: "getFormat",
    value: function getFormat(index) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var lines = [];
      var leaves = [];

      if (length === 0) {
        this.scroll.path(index).forEach(function (path) {
          var _path = _slicedToArray(path, 1),
              blot = _path[0];

          if (blot instanceof blots_block["d" /* default */]) {
            lines.push(blot);
          } else if (blot instanceof parchment["LeafBlot"]) {
            leaves.push(blot);
          }
        });
      } else {
        lines = this.scroll.lines(index, length);
        leaves = this.scroll.descendants(parchment["LeafBlot"], index, length);
      }

      var _map = [lines, leaves].map(function (blots) {
        if (blots.length === 0) return {};
        var formats = Object(blots_block["c" /* bubbleFormats */])(blots.shift());

        while (Object.keys(formats).length > 0) {
          var blot = blots.shift();
          if (blot == null) return formats;
          formats = combineFormats(Object(blots_block["c" /* bubbleFormats */])(blot), formats);
        }

        return formats;
      });

      var _map2 = _slicedToArray(_map, 2);

      lines = _map2[0];
      leaves = _map2[1];
      return _objectSpread(_objectSpread({}, lines), leaves);
    }
  }, {
    key: "getHTML",
    value: function getHTML(index, length) {
      var _this$scroll$line3 = this.scroll.line(index),
          _this$scroll$line4 = _slicedToArray(_this$scroll$line3, 2),
          line = _this$scroll$line4[0],
          lineOffset = _this$scroll$line4[1];

      if (line.length() >= lineOffset + length) {
        return convertHTML(line, lineOffset, length, true);
      }

      return convertHTML(this.scroll, index, length, true);
    }
  }, {
    key: "getText",
    value: function getText(index, length) {
      return this.getContents(index, length).filter(function (op) {
        return typeof op.insert === 'string';
      }).map(function (op) {
        return op.insert;
      }).join('');
    }
  }, {
    key: "insertEmbed",
    value: function insertEmbed(index, embed, value) {
      this.scroll.insertAt(index, embed, value);
      return this.update(new Delta_default.a().retain(index).insert(_defineProperty({}, embed, value)));
    }
  }, {
    key: "insertText",
    value: function insertText(index, text) {
      var _this4 = this;

      var formats = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      this.scroll.insertAt(index, text);
      Object.keys(formats).forEach(function (format) {
        _this4.scroll.formatAt(index, text.length, format, formats[format]);
      });
      return this.update(new Delta_default.a().retain(index).insert(text, lodash_clonedeep_default()(formats)));
    }
  }, {
    key: "isBlank",
    value: function isBlank() {
      var isComposing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.scroll.children.length === 0) return true;
      if (isComposing) return false;
      if (this.scroll.children.length > 1) return false;
      var block = this.scroll.children.head;
      if (block.statics.blotName !== blots_block["d" /* default */].blotName) return false;
      if (block.children.length > 1) return false;
      return block.children.head instanceof blots_break["a" /* default */];
    }
  }, {
    key: "removeFormat",
    value: function removeFormat(index, length) {
      var text = this.getText(index, length);

      var _this$scroll$line5 = this.scroll.line(index + length),
          _this$scroll$line6 = _slicedToArray(_this$scroll$line5, 2),
          line = _this$scroll$line6[0],
          offset = _this$scroll$line6[1];

      var suffixLength = 0;
      var suffix = new Delta_default.a();

      if (line != null) {
        suffixLength = line.length() - offset;
        suffix = line.delta().slice(offset, offset + suffixLength - 1).insert('\n');
      }

      var contents = this.getContents(index, length + suffixLength);
      var diff = contents.diff(new Delta_default.a().insert(text).concat(suffix));
      var delta = new Delta_default.a().retain(index).concat(diff);
      return this.applyDelta(delta);
    }
  }, {
    key: "update",
    value: function update(change) {
      var mutations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var selectionInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var oldDelta = this.delta;

      if (mutations.length === 1 && mutations[0].type === 'characterData' && mutations[0].target.data.match(ASCII) && this.scroll.find(mutations[0].target)) {
        // Optimization for character changes
        var textBlot = this.scroll.find(mutations[0].target);
        var formats = Object(blots_block["c" /* bubbleFormats */])(textBlot);
        var index = textBlot.offset(this.scroll);
        var oldValue = mutations[0].oldValue.replace(cursor["a" /* default */].CONTENTS, '');
        var oldText = new Delta_default.a().insert(oldValue);
        var newText = new Delta_default.a().insert(textBlot.value());
        var relativeSelectionInfo = selectionInfo && {
          oldRange: shiftRange(selectionInfo.oldRange, -index),
          newRange: shiftRange(selectionInfo.newRange, -index)
        };
        var diffDelta = new Delta_default.a().retain(index).concat(oldText.diff(newText, relativeSelectionInfo));
        change = diffDelta.reduce(function (delta, op) {
          if (op.insert) {
            return delta.insert(op.insert, formats);
          }

          return delta.push(op);
        }, new Delta_default.a());
        this.delta = oldDelta.compose(change);
      } else {
        this.delta = this.getDelta();

        if (!change || !lodash_isequal_default()(oldDelta.compose(change), this.delta)) {
          change = oldDelta.diff(this.delta, selectionInfo);
        }
      }

      return change;
    }
  }]);

  return Editor;
}();

function convertListHTML(items, lastIndent, types) {
  if (items.length === 0) {
    var _getListType = getListType(types.pop()),
        _getListType2 = _slicedToArray(_getListType, 1),
        _endTag = _getListType2[0];

    if (lastIndent <= 0) {
      return "</li></".concat(_endTag, ">");
    }

    return "</li></".concat(_endTag, ">").concat(convertListHTML([], lastIndent - 1, types));
  }

  var _items = _toArray(items),
      _items$ = _items[0],
      child = _items$.child,
      offset = _items$.offset,
      length = _items$.length,
      indent = _items$.indent,
      type = _items$.type,
      rest = _items.slice(1);

  var _getListType3 = getListType(type, child),
      _getListType4 = _slicedToArray(_getListType3, 2),
      tag = _getListType4[0],
      attribute = _getListType4[1];

  if (indent > lastIndent) {
    types.push(type);

    if (indent === lastIndent + 1) {
      return "<".concat(tag, "><li").concat(attribute, ">").concat(convertHTML(child, offset, length)).concat(convertListHTML(rest, indent, types));
    }

    return "<".concat(tag, "><li>").concat(convertListHTML(items, lastIndent + 1, types));
  }

  var previousType = types[types.length - 1];

  if (indent === lastIndent && type === previousType) {
    return "</li><li".concat(attribute, ">").concat(convertHTML(child, offset, length)).concat(convertListHTML(rest, indent, types));
  }

  var _getListType5 = getListType(types.pop()),
      _getListType6 = _slicedToArray(_getListType5, 1),
      endTag = _getListType6[0];

  return "</li></".concat(endTag, ">").concat(convertListHTML(items, lastIndent - 1, types));
}

function convertHTML(blot, index, length) {
  var isRoot = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (typeof blot.html === 'function') {
    return blot.html(index, length);
  }

  if (blot instanceof blots_text["a" /* default */]) {
    return Object(blots_text["b" /* escapeText */])(blot.value().slice(index, index + length));
  }

  if (blot.children) {
    // TODO fix API
    if (blot.statics.blotName === 'list-container') {
      var items = [];
      blot.children.forEachAt(index, length, function (child, offset, childLength) {
        var formats = child.formats();
        items.push({
          child: child,
          offset: offset,
          length: childLength,
          indent: formats.indent || 0,
          type: formats.list
        });
      });
      return convertListHTML(items, -1, []);
    }

    var parts = [];
    blot.children.forEachAt(index, length, function (child, offset, childLength) {
      parts.push(convertHTML(child, offset, childLength));
    });
    handleBreakLine(blot.children, parts);

    if (isRoot || blot.statics.blotName === 'list') {
      return parts.join('');
    }

    var domNode = extractNodeFromBlot(blot);
    var outerHTML = domNode.outerHTML,
        innerHTML = domNode.innerHTML;

    var _outerHTML$split = outerHTML.split(">".concat(innerHTML, "<")),
        _outerHTML$split2 = _slicedToArray(_outerHTML$split, 2),
        start = _outerHTML$split2[0],
        end = _outerHTML$split2[1];

    if (start.indexOf('<table') === 0) {
      return "".concat(start.replace(/(\sdata-.+?=["'].*?["'])/g, ''), ">").concat(parts.join('').replace(/(\sdata-table.+?=["'].*?["'])/g, ''), "<").concat(end);
    }

    return "".concat(start, ">").concat(parts.join(''), "<").concat(end);
  }

  return blot.domNode.outerHTML;
}

function handleBreakLine(linkedList, parts) {
  if (linkedList.length === 1 && linkedList.head instanceof blots_break["a" /* default */]) {
    parts.push('<br>');
  }
}

function extractNodeFromBlot(blot) {
  var domNode = blot.domNode.cloneNode(true);
  return removeTableServiceClasses(blot, domNode);
}

function removeTableServiceClasses(blot, domNode) {
  var BLOTS_WITH_SERVICE_CLASS = ['tableCellLine', 'tableHeaderCellLine', 'tableCell', 'tableHeaderCell'];

  if (BLOTS_WITH_SERVICE_CLASS.includes(blot.statics.blotName)) {
    removeClass(domNode, blot.statics.className);
  }

  return domNode;
}

function combineFormats(formats, combined) {
  return Object.keys(combined).reduce(function (merged, name) {
    if (formats[name] == null) return merged;

    if (combined[name] === formats[name]) {
      merged[name] = combined[name];
    } else if (Array.isArray(combined[name])) {
      if (combined[name].indexOf(formats[name]) < 0) {
        merged[name] = combined[name].concat([formats[name]]);
      }
    } else {
      merged[name] = [combined[name], formats[name]];
    }

    return merged;
  }, {});
}

function getListType(type, child) {
  var tag = type === 'ordered' ? 'ol' : 'ul';
  var attributes = child ? "".concat(getBlotNodeAttributes(child)) : '';

  switch (type) {
    case 'checked':
      return [tag, "".concat(attributes, " data-list=\"checked\"")];

    case 'unchecked':
      return [tag, "".concat(attributes, " data-list=\"unchecked\"")];

    default:
      return [tag, attributes];
  }
}

function getBlotNodeAttributes(_ref) {
  var domNode = _ref.domNode;

  if (!domNode.hasAttributes()) {
    return '';
  }

  var attributes = domNode.attributes;
  var attributesString = ' ';

  for (var i = 0; i < attributes.length; i += 1) {
    var name = attributes[i].name;
    var value = attributes[i].value;

    if (name === 'class') {
      value = removeIndentClass(value);
    }

    if (value.length && name.indexOf('data-') === -1) {
      attributesString += "".concat(name, "=\"").concat(value, "\"");
    }
  }

  return attributesString.length > 1 ? attributesString : '';
}

function removeIndentClass(classString) {
  return classString.replace(/ql-indent-\d/g, '').trim();
}

function normalizeDelta(delta) {
  return delta.reduce(function (normalizedDelta, op) {
    if (typeof op.insert === 'string') {
      var text = op.insert.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      return normalizedDelta.insert(text, op.attributes);
    }

    return normalizedDelta.push(op);
  }, new Delta_default.a());
}

function shiftRange(_ref2, amount) {
  var index = _ref2.index,
      length = _ref2.length;
  return new selection["a" /* Range */](index + amount, length);
}

/* harmony default export */ var editor = __webpack_exports__["a"] = (editor_Editor);

/***/ }),
/* 5 */,
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "b", function() { return /* binding */ blockDelta; });
__webpack_require__.d(__webpack_exports__, "c", function() { return /* binding */ bubbleFormats; });
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ block_BlockEmbed; });
__webpack_require__.d(__webpack_exports__, "d", function() { return /* binding */ block_Block; });

// EXTERNAL MODULE: ./node_modules/quill-delta/dist/Delta.js
var Delta = __webpack_require__(1);
var Delta_default = /*#__PURE__*/__webpack_require__.n(Delta);

// EXTERNAL MODULE: ./node_modules/parchment/src/parchment.ts + 17 modules
var parchment = __webpack_require__(2);

// EXTERNAL MODULE: ./blots/break.js
var blots_break = __webpack_require__(10);

// EXTERNAL MODULE: ./blots/inline.js
var inline = __webpack_require__(14);

// EXTERNAL MODULE: ./blots/text.js
var blots_text = __webpack_require__(9);

// EXTERNAL MODULE: ./attributors/utils.js
var utils = __webpack_require__(19);

// CONCATENATED MODULE: ./parchment/override.js



function fillAttributes(tagName, blot, keyNames, keyType) {
  return keyNames.map((keyName) => {
    const normalizedKeyName = keyType
      ? Object(utils["b" /* getKeyNameWithCustomPrefix */])(tagName, keyName, keyType)
      : keyName;
    return blot.scroll.query(normalizedKeyName, parchment["Scope"].ATTRIBUTE);
  }).filter((attributor) => attributor instanceof parchment["Attributor"])
    .reduce((result, attributor) => {
      result[attributor.attrName] = attributor;
      return result;
    }, {});
}

function overrideParchment() {
  // eslint-disable-next-line no-undef, func-names
  parchment["AttributorStore"].prototype.build = function () {
    const { tagName } = this.domNode;
    const blot = parchment["Registry"].find(this.domNode);
    if (blot == null) {
      return;
    }

    const attributes = parchment["Attributor"].keys(this.domNode);
    const classes = parchment["ClassAttributor"].keys(this.domNode);
    const styles = parchment["StyleAttributor"].keys(this.domNode);

    this.attributes = {
      ...fillAttributes(tagName, blot, attributes, utils["a" /* KeyNameType */].attribute),
      ...fillAttributes(tagName, blot, classes),
      ...fillAttributes(tagName, blot, styles, utils["a" /* KeyNameType */].style),
    };
  };
}

// CONCATENATED MODULE: ./blots/block.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }







overrideParchment();
var NEWLINE_LENGTH = 1;

var block_Block = /*#__PURE__*/function (_BlockBlot) {
  _inherits(Block, _BlockBlot);

  var _super = _createSuper(Block);

  function Block(scroll, domNode) {
    var _this;

    _classCallCheck(this, Block);

    _this = _super.call(this, scroll, domNode);
    _this.cache = {};
    return _this;
  }

  _createClass(Block, [{
    key: "delta",
    value: function delta() {
      if (this.cache.delta == null) {
        this.cache.delta = blockDelta(this);
      }

      return this.cache.delta;
    }
  }, {
    key: "deleteAt",
    value: function deleteAt(index, length) {
      _get(_getPrototypeOf(Block.prototype), "deleteAt", this).call(this, index, length);

      this.cache = {};
    }
  }, {
    key: "formatAt",
    value: function formatAt(index, length, name, value) {
      if (length <= 0) return;

      if (this.scroll.query(name, parchment["Scope"].BLOCK)) {
        if (index + length === this.length()) {
          this.format(name, value);
        }
      } else {
        _get(_getPrototypeOf(Block.prototype), "formatAt", this).call(this, index, Math.min(length, this.length() - index - 1), name, value);
      }

      this.cache = {};
    }
  }, {
    key: "insertAt",
    value: function insertAt(index, value, def) {
      if (def != null) {
        _get(_getPrototypeOf(Block.prototype), "insertAt", this).call(this, index, value, def);

        this.cache = {};
        return;
      }

      if (value.length === 0) return;
      var lines = value.split('\n');
      var text = lines.shift();

      if (text.length > 0) {
        if (index < this.length() - 1 || this.children.tail == null) {
          _get(_getPrototypeOf(Block.prototype), "insertAt", this).call(this, Math.min(index, this.length() - 1), text);
        } else {
          this.children.tail.insertAt(this.children.tail.length(), text);
        }

        this.cache = {};
      }

      var block = this;
      lines.reduce(function (lineIndex, line) {
        block = block.split(lineIndex, true);
        block.insertAt(0, line);
        return line.length;
      }, index + text.length);
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(blot, ref) {
      var head = this.children.head;

      _get(_getPrototypeOf(Block.prototype), "insertBefore", this).call(this, blot, ref);

      if (head instanceof blots_break["a" /* default */]) {
        head.remove();
      }

      this.cache = {};
    }
  }, {
    key: "length",
    value: function length() {
      if (this.cache.length == null) {
        this.cache.length = _get(_getPrototypeOf(Block.prototype), "length", this).call(this) + NEWLINE_LENGTH;
      }

      return this.cache.length;
    }
  }, {
    key: "moveChildren",
    value: function moveChildren(target, ref) {
      _get(_getPrototypeOf(Block.prototype), "moveChildren", this).call(this, target, ref);

      this.cache = {};
    }
  }, {
    key: "optimize",
    value: function optimize(context) {
      _get(_getPrototypeOf(Block.prototype), "optimize", this).call(this, context);

      this.cache = {};
    }
  }, {
    key: "path",
    value: function path(index) {
      return _get(_getPrototypeOf(Block.prototype), "path", this).call(this, index, true);
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      _get(_getPrototypeOf(Block.prototype), "removeChild", this).call(this, child);

      this.cache = {};
    }
  }, {
    key: "split",
    value: function split(index) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
        var clone = this.clone();

        if (index === 0) {
          this.parent.insertBefore(clone, this);
          return this;
        }

        this.parent.insertBefore(clone, this.next);
        return clone;
      }

      var next = _get(_getPrototypeOf(Block.prototype), "split", this).call(this, index, force);

      this.cache = {};
      return next;
    }
  }]);

  return Block;
}(parchment["BlockBlot"]);

block_Block.blotName = 'block';
block_Block.tagName = 'P';
block_Block.defaultChild = blots_break["a" /* default */];
block_Block.allowedChildren = [blots_break["a" /* default */], inline["a" /* default */], parchment["EmbedBlot"], blots_text["a" /* default */]];

var block_BlockEmbed = /*#__PURE__*/function (_EmbedBlot) {
  _inherits(BlockEmbed, _EmbedBlot);

  var _super2 = _createSuper(BlockEmbed);

  function BlockEmbed() {
    _classCallCheck(this, BlockEmbed);

    return _super2.apply(this, arguments);
  }

  _createClass(BlockEmbed, [{
    key: "attach",
    value: function attach() {
      _get(_getPrototypeOf(BlockEmbed.prototype), "attach", this).call(this);

      this.attributes = new parchment["AttributorStore"](this.domNode);
    }
  }, {
    key: "delta",
    value: function delta() {
      return new Delta_default.a().insert(this.value(), _objectSpread(_objectSpread({}, this.formats()), this.attributes.values()));
    }
  }, {
    key: "format",
    value: function format(name, value) {
      var attribute = this.scroll.query(name, parchment["Scope"].BLOCK_ATTRIBUTE);

      if (attribute != null) {
        this.attributes.attribute(attribute, value);
      }
    }
  }, {
    key: "formatAt",
    value: function formatAt(index, length, name, value) {
      this.format(name, value);
    }
  }, {
    key: "insertAt",
    value: function insertAt(index, value, def) {
      if (typeof value === 'string' && value.endsWith('\n')) {
        var block = this.scroll.create(block_Block.blotName);
        this.parent.insertBefore(block, index === 0 ? this : this.next);
        block.insertAt(0, value.slice(0, -1));
      } else {
        _get(_getPrototypeOf(BlockEmbed.prototype), "insertAt", this).call(this, index, value, def);
      }
    }
  }]);

  return BlockEmbed;
}(parchment["EmbedBlot"]);

block_BlockEmbed.scope = parchment["Scope"].BLOCK_BLOT; // It is important for cursor behavior BlockEmbeds use tags that are block level elements

function blockDelta(blot) {
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return blot.descendants(parchment["LeafBlot"]).reduce(function (delta, leaf) {
    if (leaf.length() === 0) {
      return delta;
    }

    return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
  }, new Delta_default.a()).insert('\n', bubbleFormats(blot));
}

function bubbleFormats(blot) {
  var formats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (blot == null) return formats;

  if (typeof blot.formats === 'function') {
    formats = _objectSpread(_objectSpread({}, formats), blot.formats());

    if (filter) {
      // exclude syntax highlighting from deltas and getFormat()
      delete formats['code-token'];
    }
  }

  if (blot.parent == null || blot.parent.statics.blotName === 'scroll' || blot.parent.statics.scope !== blot.statics.scope) {
    return formats;
  }

  return bubbleFormats(blot.parent, formats, filter);
}



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Selection; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
/* harmony import */ var lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_isequal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30);
/* harmony import */ var lodash_isequal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_isequal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






var debug = Object(_logger__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])('quill:selection');

var Range = function Range(index) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  _classCallCheck(this, Range);

  this.index = index;
  this.length = length;
};

var Selection = /*#__PURE__*/function () {
  function Selection(scroll, emitter) {
    var _this = this;

    _classCallCheck(this, Selection);

    this.emitter = emitter;
    this.scroll = scroll;
    this.composing = false;
    this.mouseDown = false;
    this.root = this.scroll.domNode;
    this.cursor = this.scroll.create('cursor', this); // savedRange is last non-null range

    this.savedRange = new Range(0, 0);
    this.lastRange = this.savedRange;
    this.lastNative = null;
    this.handleComposition();
    this.handleDragging();
    this.emitter.listenDOM('selectionchange', document, function () {
      if (!_this.mouseDown && !_this.composing) {
        setTimeout(_this.update.bind(_this, _emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.USER), 1);
      }
    });
    this.emitter.on(_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].events.SCROLL_BEFORE_UPDATE, function () {
      if (!_this.hasFocus()) return;

      var native = _this.getNativeRange();

      if (native == null) return;
      if (native.start.node === _this.cursor.textNode) return; // cursor.restore() will handle

      _this.emitter.once(_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].events.SCROLL_UPDATE, function () {
        try {
          if (_this.root.contains(native.start.node) && _this.root.contains(native.end.node)) {
            _this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
          }

          _this.update(_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.SILENT);
        } catch (ignored) {// ignore
        }
      });
    });
    this.emitter.on(_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].events.SCROLL_OPTIMIZE, function (mutations, context) {
      if (context.range) {
        var _context$range = context.range,
            startNode = _context$range.startNode,
            startOffset = _context$range.startOffset,
            endNode = _context$range.endNode,
            endOffset = _context$range.endOffset;

        _this.setNativeRange(startNode, startOffset, endNode, endOffset);

        _this.update(_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.SILENT);
      }
    });
    this.update(_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.SILENT);
  }

  _createClass(Selection, [{
    key: "handleComposition",
    value: function handleComposition() {
      var _this2 = this;

      this.root.addEventListener('compositionstart', function () {
        _this2.composing = true;

        _this2.scroll.batchStart();
      });
      this.root.addEventListener('compositionend', function () {
        _this2.scroll.batchEnd();

        _this2.composing = false;

        if (_this2.cursor.parent) {
          var range = _this2.cursor.restore();

          if (!range) return;
          setTimeout(function () {
            _this2.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
          }, 1);
        }
      });
    }
  }, {
    key: "handleDragging",
    value: function handleDragging() {
      var _this3 = this;

      this.emitter.listenDOM('mousedown', document.body, function () {
        _this3.mouseDown = true;
      });
      this.emitter.listenDOM('mouseup', document.body, function () {
        _this3.mouseDown = false;

        _this3.update(_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.USER);
      });
    }
  }, {
    key: "focus",
    value: function focus() {
      if (this.hasFocus()) return;
      this.root.focus();
      this.setRange(this.savedRange);
    }
  }, {
    key: "format",
    value: function format(_format, value) {
      this.scroll.update();
      var nativeRange = this.getNativeRange();
      if (nativeRange == null || !nativeRange.native.collapsed || this.scroll.query(_format, parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].BLOCK)) return;

      if (nativeRange.start.node !== this.cursor.textNode) {
        var blot = this.scroll.find(nativeRange.start.node, false);
        if (blot == null) return; // TODO Give blot ability to not split

        if (blot instanceof parchment__WEBPACK_IMPORTED_MODULE_0__["LeafBlot"]) {
          var after = blot.split(nativeRange.start.offset);
          blot.parent.insertBefore(this.cursor, after);
        } else {
          blot.insertBefore(this.cursor, nativeRange.start.node); // Should never happen
        }

        this.cursor.attach();
      }

      this.cursor.format(_format, value);
      this.scroll.optimize();
      this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
      this.update();
    }
  }, {
    key: "getBounds",
    value: function getBounds(index) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var scrollLength = this.scroll.length();
      index = Math.min(index, scrollLength - 1);
      length = Math.min(index + length, scrollLength - 1) - index;
      var node;

      var _this$scroll$leaf = this.scroll.leaf(index),
          _this$scroll$leaf2 = _slicedToArray(_this$scroll$leaf, 2),
          leaf = _this$scroll$leaf2[0],
          offset = _this$scroll$leaf2[1];

      if (leaf == null) return null;

      var _leaf$position = leaf.position(offset, true);

      var _leaf$position2 = _slicedToArray(_leaf$position, 2);

      node = _leaf$position2[0];
      offset = _leaf$position2[1];
      var range = document.createRange();

      if (length > 0) {
        range.setStart(node, offset);

        var _this$scroll$leaf3 = this.scroll.leaf(index + length);

        var _this$scroll$leaf4 = _slicedToArray(_this$scroll$leaf3, 2);

        leaf = _this$scroll$leaf4[0];
        offset = _this$scroll$leaf4[1];
        if (leaf == null) return null;

        var _leaf$position3 = leaf.position(offset, true);

        var _leaf$position4 = _slicedToArray(_leaf$position3, 2);

        node = _leaf$position4[0];
        offset = _leaf$position4[1];
        range.setEnd(node, offset);
        return range.getBoundingClientRect();
      }

      var side = 'left';
      var rect;

      if (node instanceof Text) {
        if (offset < node.data.length) {
          range.setStart(node, offset);
          range.setEnd(node, offset + 1);
        } else {
          range.setStart(node, offset - 1);
          range.setEnd(node, offset);
          side = 'right';
        }

        rect = range.getBoundingClientRect();
      } else {
        rect = leaf.domNode.getBoundingClientRect();
        if (offset > 0) side = 'right';
      }

      return {
        bottom: rect.top + rect.height,
        height: rect.height,
        left: rect[side],
        right: rect[side],
        top: rect.top,
        width: 0
      };
    }
  }, {
    key: "getNativeRange",
    value: function getNativeRange() {
      var selection = document.getSelection();
      if (selection == null || selection.rangeCount <= 0) return null;
      var nativeRange = selection.getRangeAt(0);
      if (nativeRange == null) return null;
      var range = this.normalizeNative(nativeRange);
      debug.info('getNativeRange', range);
      return range;
    }
  }, {
    key: "getRange",
    value: function getRange() {
      var normalized = this.getNativeRange();
      if (normalized == null) return [null, null];
      var range = this.normalizedToRange(normalized);
      return [range, normalized];
    }
  }, {
    key: "hasFocus",
    value: function hasFocus() {
      return document.activeElement === this.root || contains(this.root, document.activeElement);
    }
  }, {
    key: "normalizedToRange",
    value: function normalizedToRange(range) {
      var _this4 = this;

      var positions = [[range.start.node, range.start.offset]];

      if (!range.native.collapsed) {
        positions.push([range.end.node, range.end.offset]);
      }

      var indexes = positions.map(function (position) {
        var _position = _slicedToArray(position, 2),
            node = _position[0],
            offset = _position[1];

        var blot = _this4.scroll.find(node, true);

        var index = blot.offset(_this4.scroll);

        if (offset === 0) {
          return index;
        }

        if (blot instanceof parchment__WEBPACK_IMPORTED_MODULE_0__["LeafBlot"]) {
          return index + blot.index(node, offset);
        }

        return index + blot.length();
      });
      var end = Math.min(Math.max.apply(Math, _toConsumableArray(indexes)), this.scroll.length() - 1);
      var start = Math.min.apply(Math, [end].concat(_toConsumableArray(indexes)));
      return new Range(start, end - start);
    }
  }, {
    key: "normalizeNative",
    value: function normalizeNative(nativeRange) {
      if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
        return null;
      }

      var range = {
        start: {
          node: nativeRange.startContainer,
          offset: nativeRange.startOffset
        },
        end: {
          node: nativeRange.endContainer,
          offset: nativeRange.endOffset
        },
        native: nativeRange
      };
      [range.start, range.end].forEach(function (position) {
        var node = position.node,
            offset = position.offset;

        while (!(node instanceof Text) && node.childNodes.length > 0) {
          if (node.childNodes.length > offset) {
            node = node.childNodes[offset];
            offset = 0;
          } else if (node.childNodes.length === offset) {
            node = node.lastChild;

            if (node instanceof Text) {
              offset = node.data.length;
            } else if (node.childNodes.length > 0) {
              // Container case
              offset = node.childNodes.length;
            } else {
              // Embed case
              offset = node.childNodes.length + 1;
            }
          } else {
            break;
          }
        }

        position.node = node;
        position.offset = offset;
      });
      return range;
    }
  }, {
    key: "rangeToNative",
    value: function rangeToNative(range) {
      var _this5 = this;

      var indexes = range.collapsed ? [range.index] : [range.index, range.index + range.length];
      var args = [];
      var scrollLength = this.scroll.length();
      indexes.forEach(function (index, i) {
        index = Math.min(scrollLength - 1, index);

        var _this5$scroll$leaf = _this5.scroll.leaf(index),
            _this5$scroll$leaf2 = _slicedToArray(_this5$scroll$leaf, 2),
            leaf = _this5$scroll$leaf2[0],
            leafOffset = _this5$scroll$leaf2[1];

        var _leaf$position5 = leaf.position(leafOffset, i !== 0),
            _leaf$position6 = _slicedToArray(_leaf$position5, 2),
            node = _leaf$position6[0],
            offset = _leaf$position6[1];

        args.push(node, offset);
      });

      if (args.length < 2) {
        return args.concat(args);
      }

      return args;
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView(scrollingContainer) {
      var range = this.lastRange;
      if (range == null) return;
      var bounds = this.getBounds(range.index, range.length);
      if (bounds == null) return;
      var limit = this.scroll.length() - 1;

      var _this$scroll$line = this.scroll.line(Math.min(range.index, limit)),
          _this$scroll$line2 = _slicedToArray(_this$scroll$line, 1),
          first = _this$scroll$line2[0];

      var last = first;

      if (range.length > 0) {
        var _this$scroll$line3 = this.scroll.line(Math.min(range.index + range.length, limit));

        var _this$scroll$line4 = _slicedToArray(_this$scroll$line3, 1);

        last = _this$scroll$line4[0];
      }

      if (first == null || last == null) return;
      var scrollBounds = scrollingContainer.getBoundingClientRect();

      if (bounds.top < scrollBounds.top) {
        scrollingContainer.scrollTop -= scrollBounds.top - bounds.top;
      } else if (bounds.bottom > scrollBounds.bottom) {
        scrollingContainer.scrollTop += bounds.bottom - scrollBounds.bottom;
      }
    }
  }, {
    key: "setNativeRange",
    value: function setNativeRange(startNode, startOffset) {
      var endNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : startNode;
      var endOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : startOffset;
      var force = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      debug.info('setNativeRange', startNode, startOffset, endNode, endOffset);

      if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || endNode.parentNode == null)) {
        return;
      }

      var selection = document.getSelection();
      if (selection == null) return;

      if (startNode != null) {
        if (!this.hasFocus()) this.root.focus();

        var _ref = this.getNativeRange() || {},
            native = _ref.native;

        if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
          if (startNode.tagName === 'BR') {
            startOffset = Array.from(startNode.parentNode.childNodes).indexOf(startNode);
            startNode = startNode.parentNode;
          }

          if (endNode.tagName === 'BR') {
            endOffset = Array.from(endNode.parentNode.childNodes).indexOf(endNode);
            endNode = endNode.parentNode;
          }

          var range = document.createRange();
          range.setStart(startNode, startOffset);
          range.setEnd(endNode, endOffset);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        selection.removeAllRanges();
        this.root.blur();
        document.body.focus(); // root.blur() not enough for IE11
      }
    }
  }, {
    key: "setRange",
    value: function setRange(range) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.API;

      if (typeof force === 'string') {
        source = force;
        force = false;
      }

      debug.info('setRange', range);

      if (range != null) {
        var args = this.rangeToNative(range);
        this.setNativeRange.apply(this, _toConsumableArray(args).concat([force]));
      } else {
        this.setNativeRange(null);
      }

      this.update(source);
    }
  }, {
    key: "update",
    value: function update() {
      var source = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.USER;
      var oldRange = this.lastRange;

      var _this$getRange = this.getRange(),
          _this$getRange2 = _slicedToArray(_this$getRange, 2),
          lastRange = _this$getRange2[0],
          nativeRange = _this$getRange2[1];

      this.lastRange = lastRange;
      this.lastNative = nativeRange;

      if (this.lastRange != null) {
        this.savedRange = this.lastRange;
      }

      if (!lodash_isequal__WEBPACK_IMPORTED_MODULE_2___default()(oldRange, this.lastRange)) {
        var _this$emitter;

        if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
          var range = this.cursor.restore();

          if (range) {
            this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
          }
        }

        var args = [_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].events.SELECTION_CHANGE, lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default()(this.lastRange), lodash_clonedeep__WEBPACK_IMPORTED_MODULE_1___default()(oldRange), source];

        (_this$emitter = this.emitter).emit.apply(_this$emitter, [_emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].events.EDITOR_CHANGE].concat(args));

        if (source !== _emitter__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.SILENT) {
          var _this$emitter2;

          (_this$emitter2 = this.emitter).emit.apply(_this$emitter2, args);
        }
      }
    }
  }]);

  return Selection;
}();

function contains(parent, descendant) {
  try {
    // Firefox inserts inaccessible nodes around video elements
    descendant.parentNode; // eslint-disable-line no-unused-expressions
  } catch (e) {
    return false;
  } // IE11 has bug with Text nodes
  // https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect


  if (descendant instanceof Text) {
    descendant = descendant.parentNode;
  }

  return parent.contains(descendant);
}



/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return escapeText; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var Text = /*#__PURE__*/function (_TextBlot) {
  _inherits(Text, _TextBlot);

  var _super = _createSuper(Text);

  function Text() {
    _classCallCheck(this, Text);

    return _super.apply(this, arguments);
  }

  return Text;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["TextBlot"]);

function escapeText(text) {
  return text.replace(/[&<>"']/g, function (s) {
    // https://lodash.com/docs#escape
    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entityMap[s];
  });
}



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var Break = /*#__PURE__*/function (_EmbedBlot) {
  _inherits(Break, _EmbedBlot);

  var _super = _createSuper(Break);

  function Break() {
    _classCallCheck(this, Break);

    return _super.apply(this, arguments);
  }

  _createClass(Break, [{
    key: "optimize",
    value: function optimize() {
      if (this.prev || this.next) {
        this.remove();
      }
    }
  }, {
    key: "length",
    value: function length() {
      return 0;
    }
  }, {
    key: "value",
    value: function value() {
      return '';
    }
  }], [{
    key: "value",
    value: function value() {
      return undefined;
    }
  }]);

  return Break;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["EmbedBlot"]);

Break.blotName = 'break';
Break.tagName = 'BR';
/* harmony default export */ __webpack_exports__["a"] = (Break);

/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Module = function Module(quill) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, Module);

  this.quill = quill;
  this.options = options;
};

Module.DEFAULTS = {};
/* harmony default export */ __webpack_exports__["a"] = (Module);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var Container = /*#__PURE__*/function (_ContainerBlot) {
  _inherits(Container, _ContainerBlot);

  var _super = _createSuper(Container);

  function Container() {
    _classCallCheck(this, Container);

    return _super.apply(this, arguments);
  }

  return Container;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["ContainerBlot"]);

/* harmony default export */ __webpack_exports__["a"] = (Container);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _break__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var Inline = /*#__PURE__*/function (_InlineBlot) {
  _inherits(Inline, _InlineBlot);

  var _super = _createSuper(Inline);

  function Inline() {
    _classCallCheck(this, Inline);

    return _super.apply(this, arguments);
  }

  _createClass(Inline, [{
    key: "formatAt",
    value: function formatAt(index, length, name, value) {
      if (Inline.compare(this.statics.blotName, name) < 0 && this.scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].BLOT)) {
        var blot = this.isolate(index, length);

        if (value) {
          blot.wrap(name, value);
        }
      } else {
        _get(_getPrototypeOf(Inline.prototype), "formatAt", this).call(this, index, length, name, value);
      }
    }
  }, {
    key: "optimize",
    value: function optimize(context) {
      _get(_getPrototypeOf(Inline.prototype), "optimize", this).call(this, context);

      if (this.parent instanceof Inline && Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
        var parent = this.parent.isolate(this.offset(), this.length());
        this.moveChildren(parent);
        parent.wrap(this);
      }
    }
  }], [{
    key: "compare",
    value: function compare(self, other) {
      var selfIndex = Inline.order.indexOf(self);
      var otherIndex = Inline.order.indexOf(other);

      if (selfIndex >= 0 || otherIndex >= 0) {
        return selfIndex - otherIndex;
      }

      if (self === other) {
        return 0;
      }

      if (self < other) {
        return -1;
      }

      return 1;
    }
  }]);

  return Inline;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["InlineBlot"]);

Inline.allowedChildren = [Inline, _break__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"], parchment__WEBPACK_IMPORTED_MODULE_0__["EmbedBlot"], _text__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]]; // Lower index means deeper in the DOM tree, since not found (-1) is for embeds

Inline.order = ['cursor', 'inline', // Must be lower
'link', // Chrome wants <a> to be lower
'underline', 'strike', 'italic', 'bold', 'script', 'code' // Must be higher
];
/* harmony default export */ __webpack_exports__["a"] = (Inline);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var hasWindow = function hasWindow() {
  return typeof window !== 'undefined';
};

/* harmony default export */ __webpack_exports__["a"] = (hasWindow);

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = cloneDeep;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(58), __webpack_require__(66)(module)))

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Code; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CodeBlockContainer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return CodeBlock; });
/* harmony import */ var _blots_block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _blots_break__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _blots_cursor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(24);
/* harmony import */ var _blots_inline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(14);
/* harmony import */ var _blots_text__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _blots_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(13);
/* harmony import */ var _core_quill__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(0);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }









var CodeBlockContainer = /*#__PURE__*/function (_Container) {
  _inherits(CodeBlockContainer, _Container);

  var _super = _createSuper(CodeBlockContainer);

  function CodeBlockContainer() {
    _classCallCheck(this, CodeBlockContainer);

    return _super.apply(this, arguments);
  }

  _createClass(CodeBlockContainer, [{
    key: "code",
    value: function code(index, length) {
      var text = this.children.map(function (child) {
        return child.length() <= 1 ? '' : child.domNode.textContent;
      }).join('\n').slice(index, index + length);
      return Object(_blots_text__WEBPACK_IMPORTED_MODULE_4__[/* escapeText */ "b"])(text);
    }
  }, {
    key: "html",
    value: function html(index, length) {
      // `\n`s are needed in order to support empty lines at the beginning and the end.
      // https://html.spec.whatwg.org/multipage/syntax.html#element-restrictions
      return "<pre>\n".concat(this.code(index, length), "\n</pre>");
    }
  }], [{
    key: "create",
    value: function create(value) {
      var domNode = _get(_getPrototypeOf(CodeBlockContainer), "create", this).call(this, value);

      domNode.setAttribute('spellcheck', false);
      return domNode;
    }
  }]);

  return CodeBlockContainer;
}(_blots_container__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"]);

var CodeBlock = /*#__PURE__*/function (_Block) {
  _inherits(CodeBlock, _Block);

  var _super2 = _createSuper(CodeBlock);

  function CodeBlock() {
    _classCallCheck(this, CodeBlock);

    return _super2.apply(this, arguments);
  }

  _createClass(CodeBlock, null, [{
    key: "register",
    value: function register() {
      _core_quill__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].register(CodeBlockContainer);
    }
  }]);

  return CodeBlock;
}(_blots_block__WEBPACK_IMPORTED_MODULE_0__[/* default */ "d"]);

var Code = /*#__PURE__*/function (_Inline) {
  _inherits(Code, _Inline);

  var _super3 = _createSuper(Code);

  function Code() {
    _classCallCheck(this, Code);

    return _super3.apply(this, arguments);
  }

  return Code;
}(_blots_inline__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"]);

Code.blotName = 'code';
Code.tagName = 'CODE';
CodeBlock.blotName = 'code-block';
CodeBlock.className = 'ql-code-block';
CodeBlock.tagName = 'DIV';
CodeBlockContainer.blotName = 'code-block-container';
CodeBlockContainer.className = 'ql-code-block-container';
CodeBlockContainer.tagName = 'DIV';
CodeBlockContainer.allowedChildren = [CodeBlock];
CodeBlock.allowedChildren = [_blots_text__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"], _blots_break__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"], _blots_cursor__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]];
CodeBlock.requiredContainer = CodeBlockContainer;
CodeBlock.TAB = '  ';


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _core_emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _block__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _break__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);
/* harmony import */ var _container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }







function isLine(blot) {
  return blot instanceof _block__WEBPACK_IMPORTED_MODULE_2__[/* default */ "d"] || blot instanceof _block__WEBPACK_IMPORTED_MODULE_2__[/* BlockEmbed */ "a"];
}

var Scroll = /*#__PURE__*/function (_ScrollBlot) {
  _inherits(Scroll, _ScrollBlot);

  var _super = _createSuper(Scroll);

  function Scroll(registry, domNode, _ref) {
    var _this;

    var emitter = _ref.emitter,
        toggleBlankClass = _ref.toggleBlankClass;

    _classCallCheck(this, Scroll);

    _this = _super.call(this, registry, domNode);
    _this.emitter = emitter;
    _this.toggleBlankClass = toggleBlankClass;
    _this.batch = false;

    _this.optimize();

    _this.enable();

    _this.domNode.addEventListener('dragstart', function (e) {
      return _this.handleDragStart(e);
    });

    return _this;
  }

  _createClass(Scroll, [{
    key: "batchStart",
    value: function batchStart() {
      if (!Array.isArray(this.batch)) {
        this.batch = [];
      }
    }
  }, {
    key: "batchEnd",
    value: function batchEnd() {
      var mutations = this.batch;
      this.batch = false;
      this.update(mutations);
    }
  }, {
    key: "emitMount",
    value: function emitMount(blot) {
      this.emitter.emit(_core_emitter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].events.SCROLL_BLOT_MOUNT, blot);
    }
  }, {
    key: "emitUnmount",
    value: function emitUnmount(blot) {
      this.emitter.emit(_core_emitter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].events.SCROLL_BLOT_UNMOUNT, blot);
    }
  }, {
    key: "deleteAt",
    value: function deleteAt(index, length) {
      var _this$line = this.line(index),
          _this$line2 = _slicedToArray(_this$line, 2),
          first = _this$line2[0],
          offset = _this$line2[1];

      var _this$line3 = this.line(index + length),
          _this$line4 = _slicedToArray(_this$line3, 1),
          last = _this$line4[0];

      _get(_getPrototypeOf(Scroll.prototype), "deleteAt", this).call(this, index, length);

      if (last != null && first !== last && offset > 0) {
        if (first instanceof _block__WEBPACK_IMPORTED_MODULE_2__[/* BlockEmbed */ "a"] || last instanceof _block__WEBPACK_IMPORTED_MODULE_2__[/* BlockEmbed */ "a"]) {
          this.optimize();
          return;
        }

        var ref = last.children.head instanceof _break__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"] ? null : last.children.head;
        first.moveChildren(last, ref);
        first.remove();
      }

      this.optimize();
    }
  }, {
    key: "enable",
    value: function enable() {
      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.domNode.setAttribute('contenteditable', enabled);
    }
  }, {
    key: "formatAt",
    value: function formatAt(index, length, format, value) {
      _get(_getPrototypeOf(Scroll.prototype), "formatAt", this).call(this, index, length, format, value);

      this.optimize();
    }
  }, {
    key: "handleDragStart",
    value: function handleDragStart(event) {
      event.preventDefault();
    }
  }, {
    key: "insertAt",
    value: function insertAt(index, value, def) {
      if (index >= this.length()) {
        if (def == null || this.scroll.query(value, parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].BLOCK) == null) {
          var blot = this.scroll.create(this.statics.defaultChild.blotName);
          this.appendChild(blot);

          if (def == null && value.endsWith('\n')) {
            blot.insertAt(0, value.slice(0, -1), def);
          } else {
            blot.insertAt(0, value, def);
          }
        } else {
          var embed = this.scroll.create(value, def);
          this.appendChild(embed);
        }
      } else {
        _get(_getPrototypeOf(Scroll.prototype), "insertAt", this).call(this, index, value, def);
      }

      this.optimize();
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(blot, ref) {
      if (blot.statics.scope === parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].INLINE_BLOT) {
        var wrapper = this.scroll.create(this.statics.defaultChild.blotName);
        wrapper.appendChild(blot);

        _get(_getPrototypeOf(Scroll.prototype), "insertBefore", this).call(this, wrapper, ref);
      } else {
        _get(_getPrototypeOf(Scroll.prototype), "insertBefore", this).call(this, blot, ref);
      }
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.domNode.getAttribute('contenteditable') === 'true';
    }
  }, {
    key: "leaf",
    value: function leaf(index) {
      return this.path(index).pop() || [null, -1];
    }
  }, {
    key: "line",
    value: function line(index) {
      if (index === this.length()) {
        return this.line(index - 1);
      }

      return this.descendant(isLine, index);
    }
  }, {
    key: "lines",
    value: function lines() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.MAX_VALUE;

      var getLines = function getLines(blot, blotIndex, blotLength) {
        var lines = [];
        var lengthLeft = blotLength;
        blot.children.forEachAt(blotIndex, blotLength, function (child, childIndex, childLength) {
          if (isLine(child)) {
            lines.push(child);
          } else if (child instanceof parchment__WEBPACK_IMPORTED_MODULE_0__["ContainerBlot"]) {
            lines = lines.concat(getLines(child, childIndex, lengthLeft));
          }

          lengthLeft -= childLength;
        });
        return lines;
      };

      return getLines(this, index, length);
    }
  }, {
    key: "optimize",
    value: function optimize() {
      var mutations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (this.batch) return;

      _get(_getPrototypeOf(Scroll.prototype), "optimize", this).call(this, mutations, context);

      if (mutations.length > 0) {
        this.emitter.emit(_core_emitter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].events.SCROLL_OPTIMIZE, mutations, context);
      }
    }
  }, {
    key: "path",
    value: function path(index) {
      return _get(_getPrototypeOf(Scroll.prototype), "path", this).call(this, index).slice(1); // Exclude self
    }
  }, {
    key: "remove",
    value: function remove() {// Never remove self
    }
  }, {
    key: "update",
    value: function update(mutations) {
      var _this2 = this;

      if (this.batch) {
        if (Array.isArray(mutations)) {
          this.batch = this.batch.concat(mutations);
          this.toggleBlankClass();
        }

        return;
      }

      var source = _core_emitter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].sources.USER;

      if (typeof mutations === 'string') {
        source = mutations;
      }

      if (!Array.isArray(mutations)) {
        mutations = this.observer.takeRecords();
      }

      mutations = mutations.filter(function (_ref2) {
        var target = _ref2.target;

        var blot = _this2.find(target, true);

        return blot && blot.scroll === _this2;
      });

      if (mutations.length > 0) {
        this.emitter.emit(_core_emitter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].events.SCROLL_BEFORE_UPDATE, source, mutations);
      }

      _get(_getPrototypeOf(Scroll.prototype), "update", this).call(this, mutations.concat([])); // pass copy


      if (mutations.length > 0) {
        this.emitter.emit(_core_emitter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].events.SCROLL_UPDATE, source, mutations);
      }
    }
  }]);

  return Scroll;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["ScrollBlot"]);

Scroll.blotName = 'scroll';
Scroll.className = 'ql-editor';
Scroll.tagName = 'DIV';
Scroll.defaultChild = _block__WEBPACK_IMPORTED_MODULE_2__[/* default */ "d"];
Scroll.allowedChildren = [_block__WEBPACK_IMPORTED_MODULE_2__[/* default */ "d"], _block__WEBPACK_IMPORTED_MODULE_2__[/* BlockEmbed */ "a"], _container__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"]];
/* harmony default export */ __webpack_exports__["a"] = (Scroll);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KeyNameType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getKeyNameWithCustomPrefix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return removeCustomPrefixFromKeyName; });
/* harmony import */ var _formats_table_attributors_table_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var _formats_table_attributors_cell_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(33);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var KeyNameType = {
  attribute: 'attr',
  style: 'style'
};

var OVERRIDDEN_ATTRIBUTORS_TAG_INFO = _objectSpread(_objectSpread({}, _formats_table_attributors_table_config__WEBPACK_IMPORTED_MODULE_0__[/* tableConfig */ "d"].allowedTags.reduce(function (result, tag) {
  result[tag] = {
    name: _formats_table_attributors_table_config__WEBPACK_IMPORTED_MODULE_0__[/* tableConfig */ "d"].name,
    keyNamesSet: _formats_table_attributors_table_config__WEBPACK_IMPORTED_MODULE_0__[/* TABLE_KEY_NAME_SET */ "b"]
  };
  return result;
}, {})), _formats_table_attributors_cell_config__WEBPACK_IMPORTED_MODULE_1__[/* cellConfig */ "d"].allowedTags.reduce(function (result, tag) {
  result[tag] = {
    name: _formats_table_attributors_cell_config__WEBPACK_IMPORTED_MODULE_1__[/* cellConfig */ "d"].name,
    keyNamesSet: _formats_table_attributors_cell_config__WEBPACK_IMPORTED_MODULE_1__[/* TABLE_CELL_KEY_NAME_SET */ "b"]
  };
  return result;
}, {}));

function getKeyNameWithCustomPrefix(tagName, keyName, keyType) {
  var tagInfo = OVERRIDDEN_ATTRIBUTORS_TAG_INFO[tagName];

  if (!tagInfo) {
    return keyName;
  }

  return tagInfo.keyNamesSet.has(keyName) ? "".concat(keyType).concat(tagInfo.name, "_").concat(keyName) : keyName;
}
function removeCustomPrefixFromKeyName(keyNameWithPrefix) {
  return keyNameWithPrefix.replace(/([^]*_)/, '');
}

/***/ }),
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var levels = ['error', 'warn', 'log', 'info'];
var level = 'warn';

function debug(method) {
  if (levels.indexOf(method) <= levels.indexOf(level)) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_console = console)[method].apply(_console, args); // eslint-disable-line no-console

  }
}

function namespace(ns) {
  return levels.reduce(function (logger, method) {
    logger[method] = debug.bind(console, method, ns);
    return logger;
  }, {});
}

namespace.level = function (newLevel) {
  level = newLevel;
};

debug.level = namespace.level;
/* harmony default export */ __webpack_exports__["a"] = (namespace);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var Cursor = /*#__PURE__*/function (_EmbedBlot) {
  _inherits(Cursor, _EmbedBlot);

  var _super = _createSuper(Cursor);

  function Cursor(scroll, domNode, selection) {
    var _this;

    _classCallCheck(this, Cursor);

    _this = _super.call(this, scroll, domNode);
    _this.selection = selection;
    _this.textNode = document.createTextNode(Cursor.CONTENTS);

    _this.domNode.appendChild(_this.textNode);

    _this.savedLength = 0;
    return _this;
  }

  _createClass(Cursor, [{
    key: "detach",
    value: function detach() {
      // super.detach() will also clear domNode.__blot
      if (this.parent != null) this.parent.removeChild(this);
    }
  }, {
    key: "format",
    value: function format(name, value) {
      if (this.savedLength !== 0) {
        _get(_getPrototypeOf(Cursor.prototype), "format", this).call(this, name, value);

        return;
      }

      var target = this;
      var index = 0;

      while (target != null && target.statics.scope !== parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].BLOCK_BLOT) {
        index += target.offset(target.parent);
        target = target.parent;
      }

      if (target != null) {
        this.savedLength = Cursor.CONTENTS.length;
        target.optimize();
        target.formatAt(index, Cursor.CONTENTS.length, name, value);
        this.savedLength = 0;
      }
    }
  }, {
    key: "index",
    value: function index(node, offset) {
      if (node === this.textNode) return 0;
      return _get(_getPrototypeOf(Cursor.prototype), "index", this).call(this, node, offset);
    }
  }, {
    key: "length",
    value: function length() {
      return this.savedLength;
    }
  }, {
    key: "position",
    value: function position() {
      return [this.textNode, this.textNode.data.length];
    }
  }, {
    key: "remove",
    value: function remove() {
      _get(_getPrototypeOf(Cursor.prototype), "remove", this).call(this);

      this.parent = null;
    }
  }, {
    key: "restore",
    value: function restore() {
      if (this.selection.composing || this.parent == null) return null;
      var range = this.selection.getNativeRange(); // Link format will insert text outside of anchor tag

      while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
        this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
      }

      var prevTextBlot = this.prev instanceof _text__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"] ? this.prev : null;
      var prevTextLength = prevTextBlot ? prevTextBlot.length() : 0;
      var nextTextBlot = this.next instanceof _text__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"] ? this.next : null;
      var nextText = nextTextBlot ? nextTextBlot.text : '';
      var textNode = this.textNode; // take text from inside this blot and reset it

      var newText = textNode.data.split(Cursor.CONTENTS).join('');
      textNode.data = Cursor.CONTENTS; // proactively merge TextBlots around cursor so that optimization
      // doesn't lose the cursor.  the reason we are here in cursor.restore
      // could be that the user clicked in prevTextBlot or nextTextBlot, or
      // the user typed something.

      var mergedTextBlot;

      if (prevTextBlot) {
        mergedTextBlot = prevTextBlot;

        if (newText || nextTextBlot) {
          prevTextBlot.insertAt(prevTextBlot.length(), newText + nextText);

          if (nextTextBlot) {
            nextTextBlot.remove();
          }
        }
      } else if (nextTextBlot) {
        mergedTextBlot = nextTextBlot;
        nextTextBlot.insertAt(0, newText);
      } else {
        var newTextNode = document.createTextNode(newText);
        mergedTextBlot = this.scroll.create(newTextNode);
        this.parent.insertBefore(mergedTextBlot, this);
      }

      this.remove();

      if (range) {
        // calculate selection to restore
        var remapOffset = function remapOffset(node, offset) {
          if (prevTextBlot && node === prevTextBlot.domNode) {
            return offset;
          }

          if (node === textNode) {
            return prevTextLength + offset - 1;
          }

          if (nextTextBlot && node === nextTextBlot.domNode) {
            return prevTextLength + newText.length + offset;
          }

          return null;
        };

        var start = remapOffset(range.start.node, range.start.offset);
        var end = remapOffset(range.end.node, range.end.offset);

        if (start !== null && end !== null) {
          return {
            startNode: mergedTextBlot.domNode,
            startOffset: start,
            endNode: mergedTextBlot.domNode,
            endOffset: end
          };
        }
      }

      return null;
    }
  }, {
    key: "update",
    value: function update(mutations, context) {
      var _this2 = this;

      if (mutations.some(function (mutation) {
        return mutation.type === 'characterData' && mutation.target === _this2.textNode;
      })) {
        var range = this.restore();
        if (range) context.range = range;
      }
    }
  }, {
    key: "value",
    value: function value() {
      return '';
    }
  }], [{
    key: "value",
    value: function value() {
      return undefined;
    }
  }]);

  return Cursor;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["EmbedBlot"]);

Cursor.blotName = 'cursor';
Cursor.className = 'ql-cursor';
Cursor.tagName = 'span';
Cursor.CONTENTS = "\uFEFF"; // Zero width no break space

/* harmony default export */ __webpack_exports__["a"] = (Cursor);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_quill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _blots_block__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _blots_break__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
/* harmony import */ var _blots_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _blots_cursor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(24);
/* harmony import */ var _blots_embed__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(56);
/* harmony import */ var _blots_inline__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(14);
/* harmony import */ var _blots_scroll__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(18);
/* harmony import */ var _blots_text__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9);
/* harmony import */ var _modules_clipboard__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(26);
/* harmony import */ var _modules_history__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(50);
/* harmony import */ var _modules_keyboard__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(27);
/* harmony import */ var _modules_uploader__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(59);













_core_quill__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"].register({
  'blots/block': _blots_block__WEBPACK_IMPORTED_MODULE_1__[/* default */ "d"],
  'blots/block/embed': _blots_block__WEBPACK_IMPORTED_MODULE_1__[/* BlockEmbed */ "a"],
  'blots/break': _blots_break__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"],
  'blots/container': _blots_container__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"],
  'blots/cursor': _blots_cursor__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"],
  'blots/embed': _blots_embed__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"],
  'blots/inline': _blots_inline__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"],
  'blots/scroll': _blots_scroll__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"],
  'blots/text': _blots_text__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"],
  'modules/clipboard': _modules_clipboard__WEBPACK_IMPORTED_MODULE_9__[/* default */ "b"],
  'modules/history': _modules_history__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"],
  'modules/keyboard': _modules_keyboard__WEBPACK_IMPORTED_MODULE_11__[/* default */ "b"],
  'modules/uploader': _modules_uploader__WEBPACK_IMPORTED_MODULE_12__[/* default */ "a"]
});
/* harmony default export */ __webpack_exports__["default"] = (_core_quill__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Clipboard; });
/* unused harmony export matchAttributor */
/* unused harmony export matchBlot */
/* unused harmony export matchNewline */
/* unused harmony export matchText */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return traverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return applyFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return deltaEndsWith; });
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(quill_delta__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _blots_block__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _core_quill__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0);
/* harmony import */ var _core_logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23);
/* harmony import */ var _core_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(12);
/* harmony import */ var _formats_align__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(38);
/* harmony import */ var _formats_background__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(45);
/* harmony import */ var _formats_code__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(17);
/* harmony import */ var _formats_color__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(34);
/* harmony import */ var _formats_direction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(35);
/* harmony import */ var _formats_font__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(46);
/* harmony import */ var _formats_size__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(47);
/* harmony import */ var _keyboard__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(27);
/* harmony import */ var _utils_capitalize__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(31);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
















var debug = Object(_core_logger__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])('quill:clipboard');
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var CLIPBOARD_CONFIG = [[TEXT_NODE, matchText], [TEXT_NODE, matchNewline], ['br', matchBreak], [ELEMENT_NODE, matchNewline], [ELEMENT_NODE, matchBlot], [ELEMENT_NODE, matchAttributor], [ELEMENT_NODE, matchStyles], ['li', matchIndent], ['ol, ul', matchList], ['pre', matchCodeBlock], ['b', matchAlias.bind(matchAlias, 'bold')], ['i', matchAlias.bind(matchAlias, 'italic')], ['strike', matchAlias.bind(matchAlias, 'strike')], ['style', matchIgnore]];
var HTML_TEXT_MATCHERS = [matchText, matchNewline];
var ATTRIBUTE_ATTRIBUTORS = [_formats_align__WEBPACK_IMPORTED_MODULE_6__[/* AlignAttribute */ "a"], _formats_direction__WEBPACK_IMPORTED_MODULE_10__[/* DirectionAttribute */ "a"]].reduce(function (memo, attr) {
  memo[attr.keyName] = attr;
  return memo;
}, {});
var STYLE_ATTRIBUTORS = [_formats_align__WEBPACK_IMPORTED_MODULE_6__[/* AlignStyle */ "c"], _formats_background__WEBPACK_IMPORTED_MODULE_7__[/* BackgroundStyle */ "b"], _formats_color__WEBPACK_IMPORTED_MODULE_9__[/* ColorStyle */ "c"], _formats_direction__WEBPACK_IMPORTED_MODULE_10__[/* DirectionStyle */ "c"], _formats_font__WEBPACK_IMPORTED_MODULE_11__[/* FontStyle */ "b"], _formats_size__WEBPACK_IMPORTED_MODULE_12__[/* SizeStyle */ "b"]].reduce(function (memo, attr) {
  memo[attr.keyName] = attr;
  return memo;
}, {});

var Clipboard = /*#__PURE__*/function (_Module) {
  _inherits(Clipboard, _Module);

  var _super = _createSuper(Clipboard);

  function Clipboard(quill, options) {
    var _options$tableBlots;

    var _this;

    _classCallCheck(this, Clipboard);

    _this = _super.call(this, quill, options);

    _this.quill.root.addEventListener('copy', function (e) {
      return _this.onCaptureCopy(e, false);
    });

    _this.quill.root.addEventListener('cut', function (e) {
      return _this.onCaptureCopy(e, true);
    });

    _this.quill.root.addEventListener('paste', _this.onCapturePaste.bind(_assertThisInitialized(_this)));

    _this.matchers = [];
    _this.tableBlots = (_options$tableBlots = options.tableBlots) !== null && _options$tableBlots !== void 0 ? _options$tableBlots : [];
    CLIPBOARD_CONFIG.concat(_this.options.matchers).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          selector = _ref2[0],
          matcher = _ref2[1];

      _this.addMatcher(selector, matcher);
    });
    return _this;
  }

  _createClass(Clipboard, [{
    key: "addMatcher",
    value: function addMatcher(selector, matcher) {
      this.matchers.push([selector, matcher]);
    }
  }, {
    key: "addTableBlot",
    value: function addTableBlot(blotName) {
      this.tableBlots.push(blotName);
    }
  }, {
    key: "convert",
    value: function convert(_ref3) {
      var html = _ref3.html,
          text = _ref3.text;
      var formats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (formats[_formats_code__WEBPACK_IMPORTED_MODULE_8__[/* default */ "c"].blotName]) {
        return new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a().insert(text, _defineProperty({}, _formats_code__WEBPACK_IMPORTED_MODULE_8__[/* default */ "c"].blotName, formats[_formats_code__WEBPACK_IMPORTED_MODULE_8__[/* default */ "c"].blotName]));
      }

      return html ? this.applyMatchers(html, formats) : this.applyTextMatchers(text);
    }
  }, {
    key: "applyTextMatchers",
    value: function applyTextMatchers() {
      var _this2 = this;

      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (text.length === 0) {
        return new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a();
      }

      var matchers = this.prepareTextMatching();
      var element = this.quill.root.ownerDocument.createElement('div');
      element.textContent = text;
      var node = element.childNodes[0];
      return matchers.reduce(function (delta, matcher) {
        return matcher(node, delta, _this2.quill.scroll);
      }, new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a());
    }
  }, {
    key: "applyMatchers",
    value: function applyMatchers(html) {
      var _this3 = this;

      var formats = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var container = doc.body;
      var nodeMatches = new WeakMap();

      var _this$prepareMatching = this.prepareMatching(container, nodeMatches),
          _this$prepareMatching2 = _slicedToArray(_this$prepareMatching, 2),
          elementMatchers = _this$prepareMatching2[0],
          textMatchers = _this$prepareMatching2[1];

      var delta = traverse(this.quill.scroll, container, elementMatchers, textMatchers, nodeMatches); // Remove trailing newline

      if (deltaEndsWith(delta, '\n') && (delta.ops[delta.ops.length - 1].attributes == null || Object.values(formats).some(function (blotName) {
        return _this3.tableBlots.includes(blotName);
      }))) {
        return delta.compose(new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a().retain(delta.length() - 1).delete(1));
      }

      return delta;
    }
  }, {
    key: "dangerouslyPasteHTML",
    value: function dangerouslyPasteHTML(index, html) {
      var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _core_quill__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.API;

      if (typeof index === 'string') {
        var delta = this.convert({
          html: index,
          text: ''
        });
        this.quill.setContents(delta, html);
        this.quill.setSelection(0, _core_quill__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.SILENT);
      } else {
        var paste = this.convert({
          html: html,
          text: ''
        });
        this.quill.updateContents(new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a().retain(index).concat(paste), source);
        this.quill.setSelection(index + paste.length(), _core_quill__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.SILENT);
      }
    }
  }, {
    key: "onCaptureCopy",
    value: function onCaptureCopy(e) {
      var isCut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (e.defaultPrevented) return;

      if (e.clipboardData) {
        e.preventDefault();
      } else {
        return;
      }

      var _this$quill$selection = this.quill.selection.getRange(),
          _this$quill$selection2 = _slicedToArray(_this$quill$selection, 1),
          range = _this$quill$selection2[0];

      if (range == null) return;

      var _this$onCopy = this.onCopy(range, isCut),
          html = _this$onCopy.html,
          text = _this$onCopy.text;

      e.clipboardData.setData('text/plain', text);
      e.clipboardData.setData('text/html', html);

      if (isCut) {
        this.raiseCallback('onCut', e);
        Object(_keyboard__WEBPACK_IMPORTED_MODULE_13__[/* deleteRange */ "c"])({
          range: range,
          quill: this.quill
        });
      }
    }
  }, {
    key: "onCapturePaste",
    value: function onCapturePaste(e) {
      if (e.defaultPrevented || !this.quill.isEnabled()) {
        return;
      }

      this.raiseCallback('onPaste', e);

      if (e.clipboardData) {
        e.preventDefault();
      } else {
        return;
      }

      var range = this.quill.getSelection(true);

      if (range == null) {
        return;
      }

      var html = e.clipboardData.getData('text/html');
      var files = Array.from(e.clipboardData.files || []);

      if (!html && files.length > 0) {
        this.quill.uploader.upload(range, files);
        return;
      }

      if (html && files.length > 0) {
        var _DOMParser$parseFromS = new DOMParser().parseFromString(html, 'text/html'),
            body = _DOMParser$parseFromS.body;

        var documentContainsImage = body.childElementCount === 1 && body.firstElementChild.tagName === 'IMG';

        if (documentContainsImage) {
          this.quill.uploader.upload(range, files);
          return;
        }
      }

      var text = e.clipboardData.getData('text/plain');
      this.onPaste(range, {
        html: html,
        text: text
      });
    }
  }, {
    key: "raiseCallback",
    value: function raiseCallback(name, event) {
      var callback = this.options[name];

      if (callback && typeof callback === 'function') {
        callback(event);
      }
    }
  }, {
    key: "onCopy",
    value: function onCopy(range) {
      var text = this.quill.getText(range);
      var html = this.quill.getSemanticHTML(range);
      return {
        html: html,
        text: text
      };
    }
  }, {
    key: "onPaste",
    value: function onPaste(range, _ref4) {
      var text = _ref4.text,
          html = _ref4.html;
      var formats = this.quill.getFormat(range.index);
      var pastedDelta = this.convert({
        text: text,
        html: html
      }, formats);
      debug.log('onPaste', pastedDelta, {
        text: text,
        html: html
      });
      var delta = new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a().retain(range.index).delete(range.length).concat(pastedDelta);
      this.quill.updateContents(delta, _core_quill__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.USER); // range.length contributes to delta.length()

      this.quill.setSelection(delta.length() - range.length, _core_quill__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].sources.SILENT);
      this.quill.scrollIntoView();
    }
  }, {
    key: "prepareMatching",
    value: function prepareMatching(container, nodeMatches) {
      var elementMatchers = [];
      var textMatchers = [];
      this.matchers.forEach(function (pair) {
        var _pair = _slicedToArray(pair, 2),
            selector = _pair[0],
            matcher = _pair[1];

        switch (selector) {
          case TEXT_NODE:
            textMatchers.push(matcher);
            break;

          case ELEMENT_NODE:
            elementMatchers.push(matcher);
            break;

          default:
            Array.from(container.querySelectorAll(selector)).forEach(function (node) {
              if (nodeMatches.has(node)) {
                var matches = nodeMatches.get(node);
                matches.push(matcher);
              } else {
                nodeMatches.set(node, [matcher]);
              }
            });
            break;
        }
      });
      return [elementMatchers, textMatchers];
    }
  }, {
    key: "prepareTextMatching",
    value: function prepareTextMatching() {
      var textMatchers = [matchPlainText];
      this.matchers.forEach(function (pair) {
        var _pair2 = _slicedToArray(pair, 2),
            selector = _pair2[0],
            matcher = _pair2[1];

        if (HTML_TEXT_MATCHERS.indexOf(matcher) === -1 && selector === TEXT_NODE) {
          textMatchers.push(matcher);
        }
      });
      return textMatchers;
    }
  }]);

  return Clipboard;
}(_core_module__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"]);

Clipboard.DEFAULTS = {
  matchers: []
};

function applyFormat(delta, format, value) {
  if (_typeof(format) === 'object') {
    return Object.keys(format).reduce(function (newDelta, key) {
      return applyFormat(newDelta, key, format[key]);
    }, delta);
  }

  return delta.reduce(function (newDelta, op) {
    if (op.attributes && op.attributes[format]) {
      return newDelta.push(op);
    }

    var formats = value ? _defineProperty({}, format, value) : {};
    return newDelta.insert(op.insert, _objectSpread(_objectSpread({}, formats), op.attributes));
  }, new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a());
}

function deltaEndsWith(delta, text) {
  var endText = '';

  for (var i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i // eslint-disable-line no-plusplus
  ) {
    var op = delta.ops[i];
    if (typeof op.insert !== 'string') break;
    endText = op.insert + endText;
  }

  return endText.slice(-1 * text.length) === text;
}

function isLine(node) {
  if (node.childNodes.length === 0) return false; // Exclude embed blocks

  return ['address', 'article', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'iframe', 'li', 'main', 'nav', 'ol', 'output', 'p', 'pre', 'section', 'table', 'td', 'tr', 'ul', 'video'].indexOf(node.tagName.toLowerCase()) !== -1;
}

var preNodes = new WeakMap();

function isPre(node) {
  if (node == null) return false;

  if (!preNodes.has(node)) {
    if (node.tagName === 'PRE') {
      preNodes.set(node, true);
    } else {
      preNodes.set(node, isPre(node.parentNode));
    }
  }

  return preNodes.get(node);
}

function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
  // Post-order
  if (node.nodeType === node.TEXT_NODE) {
    return textMatchers.reduce(function (delta, matcher) {
      return matcher(node, delta, scroll);
    }, new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a());
  }

  if (node.nodeType === node.ELEMENT_NODE) {
    return Array.from(node.childNodes || []).reduce(function (delta, childNode) {
      var childrenDelta = traverse(scroll, childNode, elementMatchers, textMatchers, nodeMatches);

      if (childNode.nodeType === node.ELEMENT_NODE) {
        childrenDelta = elementMatchers.reduce(function (reducedDelta, matcher) {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
        childrenDelta = (nodeMatches.get(childNode) || []).reduce(function (reducedDelta, matcher) {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
      }

      return delta.concat(childrenDelta);
    }, new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a());
  }

  return new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a();
}

function matchAlias(format, node, delta) {
  return applyFormat(delta, format, true);
}

function matchAttributor(node, delta, scroll) {
  if (['TD', 'TH', 'TR', 'TABLE'].indexOf(node.tagName) === -1) {
    var attributes = parchment__WEBPACK_IMPORTED_MODULE_1__["Attributor"].keys(node);
    var classes = parchment__WEBPACK_IMPORTED_MODULE_1__["ClassAttributor"].keys(node);
    var styles = parchment__WEBPACK_IMPORTED_MODULE_1__["StyleAttributor"].keys(node);
    var formats = {};
    attributes.concat(classes).concat(styles).forEach(function (name) {
      var attr = scroll.query(name, parchment__WEBPACK_IMPORTED_MODULE_1__["Scope"].ATTRIBUTE);

      if (attr != null) {
        formats[attr.attrName] = attr.value(node);
        if (formats[attr.attrName]) return;
      }

      attr = ATTRIBUTE_ATTRIBUTORS[name];

      if (attr != null && (attr.attrName === name || attr.keyName === name)) {
        formats[attr.attrName] = attr.value(node) || undefined;
      }

      attr = STYLE_ATTRIBUTORS[name];

      if (attr != null && (attr.attrName === name || attr.keyName === name)) {
        attr = STYLE_ATTRIBUTORS[name];
        formats[attr.attrName] = attr.value(node) || undefined;
      }
    });

    if (Object.keys(formats).length > 0) {
      return applyFormat(delta, formats);
    }
  }

  return delta;
}

function matchBlot(node, delta, scroll) {
  var match = scroll.query(node);
  if (match == null) return delta;

  if (match.prototype instanceof parchment__WEBPACK_IMPORTED_MODULE_1__["EmbedBlot"]) {
    var embed = {};
    var value = match.value(node);

    if (value != null) {
      embed[match.blotName] = value;
      return new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a().insert(embed, match.formats(node, scroll));
    }
  } else {
    if (match.prototype instanceof parchment__WEBPACK_IMPORTED_MODULE_1__["BlockBlot"] && !deltaEndsWith(delta, '\n')) {
      delta.insert('\n');
    }

    if (typeof match.formats === 'function') {
      return applyFormat(delta, match.blotName, match.formats(node, scroll));
    }
  }

  return delta;
}

function matchBreak(node, delta) {
  if (!deltaEndsWith(delta, '\n')) {
    delta.insert('\n');
  }

  return delta;
}

function matchCodeBlock(node, delta, scroll) {
  var match = scroll.query('code-block');
  var language = match ? match.formats(node, scroll) : true;
  return applyFormat(delta, 'code-block', language);
}

function matchIgnore() {
  return new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a();
}

function matchIndent(node, delta, scroll) {
  var match = scroll.query(node);

  if (match == null || match.blotName !== 'list' || !deltaEndsWith(delta, '\n')) {
    return delta;
  }

  var indent = -1;
  var parent = node.parentNode;

  while (parent != null) {
    if (['OL', 'UL'].indexOf(parent.tagName) !== -1) {
      indent += 1;
    }

    parent = parent.parentNode;
  }

  if (indent <= 0) return delta;
  return delta.reduce(function (composed, op) {
    if (op.attributes && typeof op.attributes.indent === 'number') {
      return composed.push(op);
    }

    return composed.insert(op.insert, _objectSpread({
      indent: indent
    }, op.attributes || {}));
  }, new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a());
}

function matchList(node, delta) {
  var list = node.tagName === 'OL' ? 'ordered' : 'bullet';
  return applyFormat(delta, 'list', list);
}

function matchNewline(node, delta, scroll) {
  if (!deltaEndsWith(delta, '\n')) {
    if (isLine(node)) {
      return delta.insert('\n');
    }

    if (delta.length() > 0 && node.nextSibling) {
      var nextSibling = node.nextSibling;

      while (nextSibling != null) {
        if (isLine(nextSibling)) {
          return delta.insert('\n');
        }

        var match = scroll.query(nextSibling);

        if ((match === null || match === void 0 ? void 0 : match.prototype) instanceof _blots_block__WEBPACK_IMPORTED_MODULE_2__[/* BlockEmbed */ "a"]) {
          return delta.insert('\n');
        }

        nextSibling = nextSibling.firstChild;
      }
    }
  }

  return delta;
}

function matchStyles(node, delta) {
  var formats = {};
  var style = node.style || {};
  ['height', 'width'].forEach(function (dimension) {
    var isCell = ['TD', 'TH'].indexOf(node.tagName) !== -1;
    var isTable = node.tagName === 'TABLE';

    if ((isCell || isTable) && style[dimension]) {
      var name = "".concat(isTable ? 'table' : 'cell').concat(Object(_utils_capitalize__WEBPACK_IMPORTED_MODULE_14__[/* default */ "a"])(dimension));
      formats[name] = style[dimension];
    }
  });

  if (style.fontStyle === 'italic') {
    formats.italic = true;
  }

  if (style.textDecoration.indexOf('underline') !== -1) {
    formats.underline = true;
  }

  if (style.textDecoration.indexOf('line-through') !== -1) {
    formats.strike = true;
  }

  if (style.fontWeight.indexOf('bold') === 0 || parseInt(style.fontWeight, 10) >= 700) {
    formats.bold = true;
  }

  if (Object.keys(formats).length > 0) {
    delta = applyFormat(delta, formats);
  }

  if (parseFloat(style.textIndent || 0) > 0) {
    // Could be 0.5in
    return new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a().insert('\t').concat(delta);
  }

  return delta;
}

function matchPlainText(node, delta) {
  var text = node.data || '';
  text = text.replace(/\r\n/g, '\n');
  return delta.insert(text);
}

function matchText(node, delta) {
  var text = node.data; // Word represents empty line with <o:p>&nbsp;</o:p>

  if (node.parentNode.tagName === 'O:P') {
    return delta.insert(text.trim());
  }

  if (text.trim().length === 0 && text.indexOf('\n') !== -1) {
    return delta;
  }

  if (!isPre(node)) {
    var replacer = function replacer(collapse, match) {
      var replaced = match.replace(/[^\u00a0]/g, ''); // \u00a0 is nbsp;

      return replaced.length < 1 && collapse ? ' ' : replaced;
    };

    text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
    text = text.replace(/\s\s+/g, replacer.bind(replacer, true)); // collapse whitespace

    if (node.previousSibling == null && isLine(node.parentNode) || node.previousSibling != null && isLine(node.previousSibling)) {
      text = text.replace(/^\s+/, replacer.bind(replacer, false));
    }

    if (node.nextSibling == null && isLine(node.parentNode) || node.nextSibling != null && isLine(node.nextSibling)) {
      text = text.replace(/\s+$/, replacer.bind(replacer, false));
    }
  }

  return delta.insert(text);
}



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "b", function() { return /* binding */ keyboard_Keyboard; });
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ SHORTKEY; });
__webpack_require__.d(__webpack_exports__, "d", function() { return /* binding */ normalize; });
__webpack_require__.d(__webpack_exports__, "c", function() { return /* binding */ deleteRange; });

// EXTERNAL MODULE: ./node_modules/lodash.clonedeep/index.js
var lodash_clonedeep = __webpack_require__(16);
var lodash_clonedeep_default = /*#__PURE__*/__webpack_require__.n(lodash_clonedeep);

// EXTERNAL MODULE: ./node_modules/lodash.isequal/index.js
var lodash_isequal = __webpack_require__(30);
var lodash_isequal_default = /*#__PURE__*/__webpack_require__.n(lodash_isequal);

// EXTERNAL MODULE: ./node_modules/quill-delta/dist/Delta.js
var Delta = __webpack_require__(1);
var Delta_default = /*#__PURE__*/__webpack_require__.n(Delta);

// EXTERNAL MODULE: ./node_modules/parchment/src/parchment.ts + 17 modules
var parchment = __webpack_require__(2);

// EXTERNAL MODULE: ./core/quill.js
var core_quill = __webpack_require__(0);

// EXTERNAL MODULE: ./core/logger.js
var logger = __webpack_require__(23);

// EXTERNAL MODULE: ./core/module.js
var core_module = __webpack_require__(12);

// EXTERNAL MODULE: ./utils/has_window.js
var has_window = __webpack_require__(15);

// CONCATENATED MODULE: ./utils/get_scroll_into_view_config.js
function getScrollIntoViewConfig(element) {
  var _window = window,
      windowHeight = _window.innerHeight;

  var _element$getBoundingC = element.getBoundingClientRect(),
      elemTop = _element$getBoundingC.y,
      elemBottom = _element$getBoundingC.bottom;

  if (elemTop < 0) {
    return true; // scroll to the top
  }

  if (elemBottom >= windowHeight) {
    return false; // scroll to the bottom
  }

  return null;
}
// CONCATENATED MODULE: ./modules/keyboard.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }










var debug = Object(logger["a" /* default */])('quill:keyboard');
var KEY_NAMES = {
  backspace: 'backspace',
  tab: 'tab',
  enter: 'enter',
  escape: 'escape',
  pageup: 'pageUp',
  pagedown: 'pageDown',
  end: 'end',
  home: 'home',
  arrowleft: 'leftArrow',
  arrowup: 'upArrow',
  arrowright: 'rightArrow',
  arrowdown: 'downArrow',
  delete: 'del',
  ' ': 'space',
  '*': 'asterisk',
  '-': 'minus',
  alt: 'alt',
  control: 'control',
  shift: 'shift',
  // IE11:
  left: 'leftArrow',
  up: 'upArrow',
  right: 'rightArrow',
  down: 'downArrow',
  multiply: 'asterisk',
  spacebar: 'space',
  del: 'del',
  subtract: 'minus',
  esc: 'escape'
};
var KEY_CODES = {
  // iOS 10.2 and lower didn't supports KeyboardEvent.key
  '8': 'backspace',
  '9': 'tab',
  '13': 'enter',
  '27': 'escape',
  '33': 'pageUp',
  '34': 'pageDown',
  '35': 'end',
  '36': 'home',
  '37': 'leftArrow',
  '38': 'upArrow',
  '39': 'rightArrow',
  '40': 'downArrow',
  '46': 'del',
  '32': 'space',
  '106': 'asterisk',
  '109': 'minus',
  '189': 'minus',
  '173': 'minus',
  '16': 'shift',
  '17': 'control',
  '18': 'alt'
};
var SHORTKEY = Object(has_window["a" /* default */])() && /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';

var keyboard_Keyboard = /*#__PURE__*/function (_Module) {
  _inherits(Keyboard, _Module);

  var _super = _createSuper(Keyboard);

  function Keyboard(quill, options) {
    var _this;

    _classCallCheck(this, Keyboard);

    _this = _super.call(this, quill, options);
    _this.bindings = {};
    Object.keys(_this.options.bindings).forEach(function (name) {
      if (_this.options.bindings[name]) {
        _this.addBinding(_this.options.bindings[name]);
      }
    });

    _this.addInternalBindings();

    _this.listen();

    return _this;
  }

  _createClass(Keyboard, [{
    key: "addInternalBindings",
    value: function addInternalBindings() {
      var _this2 = this;

      this.quill.once(core_quill["a" /* default */].events.CONTENT_SETTED, function () {
        _this2.addBinding({
          key: 'enter',
          shiftKey: null
        }, _this2.handleEnter);

        _this2.addBinding({
          key: 'enter',
          metaKey: null,
          ctrlKey: null,
          altKey: null
        }, function () {});

        if (Object(has_window["a" /* default */])() && /Firefox/i.test(navigator.userAgent)) {
          // Need to handle delete and backspace for Firefox in the general case #1171
          _this2.addBinding({
            key: 'backspace'
          }, {
            collapsed: true
          }, _this2.handleBackspace);

          _this2.addBinding({
            key: 'del'
          }, {
            collapsed: true
          }, _this2.handleDelete);
        } else {
          _this2.addBinding({
            key: 'backspace'
          }, {
            collapsed: true,
            prefix: /^.?$/
          }, _this2.handleBackspace);

          _this2.addBinding({
            key: 'del'
          }, {
            collapsed: true,
            suffix: /^.?$/
          }, _this2.handleDelete);
        }

        _this2.addBinding({
          key: 'backspace'
        }, {
          collapsed: false
        }, _this2.handleDeleteRange);

        _this2.addBinding({
          key: 'del'
        }, {
          collapsed: false
        }, _this2.handleDeleteRange);

        _this2.addBinding({
          key: 'backspace',
          altKey: null,
          ctrlKey: null,
          metaKey: null,
          shiftKey: null
        }, {
          collapsed: true,
          offset: 0
        }, _this2.handleBackspace);
      });
    }
  }, {
    key: "addBinding",
    value: function addBinding(keyBinding) {
      var _this3 = this;

      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var handler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var binding = normalize(keyBinding);

      if (binding == null) {
        debug.warn('Attempted to add invalid keyboard binding', binding);
        return;
      }

      if (typeof context === 'function') {
        context = {
          handler: context
        };
      }

      if (typeof handler === 'function') {
        handler = {
          handler: handler
        };
      }

      var keyPropery = binding.which ? 'which' : 'key';
      var keys = Array.isArray(binding[keyPropery]) ? binding[keyPropery] : [binding[keyPropery]];
      keys.forEach(function (key) {
        var singleBinding = _objectSpread(_objectSpread(_objectSpread({}, binding), {}, {
          key: key
        }, context), handler);

        _this3.bindings[singleBinding.key] = _this3.bindings[singleBinding.key] || [];

        _this3.bindings[singleBinding.key].push(singleBinding);
      });
    }
  }, {
    key: "listen",
    value: function listen() {
      var _this4 = this;

      this.quill.root.addEventListener('keydown', function (evt) {
        if (evt.defaultPrevented || evt.isComposing) return;

        _this4.raiseOnKeydownCallback(evt);

        var keyName = Keyboard.normalizeKeyName(evt);
        var bindings = (_this4.bindings[keyName] || []).concat(_this4.bindings[evt.which] || []);
        var matches = bindings.filter(function (binding) {
          return Keyboard.match(evt, binding);
        });
        if (matches.length === 0) return;

        var range = _this4.quill.getSelection();

        if (range == null || !_this4.quill.hasFocus()) return;

        var _this4$quill$getLine = _this4.quill.getLine(range.index),
            _this4$quill$getLine2 = _slicedToArray(_this4$quill$getLine, 2),
            line = _this4$quill$getLine2[0],
            offset = _this4$quill$getLine2[1];

        var _this4$quill$getLeaf = _this4.quill.getLeaf(range.index),
            _this4$quill$getLeaf2 = _slicedToArray(_this4$quill$getLeaf, 2),
            leafStart = _this4$quill$getLeaf2[0],
            offsetStart = _this4$quill$getLeaf2[1];

        var _ref = range.length === 0 ? [leafStart, offsetStart] : _this4.quill.getLeaf(range.index + range.length),
            _ref2 = _slicedToArray(_ref, 2),
            leafEnd = _ref2[0],
            offsetEnd = _ref2[1];

        var prefixText = leafStart instanceof parchment["TextBlot"] ? leafStart.value().slice(0, offsetStart) : '';
        var suffixText = leafEnd instanceof parchment["TextBlot"] ? leafEnd.value().slice(offsetEnd) : '';
        var curContext = {
          collapsed: range.length === 0,
          empty: range.length === 0 && line.length() <= 1,
          format: _this4.quill.getFormat(range),
          line: line,
          offset: offset,
          prefix: prefixText,
          suffix: suffixText,
          event: evt
        };
        var prevented = false;
        matches.some(function (binding) {
          if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) {
            return false;
          }

          if (binding.empty != null && binding.empty !== curContext.empty) {
            return false;
          }

          if (binding.offset != null && binding.offset !== curContext.offset) {
            return false;
          }

          if (Array.isArray(binding.format)) {
            // any format is present
            if (binding.format.every(function (name) {
              return curContext.format[name] == null;
            })) {
              return false;
            }
          } else if (_typeof(binding.format) === 'object') {
            // all formats must match
            if (!Object.keys(binding.format).every(function (name) {
              if (binding.format[name] === true) return curContext.format[name] != null;
              if (binding.format[name] === false) return curContext.format[name] == null;
              return lodash_isequal_default()(binding.format[name], curContext.format[name]);
            })) {
              return false;
            }
          }

          if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) {
            return false;
          }

          if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) {
            return false;
          }

          var handlerResult = binding.handler.call(_this4, range, curContext, binding);
          var preventAfterAllMatches = handlerResult === null || handlerResult === void 0 ? void 0 : handlerResult.preventAfterAllMatches;
          prevented = handlerResult !== true || preventAfterAllMatches;
          return prevented && !preventAfterAllMatches;
        });

        if (prevented) {
          evt.preventDefault();
        }
      });
    }
  }, {
    key: "raiseOnKeydownCallback",
    value: function raiseOnKeydownCallback(event) {
      var callback = this.options.onKeydown;

      if (callback && typeof callback === 'function') {
        callback(event);
      }
    }
  }, {
    key: "handleBackspace",
    value: function handleBackspace(range, context) {
      // Check for astral symbols
      var length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
      if (range.index === 0 || this.quill.getLength() <= 1) return;
      var formats = {};

      var _this$quill$getLine = this.quill.getLine(range.index),
          _this$quill$getLine2 = _slicedToArray(_this$quill$getLine, 1),
          line = _this$quill$getLine2[0];

      var delta = new Delta_default.a().retain(range.index - length).delete(length);

      if (context.offset === 0) {
        // Always deleting newline here, length always 1
        var _this$quill$getLine3 = this.quill.getLine(range.index - 1),
            _this$quill$getLine4 = _slicedToArray(_this$quill$getLine3, 1),
            prev = _this$quill$getLine4[0];

        if (prev) {
          var isPrevLineEmpty = prev.statics.blotName === 'block' && prev.length() <= 1;

          if (!isPrevLineEmpty) {
            var curFormats = line.formats();
            var prevFormats = this.quill.getFormat(range.index - 1, 1);
            formats = Delta["AttributeMap"].diff(curFormats, prevFormats) || {};

            if (Object.keys(formats).length > 0) {
              // line.length() - 1 targets \n in line, another -1 for newline being deleted
              var formatDelta = new Delta_default.a().retain(range.index + line.length() - 2).retain(1, formats);
              delta = delta.compose(formatDelta);
            }
          }
        }
      }

      this.quill.updateContents(delta, core_quill["a" /* default */].sources.USER);
      this.quill.focus();
    }
  }, {
    key: "handleDelete",
    value: function handleDelete(range, context) {
      // Check for astral symbols
      var length = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
      if (range.index >= this.quill.getLength() - length) return;
      var formats = {};

      var _this$quill$getLine5 = this.quill.getLine(range.index),
          _this$quill$getLine6 = _slicedToArray(_this$quill$getLine5, 1),
          line = _this$quill$getLine6[0];

      var delta = new Delta_default.a().retain(range.index).delete(length);

      if (context.offset >= line.length() - 1) {
        var _this$quill$getLine7 = this.quill.getLine(range.index + 1),
            _this$quill$getLine8 = _slicedToArray(_this$quill$getLine7, 1),
            next = _this$quill$getLine8[0];

        if (next) {
          var curFormats = line.formats();
          var nextFormats = this.quill.getFormat(range.index, 1);
          formats = Delta["AttributeMap"].diff(curFormats, nextFormats) || {};

          if (Object.keys(formats).length > 0) {
            delta = delta.retain(next.length() - 1).retain(1, formats);
          }
        }
      }

      this.quill.updateContents(delta, core_quill["a" /* default */].sources.USER);
      this.quill.focus();
    }
  }, {
    key: "handleDeleteRange",
    value: function handleDeleteRange(range, context) {
      this.raiseOnKeydownCallback(context.event);
      deleteRange({
        range: range,
        quill: this.quill
      });
      this.quill.focus();
    }
  }, {
    key: "handleEnter",
    value: function handleEnter(range, context) {
      var _this5 = this;

      var lineFormats = Object.keys(context.format).reduce(function (formats, format) {
        if (_this5.quill.scroll.query(format, parchment["Scope"].BLOCK) && !Array.isArray(context.format[format])) {
          formats[format] = context.format[format];
        }

        return formats;
      }, {});
      var delta = new Delta_default.a().retain(range.index).delete(range.length).insert('\n', lineFormats);
      this.quill.updateContents(delta, core_quill["a" /* default */].sources.USER);
      this.quill.setSelection(range.index + 1, core_quill["a" /* default */].sources.SILENT);
      this.quill.focus();

      var _this$quill$getLine9 = this.quill.getLine(range.index + 1),
          _this$quill$getLine10 = _slicedToArray(_this$quill$getLine9, 1),
          line = _this$quill$getLine10[0];

      var scrollConfig = getScrollIntoViewConfig(line.domNode);

      if (scrollConfig !== null) {
        line.domNode.scrollIntoView(scrollConfig);
      }

      Object.keys(context.format).forEach(function (name) {
        if (lineFormats[name] != null) return;
        if (Array.isArray(context.format[name])) return;
        if (name === 'code' || name === 'link') return;

        _this5.raiseOnKeydownCallback(context.event);

        _this5.quill.format(name, context.format[name], core_quill["a" /* default */].sources.USER);
      });
    }
  }], [{
    key: "match",
    value: function match(evt, binding) {
      if (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].some(function (key) {
        return !!binding[key] !== evt[key] && binding[key] !== null;
      })) {
        return false;
      }

      return binding.key === Keyboard.normalizeKeyName(evt) || binding.key === evt.which;
    }
  }, {
    key: "normalizeKeyName",
    value: function normalizeKeyName(_ref3) {
      var key = _ref3.key,
          which = _ref3.which;
      var isKeySupported = !!key;
      var normalizedKey = isKeySupported ? key : which;

      if (normalizedKey) {
        if (isKeySupported) {
          normalizedKey = KEY_NAMES[normalizedKey.toLowerCase()] || normalizedKey;
        } else {
          normalizedKey = KEY_CODES[normalizedKey] || String.fromCharCode(normalizedKey);
        }
      }

      return normalizedKey;
    }
  }]);

  return Keyboard;
}(core_module["a" /* default */]);

keyboard_Keyboard.DEFAULTS = {
  bindings: {
    bold: makeFormatHandler('bold', 66),
    italic: makeFormatHandler('italic', 73),
    underline: makeFormatHandler('underline', 85),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: 'tab',
      format: ['blockquote', 'indent', 'list'],
      handler: function handler(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format('indent', '+1', core_quill["a" /* default */].sources.USER);
        return false;
      }
    },
    outdent: {
      key: 'tab',
      shiftKey: true,
      format: ['blockquote', 'indent', 'list'],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler: function handler(range, context) {
        if (context.collapsed && context.offset !== 0) return true;
        this.quill.format('indent', '-1', core_quill["a" /* default */].sources.USER);
        return false;
      }
    },
    'outdent backspace': {
      key: 'backspace',
      collapsed: true,
      shiftKey: null,
      metaKey: null,
      ctrlKey: null,
      altKey: null,
      format: ['indent', 'list'],
      offset: 0,
      handler: function handler(range, context) {
        if (context.format.indent != null) {
          this.quill.format('indent', '-1', core_quill["a" /* default */].sources.USER);
        } else if (context.format.list != null) {
          this.quill.format('list', false, core_quill["a" /* default */].sources.USER);
        }
      }
    },
    'indent code-block': makeCodeBlockHandler(true),
    'outdent code-block': makeCodeBlockHandler(false),
    'remove tab': {
      key: 'tab',
      shiftKey: true,
      collapsed: true,
      prefix: /\t$/,
      handler: function handler(range) {
        this.quill.deleteText(range.index - 1, 1, core_quill["a" /* default */].sources.USER);
      }
    },
    tab: {
      key: 'tab',
      handler: function handler(range, context) {
        if (context.format.table) return true;
        this.quill.history.cutoff();
        var delta = new Delta_default.a().retain(range.index).delete(range.length).insert('\t');
        this.quill.updateContents(delta, core_quill["a" /* default */].sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index + 1, core_quill["a" /* default */].sources.SILENT);
        return false;
      }
    },
    'blockquote empty enter': {
      key: 'enter',
      collapsed: true,
      format: ['blockquote'],
      empty: true,
      handler: function handler() {
        this.quill.format('blockquote', false, core_quill["a" /* default */].sources.USER);
      }
    },
    'list empty enter': {
      key: 'enter',
      collapsed: true,
      format: ['list'],
      empty: true,
      handler: function handler(range, context) {
        var formats = {
          list: false
        };

        if (context.format.indent) {
          formats.indent = false;
        }

        this.quill.formatLine(range.index, range.length, formats, core_quill["a" /* default */].sources.USER);
      }
    },
    'checklist enter': {
      key: 'enter',
      collapsed: true,
      format: {
        list: 'checked'
      },
      handler: function handler(range) {
        var _this$quill$getLine11 = this.quill.getLine(range.index),
            _this$quill$getLine12 = _slicedToArray(_this$quill$getLine11, 2),
            line = _this$quill$getLine12[0],
            offset = _this$quill$getLine12[1];

        var formats = _objectSpread(_objectSpread({}, line.formats()), {}, {
          list: 'checked'
        });

        var delta = new Delta_default.a().retain(range.index).insert('\n', formats).retain(line.length() - offset - 1).retain(1, {
          list: 'unchecked'
        });
        this.quill.updateContents(delta, core_quill["a" /* default */].sources.USER);
        this.quill.setSelection(range.index + 1, core_quill["a" /* default */].sources.SILENT);
        this.quill.scrollIntoView();
      }
    },
    'header enter': {
      key: 'enter',
      collapsed: true,
      format: ['header'],
      suffix: /^$/,
      handler: function handler(range, context) {
        var _this$quill$getLine13 = this.quill.getLine(range.index),
            _this$quill$getLine14 = _slicedToArray(_this$quill$getLine13, 2),
            line = _this$quill$getLine14[0],
            offset = _this$quill$getLine14[1];

        var delta = new Delta_default.a().retain(range.index).insert('\n', context.format).retain(line.length() - offset - 1).retain(1, {
          header: null
        });
        this.quill.updateContents(delta, core_quill["a" /* default */].sources.USER);
        this.quill.setSelection(range.index + 1, core_quill["a" /* default */].sources.SILENT);
        this.quill.scrollIntoView();
      }
    },
    'list autofill': {
      key: 'space',
      shiftKey: null,
      collapsed: true,
      format: {
        'code-block': false,
        blockquote: false,
        table: false
      },
      prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
      handler: function handler(range, context) {
        if (this.quill.scroll.query('list') == null) return true;
        var length = context.prefix.length;

        var _this$quill$getLine15 = this.quill.getLine(range.index),
            _this$quill$getLine16 = _slicedToArray(_this$quill$getLine15, 2),
            line = _this$quill$getLine16[0],
            offset = _this$quill$getLine16[1];

        if (offset > length) return true;
        var value;

        switch (context.prefix.trim()) {
          case '[]':
          case '[ ]':
            value = 'unchecked';
            break;

          case '[x]':
            value = 'checked';
            break;

          case '-':
          case '*':
            value = 'bullet';
            break;

          default:
            value = 'ordered';
        }

        this.quill.insertText(range.index, ' ', core_quill["a" /* default */].sources.USER);
        this.quill.history.cutoff();
        var delta = new Delta_default.a().retain(range.index - offset).delete(length + 1).retain(line.length() - 2 - offset).retain(1, {
          list: value
        });
        this.raiseOnKeydownCallback(context.event);
        this.quill.updateContents(delta, core_quill["a" /* default */].sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index - length, core_quill["a" /* default */].sources.SILENT);
        return false;
      }
    },
    'code exit': {
      key: 'enter',
      collapsed: true,
      format: ['code-block'],
      prefix: /^$/,
      suffix: /^\s*$/,
      handler: function handler(range) {
        var _this$quill$getLine17 = this.quill.getLine(range.index),
            _this$quill$getLine18 = _slicedToArray(_this$quill$getLine17, 2),
            line = _this$quill$getLine18[0],
            offset = _this$quill$getLine18[1];

        var numLines = 2;
        var cur = line;

        while (cur != null && cur.length() <= 1 && cur.formats()['code-block']) {
          cur = cur.prev;
          numLines -= 1; // Requisite prev lines are empty

          if (numLines <= 0) {
            var delta = new Delta_default.a().retain(range.index + line.length() - offset - 2).retain(1, {
              'code-block': null
            }).delete(1);
            this.quill.updateContents(delta, core_quill["a" /* default */].sources.USER);
            this.quill.setSelection(range.index - 1, core_quill["a" /* default */].sources.SILENT);
            return false;
          }
        }

        return true;
      }
    },
    'embed left': makeEmbedArrowHandler('leftArrow', false),
    'embed left shift': makeEmbedArrowHandler('leftArrow', true),
    'embed right': makeEmbedArrowHandler('rightArrow', false),
    'embed right shift': makeEmbedArrowHandler('rightArrow', true)
  }
};

function makeCodeBlockHandler(indent) {
  return {
    key: 'tab',
    shiftKey: !indent,
    format: {
      'code-block': true
    },
    handler: function handler(range) {
      var CodeBlock = this.quill.scroll.query('code-block');
      var lines = range.length === 0 ? this.quill.getLines(range.index, 1) : this.quill.getLines(range);
      var index = range.index,
          length = range.length;
      lines.forEach(function (line, i) {
        if (indent) {
          line.insertAt(0, CodeBlock.TAB);

          if (i === 0) {
            index += CodeBlock.TAB.length;
          } else {
            length += CodeBlock.TAB.length;
          }
        } else if (line.domNode.textContent.indexOf(CodeBlock.TAB) === 0) {
          line.deleteAt(0, CodeBlock.TAB.length);

          if (i === 0) {
            index -= CodeBlock.TAB.length;
          } else {
            length -= CodeBlock.TAB.length;
          }
        }
      });
      this.quill.update(core_quill["a" /* default */].sources.USER);
      this.quill.setSelection(index, length, core_quill["a" /* default */].sources.SILENT);
    }
  };
}

function makeEmbedArrowHandler(key, shiftKey) {
  var _ref4;

  var where = key === 'leftArrow' ? 'prefix' : 'suffix';
  return _ref4 = {
    key: key,
    shiftKey: shiftKey,
    altKey: null
  }, _defineProperty(_ref4, where, /^$/), _defineProperty(_ref4, "handler", function handler(range) {
    var index = range.index;

    if (key === 'rightArrow') {
      index += range.length + 1;
    }

    var _this$quill$getLeaf = this.quill.getLeaf(index),
        _this$quill$getLeaf2 = _slicedToArray(_this$quill$getLeaf, 1),
        leaf = _this$quill$getLeaf2[0];

    if (!(leaf instanceof parchment["EmbedBlot"])) return true;

    if (key === 'leftArrow') {
      if (shiftKey) {
        this.quill.setSelection(range.index - 1, range.length + 1, core_quill["a" /* default */].sources.USER);
      } else {
        this.quill.setSelection(range.index - 1, core_quill["a" /* default */].sources.USER);
      }
    } else if (shiftKey) {
      this.quill.setSelection(range.index, range.length + 1, core_quill["a" /* default */].sources.USER);
    } else {
      this.quill.setSelection(range.index + range.length + 1, core_quill["a" /* default */].sources.USER);
    }

    return false;
  }), _ref4;
}

function makeFormatHandler(format, which) {
  return {
    key: format[0],
    which: which,
    shortKey: true,
    handler: function handler(range, context) {
      this.quill.format(format, !context.format[format], core_quill["a" /* default */].sources.USER);
      return {
        preventAfterAllMatches: true
      };
    }
  };
}

function normalize(binding) {
  if (typeof binding === 'string' || typeof binding === 'number') {
    binding = {
      key: binding
    };
  } else if (_typeof(binding) === 'object') {
    binding = lodash_clonedeep_default()(binding);
  } else {
    return null;
  }

  if (binding.shortKey) {
    binding[SHORTKEY] = binding.shortKey;
    delete binding.shortKey;
  }

  return binding;
}

function deleteRange(_ref5) {
  var quill = _ref5.quill,
      range = _ref5.range;
  var lines = quill.getLines(range);
  var formats = {};

  if (lines.length > 1) {
    var firstFormats = lines[0].formats();
    var lastFormats = lines[lines.length - 1].formats();
    formats = Delta["AttributeMap"].diff(lastFormats, firstFormats) || {};
  }

  quill.deleteText(range, core_quill["a" /* default */].sources.USER);

  if (Object.keys(formats).length > 0) {
    quill.formatLine(range.index, 1, formats, core_quill["a" /* default */].sources.USER);
  }

  quill.setSelection(range.index, core_quill["a" /* default */].sources.SILENT);
}



/***/ }),
/* 28 */,
/* 29 */,
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(58), __webpack_require__(66)(module)))

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return capitalize; });
function capitalize(text) {
  return text ? text.substring(0, 1).toUpperCase() + text.substring(1) : '';
}

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return tableConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TABLE_ATTRIBUTES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TABLE_STYLES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TABLE_KEY_NAME_SET; });
var tableConfig = {
  name: 'table',
  allowedTags: ['TABLE']
};
var TABLE_ATTRIBUTES = ['height', 'width'];
var TABLE_STYLES = ['height', 'width', 'text-align', 'background-color', 'border', 'border-style', 'border-width', 'border-color'];
var TABLE_KEY_NAME_SET = new Set([].concat(TABLE_ATTRIBUTES, TABLE_STYLES));

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return cellConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TABLE_CELL_ATTRIBUTES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return TABLE_CELL_STYLES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TABLE_CELL_KEY_NAME_SET; });
var cellConfig = {
  name: 'cell',
  allowedTags: ['TH', 'TD', 'TR']
};
var TABLE_CELL_ATTRIBUTES = ['height', 'width'];
var TABLE_CELL_STYLES = ['height', 'width', 'vertical-align', 'text-align', 'background-color', 'border', 'border-style', 'border-width', 'border-color', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
var TABLE_CELL_KEY_NAME_SET = new Set([].concat(TABLE_CELL_ATTRIBUTES, TABLE_CELL_STYLES));

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColorAttributor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ColorClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ColorStyle; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var ColorAttributor = /*#__PURE__*/function (_StyleAttributor) {
  _inherits(ColorAttributor, _StyleAttributor);

  var _super = _createSuper(ColorAttributor);

  function ColorAttributor() {
    _classCallCheck(this, ColorAttributor);

    return _super.apply(this, arguments);
  }

  _createClass(ColorAttributor, [{
    key: "value",
    value: function value(domNode) {
      var value = _get(_getPrototypeOf(ColorAttributor.prototype), "value", this).call(this, domNode);

      if (value.indexOf('rgb(') !== 0) return value;
      value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');
      var hex = value.split(',').map(function (component) {
        return "00".concat(parseInt(component, 10).toString(16)).slice(-2);
      }).join('');
      return "#".concat(hex);
    }
  }]);

  return ColorAttributor;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["StyleAttributor"]);

var ColorClass = new parchment__WEBPACK_IMPORTED_MODULE_0__["ClassAttributor"]('color', 'ql-color', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].INLINE
});
var ColorStyle = new ColorAttributor('color', 'color', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].INLINE
});


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DirectionAttribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DirectionClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DirectionStyle; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

var config = {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].BLOCK,
  whitelist: ['rtl']
};
var DirectionAttribute = new parchment__WEBPACK_IMPORTED_MODULE_0__["Attributor"]('direction', 'dir', config);
var DirectionClass = new parchment__WEBPACK_IMPORTED_MODULE_0__["ClassAttributor"]('direction', 'ql-direction', config);
var DirectionStyle = new parchment__WEBPACK_IMPORTED_MODULE_0__["StyleAttributor"]('direction', 'direction', config);


/***/ }),
/* 36 */,
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeMax = Math.max,
    nativeNow = Date.now;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = merge;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(58), __webpack_require__(66)(module)))

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AlignAttribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AlignClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return AlignStyle; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

var config = {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].BLOCK,
  whitelist: ['right', 'center', 'justify']
};
var AlignAttribute = new parchment__WEBPACK_IMPORTED_MODULE_0__["Attributor"]('align', 'align', config);
var AlignClass = new parchment__WEBPACK_IMPORTED_MODULE_0__["ClassAttributor"]('align', 'ql-align', config);
var AlignStyle = new parchment__WEBPACK_IMPORTED_MODULE_0__["StyleAttributor"]('align', 'text-align', config);


/***/ }),
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (new WeakMap());

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackgroundClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BackgroundStyle; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34);


var BackgroundClass = new parchment__WEBPACK_IMPORTED_MODULE_0__["ClassAttributor"]('background', 'ql-bg', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].INLINE
});
var BackgroundStyle = new _color__WEBPACK_IMPORTED_MODULE_1__[/* ColorAttributor */ "a"]('background', 'background-color', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].INLINE
});


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return FontStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FontClass; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var config = {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].INLINE,
  whitelist: ['serif', 'monospace']
};
var FontClass = new parchment__WEBPACK_IMPORTED_MODULE_0__["ClassAttributor"]('font', 'ql-font', config);

var FontStyleAttributor = /*#__PURE__*/function (_StyleAttributor) {
  _inherits(FontStyleAttributor, _StyleAttributor);

  var _super = _createSuper(FontStyleAttributor);

  function FontStyleAttributor() {
    _classCallCheck(this, FontStyleAttributor);

    return _super.apply(this, arguments);
  }

  _createClass(FontStyleAttributor, [{
    key: "value",
    value: function value(node) {
      return _get(_getPrototypeOf(FontStyleAttributor.prototype), "value", this).call(this, node).replace(/["']/g, '');
    }
  }]);

  return FontStyleAttributor;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["StyleAttributor"]);

var FontStyle = new FontStyleAttributor('font', 'font-family', config);


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SizeClass; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SizeStyle; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

var SizeClass = new parchment__WEBPACK_IMPORTED_MODULE_0__["ClassAttributor"]('size', 'ql-size', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].INLINE,
  whitelist: ['small', 'large', 'huge']
});
var SizeStyle = new parchment__WEBPACK_IMPORTED_MODULE_0__["StyleAttributor"]('size', 'font-size', {
  scope: parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].INLINE,
  whitelist: ['10px', '18px', '32px']
});


/***/ }),
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return History; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getLastChangeIndex; });
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _core_quill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _core_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _utils_has_window__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var History = /*#__PURE__*/function (_Module) {
  _inherits(History, _Module);

  var _super = _createSuper(History);

  function History(quill, options) {
    var _this;

    _classCallCheck(this, History);

    _this = _super.call(this, quill, options);
    _this.lastRecorded = 0;
    _this.ignoreChange = false;

    _this.clear();

    _this.quill.on(_core_quill__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].events.EDITOR_CHANGE, function (eventName, delta, oldDelta, source) {
      if (eventName !== _core_quill__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].events.TEXT_CHANGE || _this.ignoreChange) return;

      if (!_this.options.userOnly || source === _core_quill__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].sources.USER) {
        _this.record(delta, oldDelta);
      } else {
        _this.transform(delta);
      }
    });

    _this.quill.keyboard.addBinding({
      key: 'z',
      shortKey: true
    }, _this.undo.bind(_assertThisInitialized(_this)));

    _this.quill.keyboard.addBinding({
      key: 'z',
      shortKey: true,
      shiftKey: true
    }, _this.redo.bind(_assertThisInitialized(_this)));

    if (Object(_utils_has_window__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])() && /Win/i.test(navigator.platform)) {
      _this.quill.keyboard.addBinding({
        key: 'y',
        shortKey: true
      }, _this.redo.bind(_assertThisInitialized(_this)));
    }

    _this.quill.root.addEventListener('beforeinput', function (event) {
      if (event.inputType === 'historyUndo') {
        _this.undo();

        event.preventDefault();
      } else if (event.inputType === 'historyRedo') {
        _this.redo();

        event.preventDefault();
      }
    });

    return _this;
  }

  _createClass(History, [{
    key: "change",
    value: function change(source, dest) {
      if (this.stack[source].length === 0) return;
      var delta = this.stack[source].pop();
      var base = this.quill.getContents();
      var inverseDelta = delta.invert(base);
      this.stack[dest].push(inverseDelta);
      this.lastRecorded = 0;
      this.ignoreChange = true;
      this.quill.updateContents(delta, _core_quill__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].sources.USER);
      this.ignoreChange = false;
      var index = getLastChangeIndex(this.quill.scroll, delta);
      this.quill.setSelection(index);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.stack = {
        undo: [],
        redo: []
      };
    }
  }, {
    key: "cutoff",
    value: function cutoff() {
      this.lastRecorded = 0;
    }
  }, {
    key: "record",
    value: function record(changeDelta, oldDelta) {
      if (changeDelta.ops.length === 0) return;
      this.stack.redo = [];
      var undoDelta = changeDelta.invert(oldDelta);
      var timestamp = Date.now();

      if (this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0) {
        var delta = this.stack.undo.pop();
        undoDelta = undoDelta.compose(delta);
      } else {
        this.lastRecorded = timestamp;
      }

      if (undoDelta.length() === 0) return;
      this.stack.undo.push(undoDelta);

      if (this.stack.undo.length > this.options.maxStack) {
        this.stack.undo.shift();
      }
    }
  }, {
    key: "redo",
    value: function redo() {
      this.change('redo', 'undo');
    }
  }, {
    key: "transform",
    value: function transform(delta) {
      transformStack(this.stack.undo, delta);
      transformStack(this.stack.redo, delta);
    }
  }, {
    key: "undo",
    value: function undo() {
      this.change('undo', 'redo');
    }
  }]);

  return History;
}(_core_module__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]);

History.DEFAULTS = {
  delay: 1000,
  maxStack: 100,
  userOnly: false
};

function transformStack(stack, delta) {
  var remoteDelta = delta;

  for (var i = stack.length - 1; i >= 0; i -= 1) {
    var oldDelta = stack[i];
    stack[i] = remoteDelta.transform(oldDelta, true);
    remoteDelta = oldDelta.transform(remoteDelta);

    if (stack[i].length() === 0) {
      stack.splice(i, 1);
    }
  }
}

function endsWithNewlineChange(scroll, delta) {
  var lastOp = delta.ops[delta.ops.length - 1];
  if (lastOp == null) return false;

  if (lastOp.insert != null) {
    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
  }

  if (lastOp.attributes != null) {
    return Object.keys(lastOp.attributes).some(function (attr) {
      return scroll.query(attr, parchment__WEBPACK_IMPORTED_MODULE_0__["Scope"].BLOCK) != null;
    });
  }

  return false;
}

function getLastChangeIndex(scroll, delta) {
  var deleteLength = delta.reduce(function (length, op) {
    return length + (op.delete || 0);
  }, 0);
  var changeIndex = delta.length() - deleteLength;

  if (endsWithNewlineChange(scroll, delta)) {
    changeIndex -= 1;
  }

  return changeIndex;
}



/***/ }),
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var parchment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var GUARD_TEXT = "\uFEFF";

var Embed = /*#__PURE__*/function (_EmbedBlot) {
  _inherits(Embed, _EmbedBlot);

  var _super = _createSuper(Embed);

  function Embed(scroll, node) {
    var _this;

    _classCallCheck(this, Embed);

    _this = _super.call(this, scroll, node);
    _this.contentNode = document.createElement('span');

    _this.contentNode.setAttribute('contenteditable', false);

    Array.from(_this.domNode.childNodes).forEach(function (childNode) {
      _this.contentNode.appendChild(childNode);
    });
    _this.leftGuard = document.createTextNode(GUARD_TEXT);
    _this.rightGuard = document.createTextNode(GUARD_TEXT);

    _this.domNode.appendChild(_this.leftGuard);

    _this.domNode.appendChild(_this.contentNode);

    _this.domNode.appendChild(_this.rightGuard);

    return _this;
  }

  _createClass(Embed, [{
    key: "index",
    value: function index(node, offset) {
      if (node === this.leftGuard) return 0;
      if (node === this.rightGuard) return 1;
      return _get(_getPrototypeOf(Embed.prototype), "index", this).call(this, node, offset);
    }
  }, {
    key: "restore",
    value: function restore(node) {
      var range;
      var textNode;
      var text = node.data.split(GUARD_TEXT).join('');

      if (node === this.leftGuard) {
        if (this.prev instanceof _text__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]) {
          var prevLength = this.prev.length();
          this.prev.insertAt(prevLength, text);
          range = {
            startNode: this.prev.domNode,
            startOffset: prevLength + text.length
          };
        } else {
          textNode = document.createTextNode(text);
          this.parent.insertBefore(this.scroll.create(textNode), this);
          range = {
            startNode: textNode,
            startOffset: text.length
          };
        }
      } else if (node === this.rightGuard) {
        if (this.next instanceof _text__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"]) {
          this.next.insertAt(0, text);
          range = {
            startNode: this.next.domNode,
            startOffset: text.length
          };
        } else {
          textNode = document.createTextNode(text);
          this.parent.insertBefore(this.scroll.create(textNode), this.next);
          range = {
            startNode: textNode,
            startOffset: text.length
          };
        }
      }

      node.data = GUARD_TEXT;
      return range;
    }
  }, {
    key: "update",
    value: function update(mutations, context) {
      var _this2 = this;

      mutations.forEach(function (mutation) {
        if (mutation.type === 'characterData' && (mutation.target === _this2.leftGuard || mutation.target === _this2.rightGuard)) {
          var range = _this2.restore(mutation.target);

          if (range) context.range = range;
        }
      });
    }
  }]);

  return Embed;
}(parchment__WEBPACK_IMPORTED_MODULE_0__["EmbedBlot"]);

/* harmony default export */ __webpack_exports__["a"] = (Embed);

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Theme = /*#__PURE__*/function () {
  function Theme(quill, options) {
    _classCallCheck(this, Theme);

    this.quill = quill;
    this.options = options;
    this.modules = {};
  }

  _createClass(Theme, [{
    key: "init",
    value: function init() {
      var _this = this;

      Object.keys(this.options.modules).forEach(function (name) {
        if (_this.modules[name] == null) {
          _this.addModule(name);
        }
      });
    }
  }, {
    key: "addModule",
    value: function addModule(name) {
      var ModuleClass = this.quill.constructor.import("modules/".concat(name));
      this.modules[name] = new ModuleClass(this.quill, this.options.modules[name] || {});
      return this.modules[name];
    }
  }]);

  return Theme;
}();

Theme.DEFAULTS = {
  modules: {}
};
Theme.themes = {
  default: Theme
};
/* harmony default export */ __webpack_exports__["a"] = (Theme);

/***/ }),
/* 58 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var quill_delta__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(quill_delta__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _core_emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _core_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _utils_has_window__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var Uploader = /*#__PURE__*/function (_Module) {
  _inherits(Uploader, _Module);

  var _super = _createSuper(Uploader);

  function Uploader(quill, options) {
    var _this;

    _classCallCheck(this, Uploader);

    _this = _super.call(this, quill, options);

    _this.preventImageUploading(false);

    _this.addDragOverHandler();

    _this.addDropHandler();

    return _this;
  }

  _createClass(Uploader, [{
    key: "addDragOverHandler",
    value: function addDragOverHandler() {
      if (Object(_utils_has_window__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"])()) {
        var ua = window.navigator.userAgent.toLowerCase();
        var isMsIe = ua.indexOf('msie ') !== -1 || ua.indexOf('trident/') !== -1 || ua.indexOf('edge/') !== -1;

        if (isMsIe) {
          this.quill.root.addEventListener('dragover', function (e) {
            e.preventDefault();
          });
        }
      }
    }
  }, {
    key: "addDropHandler",
    value: function addDropHandler() {
      var _this2 = this;

      this.quill.root.addEventListener('drop', function (e) {
        var noFiles = e.dataTransfer.files.length === 0;
        var onDrop = _this2.options.onDrop;

        if (onDrop && typeof onDrop === 'function') {
          onDrop(e);
        }

        if (noFiles || _this2.preventImageUpload) {
          return;
        }

        e.preventDefault();
        var native;

        if (document.caretRangeFromPoint) {
          native = document.caretRangeFromPoint(e.clientX, e.clientY);
        } else if (document.caretPositionFromPoint) {
          var position = document.caretPositionFromPoint(e.clientX, e.clientY);
          native = document.createRange();
          native.setStart(position.offsetNode, position.offset);
          native.setEnd(position.offsetNode, position.offset);
        } else {
          return;
        }

        var normalized = _this2.quill.selection.normalizeNative(native);

        var range = _this2.quill.selection.normalizedToRange(normalized);

        _this2.upload(range, e.dataTransfer.files);
      });
    }
  }, {
    key: "preventImageUploading",
    value: function preventImageUploading(value) {
      if (typeof value !== 'undefined') {
        this.preventImageUpload = value;
      }

      return this.preventImageUpload;
    }
  }, {
    key: "upload",
    value: function upload(range, files, force) {
      var _this3 = this;

      if (this.preventImageUpload && !force) {
        return;
      }

      var uploads = [];
      Array.from(files).forEach(function (file) {
        if (file && _this3.options.mimetypes.indexOf(file.type) !== -1) {
          uploads.push(file);
        }
      });

      if (uploads.length > 0) {
        this.options.handler.call(this, range, uploads, this.options.imageBlot);
      }
    }
  }]);

  return Uploader;
}(_core_module__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"]);

Uploader.DEFAULTS = {
  mimetypes: ['image/png', 'image/jpeg', 'image/pjpeg', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/vnd.microsoft.icon'],
  imageBlot: 'image',
  handler: function handler(range, files, blotName) {
    var _this4 = this;

    var promises = files.map(function (file) {
      return new Promise(function (resolve) {
        var reader = new FileReader();

        reader.onload = function (e) {
          resolve(e.target.result);
        };

        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(function (images) {
      var update = images.reduce(function (delta, image) {
        return delta.insert(_defineProperty({}, blotName, image));
      }, new quill_delta__WEBPACK_IMPORTED_MODULE_0___default.a().retain(range.index).delete(range.length));

      _this4.quill.updateContents(update, _core_emitter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].sources.USER);

      _this4.quill.setSelection(range.index + images.length, _core_emitter__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].sources.SILENT);
    });
  }
};
/* harmony default export */ __webpack_exports__["a"] = (Uploader);

/***/ }),
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Iterator_1 = __importDefault(__webpack_require__(120));
var Op;
(function (Op) {
    function iterator(ops) {
        return new Iterator_1.default(ops);
    }
    Op.iterator = iterator;
    function length(op) {
        if (typeof op.delete === 'number') {
            return op.delete;
        }
        else if (typeof op.retain === 'number') {
            return op.retain;
        }
        else {
            return typeof op.insert === 'string' ? op.insert.length : 1;
        }
    }
    Op.length = length;
})(Op || (Op = {}));
exports.default = Op;


/***/ }),
/* 95 */
/***/ (function(module, exports) {

'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}


/***/ }),
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */
/***/ (function(module, exports) {

/**
 * This library modifies the diff-patch-match library by Neil Fraser
 * by removing the patch and match functionality and certain advanced
 * options in the diff function. The original license is as follows:
 *
 * ===
 *
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {Int|Object} [cursor_pos] Edit position in text1 or object with more info
 * @return {Array} Array of diff tuples.
 */
function diff_main(text1, text2, cursor_pos, _fix_unicode) {
  // Check for equality
  if (text1 === text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (cursor_pos != null) {
    var editdiff = find_cursor_edit_diff(text1, text2, cursor_pos);
    if (editdiff) {
      return editdiff;
    }
  }

  // Trim off common prefix (speedup).
  var commonlength = diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = diff_compute_(text1, text2);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  diff_cleanupMerge(diffs, _fix_unicode);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 */
function diff_compute_(text1, text2) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i !== -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [
      [DIFF_INSERT, longtext.substring(0, i)],
      [DIFF_EQUAL, shorttext],
      [DIFF_INSERT, longtext.substring(i + shorttext.length)]
    ];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length === 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = diff_main(text1_a, text2_a);
    var diffs_b = diff_main(text1_b, text2_b);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  return diff_bisect_(text1, text2);
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 * @private
 */
function diff_bisect_(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 !== 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 === -d || (k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (
        x1 < text1_length && y1 < text2_length &&
        text1.charAt(x1) === text2.charAt(y1)
      ) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 === -d || (k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (
        x2 < text1_length && y2 < text2_length &&
        text1.charAt(text1_length - x2 - 1) === text2.charAt(text2_length - y2 - 1)
      ) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @return {Array} Array of diff tuples.
 */
function diff_bisectSplit_(text1, text2, x, y) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = diff_main(text1a, text2a);
  var diffsb = diff_main(text1b, text2b);

  return diffs.concat(diffsb);
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
function diff_commonPrefix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (
      text1.substring(pointerstart, pointermid) ==
      text2.substring(pointerstart, pointermid)
    ) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }

  if (is_surrogate_pair_start(text1.charCodeAt(pointermid - 1))) {
    pointermid--;
  }

  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
function diff_commonSuffix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.slice(-1) !== text2.slice(-1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (
      text1.substring(text1.length - pointermid, text1.length - pointerend) ==
      text2.substring(text2.length - pointermid, text2.length - pointerend)
    ) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }

  if (is_surrogate_pair_end(text1.charCodeAt(text1.length - pointermid))) {
    pointermid--;
  }

  return pointermid;
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 */
function diff_halfMatch_(text1, text2) {
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {
      var prefixLength = diff_commonPrefix(
        longtext.substring(i), shorttext.substring(j));
      var suffixLength = diff_commonSuffix(
        longtext.substring(0, i), shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(
          j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [
        best_longtext_a, best_longtext_b,
        best_shorttext_a, best_shorttext_b, best_common
      ];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {Array} diffs Array of diff tuples.
 * @param {boolean} fix_unicode Whether to normalize to a unicode-correct diff
 */
function diff_cleanupMerge(diffs, fix_unicode) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
      diffs.splice(pointer, 1);
      continue;
    }
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:

        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        var previous_equality = pointer - count_insert - count_delete - 1;
        if (fix_unicode) {
          // prevent splitting of unicode surrogate pairs.  when fix_unicode is true,
          // we assume that the old and new text in the diff are complete and correct
          // unicode-encoded JS strings, but the tuple boundaries may fall between
          // surrogate pairs.  we fix this by shaving off stray surrogates from the end
          // of the previous equality and the beginning of this equality.  this may create
          // empty equalities or a common prefix or suffix.  for example, if AB and AC are
          // emojis, `[[0, 'A'], [-1, 'BA'], [0, 'C']]` would turn into deleting 'ABAC' and
          // inserting 'AC', and then the common suffix 'AC' will be eliminated.  in this
          // particular case, both equalities go away, we absorb any previous inequalities,
          // and we keep scanning for the next equality before rewriting the tuples.
          if (previous_equality >= 0 && ends_with_pair_start(diffs[previous_equality][1])) {
            var stray = diffs[previous_equality][1].slice(-1);
            diffs[previous_equality][1] = diffs[previous_equality][1].slice(0, -1);
            text_delete = stray + text_delete;
            text_insert = stray + text_insert;
            if (!diffs[previous_equality][1]) {
              // emptied out previous equality, so delete it and include previous delete/insert
              diffs.splice(previous_equality, 1);
              pointer--;
              var k = previous_equality - 1;
              if (diffs[k] && diffs[k][0] === DIFF_INSERT) {
                count_insert++;
                text_insert = diffs[k][1] + text_insert;
                k--;
              }
              if (diffs[k] && diffs[k][0] === DIFF_DELETE) {
                count_delete++;
                text_delete = diffs[k][1] + text_delete;
                k--;
              }
              previous_equality = k;
            }
          }
          if (starts_with_pair_end(diffs[pointer][1])) {
            var stray = diffs[pointer][1].charAt(0);
            diffs[pointer][1] = diffs[pointer][1].slice(1);
            text_delete += stray;
            text_insert += stray;
          }
        }
        if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
          // for empty equality not at end, wait for next equality
          diffs.splice(pointer, 1);
          break;
        }
        if (text_delete.length > 0 || text_insert.length > 0) {
          // note that diff_commonPrefix and diff_commonSuffix are unicode-aware
          if (text_delete.length > 0 && text_insert.length > 0) {
            // Factor out any common prefixes.
            commonlength = diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if (previous_equality >= 0) {
                diffs[previous_equality][1] += text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL, text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixes.
            commonlength = diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] =
                text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length - commonlength);
              text_delete = text_delete.substring(0, text_delete.length - commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          var n = count_insert + count_delete;
          if (text_delete.length === 0 && text_insert.length === 0) {
            diffs.splice(pointer - n, n);
            pointer = pointer - n;
          } else if (text_delete.length === 0) {
            diffs.splice(pointer - n, n, [DIFF_INSERT, text_insert]);
            pointer = pointer - n + 1;
          } else if (text_insert.length === 0) {
            diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete]);
            pointer = pointer - n + 1;
          } else {
            diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
            pointer = pointer - n + 2;
          }
        }
        if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] === DIFF_EQUAL &&
      diffs[pointer + 1][0] === DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
        diffs[pointer - 1][1].length) === diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
          diffs[pointer][1].substring(0, diffs[pointer][1].length -
            diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
        diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
          diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
          diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    diff_cleanupMerge(diffs, fix_unicode);
  }
};

function is_surrogate_pair_start(charCode) {
  return charCode >= 0xD800 && charCode <= 0xDBFF;
}

function is_surrogate_pair_end(charCode) {
  return charCode >= 0xDC00 && charCode <= 0xDFFF;
}

function starts_with_pair_end(str) {
  return is_surrogate_pair_end(str.charCodeAt(0));
}

function ends_with_pair_start(str) {
  return is_surrogate_pair_start(str.charCodeAt(str.length - 1));
}

function remove_empty_tuples(tuples) {
  var ret = [];
  for (var i = 0; i < tuples.length; i++) {
    if (tuples[i][1].length > 0) {
      ret.push(tuples[i]);
    }
  }
  return ret;
}

function make_edit_splice(before, oldMiddle, newMiddle, after) {
  if (ends_with_pair_start(before) || starts_with_pair_end(after)) {
    return null;
  }
  return remove_empty_tuples([
    [DIFF_EQUAL, before],
    [DIFF_DELETE, oldMiddle],
    [DIFF_INSERT, newMiddle],
    [DIFF_EQUAL, after]
  ]);
}

function find_cursor_edit_diff(oldText, newText, cursor_pos) {
  // note: this runs after equality check has ruled out exact equality
  var oldRange = typeof cursor_pos === 'number' ?
    { index: cursor_pos, length: 0 } : cursor_pos.oldRange;
  var newRange = typeof cursor_pos === 'number' ?
    null : cursor_pos.newRange;
  // take into account the old and new selection to generate the best diff
  // possible for a text edit.  for example, a text change from "xxx" to "xx"
  // could be a delete or forwards-delete of any one of the x's, or the
  // result of selecting two of the x's and typing "x".
  var oldLength = oldText.length;
  var newLength = newText.length;
  if (oldRange.length === 0 && (newRange === null || newRange.length === 0)) {
    // see if we have an insert or delete before or after cursor
    var oldCursor = oldRange.index;
    var oldBefore = oldText.slice(0, oldCursor);
    var oldAfter = oldText.slice(oldCursor);
    var maybeNewCursor = newRange ? newRange.index : null;
    editBefore: {
      // is this an insert or delete right before oldCursor?
      var newCursor = oldCursor + newLength - oldLength;
      if (maybeNewCursor !== null && maybeNewCursor !== newCursor) {
        break editBefore;
      }
      if (newCursor < 0 || newCursor > newLength) {
        break editBefore;
      }
      var newBefore = newText.slice(0, newCursor);
      var newAfter = newText.slice(newCursor);
      if (newAfter !== oldAfter) {
        break editBefore;
      }
      var prefixLength = Math.min(oldCursor, newCursor);
      var oldPrefix = oldBefore.slice(0, prefixLength);
      var newPrefix = newBefore.slice(0, prefixLength);
      if (oldPrefix !== newPrefix) {
        break editBefore;
      }
      var oldMiddle = oldBefore.slice(prefixLength);
      var newMiddle = newBefore.slice(prefixLength);
      return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldAfter);
    }
    editAfter: {
      // is this an insert or delete right after oldCursor?
      if (maybeNewCursor !== null && maybeNewCursor !== oldCursor) {
        break editAfter;
      }
      var cursor = oldCursor;
      var newBefore = newText.slice(0, cursor);
      var newAfter = newText.slice(cursor);
      if (newBefore !== oldBefore) {
        break editAfter;
      }
      var suffixLength = Math.min(oldLength - cursor, newLength - cursor);
      var oldSuffix = oldAfter.slice(oldAfter.length - suffixLength);
      var newSuffix = newAfter.slice(newAfter.length - suffixLength);
      if (oldSuffix !== newSuffix) {
        break editAfter;
      }
      var oldMiddle = oldAfter.slice(0, oldAfter.length - suffixLength);
      var newMiddle = newAfter.slice(0, newAfter.length - suffixLength);
      return make_edit_splice(oldBefore, oldMiddle, newMiddle, oldSuffix);
    }
  }
  if (oldRange.length > 0 && newRange && newRange.length === 0) {
    replaceRange: {
      // see if diff could be a splice of the old selection range
      var oldPrefix = oldText.slice(0, oldRange.index);
      var oldSuffix = oldText.slice(oldRange.index + oldRange.length);
      var prefixLength = oldPrefix.length;
      var suffixLength = oldSuffix.length;
      if (newLength < prefixLength + suffixLength) {
        break replaceRange;
      }
      var newPrefix = newText.slice(0, prefixLength);
      var newSuffix = newText.slice(newLength - suffixLength);
      if (oldPrefix !== newPrefix || oldSuffix !== newSuffix) {
        break replaceRange;
      }
      var oldMiddle = oldText.slice(prefixLength, oldLength - suffixLength);
      var newMiddle = newText.slice(prefixLength, newLength - suffixLength);
      return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldSuffix);
    }
  }

  return null;
}

function diff(text1, text2, cursor_pos) {
  // only pass fix_unicode=true at the top level, not when diff_main is
  // recursively invoked
  return diff_main(text1, text2, cursor_pos, true);
}

diff.INSERT = DIFF_INSERT;
diff.DELETE = DIFF_DELETE;
diff.EQUAL = DIFF_EQUAL;

module.exports = diff;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_clonedeep_1 = __importDefault(__webpack_require__(16));
var lodash_isequal_1 = __importDefault(__webpack_require__(30));
var AttributeMap;
(function (AttributeMap) {
    function compose(a, b, keepNull) {
        if (a === void 0) { a = {}; }
        if (b === void 0) { b = {}; }
        if (typeof a !== 'object') {
            a = {};
        }
        if (typeof b !== 'object') {
            b = {};
        }
        var attributes = lodash_clonedeep_1.default(b);
        if (!keepNull) {
            attributes = Object.keys(attributes).reduce(function (copy, key) {
                if (attributes[key] != null) {
                    copy[key] = attributes[key];
                }
                return copy;
            }, {});
        }
        for (var key in a) {
            if (a[key] !== undefined && b[key] === undefined) {
                attributes[key] = a[key];
            }
        }
        return Object.keys(attributes).length > 0 ? attributes : undefined;
    }
    AttributeMap.compose = compose;
    function diff(a, b) {
        if (a === void 0) { a = {}; }
        if (b === void 0) { b = {}; }
        if (typeof a !== 'object') {
            a = {};
        }
        if (typeof b !== 'object') {
            b = {};
        }
        var attributes = Object.keys(a)
            .concat(Object.keys(b))
            .reduce(function (attrs, key) {
            if (!lodash_isequal_1.default(a[key], b[key])) {
                attrs[key] = b[key] === undefined ? null : b[key];
            }
            return attrs;
        }, {});
        return Object.keys(attributes).length > 0 ? attributes : undefined;
    }
    AttributeMap.diff = diff;
    function invert(attr, base) {
        if (attr === void 0) { attr = {}; }
        if (base === void 0) { base = {}; }
        attr = attr || {};
        var baseInverted = Object.keys(base).reduce(function (memo, key) {
            if (base[key] !== attr[key] && attr[key] !== undefined) {
                memo[key] = base[key];
            }
            return memo;
        }, {});
        return Object.keys(attr).reduce(function (memo, key) {
            if (attr[key] !== base[key] && base[key] === undefined) {
                memo[key] = null;
            }
            return memo;
        }, baseInverted);
    }
    AttributeMap.invert = invert;
    function transform(a, b, priority) {
        if (priority === void 0) { priority = false; }
        if (typeof a !== 'object') {
            return b;
        }
        if (typeof b !== 'object') {
            return undefined;
        }
        if (!priority) {
            return b; // b simply overwrites us without priority
        }
        var attributes = Object.keys(b).reduce(function (attrs, key) {
            if (a[key] === undefined) {
                attrs[key] = b[key]; // null is a valid value
            }
            return attrs;
        }, {});
        return Object.keys(attributes).length > 0 ? attributes : undefined;
    }
    AttributeMap.transform = transform;
})(AttributeMap || (AttributeMap = {}));
exports.default = AttributeMap;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Op_1 = __importDefault(__webpack_require__(94));
var Iterator = /** @class */ (function () {
    function Iterator(ops) {
        this.ops = ops;
        this.index = 0;
        this.offset = 0;
    }
    Iterator.prototype.hasNext = function () {
        return this.peekLength() < Infinity;
    };
    Iterator.prototype.next = function (length) {
        if (!length) {
            length = Infinity;
        }
        var nextOp = this.ops[this.index];
        if (nextOp) {
            var offset = this.offset;
            var opLength = Op_1.default.length(nextOp);
            if (length >= opLength - offset) {
                length = opLength - offset;
                this.index += 1;
                this.offset = 0;
            }
            else {
                this.offset += length;
            }
            if (typeof nextOp.delete === 'number') {
                return { delete: length };
            }
            else {
                var retOp = {};
                if (nextOp.attributes) {
                    retOp.attributes = nextOp.attributes;
                }
                if (typeof nextOp.retain === 'number') {
                    retOp.retain = length;
                }
                else if (typeof nextOp.insert === 'string') {
                    retOp.insert = nextOp.insert.substr(offset, length);
                }
                else {
                    // offset should === 0, length should === 1
                    retOp.insert = nextOp.insert;
                }
                return retOp;
            }
        }
        else {
            return { retain: Infinity };
        }
    };
    Iterator.prototype.peek = function () {
        return this.ops[this.index];
    };
    Iterator.prototype.peekLength = function () {
        if (this.ops[this.index]) {
            // Should never return 0 if our index is being managed correctly
            return Op_1.default.length(this.ops[this.index]) - this.offset;
        }
        else {
            return Infinity;
        }
    };
    Iterator.prototype.peekType = function () {
        if (this.ops[this.index]) {
            if (typeof this.ops[this.index].delete === 'number') {
                return 'delete';
            }
            else if (typeof this.ops[this.index].retain === 'number') {
                return 'retain';
            }
            else {
                return 'insert';
            }
        }
        return 'retain';
    };
    Iterator.prototype.rest = function () {
        if (!this.hasNext()) {
            return [];
        }
        else if (this.offset === 0) {
            return this.ops.slice(this.index);
        }
        else {
            var offset = this.offset;
            var index = this.index;
            var next = this.next();
            var rest = this.ops.slice(this.index);
            this.offset = offset;
            this.index = index;
            return [next].concat(rest);
        }
    };
    return Iterator;
}());
exports.default = Iterator;


/***/ }),
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(25);


/***/ })
/******/ ])["default"];
});