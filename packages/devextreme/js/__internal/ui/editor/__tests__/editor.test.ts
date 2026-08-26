import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import { data } from '@js/core/element_data';
import $ from '@js/core/renderer';

import type { EditorProperties } from '../editor';
import Editor from '../editor';

const VALIDATION_TARGET = 'dx-validation-target';

interface ValidationRequestArgs {
  value: unknown;
  editor: unknown;
}

class ProbeEditor extends Editor {
  public hasValidationRequestOnOptionsInit?: boolean;

  _initOptions(options: EditorProperties): void {
    this.hasValidationRequestOnOptionsInit = Boolean(this.validationRequest);

    super._initOptions(options);
  }
}

const editors: ProbeEditor[] = [];

const createEditor = (options: Partial<EditorProperties> = {}): ProbeEditor => {
  const element = $('<div>').appendTo(document.body).get(0) as HTMLElement;
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance: ProbeEditor = new ProbeEditor(element, options);

  editors.push(instance);

  return instance;
};

describe('Editor initialization', () => {
  afterEach(() => {
    editors.forEach((instance) => instance.dispose());
    editors.length = 0;
    document.body.innerHTML = '';
  });

  it('creates validationRequest before the options are initialized', () => {
    const instance = createEditor();

    expect(instance.hasValidationRequestOnOptionsInit).toBe(true);
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
