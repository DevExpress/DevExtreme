/* eslint-disable spellcheck/spell-checker */
import type { Subscribable } from '@ts/core/reactive';
import { state } from '@ts/core/reactive';

import { DataController } from '../data_controller/data_controller';

export class ErrorController {
  private readonly _errors = state<string[]>([]);

  public errors: Subscribable<string[]> = this._errors;

  public static dependencies = [DataController] as const;

  constructor(private readonly dataController: DataController) {}

  public addError(error: string): void {
    this._errors.updateFunc((errors) => [...errors, error]);
  }

  public removeError(index: number): void {
    this._errors.updateFunc((errors) => {
      const newErrors = errors.slice();
      newErrors.splice(index, 1);
      return newErrors;
    });
  }
}
