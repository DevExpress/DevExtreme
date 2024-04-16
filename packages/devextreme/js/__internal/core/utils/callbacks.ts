/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface CallbackOptions {
  unique?: boolean;
  syncStrategy?: boolean;
  stopOnFalse?: boolean;
}

type CallbackType<TArgs extends any[], TContext>
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  = ((this: TContext, ...args: TArgs) => boolean | void);

class Callback<TArgs extends any[], TContext> {
  private _list: CallbackType<TArgs, TContext>[] = [];

  private _queue: [TContext, TArgs][] = [];

  private _firing = false;

  private _fired = false;

  private readonly _firingIndexes: number[] = [];

  constructor(private readonly _options: CallbackOptions = {}) {}

  private _fireCore(context: TContext, args: TArgs): void {
    const firingIndexes = this._firingIndexes;
    const list = this._list;
    const { stopOnFalse } = this._options;
    const step = firingIndexes.length;

    for (firingIndexes[step] = 0; firingIndexes[step] < list.length; firingIndexes[step] += 1) {
      const result = list[firingIndexes[step]].apply(context, args);

      if (result === false && stopOnFalse) {
        break;
      }
    }

    firingIndexes.pop();
  }

  add(fn: CallbackType<TArgs, TContext>): this {
    if (typeof fn === 'function' && (!this._options.unique || !this.has(fn))) {
      this._list.push(fn);
    }
    return this;
  }

  remove(fn: CallbackType<TArgs, TContext>): this {
    const list = this._list;
    const firingIndexes = this._firingIndexes;
    const index = list.indexOf(fn);

    if (index > -1) {
      list.splice(index, 1);

      if (this._firing && firingIndexes.length) {
        for (let step = 0; step < firingIndexes.length; step += 1) {
          if (index <= firingIndexes[step]) {
            firingIndexes[step] -= 1;
          }
        }
      }
    }

    return this;
  }

  has(fn: CallbackType<TArgs, TContext>): boolean {
    const list = this._list;

    return fn ? list.includes(fn) : !!list.length;
  }

  empty(): this {
    this._list = [];

    return this;
  }

  fireWith(context: TContext, args: TArgs): this {
    const queue = this._queue;

    args = args || [];
    // @ts-expect-error
    args = args.slice ? args.slice() : args;

    if (this._options.syncStrategy) {
      this._firing = true;
      this._fireCore(context, args);
    } else {
      queue.push([context, args]);
      if (this._firing) {
        return this;
      }

      this._firing = true;

      while (queue.length) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const memory = queue.shift()!;

        this._fireCore(memory[0], memory[1]);
      }
    }

    this._firing = false;
    this._fired = true;

    return this;
  }

  fire(this: this & TContext, ...args: TArgs): void {
    this.fireWith(this, args);
  }

  fired(): boolean {
    return this._fired;
  }
}

export type { Callback };

export default function createCallback<TArgs extends any[] = [], TContext = unknown>(
  options?: CallbackOptions,
): Callback<TArgs, TContext> {
  return new Callback(options);
}
