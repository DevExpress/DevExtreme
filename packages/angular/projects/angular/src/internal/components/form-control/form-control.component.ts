import {Component} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {OnChangeCallback, OnTouchCallback} from './types';

@Component({template: ''})
abstract class FormControlComponent<TValue> implements ControlValueAccessor {
  /* angular reactive form fields */
  protected onChangeCallback?: OnChangeCallback<TValue> = () => {
  };
  protected onTouchCallback?: OnTouchCallback = () => {
  };

  protected constructor(protected ngControl?: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  abstract writeValue(value: TValue): void;

  /* Support angular reactive forms methods */
  registerOnChange(onChangeCallback: OnChangeCallback<TValue>): void {
    this.onChangeCallback = onChangeCallback;
  }

  registerOnTouched(onTouchCallback: OnTouchCallback): void {
    this.onTouchCallback = onTouchCallback
  }

  protected updateFormValue(newValue: TValue): void {
    this.onChangeCallback && this.onChangeCallback(newValue);
    this.onTouchCallback && this.onTouchCallback();
  }
}

export {FormControlComponent};
