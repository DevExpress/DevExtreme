import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { isFunction, isPlainObject } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

export type ActionArguments<
  TComponent,
  TEventData,
> = Record<string, unknown> & TEventData & {
  args?: TEventData[];
  action: (e: TEventData) => void;
  context: TComponent;
  component: TComponent;
  cancel: boolean;
  handled: boolean;
  validatingTargetName?: string;
};

interface ActionEvent {
  action: unknown;
  args: unknown[];
  context: unknown;
  component: unknown;
  validatingTargetName: string | undefined;
  cancel: boolean;
  handled: boolean;
  result?: unknown;
}

type ActionCallback = (this: unknown, e: ActionEvent) => void;

interface ActionOptions {
  context?: unknown;
  beforeExecute?: ActionCallback;
  afterExecute?: ActionCallback;
  component?: unknown;
  validatingTargetName?: string;
  excludeValidators?: string[];
}

interface ActionExecutor {
  validate?: (e: ActionEvent) => void;
  execute?: (e: ActionEvent) => void;
}

type TargetCondition = ($target: dxElementWrapper) => boolean;

class Action {
  _action: unknown;

  _context: unknown;

  _beforeExecute: ActionCallback | undefined;

  _afterExecute: ActionCallback | undefined;

  _component: unknown;

  _validatingTargetName: string | undefined;

  _excludeValidators: Record<string, boolean>;

  static executors: Record<string, ActionExecutor>;

  constructor(action?: unknown, config?: ActionOptions) {
    const options = config || {};
    this._action = action;
    this._context = options.context || getWindow();
    this._beforeExecute = options.beforeExecute;
    this._afterExecute = options.afterExecute;
    this._component = options.component;
    this._validatingTargetName = options.validatingTargetName;
    const excludeValidators: Record<string, boolean> = {};
    this._excludeValidators = excludeValidators;

    if (options.excludeValidators) {
      for (const validator of options.excludeValidators) {
        excludeValidators[validator] = true;
      }
    }
  }

  execute(...args: unknown[]): unknown {
    const e: ActionEvent = {
      action: this._action,
      args: Array.prototype.slice.call(args),
      context: this._context,
      component: this._component,
      validatingTargetName: this._validatingTargetName,
      cancel: false,
      handled: false,
    };

    const beforeExecute = this._beforeExecute;
    const afterExecute = this._afterExecute;

    const argsBag = (e.args[0] || {}) as { cancel?: boolean };

    if (!this._validateAction(e)) {
      return undefined;
    }

    beforeExecute?.call(this._context, e);

    if (e.cancel) {
      return undefined;
    }

    const result = this._executeAction(e);

    if (argsBag.cancel) {
      return undefined;
    }

    afterExecute?.call(this._context, e);

    return result;
  }

  _validateAction(e: ActionEvent): boolean {
    const excludeValidators = this._excludeValidators;
    const { executors } = Action;

    for (const name of Object.keys(executors)) {
      if (!excludeValidators[name]) {
        const executor = executors[name];
        executor.validate?.(e);

        if (e.cancel) {
          return false;
        }
      }
    }

    return true;
  }

  _executeAction(e: ActionEvent): unknown {
    const { executors } = Action;

    for (const name of Object.keys(executors)) {
      const executor = executors[name];
      executor.execute?.(e);

      if (e.handled) {
        return e.result;
      }
    }

    return undefined;
  }

  static registerExecutor(name: string, executor: ActionExecutor): void;
  static registerExecutor(executors: Record<string, ActionExecutor>): void;
  static registerExecutor(
    name: string | Record<string, ActionExecutor>,
    executor?: ActionExecutor,
  ): void {
    if (isPlainObject(name)) {
      each(name, Action.registerExecutor);
      return;
    }
    Action.executors[name] = executor as ActionExecutor;
  }

  static unregisterExecutor(...names: string[]): void {
    names.forEach((name) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete Action.executors[name];
    });
  }
}

Action.executors = {};

const createValidatorByTargetElement = (condition: TargetCondition) => (e: ActionEvent): void => {
  if (!e.args.length) {
    return;
  }

  const args = e.args[0] as Record<string, unknown>;
  const element = args[e.validatingTargetName as string] || args.element;

  if (element && condition($(element as Element))) {
    e.cancel = true;
  }
};

Action.registerExecutor({
  disabled: {
    validate: createValidatorByTargetElement(($target) => $target.is('.dx-state-disabled, .dx-state-disabled *')),
  },

  readOnly: {
    validate: createValidatorByTargetElement(($target) => $target.is('.dx-state-readonly, .dx-state-readonly *:not(.dx-state-independent)')),
  },
  undefined: {
    execute: (e) => {
      if (!e.action) {
        e.result = undefined;
        e.handled = true;
      }
    },
  },
  func: {
    execute: (e) => {
      if (isFunction(e.action)) {
        e.result = e.action.call(e.context, e.args[0]);
        e.handled = true;
      }
    },
  },
});

export { Action };
export default Action;
