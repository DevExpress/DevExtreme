type CallbackType<TArgs extends any[], TContext>
  = ((this: TContext, ...args: TArgs) => boolean)
  | ((this: TContext, ...args: TArgs) => void);

export interface Callback<TArgs extends any[] = any[], TContext = any> {
  add(fn: CallbackType<TArgs, TContext>): this;

  remove(fn: CallbackType<TArgs, TContext>): this;

  has(fn: CallbackType<TArgs, TContext>): this;

  empty(): this;

  fireWith(context: TContext, args: TArgs): this;

  fire(...args: TArgs): this;

  fired(): boolean;
}

export default function createCallback<TArgs extends any[]>(): Callback<TArgs>;
