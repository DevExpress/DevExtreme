import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import { data } from '@js/core/element_data';
import $ from '@js/core/renderer';
import Validator from '@ts/ui/validator';

import type { EditorProperties } from '../editor';
import Editor from '../editor';

const VALIDATION_TARGET = 'dx-validation-target';

interface ValidationRequestArgs {
  value: unknown;
  editor: unknown;
}

const disposables: { dispose: () => void }[] = [];

const createEditor = (options: Partial<EditorProperties> = {}): Editor => {
  const element = $('<div>').appendTo(document.body).get(0) as HTMLElement;
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance: Editor = new Editor(element, options);

  disposables.push(instance);

  return instance;
};

describe('Editor initialization', () => {
  afterEach(() => {
    disposables.forEach((instance) => instance.dispose());
    disposables.length = 0;
    document.body.innerHTML = '';
  });

  it('lets a validator attach while the editor initialization is deferred by beginUpdate', () => {
    const instance = createEditor({
      onInitializing(this: Editor): void {
        this.beginUpdate();
      },
    } as Partial<EditorProperties>);

    expect(() => {
      // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
      const validator: Validator = new Validator(instance.$element().get(0), {});

      disposables.push(validator);
    }).not.toThrow();

    instance.endUpdate();
  });

  it('marks the element as a validation target with the validation state ready', () => {
    const instance = createEditor();
    const element = instance.$element().get(0) as HTMLElement;

    expect(data(element, VALIDATION_TARGET)).toBe(instance);
    expect(instance.validationRequest).toBeDefined();
    expect(instance.showValidationMessageTimeout).toBeUndefined();
  });

  it('fires validationRequest when the value changes', () => {
    const instance = createEditor({ value: 'initial' });
    const calls: ValidationRequestArgs[] = [];

    instance.validationRequest.add((args: ValidationRequestArgs) => {
      calls.push(args);
    });
    instance.option('value', 'changed');

    expect(calls).toHaveLength(1);
    expect(calls[0].value).toBe('changed');
    expect(calls[0].editor).toBe(instance);
  });
});
