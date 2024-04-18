(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators')) :
  typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.ng = global.ng || {}, global.ng.forms = {}), global.ng.core, global.ng.common, global.rxjs, global.rxjs.operators));
})(this, (function (exports, i0, common, rxjs, operators) { 'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var i0__namespace = /*#__PURE__*/_interopNamespaceDefault(i0);

  /**
   * @license Angular v17.3.0
   * (c) 2010-2022 Google LLC. https://angular.io/
   * License: MIT
   */


  /**
   * Base class for all ControlValueAccessor classes defined in Forms package.
   * Contains common logic and utility functions.
   *
   * Note: this is an *internal-only* class and should not be extended or used directly in
   * applications code.
   */
  class BaseControlValueAccessor {
      constructor(_renderer, _elementRef) {
          this._renderer = _renderer;
          this._elementRef = _elementRef;
          /**
           * The registered callback function called when a change or input event occurs on the input
           * element.
           * @nodoc
           */
          this.onChange = (_) => { };
          /**
           * The registered callback function called when a blur event occurs on the input element.
           * @nodoc
           */
          this.onTouched = () => { };
      }
      /**
       * Helper method that sets a property on a target element using the current Renderer
       * implementation.
       * @nodoc
       */
      setProperty(key, value) {
          this._renderer.setProperty(this._elementRef.nativeElement, key, value);
      }
      /**
       * Registers a function called when the control is touched.
       * @nodoc
       */
      registerOnTouched(fn) {
          this.onTouched = fn;
      }
      /**
       * Registers a function called when the control value changes.
       * @nodoc
       */
      registerOnChange(fn) {
          this.onChange = fn;
      }
      /**
       * Sets the "disabled" property on the range input element.
       * @nodoc
       */
      setDisabledState(isDisabled) {
          this.setProperty('disabled', isDisabled);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: BaseControlValueAccessor, deps: [{ token: i0__namespace.Renderer2 }, { token: i0__namespace.ElementRef }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: BaseControlValueAccessor, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: BaseControlValueAccessor, decorators: [{
              type: i0.Directive
          }], ctorParameters: () => [{ type: i0__namespace.Renderer2 }, { type: i0__namespace.ElementRef }] });
  /**
   * Base class for all built-in ControlValueAccessor classes (except DefaultValueAccessor, which is
   * used in case no other CVAs can be found). We use this class to distinguish between default CVA,
   * built-in CVAs and custom CVAs, so that Forms logic can recognize built-in CVAs and treat custom
   * ones with higher priority (when both built-in and custom CVAs are present).
   *
   * Note: this is an *internal-only* class and should not be extended or used directly in
   * applications code.
   */
  class BuiltInControlValueAccessor extends BaseControlValueAccessor {
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: BuiltInControlValueAccessor, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: BuiltInControlValueAccessor, usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: BuiltInControlValueAccessor, decorators: [{
              type: i0.Directive
          }] });
  /**
   * Used to provide a `ControlValueAccessor` for form controls.
   *
   * See `DefaultValueAccessor` for how to implement one.
   *
   * @publicApi
   */
  const NG_VALUE_ACCESSOR = new i0.InjectionToken(ngDevMode ? 'NgValueAccessor' : '');

  const CHECKBOX_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: i0.forwardRef(() => CheckboxControlValueAccessor),
      multi: true,
  };
  /**
   * @description
   * A `ControlValueAccessor` for writing a value and listening to changes on a checkbox input
   * element.
   *
   * @usageNotes
   *
   * ### Using a checkbox with a reactive form.
   *
   * The following example shows how to use a checkbox with a reactive form.
   *
   * ```ts
   * const rememberLoginControl = new FormControl();
   * ```
   *
   * ```
   * <input type="checkbox" [formControl]="rememberLoginControl">
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class CheckboxControlValueAccessor extends BuiltInControlValueAccessor {
      /**
       * Sets the "checked" property on the input element.
       * @nodoc
       */
      writeValue(value) {
          this.setProperty('checked', value);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CheckboxControlValueAccessor, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]", host: { listeners: { "change": "onChange($event.target.checked)", "blur": "onTouched()" } }, providers: [CHECKBOX_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CheckboxControlValueAccessor, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
                      host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
                      providers: [CHECKBOX_VALUE_ACCESSOR]
                  }]
          }] });

  const DEFAULT_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: i0.forwardRef(() => DefaultValueAccessor),
      multi: true
  };
  /**
   * We must check whether the agent is Android because composition events
   * behave differently between iOS and Android.
   */
  function _isAndroid() {
      const userAgent = common.ɵgetDOM() ? common.ɵgetDOM().getUserAgent() : '';
      return /android (\d+)/.test(userAgent.toLowerCase());
  }
  /**
   * @description
   * Provide this token to control if form directives buffer IME input until
   * the "compositionend" event occurs.
   * @publicApi
   */
  const COMPOSITION_BUFFER_MODE = new i0.InjectionToken(ngDevMode ? 'CompositionEventMode' : '');
  /**
   * The default `ControlValueAccessor` for writing a value and listening to changes on input
   * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
   * `NgModel` directives.
   *
   * {@searchKeywords ngDefaultControl}
   *
   * @usageNotes
   *
   * ### Using the default value accessor
   *
   * The following example shows how to use an input element that activates the default value accessor
   * (in this case, a text field).
   *
   * ```ts
   * const firstNameControl = new FormControl();
   * ```
   *
   * ```
   * <input type="text" [formControl]="firstNameControl">
   * ```
   *
   * This value accessor is used by default for `<input type="text">` and `<textarea>` elements, but
   * you could also use it for custom components that have similar behavior and do not require special
   * processing. In order to attach the default value accessor to a custom element, add the
   * `ngDefaultControl` attribute as shown below.
   *
   * ```
   * <custom-input-component ngDefaultControl [(ngModel)]="value"></custom-input-component>
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class DefaultValueAccessor extends BaseControlValueAccessor {
      constructor(renderer, elementRef, _compositionMode) {
          super(renderer, elementRef);
          this._compositionMode = _compositionMode;
          /** Whether the user is creating a composition string (IME events). */
          this._composing = false;
          if (this._compositionMode == null) {
              this._compositionMode = !_isAndroid();
          }
      }
      /**
       * Sets the "value" property on the input element.
       * @nodoc
       */
      writeValue(value) {
          const normalizedValue = value == null ? '' : value;
          this.setProperty('value', normalizedValue);
      }
      /** @internal */
      _handleInput(value) {
          if (!this._compositionMode || (this._compositionMode && !this._composing)) {
              this.onChange(value);
          }
      }
      /** @internal */
      _compositionStart() {
          this._composing = true;
      }
      /** @internal */
      _compositionEnd(value) {
          this._composing = false;
          this._compositionMode && this.onChange(value);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: DefaultValueAccessor, deps: [{ token: i0__namespace.Renderer2 }, { token: i0__namespace.ElementRef }, { token: COMPOSITION_BUFFER_MODE, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]", host: { listeners: { "input": "$any(this)._handleInput($event.target.value)", "blur": "onTouched()", "compositionstart": "$any(this)._compositionStart()", "compositionend": "$any(this)._compositionEnd($event.target.value)" } }, providers: [DEFAULT_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: DefaultValueAccessor, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
                      // TODO: vsavkin replace the above selector with the one below it once
                      // https://github.com/angular/angular/issues/3011 is implemented
                      // selector: '[ngModel],[formControl],[formControlName]',
                      host: {
                          '(input)': '$any(this)._handleInput($event.target.value)',
                          '(blur)': 'onTouched()',
                          '(compositionstart)': '$any(this)._compositionStart()',
                          '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
                      },
                      providers: [DEFAULT_VALUE_ACCESSOR]
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.Renderer2 }, { type: i0__namespace.ElementRef }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [COMPOSITION_BUFFER_MODE]
                  }] }] });

  function isEmptyInputValue(value) {
      /**
       * Check if the object is a string or array before evaluating the length attribute.
       * This avoids falsely rejecting objects that contain a custom length attribute.
       * For example, the object {id: 1, length: 0, width: 0} should not be returned as empty.
       */
      return value == null ||
          ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
  }
  function hasValidLength(value) {
      // non-strict comparison is intentional, to check for both `null` and `undefined` values
      return value != null && typeof value.length === 'number';
  }
  /**
   * @description
   * An `InjectionToken` for registering additional synchronous validators used with
   * `AbstractControl`s.
   *
   * @see {@link NG_ASYNC_VALIDATORS}
   *
   * @usageNotes
   *
   * ### Providing a custom validator
   *
   * The following example registers a custom validator directive. Adding the validator to the
   * existing collection of validators requires the `multi: true` option.
   *
   * ```typescript
   * @Directive({
   *   selector: '[customValidator]',
   *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
   * })
   * class CustomValidatorDirective implements Validator {
   *   validate(control: AbstractControl): ValidationErrors | null {
   *     return { 'custom': true };
   *   }
   * }
   * ```
   *
   * @publicApi
   */
  const NG_VALIDATORS = new i0.InjectionToken(ngDevMode ? 'NgValidators' : '');
  /**
   * @description
   * An `InjectionToken` for registering additional asynchronous validators used with
   * `AbstractControl`s.
   *
   * @see {@link NG_VALIDATORS}
   *
   * @usageNotes
   *
   * ### Provide a custom async validator directive
   *
   * The following example implements the `AsyncValidator` interface to create an
   * async validator directive with a custom error key.
   *
   * ```typescript
   * @Directive({
   *   selector: '[customAsyncValidator]',
   *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
   * true}]
   * })
   * class CustomAsyncValidatorDirective implements AsyncValidator {
   *   validate(control: AbstractControl): Promise<ValidationErrors|null> {
   *     return Promise.resolve({'custom': true});
   *   }
   * }
   * ```
   *
   * @publicApi
   */
  const NG_ASYNC_VALIDATORS = new i0.InjectionToken(ngDevMode ? 'NgAsyncValidators' : '');
  /**
   * A regular expression that matches valid e-mail addresses.
   *
   * At a high level, this regexp matches e-mail addresses of the format `local-part@tld`, where:
   * - `local-part` consists of one or more of the allowed characters (alphanumeric and some
   *   punctuation symbols).
   * - `local-part` cannot begin or end with a period (`.`).
   * - `local-part` cannot be longer than 64 characters.
   * - `tld` consists of one or more `labels` separated by periods (`.`). For example `localhost` or
   *   `foo.com`.
   * - A `label` consists of one or more of the allowed characters (alphanumeric, dashes (`-`) and
   *   periods (`.`)).
   * - A `label` cannot begin or end with a dash (`-`) or a period (`.`).
   * - A `label` cannot be longer than 63 characters.
   * - The whole address cannot be longer than 254 characters.
   *
   * ## Implementation background
   *
   * This regexp was ported over from AngularJS (see there for git history):
   * https://github.com/angular/angular.js/blob/c133ef836/src/ng/directive/input.js#L27
   * It is based on the
   * [WHATWG version](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
   * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
   * lengths of different parts of the address). The main differences from the WHATWG version are:
   *   - Disallow `local-part` to begin or end with a period (`.`).
   *   - Disallow `local-part` length to exceed 64 characters.
   *   - Disallow total address length to exceed 254 characters.
   *
   * See [this commit](https://github.com/angular/angular.js/commit/f3f5cf72e) for more details.
   */
  const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  /**
   * @description
   * Provides a set of built-in validators that can be used by form controls.
   *
   * A validator is a function that processes a `FormControl` or collection of
   * controls and returns an error map or null. A null map means that validation has passed.
   *
   * @see [Form Validation](/guide/form-validation)
   *
   * @publicApi
   */
  class Validators {
      /**
       * @description
       * Validator that requires the control's value to be greater than or equal to the provided number.
       *
       * @usageNotes
       *
       * ### Validate against a minimum of 3
       *
       * ```typescript
       * const control = new FormControl(2, Validators.min(3));
       *
       * console.log(control.errors); // {min: {min: 3, actual: 2}}
       * ```
       *
       * @returns A validator function that returns an error map with the
       * `min` property if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static min(min) {
          return minValidator(min);
      }
      /**
       * @description
       * Validator that requires the control's value to be less than or equal to the provided number.
       *
       * @usageNotes
       *
       * ### Validate against a maximum of 15
       *
       * ```typescript
       * const control = new FormControl(16, Validators.max(15));
       *
       * console.log(control.errors); // {max: {max: 15, actual: 16}}
       * ```
       *
       * @returns A validator function that returns an error map with the
       * `max` property if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static max(max) {
          return maxValidator(max);
      }
      /**
       * @description
       * Validator that requires the control have a non-empty value.
       *
       * @usageNotes
       *
       * ### Validate that the field is non-empty
       *
       * ```typescript
       * const control = new FormControl('', Validators.required);
       *
       * console.log(control.errors); // {required: true}
       * ```
       *
       * @returns An error map with the `required` property
       * if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static required(control) {
          return requiredValidator(control);
      }
      /**
       * @description
       * Validator that requires the control's value be true. This validator is commonly
       * used for required checkboxes.
       *
       * @usageNotes
       *
       * ### Validate that the field value is true
       *
       * ```typescript
       * const control = new FormControl('some value', Validators.requiredTrue);
       *
       * console.log(control.errors); // {required: true}
       * ```
       *
       * @returns An error map that contains the `required` property
       * set to `true` if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static requiredTrue(control) {
          return requiredTrueValidator(control);
      }
      /**
       * @description
       * Validator that requires the control's value pass an email validation test.
       *
       * Tests the value using a [regular
       * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
       * pattern suitable for common use cases. The pattern is based on the definition of a valid email
       * address in the [WHATWG HTML
       * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
       * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
       * lengths of different parts of the address).
       *
       * The differences from the WHATWG version include:
       * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
       * - Disallow `local-part` to be longer than 64 characters.
       * - Disallow the whole address to be longer than 254 characters.
       *
       * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
       * validate the value against a different pattern.
       *
       * @usageNotes
       *
       * ### Validate that the field matches a valid email pattern
       *
       * ```typescript
       * const control = new FormControl('bad@', Validators.email);
       *
       * console.log(control.errors); // {email: true}
       * ```
       *
       * @returns An error map with the `email` property
       * if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static email(control) {
          return emailValidator(control);
      }
      /**
       * @description
       * Validator that requires the length of the control's value to be greater than or equal
       * to the provided minimum length. This validator is also provided by default if you use the
       * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
       * only for types that have a numeric `length` property, such as strings or arrays. The
       * `minLength` validator logic is also not invoked for values when their `length` property is 0
       * (for example in case of an empty string or an empty array), to support optional controls. You
       * can use the standard `required` validator if empty values should not be considered valid.
       *
       * @usageNotes
       *
       * ### Validate that the field has a minimum of 3 characters
       *
       * ```typescript
       * const control = new FormControl('ng', Validators.minLength(3));
       *
       * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
       * ```
       *
       * ```html
       * <input minlength="5">
       * ```
       *
       * @returns A validator function that returns an error map with the
       * `minlength` property if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static minLength(minLength) {
          return minLengthValidator(minLength);
      }
      /**
       * @description
       * Validator that requires the length of the control's value to be less than or equal
       * to the provided maximum length. This validator is also provided by default if you use the
       * the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
       * only for types that have a numeric `length` property, such as strings or arrays.
       *
       * @usageNotes
       *
       * ### Validate that the field has maximum of 5 characters
       *
       * ```typescript
       * const control = new FormControl('Angular', Validators.maxLength(5));
       *
       * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
       * ```
       *
       * ```html
       * <input maxlength="5">
       * ```
       *
       * @returns A validator function that returns an error map with the
       * `maxlength` property if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static maxLength(maxLength) {
          return maxLengthValidator(maxLength);
      }
      /**
       * @description
       * Validator that requires the control's value to match a regex pattern. This validator is also
       * provided by default if you use the HTML5 `pattern` attribute.
       *
       * @usageNotes
       *
       * ### Validate that the field only contains letters or spaces
       *
       * ```typescript
       * const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
       *
       * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
       * ```
       *
       * ```html
       * <input pattern="[a-zA-Z ]*">
       * ```
       *
       * ### Pattern matching with the global or sticky flag
       *
       * `RegExp` objects created with the `g` or `y` flags that are passed into `Validators.pattern`
       * can produce different results on the same input when validations are run consecutively. This is
       * due to how the behavior of `RegExp.prototype.test` is
       * specified in [ECMA-262](https://tc39.es/ecma262/#sec-regexpbuiltinexec)
       * (`RegExp` preserves the index of the last match when the global or sticky flag is used).
       * Due to this behavior, it is recommended that when using
       * `Validators.pattern` you **do not** pass in a `RegExp` object with either the global or sticky
       * flag enabled.
       *
       * ```typescript
       * // Not recommended (since the `g` flag is used)
       * const controlOne = new FormControl('1', Validators.pattern(/foo/g));
       *
       * // Good
       * const controlTwo = new FormControl('1', Validators.pattern(/foo/));
       * ```
       *
       * @param pattern A regular expression to be used as is to test the values, or a string.
       * If a string is passed, the `^` character is prepended and the `$` character is
       * appended to the provided string (if not already present), and the resulting regular
       * expression is used to test the values.
       *
       * @returns A validator function that returns an error map with the
       * `pattern` property if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static pattern(pattern) {
          return patternValidator(pattern);
      }
      /**
       * @description
       * Validator that performs no operation.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static nullValidator(control) {
          return nullValidator();
      }
      static compose(validators) {
          return compose(validators);
      }
      /**
       * @description
       * Compose multiple async validators into a single function that returns the union
       * of the individual error objects for the provided control.
       *
       * @returns A validator function that returns an error map with the
       * merged error objects of the async validators if the validation check fails, otherwise `null`.
       *
       * @see {@link updateValueAndValidity()}
       *
       */
      static composeAsync(validators) {
          return composeAsync(validators);
      }
  }
  /**
   * Validator that requires the control's value to be greater than or equal to the provided number.
   * See `Validators.min` for additional information.
   */
  function minValidator(min) {
      return (control) => {
          if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
              return null; // don't validate empty values to allow optional controls
          }
          const value = parseFloat(control.value);
          // Controls with NaN values after parsing should be treated as not having a
          // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
          return !isNaN(value) && value < min ? { 'min': { 'min': min, 'actual': control.value } } : null;
      };
  }
  /**
   * Validator that requires the control's value to be less than or equal to the provided number.
   * See `Validators.max` for additional information.
   */
  function maxValidator(max) {
      return (control) => {
          if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
              return null; // don't validate empty values to allow optional controls
          }
          const value = parseFloat(control.value);
          // Controls with NaN values after parsing should be treated as not having a
          // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
          return !isNaN(value) && value > max ? { 'max': { 'max': max, 'actual': control.value } } : null;
      };
  }
  /**
   * Validator that requires the control have a non-empty value.
   * See `Validators.required` for additional information.
   */
  function requiredValidator(control) {
      return isEmptyInputValue(control.value) ? { 'required': true } : null;
  }
  /**
   * Validator that requires the control's value be true. This validator is commonly
   * used for required checkboxes.
   * See `Validators.requiredTrue` for additional information.
   */
  function requiredTrueValidator(control) {
      return control.value === true ? null : { 'required': true };
  }
  /**
   * Validator that requires the control's value pass an email validation test.
   * See `Validators.email` for additional information.
   */
  function emailValidator(control) {
      if (isEmptyInputValue(control.value)) {
          return null; // don't validate empty values to allow optional controls
      }
      return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
  }
  /**
   * Validator that requires the length of the control's value to be greater than or equal
   * to the provided minimum length. See `Validators.minLength` for additional information.
   */
  function minLengthValidator(minLength) {
      return (control) => {
          if (isEmptyInputValue(control.value) || !hasValidLength(control.value)) {
              // don't validate empty values to allow optional controls
              // don't validate values without `length` property
              return null;
          }
          return control.value.length < minLength ?
              { 'minlength': { 'requiredLength': minLength, 'actualLength': control.value.length } } :
              null;
      };
  }
  /**
   * Validator that requires the length of the control's value to be less than or equal
   * to the provided maximum length. See `Validators.maxLength` for additional information.
   */
  function maxLengthValidator(maxLength) {
      return (control) => {
          return hasValidLength(control.value) && control.value.length > maxLength ?
              { 'maxlength': { 'requiredLength': maxLength, 'actualLength': control.value.length } } :
              null;
      };
  }
  /**
   * Validator that requires the control's value to match a regex pattern.
   * See `Validators.pattern` for additional information.
   */
  function patternValidator(pattern) {
      if (!pattern)
          return nullValidator;
      let regex;
      let regexStr;
      if (typeof pattern === 'string') {
          regexStr = '';
          if (pattern.charAt(0) !== '^')
              regexStr += '^';
          regexStr += pattern;
          if (pattern.charAt(pattern.length - 1) !== '$')
              regexStr += '$';
          regex = new RegExp(regexStr);
      }
      else {
          regexStr = pattern.toString();
          regex = pattern;
      }
      return (control) => {
          if (isEmptyInputValue(control.value)) {
              return null; // don't validate empty values to allow optional controls
          }
          const value = control.value;
          return regex.test(value) ? null :
              { 'pattern': { 'requiredPattern': regexStr, 'actualValue': value } };
      };
  }
  /**
   * Function that has `ValidatorFn` shape, but performs no operation.
   */
  function nullValidator(control) {
      return null;
  }
  function isPresent(o) {
      return o != null;
  }
  function toObservable(value) {
      const obs = i0.ɵisPromise(value) ? rxjs.from(value) : value;
      if ((typeof ngDevMode === 'undefined' || ngDevMode) && !(i0.ɵisSubscribable(obs))) {
          let errorMessage = `Expected async validator to return Promise or Observable.`;
          // A synchronous validator will return object or null.
          if (typeof value === 'object') {
              errorMessage +=
                  ' Are you using a synchronous validator where an async validator is expected?';
          }
          throw new i0.ɵRuntimeError(-1101 /* RuntimeErrorCode.WRONG_VALIDATOR_RETURN_TYPE */, errorMessage);
      }
      return obs;
  }
  function mergeErrors(arrayOfErrors) {
      let res = {};
      arrayOfErrors.forEach((errors) => {
          res = errors != null ? { ...res, ...errors } : res;
      });
      return Object.keys(res).length === 0 ? null : res;
  }
  function executeValidators(control, validators) {
      return validators.map(validator => validator(control));
  }
  function isValidatorFn(validator) {
      return !validator.validate;
  }
  /**
   * Given the list of validators that may contain both functions as well as classes, return the list
   * of validator functions (convert validator classes into validator functions). This is needed to
   * have consistent structure in validators list before composing them.
   *
   * @param validators The set of validators that may contain validators both in plain function form
   *     as well as represented as a validator class.
   */
  function normalizeValidators(validators) {
      return validators.map(validator => {
          return isValidatorFn(validator) ?
              validator :
              ((c) => validator.validate(c));
      });
  }
  /**
   * Merges synchronous validators into a single validator function.
   * See `Validators.compose` for additional information.
   */
  function compose(validators) {
      if (!validators)
          return null;
      const presentValidators = validators.filter(isPresent);
      if (presentValidators.length == 0)
          return null;
      return function (control) {
          return mergeErrors(executeValidators(control, presentValidators));
      };
  }
  /**
   * Accepts a list of validators of different possible shapes (`Validator` and `ValidatorFn`),
   * normalizes the list (converts everything to `ValidatorFn`) and merges them into a single
   * validator function.
   */
  function composeValidators(validators) {
      return validators != null ? compose(normalizeValidators(validators)) : null;
  }
  /**
   * Merges asynchronous validators into a single validator function.
   * See `Validators.composeAsync` for additional information.
   */
  function composeAsync(validators) {
      if (!validators)
          return null;
      const presentValidators = validators.filter(isPresent);
      if (presentValidators.length == 0)
          return null;
      return function (control) {
          const observables = executeValidators(control, presentValidators).map(toObservable);
          return rxjs.forkJoin(observables).pipe(operators.map(mergeErrors));
      };
  }
  /**
   * Accepts a list of async validators of different possible shapes (`AsyncValidator` and
   * `AsyncValidatorFn`), normalizes the list (converts everything to `AsyncValidatorFn`) and merges
   * them into a single validator function.
   */
  function composeAsyncValidators(validators) {
      return validators != null ? composeAsync(normalizeValidators(validators)) :
          null;
  }
  /**
   * Merges raw control validators with a given directive validator and returns the combined list of
   * validators as an array.
   */
  function mergeValidators(controlValidators, dirValidator) {
      if (controlValidators === null)
          return [dirValidator];
      return Array.isArray(controlValidators) ? [...controlValidators, dirValidator] :
          [controlValidators, dirValidator];
  }
  /**
   * Retrieves the list of raw synchronous validators attached to a given control.
   */
  function getControlValidators(control) {
      return control._rawValidators;
  }
  /**
   * Retrieves the list of raw asynchronous validators attached to a given control.
   */
  function getControlAsyncValidators(control) {
      return control._rawAsyncValidators;
  }
  /**
   * Accepts a singleton validator, an array, or null, and returns an array type with the provided
   * validators.
   *
   * @param validators A validator, validators, or null.
   * @returns A validators array.
   */
  function makeValidatorsArray(validators) {
      if (!validators)
          return [];
      return Array.isArray(validators) ? validators : [validators];
  }
  /**
   * Determines whether a validator or validators array has a given validator.
   *
   * @param validators The validator or validators to compare against.
   * @param validator The validator to check.
   * @returns Whether the validator is present.
   */
  function hasValidator(validators, validator) {
      return Array.isArray(validators) ? validators.includes(validator) : validators === validator;
  }
  /**
   * Combines two arrays of validators into one. If duplicates are provided, only one will be added.
   *
   * @param validators The new validators.
   * @param currentValidators The base array of current validators.
   * @returns An array of validators.
   */
  function addValidators(validators, currentValidators) {
      const current = makeValidatorsArray(currentValidators);
      const validatorsToAdd = makeValidatorsArray(validators);
      validatorsToAdd.forEach((v) => {
          // Note: if there are duplicate entries in the new validators array,
          // only the first one would be added to the current list of validators.
          // Duplicate ones would be ignored since `hasValidator` would detect
          // the presence of a validator function and we update the current list in place.
          if (!hasValidator(current, v)) {
              current.push(v);
          }
      });
      return current;
  }
  function removeValidators(validators, currentValidators) {
      return makeValidatorsArray(currentValidators).filter(v => !hasValidator(validators, v));
  }

  /**
   * @description
   * Base class for control directives.
   *
   * This class is only used internally in the `ReactiveFormsModule` and the `FormsModule`.
   *
   * @publicApi
   */
  class AbstractControlDirective {
      constructor() {
          /**
           * Set of synchronous validators as they were provided while calling `setValidators` function.
           * @internal
           */
          this._rawValidators = [];
          /**
           * Set of asynchronous validators as they were provided while calling `setAsyncValidators`
           * function.
           * @internal
           */
          this._rawAsyncValidators = [];
          /*
           * The set of callbacks to be invoked when directive instance is being destroyed.
           */
          this._onDestroyCallbacks = [];
      }
      /**
       * @description
       * Reports the value of the control if it is present, otherwise null.
       */
      get value() {
          return this.control ? this.control.value : null;
      }
      /**
       * @description
       * Reports whether the control is valid. A control is considered valid if no
       * validation errors exist with the current value.
       * If the control is not present, null is returned.
       */
      get valid() {
          return this.control ? this.control.valid : null;
      }
      /**
       * @description
       * Reports whether the control is invalid, meaning that an error exists in the input value.
       * If the control is not present, null is returned.
       */
      get invalid() {
          return this.control ? this.control.invalid : null;
      }
      /**
       * @description
       * Reports whether a control is pending, meaning that async validation is occurring and
       * errors are not yet available for the input value. If the control is not present, null is
       * returned.
       */
      get pending() {
          return this.control ? this.control.pending : null;
      }
      /**
       * @description
       * Reports whether the control is disabled, meaning that the control is disabled
       * in the UI and is exempt from validation checks and excluded from aggregate
       * values of ancestor controls. If the control is not present, null is returned.
       */
      get disabled() {
          return this.control ? this.control.disabled : null;
      }
      /**
       * @description
       * Reports whether the control is enabled, meaning that the control is included in ancestor
       * calculations of validity or value. If the control is not present, null is returned.
       */
      get enabled() {
          return this.control ? this.control.enabled : null;
      }
      /**
       * @description
       * Reports the control's validation errors. If the control is not present, null is returned.
       */
      get errors() {
          return this.control ? this.control.errors : null;
      }
      /**
       * @description
       * Reports whether the control is pristine, meaning that the user has not yet changed
       * the value in the UI. If the control is not present, null is returned.
       */
      get pristine() {
          return this.control ? this.control.pristine : null;
      }
      /**
       * @description
       * Reports whether the control is dirty, meaning that the user has changed
       * the value in the UI. If the control is not present, null is returned.
       */
      get dirty() {
          return this.control ? this.control.dirty : null;
      }
      /**
       * @description
       * Reports whether the control is touched, meaning that the user has triggered
       * a `blur` event on it. If the control is not present, null is returned.
       */
      get touched() {
          return this.control ? this.control.touched : null;
      }
      /**
       * @description
       * Reports the validation status of the control. Possible values include:
       * 'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
       * If the control is not present, null is returned.
       */
      get status() {
          return this.control ? this.control.status : null;
      }
      /**
       * @description
       * Reports whether the control is untouched, meaning that the user has not yet triggered
       * a `blur` event on it. If the control is not present, null is returned.
       */
      get untouched() {
          return this.control ? this.control.untouched : null;
      }
      /**
       * @description
       * Returns a multicasting observable that emits a validation status whenever it is
       * calculated for the control. If the control is not present, null is returned.
       */
      get statusChanges() {
          return this.control ? this.control.statusChanges : null;
      }
      /**
       * @description
       * Returns a multicasting observable of value changes for the control that emits every time the
       * value of the control changes in the UI or programmatically.
       * If the control is not present, null is returned.
       */
      get valueChanges() {
          return this.control ? this.control.valueChanges : null;
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
          return null;
      }
      /**
       * Sets synchronous validators for this directive.
       * @internal
       */
      _setValidators(validators) {
          this._rawValidators = validators || [];
          this._composedValidatorFn = composeValidators(this._rawValidators);
      }
      /**
       * Sets asynchronous validators for this directive.
       * @internal
       */
      _setAsyncValidators(validators) {
          this._rawAsyncValidators = validators || [];
          this._composedAsyncValidatorFn = composeAsyncValidators(this._rawAsyncValidators);
      }
      /**
       * @description
       * Synchronous validator function composed of all the synchronous validators registered with this
       * directive.
       */
      get validator() {
          return this._composedValidatorFn || null;
      }
      /**
       * @description
       * Asynchronous validator function composed of all the asynchronous validators registered with
       * this directive.
       */
      get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
      }
      /**
       * Internal function to register callbacks that should be invoked
       * when directive instance is being destroyed.
       * @internal
       */
      _registerOnDestroy(fn) {
          this._onDestroyCallbacks.push(fn);
      }
      /**
       * Internal function to invoke all registered "on destroy" callbacks.
       * Note: calling this function also clears the list of callbacks.
       * @internal
       */
      _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach(fn => fn());
          this._onDestroyCallbacks = [];
      }
      /**
       * @description
       * Resets the control with the provided value if the control is present.
       */
      reset(value = undefined) {
          if (this.control)
              this.control.reset(value);
      }
      /**
       * @description
       * Reports whether the control with the given path has the error specified.
       *
       * @param errorCode The code of the error to check
       * @param path A list of control names that designates how to move from the current control
       * to the control that should be queried for errors.
       *
       * @usageNotes
       * For example, for the following `FormGroup`:
       *
       * ```
       * form = new FormGroup({
       *   address: new FormGroup({ street: new FormControl() })
       * });
       * ```
       *
       * The path to the 'street' control from the root form would be 'address' -> 'street'.
       *
       * It can be provided to this method in one of two formats:
       *
       * 1. An array of string control names, e.g. `['address', 'street']`
       * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
       *
       * If no path is given, this method checks for the error on the current control.
       *
       * @returns whether the given error is present in the control at the given path.
       *
       * If the control is not present, false is returned.
       */
      hasError(errorCode, path) {
          return this.control ? this.control.hasError(errorCode, path) : false;
      }
      /**
       * @description
       * Reports error data for the control with the given path.
       *
       * @param errorCode The code of the error to check
       * @param path A list of control names that designates how to move from the current control
       * to the control that should be queried for errors.
       *
       * @usageNotes
       * For example, for the following `FormGroup`:
       *
       * ```
       * form = new FormGroup({
       *   address: new FormGroup({ street: new FormControl() })
       * });
       * ```
       *
       * The path to the 'street' control from the root form would be 'address' -> 'street'.
       *
       * It can be provided to this method in one of two formats:
       *
       * 1. An array of string control names, e.g. `['address', 'street']`
       * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
       *
       * @returns error data for that particular error. If the control or error is not present,
       * null is returned.
       */
      getError(errorCode, path) {
          return this.control ? this.control.getError(errorCode, path) : null;
      }
  }

  /**
   * @description
   * A base class for directives that contain multiple registered instances of `NgControl`.
   * Only used by the forms module.
   *
   * @publicApi
   */
  class ControlContainer extends AbstractControlDirective {
      /**
       * @description
       * The top-level form directive for the control.
       */
      get formDirective() {
          return null;
      }
      /**
       * @description
       * The path to this group.
       */
      get path() {
          return null;
      }
  }

  /**
   * @description
   * A base class that all `FormControl`-based directives extend. It binds a `FormControl`
   * object to a DOM element.
   *
   * @publicApi
   */
  class NgControl extends AbstractControlDirective {
      constructor() {
          super(...arguments);
          /**
           * @description
           * The parent form for the control.
           *
           * @internal
           */
          this._parent = null;
          /**
           * @description
           * The name for the control
           */
          this.name = null;
          /**
           * @description
           * The value accessor for the control
           */
          this.valueAccessor = null;
      }
  }

  // DO NOT REFACTOR!
  // Each status is represented by a separate function to make sure that
  // advanced Closure Compiler optimizations related to property renaming
  // can work correctly.
  class AbstractControlStatus {
      constructor(cd) {
          this._cd = cd;
      }
      get isTouched() {
          return !!this._cd?.control?.touched;
      }
      get isUntouched() {
          return !!this._cd?.control?.untouched;
      }
      get isPristine() {
          return !!this._cd?.control?.pristine;
      }
      get isDirty() {
          return !!this._cd?.control?.dirty;
      }
      get isValid() {
          return !!this._cd?.control?.valid;
      }
      get isInvalid() {
          return !!this._cd?.control?.invalid;
      }
      get isPending() {
          return !!this._cd?.control?.pending;
      }
      get isSubmitted() {
          // We check for the `submitted` field from `NgForm` and `FormGroupDirective` classes, but
          // we avoid instanceof checks to prevent non-tree-shakable references to those types.
          return !!this._cd?.submitted;
      }
  }
  const ngControlStatusHost = {
      '[class.ng-untouched]': 'isUntouched',
      '[class.ng-touched]': 'isTouched',
      '[class.ng-pristine]': 'isPristine',
      '[class.ng-dirty]': 'isDirty',
      '[class.ng-valid]': 'isValid',
      '[class.ng-invalid]': 'isInvalid',
      '[class.ng-pending]': 'isPending',
  };
  const ngGroupStatusHost = {
      ...ngControlStatusHost,
      '[class.ng-submitted]': 'isSubmitted',
  };
  /**
   * @description
   * Directive automatically applied to Angular form controls that sets CSS classes
   * based on control status.
   *
   * @usageNotes
   *
   * ### CSS classes applied
   *
   * The following classes are applied as the properties become true:
   *
   * * ng-valid
   * * ng-invalid
   * * ng-pending
   * * ng-pristine
   * * ng-dirty
   * * ng-untouched
   * * ng-touched
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class NgControlStatus extends AbstractControlStatus {
      constructor(cd) {
          super(cd);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgControlStatus, deps: [{ token: NgControl, self: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgControlStatus, selector: "[formControlName],[ngModel],[formControl]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending" } }, usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgControlStatus, decorators: [{
              type: i0.Directive,
              args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost }]
          }], ctorParameters: () => [{ type: NgControl, decorators: [{
                      type: i0.Self
                  }] }] });
  /**
   * @description
   * Directive automatically applied to Angular form groups that sets CSS classes
   * based on control status (valid/invalid/dirty/etc). On groups, this includes the additional
   * class ng-submitted.
   *
   * @see {@link NgControlStatus}
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class NgControlStatusGroup extends AbstractControlStatus {
      constructor(cd) {
          super(cd);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgControlStatusGroup, deps: [{ token: ControlContainer, optional: true, self: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending", "class.ng-submitted": "isSubmitted" } }, usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgControlStatusGroup, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                      host: ngGroupStatusHost
                  }]
          }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }] }] });

  const formControlNameExample = `
  <div [formGroup]="myGroup">
    <input formControlName="firstName">
  </div>

  In your class:

  this.myGroup = new FormGroup({
      firstName: new FormControl()
  });`;
  const formGroupNameExample = `
  <div [formGroup]="myGroup">
      <div formGroupName="person">
        <input formControlName="firstName">
      </div>
  </div>

  In your class:

  this.myGroup = new FormGroup({
      person: new FormGroup({ firstName: new FormControl() })
  });`;
  const formArrayNameExample = `
  <div [formGroup]="myGroup">
    <div formArrayName="cities">
      <div *ngFor="let city of cityArray.controls; index as i">
        <input [formControlName]="i">
      </div>
    </div>
  </div>

  In your class:

  this.cityArray = new FormArray([new FormControl('SF')]);
  this.myGroup = new FormGroup({
    cities: this.cityArray
  });`;
  const ngModelGroupExample = `
  <form>
      <div ngModelGroup="person">
        <input [(ngModel)]="person.name" name="firstName">
      </div>
  </form>`;
  const ngModelWithFormGroupExample = `
  <div [formGroup]="myGroup">
      <input formControlName="firstName">
      <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">
  </div>
`;

  function controlParentException() {
      return new i0.ɵRuntimeError(1050 /* RuntimeErrorCode.FORM_CONTROL_NAME_MISSING_PARENT */, `formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

    Example:

    ${formControlNameExample}`);
  }
  function ngModelGroupException() {
      return new i0.ɵRuntimeError(1051 /* RuntimeErrorCode.FORM_CONTROL_NAME_INSIDE_MODEL_GROUP */, `formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents
      that also have a "form" prefix: formGroupName, formArrayName, or formGroup.

      Option 1:  Update the parent to be formGroupName (reactive form strategy)

      ${formGroupNameExample}

      Option 2: Use ngModel instead of formControlName (template-driven strategy)

      ${ngModelGroupExample}`);
  }
  function missingFormException() {
      return new i0.ɵRuntimeError(1052 /* RuntimeErrorCode.FORM_GROUP_MISSING_INSTANCE */, `formGroup expects a FormGroup instance. Please pass one in.

      Example:

      ${formControlNameExample}`);
  }
  function groupParentException() {
      return new i0.ɵRuntimeError(1053 /* RuntimeErrorCode.FORM_GROUP_NAME_MISSING_PARENT */, `formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup
    directive and pass it an existing FormGroup instance (you can create one in your class).

    Example:

    ${formGroupNameExample}`);
  }
  function arrayParentException() {
      return new i0.ɵRuntimeError(1054 /* RuntimeErrorCode.FORM_ARRAY_NAME_MISSING_PARENT */, `formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      Example:

      ${formArrayNameExample}`);
  }
  const disabledAttrWarning = `
  It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
  when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
  you. We recommend using this approach to avoid 'changed after checked' errors.

  Example:
  // Specify the \`disabled\` property at control creation time:
  form = new FormGroup({
    first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    last: new FormControl('Drew', Validators.required)
  });

  // Controls can also be enabled/disabled after creation:
  form.get('first')?.enable();
  form.get('last')?.disable();
`;
  const asyncValidatorsDroppedWithOptsWarning = `
  It looks like you're constructing using a FormControl with both an options argument and an
  async validators argument. Mixing these arguments will cause your async validators to be dropped.
  You should either put all your validators in the options object, or in separate validators
  arguments. For example:

  // Using validators arguments
  fc = new FormControl(42, Validators.required, myAsyncValidator);

  // Using AbstractControlOptions
  fc = new FormControl(42, {validators: Validators.required, asyncValidators: myAV});

  // Do NOT mix them: async validators will be dropped!
  fc = new FormControl(42, {validators: Validators.required}, /* Oops! */ myAsyncValidator);
`;
  function ngModelWarning(directiveName) {
      return `
  It looks like you're using ngModel on the same form field as ${directiveName}.
  Support for using the ngModel input property and ngModelChange event with
  reactive form directives has been deprecated in Angular v6 and will be removed
  in a future version of Angular.

  For more information on this, see our API docs here:
  https://angular.io/api/forms/${directiveName === 'formControl' ? 'FormControlDirective' : 'FormControlName'}#use-with-ngmodel
  `;
  }
  function describeKey(isFormGroup, key) {
      return isFormGroup ? `with name: '${key}'` : `at index: ${key}`;
  }
  function noControlsError(isFormGroup) {
      return `
    There are no form controls registered with this ${isFormGroup ? 'group' : 'array'} yet. If you're using ngModel,
    you may want to check next tick (e.g. use setTimeout).
  `;
  }
  function missingControlError(isFormGroup, key) {
      return `Cannot find form control ${describeKey(isFormGroup, key)}`;
  }
  function missingControlValueError(isFormGroup, key) {
      return `Must supply a value for form control ${describeKey(isFormGroup, key)}`;
  }

  /**
   * Reports that a control is valid, meaning that no errors exist in the input value.
   *
   * @see {@link status}
   */
  const VALID = 'VALID';
  /**
   * Reports that a control is invalid, meaning that an error exists in the input value.
   *
   * @see {@link status}
   */
  const INVALID = 'INVALID';
  /**
   * Reports that a control is pending, meaning that async validation is occurring and
   * errors are not yet available for the input value.
   *
   * @see {@link markAsPending}
   * @see {@link status}
   */
  const PENDING = 'PENDING';
  /**
   * Reports that a control is disabled, meaning that the control is exempt from ancestor
   * calculations of validity or value.
   *
   * @see {@link markAsDisabled}
   * @see {@link status}
   */
  const DISABLED = 'DISABLED';
  /**
   * Gets validators from either an options object or given validators.
   */
  function pickValidators(validatorOrOpts) {
      return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
  }
  /**
   * Creates validator function by combining provided validators.
   */
  function coerceToValidator(validator) {
      return Array.isArray(validator) ? composeValidators(validator) : validator || null;
  }
  /**
   * Gets async validators from either an options object or given validators.
   */
  function pickAsyncValidators(asyncValidator, validatorOrOpts) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
          if (isOptionsObj(validatorOrOpts) && asyncValidator) {
              console.warn(asyncValidatorsDroppedWithOptsWarning);
          }
      }
      return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
  }
  /**
   * Creates async validator function by combining provided async validators.
   */
  function coerceToAsyncValidator(asyncValidator) {
      return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) :
          asyncValidator || null;
  }
  function isOptionsObj(validatorOrOpts) {
      return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
          typeof validatorOrOpts === 'object';
  }
  function assertControlPresent(parent, isGroup, key) {
      const controls = parent.controls;
      const collection = isGroup ? Object.keys(controls) : controls;
      if (!collection.length) {
          throw new i0.ɵRuntimeError(1000 /* RuntimeErrorCode.NO_CONTROLS */, (typeof ngDevMode === 'undefined' || ngDevMode) ? noControlsError(isGroup) : '');
      }
      if (!controls[key]) {
          throw new i0.ɵRuntimeError(1001 /* RuntimeErrorCode.MISSING_CONTROL */, (typeof ngDevMode === 'undefined' || ngDevMode) ? missingControlError(isGroup, key) : '');
      }
  }
  function assertAllValuesPresent(control, isGroup, value) {
      control._forEachChild((_, key) => {
          if (value[key] === undefined) {
              throw new i0.ɵRuntimeError(1002 /* RuntimeErrorCode.MISSING_CONTROL_VALUE */, (typeof ngDevMode === 'undefined' || ngDevMode) ? missingControlValueError(isGroup, key) :
                  '');
          }
      });
  }
  // clang-format on
  /**
   * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
   *
   * It provides some of the shared behavior that all controls and groups of controls have, like
   * running validators, calculating status, and resetting state. It also defines the properties
   * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
   * instantiated directly.
   *
   * The first type parameter TValue represents the value type of the control (`control.value`).
   * The optional type parameter TRawValue  represents the raw value type (`control.getRawValue()`).
   *
   * @see [Forms Guide](/guide/forms)
   * @see [Reactive Forms Guide](/guide/reactive-forms)
   * @see [Dynamic Forms Guide](/guide/dynamic-form)
   *
   * @publicApi
   */
  class AbstractControl {
      /**
       * Initialize the AbstractControl instance.
       *
       * @param validators The function or array of functions that is used to determine the validity of
       *     this control synchronously.
       * @param asyncValidators The function or array of functions that is used to determine validity of
       *     this control asynchronously.
       */
      constructor(validators, asyncValidators) {
          /** @internal */
          this._pendingDirty = false;
          /**
           * Indicates that a control has its own pending asynchronous validation in progress.
           *
           * @internal
           */
          this._hasOwnPendingAsyncValidator = false;
          /** @internal */
          this._pendingTouched = false;
          /** @internal */
          this._onCollectionChange = () => { };
          this._parent = null;
          /**
           * A control is `pristine` if the user has not yet changed
           * the value in the UI.
           *
           * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
           * Programmatic changes to a control's value do not mark it dirty.
           */
          this.pristine = true;
          /**
           * True if the control is marked as `touched`.
           *
           * A control is marked `touched` once the user has triggered
           * a `blur` event on it.
           */
          this.touched = false;
          /** @internal */
          this._onDisabledChange = [];
          this._assignValidators(validators);
          this._assignAsyncValidators(asyncValidators);
      }
      /**
       * Returns the function that is used to determine the validity of this control synchronously.
       * If multiple validators have been added, this will be a single composed function.
       * See `Validators.compose()` for additional information.
       */
      get validator() {
          return this._composedValidatorFn;
      }
      set validator(validatorFn) {
          this._rawValidators = this._composedValidatorFn = validatorFn;
      }
      /**
       * Returns the function that is used to determine the validity of this control asynchronously.
       * If multiple validators have been added, this will be a single composed function.
       * See `Validators.compose()` for additional information.
       */
      get asyncValidator() {
          return this._composedAsyncValidatorFn;
      }
      set asyncValidator(asyncValidatorFn) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
      }
      /**
       * The parent control.
       */
      get parent() {
          return this._parent;
      }
      /**
       * A control is `valid` when its `status` is `VALID`.
       *
       * @see {@link AbstractControl.status}
       *
       * @returns True if the control has passed all of its validation tests,
       * false otherwise.
       */
      get valid() {
          return this.status === VALID;
      }
      /**
       * A control is `invalid` when its `status` is `INVALID`.
       *
       * @see {@link AbstractControl.status}
       *
       * @returns True if this control has failed one or more of its validation checks,
       * false otherwise.
       */
      get invalid() {
          return this.status === INVALID;
      }
      /**
       * A control is `pending` when its `status` is `PENDING`.
       *
       * @see {@link AbstractControl.status}
       *
       * @returns True if this control is in the process of conducting a validation check,
       * false otherwise.
       */
      get pending() {
          return this.status == PENDING;
      }
      /**
       * A control is `disabled` when its `status` is `DISABLED`.
       *
       * Disabled controls are exempt from validation checks and
       * are not included in the aggregate value of their ancestor
       * controls.
       *
       * @see {@link AbstractControl.status}
       *
       * @returns True if the control is disabled, false otherwise.
       */
      get disabled() {
          return this.status === DISABLED;
      }
      /**
       * A control is `enabled` as long as its `status` is not `DISABLED`.
       *
       * @returns True if the control has any status other than 'DISABLED',
       * false if the status is 'DISABLED'.
       *
       * @see {@link AbstractControl.status}
       *
       */
      get enabled() {
          return this.status !== DISABLED;
      }
      /**
       * A control is `dirty` if the user has changed the value
       * in the UI.
       *
       * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
       * Programmatic changes to a control's value do not mark it dirty.
       */
      get dirty() {
          return !this.pristine;
      }
      /**
       * True if the control has not been marked as touched
       *
       * A control is `untouched` if the user has not yet triggered
       * a `blur` event on it.
       */
      get untouched() {
          return !this.touched;
      }
      /**
       * Reports the update strategy of the `AbstractControl` (meaning
       * the event on which the control updates itself).
       * Possible values: `'change'` | `'blur'` | `'submit'`
       * Default value: `'change'`
       */
      get updateOn() {
          return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
      }
      /**
       * Sets the synchronous validators that are active on this control.  Calling
       * this overwrites any existing synchronous validators.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * If you want to add a new validator without affecting existing ones, consider
       * using `addValidators()` method instead.
       */
      setValidators(validators) {
          this._assignValidators(validators);
      }
      /**
       * Sets the asynchronous validators that are active on this control. Calling this
       * overwrites any existing asynchronous validators.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * If you want to add a new validator without affecting existing ones, consider
       * using `addAsyncValidators()` method instead.
       */
      setAsyncValidators(validators) {
          this._assignAsyncValidators(validators);
      }
      /**
       * Add a synchronous validator or validators to this control, without affecting other validators.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * Adding a validator that already exists will have no effect. If duplicate validator functions
       * are present in the `validators` array, only the first instance would be added to a form
       * control.
       *
       * @param validators The new validator function or functions to add to this control.
       */
      addValidators(validators) {
          this.setValidators(addValidators(validators, this._rawValidators));
      }
      /**
       * Add an asynchronous validator or validators to this control, without affecting other
       * validators.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * Adding a validator that already exists will have no effect.
       *
       * @param validators The new asynchronous validator function or functions to add to this control.
       */
      addAsyncValidators(validators) {
          this.setAsyncValidators(addValidators(validators, this._rawAsyncValidators));
      }
      /**
       * Remove a synchronous validator from this control, without affecting other validators.
       * Validators are compared by function reference; you must pass a reference to the exact same
       * validator function as the one that was originally set. If a provided validator is not found,
       * it is ignored.
       *
       * @usageNotes
       *
       * ### Reference to a ValidatorFn
       *
       * ```
       * // Reference to the RequiredValidator
       * const ctrl = new FormControl<string | null>('', Validators.required);
       * ctrl.removeValidators(Validators.required);
       *
       * // Reference to anonymous function inside MinValidator
       * const minValidator = Validators.min(3);
       * const ctrl = new FormControl<string | null>('', minValidator);
       * expect(ctrl.hasValidator(minValidator)).toEqual(true)
       * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
       *
       * ctrl.removeValidators(minValidator);
       * ```
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * @param validators The validator or validators to remove.
       */
      removeValidators(validators) {
          this.setValidators(removeValidators(validators, this._rawValidators));
      }
      /**
       * Remove an asynchronous validator from this control, without affecting other validators.
       * Validators are compared by function reference; you must pass a reference to the exact same
       * validator function as the one that was originally set. If a provided validator is not found, it
       * is ignored.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * @param validators The asynchronous validator or validators to remove.
       */
      removeAsyncValidators(validators) {
          this.setAsyncValidators(removeValidators(validators, this._rawAsyncValidators));
      }
      /**
       * Check whether a synchronous validator function is present on this control. The provided
       * validator must be a reference to the exact same function that was provided.
       *
       * @usageNotes
       *
       * ### Reference to a ValidatorFn
       *
       * ```
       * // Reference to the RequiredValidator
       * const ctrl = new FormControl<number | null>(0, Validators.required);
       * expect(ctrl.hasValidator(Validators.required)).toEqual(true)
       *
       * // Reference to anonymous function inside MinValidator
       * const minValidator = Validators.min(3);
       * const ctrl = new FormControl<number | null>(0, minValidator);
       * expect(ctrl.hasValidator(minValidator)).toEqual(true)
       * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
       * ```
       *
       * @param validator The validator to check for presence. Compared by function reference.
       * @returns Whether the provided validator was found on this control.
       */
      hasValidator(validator) {
          return hasValidator(this._rawValidators, validator);
      }
      /**
       * Check whether an asynchronous validator function is present on this control. The provided
       * validator must be a reference to the exact same function that was provided.
       *
       * @param validator The asynchronous validator to check for presence. Compared by function
       *     reference.
       * @returns Whether the provided asynchronous validator was found on this control.
       */
      hasAsyncValidator(validator) {
          return hasValidator(this._rawAsyncValidators, validator);
      }
      /**
       * Empties out the synchronous validator list.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       */
      clearValidators() {
          this.validator = null;
      }
      /**
       * Empties out the async validator list.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       */
      clearAsyncValidators() {
          this.asyncValidator = null;
      }
      /**
       * Marks the control as `touched`. A control is touched by focus and
       * blur events that do not change the value.
       *
       * @see {@link markAsUntouched()}
       * @see {@link markAsDirty()}
       * @see {@link markAsPristine()}
       *
       * @param opts Configuration options that determine how the control propagates changes
       * and emits events after marking is applied.
       * * `onlySelf`: When true, mark only this control. When false or not supplied,
       * marks all direct ancestors. Default is false.
       */
      markAsTouched(opts = {}) {
          this.touched = true;
          if (this._parent && !opts.onlySelf) {
              this._parent.markAsTouched(opts);
          }
      }
      /**
       * Marks the control and all its descendant controls as `touched`.
       * @see {@link markAsTouched()}
       */
      markAllAsTouched() {
          this.markAsTouched({ onlySelf: true });
          this._forEachChild((control) => control.markAllAsTouched());
      }
      /**
       * Marks the control as `untouched`.
       *
       * If the control has any children, also marks all children as `untouched`
       * and recalculates the `touched` status of all parent controls.
       *
       * @see {@link markAsTouched()}
       * @see {@link markAsDirty()}
       * @see {@link markAsPristine()}
       *
       * @param opts Configuration options that determine how the control propagates changes
       * and emits events after the marking is applied.
       * * `onlySelf`: When true, mark only this control. When false or not supplied,
       * marks all direct ancestors. Default is false.
       */
      markAsUntouched(opts = {}) {
          this.touched = false;
          this._pendingTouched = false;
          this._forEachChild((control) => {
              control.markAsUntouched({ onlySelf: true });
          });
          if (this._parent && !opts.onlySelf) {
              this._parent._updateTouched(opts);
          }
      }
      /**
       * Marks the control as `dirty`. A control becomes dirty when
       * the control's value is changed through the UI; compare `markAsTouched`.
       *
       * @see {@link markAsTouched()}
       * @see {@link markAsUntouched()}
       * @see {@link markAsPristine()}
       *
       * @param opts Configuration options that determine how the control propagates changes
       * and emits events after marking is applied.
       * * `onlySelf`: When true, mark only this control. When false or not supplied,
       * marks all direct ancestors. Default is false.
       */
      markAsDirty(opts = {}) {
          this.pristine = false;
          if (this._parent && !opts.onlySelf) {
              this._parent.markAsDirty(opts);
          }
      }
      /**
       * Marks the control as `pristine`.
       *
       * If the control has any children, marks all children as `pristine`,
       * and recalculates the `pristine` status of all parent
       * controls.
       *
       * @see {@link markAsTouched()}
       * @see {@link markAsUntouched()}
       * @see {@link markAsDirty()}
       *
       * @param opts Configuration options that determine how the control emits events after
       * marking is applied.
       * * `onlySelf`: When true, mark only this control. When false or not supplied,
       * marks all direct ancestors. Default is false.
       */
      markAsPristine(opts = {}) {
          this.pristine = true;
          this._pendingDirty = false;
          this._forEachChild((control) => {
              control.markAsPristine({ onlySelf: true });
          });
          if (this._parent && !opts.onlySelf) {
              this._parent._updatePristine(opts);
          }
      }
      /**
       * Marks the control as `pending`.
       *
       * A control is pending while the control performs async validation.
       *
       * @see {@link AbstractControl.status}
       *
       * @param opts Configuration options that determine how the control propagates changes and
       * emits events after marking is applied.
       * * `onlySelf`: When true, mark only this control. When false or not supplied,
       * marks all direct ancestors. Default is false.
       * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
       * observable emits an event with the latest status the control is marked pending.
       * When false, no events are emitted.
       *
       */
      markAsPending(opts = {}) {
          this.status = PENDING;
          if (opts.emitEvent !== false) {
              this.statusChanges.emit(this.status);
          }
          if (this._parent && !opts.onlySelf) {
              this._parent.markAsPending(opts);
          }
      }
      /**
       * Disables the control. This means the control is exempt from validation checks and
       * excluded from the aggregate value of any parent. Its status is `DISABLED`.
       *
       * If the control has children, all children are also disabled.
       *
       * @see {@link AbstractControl.status}
       *
       * @param opts Configuration options that determine how the control propagates
       * changes and emits events after the control is disabled.
       * * `onlySelf`: When true, mark only this control. When false or not supplied,
       * marks all direct ancestors. Default is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control is disabled.
       * When false, no events are emitted.
       */
      disable(opts = {}) {
          // If parent has been marked artificially dirty we don't want to re-calculate the
          // parent's dirtiness based on the children.
          const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
          this.status = DISABLED;
          this.errors = null;
          this._forEachChild((control) => {
              control.disable({ ...opts, onlySelf: true });
          });
          this._updateValue();
          if (opts.emitEvent !== false) {
              this.valueChanges.emit(this.value);
              this.statusChanges.emit(this.status);
          }
          this._updateAncestors({ ...opts, skipPristineCheck });
          this._onDisabledChange.forEach((changeFn) => changeFn(true));
      }
      /**
       * Enables the control. This means the control is included in validation checks and
       * the aggregate value of its parent. Its status recalculates based on its value and
       * its validators.
       *
       * By default, if the control has children, all children are enabled.
       *
       * @see {@link AbstractControl.status}
       *
       * @param opts Configure options that control how the control propagates changes and
       * emits events when marked as untouched
       * * `onlySelf`: When true, mark only this control. When false or not supplied,
       * marks all direct ancestors. Default is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control is enabled.
       * When false, no events are emitted.
       */
      enable(opts = {}) {
          // If parent has been marked artificially dirty we don't want to re-calculate the
          // parent's dirtiness based on the children.
          const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
          this.status = VALID;
          this._forEachChild((control) => {
              control.enable({ ...opts, onlySelf: true });
          });
          this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
          this._updateAncestors({ ...opts, skipPristineCheck });
          this._onDisabledChange.forEach((changeFn) => changeFn(false));
      }
      _updateAncestors(opts) {
          if (this._parent && !opts.onlySelf) {
              this._parent.updateValueAndValidity(opts);
              if (!opts.skipPristineCheck) {
                  this._parent._updatePristine();
              }
              this._parent._updateTouched();
          }
      }
      /**
       * Sets the parent of the control
       *
       * @param parent The new parent.
       */
      setParent(parent) {
          this._parent = parent;
      }
      /**
       * The raw value of this control. For most control implementations, the raw value will include
       * disabled children.
       */
      getRawValue() {
          return this.value;
      }
      /**
       * Recalculates the value and validation status of the control.
       *
       * By default, it also updates the value and validity of its ancestors.
       *
       * @param opts Configuration options determine how the control propagates changes and emits events
       * after updates and validity checks are applied.
       * * `onlySelf`: When true, only update this control. When false or not supplied,
       * update all direct ancestors. Default is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control is updated.
       * When false, no events are emitted.
       */
      updateValueAndValidity(opts = {}) {
          this._setInitialStatus();
          this._updateValue();
          if (this.enabled) {
              this._cancelExistingSubscription();
              this.errors = this._runValidator();
              this.status = this._calculateStatus();
              if (this.status === VALID || this.status === PENDING) {
                  this._runAsyncValidator(opts.emitEvent);
              }
          }
          if (opts.emitEvent !== false) {
              this.valueChanges.emit(this.value);
              this.statusChanges.emit(this.status);
          }
          if (this._parent && !opts.onlySelf) {
              this._parent.updateValueAndValidity(opts);
          }
      }
      /** @internal */
      _updateTreeValidity(opts = { emitEvent: true }) {
          this._forEachChild((ctrl) => ctrl._updateTreeValidity(opts));
          this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
      }
      _setInitialStatus() {
          this.status = this._allControlsDisabled() ? DISABLED : VALID;
      }
      _runValidator() {
          return this.validator ? this.validator(this) : null;
      }
      _runAsyncValidator(emitEvent) {
          if (this.asyncValidator) {
              this.status = PENDING;
              this._hasOwnPendingAsyncValidator = true;
              const obs = toObservable(this.asyncValidator(this));
              this._asyncValidationSubscription = obs.subscribe((errors) => {
                  this._hasOwnPendingAsyncValidator = false;
                  // This will trigger the recalculation of the validation status, which depends on
                  // the state of the asynchronous validation (whether it is in progress or not). So, it is
                  // necessary that we have updated the `_hasOwnPendingAsyncValidator` boolean flag first.
                  this.setErrors(errors, { emitEvent });
              });
          }
      }
      _cancelExistingSubscription() {
          if (this._asyncValidationSubscription) {
              this._asyncValidationSubscription.unsubscribe();
              this._hasOwnPendingAsyncValidator = false;
          }
      }
      /**
       * Sets errors on a form control when running validations manually, rather than automatically.
       *
       * Calling `setErrors` also updates the validity of the parent control.
       *
       * @param opts Configuration options that determine how the control propagates
       * changes and emits events after the control errors are set.
       * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
       * observable emits an event after the errors are set.
       *
       * @usageNotes
       *
       * ### Manually set the errors for a control
       *
       * ```
       * const login = new FormControl('someLogin');
       * login.setErrors({
       *   notUnique: true
       * });
       *
       * expect(login.valid).toEqual(false);
       * expect(login.errors).toEqual({ notUnique: true });
       *
       * login.setValue('someOtherLogin');
       *
       * expect(login.valid).toEqual(true);
       * ```
       */
      setErrors(errors, opts = {}) {
          this.errors = errors;
          this._updateControlsErrors(opts.emitEvent !== false);
      }
      /**
       * Retrieves a child control given the control's name or path.
       *
       * @param path A dot-delimited string or array of string/number values that define the path to the
       * control. If a string is provided, passing it as a string literal will result in improved type
       * information. Likewise, if an array is provided, passing it `as const` will cause improved type
       * information to be available.
       *
       * @usageNotes
       * ### Retrieve a nested control
       *
       * For example, to get a `name` control nested within a `person` sub-group:
       *
       * * `this.form.get('person.name');`
       *
       * -OR-
       *
       * * `this.form.get(['person', 'name'] as const);` // `as const` gives improved typings
       *
       * ### Retrieve a control in a FormArray
       *
       * When accessing an element inside a FormArray, you can use an element index.
       * For example, to get a `price` control from the first element in an `items` array you can use:
       *
       * * `this.form.get('items.0.price');`
       *
       * -OR-
       *
       * * `this.form.get(['items', 0, 'price']);`
       */
      get(path) {
          let currPath = path;
          if (currPath == null)
              return null;
          if (!Array.isArray(currPath))
              currPath = currPath.split('.');
          if (currPath.length === 0)
              return null;
          return currPath.reduce((control, name) => control && control._find(name), this);
      }
      /**
       * @description
       * Reports error data for the control with the given path.
       *
       * @param errorCode The code of the error to check
       * @param path A list of control names that designates how to move from the current control
       * to the control that should be queried for errors.
       *
       * @usageNotes
       * For example, for the following `FormGroup`:
       *
       * ```
       * form = new FormGroup({
       *   address: new FormGroup({ street: new FormControl() })
       * });
       * ```
       *
       * The path to the 'street' control from the root form would be 'address' -> 'street'.
       *
       * It can be provided to this method in one of two formats:
       *
       * 1. An array of string control names, e.g. `['address', 'street']`
       * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
       *
       * @returns error data for that particular error. If the control or error is not present,
       * null is returned.
       */
      getError(errorCode, path) {
          const control = path ? this.get(path) : this;
          return control && control.errors ? control.errors[errorCode] : null;
      }
      /**
       * @description
       * Reports whether the control with the given path has the error specified.
       *
       * @param errorCode The code of the error to check
       * @param path A list of control names that designates how to move from the current control
       * to the control that should be queried for errors.
       *
       * @usageNotes
       * For example, for the following `FormGroup`:
       *
       * ```
       * form = new FormGroup({
       *   address: new FormGroup({ street: new FormControl() })
       * });
       * ```
       *
       * The path to the 'street' control from the root form would be 'address' -> 'street'.
       *
       * It can be provided to this method in one of two formats:
       *
       * 1. An array of string control names, e.g. `['address', 'street']`
       * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
       *
       * If no path is given, this method checks for the error on the current control.
       *
       * @returns whether the given error is present in the control at the given path.
       *
       * If the control is not present, false is returned.
       */
      hasError(errorCode, path) {
          return !!this.getError(errorCode, path);
      }
      /**
       * Retrieves the top-level ancestor of this control.
       */
      get root() {
          let x = this;
          while (x._parent) {
              x = x._parent;
          }
          return x;
      }
      /** @internal */
      _updateControlsErrors(emitEvent) {
          this.status = this._calculateStatus();
          if (emitEvent) {
              this.statusChanges.emit(this.status);
          }
          if (this._parent) {
              this._parent._updateControlsErrors(emitEvent);
          }
      }
      /** @internal */
      _initObservables() {
          this.valueChanges = new i0.EventEmitter();
          this.statusChanges = new i0.EventEmitter();
      }
      _calculateStatus() {
          if (this._allControlsDisabled())
              return DISABLED;
          if (this.errors)
              return INVALID;
          if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING))
              return PENDING;
          if (this._anyControlsHaveStatus(INVALID))
              return INVALID;
          return VALID;
      }
      /** @internal */
      _anyControlsHaveStatus(status) {
          return this._anyControls((control) => control.status === status);
      }
      /** @internal */
      _anyControlsDirty() {
          return this._anyControls((control) => control.dirty);
      }
      /** @internal */
      _anyControlsTouched() {
          return this._anyControls((control) => control.touched);
      }
      /** @internal */
      _updatePristine(opts = {}) {
          this.pristine = !this._anyControlsDirty();
          if (this._parent && !opts.onlySelf) {
              this._parent._updatePristine(opts);
          }
      }
      /** @internal */
      _updateTouched(opts = {}) {
          this.touched = this._anyControlsTouched();
          if (this._parent && !opts.onlySelf) {
              this._parent._updateTouched(opts);
          }
      }
      /** @internal */
      _registerOnCollectionChange(fn) {
          this._onCollectionChange = fn;
      }
      /** @internal */
      _setUpdateStrategy(opts) {
          if (isOptionsObj(opts) && opts.updateOn != null) {
              this._updateOn = opts.updateOn;
          }
      }
      /**
       * Check to see if parent has been marked artificially dirty.
       *
       * @internal
       */
      _parentMarkedDirty(onlySelf) {
          const parentDirty = this._parent && this._parent.dirty;
          return !onlySelf && !!parentDirty && !this._parent._anyControlsDirty();
      }
      /** @internal */
      _find(name) {
          return null;
      }
      /**
       * Internal implementation of the `setValidators` method. Needs to be separated out into a
       * different method, because it is called in the constructor and it can break cases where
       * a control is extended.
       */
      _assignValidators(validators) {
          this._rawValidators = Array.isArray(validators) ? validators.slice() : validators;
          this._composedValidatorFn = coerceToValidator(this._rawValidators);
      }
      /**
       * Internal implementation of the `setAsyncValidators` method. Needs to be separated out into a
       * different method, because it is called in the constructor and it can break cases where
       * a control is extended.
       */
      _assignAsyncValidators(validators) {
          this._rawAsyncValidators = Array.isArray(validators) ? validators.slice() : validators;
          this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
      }
  }

  /**
   * Tracks the value and validity state of a group of `FormControl` instances.
   *
   * A `FormGroup` aggregates the values of each child `FormControl` into one object,
   * with each control name as the key.  It calculates its status by reducing the status values
   * of its children. For example, if one of the controls in a group is invalid, the entire
   * group becomes invalid.
   *
   * `FormGroup` is one of the four fundamental building blocks used to define forms in Angular,
   * along with `FormControl`, `FormArray`, and `FormRecord`.
   *
   * When instantiating a `FormGroup`, pass in a collection of child controls as the first
   * argument. The key for each child registers the name for the control.
   *
   * `FormGroup` is intended for use cases where the keys are known ahead of time.
   * If you need to dynamically add and remove controls, use {@link FormRecord} instead.
   *
   * `FormGroup` accepts an optional type parameter `TControl`, which is an object type with inner
   * control types as values.
   *
   * @usageNotes
   *
   * ### Create a form group with 2 controls
   *
   * ```
   * const form = new FormGroup({
   *   first: new FormControl('Nancy', Validators.minLength(2)),
   *   last: new FormControl('Drew'),
   * });
   *
   * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
   * console.log(form.status);  // 'VALID'
   * ```
   *
   * ### The type argument, and optional controls
   *
   * `FormGroup` accepts one generic argument, which is an object containing its inner controls.
   * This type will usually be inferred automatically, but you can always specify it explicitly if you
   * wish.
   *
   * If you have controls that are optional (i.e. they can be removed, you can use the `?` in the
   * type):
   *
   * ```
   * const form = new FormGroup<{
   *   first: FormControl<string|null>,
   *   middle?: FormControl<string|null>, // Middle name is optional.
   *   last: FormControl<string|null>,
   * }>({
   *   first: new FormControl('Nancy'),
   *   last: new FormControl('Drew'),
   * });
   * ```
   *
   * ### Create a form group with a group-level validator
   *
   * You include group-level validators as the second arg, or group-level async
   * validators as the third arg. These come in handy when you want to perform validation
   * that considers the value of more than one child control.
   *
   * ```
   * const form = new FormGroup({
   *   password: new FormControl('', Validators.minLength(2)),
   *   passwordConfirm: new FormControl('', Validators.minLength(2)),
   * }, passwordMatchValidator);
   *
   *
   * function passwordMatchValidator(g: FormGroup) {
   *    return g.get('password').value === g.get('passwordConfirm').value
   *       ? null : {'mismatch': true};
   * }
   * ```
   *
   * Like `FormControl` instances, you choose to pass in
   * validators and async validators as part of an options object.
   *
   * ```
   * const form = new FormGroup({
   *   password: new FormControl('')
   *   passwordConfirm: new FormControl('')
   * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
   * ```
   *
   * ### Set the updateOn property for all controls in a form group
   *
   * The options object is used to set a default value for each child
   * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
   * group level, all child controls default to 'blur', unless the child
   * has explicitly specified a different `updateOn` value.
   *
   * ```ts
   * const c = new FormGroup({
   *   one: new FormControl()
   * }, { updateOn: 'blur' });
   * ```
   *
   * ### Using a FormGroup with optional controls
   *
   * It is possible to have optional controls in a FormGroup. An optional control can be removed later
   * using `removeControl`, and can be omitted when calling `reset`. Optional controls must be
   * declared optional in the group's type.
   *
   * ```ts
   * const c = new FormGroup<{one?: FormControl<string>}>({
   *   one: new FormControl('')
   * });
   * ```
   *
   * Notice that `c.value.one` has type `string|null|undefined`. This is because calling `c.reset({})`
   * without providing the optional key `one` will cause it to become `null`.
   *
   * @publicApi
   */
  class FormGroup extends AbstractControl {
      /**
       * Creates a new `FormGroup` instance.
       *
       * @param controls A collection of child controls. The key for each child is the name
       * under which it is registered.
       *
       * @param validatorOrOpts A synchronous validator function, or an array of
       * such functions, or an `AbstractControlOptions` object that contains validation functions
       * and a validation trigger.
       *
       * @param asyncValidator A single async validator or array of async validator functions
       *
       */
      constructor(controls, validatorOrOpts, asyncValidator) {
          super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
          (typeof ngDevMode === 'undefined' || ngDevMode) && validateFormGroupControls(controls);
          this.controls = controls;
          this._initObservables();
          this._setUpdateStrategy(validatorOrOpts);
          this._setUpControls();
          this.updateValueAndValidity({
              onlySelf: true,
              // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
              // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
              // so we set `emitEvent` to `true` to allow that during the control creation process.
              emitEvent: !!this.asyncValidator
          });
      }
      registerControl(name, control) {
          if (this.controls[name])
              return this.controls[name];
          this.controls[name] = control;
          control.setParent(this);
          control._registerOnCollectionChange(this._onCollectionChange);
          return control;
      }
      addControl(name, control, options = {}) {
          this.registerControl(name, control);
          this.updateValueAndValidity({ emitEvent: options.emitEvent });
          this._onCollectionChange();
      }
      /**
       * Remove a control from this group. In a strongly-typed group, required controls cannot be
       * removed.
       *
       * This method also updates the value and validity of the control.
       *
       * @param name The control name to remove from the collection
       * @param options Specifies whether this FormGroup instance should emit events after a
       *     control is removed.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * removed. When false, no events are emitted.
       */
      removeControl(name, options = {}) {
          if (this.controls[name])
              this.controls[name]._registerOnCollectionChange(() => { });
          delete (this.controls[name]);
          this.updateValueAndValidity({ emitEvent: options.emitEvent });
          this._onCollectionChange();
      }
      setControl(name, control, options = {}) {
          if (this.controls[name])
              this.controls[name]._registerOnCollectionChange(() => { });
          delete (this.controls[name]);
          if (control)
              this.registerControl(name, control);
          this.updateValueAndValidity({ emitEvent: options.emitEvent });
          this._onCollectionChange();
      }
      contains(controlName) {
          return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
      }
      /**
       * Sets the value of the `FormGroup`. It accepts an object that matches
       * the structure of the group, with control names as keys.
       *
       * @usageNotes
       * ### Set the complete value for the form group
       *
       * ```
       * const form = new FormGroup({
       *   first: new FormControl(),
       *   last: new FormControl()
       * });
       *
       * console.log(form.value);   // {first: null, last: null}
       *
       * form.setValue({first: 'Nancy', last: 'Drew'});
       * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
       * ```
       *
       * @throws When strict checks fail, such as setting the value of a control
       * that doesn't exist or if you exclude a value of a control that does exist.
       *
       * @param value The new value for the control that matches the structure of the group.
       * @param options Configuration options that determine how the control propagates changes
       * and emits events after the value changes.
       * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
       * updateValueAndValidity} method.
       *
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
       * false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control value is updated.
       * When false, no events are emitted.
       */
      setValue(value, options = {}) {
          assertAllValuesPresent(this, true, value);
          Object.keys(value).forEach(name => {
              assertControlPresent(this, true, name);
              this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
          });
          this.updateValueAndValidity(options);
      }
      /**
       * Patches the value of the `FormGroup`. It accepts an object with control
       * names as keys, and does its best to match the values to the correct controls
       * in the group.
       *
       * It accepts both super-sets and sub-sets of the group without throwing an error.
       *
       * @usageNotes
       * ### Patch the value for a form group
       *
       * ```
       * const form = new FormGroup({
       *    first: new FormControl(),
       *    last: new FormControl()
       * });
       * console.log(form.value);   // {first: null, last: null}
       *
       * form.patchValue({first: 'Nancy'});
       * console.log(form.value);   // {first: 'Nancy', last: null}
       * ```
       *
       * @param value The object that matches the structure of the group.
       * @param options Configuration options that determine how the control propagates changes and
       * emits events after the value is patched.
       * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
       * true.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control value
       * is updated. When false, no events are emitted. The configuration options are passed to
       * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
       */
      patchValue(value, options = {}) {
          // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
          // `patchValue` can be called recursively and inner data structures might have these values, so
          // we just ignore such cases when a field containing FormGroup instance receives `null` or
          // `undefined` as a value.
          if (value == null /* both `null` and `undefined` */)
              return;
          Object.keys(value).forEach(name => {
              // The compiler cannot see through the uninstantiated conditional type of `this.controls`, so
              // `as any` is required.
              const control = this.controls[name];
              if (control) {
                  control.patchValue(
                  /* Guaranteed to be present, due to the outer forEach. */ value[name], { onlySelf: true, emitEvent: options.emitEvent });
              }
          });
          this.updateValueAndValidity(options);
      }
      /**
       * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
       * the value of all descendants to their default values, or null if no defaults were provided.
       *
       * You reset to a specific form state by passing in a map of states
       * that matches the structure of your form, with control names as keys. The state
       * is a standalone value or a form state object with both a value and a disabled
       * status.
       *
       * @param value Resets the control with an initial value,
       * or an object that defines the initial value and disabled state.
       *
       * @param options Configuration options that determine how the control propagates changes
       * and emits events when the group is reset.
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
       * false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control is reset.
       * When false, no events are emitted.
       * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
       * updateValueAndValidity} method.
       *
       * @usageNotes
       *
       * ### Reset the form group values
       *
       * ```ts
       * const form = new FormGroup({
       *   first: new FormControl('first name'),
       *   last: new FormControl('last name')
       * });
       *
       * console.log(form.value);  // {first: 'first name', last: 'last name'}
       *
       * form.reset({ first: 'name', last: 'last name' });
       *
       * console.log(form.value);  // {first: 'name', last: 'last name'}
       * ```
       *
       * ### Reset the form group values and disabled status
       *
       * ```
       * const form = new FormGroup({
       *   first: new FormControl('first name'),
       *   last: new FormControl('last name')
       * });
       *
       * form.reset({
       *   first: {value: 'name', disabled: true},
       *   last: 'last'
       * });
       *
       * console.log(form.value);  // {last: 'last'}
       * console.log(form.get('first').status);  // 'DISABLED'
       * ```
       */
      reset(value = {}, options = {}) {
          this._forEachChild((control, name) => {
              control.reset(value ? value[name] : null, { onlySelf: true, emitEvent: options.emitEvent });
          });
          this._updatePristine(options);
          this._updateTouched(options);
          this.updateValueAndValidity(options);
      }
      /**
       * The aggregate value of the `FormGroup`, including any disabled controls.
       *
       * Retrieves all values regardless of disabled status.
       */
      getRawValue() {
          return this._reduceChildren({}, (acc, control, name) => {
              acc[name] = control.getRawValue();
              return acc;
          });
      }
      /** @internal */
      _syncPendingControls() {
          let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
              return child._syncPendingControls() ? true : updated;
          });
          if (subtreeUpdated)
              this.updateValueAndValidity({ onlySelf: true });
          return subtreeUpdated;
      }
      /** @internal */
      _forEachChild(cb) {
          Object.keys(this.controls).forEach(key => {
              // The list of controls can change (for ex. controls might be removed) while the loop
              // is running (as a result of invoking Forms API in `valueChanges` subscription), so we
              // have to null check before invoking the callback.
              const control = this.controls[key];
              control && cb(control, key);
          });
      }
      /** @internal */
      _setUpControls() {
          this._forEachChild((control) => {
              control.setParent(this);
              control._registerOnCollectionChange(this._onCollectionChange);
          });
      }
      /** @internal */
      _updateValue() {
          this.value = this._reduceValue();
      }
      /** @internal */
      _anyControls(condition) {
          for (const [controlName, control] of Object.entries(this.controls)) {
              if (this.contains(controlName) && condition(control)) {
                  return true;
              }
          }
          return false;
      }
      /** @internal */
      _reduceValue() {
          let acc = {};
          return this._reduceChildren(acc, (acc, control, name) => {
              if (control.enabled || this.disabled) {
                  acc[name] = control.value;
              }
              return acc;
          });
      }
      /** @internal */
      _reduceChildren(initValue, fn) {
          let res = initValue;
          this._forEachChild((control, name) => {
              res = fn(res, control, name);
          });
          return res;
      }
      /** @internal */
      _allControlsDisabled() {
          for (const controlName of Object.keys(this.controls)) {
              if (this.controls[controlName].enabled) {
                  return false;
              }
          }
          return Object.keys(this.controls).length > 0 || this.disabled;
      }
      /** @internal */
      _find(name) {
          return this.controls.hasOwnProperty(name) ?
              this.controls[name] :
              null;
      }
  }
  /**
   * Will validate that none of the controls has a key with a dot
   * Throws other wise
   */
  function validateFormGroupControls(controls) {
      const invalidKeys = Object.keys(controls).filter(key => key.includes('.'));
      if (invalidKeys.length > 0) {
          // TODO: make this an error once there are no more uses in G3
          console.warn(`FormGroup keys cannot include \`.\`, please replace the keys for: ${invalidKeys.join(',')}.`);
      }
  }
  const UntypedFormGroup = FormGroup;
  /**
   * @description
   * Asserts that the given control is an instance of `FormGroup`
   *
   * @publicApi
   */
  const isFormGroup = (control) => control instanceof FormGroup;
  /**
   * Tracks the value and validity state of a collection of `FormControl` instances, each of which has
   * the same value type.
   *
   * `FormRecord` is very similar to {@link FormGroup}, except it can be used with a dynamic keys,
   * with controls added and removed as needed.
   *
   * `FormRecord` accepts one generic argument, which describes the type of the controls it contains.
   *
   * @usageNotes
   *
   * ```
   * let numbers = new FormRecord({bill: new FormControl('415-123-456')});
   * numbers.addControl('bob', new FormControl('415-234-567'));
   * numbers.removeControl('bill');
   * ```
   *
   * @publicApi
   */
  class FormRecord extends FormGroup {
  }
  /**
   * @description
   * Asserts that the given control is an instance of `FormRecord`
   *
   * @publicApi
   */
  const isFormRecord = (control) => control instanceof FormRecord;

  /**
   * Token to provide to allow SetDisabledState to always be called when a CVA is added, regardless of
   * whether the control is disabled or enabled.
   *
   * @see {@link FormsModule#withconfig}
   */
  const CALL_SET_DISABLED_STATE = new i0.InjectionToken('CallSetDisabledState', { providedIn: 'root', factory: () => setDisabledStateDefault });
  /**
   * Whether to use the fixed setDisabledState behavior by default.
   */
  const setDisabledStateDefault = 'always';
  function controlPath(name, parent) {
      return [...parent.path, name];
  }
  /**
   * Links a Form control and a Form directive by setting up callbacks (such as `onChange`) on both
   * instances. This function is typically invoked when form directive is being initialized.
   *
   * @param control Form control instance that should be linked.
   * @param dir Directive that should be linked with a given control.
   */
  function setUpControl(control, dir, callSetDisabledState = setDisabledStateDefault) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
          if (!control)
              _throwError(dir, 'Cannot find control with');
          if (!dir.valueAccessor)
              _throwMissingValueAccessorError(dir);
      }
      setUpValidators(control, dir);
      dir.valueAccessor.writeValue(control.value);
      // The legacy behavior only calls the CVA's `setDisabledState` if the control is disabled.
      // If the `callSetDisabledState` option is set to `always`, then this bug is fixed and
      // the method is always called.
      if (control.disabled || callSetDisabledState === 'always') {
          dir.valueAccessor.setDisabledState?.(control.disabled);
      }
      setUpViewChangePipeline(control, dir);
      setUpModelChangePipeline(control, dir);
      setUpBlurPipeline(control, dir);
      setUpDisabledChangeHandler(control, dir);
  }
  /**
   * Reverts configuration performed by the `setUpControl` control function.
   * Effectively disconnects form control with a given form directive.
   * This function is typically invoked when corresponding form directive is being destroyed.
   *
   * @param control Form control which should be cleaned up.
   * @param dir Directive that should be disconnected from a given control.
   * @param validateControlPresenceOnChange Flag that indicates whether onChange handler should
   *     contain asserts to verify that it's not called once directive is destroyed. We need this flag
   *     to avoid potentially breaking changes caused by better control cleanup introduced in #39235.
   */
  function cleanUpControl(control, dir, validateControlPresenceOnChange = true) {
      const noop = () => {
          if (validateControlPresenceOnChange && (typeof ngDevMode === 'undefined' || ngDevMode)) {
              _noControlError(dir);
          }
      };
      // The `valueAccessor` field is typically defined on FromControl and FormControlName directive
      // instances and there is a logic in `selectValueAccessor` function that throws if it's not the
      // case. We still check the presence of `valueAccessor` before invoking its methods to make sure
      // that cleanup works correctly if app code or tests are setup to ignore the error thrown from
      // `selectValueAccessor`. See https://github.com/angular/angular/issues/40521.
      if (dir.valueAccessor) {
          dir.valueAccessor.registerOnChange(noop);
          dir.valueAccessor.registerOnTouched(noop);
      }
      cleanUpValidators(control, dir);
      if (control) {
          dir._invokeOnDestroyCallbacks();
          control._registerOnCollectionChange(() => { });
      }
  }
  function registerOnValidatorChange(validators, onChange) {
      validators.forEach((validator) => {
          if (validator.registerOnValidatorChange)
              validator.registerOnValidatorChange(onChange);
      });
  }
  /**
   * Sets up disabled change handler function on a given form control if ControlValueAccessor
   * associated with a given directive instance supports the `setDisabledState` call.
   *
   * @param control Form control where disabled change handler should be setup.
   * @param dir Corresponding directive instance associated with this control.
   */
  function setUpDisabledChangeHandler(control, dir) {
      if (dir.valueAccessor.setDisabledState) {
          const onDisabledChange = (isDisabled) => {
              dir.valueAccessor.setDisabledState(isDisabled);
          };
          control.registerOnDisabledChange(onDisabledChange);
          // Register a callback function to cleanup disabled change handler
          // from a control instance when a directive is destroyed.
          dir._registerOnDestroy(() => {
              control._unregisterOnDisabledChange(onDisabledChange);
          });
      }
  }
  /**
   * Sets up sync and async directive validators on provided form control.
   * This function merges validators from the directive into the validators of the control.
   *
   * @param control Form control where directive validators should be setup.
   * @param dir Directive instance that contains validators to be setup.
   */
  function setUpValidators(control, dir) {
      const validators = getControlValidators(control);
      if (dir.validator !== null) {
          control.setValidators(mergeValidators(validators, dir.validator));
      }
      else if (typeof validators === 'function') {
          // If sync validators are represented by a single validator function, we force the
          // `Validators.compose` call to happen by executing the `setValidators` function with
          // an array that contains that function. We need this to avoid possible discrepancies in
          // validators behavior, so sync validators are always processed by the `Validators.compose`.
          // Note: we should consider moving this logic inside the `setValidators` function itself, so we
          // have consistent behavior on AbstractControl API level. The same applies to the async
          // validators logic below.
          control.setValidators([validators]);
      }
      const asyncValidators = getControlAsyncValidators(control);
      if (dir.asyncValidator !== null) {
          control.setAsyncValidators(mergeValidators(asyncValidators, dir.asyncValidator));
      }
      else if (typeof asyncValidators === 'function') {
          control.setAsyncValidators([asyncValidators]);
      }
      // Re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
      const onValidatorChange = () => control.updateValueAndValidity();
      registerOnValidatorChange(dir._rawValidators, onValidatorChange);
      registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
  }
  /**
   * Cleans up sync and async directive validators on provided form control.
   * This function reverts the setup performed by the `setUpValidators` function, i.e.
   * removes directive-specific validators from a given control instance.
   *
   * @param control Form control from where directive validators should be removed.
   * @param dir Directive instance that contains validators to be removed.
   * @returns true if a control was updated as a result of this action.
   */
  function cleanUpValidators(control, dir) {
      let isControlUpdated = false;
      if (control !== null) {
          if (dir.validator !== null) {
              const validators = getControlValidators(control);
              if (Array.isArray(validators) && validators.length > 0) {
                  // Filter out directive validator function.
                  const updatedValidators = validators.filter((validator) => validator !== dir.validator);
                  if (updatedValidators.length !== validators.length) {
                      isControlUpdated = true;
                      control.setValidators(updatedValidators);
                  }
              }
          }
          if (dir.asyncValidator !== null) {
              const asyncValidators = getControlAsyncValidators(control);
              if (Array.isArray(asyncValidators) && asyncValidators.length > 0) {
                  // Filter out directive async validator function.
                  const updatedAsyncValidators = asyncValidators.filter((asyncValidator) => asyncValidator !== dir.asyncValidator);
                  if (updatedAsyncValidators.length !== asyncValidators.length) {
                      isControlUpdated = true;
                      control.setAsyncValidators(updatedAsyncValidators);
                  }
              }
          }
      }
      // Clear onValidatorChange callbacks by providing a noop function.
      const noop = () => { };
      registerOnValidatorChange(dir._rawValidators, noop);
      registerOnValidatorChange(dir._rawAsyncValidators, noop);
      return isControlUpdated;
  }
  function setUpViewChangePipeline(control, dir) {
      dir.valueAccessor.registerOnChange((newValue) => {
          control._pendingValue = newValue;
          control._pendingChange = true;
          control._pendingDirty = true;
          if (control.updateOn === 'change')
              updateControl(control, dir);
      });
  }
  function setUpBlurPipeline(control, dir) {
      dir.valueAccessor.registerOnTouched(() => {
          control._pendingTouched = true;
          if (control.updateOn === 'blur' && control._pendingChange)
              updateControl(control, dir);
          if (control.updateOn !== 'submit')
              control.markAsTouched();
      });
  }
  function updateControl(control, dir) {
      if (control._pendingDirty)
          control.markAsDirty();
      control.setValue(control._pendingValue, { emitModelToViewChange: false });
      dir.viewToModelUpdate(control._pendingValue);
      control._pendingChange = false;
  }
  function setUpModelChangePipeline(control, dir) {
      const onChange = (newValue, emitModelEvent) => {
          // control -> view
          dir.valueAccessor.writeValue(newValue);
          // control -> ngModel
          if (emitModelEvent)
              dir.viewToModelUpdate(newValue);
      };
      control.registerOnChange(onChange);
      // Register a callback function to cleanup onChange handler
      // from a control instance when a directive is destroyed.
      dir._registerOnDestroy(() => {
          control._unregisterOnChange(onChange);
      });
  }
  /**
   * Links a FormGroup or FormArray instance and corresponding Form directive by setting up validators
   * present in the view.
   *
   * @param control FormGroup or FormArray instance that should be linked.
   * @param dir Directive that provides view validators.
   */
  function setUpFormContainer(control, dir) {
      if (control == null && (typeof ngDevMode === 'undefined' || ngDevMode))
          _throwError(dir, 'Cannot find control with');
      setUpValidators(control, dir);
  }
  /**
   * Reverts the setup performed by the `setUpFormContainer` function.
   *
   * @param control FormGroup or FormArray instance that should be cleaned up.
   * @param dir Directive that provided view validators.
   * @returns true if a control was updated as a result of this action.
   */
  function cleanUpFormContainer(control, dir) {
      return cleanUpValidators(control, dir);
  }
  function _noControlError(dir) {
      return _throwError(dir, 'There is no FormControl instance attached to form control element with');
  }
  function _throwError(dir, message) {
      const messageEnd = _describeControlLocation(dir);
      throw new Error(`${message} ${messageEnd}`);
  }
  function _describeControlLocation(dir) {
      const path = dir.path;
      if (path && path.length > 1)
          return `path: '${path.join(' -> ')}'`;
      if (path?.[0])
          return `name: '${path}'`;
      return 'unspecified name attribute';
  }
  function _throwMissingValueAccessorError(dir) {
      const loc = _describeControlLocation(dir);
      throw new i0.ɵRuntimeError(-1203 /* RuntimeErrorCode.NG_MISSING_VALUE_ACCESSOR */, `No value accessor for form control ${loc}.`);
  }
  function _throwInvalidValueAccessorError(dir) {
      const loc = _describeControlLocation(dir);
      throw new i0.ɵRuntimeError(1200 /* RuntimeErrorCode.NG_VALUE_ACCESSOR_NOT_PROVIDED */, `Value accessor was not provided as an array for form control with ${loc}. ` +
          `Check that the \`NG_VALUE_ACCESSOR\` token is configured as a \`multi: true\` provider.`);
  }
  function isPropertyUpdated(changes, viewModel) {
      if (!changes.hasOwnProperty('model'))
          return false;
      const change = changes['model'];
      if (change.isFirstChange())
          return true;
      return !Object.is(viewModel, change.currentValue);
  }
  function isBuiltInAccessor(valueAccessor) {
      // Check if a given value accessor is an instance of a class that directly extends
      // `BuiltInControlValueAccessor` one.
      return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
  }
  function syncPendingControls(form, directives) {
      form._syncPendingControls();
      directives.forEach((dir) => {
          const control = dir.control;
          if (control.updateOn === 'submit' && control._pendingChange) {
              dir.viewToModelUpdate(control._pendingValue);
              control._pendingChange = false;
          }
      });
  }
  // TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
  function selectValueAccessor(dir, valueAccessors) {
      if (!valueAccessors)
          return null;
      if (!Array.isArray(valueAccessors) && (typeof ngDevMode === 'undefined' || ngDevMode))
          _throwInvalidValueAccessorError(dir);
      let defaultAccessor = undefined;
      let builtinAccessor = undefined;
      let customAccessor = undefined;
      valueAccessors.forEach((v) => {
          if (v.constructor === DefaultValueAccessor) {
              defaultAccessor = v;
          }
          else if (isBuiltInAccessor(v)) {
              if (builtinAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
                  _throwError(dir, 'More than one built-in value accessor matches form control with');
              builtinAccessor = v;
          }
          else {
              if (customAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
                  _throwError(dir, 'More than one custom value accessor matches form control with');
              customAccessor = v;
          }
      });
      if (customAccessor)
          return customAccessor;
      if (builtinAccessor)
          return builtinAccessor;
      if (defaultAccessor)
          return defaultAccessor;
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
          _throwError(dir, 'No valid value accessor for form control with');
      }
      return null;
  }
  function removeListItem$1(list, el) {
      const index = list.indexOf(el);
      if (index > -1)
          list.splice(index, 1);
  }
  // TODO(kara): remove after deprecation period
  function _ngModelWarning(name, type, instance, warningConfig) {
      if (warningConfig === 'never')
          return;
      if (((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce) ||
          (warningConfig === 'always' && !instance._ngModelWarningSent)) {
          console.warn(ngModelWarning(name));
          type._ngModelWarningSentOnce = true;
          instance._ngModelWarningSent = true;
      }
  }

  const formDirectiveProvider$1 = {
      provide: ControlContainer,
      useExisting: i0.forwardRef(() => NgForm)
  };
  const resolvedPromise$1 = (() => Promise.resolve())();
  /**
   * @description
   * Creates a top-level `FormGroup` instance and binds it to a form
   * to track aggregate form value and validation status.
   *
   * As soon as you import the `FormsModule`, this directive becomes active by default on
   * all `<form>` tags.  You don't need to add a special selector.
   *
   * You optionally export the directive into a local template variable using `ngForm` as the key
   * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
   * `FormGroup` instance are duplicated on the directive itself, so a reference to it
   * gives you access to the aggregate value and validity status of the form, as well as
   * user interaction properties like `dirty` and `touched`.
   *
   * To register child controls with the form, use `NgModel` with a `name`
   * attribute. You may use `NgModelGroup` to create sub-groups within the form.
   *
   * If necessary, listen to the directive's `ngSubmit` event to be notified when the user has
   * triggered a form submission. The `ngSubmit` event emits the original form
   * submission event.
   *
   * In template driven forms, all `<form>` tags are automatically tagged as `NgForm`.
   * To import the `FormsModule` but skip its usage in some forms,
   * for example, to use native HTML5 validation, add the `ngNoForm` and the `<form>`
   * tags won't create an `NgForm` directive. In reactive forms, using `ngNoForm` is
   * unnecessary because the `<form>` tags are inert. In that case, you would
   * refrain from using the `formGroup` directive.
   *
   * @usageNotes
   *
   * ### Listening for form submission
   *
   * The following example shows how to capture the form values from the "ngSubmit" event.
   *
   * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
   *
   * ### Setting the update options
   *
   * The following example shows you how to change the "updateOn" option from its default using
   * ngFormOptions.
   *
   * ```html
   * <form [ngFormOptions]="{updateOn: 'blur'}">
   *    <input name="one" ngModel>  <!-- this ngModel will update on blur -->
   * </form>
   * ```
   *
   * ### Native DOM validation UI
   *
   * In order to prevent the native DOM form validation UI from interfering with Angular's form
   * validation, Angular automatically adds the `novalidate` attribute on any `<form>` whenever
   * `FormModule` or `ReactiveFormModule` are imported into the application.
   * If you want to explicitly enable native DOM validation UI with Angular forms, you can add the
   * `ngNativeValidate` attribute to the `<form>` element:
   *
   * ```html
   * <form ngNativeValidate>
   *   ...
   * </form>
   * ```
   *
   * @ngModule FormsModule
   * @publicApi
   */
  class NgForm extends ControlContainer {
      constructor(validators, asyncValidators, callSetDisabledState) {
          super();
          this.callSetDisabledState = callSetDisabledState;
          /**
           * @description
           * Returns whether the form submission has been triggered.
           */
          this.submitted = false;
          this._directives = new Set();
          /**
           * @description
           * Event emitter for the "ngSubmit" event
           */
          this.ngSubmit = new i0.EventEmitter();
          this.form =
              new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
      }
      /** @nodoc */
      ngAfterViewInit() {
          this._setUpdateStrategy();
      }
      /**
       * @description
       * The directive instance.
       */
      get formDirective() {
          return this;
      }
      /**
       * @description
       * The internal `FormGroup` instance.
       */
      get control() {
          return this.form;
      }
      /**
       * @description
       * Returns an array representing the path to this group. Because this directive
       * always lives at the top level of a form, it is always an empty array.
       */
      get path() {
          return [];
      }
      /**
       * @description
       * Returns a map of the controls in this group.
       */
      get controls() {
          return this.form.controls;
      }
      /**
       * @description
       * Method that sets up the control directive in this group, re-calculates its value
       * and validity, and adds the instance to the internal list of directives.
       *
       * @param dir The `NgModel` directive instance.
       */
      addControl(dir) {
          resolvedPromise$1.then(() => {
              const container = this._findContainer(dir.path);
              dir.control =
                  container.registerControl(dir.name, dir.control);
              setUpControl(dir.control, dir, this.callSetDisabledState);
              dir.control.updateValueAndValidity({ emitEvent: false });
              this._directives.add(dir);
          });
      }
      /**
       * @description
       * Retrieves the `FormControl` instance from the provided `NgModel` directive.
       *
       * @param dir The `NgModel` directive instance.
       */
      getControl(dir) {
          return this.form.get(dir.path);
      }
      /**
       * @description
       * Removes the `NgModel` instance from the internal list of directives
       *
       * @param dir The `NgModel` directive instance.
       */
      removeControl(dir) {
          resolvedPromise$1.then(() => {
              const container = this._findContainer(dir.path);
              if (container) {
                  container.removeControl(dir.name);
              }
              this._directives.delete(dir);
          });
      }
      /**
       * @description
       * Adds a new `NgModelGroup` directive instance to the form.
       *
       * @param dir The `NgModelGroup` directive instance.
       */
      addFormGroup(dir) {
          resolvedPromise$1.then(() => {
              const container = this._findContainer(dir.path);
              const group = new FormGroup({});
              setUpFormContainer(group, dir);
              container.registerControl(dir.name, group);
              group.updateValueAndValidity({ emitEvent: false });
          });
      }
      /**
       * @description
       * Removes the `NgModelGroup` directive instance from the form.
       *
       * @param dir The `NgModelGroup` directive instance.
       */
      removeFormGroup(dir) {
          resolvedPromise$1.then(() => {
              const container = this._findContainer(dir.path);
              if (container) {
                  container.removeControl(dir.name);
              }
          });
      }
      /**
       * @description
       * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
       *
       * @param dir The `NgModelGroup` directive instance.
       */
      getFormGroup(dir) {
          return this.form.get(dir.path);
      }
      /**
       * Sets the new value for the provided `NgControl` directive.
       *
       * @param dir The `NgControl` directive instance.
       * @param value The new value for the directive's control.
       */
      updateModel(dir, value) {
          resolvedPromise$1.then(() => {
              const ctrl = this.form.get(dir.path);
              ctrl.setValue(value);
          });
      }
      /**
       * @description
       * Sets the value for this `FormGroup`.
       *
       * @param value The new value
       */
      setValue(value) {
          this.control.setValue(value);
      }
      /**
       * @description
       * Method called when the "submit" event is triggered on the form.
       * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
       *
       * @param $event The "submit" event object
       */
      onSubmit($event) {
          this.submitted = true;
          syncPendingControls(this.form, this._directives);
          this.ngSubmit.emit($event);
          // Forms with `method="dialog"` have some special behavior
          // that won't reload the page and that shouldn't be prevented.
          return $event?.target?.method === 'dialog';
      }
      /**
       * @description
       * Method called when the "reset" event is triggered on the form.
       */
      onReset() {
          this.resetForm();
      }
      /**
       * @description
       * Resets the form to an initial value and resets its submitted status.
       *
       * @param value The new value for the form.
       */
      resetForm(value = undefined) {
          this.form.reset(value);
          this.submitted = false;
      }
      _setUpdateStrategy() {
          if (this.options && this.options.updateOn != null) {
              this.form._updateOn = this.options.updateOn;
          }
      }
      _findContainer(path) {
          path.pop();
          return path.length ? this.form.get(path) : this.form;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgForm, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: { options: ["ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider$1], exportAs: ["ngForm"], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgForm, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]',
                      providers: [formDirectiveProvider$1],
                      host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                      outputs: ['ngSubmit'],
                      exportAs: 'ngForm'
                  }]
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_ASYNC_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [CALL_SET_DISABLED_STATE]
                  }] }], propDecorators: { options: [{
                  type: i0.Input,
                  args: ['ngFormOptions']
              }] } });

  function removeListItem(list, el) {
      const index = list.indexOf(el);
      if (index > -1)
          list.splice(index, 1);
  }

  function isFormControlState(formState) {
      return typeof formState === 'object' && formState !== null &&
          Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
  }
  const FormControl = (class FormControl extends AbstractControl {
      constructor(
      // formState and defaultValue will only be null if T is nullable
      formState = null, validatorOrOpts, asyncValidator) {
          super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
          /** @publicApi */
          this.defaultValue = null;
          /** @internal */
          this._onChange = [];
          /** @internal */
          this._pendingChange = false;
          this._applyFormState(formState);
          this._setUpdateStrategy(validatorOrOpts);
          this._initObservables();
          this.updateValueAndValidity({
              onlySelf: true,
              // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
              // `VALID` or `INVALID`.
              // The status should be broadcasted via the `statusChanges` observable, so we set
              // `emitEvent` to `true` to allow that during the control creation process.
              emitEvent: !!this.asyncValidator
          });
          if (isOptionsObj(validatorOrOpts) &&
              (validatorOrOpts.nonNullable || validatorOrOpts.initialValueIsDefault)) {
              if (isFormControlState(formState)) {
                  this.defaultValue = formState.value;
              }
              else {
                  this.defaultValue = formState;
              }
          }
      }
      setValue(value, options = {}) {
          this.value = this._pendingValue = value;
          if (this._onChange.length && options.emitModelToViewChange !== false) {
              this._onChange.forEach((changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
          }
          this.updateValueAndValidity(options);
      }
      patchValue(value, options = {}) {
          this.setValue(value, options);
      }
      reset(formState = this.defaultValue, options = {}) {
          this._applyFormState(formState);
          this.markAsPristine(options);
          this.markAsUntouched(options);
          this.setValue(this.value, options);
          this._pendingChange = false;
      }
      /**  @internal */
      _updateValue() { }
      /**  @internal */
      _anyControls(condition) {
          return false;
      }
      /**  @internal */
      _allControlsDisabled() {
          return this.disabled;
      }
      registerOnChange(fn) {
          this._onChange.push(fn);
      }
      /** @internal */
      _unregisterOnChange(fn) {
          removeListItem(this._onChange, fn);
      }
      registerOnDisabledChange(fn) {
          this._onDisabledChange.push(fn);
      }
      /** @internal */
      _unregisterOnDisabledChange(fn) {
          removeListItem(this._onDisabledChange, fn);
      }
      /** @internal */
      _forEachChild(cb) { }
      /** @internal */
      _syncPendingControls() {
          if (this.updateOn === 'submit') {
              if (this._pendingDirty)
                  this.markAsDirty();
              if (this._pendingTouched)
                  this.markAsTouched();
              if (this._pendingChange) {
                  this.setValue(this._pendingValue, { onlySelf: true, emitModelToViewChange: false });
                  return true;
              }
          }
          return false;
      }
      _applyFormState(formState) {
          if (isFormControlState(formState)) {
              this.value = this._pendingValue = formState.value;
              formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                  this.enable({ onlySelf: true, emitEvent: false });
          }
          else {
              this.value = this._pendingValue = formState;
          }
      }
  });
  const UntypedFormControl = FormControl;
  /**
   * @description
   * Asserts that the given control is an instance of `FormControl`
   *
   * @publicApi
   */
  const isFormControl = (control) => control instanceof FormControl;

  /**
   * @description
   * A base class for code shared between the `NgModelGroup` and `FormGroupName` directives.
   *
   * @publicApi
   */
  class AbstractFormGroupDirective extends ControlContainer {
      /** @nodoc */
      ngOnInit() {
          this._checkParentType();
          // Register the group with its parent group.
          this.formDirective.addFormGroup(this);
      }
      /** @nodoc */
      ngOnDestroy() {
          if (this.formDirective) {
              // Remove the group from its parent group.
              this.formDirective.removeFormGroup(this);
          }
      }
      /**
       * @description
       * The `FormGroup` bound to this directive.
       */
      get control() {
          return this.formDirective.getFormGroup(this);
      }
      /**
       * @description
       * The path to this group from the top-level directive.
       */
      get path() {
          return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
      }
      /**
       * @description
       * The top-level directive for this group if present, otherwise null.
       */
      get formDirective() {
          return this._parent ? this._parent.formDirective : null;
      }
      /** @internal */
      _checkParentType() { }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: AbstractFormGroupDirective, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: AbstractFormGroupDirective, usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: AbstractFormGroupDirective, decorators: [{
              type: i0.Directive
          }] });

  function modelParentException() {
      return new i0.ɵRuntimeError(1350 /* RuntimeErrorCode.NGMODEL_IN_FORM_GROUP */, `
    ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
    formGroup's partner directive "formControlName" instead.  Example:

    ${formControlNameExample}

    Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

    Example:

    ${ngModelWithFormGroupExample}`);
  }
  function formGroupNameException() {
      return new i0.ɵRuntimeError(1351 /* RuntimeErrorCode.NGMODEL_IN_FORM_GROUP_NAME */, `
    ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

    Option 1: Use formControlName instead of ngModel (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

    ${ngModelGroupExample}`);
  }
  function missingNameException() {
      return new i0.ɵRuntimeError(1352 /* RuntimeErrorCode.NGMODEL_WITHOUT_NAME */, `If ngModel is used within a form tag, either the name attribute must be set or the form
    control must be defined as 'standalone' in ngModelOptions.

    Example 1: <input [(ngModel)]="person.firstName" name="first">
    Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
  }
  function modelGroupParentException() {
      return new i0.ɵRuntimeError(1353 /* RuntimeErrorCode.NGMODELGROUP_IN_FORM_GROUP */, `
    ngModelGroup cannot be used with a parent formGroup directive.

    Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

    ${ngModelGroupExample}`);
  }

  const modelGroupProvider = {
      provide: ControlContainer,
      useExisting: i0.forwardRef(() => NgModelGroup)
  };
  /**
   * @description
   * Creates and binds a `FormGroup` instance to a DOM element.
   *
   * This directive can only be used as a child of `NgForm` (within `<form>` tags).
   *
   * Use this directive to validate a sub-group of your form separately from the
   * rest of your form, or if some values in your domain model make more sense
   * to consume together in a nested object.
   *
   * Provide a name for the sub-group and it will become the key
   * for the sub-group in the form's full value. If you need direct access, export the directive into
   * a local template variable using `ngModelGroup` (ex: `#myGroup="ngModelGroup"`).
   *
   * @usageNotes
   *
   * ### Consuming controls in a grouping
   *
   * The following example shows you how to combine controls together in a sub-group
   * of the form.
   *
   * {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
   *
   * @ngModule FormsModule
   * @publicApi
   */
  class NgModelGroup extends AbstractFormGroupDirective {
      constructor(parent, validators, asyncValidators) {
          super();
          /**
           * @description
           * Tracks the name of the `NgModelGroup` bound to the directive. The name corresponds
           * to a key in the parent `NgForm`.
           */
          this.name = '';
          this._parent = parent;
          this._setValidators(validators);
          this._setAsyncValidators(asyncValidators);
      }
      /** @internal */
      _checkParentType() {
          if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm) &&
              (typeof ngDevMode === 'undefined' || ngDevMode)) {
              throw modelGroupParentException();
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgModelGroup, deps: [{ token: ControlContainer, host: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgModelGroup, selector: "[ngModelGroup]", inputs: { name: ["ngModelGroup", "name"] }, providers: [modelGroupProvider], exportAs: ["ngModelGroup"], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgModelGroup, decorators: [{
              type: i0.Directive,
              args: [{ selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup' }]
          }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                      type: i0.Host
                  }, {
                      type: i0.SkipSelf
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_ASYNC_VALIDATORS]
                  }] }], propDecorators: { name: [{
                  type: i0.Input,
                  args: ['ngModelGroup']
              }] } });

  const formControlBinding$1 = {
      provide: NgControl,
      useExisting: i0.forwardRef(() => NgModel)
  };
  /**
   * `ngModel` forces an additional change detection run when its inputs change:
   * E.g.:
   * ```
   * <div>{{myModel.valid}}</div>
   * <input [(ngModel)]="myValue" #myModel="ngModel">
   * ```
   * I.e. `ngModel` can export itself on the element and then be used in the template.
   * Normally, this would result in expressions before the `input` that use the exported directive
   * to have an old value as they have been
   * dirty checked before. As this is a very common case for `ngModel`, we added this second change
   * detection run.
   *
   * Notes:
   * - this is just one extra run no matter how many `ngModel`s have been changed.
   * - this is a general problem when using `exportAs` for directives!
   */
  const resolvedPromise = (() => Promise.resolve())();
  /**
   * @description
   * Creates a `FormControl` instance from a [domain
   * model](https://en.wikipedia.org/wiki/Domain_model) and binds it to a form control element.
   *
   * The `FormControl` instance tracks the value, user interaction, and
   * validation status of the control and keeps the view synced with the model. If used
   * within a parent form, the directive also registers itself with the form as a child
   * control.
   *
   * This directive is used by itself or as part of a larger form. Use the
   * `ngModel` selector to activate it.
   *
   * It accepts a domain model as an optional `Input`. If you have a one-way binding
   * to `ngModel` with `[]` syntax, changing the domain model's value in the component
   * class sets the value in the view. If you have a two-way binding with `[()]` syntax
   * (also known as 'banana-in-a-box syntax'), the value in the UI always syncs back to
   * the domain model in your class.
   *
   * To inspect the properties of the associated `FormControl` (like the validity state),
   * export the directive into a local template variable using `ngModel` as the key (ex:
   * `#myVar="ngModel"`). You can then access the control using the directive's `control` property.
   * However, the most commonly used properties (like `valid` and `dirty`) also exist on the control
   * for direct access. See a full list of properties directly available in
   * `AbstractControlDirective`.
   *
   * @see {@link RadioControlValueAccessor}
   * @see {@link SelectControlValueAccessor}
   *
   * @usageNotes
   *
   * ### Using ngModel on a standalone control
   *
   * The following examples show a simple standalone control using `ngModel`:
   *
   * {@example forms/ts/simpleNgModel/simple_ng_model_example.ts region='Component'}
   *
   * When using the `ngModel` within `<form>` tags, you'll also need to supply a `name` attribute
   * so that the control can be registered with the parent form under that name.
   *
   * In the context of a parent form, it's often unnecessary to include one-way or two-way binding,
   * as the parent form syncs the value for you. You access its properties by exporting it into a
   * local template variable using `ngForm` such as (`#f="ngForm"`). Use the variable where
   * needed on form submission.
   *
   * If you do need to populate initial values into your form, using a one-way binding for
   * `ngModel` tends to be sufficient as long as you use the exported form's value rather
   * than the domain model's value on submit.
   *
   * ### Using ngModel within a form
   *
   * The following example shows controls using `ngModel` within a form:
   *
   * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
   *
   * ### Using a standalone ngModel within a group
   *
   * The following example shows you how to use a standalone ngModel control
   * within a form. This controls the display of the form, but doesn't contain form data.
   *
   * ```html
   * <form>
   *   <input name="login" ngModel placeholder="Login">
   *   <input type="checkbox" ngModel [ngModelOptions]="{standalone: true}"> Show more options?
   * </form>
   * <!-- form value: {login: ''} -->
   * ```
   *
   * ### Setting the ngModel `name` attribute through options
   *
   * The following example shows you an alternate way to set the name attribute. Here,
   * an attribute identified as name is used within a custom form control component. To still be able
   * to specify the NgModel's name, you must specify it using the `ngModelOptions` input instead.
   *
   * ```html
   * <form>
   *   <my-custom-form-control name="Nancy" ngModel [ngModelOptions]="{name: 'user'}">
   *   </my-custom-form-control>
   * </form>
   * <!-- form value: {user: ''} -->
   * ```
   *
   * @ngModule FormsModule
   * @publicApi
   */
  class NgModel extends NgControl {
      constructor(parent, validators, asyncValidators, valueAccessors, _changeDetectorRef, callSetDisabledState) {
          super();
          this._changeDetectorRef = _changeDetectorRef;
          this.callSetDisabledState = callSetDisabledState;
          this.control = new FormControl();
          /** @internal */
          this._registered = false;
          /**
           * @description
           * Tracks the name bound to the directive. If a parent form exists, it
           * uses this name as a key to retrieve this control's value.
           */
          this.name = '';
          /**
           * @description
           * Event emitter for producing the `ngModelChange` event after
           * the view model updates.
           */
          this.update = new i0.EventEmitter();
          this._parent = parent;
          this._setValidators(validators);
          this._setAsyncValidators(asyncValidators);
          this.valueAccessor = selectValueAccessor(this, valueAccessors);
      }
      /** @nodoc */
      ngOnChanges(changes) {
          this._checkForErrors();
          if (!this._registered || 'name' in changes) {
              if (this._registered) {
                  this._checkName();
                  if (this.formDirective) {
                      // We can't call `formDirective.removeControl(this)`, because the `name` has already been
                      // changed. We also can't reset the name temporarily since the logic in `removeControl`
                      // is inside a promise and it won't run immediately. We work around it by giving it an
                      // object with the same shape instead.
                      const oldName = changes['name'].previousValue;
                      this.formDirective.removeControl({ name: oldName, path: this._getPath(oldName) });
                  }
              }
              this._setUpControl();
          }
          if ('isDisabled' in changes) {
              this._updateDisabled(changes);
          }
          if (isPropertyUpdated(changes, this.viewModel)) {
              this._updateValue(this.model);
              this.viewModel = this.model;
          }
      }
      /** @nodoc */
      ngOnDestroy() {
          this.formDirective && this.formDirective.removeControl(this);
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
          return this._getPath(this.name);
      }
      /**
       * @description
       * The top-level directive for this control if present, otherwise null.
       */
      get formDirective() {
          return this._parent ? this._parent.formDirective : null;
      }
      /**
       * @description
       * Sets the new value for the view model and emits an `ngModelChange` event.
       *
       * @param newValue The new value emitted by `ngModelChange`.
       */
      viewToModelUpdate(newValue) {
          this.viewModel = newValue;
          this.update.emit(newValue);
      }
      _setUpControl() {
          this._setUpdateStrategy();
          this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
          this._registered = true;
      }
      _setUpdateStrategy() {
          if (this.options && this.options.updateOn != null) {
              this.control._updateOn = this.options.updateOn;
          }
      }
      _isStandalone() {
          return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
          setUpControl(this.control, this, this.callSetDisabledState);
          this.control.updateValueAndValidity({ emitEvent: false });
      }
      _checkForErrors() {
          if (!this._isStandalone()) {
              this._checkParentType();
          }
          this._checkName();
      }
      _checkParentType() {
          if (typeof ngDevMode === 'undefined' || ngDevMode) {
              if (!(this._parent instanceof NgModelGroup) &&
                  this._parent instanceof AbstractFormGroupDirective) {
                  throw formGroupNameException();
              }
              else if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
                  throw modelParentException();
              }
          }
      }
      _checkName() {
          if (this.options && this.options.name)
              this.name = this.options.name;
          if (!this._isStandalone() && !this.name && (typeof ngDevMode === 'undefined' || ngDevMode)) {
              throw missingNameException();
          }
      }
      _updateValue(value) {
          resolvedPromise.then(() => {
              this.control.setValue(value, { emitViewToModelChange: false });
              this._changeDetectorRef?.markForCheck();
          });
      }
      _updateDisabled(changes) {
          const disabledValue = changes['isDisabled'].currentValue;
          // checking for 0 to avoid breaking change
          const isDisabled = disabledValue !== 0 && i0.booleanAttribute(disabledValue);
          resolvedPromise.then(() => {
              if (isDisabled && !this.control.disabled) {
                  this.control.disable();
              }
              else if (!isDisabled && this.control.disabled) {
                  this.control.enable();
              }
              this._changeDetectorRef?.markForCheck();
          });
      }
      _getPath(controlName) {
          return this._parent ? controlPath(controlName, this._parent) : [controlName];
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgModel, deps: [{ token: ControlContainer, host: true, optional: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: i0.ChangeDetectorRef, optional: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: { name: "name", isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"], options: ["ngModelOptions", "options"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding$1], exportAs: ["ngModel"], usesInheritance: true, usesOnChanges: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgModel, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[ngModel]:not([formControlName]):not([formControl])',
                      providers: [formControlBinding$1],
                      exportAs: 'ngModel'
                  }]
          }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Host
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_ASYNC_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALUE_ACCESSOR]
                  }] }, { type: i0__namespace.ChangeDetectorRef, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [i0.ChangeDetectorRef]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [CALL_SET_DISABLED_STATE]
                  }] }], propDecorators: { name: [{
                  type: i0.Input
              }], isDisabled: [{
                  type: i0.Input,
                  args: ['disabled']
              }], model: [{
                  type: i0.Input,
                  args: ['ngModel']
              }], options: [{
                  type: i0.Input,
                  args: ['ngModelOptions']
              }], update: [{
                  type: i0.Output,
                  args: ['ngModelChange']
              }] } });

  /**
   * @description
   *
   * Adds `novalidate` attribute to all forms by default.
   *
   * `novalidate` is used to disable browser's native form validation.
   *
   * If you want to use native validation with Angular forms, just add `ngNativeValidate` attribute:
   *
   * ```
   * <form ngNativeValidate></form>
   * ```
   *
   * @publicApi
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   */
  class ɵNgNoValidate {
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ɵNgNoValidate, deps: [], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])", host: { attributes: { "novalidate": "" } }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ɵNgNoValidate, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
                      host: { 'novalidate': '' },
                  }]
          }] });

  const NUMBER_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: i0.forwardRef(() => NumberValueAccessor),
      multi: true
  };
  /**
   * @description
   * The `ControlValueAccessor` for writing a number value and listening to number input changes.
   * The value accessor is used by the `FormControlDirective`, `FormControlName`, and `NgModel`
   * directives.
   *
   * @usageNotes
   *
   * ### Using a number input with a reactive form.
   *
   * The following example shows how to use a number input with a reactive form.
   *
   * ```ts
   * const totalCountControl = new FormControl();
   * ```
   *
   * ```
   * <input type="number" [formControl]="totalCountControl">
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class NumberValueAccessor extends BuiltInControlValueAccessor {
      /**
       * Sets the "value" property on the input element.
       * @nodoc
       */
      writeValue(value) {
          // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
          const normalizedValue = value == null ? '' : value;
          this.setProperty('value', normalizedValue);
      }
      /**
       * Registers a function called when the control value changes.
       * @nodoc
       */
      registerOnChange(fn) {
          this.onChange = (value) => {
              fn(value == '' ? null : parseFloat(value));
          };
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NumberValueAccessor, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]", host: { listeners: { "input": "onChange($event.target.value)", "blur": "onTouched()" } }, providers: [NUMBER_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NumberValueAccessor, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
                      host: { '(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                      providers: [NUMBER_VALUE_ACCESSOR]
                  }]
          }] });

  const RADIO_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: i0.forwardRef(() => RadioControlValueAccessor),
      multi: true
  };
  function throwNameError() {
      throw new i0.ɵRuntimeError(1202 /* RuntimeErrorCode.NAME_AND_FORM_CONTROL_NAME_MUST_MATCH */, `
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
  }
  /**
   * @description
   * Class used by Angular to track radio buttons. For internal use only.
   */
  class RadioControlRegistry {
      constructor() {
          this._accessors = [];
      }
      /**
       * @description
       * Adds a control to the internal registry. For internal use only.
       */
      add(control, accessor) {
          this._accessors.push([control, accessor]);
      }
      /**
       * @description
       * Removes a control from the internal registry. For internal use only.
       */
      remove(accessor) {
          for (let i = this._accessors.length - 1; i >= 0; --i) {
              if (this._accessors[i][1] === accessor) {
                  this._accessors.splice(i, 1);
                  return;
              }
          }
      }
      /**
       * @description
       * Selects a radio button. For internal use only.
       */
      select(accessor) {
          this._accessors.forEach((c) => {
              if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
                  c[1].fireUncheck(accessor.value);
              }
          });
      }
      _isSameGroup(controlPair, accessor) {
          if (!controlPair[0].control)
              return false;
          return controlPair[0]._parent === accessor._control._parent &&
              controlPair[1].name === accessor.name;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RadioControlRegistry, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RadioControlRegistry, providedIn: 'root' }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RadioControlRegistry, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'root' }]
          }] });
  /**
   * @description
   * The `ControlValueAccessor` for writing radio control values and listening to radio control
   * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
   * `NgModel` directives.
   *
   * @usageNotes
   *
   * ### Using radio buttons with reactive form directives
   *
   * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
   * a reactive form, radio buttons in the same group should have the same `formControlName`.
   * Providing a `name` attribute is optional.
   *
   * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class RadioControlValueAccessor extends BuiltInControlValueAccessor {
      constructor(renderer, elementRef, _registry, _injector) {
          super(renderer, elementRef);
          this._registry = _registry;
          this._injector = _injector;
          this.setDisabledStateFired = false;
          /**
           * The registered callback function called when a change event occurs on the input element.
           * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
           * to override the `onChange` function (which expects 1 argument) in the parent
           * `BaseControlValueAccessor` class.
           * @nodoc
           */
          this.onChange = () => { };
          this.callSetDisabledState = i0.inject(CALL_SET_DISABLED_STATE, { optional: true }) ?? setDisabledStateDefault;
      }
      /** @nodoc */
      ngOnInit() {
          this._control = this._injector.get(NgControl);
          this._checkName();
          this._registry.add(this._control, this);
      }
      /** @nodoc */
      ngOnDestroy() {
          this._registry.remove(this);
      }
      /**
       * Sets the "checked" property value on the radio input element.
       * @nodoc
       */
      writeValue(value) {
          this._state = value === this.value;
          this.setProperty('checked', this._state);
      }
      /**
       * Registers a function called when the control value changes.
       * @nodoc
       */
      registerOnChange(fn) {
          this._fn = fn;
          this.onChange = () => {
              fn(this.value);
              this._registry.select(this);
          };
      }
      /** @nodoc */
      setDisabledState(isDisabled) {
          /**
           * `setDisabledState` is supposed to be called whenever the disabled state of a control changes,
           * including upon control creation. However, a longstanding bug caused the method to not fire
           * when an *enabled* control was attached. This bug was fixed in v15 in #47576.
           *
           * This had a side effect: previously, it was possible to instantiate a reactive form control
           * with `[attr.disabled]=true`, even though the corresponding control was enabled in the
           * model. This resulted in a mismatch between the model and the DOM. Now, because
           * `setDisabledState` is always called, the value in the DOM will be immediately overwritten
           * with the "correct" enabled value.
           *
           * However, the fix also created an exceptional case: radio buttons. Because Reactive Forms
           * models the entire group of radio buttons as a single `FormControl`, there is no way to
           * control the disabled state for individual radios, so they can no longer be configured as
           * disabled. Thus, we keep the old behavior for radio buttons, so that `[attr.disabled]`
           * continues to work. Specifically, we drop the first call to `setDisabledState` if `disabled`
           * is `false`, and we are not in legacy mode.
           */
          if (this.setDisabledStateFired || isDisabled ||
              this.callSetDisabledState === 'whenDisabledForLegacyCode') {
              this.setProperty('disabled', isDisabled);
          }
          this.setDisabledStateFired = true;
      }
      /**
       * Sets the "value" on the radio input element and unchecks it.
       *
       * @param value
       */
      fireUncheck(value) {
          this.writeValue(value);
      }
      _checkName() {
          if (this.name && this.formControlName && this.name !== this.formControlName &&
              (typeof ngDevMode === 'undefined' || ngDevMode)) {
              throwNameError();
          }
          if (!this.name && this.formControlName)
              this.name = this.formControlName;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RadioControlValueAccessor, deps: [{ token: i0__namespace.Renderer2 }, { token: i0__namespace.ElementRef }, { token: RadioControlRegistry }, { token: i0__namespace.Injector }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: { name: "name", formControlName: "formControlName", value: "value" }, host: { listeners: { "change": "onChange()", "blur": "onTouched()" } }, providers: [RADIO_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RadioControlValueAccessor, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
                      host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
                      providers: [RADIO_VALUE_ACCESSOR]
                  }]
          }], ctorParameters: () => [{ type: i0__namespace.Renderer2 }, { type: i0__namespace.ElementRef }, { type: RadioControlRegistry }, { type: i0__namespace.Injector }], propDecorators: { name: [{
                  type: i0.Input
              }], formControlName: [{
                  type: i0.Input
              }], value: [{
                  type: i0.Input
              }] } });

  const RANGE_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: i0.forwardRef(() => RangeValueAccessor),
      multi: true
  };
  /**
   * @description
   * The `ControlValueAccessor` for writing a range value and listening to range input changes.
   * The value accessor is used by the `FormControlDirective`, `FormControlName`, and  `NgModel`
   * directives.
   *
   * @usageNotes
   *
   * ### Using a range input with a reactive form
   *
   * The following example shows how to use a range input with a reactive form.
   *
   * ```ts
   * const ageControl = new FormControl();
   * ```
   *
   * ```
   * <input type="range" [formControl]="ageControl">
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class RangeValueAccessor extends BuiltInControlValueAccessor {
      /**
       * Sets the "value" property on the input element.
       * @nodoc
       */
      writeValue(value) {
          this.setProperty('value', parseFloat(value));
      }
      /**
       * Registers a function called when the control value changes.
       * @nodoc
       */
      registerOnChange(fn) {
          this.onChange = (value) => {
              fn(value == '' ? null : parseFloat(value));
          };
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RangeValueAccessor, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: RangeValueAccessor, selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]", host: { listeners: { "change": "onChange($event.target.value)", "input": "onChange($event.target.value)", "blur": "onTouched()" } }, providers: [RANGE_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RangeValueAccessor, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]',
                      host: {
                          '(change)': 'onChange($event.target.value)',
                          '(input)': 'onChange($event.target.value)',
                          '(blur)': 'onTouched()'
                      },
                      providers: [RANGE_VALUE_ACCESSOR]
                  }]
          }] });

  /**
   * Token to provide to turn off the ngModel warning on formControl and formControlName.
   */
  const NG_MODEL_WITH_FORM_CONTROL_WARNING = new i0.InjectionToken(ngDevMode ? 'NgModelWithFormControlWarning' : '');
  const formControlBinding = {
      provide: NgControl,
      useExisting: i0.forwardRef(() => FormControlDirective)
  };
  /**
   * @description
   * Synchronizes a standalone `FormControl` instance to a form control element.
   *
   * Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
   * form directives was deprecated in Angular v6 and is scheduled for removal in
   * a future version of Angular.
   * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
   *
   * @see [Reactive Forms Guide](guide/reactive-forms)
   * @see {@link FormControl}
   * @see {@link AbstractControl}
   *
   * @usageNotes
   *
   * The following example shows how to register a standalone control and set its value.
   *
   * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
   *
   * @ngModule ReactiveFormsModule
   * @publicApi
   */
  class FormControlDirective extends NgControl {
      /**
       * @description
       * Triggers a warning in dev mode that this input should not be used with reactive forms.
       */
      set isDisabled(isDisabled) {
          if (typeof ngDevMode === 'undefined' || ngDevMode) {
              console.warn(disabledAttrWarning);
          }
      }
      /**
       * @description
       * Static property used to track whether any ngModel warnings have been sent across
       * all instances of FormControlDirective. Used to support warning config of "once".
       *
       * @internal
       */
      static { this._ngModelWarningSentOnce = false; }
      constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig, callSetDisabledState) {
          super();
          this._ngModelWarningConfig = _ngModelWarningConfig;
          this.callSetDisabledState = callSetDisabledState;
          /** @deprecated as of v6 */
          this.update = new i0.EventEmitter();
          /**
           * @description
           * Instance property used to track whether an ngModel warning has been sent out for this
           * particular `FormControlDirective` instance. Used to support warning config of "always".
           *
           * @internal
           */
          this._ngModelWarningSent = false;
          this._setValidators(validators);
          this._setAsyncValidators(asyncValidators);
          this.valueAccessor = selectValueAccessor(this, valueAccessors);
      }
      /** @nodoc */
      ngOnChanges(changes) {
          if (this._isControlChanged(changes)) {
              const previousForm = changes['form'].previousValue;
              if (previousForm) {
                  cleanUpControl(previousForm, this, /* validateControlPresenceOnChange */ false);
              }
              setUpControl(this.form, this, this.callSetDisabledState);
              this.form.updateValueAndValidity({ emitEvent: false });
          }
          if (isPropertyUpdated(changes, this.viewModel)) {
              if (typeof ngDevMode === 'undefined' || ngDevMode) {
                  _ngModelWarning('formControl', FormControlDirective, this, this._ngModelWarningConfig);
              }
              this.form.setValue(this.model);
              this.viewModel = this.model;
          }
      }
      /** @nodoc */
      ngOnDestroy() {
          if (this.form) {
              cleanUpControl(this.form, this, /* validateControlPresenceOnChange */ false);
          }
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
          return [];
      }
      /**
       * @description
       * The `FormControl` bound to this directive.
       */
      get control() {
          return this.form;
      }
      /**
       * @description
       * Sets the new value for the view model and emits an `ngModelChange` event.
       *
       * @param newValue The new value for the view model.
       */
      viewToModelUpdate(newValue) {
          this.viewModel = newValue;
          this.update.emit(newValue);
      }
      _isControlChanged(changes) {
          return changes.hasOwnProperty('form');
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormControlDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: NG_MODEL_WITH_FORM_CONTROL_WARNING, optional: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: FormControlDirective, selector: "[formControl]", inputs: { form: ["formControl", "form"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormControlDirective, decorators: [{
              type: i0.Directive,
              args: [{ selector: '[formControl]', providers: [formControlBinding], exportAs: 'ngForm' }]
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_ASYNC_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALUE_ACCESSOR]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [CALL_SET_DISABLED_STATE]
                  }] }], propDecorators: { form: [{
                  type: i0.Input,
                  args: ['formControl']
              }], isDisabled: [{
                  type: i0.Input,
                  args: ['disabled']
              }], model: [{
                  type: i0.Input,
                  args: ['ngModel']
              }], update: [{
                  type: i0.Output,
                  args: ['ngModelChange']
              }] } });

  const formDirectiveProvider = {
      provide: ControlContainer,
      useExisting: i0.forwardRef(() => FormGroupDirective)
  };
  /**
   * @description
   *
   * Binds an existing `FormGroup` or `FormRecord` to a DOM element.
   *
   * This directive accepts an existing `FormGroup` instance. It will then use this
   * `FormGroup` instance to match any child `FormControl`, `FormGroup`/`FormRecord`,
   * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
   * and `FormArrayName` directives.
   *
   * @see [Reactive Forms Guide](guide/reactive-forms)
   * @see {@link AbstractControl}
   *
   * @usageNotes
   * ### Register Form Group
   *
   * The following example registers a `FormGroup` with first name and last name controls,
   * and listens for the *ngSubmit* event when the button is clicked.
   *
   * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
   *
   * @ngModule ReactiveFormsModule
   * @publicApi
   */
  class FormGroupDirective extends ControlContainer {
      constructor(validators, asyncValidators, callSetDisabledState) {
          super();
          this.callSetDisabledState = callSetDisabledState;
          /**
           * @description
           * Reports whether the form submission has been triggered.
           */
          this.submitted = false;
          /**
           * Callback that should be invoked when controls in FormGroup or FormArray collection change
           * (added or removed). This callback triggers corresponding DOM updates.
           */
          this._onCollectionChange = () => this._updateDomValue();
          /**
           * @description
           * Tracks the list of added `FormControlName` instances
           */
          this.directives = [];
          /**
           * @description
           * Tracks the `FormGroup` bound to this directive.
           */
          this.form = null;
          /**
           * @description
           * Emits an event when the form submission has been triggered.
           */
          this.ngSubmit = new i0.EventEmitter();
          this._setValidators(validators);
          this._setAsyncValidators(asyncValidators);
      }
      /** @nodoc */
      ngOnChanges(changes) {
          this._checkFormPresent();
          if (changes.hasOwnProperty('form')) {
              this._updateValidators();
              this._updateDomValue();
              this._updateRegistrations();
              this._oldForm = this.form;
          }
      }
      /** @nodoc */
      ngOnDestroy() {
          if (this.form) {
              cleanUpValidators(this.form, this);
              // Currently the `onCollectionChange` callback is rewritten each time the
              // `_registerOnCollectionChange` function is invoked. The implication is that cleanup should
              // happen *only* when the `onCollectionChange` callback was set by this directive instance.
              // Otherwise it might cause overriding a callback of some other directive instances. We should
              // consider updating this logic later to make it similar to how `onChange` callbacks are
              // handled, see https://github.com/angular/angular/issues/39732 for additional info.
              if (this.form._onCollectionChange === this._onCollectionChange) {
                  this.form._registerOnCollectionChange(() => { });
              }
          }
      }
      /**
       * @description
       * Returns this directive's instance.
       */
      get formDirective() {
          return this;
      }
      /**
       * @description
       * Returns the `FormGroup` bound to this directive.
       */
      get control() {
          return this.form;
      }
      /**
       * @description
       * Returns an array representing the path to this group. Because this directive
       * always lives at the top level of a form, it always an empty array.
       */
      get path() {
          return [];
      }
      /**
       * @description
       * Method that sets up the control directive in this group, re-calculates its value
       * and validity, and adds the instance to the internal list of directives.
       *
       * @param dir The `FormControlName` directive instance.
       */
      addControl(dir) {
          const ctrl = this.form.get(dir.path);
          setUpControl(ctrl, dir, this.callSetDisabledState);
          ctrl.updateValueAndValidity({ emitEvent: false });
          this.directives.push(dir);
          return ctrl;
      }
      /**
       * @description
       * Retrieves the `FormControl` instance from the provided `FormControlName` directive
       *
       * @param dir The `FormControlName` directive instance.
       */
      getControl(dir) {
          return this.form.get(dir.path);
      }
      /**
       * @description
       * Removes the `FormControlName` instance from the internal list of directives
       *
       * @param dir The `FormControlName` directive instance.
       */
      removeControl(dir) {
          cleanUpControl(dir.control || null, dir, /* validateControlPresenceOnChange */ false);
          removeListItem$1(this.directives, dir);
      }
      /**
       * Adds a new `FormGroupName` directive instance to the form.
       *
       * @param dir The `FormGroupName` directive instance.
       */
      addFormGroup(dir) {
          this._setUpFormContainer(dir);
      }
      /**
       * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
       * view.
       *
       * @param dir The `FormGroupName` directive instance.
       */
      removeFormGroup(dir) {
          this._cleanUpFormContainer(dir);
      }
      /**
       * @description
       * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
       *
       * @param dir The `FormGroupName` directive instance.
       */
      getFormGroup(dir) {
          return this.form.get(dir.path);
      }
      /**
       * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
       *
       * @param dir The `FormArrayName` directive instance.
       */
      addFormArray(dir) {
          this._setUpFormContainer(dir);
      }
      /**
       * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
       * view.
       *
       * @param dir The `FormArrayName` directive instance.
       */
      removeFormArray(dir) {
          this._cleanUpFormContainer(dir);
      }
      /**
       * @description
       * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
       *
       * @param dir The `FormArrayName` directive instance.
       */
      getFormArray(dir) {
          return this.form.get(dir.path);
      }
      /**
       * Sets the new value for the provided `FormControlName` directive.
       *
       * @param dir The `FormControlName` directive instance.
       * @param value The new value for the directive's control.
       */
      updateModel(dir, value) {
          const ctrl = this.form.get(dir.path);
          ctrl.setValue(value);
      }
      /**
       * @description
       * Method called with the "submit" event is triggered on the form.
       * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
       *
       * @param $event The "submit" event object
       */
      onSubmit($event) {
          this.submitted = true;
          syncPendingControls(this.form, this.directives);
          this.ngSubmit.emit($event);
          // Forms with `method="dialog"` have some special behavior that won't reload the page and that
          // shouldn't be prevented. Note that we need to null check the `event` and the `target`, because
          // some internal apps call this method directly with the wrong arguments.
          return $event?.target?.method === 'dialog';
      }
      /**
       * @description
       * Method called when the "reset" event is triggered on the form.
       */
      onReset() {
          this.resetForm();
      }
      /**
       * @description
       * Resets the form to an initial value and resets its submitted status.
       *
       * @param value The new value for the form.
       */
      resetForm(value = undefined) {
          this.form.reset(value);
          this.submitted = false;
      }
      /** @internal */
      _updateDomValue() {
          this.directives.forEach(dir => {
              const oldCtrl = dir.control;
              const newCtrl = this.form.get(dir.path);
              if (oldCtrl !== newCtrl) {
                  // Note: the value of the `dir.control` may not be defined, for example when it's a first
                  // `FormControl` that is added to a `FormGroup` instance (via `addControl` call).
                  cleanUpControl(oldCtrl || null, dir);
                  // Check whether new control at the same location inside the corresponding `FormGroup` is an
                  // instance of `FormControl` and perform control setup only if that's the case.
                  // Note: we don't need to clear the list of directives (`this.directives`) here, it would be
                  // taken care of in the `removeControl` method invoked when corresponding `formControlName`
                  // directive instance is being removed (invoked from `FormControlName.ngOnDestroy`).
                  if (isFormControl(newCtrl)) {
                      setUpControl(newCtrl, dir, this.callSetDisabledState);
                      dir.control = newCtrl;
                  }
              }
          });
          this.form._updateTreeValidity({ emitEvent: false });
      }
      _setUpFormContainer(dir) {
          const ctrl = this.form.get(dir.path);
          setUpFormContainer(ctrl, dir);
          // NOTE: this operation looks unnecessary in case no new validators were added in
          // `setUpFormContainer` call. Consider updating this code to match the logic in
          // `_cleanUpFormContainer` function.
          ctrl.updateValueAndValidity({ emitEvent: false });
      }
      _cleanUpFormContainer(dir) {
          if (this.form) {
              const ctrl = this.form.get(dir.path);
              if (ctrl) {
                  const isControlUpdated = cleanUpFormContainer(ctrl, dir);
                  if (isControlUpdated) {
                      // Run validity check only in case a control was updated (i.e. view validators were
                      // removed) as removing view validators might cause validity to change.
                      ctrl.updateValueAndValidity({ emitEvent: false });
                  }
              }
          }
      }
      _updateRegistrations() {
          this.form._registerOnCollectionChange(this._onCollectionChange);
          if (this._oldForm) {
              this._oldForm._registerOnCollectionChange(() => { });
          }
      }
      _updateValidators() {
          setUpValidators(this.form, this);
          if (this._oldForm) {
              cleanUpValidators(this._oldForm, this);
          }
      }
      _checkFormPresent() {
          if (!this.form && (typeof ngDevMode === 'undefined' || ngDevMode)) {
              throw missingFormException();
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormGroupDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: FormGroupDirective, selector: "[formGroup]", inputs: { form: ["formGroup", "form"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormGroupDirective, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[formGroup]',
                      providers: [formDirectiveProvider],
                      host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                      exportAs: 'ngForm'
                  }]
          }], ctorParameters: () => [{ type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_ASYNC_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [CALL_SET_DISABLED_STATE]
                  }] }], propDecorators: { form: [{
                  type: i0.Input,
                  args: ['formGroup']
              }], ngSubmit: [{
                  type: i0.Output
              }] } });

  const formGroupNameProvider = {
      provide: ControlContainer,
      useExisting: i0.forwardRef(() => FormGroupName)
  };
  /**
   * @description
   *
   * Syncs a nested `FormGroup` or `FormRecord` to a DOM element.
   *
   * This directive can only be used with a parent `FormGroupDirective`.
   *
   * It accepts the string name of the nested `FormGroup` or `FormRecord` to link, and
   * looks for a `FormGroup` or `FormRecord` registered with that name in the parent
   * `FormGroup` instance you passed into `FormGroupDirective`.
   *
   * Use nested form groups to validate a sub-group of a
   * form separately from the rest or to group the values of certain
   * controls into their own nested object.
   *
   * @see [Reactive Forms Guide](guide/reactive-forms)
   *
   * @usageNotes
   *
   * ### Access the group by name
   *
   * The following example uses the `AbstractControl.get` method to access the
   * associated `FormGroup`
   *
   * ```ts
   *   this.form.get('name');
   * ```
   *
   * ### Access individual controls in the group
   *
   * The following example uses the `AbstractControl.get` method to access
   * individual controls within the group using dot syntax.
   *
   * ```ts
   *   this.form.get('name.first');
   * ```
   *
   * ### Register a nested `FormGroup`.
   *
   * The following example registers a nested *name* `FormGroup` within an existing `FormGroup`,
   * and provides methods to retrieve the nested `FormGroup` and individual controls.
   *
   * {@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
   *
   * @ngModule ReactiveFormsModule
   * @publicApi
   */
  class FormGroupName extends AbstractFormGroupDirective {
      constructor(parent, validators, asyncValidators) {
          super();
          /**
           * @description
           * Tracks the name of the `FormGroup` bound to the directive. The name corresponds
           * to a key in the parent `FormGroup` or `FormArray`.
           * Accepts a name as a string or a number.
           * The name in the form of a string is useful for individual forms,
           * while the numerical form allows for form groups to be bound
           * to indices when iterating over groups in a `FormArray`.
           */
          this.name = null;
          this._parent = parent;
          this._setValidators(validators);
          this._setAsyncValidators(asyncValidators);
      }
      /** @internal */
      _checkParentType() {
          if (_hasInvalidParent(this._parent) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
              throw groupParentException();
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormGroupName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: FormGroupName, selector: "[formGroupName]", inputs: { name: ["formGroupName", "name"] }, providers: [formGroupNameProvider], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormGroupName, decorators: [{
              type: i0.Directive,
              args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] }]
          }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Host
                  }, {
                      type: i0.SkipSelf
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_ASYNC_VALIDATORS]
                  }] }], propDecorators: { name: [{
                  type: i0.Input,
                  args: ['formGroupName']
              }] } });
  const formArrayNameProvider = {
      provide: ControlContainer,
      useExisting: i0.forwardRef(() => FormArrayName)
  };
  /**
   * @description
   *
   * Syncs a nested `FormArray` to a DOM element.
   *
   * This directive is designed to be used with a parent `FormGroupDirective` (selector:
   * `[formGroup]`).
   *
   * It accepts the string name of the nested `FormArray` you want to link, and
   * will look for a `FormArray` registered with that name in the parent
   * `FormGroup` instance you passed into `FormGroupDirective`.
   *
   * @see [Reactive Forms Guide](guide/reactive-forms)
   * @see {@link AbstractControl}
   *
   * @usageNotes
   *
   * ### Example
   *
   * {@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
   *
   * @ngModule ReactiveFormsModule
   * @publicApi
   */
  class FormArrayName extends ControlContainer {
      constructor(parent, validators, asyncValidators) {
          super();
          /**
           * @description
           * Tracks the name of the `FormArray` bound to the directive. The name corresponds
           * to a key in the parent `FormGroup` or `FormArray`.
           * Accepts a name as a string or a number.
           * The name in the form of a string is useful for individual forms,
           * while the numerical form allows for form arrays to be bound
           * to indices when iterating over arrays in a `FormArray`.
           */
          this.name = null;
          this._parent = parent;
          this._setValidators(validators);
          this._setAsyncValidators(asyncValidators);
      }
      /**
       * A lifecycle method called when the directive's inputs are initialized. For internal use only.
       * @throws If the directive does not have a valid parent.
       * @nodoc
       */
      ngOnInit() {
          this._checkParentType();
          this.formDirective.addFormArray(this);
      }
      /**
       * A lifecycle method called before the directive's instance is destroyed. For internal use only.
       * @nodoc
       */
      ngOnDestroy() {
          if (this.formDirective) {
              this.formDirective.removeFormArray(this);
          }
      }
      /**
       * @description
       * The `FormArray` bound to this directive.
       */
      get control() {
          return this.formDirective.getFormArray(this);
      }
      /**
       * @description
       * The top-level directive for this group if present, otherwise null.
       */
      get formDirective() {
          return this._parent ? this._parent.formDirective : null;
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
          return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
      }
      _checkParentType() {
          if (_hasInvalidParent(this._parent) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
              throw arrayParentException();
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormArrayName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: FormArrayName, selector: "[formArrayName]", inputs: { name: ["formArrayName", "name"] }, providers: [formArrayNameProvider], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormArrayName, decorators: [{
              type: i0.Directive,
              args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] }]
          }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Host
                  }, {
                      type: i0.SkipSelf
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_ASYNC_VALIDATORS]
                  }] }], propDecorators: { name: [{
                  type: i0.Input,
                  args: ['formArrayName']
              }] } });
  function _hasInvalidParent(parent) {
      return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) &&
          !(parent instanceof FormArrayName);
  }

  const controlNameBinding = {
      provide: NgControl,
      useExisting: i0.forwardRef(() => FormControlName)
  };
  /**
   * @description
   * Syncs a `FormControl` in an existing `FormGroup` to a form control
   * element by name.
   *
   * @see [Reactive Forms Guide](guide/reactive-forms)
   * @see {@link FormControl}
   * @see {@link AbstractControl}
   *
   * @usageNotes
   *
   * ### Register `FormControl` within a group
   *
   * The following example shows how to register multiple form controls within a form group
   * and set their value.
   *
   * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
   *
   * To see `formControlName` examples with different form control types, see:
   *
   * * Radio buttons: `RadioControlValueAccessor`
   * * Selects: `SelectControlValueAccessor`
   *
   * ### Use with ngModel is deprecated
   *
   * Support for using the `ngModel` input property and `ngModelChange` event with reactive
   * form directives has been deprecated in Angular v6 and is scheduled for removal in
   * a future version of Angular.
   *
   * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
   *
   * @ngModule ReactiveFormsModule
   * @publicApi
   */
  class FormControlName extends NgControl {
      /**
       * @description
       * Triggers a warning in dev mode that this input should not be used with reactive forms.
       */
      set isDisabled(isDisabled) {
          if (typeof ngDevMode === 'undefined' || ngDevMode) {
              console.warn(disabledAttrWarning);
          }
      }
      /**
       * @description
       * Static property used to track whether any ngModel warnings have been sent across
       * all instances of FormControlName. Used to support warning config of "once".
       *
       * @internal
       */
      static { this._ngModelWarningSentOnce = false; }
      constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
          super();
          this._ngModelWarningConfig = _ngModelWarningConfig;
          this._added = false;
          /**
           * @description
           * Tracks the name of the `FormControl` bound to the directive. The name corresponds
           * to a key in the parent `FormGroup` or `FormArray`.
           * Accepts a name as a string or a number.
           * The name in the form of a string is useful for individual forms,
           * while the numerical form allows for form controls to be bound
           * to indices when iterating over controls in a `FormArray`.
           */
          this.name = null;
          /** @deprecated as of v6 */
          this.update = new i0.EventEmitter();
          /**
           * @description
           * Instance property used to track whether an ngModel warning has been sent out for this
           * particular FormControlName instance. Used to support warning config of "always".
           *
           * @internal
           */
          this._ngModelWarningSent = false;
          this._parent = parent;
          this._setValidators(validators);
          this._setAsyncValidators(asyncValidators);
          this.valueAccessor = selectValueAccessor(this, valueAccessors);
      }
      /** @nodoc */
      ngOnChanges(changes) {
          if (!this._added)
              this._setUpControl();
          if (isPropertyUpdated(changes, this.viewModel)) {
              if (typeof ngDevMode === 'undefined' || ngDevMode) {
                  _ngModelWarning('formControlName', FormControlName, this, this._ngModelWarningConfig);
              }
              this.viewModel = this.model;
              this.formDirective.updateModel(this, this.model);
          }
      }
      /** @nodoc */
      ngOnDestroy() {
          if (this.formDirective) {
              this.formDirective.removeControl(this);
          }
      }
      /**
       * @description
       * Sets the new value for the view model and emits an `ngModelChange` event.
       *
       * @param newValue The new value for the view model.
       */
      viewToModelUpdate(newValue) {
          this.viewModel = newValue;
          this.update.emit(newValue);
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
          return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
      }
      /**
       * @description
       * The top-level directive for this group if present, otherwise null.
       */
      get formDirective() {
          return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {
          if (typeof ngDevMode === 'undefined' || ngDevMode) {
              if (!(this._parent instanceof FormGroupName) &&
                  this._parent instanceof AbstractFormGroupDirective) {
                  throw ngModelGroupException();
              }
              else if (!(this._parent instanceof FormGroupName) &&
                  !(this._parent instanceof FormGroupDirective) &&
                  !(this._parent instanceof FormArrayName)) {
                  throw controlParentException();
              }
          }
      }
      _setUpControl() {
          this._checkParentType();
          this.control = this.formDirective.addControl(this);
          this._added = true;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormControlName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: NG_MODEL_WITH_FORM_CONTROL_WARNING, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: FormControlName, selector: "[formControlName]", inputs: { name: ["formControlName", "name"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, providers: [controlNameBinding], usesInheritance: true, usesOnChanges: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormControlName, decorators: [{
              type: i0.Directive,
              args: [{ selector: '[formControlName]', providers: [controlNameBinding] }]
          }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Host
                  }, {
                      type: i0.SkipSelf
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_ASYNC_VALIDATORS]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Self
                  }, {
                      type: i0.Inject,
                      args: [NG_VALUE_ACCESSOR]
                  }] }, { type: undefined, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Inject,
                      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
                  }] }], propDecorators: { name: [{
                  type: i0.Input,
                  args: ['formControlName']
              }], isDisabled: [{
                  type: i0.Input,
                  args: ['disabled']
              }], model: [{
                  type: i0.Input,
                  args: ['ngModel']
              }], update: [{
                  type: i0.Output,
                  args: ['ngModelChange']
              }] } });

  const SELECT_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: i0.forwardRef(() => SelectControlValueAccessor),
      multi: true
  };
  function _buildValueString$1(id, value) {
      if (id == null)
          return `${value}`;
      if (value && typeof value === 'object')
          value = 'Object';
      return `${id}: ${value}`.slice(0, 50);
  }
  function _extractId$1(valueString) {
      return valueString.split(':')[0];
  }
  /**
   * @description
   * The `ControlValueAccessor` for writing select control values and listening to select control
   * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
   * `NgModel` directives.
   *
   * @usageNotes
   *
   * ### Using select controls in a reactive form
   *
   * The following examples show how to use a select control in a reactive form.
   *
   * {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
   *
   * ### Using select controls in a template-driven form
   *
   * To use a select in a template-driven form, simply add an `ngModel` and a `name`
   * attribute to the main `<select>` tag.
   *
   * {@example forms/ts/selectControl/select_control_example.ts region='Component'}
   *
   * ### Customizing option selection
   *
   * Angular uses object identity to select option. It's possible for the identities of items
   * to change while the data does not. This can happen, for example, if the items are produced
   * from an RPC to the server, and that RPC is re-run. Even if the data hasn't changed, the
   * second response will produce objects with different identities.
   *
   * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
   * `compareWith` takes a **function** which has two arguments: `option1` and `option2`.
   * If `compareWith` is given, Angular selects option by the return value of the function.
   *
   * ```ts
   * const selectedCountriesControl = new FormControl();
   * ```
   *
   * ```
   * <select [compareWith]="compareFn"  [formControl]="selectedCountriesControl">
   *     <option *ngFor="let country of countries" [ngValue]="country">
   *         {{country.name}}
   *     </option>
   * </select>
   *
   * compareFn(c1: Country, c2: Country): boolean {
   *     return c1 && c2 ? c1.id === c2.id : c1 === c2;
   * }
   * ```
   *
   * **Note:** We listen to the 'change' event because 'input' events aren't fired
   * for selects in IE, see:
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event#browser_compatibility
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class SelectControlValueAccessor extends BuiltInControlValueAccessor {
      constructor() {
          super(...arguments);
          /** @internal */
          this._optionMap = new Map();
          /** @internal */
          this._idCounter = 0;
          this._compareWith = Object.is;
      }
      /**
       * @description
       * Tracks the option comparison algorithm for tracking identities when
       * checking for changes.
       */
      set compareWith(fn) {
          if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
              throw new i0.ɵRuntimeError(1201 /* RuntimeErrorCode.COMPAREWITH_NOT_A_FN */, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
          }
          this._compareWith = fn;
      }
      /**
       * Sets the "value" property on the select element.
       * @nodoc
       */
      writeValue(value) {
          this.value = value;
          const id = this._getOptionId(value);
          const valueString = _buildValueString$1(id, value);
          this.setProperty('value', valueString);
      }
      /**
       * Registers a function called when the control value changes.
       * @nodoc
       */
      registerOnChange(fn) {
          this.onChange = (valueString) => {
              this.value = this._getOptionValue(valueString);
              fn(this.value);
          };
      }
      /** @internal */
      _registerOption() {
          return (this._idCounter++).toString();
      }
      /** @internal */
      _getOptionId(value) {
          for (const id of this._optionMap.keys()) {
              if (this._compareWith(this._optionMap.get(id), value))
                  return id;
          }
          return null;
      }
      /** @internal */
      _getOptionValue(valueString) {
          const id = _extractId$1(valueString);
          return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: SelectControlValueAccessor, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: { compareWith: "compareWith" }, host: { listeners: { "change": "onChange($event.target.value)", "blur": "onTouched()" } }, providers: [SELECT_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: SelectControlValueAccessor, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
                      host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                      providers: [SELECT_VALUE_ACCESSOR]
                  }]
          }], propDecorators: { compareWith: [{
                  type: i0.Input
              }] } });
  /**
   * @description
   * Marks `<option>` as dynamic, so Angular can be notified when options change.
   *
   * @see {@link SelectControlValueAccessor}
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class NgSelectOption {
      constructor(_element, _renderer, _select) {
          this._element = _element;
          this._renderer = _renderer;
          this._select = _select;
          if (this._select)
              this.id = this._select._registerOption();
      }
      /**
       * @description
       * Tracks the value bound to the option element. Unlike the value binding,
       * ngValue supports binding to objects.
       */
      set ngValue(value) {
          if (this._select == null)
              return;
          this._select._optionMap.set(this.id, value);
          this._setElementValue(_buildValueString$1(this.id, value));
          this._select.writeValue(this._select.value);
      }
      /**
       * @description
       * Tracks simple string values bound to the option element.
       * For objects, use the `ngValue` input binding.
       */
      set value(value) {
          this._setElementValue(value);
          if (this._select)
              this._select.writeValue(this._select.value);
      }
      /** @internal */
      _setElementValue(value) {
          this._renderer.setProperty(this._element.nativeElement, 'value', value);
      }
      /** @nodoc */
      ngOnDestroy() {
          if (this._select) {
              this._select._optionMap.delete(this.id);
              this._select.writeValue(this._select.value);
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgSelectOption, deps: [{ token: i0__namespace.ElementRef }, { token: i0__namespace.Renderer2 }, { token: SelectControlValueAccessor, host: true, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: NgSelectOption, selector: "option", inputs: { ngValue: "ngValue", value: "value" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NgSelectOption, decorators: [{
              type: i0.Directive,
              args: [{ selector: 'option' }]
          }], ctorParameters: () => [{ type: i0__namespace.ElementRef }, { type: i0__namespace.Renderer2 }, { type: SelectControlValueAccessor, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Host
                  }] }], propDecorators: { ngValue: [{
                  type: i0.Input,
                  args: ['ngValue']
              }], value: [{
                  type: i0.Input,
                  args: ['value']
              }] } });

  const SELECT_MULTIPLE_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: i0.forwardRef(() => SelectMultipleControlValueAccessor),
      multi: true
  };
  function _buildValueString(id, value) {
      if (id == null)
          return `${value}`;
      if (typeof value === 'string')
          value = `'${value}'`;
      if (value && typeof value === 'object')
          value = 'Object';
      return `${id}: ${value}`.slice(0, 50);
  }
  function _extractId(valueString) {
      return valueString.split(':')[0];
  }
  /**
   * @description
   * The `ControlValueAccessor` for writing multi-select control values and listening to multi-select
   * control changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
   * `NgModel` directives.
   *
   * @see {@link SelectControlValueAccessor}
   *
   * @usageNotes
   *
   * ### Using a multi-select control
   *
   * The follow example shows you how to use a multi-select control with a reactive form.
   *
   * ```ts
   * const countryControl = new FormControl();
   * ```
   *
   * ```
   * <select multiple name="countries" [formControl]="countryControl">
   *   <option *ngFor="let country of countries" [ngValue]="country">
   *     {{ country.name }}
   *   </option>
   * </select>
   * ```
   *
   * ### Customizing option selection
   *
   * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
   * See the `SelectControlValueAccessor` for usage.
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor {
      constructor() {
          super(...arguments);
          /** @internal */
          this._optionMap = new Map();
          /** @internal */
          this._idCounter = 0;
          this._compareWith = Object.is;
      }
      /**
       * @description
       * Tracks the option comparison algorithm for tracking identities when
       * checking for changes.
       */
      set compareWith(fn) {
          if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
              throw new i0.ɵRuntimeError(1201 /* RuntimeErrorCode.COMPAREWITH_NOT_A_FN */, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
          }
          this._compareWith = fn;
      }
      /**
       * Sets the "value" property on one or of more of the select's options.
       * @nodoc
       */
      writeValue(value) {
          this.value = value;
          let optionSelectedStateSetter;
          if (Array.isArray(value)) {
              // convert values to ids
              const ids = value.map((v) => this._getOptionId(v));
              optionSelectedStateSetter = (opt, o) => {
                  opt._setSelected(ids.indexOf(o.toString()) > -1);
              };
          }
          else {
              optionSelectedStateSetter = (opt, o) => {
                  opt._setSelected(false);
              };
          }
          this._optionMap.forEach(optionSelectedStateSetter);
      }
      /**
       * Registers a function called when the control value changes
       * and writes an array of the selected options.
       * @nodoc
       */
      registerOnChange(fn) {
          this.onChange = (element) => {
              const selected = [];
              const selectedOptions = element.selectedOptions;
              if (selectedOptions !== undefined) {
                  const options = selectedOptions;
                  for (let i = 0; i < options.length; i++) {
                      const opt = options[i];
                      const val = this._getOptionValue(opt.value);
                      selected.push(val);
                  }
              }
              // Degrade to use `options` when `selectedOptions` property is not available.
              // Note: the `selectedOptions` is available in all supported browsers, but the Domino lib
              // doesn't have it currently, see https://github.com/fgnass/domino/issues/177.
              else {
                  const options = element.options;
                  for (let i = 0; i < options.length; i++) {
                      const opt = options[i];
                      if (opt.selected) {
                          const val = this._getOptionValue(opt.value);
                          selected.push(val);
                      }
                  }
              }
              this.value = selected;
              fn(selected);
          };
      }
      /** @internal */
      _registerOption(value) {
          const id = (this._idCounter++).toString();
          this._optionMap.set(id, value);
          return id;
      }
      /** @internal */
      _getOptionId(value) {
          for (const id of this._optionMap.keys()) {
              if (this._compareWith(this._optionMap.get(id)._value, value))
                  return id;
          }
          return null;
      }
      /** @internal */
      _getOptionValue(valueString) {
          const id = _extractId(valueString);
          return this._optionMap.has(id) ? this._optionMap.get(id)._value : valueString;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: SelectMultipleControlValueAccessor, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: SelectMultipleControlValueAccessor, selector: "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]", inputs: { compareWith: "compareWith" }, host: { listeners: { "change": "onChange($event.target)", "blur": "onTouched()" } }, providers: [SELECT_MULTIPLE_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: SelectMultipleControlValueAccessor, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
                      host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
                      providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
                  }]
          }], propDecorators: { compareWith: [{
                  type: i0.Input
              }] } });
  /**
   * @description
   * Marks `<option>` as dynamic, so Angular can be notified when options change.
   *
   * @see {@link SelectMultipleControlValueAccessor}
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class ɵNgSelectMultipleOption {
      constructor(_element, _renderer, _select) {
          this._element = _element;
          this._renderer = _renderer;
          this._select = _select;
          if (this._select) {
              this.id = this._select._registerOption(this);
          }
      }
      /**
       * @description
       * Tracks the value bound to the option element. Unlike the value binding,
       * ngValue supports binding to objects.
       */
      set ngValue(value) {
          if (this._select == null)
              return;
          this._value = value;
          this._setElementValue(_buildValueString(this.id, value));
          this._select.writeValue(this._select.value);
      }
      /**
       * @description
       * Tracks simple string values bound to the option element.
       * For objects, use the `ngValue` input binding.
       */
      set value(value) {
          if (this._select) {
              this._value = value;
              this._setElementValue(_buildValueString(this.id, value));
              this._select.writeValue(this._select.value);
          }
          else {
              this._setElementValue(value);
          }
      }
      /** @internal */
      _setElementValue(value) {
          this._renderer.setProperty(this._element.nativeElement, 'value', value);
      }
      /** @internal */
      _setSelected(selected) {
          this._renderer.setProperty(this._element.nativeElement, 'selected', selected);
      }
      /** @nodoc */
      ngOnDestroy() {
          if (this._select) {
              this._select._optionMap.delete(this.id);
              this._select.writeValue(this._select.value);
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ɵNgSelectMultipleOption, deps: [{ token: i0__namespace.ElementRef }, { token: i0__namespace.Renderer2 }, { token: SelectMultipleControlValueAccessor, host: true, optional: true }], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: ɵNgSelectMultipleOption, selector: "option", inputs: { ngValue: "ngValue", value: "value" }, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ɵNgSelectMultipleOption, decorators: [{
              type: i0.Directive,
              args: [{ selector: 'option' }]
          }], ctorParameters: () => [{ type: i0__namespace.ElementRef }, { type: i0__namespace.Renderer2 }, { type: SelectMultipleControlValueAccessor, decorators: [{
                      type: i0.Optional
                  }, {
                      type: i0.Host
                  }] }], propDecorators: { ngValue: [{
                  type: i0.Input,
                  args: ['ngValue']
              }], value: [{
                  type: i0.Input,
                  args: ['value']
              }] } });

  /**
   * Method that updates string to integer if not already a number
   *
   * @param value The value to convert to integer.
   * @returns value of parameter converted to number or integer.
   */
  function toInteger(value) {
      return typeof value === 'number' ? value : parseInt(value, 10);
  }
  /**
   * Method that ensures that provided value is a float (and converts it to float if needed).
   *
   * @param value The value to convert to float.
   * @returns value of parameter converted to number or float.
   */
  function toFloat(value) {
      return typeof value === 'number' ? value : parseFloat(value);
  }
  /**
   * A base class for Validator-based Directives. The class contains common logic shared across such
   * Directives.
   *
   * For internal use only, this class is not intended for use outside of the Forms package.
   */
  class AbstractValidatorDirective {
      constructor() {
          this._validator = nullValidator;
      }
      /** @nodoc */
      ngOnChanges(changes) {
          if (this.inputName in changes) {
              const input = this.normalizeInput(changes[this.inputName].currentValue);
              this._enabled = this.enabled(input);
              this._validator = this._enabled ? this.createValidator(input) : nullValidator;
              if (this._onChange) {
                  this._onChange();
              }
          }
      }
      /** @nodoc */
      validate(control) {
          return this._validator(control);
      }
      /** @nodoc */
      registerOnValidatorChange(fn) {
          this._onChange = fn;
      }
      /**
       * @description
       * Determines whether this validator should be active or not based on an input.
       * Base class implementation checks whether an input is defined (if the value is different from
       * `null` and `undefined`). Validator classes that extend this base class can override this
       * function with the logic specific to a particular validator directive.
       */
      enabled(input) {
          return input != null /* both `null` and `undefined` */;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: AbstractValidatorDirective, deps: [], target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: AbstractValidatorDirective, usesOnChanges: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: AbstractValidatorDirective, decorators: [{
              type: i0.Directive
          }] });
  /**
   * @description
   * Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.
   */
  const MAX_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: i0.forwardRef(() => MaxValidator),
      multi: true
  };
  /**
   * A directive which installs the {@link MaxValidator} for any `formControlName`,
   * `formControl`, or control with `ngModel` that also has a `max` attribute.
   *
   * @see [Form Validation](guide/form-validation)
   *
   * @usageNotes
   *
   * ### Adding a max validator
   *
   * The following example shows how to add a max validator to an input attached to an
   * ngModel binding.
   *
   * ```html
   * <input type="number" ngModel max="4">
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class MaxValidator extends AbstractValidatorDirective {
      constructor() {
          super(...arguments);
          /** @internal */
          this.inputName = 'max';
          /** @internal */
          this.normalizeInput = (input) => toFloat(input);
          /** @internal */
          this.createValidator = (max) => maxValidator(max);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: MaxValidator, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: { max: "max" }, host: { properties: { "attr.max": "_enabled ? max : null" } }, providers: [MAX_VALIDATOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: MaxValidator, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]',
                      providers: [MAX_VALIDATOR],
                      host: { '[attr.max]': '_enabled ? max : null' }
                  }]
          }], propDecorators: { max: [{
                  type: i0.Input
              }] } });
  /**
   * @description
   * Provider which adds `MinValidator` to the `NG_VALIDATORS` multi-provider list.
   */
  const MIN_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: i0.forwardRef(() => MinValidator),
      multi: true
  };
  /**
   * A directive which installs the {@link MinValidator} for any `formControlName`,
   * `formControl`, or control with `ngModel` that also has a `min` attribute.
   *
   * @see [Form Validation](guide/form-validation)
   *
   * @usageNotes
   *
   * ### Adding a min validator
   *
   * The following example shows how to add a min validator to an input attached to an
   * ngModel binding.
   *
   * ```html
   * <input type="number" ngModel min="4">
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class MinValidator extends AbstractValidatorDirective {
      constructor() {
          super(...arguments);
          /** @internal */
          this.inputName = 'min';
          /** @internal */
          this.normalizeInput = (input) => toFloat(input);
          /** @internal */
          this.createValidator = (min) => minValidator(min);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: MinValidator, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: { min: "min" }, host: { properties: { "attr.min": "_enabled ? min : null" } }, providers: [MIN_VALIDATOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: MinValidator, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]',
                      providers: [MIN_VALIDATOR],
                      host: { '[attr.min]': '_enabled ? min : null' }
                  }]
          }], propDecorators: { min: [{
                  type: i0.Input
              }] } });
  /**
   * @description
   * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
   */
  const REQUIRED_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: i0.forwardRef(() => RequiredValidator),
      multi: true
  };
  /**
   * @description
   * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
   */
  const CHECKBOX_REQUIRED_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: i0.forwardRef(() => CheckboxRequiredValidator),
      multi: true
  };
  /**
   * @description
   * A directive that adds the `required` validator to any controls marked with the
   * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
   *
   * @see [Form Validation](guide/form-validation)
   *
   * @usageNotes
   *
   * ### Adding a required validator using template-driven forms
   *
   * ```
   * <input name="fullName" ngModel required>
   * ```
   *
   * @ngModule FormsModule
   * @ngModule ReactiveFormsModule
   * @publicApi
   */
  class RequiredValidator extends AbstractValidatorDirective {
      constructor() {
          super(...arguments);
          /** @internal */
          this.inputName = 'required';
          /** @internal */
          this.normalizeInput = i0.booleanAttribute;
          /** @internal */
          this.createValidator = (input) => requiredValidator;
      }
      /** @nodoc */
      enabled(input) {
          return input;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RequiredValidator, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: { required: "required" }, host: { properties: { "attr.required": "_enabled ? \"\" : null" } }, providers: [REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: RequiredValidator, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                      providers: [REQUIRED_VALIDATOR],
                      host: { '[attr.required]': '_enabled ? "" : null' }
                  }]
          }], propDecorators: { required: [{
                  type: i0.Input
              }] } });
  /**
   * A Directive that adds the `required` validator to checkbox controls marked with the
   * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
   *
   * @see [Form Validation](guide/form-validation)
   *
   * @usageNotes
   *
   * ### Adding a required checkbox validator using template-driven forms
   *
   * The following example shows how to add a checkbox required validator to an input attached to an
   * ngModel binding.
   *
   * ```
   * <input type="checkbox" name="active" ngModel required>
   * ```
   *
   * @publicApi
   * @ngModule FormsModule
   * @ngModule ReactiveFormsModule
   */
  class CheckboxRequiredValidator extends RequiredValidator {
      constructor() {
          super(...arguments);
          /** @internal */
          this.createValidator = (input) => requiredTrueValidator;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CheckboxRequiredValidator, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: CheckboxRequiredValidator, selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]", host: { properties: { "attr.required": "_enabled ? \"\" : null" } }, providers: [CHECKBOX_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: CheckboxRequiredValidator, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                      providers: [CHECKBOX_REQUIRED_VALIDATOR],
                      host: { '[attr.required]': '_enabled ? "" : null' }
                  }]
          }] });
  /**
   * @description
   * Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.
   */
  const EMAIL_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: i0.forwardRef(() => EmailValidator),
      multi: true
  };
  /**
   * A directive that adds the `email` validator to controls marked with the
   * `email` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
   *
   * The email validation is based on the WHATWG HTML specification with some enhancements to
   * incorporate more RFC rules. More information can be found on the [Validators.email
   * page](api/forms/Validators#email).
   *
   * @see [Form Validation](guide/form-validation)
   *
   * @usageNotes
   *
   * ### Adding an email validator
   *
   * The following example shows how to add an email validator to an input attached to an ngModel
   * binding.
   *
   * ```
   * <input type="email" name="email" ngModel email>
   * <input type="email" name="email" ngModel email="true">
   * <input type="email" name="email" ngModel [email]="true">
   * ```
   *
   * @publicApi
   * @ngModule FormsModule
   * @ngModule ReactiveFormsModule
   */
  class EmailValidator extends AbstractValidatorDirective {
      constructor() {
          super(...arguments);
          /** @internal */
          this.inputName = 'email';
          /** @internal */
          this.normalizeInput = i0.booleanAttribute;
          /** @internal */
          this.createValidator = (input) => emailValidator;
      }
      /** @nodoc */
      enabled(input) {
          return input;
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: EmailValidator, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: EmailValidator, selector: "[email][formControlName],[email][formControl],[email][ngModel]", inputs: { email: "email" }, providers: [EMAIL_VALIDATOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: EmailValidator, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[email][formControlName],[email][formControl],[email][ngModel]',
                      providers: [EMAIL_VALIDATOR]
                  }]
          }], propDecorators: { email: [{
                  type: i0.Input
              }] } });
  /**
   * @description
   * Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.
   */
  const MIN_LENGTH_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: i0.forwardRef(() => MinLengthValidator),
      multi: true
  };
  /**
   * A directive that adds minimum length validation to controls marked with the
   * `minlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
   *
   * @see [Form Validation](guide/form-validation)
   *
   * @usageNotes
   *
   * ### Adding a minimum length validator
   *
   * The following example shows how to add a minimum length validator to an input attached to an
   * ngModel binding.
   *
   * ```html
   * <input name="firstName" ngModel minlength="4">
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class MinLengthValidator extends AbstractValidatorDirective {
      constructor() {
          super(...arguments);
          /** @internal */
          this.inputName = 'minlength';
          /** @internal */
          this.normalizeInput = (input) => toInteger(input);
          /** @internal */
          this.createValidator = (minlength) => minLengthValidator(minlength);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: MinLengthValidator, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: MinLengthValidator, selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]", inputs: { minlength: "minlength" }, host: { properties: { "attr.minlength": "_enabled ? minlength : null" } }, providers: [MIN_LENGTH_VALIDATOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: MinLengthValidator, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                      providers: [MIN_LENGTH_VALIDATOR],
                      host: { '[attr.minlength]': '_enabled ? minlength : null' }
                  }]
          }], propDecorators: { minlength: [{
                  type: i0.Input
              }] } });
  /**
   * @description
   * Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.
   */
  const MAX_LENGTH_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: i0.forwardRef(() => MaxLengthValidator),
      multi: true
  };
  /**
   * A directive that adds maximum length validation to controls marked with the
   * `maxlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
   *
   * @see [Form Validation](guide/form-validation)
   *
   * @usageNotes
   *
   * ### Adding a maximum length validator
   *
   * The following example shows how to add a maximum length validator to an input attached to an
   * ngModel binding.
   *
   * ```html
   * <input name="firstName" ngModel maxlength="25">
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class MaxLengthValidator extends AbstractValidatorDirective {
      constructor() {
          super(...arguments);
          /** @internal */
          this.inputName = 'maxlength';
          /** @internal */
          this.normalizeInput = (input) => toInteger(input);
          /** @internal */
          this.createValidator = (maxlength) => maxLengthValidator(maxlength);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: MaxLengthValidator, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: { maxlength: "maxlength" }, host: { properties: { "attr.maxlength": "_enabled ? maxlength : null" } }, providers: [MAX_LENGTH_VALIDATOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: MaxLengthValidator, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                      providers: [MAX_LENGTH_VALIDATOR],
                      host: { '[attr.maxlength]': '_enabled ? maxlength : null' }
                  }]
          }], propDecorators: { maxlength: [{
                  type: i0.Input
              }] } });
  /**
   * @description
   * Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.
   */
  const PATTERN_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: i0.forwardRef(() => PatternValidator),
      multi: true
  };
  /**
   * @description
   * A directive that adds regex pattern validation to controls marked with the
   * `pattern` attribute. The regex must match the entire control value.
   * The directive is provided with the `NG_VALIDATORS` multi-provider list.
   *
   * @see [Form Validation](guide/form-validation)
   *
   * @usageNotes
   *
   * ### Adding a pattern validator
   *
   * The following example shows how to add a pattern validator to an input attached to an
   * ngModel binding.
   *
   * ```html
   * <input name="firstName" ngModel pattern="[a-zA-Z ]*">
   * ```
   *
   * @ngModule ReactiveFormsModule
   * @ngModule FormsModule
   * @publicApi
   */
  class PatternValidator extends AbstractValidatorDirective {
      constructor() {
          super(...arguments);
          /** @internal */
          this.inputName = 'pattern';
          /** @internal */
          this.normalizeInput = (input) => input;
          /** @internal */
          this.createValidator = (input) => patternValidator(input);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PatternValidator, deps: null, target: i0__namespace.ɵɵFactoryTarget.Directive }); }
      static { this.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.0", type: PatternValidator, selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", inputs: { pattern: "pattern" }, host: { properties: { "attr.pattern": "_enabled ? pattern : null" } }, providers: [PATTERN_VALIDATOR], usesInheritance: true, ngImport: i0__namespace }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: PatternValidator, decorators: [{
              type: i0.Directive,
              args: [{
                      selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                      providers: [PATTERN_VALIDATOR],
                      host: { '[attr.pattern]': '_enabled ? pattern : null' }
                  }]
          }], propDecorators: { pattern: [{
                  type: i0.Input
              }] } });

  const SHARED_FORM_DIRECTIVES = [
      ɵNgNoValidate,
      NgSelectOption,
      ɵNgSelectMultipleOption,
      DefaultValueAccessor,
      NumberValueAccessor,
      RangeValueAccessor,
      CheckboxControlValueAccessor,
      SelectControlValueAccessor,
      SelectMultipleControlValueAccessor,
      RadioControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      MinLengthValidator,
      MaxLengthValidator,
      PatternValidator,
      CheckboxRequiredValidator,
      EmailValidator,
      MinValidator,
      MaxValidator,
  ];
  const TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
  const REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
  /**
   * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
   */
  class ɵInternalFormsSharedModule {
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ɵInternalFormsSharedModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule }); }
      static { this.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: ɵInternalFormsSharedModule, declarations: [ɵNgNoValidate,
              NgSelectOption,
              ɵNgSelectMultipleOption,
              DefaultValueAccessor,
              NumberValueAccessor,
              RangeValueAccessor,
              CheckboxControlValueAccessor,
              SelectControlValueAccessor,
              SelectMultipleControlValueAccessor,
              RadioControlValueAccessor,
              NgControlStatus,
              NgControlStatusGroup,
              RequiredValidator,
              MinLengthValidator,
              MaxLengthValidator,
              PatternValidator,
              CheckboxRequiredValidator,
              EmailValidator,
              MinValidator,
              MaxValidator], exports: [ɵNgNoValidate,
              NgSelectOption,
              ɵNgSelectMultipleOption,
              DefaultValueAccessor,
              NumberValueAccessor,
              RangeValueAccessor,
              CheckboxControlValueAccessor,
              SelectControlValueAccessor,
              SelectMultipleControlValueAccessor,
              RadioControlValueAccessor,
              NgControlStatus,
              NgControlStatusGroup,
              RequiredValidator,
              MinLengthValidator,
              MaxLengthValidator,
              PatternValidator,
              CheckboxRequiredValidator,
              EmailValidator,
              MinValidator,
              MaxValidator] }); }
      static { this.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ɵInternalFormsSharedModule }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ɵInternalFormsSharedModule, decorators: [{
              type: i0.NgModule,
              args: [{
                      declarations: SHARED_FORM_DIRECTIVES,
                      exports: SHARED_FORM_DIRECTIVES,
                  }]
          }] });

  /**
   * Tracks the value and validity state of an array of `FormControl`,
   * `FormGroup` or `FormArray` instances.
   *
   * A `FormArray` aggregates the values of each child `FormControl` into an array.
   * It calculates its status by reducing the status values of its children. For example, if one of
   * the controls in a `FormArray` is invalid, the entire array becomes invalid.
   *
   * `FormArray` accepts one generic argument, which is the type of the controls inside.
   * If you need a heterogenous array, use {@link UntypedFormArray}.
   *
   * `FormArray` is one of the four fundamental building blocks used to define forms in Angular,
   * along with `FormControl`, `FormGroup`, and `FormRecord`.
   *
   * @usageNotes
   *
   * ### Create an array of form controls
   *
   * ```
   * const arr = new FormArray([
   *   new FormControl('Nancy', Validators.minLength(2)),
   *   new FormControl('Drew'),
   * ]);
   *
   * console.log(arr.value);   // ['Nancy', 'Drew']
   * console.log(arr.status);  // 'VALID'
   * ```
   *
   * ### Create a form array with array-level validators
   *
   * You include array-level validators and async validators. These come in handy
   * when you want to perform validation that considers the value of more than one child
   * control.
   *
   * The two types of validators are passed in separately as the second and third arg
   * respectively, or together as part of an options object.
   *
   * ```
   * const arr = new FormArray([
   *   new FormControl('Nancy'),
   *   new FormControl('Drew')
   * ], {validators: myValidator, asyncValidators: myAsyncValidator});
   * ```
   *
   * ### Set the updateOn property for all controls in a form array
   *
   * The options object is used to set a default value for each child
   * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
   * array level, all child controls default to 'blur', unless the child
   * has explicitly specified a different `updateOn` value.
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl()
   * ], {updateOn: 'blur'});
   * ```
   *
   * ### Adding or removing controls from a form array
   *
   * To change the controls in the array, use the `push`, `insert`, `removeAt` or `clear` methods
   * in `FormArray` itself. These methods ensure the controls are properly tracked in the
   * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
   * the `FormArray` directly, as that result in strange and unexpected behavior such
   * as broken change detection.
   *
   * @publicApi
   */
  class FormArray extends AbstractControl {
      /**
       * Creates a new `FormArray` instance.
       *
       * @param controls An array of child controls. Each child control is given an index
       * where it is registered.
       *
       * @param validatorOrOpts A synchronous validator function, or an array of
       * such functions, or an `AbstractControlOptions` object that contains validation functions
       * and a validation trigger.
       *
       * @param asyncValidator A single async validator or array of async validator functions
       *
       */
      constructor(controls, validatorOrOpts, asyncValidator) {
          super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
          this.controls = controls;
          this._initObservables();
          this._setUpdateStrategy(validatorOrOpts);
          this._setUpControls();
          this.updateValueAndValidity({
              onlySelf: true,
              // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
              // `VALID` or `INVALID`.
              // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
              // to `true` to allow that during the control creation process.
              emitEvent: !!this.asyncValidator
          });
      }
      /**
       * Get the `AbstractControl` at the given `index` in the array.
       *
       * @param index Index in the array to retrieve the control. If `index` is negative, it will wrap
       *     around from the back, and if index is greatly negative (less than `-length`), the result is
       * undefined. This behavior is the same as `Array.at(index)`.
       */
      at(index) {
          return this.controls[this._adjustIndex(index)];
      }
      /**
       * Insert a new `AbstractControl` at the end of the array.
       *
       * @param control Form control to be inserted
       * @param options Specifies whether this FormArray instance should emit events after a new
       *     control is added.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * inserted. When false, no events are emitted.
       */
      push(control, options = {}) {
          this.controls.push(control);
          this._registerControl(control);
          this.updateValueAndValidity({ emitEvent: options.emitEvent });
          this._onCollectionChange();
      }
      /**
       * Insert a new `AbstractControl` at the given `index` in the array.
       *
       * @param index Index in the array to insert the control. If `index` is negative, wraps around
       *     from the back. If `index` is greatly negative (less than `-length`), prepends to the array.
       * This behavior is the same as `Array.splice(index, 0, control)`.
       * @param control Form control to be inserted
       * @param options Specifies whether this FormArray instance should emit events after a new
       *     control is inserted.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * inserted. When false, no events are emitted.
       */
      insert(index, control, options = {}) {
          this.controls.splice(index, 0, control);
          this._registerControl(control);
          this.updateValueAndValidity({ emitEvent: options.emitEvent });
      }
      /**
       * Remove the control at the given `index` in the array.
       *
       * @param index Index in the array to remove the control.  If `index` is negative, wraps around
       *     from the back. If `index` is greatly negative (less than `-length`), removes the first
       *     element. This behavior is the same as `Array.splice(index, 1)`.
       * @param options Specifies whether this FormArray instance should emit events after a
       *     control is removed.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * removed. When false, no events are emitted.
       */
      removeAt(index, options = {}) {
          // Adjust the index, then clamp it at no less than 0 to prevent undesired underflows.
          let adjustedIndex = this._adjustIndex(index);
          if (adjustedIndex < 0)
              adjustedIndex = 0;
          if (this.controls[adjustedIndex])
              this.controls[adjustedIndex]._registerOnCollectionChange(() => { });
          this.controls.splice(adjustedIndex, 1);
          this.updateValueAndValidity({ emitEvent: options.emitEvent });
      }
      /**
       * Replace an existing control.
       *
       * @param index Index in the array to replace the control. If `index` is negative, wraps around
       *     from the back. If `index` is greatly negative (less than `-length`), replaces the first
       *     element. This behavior is the same as `Array.splice(index, 1, control)`.
       * @param control The `AbstractControl` control to replace the existing control
       * @param options Specifies whether this FormArray instance should emit events after an
       *     existing control is replaced with a new one.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * replaced with a new one. When false, no events are emitted.
       */
      setControl(index, control, options = {}) {
          // Adjust the index, then clamp it at no less than 0 to prevent undesired underflows.
          let adjustedIndex = this._adjustIndex(index);
          if (adjustedIndex < 0)
              adjustedIndex = 0;
          if (this.controls[adjustedIndex])
              this.controls[adjustedIndex]._registerOnCollectionChange(() => { });
          this.controls.splice(adjustedIndex, 1);
          if (control) {
              this.controls.splice(adjustedIndex, 0, control);
              this._registerControl(control);
          }
          this.updateValueAndValidity({ emitEvent: options.emitEvent });
          this._onCollectionChange();
      }
      /**
       * Length of the control array.
       */
      get length() {
          return this.controls.length;
      }
      /**
       * Sets the value of the `FormArray`. It accepts an array that matches
       * the structure of the control.
       *
       * This method performs strict checks, and throws an error if you try
       * to set the value of a control that doesn't exist or if you exclude the
       * value of a control.
       *
       * @usageNotes
       * ### Set the values for the controls in the form array
       *
       * ```
       * const arr = new FormArray([
       *   new FormControl(),
       *   new FormControl()
       * ]);
       * console.log(arr.value);   // [null, null]
       *
       * arr.setValue(['Nancy', 'Drew']);
       * console.log(arr.value);   // ['Nancy', 'Drew']
       * ```
       *
       * @param value Array of values for the controls
       * @param options Configure options that determine how the control propagates changes and
       * emits events after the value changes
       *
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
       * is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control value is updated.
       * When false, no events are emitted.
       * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
       * updateValueAndValidity} method.
       */
      setValue(value, options = {}) {
          assertAllValuesPresent(this, false, value);
          value.forEach((newValue, index) => {
              assertControlPresent(this, false, index);
              this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
          });
          this.updateValueAndValidity(options);
      }
      /**
       * Patches the value of the `FormArray`. It accepts an array that matches the
       * structure of the control, and does its best to match the values to the correct
       * controls in the group.
       *
       * It accepts both super-sets and sub-sets of the array without throwing an error.
       *
       * @usageNotes
       * ### Patch the values for controls in a form array
       *
       * ```
       * const arr = new FormArray([
       *    new FormControl(),
       *    new FormControl()
       * ]);
       * console.log(arr.value);   // [null, null]
       *
       * arr.patchValue(['Nancy']);
       * console.log(arr.value);   // ['Nancy', null]
       * ```
       *
       * @param value Array of latest values for the controls
       * @param options Configure options that determine how the control propagates changes and
       * emits events after the value changes
       *
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
       * is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control
       * value is updated. When false, no events are emitted. The configuration options are passed to
       * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
       */
      patchValue(value, options = {}) {
          // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
          // `patchValue` can be called recursively and inner data structures might have these values,
          // so we just ignore such cases when a field containing FormArray instance receives `null` or
          // `undefined` as a value.
          if (value == null /* both `null` and `undefined` */)
              return;
          value.forEach((newValue, index) => {
              if (this.at(index)) {
                  this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
              }
          });
          this.updateValueAndValidity(options);
      }
      /**
       * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
       * value of all descendants to null or null maps.
       *
       * You reset to a specific form state by passing in an array of states
       * that matches the structure of the control. The state is a standalone value
       * or a form state object with both a value and a disabled status.
       *
       * @usageNotes
       * ### Reset the values in a form array
       *
       * ```ts
       * const arr = new FormArray([
       *    new FormControl(),
       *    new FormControl()
       * ]);
       * arr.reset(['name', 'last name']);
       *
       * console.log(arr.value);  // ['name', 'last name']
       * ```
       *
       * ### Reset the values in a form array and the disabled status for the first control
       *
       * ```
       * arr.reset([
       *   {value: 'name', disabled: true},
       *   'last'
       * ]);
       *
       * console.log(arr.value);  // ['last']
       * console.log(arr.at(0).status);  // 'DISABLED'
       * ```
       *
       * @param value Array of values for the controls
       * @param options Configure options that determine how the control propagates changes and
       * emits events after the value changes
       *
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
       * is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control is reset.
       * When false, no events are emitted.
       * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
       * updateValueAndValidity} method.
       */
      reset(value = [], options = {}) {
          this._forEachChild((control, index) => {
              control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
          });
          this._updatePristine(options);
          this._updateTouched(options);
          this.updateValueAndValidity(options);
      }
      /**
       * The aggregate value of the array, including any disabled controls.
       *
       * Reports all values regardless of disabled status.
       */
      getRawValue() {
          return this.controls.map((control) => control.getRawValue());
      }
      /**
       * Remove all controls in the `FormArray`.
       *
       * @param options Specifies whether this FormArray instance should emit events after all
       *     controls are removed.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when all controls
       * in this FormArray instance are removed. When false, no events are emitted.
       *
       * @usageNotes
       * ### Remove all elements from a FormArray
       *
       * ```ts
       * const arr = new FormArray([
       *    new FormControl(),
       *    new FormControl()
       * ]);
       * console.log(arr.length);  // 2
       *
       * arr.clear();
       * console.log(arr.length);  // 0
       * ```
       *
       * It's a simpler and more efficient alternative to removing all elements one by one:
       *
       * ```ts
       * const arr = new FormArray([
       *    new FormControl(),
       *    new FormControl()
       * ]);
       *
       * while (arr.length) {
       *    arr.removeAt(0);
       * }
       * ```
       */
      clear(options = {}) {
          if (this.controls.length < 1)
              return;
          this._forEachChild((control) => control._registerOnCollectionChange(() => { }));
          this.controls.splice(0);
          this.updateValueAndValidity({ emitEvent: options.emitEvent });
      }
      /**
       * Adjusts a negative index by summing it with the length of the array. For very negative
       * indices, the result may remain negative.
       * @internal
       */
      _adjustIndex(index) {
          return index < 0 ? index + this.length : index;
      }
      /** @internal */
      _syncPendingControls() {
          let subtreeUpdated = this.controls.reduce((updated, child) => {
              return child._syncPendingControls() ? true : updated;
          }, false);
          if (subtreeUpdated)
              this.updateValueAndValidity({ onlySelf: true });
          return subtreeUpdated;
      }
      /** @internal */
      _forEachChild(cb) {
          this.controls.forEach((control, index) => {
              cb(control, index);
          });
      }
      /** @internal */
      _updateValue() {
          this.value =
              this.controls.filter((control) => control.enabled || this.disabled)
                  .map((control) => control.value);
      }
      /** @internal */
      _anyControls(condition) {
          return this.controls.some((control) => control.enabled && condition(control));
      }
      /** @internal */
      _setUpControls() {
          this._forEachChild((control) => this._registerControl(control));
      }
      /** @internal */
      _allControlsDisabled() {
          for (const control of this.controls) {
              if (control.enabled)
                  return false;
          }
          return this.controls.length > 0 || this.disabled;
      }
      _registerControl(control) {
          control.setParent(this);
          control._registerOnCollectionChange(this._onCollectionChange);
      }
      /** @internal */
      _find(name) {
          return this.at(name) ?? null;
      }
  }
  const UntypedFormArray = FormArray;
  /**
   * @description
   * Asserts that the given control is an instance of `FormArray`
   *
   * @publicApi
   */
  const isFormArray = (control) => control instanceof FormArray;

  function isAbstractControlOptions(options) {
      return !!options &&
          (options.asyncValidators !== undefined ||
              options.validators !== undefined ||
              options.updateOn !== undefined);
  }
  // clang-format on
  /**
   * @description
   * Creates an `AbstractControl` from a user-specified configuration.
   *
   * The `FormBuilder` provides syntactic sugar that shortens creating instances of a
   * `FormControl`, `FormGroup`, or `FormArray`. It reduces the amount of boilerplate needed to
   * build complex forms.
   *
   * @see [Reactive Forms Guide](guide/reactive-forms)
   *
   * @publicApi
   */
  class FormBuilder {
      constructor() {
          this.useNonNullable = false;
      }
      /**
       * @description
       * Returns a FormBuilder in which automatically constructed `FormControl` elements
       * have `{nonNullable: true}` and are non-nullable.
       *
       * **Constructing non-nullable controls**
       *
       * When constructing a control, it will be non-nullable, and will reset to its initial value.
       *
       * ```ts
       * let nnfb = new FormBuilder().nonNullable;
       * let name = nnfb.control('Alex'); // FormControl<string>
       * name.reset();
       * console.log(name); // 'Alex'
       * ```
       *
       * **Constructing non-nullable groups or arrays**
       *
       * When constructing a group or array, all automatically created inner controls will be
       * non-nullable, and will reset to their initial values.
       *
       * ```ts
       * let nnfb = new FormBuilder().nonNullable;
       * let name = nnfb.group({who: 'Alex'}); // FormGroup<{who: FormControl<string>}>
       * name.reset();
       * console.log(name); // {who: 'Alex'}
       * ```
       * **Constructing *nullable* fields on groups or arrays**
       *
       * It is still possible to have a nullable field. In particular, any `FormControl` which is
       * *already* constructed will not be altered. For example:
       *
       * ```ts
       * let nnfb = new FormBuilder().nonNullable;
       * // FormGroup<{who: FormControl<string|null>}>
       * let name = nnfb.group({who: new FormControl('Alex')});
       * name.reset(); console.log(name); // {who: null}
       * ```
       *
       * Because the inner control is constructed explicitly by the caller, the builder has
       * no control over how it is created, and cannot exclude the `null`.
       */
      get nonNullable() {
          const nnfb = new FormBuilder();
          nnfb.useNonNullable = true;
          return nnfb;
      }
      group(controls, options = null) {
          const reducedControls = this._reduceControls(controls);
          let newOptions = {};
          if (isAbstractControlOptions(options)) {
              // `options` are `AbstractControlOptions`
              newOptions = options;
          }
          else if (options !== null) {
              // `options` are legacy form group options
              newOptions.validators = options.validator;
              newOptions.asyncValidators = options.asyncValidator;
          }
          return new FormGroup(reducedControls, newOptions);
      }
      /**
       * @description
       * Constructs a new `FormRecord` instance. Accepts a single generic argument, which is an object
       * containing all the keys and corresponding inner control types.
       *
       * @param controls A collection of child controls. The key for each child is the name
       * under which it is registered.
       *
       * @param options Configuration options object for the `FormRecord`. The object should have the
       * `AbstractControlOptions` type and might contain the following fields:
       * * `validators`: A synchronous validator function, or an array of validator functions.
       * * `asyncValidators`: A single async validator or array of async validator functions.
       * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
       * | submit').
       */
      record(controls, options = null) {
          const reducedControls = this._reduceControls(controls);
          // Cast to `any` because the inferred types are not as specific as Element.
          return new FormRecord(reducedControls, options);
      }
      /**
       * @description
       * Constructs a new `FormControl` with the given state, validators and options. Sets
       * `{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
       * control will be nullable. Accepts a single generic argument, which is the type  of the
       * control's value.
       *
       * @param formState Initializes the control with an initial state value, or
       * with an object that contains both a value and a disabled status.
       *
       * @param validatorOrOpts A synchronous validator function, or an array of
       * such functions, or a `FormControlOptions` object that contains
       * validation functions and a validation trigger.
       *
       * @param asyncValidator A single async validator or array of async validator
       * functions.
       *
       * @usageNotes
       *
       * ### Initialize a control as disabled
       *
       * The following example returns a control with an initial value in a disabled state.
       *
       * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
       * </code-example>
       */
      control(formState, validatorOrOpts, asyncValidator) {
          let newOptions = {};
          if (!this.useNonNullable) {
              return new FormControl(formState, validatorOrOpts, asyncValidator);
          }
          if (isAbstractControlOptions(validatorOrOpts)) {
              // If the second argument is options, then they are copied.
              newOptions = validatorOrOpts;
          }
          else {
              // If the other arguments are validators, they are copied into an options object.
              newOptions.validators = validatorOrOpts;
              newOptions.asyncValidators = asyncValidator;
          }
          return new FormControl(formState, { ...newOptions, nonNullable: true });
      }
      /**
       * Constructs a new `FormArray` from the given array of configurations,
       * validators and options. Accepts a single generic argument, which is the type of each control
       * inside the array.
       *
       * @param controls An array of child controls or control configs. Each child control is given an
       *     index when it is registered.
       *
       * @param validatorOrOpts A synchronous validator function, or an array of such functions, or an
       *     `AbstractControlOptions` object that contains
       * validation functions and a validation trigger.
       *
       * @param asyncValidator A single async validator or array of async validator functions.
       */
      array(controls, validatorOrOpts, asyncValidator) {
          const createdControls = controls.map(c => this._createControl(c));
          // Cast to `any` because the inferred types are not as specific as Element.
          return new FormArray(createdControls, validatorOrOpts, asyncValidator);
      }
      /** @internal */
      _reduceControls(controls) {
          const createdControls = {};
          Object.keys(controls).forEach(controlName => {
              createdControls[controlName] = this._createControl(controls[controlName]);
          });
          return createdControls;
      }
      /** @internal */
      _createControl(controls) {
          if (controls instanceof FormControl) {
              return controls;
          }
          else if (controls instanceof AbstractControl) { // A control; just return it
              return controls;
          }
          else if (Array.isArray(controls)) { // ControlConfig Tuple
              const value = controls[0];
              const validator = controls.length > 1 ? controls[1] : null;
              const asyncValidator = controls.length > 2 ? controls[2] : null;
              return this.control(value, validator, asyncValidator);
          }
          else { // T or FormControlState<T>
              return this.control(controls);
          }
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormBuilder, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormBuilder, providedIn: 'root' }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormBuilder, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'root' }]
          }] });
  /**
   * @description
   * `NonNullableFormBuilder` is similar to {@link FormBuilder}, but automatically constructed
   * {@link FormControl} elements have `{nonNullable: true}` and are non-nullable.
   *
   * @publicApi
   */
  class NonNullableFormBuilder {
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NonNullableFormBuilder, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NonNullableFormBuilder, providedIn: 'root', useFactory: () => i0.inject(FormBuilder).nonNullable }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: NonNullableFormBuilder, decorators: [{
              type: i0.Injectable,
              args: [{
                      providedIn: 'root',
                      useFactory: () => i0.inject(FormBuilder).nonNullable,
                  }]
          }] });
  /**
   * UntypedFormBuilder is the same as `FormBuilder`, but it provides untyped controls.
   */
  class UntypedFormBuilder extends FormBuilder {
      group(controlsConfig, options = null) {
          return super.group(controlsConfig, options);
      }
      /**
       * Like `FormBuilder#control`, except the resulting control is untyped.
       */
      control(formState, validatorOrOpts, asyncValidator) {
          return super.control(formState, validatorOrOpts, asyncValidator);
      }
      /**
       * Like `FormBuilder#array`, except the resulting array is untyped.
       */
      array(controlsConfig, validatorOrOpts, asyncValidator) {
          return super.array(controlsConfig, validatorOrOpts, asyncValidator);
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: UntypedFormBuilder, deps: null, target: i0__namespace.ɵɵFactoryTarget.Injectable }); }
      static { this.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: UntypedFormBuilder, providedIn: 'root' }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: UntypedFormBuilder, decorators: [{
              type: i0.Injectable,
              args: [{ providedIn: 'root' }]
          }] });

  /**
   * @module
   * @description
   * Entry point for all public APIs of the forms package.
   */
  /**
   * @publicApi
   */
  const VERSION = new i0.Version('17.3.0');

  /**
   * Exports the required providers and directives for template-driven forms,
   * making them available for import by NgModules that import this module.
   *
   * @see [Forms Overview](/guide/forms-overview)
   * @see [Template-driven Forms Guide](/guide/forms)
   *
   * @publicApi
   */
  class FormsModule {
      /**
       * @description
       * Provides options for configuring the forms module.
       *
       * @param opts An object of configuration options
       * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
       * correct, or to only call it `whenDisabled`, which is the legacy behavior.
       */
      static withConfig(opts) {
          return {
              ngModule: FormsModule,
              providers: [{
                      provide: CALL_SET_DISABLED_STATE,
                      useValue: opts.callSetDisabledState ?? setDisabledStateDefault
                  }]
          };
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormsModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule }); }
      static { this.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormsModule, declarations: [NgModel, NgModelGroup, NgForm], exports: [ɵInternalFormsSharedModule, NgModel, NgModelGroup, NgForm] }); }
      static { this.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormsModule, imports: [ɵInternalFormsSharedModule] }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: FormsModule, decorators: [{
              type: i0.NgModule,
              args: [{
                      declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                      exports: [ɵInternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
                  }]
          }] });
  /**
   * Exports the required infrastructure and directives for reactive forms,
   * making them available for import by NgModules that import this module.
   *
   * @see [Forms Overview](guide/forms-overview)
   * @see [Reactive Forms Guide](guide/reactive-forms)
   *
   * @publicApi
   */
  class ReactiveFormsModule {
      /**
       * @description
       * Provides options for configuring the reactive forms module.
       *
       * @param opts An object of configuration options
       * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
       * binding is used with reactive form directives.
       * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
       * correct, or to only call it `whenDisabled`, which is the legacy behavior.
       */
      static withConfig(opts) {
          return {
              ngModule: ReactiveFormsModule,
              providers: [
                  {
                      provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
                      useValue: opts.warnOnNgModelWithFormControl ?? 'always'
                  },
                  {
                      provide: CALL_SET_DISABLED_STATE,
                      useValue: opts.callSetDisabledState ?? setDisabledStateDefault
                  }
              ]
          };
      }
      static { this.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ReactiveFormsModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule }); }
      static { this.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0__namespace, type: ReactiveFormsModule, declarations: [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName], exports: [ɵInternalFormsSharedModule, FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName] }); }
      static { this.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ReactiveFormsModule, imports: [ɵInternalFormsSharedModule] }); }
  }
  i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0__namespace, type: ReactiveFormsModule, decorators: [{
              type: i0.NgModule,
              args: [{
                      declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                      exports: [ɵInternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
                  }]
          }] });

  exports.AbstractControl = AbstractControl;
  exports.AbstractControlDirective = AbstractControlDirective;
  exports.AbstractFormGroupDirective = AbstractFormGroupDirective;
  exports.COMPOSITION_BUFFER_MODE = COMPOSITION_BUFFER_MODE;
  exports.CheckboxControlValueAccessor = CheckboxControlValueAccessor;
  exports.CheckboxRequiredValidator = CheckboxRequiredValidator;
  exports.ControlContainer = ControlContainer;
  exports.DefaultValueAccessor = DefaultValueAccessor;
  exports.EmailValidator = EmailValidator;
  exports.FormArray = FormArray;
  exports.FormArrayName = FormArrayName;
  exports.FormBuilder = FormBuilder;
  exports.FormControl = FormControl;
  exports.FormControlDirective = FormControlDirective;
  exports.FormControlName = FormControlName;
  exports.FormGroup = FormGroup;
  exports.FormGroupDirective = FormGroupDirective;
  exports.FormGroupName = FormGroupName;
  exports.FormRecord = FormRecord;
  exports.FormsModule = FormsModule;
  exports.MaxLengthValidator = MaxLengthValidator;
  exports.MaxValidator = MaxValidator;
  exports.MinLengthValidator = MinLengthValidator;
  exports.MinValidator = MinValidator;
  exports.NG_ASYNC_VALIDATORS = NG_ASYNC_VALIDATORS;
  exports.NG_VALIDATORS = NG_VALIDATORS;
  exports.NG_VALUE_ACCESSOR = NG_VALUE_ACCESSOR;
  exports.NgControl = NgControl;
  exports.NgControlStatus = NgControlStatus;
  exports.NgControlStatusGroup = NgControlStatusGroup;
  exports.NgForm = NgForm;
  exports.NgModel = NgModel;
  exports.NgModelGroup = NgModelGroup;
  exports.NgSelectOption = NgSelectOption;
  exports.NonNullableFormBuilder = NonNullableFormBuilder;
  exports.NumberValueAccessor = NumberValueAccessor;
  exports.PatternValidator = PatternValidator;
  exports.RadioControlValueAccessor = RadioControlValueAccessor;
  exports.RangeValueAccessor = RangeValueAccessor;
  exports.ReactiveFormsModule = ReactiveFormsModule;
  exports.RequiredValidator = RequiredValidator;
  exports.SelectControlValueAccessor = SelectControlValueAccessor;
  exports.SelectMultipleControlValueAccessor = SelectMultipleControlValueAccessor;
  exports.UntypedFormArray = UntypedFormArray;
  exports.UntypedFormBuilder = UntypedFormBuilder;
  exports.UntypedFormControl = UntypedFormControl;
  exports.UntypedFormGroup = UntypedFormGroup;
  exports.VERSION = VERSION;
  exports.Validators = Validators;
  exports.isFormArray = isFormArray;
  exports.isFormControl = isFormControl;
  exports.isFormGroup = isFormGroup;
  exports.isFormRecord = isFormRecord;
  exports.ɵInternalFormsSharedModule = ɵInternalFormsSharedModule;
  exports.ɵNgNoValidate = ɵNgNoValidate;
  exports.ɵNgSelectMultipleOption = ɵNgSelectMultipleOption;

}));
