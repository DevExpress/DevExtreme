/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { extend } from '@js/core/utils/extend';
import { isFunction } from '@js/core/utils/type';

type AllowedCharsFunction = (
  char: string, index?: number, fullText?: string,
) => boolean;

type AllowedChars = RegExp
  | AllowedCharsFunction
  | string[]
  | string;

export interface MaskRuleConfig {
  maskChar?: string;
  pattern?: string;
  allowedChars?: AllowedChars;
}

export interface HandlingArgs {
  value?: string;
  text?: string;
  start?: number;
  str?: string | undefined;
  length?: number;
  index?: number;
  fullText?: string;
}

const EMPTY_CHAR = ' ';

class BaseMaskRule {
  _value: string;

  maskChar?: string;

  _next?: BaseMaskRule;

  constructor(config: MaskRuleConfig) {
    this._value = EMPTY_CHAR;
    extend(this, config);
  }

  next(): BaseMaskRule;
  next(rule: BaseMaskRule): undefined;
  next(rule?: BaseMaskRule): BaseMaskRule | undefined {
    if (!arguments.length) {
      return this._next;
    }

    this._next = rule;

    return undefined;
  }

  _prepareHandlingArgs(
    args: HandlingArgs,
    config?: HandlingArgs,
  ): HandlingArgs {
    const configuration = config ?? {};
    const handlingProperty = Object.prototype.hasOwnProperty.call(args, 'value') ? 'value' : 'text';

    const finalConfig = {
      ...args,
      start: configuration.start ?? args.start,
      length: configuration.length ?? args.length,
      index: (args.index ?? 0) + 1,
    };

    finalConfig[handlingProperty] = configuration.str ?? args[handlingProperty];

    return finalConfig;
  }

  first(index: number): number {
    const newIndex = (index ?? 0) + 1;

    return this.next()?.first(newIndex);
  }

  isAccepted(caret?: number): boolean {
    return false;
  }

  adjustedCaret(
    caret: number,
    isForwardDirection: boolean,
    char: string,
  ): number {
    return isForwardDirection
      ? this._adjustedForward(caret, 0, char)
      : this._adjustedBackward(caret, 0, char);
  }

  _adjustedForward(
    caret: number,

    index: number,

    char?: string,
  // @ts-expect-error return type
  ): number {}

  _adjustedBackward(

    caret: number,

    index: number,

    char?: string,
  // @ts-expect-error return type
  ): number {}

  // @ts-expect-error return type

  isValid(args: HandlingArgs): boolean {}

  reset(): void {}

  clear(args?: HandlingArgs): void {}

  // @ts-expect-error return type
  text(): string {}

  // @ts-expect-error return type
  value(): string {}

  // @ts-expect-error return type
  rawValue(): string {}

  // @ts-expect-error return type

  handle(args: HandlingArgs): number {}
}

export class EmptyMaskRule extends BaseMaskRule {
  // @ts-expect-error params
  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  next() {}

  handle(): number {
    return 0;
  }

  text(): string {
    return '';
  }

  value(): string {
    return '';
  }

  first(): number {
    return 0;
  }

  rawValue(): string {
    return '';
  }

  adjustedCaret(): number {
    return 0;
  }

  isValid(): boolean {
    return true;
  }
}

export class MaskRule extends BaseMaskRule {
  allowedChars?: AllowedChars;

  _isAccepted?: boolean;

  text(): string {
    const isValueEqualEmptyChar = this._value === EMPTY_CHAR;
    const value = isValueEqualEmptyChar ? this.maskChar : this._value;
    const finalValue = `${value}${(this.next()?.text() ?? '')}`;

    return finalValue;
  }

  value(): string {
    const finalValue = `${this._value}${(this.next()?.value() ?? '')}`;

    return finalValue;
  }

  rawValue(): string {
    const finalValue = `${this._value}${(this.next()?.rawValue() ?? '')}`;

    return finalValue;
  }

  handle(args: HandlingArgs): number {
    const str = Object.prototype.hasOwnProperty.call(args, 'value') ? args.value : args.text;
    if (!str || !str.length || !args.length) {
      return 0;
    }

    if (args.start) {
      return this.next()?.handle(this._prepareHandlingArgs(args, { start: args.start - 1 }));
    }

    const char = str[0];
    const rest = str.substring(1);

    this._tryAcceptChar(char, args);

    const isAccepted = this._accepted();

    const rule = isAccepted ? this.next() : this;
    const handlingArgs = this._prepareHandlingArgs(args, { str: rest, length: args.length - 1 });

    const handledResult = rule?.handle(handlingArgs);
    const result = isAccepted ? handledResult + 1 : handledResult;

    return result;
  }

  clear(args: HandlingArgs): void {
    this._tryAcceptChar(EMPTY_CHAR, args);
    this.next()?.clear(this._prepareHandlingArgs(args));
  }

  reset(): void {
    this._accepted(false);
    this.next()?.reset();
  }

  _tryAcceptChar(char: string, args: HandlingArgs): void {
    this._accepted(false);

    if (!this._isAllowed(char, args)) {
      return;
    }

    const acceptedChar: string = char === EMPTY_CHAR ? this.maskChar ?? '' : char;

    const fullTextSubstring1 = args.fullText?.substring(0, args.index) ?? '';
    const fullTextSubstring2 = args.fullText?.substring((args.index ?? 0) + 1) ?? '';

    args.fullText = `${fullTextSubstring1}${acceptedChar}${fullTextSubstring2}`;

    this._accepted(true);
    this._value = char;
  }

  _accepted(): boolean;
  _accepted(value: boolean): void;
  // eslint-disable-next-line consistent-return
  _accepted(value?: boolean): boolean | void {
    if (!arguments.length) {
      return !!this._isAccepted;
    }

    this._isAccepted = !!value;
  }

  first(index: number): number {
    return this._value === EMPTY_CHAR
      ? index || 0
      : super.first(index);
  }

  _isAllowed(char: string, args?: HandlingArgs): boolean {
    if (char === EMPTY_CHAR) {
      return true;
    }

    return this._isValid(char, args);
  }

  _isValid(char: string, args?: HandlingArgs): boolean {
    const { allowedChars } = this;

    if (allowedChars instanceof RegExp) {
      return allowedChars.test(char);
    }

    if (isFunction(allowedChars)) {
      return allowedChars(char, args?.index, args?.fullText);
    }

    if (Array.isArray(allowedChars)) {
      return allowedChars.includes(char);
    }

    return allowedChars === char;
  }

  isAccepted(caret: number): boolean {
    return Boolean(caret === 0
      ? this._accepted()
      : this.next()?.isAccepted(caret - 1));
  }

  _adjustedForward(
    caret: number,
    index: number,
    char: string,
  ): number {
    if (index >= caret) {
      return index;
    }

    return this.next()?._adjustedForward(caret, index + 1, char) || index + 1;
  }

  _adjustedBackward(caret: number, index: number): number {
    if (index >= caret - 1) {
      return caret;
    }

    return this.next()?._adjustedBackward(caret, index + 1) || index + 1;
  }

  isValid(args: HandlingArgs): boolean {
    return this._isValid(this._value, args)
      && this.next()?.isValid(this._prepareHandlingArgs(args));
  }
}

export class StubMaskRule extends MaskRule {
  value(): string {
    return this.next()?.value();
  }

  handle(args: HandlingArgs): number {
    const hasValueProperty = Object.prototype.hasOwnProperty.call(args, 'value');
    const str = hasValueProperty ? args.value : args.text;

    if (!str?.length || !args.length) {
      return 0;
    }

    if (args.start || hasValueProperty) {
      const handlingArgs = this._prepareHandlingArgs(args, { start: args.start && args.start - 1 });
      return this.next()?.handle(handlingArgs);
    }

    const char = str[0];
    const rest = str.substring(1);

    this._tryAcceptChar(char);

    const nextArgs = this._isAllowed(char)
      ? this._prepareHandlingArgs(args, { str: rest, length: args.length - 1 })
      : args;

    return this.next()?.handle(nextArgs) ?? 0 + 1;
  }

  clear(args: HandlingArgs): void {
    this._accepted(false);
    this.next()?.clear(this._prepareHandlingArgs(args));
  }

  _tryAcceptChar(char: string): void {
    this._accepted(this._isValid(char));
  }

  _isValid(char: string): boolean {
    return char === this.maskChar;
  }

  first(index: number): number {
    const newIndex = index + 1;

    return this.next().first(newIndex);
  }

  _adjustedForward(
    caret: number,
    index: number,
    char: string,
  ): number {
    if (index >= caret && char === this.maskChar) {
      return index;
    }

    if (caret === (index + 1) && this._accepted()) {
      return caret;
    }
    return this.next()?._adjustedForward(caret, index + 1, char);
  }

  _adjustedBackward(caret: number, index: number): number {
    if (index >= caret - 1) {
      return 0;
    }

    return this.next()?._adjustedBackward(caret, index + 1);
  }

  isValid(args: HandlingArgs): boolean {
    return Boolean(this.next()?.isValid(this._prepareHandlingArgs(args)));
  }
}
