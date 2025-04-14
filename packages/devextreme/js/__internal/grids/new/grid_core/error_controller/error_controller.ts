/* eslint-disable spellcheck/spell-checker */
import type { Subscribable } from '@ts/core/reactive/index';
import { state } from '@ts/core/reactive/index';

export interface GridError {
  text: string;
  id: number;
}

export class ErrorController {
  private readonly _errors = state<GridError[]>([]);

  public errors: Subscribable<GridError[]> = this._errors;

  public static dependencies = [] as const;

  private counter = 0;

  public showError(error: string): void {
    this._errors.updateFunc((errors) => [...errors, {
      text: error,
      id: this.counter,
    }]);
    this.counter += 1;
  }

  public removeError(index: number): void {
    this._errors.updateFunc((errors) => {
      const newErrors = errors.slice();
      newErrors.splice(index, 1);
      return newErrors;
    });
  }
}
