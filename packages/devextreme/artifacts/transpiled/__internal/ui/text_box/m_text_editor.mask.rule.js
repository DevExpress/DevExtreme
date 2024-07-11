"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StubMaskRule = exports.MaskRule = exports.EmptyMaskRule = void 0;
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
/* eslint-disable max-classes-per-file */

const EMPTY_CHAR = ' ';
class BaseMaskRule {
  constructor(config) {
    this._value = EMPTY_CHAR;
    (0, _extend.extend)(this, config);
  }
  next(rule) {
    if (!arguments.length) {
      return this._next;
    }
    this._next = rule;
  }
  _prepareHandlingArgs(args, config) {
    config = config || {};
    const handlingProperty = Object.prototype.hasOwnProperty.call(args, 'value') ? 'value' : 'text';
    args[handlingProperty] = config.str ?? args[handlingProperty];
    args.start = config.start ?? args.start;
    args.length = config.length ?? args.length;
    args.index += 1;
    return args;
  }
  first(index) {
    index = index || 0;
    return this.next().first(index + 1);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isAccepted(caret) {
    return false;
  }
  adjustedCaret(caret, isForwardDirection, char) {
    return isForwardDirection ? this._adjustedForward(caret, 0, char) : this._adjustedBackward(caret, 0, char);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _adjustedForward(caret, index, char) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _adjustedBackward(caret, index, char) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isValid(args) {}
  reset() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear(args) {}
  text() {}
  value() {}
  rawValue() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(args) {}
}
class EmptyMaskRule extends BaseMaskRule {
  next() {}
  handle() {
    return 0;
  }
  text() {
    return '';
  }
  value() {
    return '';
  }
  first() {
    return 0;
  }
  rawValue() {
    return '';
  }
  adjustedCaret() {
    return 0;
  }
  isValid() {
    return true;
  }
}
exports.EmptyMaskRule = EmptyMaskRule;
class MaskRule extends BaseMaskRule {
  text() {
    return (this._value !== EMPTY_CHAR ? this._value : this.maskChar) + this.next().text();
  }
  value() {
    return this._value + this.next().value();
  }
  rawValue() {
    return this._value + this.next().rawValue();
  }
  handle(args) {
    const str = Object.prototype.hasOwnProperty.call(args, 'value') ? args.value : args.text;
    if (!str || !str.length || !args.length) {
      return 0;
    }
    if (args.start) {
      return this.next().handle(this._prepareHandlingArgs(args, {
        start: args.start - 1
      }));
    }
    const char = str[0];
    const rest = str.substring(1);
    this._tryAcceptChar(char, args);
    return this._accepted() ? this.next().handle(this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    })) + 1 : this.handle(this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    }));
  }
  clear(args) {
    this._tryAcceptChar(EMPTY_CHAR, args);
    this.next().clear(this._prepareHandlingArgs(args));
  }
  reset() {
    this._accepted(false);
    this.next().reset();
  }
  _tryAcceptChar(char, args) {
    this._accepted(false);
    if (!this._isAllowed(char, args)) {
      return;
    }
    const acceptedChar = char === EMPTY_CHAR ? this.maskChar : char;
    args.fullText = args.fullText.substring(0, args.index) + acceptedChar + args.fullText.substring(args.index + 1);
    this._accepted(true);
    this._value = char;
  }
  // @ts-expect-error
  _accepted(value) {
    if (!arguments.length) {
      return !!this._isAccepted;
    }
    this._isAccepted = !!value;
  }
  first(index) {
    return this._value === EMPTY_CHAR ? index || 0 : super.first(index);
  }
  _isAllowed(char, args) {
    if (char === EMPTY_CHAR) {
      return true;
    }
    return this._isValid(char, args);
  }
  _isValid(char, args) {
    // @ts-expect-error
    const {
      allowedChars
    } = this;
    if (allowedChars instanceof RegExp) {
      return allowedChars.test(char);
    }
    if ((0, _type.isFunction)(allowedChars)) {
      return allowedChars(char, args.index, args.fullText);
    }
    if (Array.isArray(allowedChars)) {
      return allowedChars.includes(char);
    }
    return allowedChars === char;
  }
  isAccepted(caret) {
    return caret === 0 ? this._accepted() : this.next().isAccepted(caret - 1);
  }
  _adjustedForward(caret, index, char) {
    if (index >= caret) {
      return index;
    }
    return this.next()._adjustedForward(caret, index + 1, char) || index + 1;
  }
  _adjustedBackward(caret, index) {
    if (index >= caret - 1) {
      return caret;
    }
    return this.next()._adjustedBackward(caret, index + 1) || index + 1;
  }
  isValid(args) {
    return this._isValid(this._value, args) && this.next().isValid(this._prepareHandlingArgs(args));
  }
}
exports.MaskRule = MaskRule;
class StubMaskRule extends MaskRule {
  value() {
    return this.next().value();
  }
  handle(args) {
    const hasValueProperty = Object.prototype.hasOwnProperty.call(args, 'value');
    const str = hasValueProperty ? args.value : args.text;
    if (!str.length || !args.length) {
      return 0;
    }
    if (args.start || hasValueProperty) {
      return this.next().handle(this._prepareHandlingArgs(args, {
        start: args.start && args.start - 1
      }));
    }
    const char = str[0];
    const rest = str.substring(1);
    this._tryAcceptChar(char);
    const nextArgs = this._isAllowed(char) ? this._prepareHandlingArgs(args, {
      str: rest,
      length: args.length - 1
    }) : args;
    return this.next().handle(nextArgs) + 1;
  }
  clear(args) {
    this._accepted(false);
    this.next().clear(this._prepareHandlingArgs(args));
  }
  _tryAcceptChar(char) {
    this._accepted(this._isValid(char));
  }
  _isValid(char) {
    return char === this.maskChar;
  }
  first(index) {
    index = index || 0;
    return this.next().first(index + 1);
  }
  _adjustedForward(caret, index, char) {
    if (index >= caret && char === this.maskChar) {
      return index;
    }
    if (caret === index + 1 && this._accepted()) {
      return caret;
    }
    return this.next()._adjustedForward(caret, index + 1, char);
  }
  _adjustedBackward(caret, index) {
    if (index >= caret - 1) {
      return 0;
    }
    return this.next()._adjustedBackward(caret, index + 1);
  }
  isValid(args) {
    return this.next().isValid(this._prepareHandlingArgs(args));
  }
}
exports.StubMaskRule = StubMaskRule;