import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { signal } from '@ts/core/state_manager/index';

export interface GridError {
  text: string;
  id: number;
}

export class ErrorController {
  private readonly _errors = signal<GridError[]>([]);

  public errors: ReadonlySignal<GridError[]> = this._errors;

  public static dependencies = [] as const;

  private counter = 0;

  public showError(error: string): void {
    this._errors.value = [...this._errors.peek(), {
      text: error,
      id: this.counter,
    }];
    this.counter += 1;
  }

  public removeError(index: number): void {
    const newErrors = this._errors.peek().slice();
    newErrors.splice(index, 1);
    this._errors.value = newErrors;
  }
}
