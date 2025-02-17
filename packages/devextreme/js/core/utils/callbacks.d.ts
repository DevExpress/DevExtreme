/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type CallbackType<TArgs extends any[], TContext>
  = ((this: TContext, ...args: TArgs) => boolean)
  | ((this: TContext, ...args: TArgs) => void);

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface Callback<TArgs extends any[] = any[], TContext = any> {
  add(fn: CallbackType<TArgs, TContext>): this;

  remove(fn: CallbackType<TArgs, TContext>): this;

  has(fn: CallbackType<TArgs, TContext>): this;

  empty(): this;

  fireWith(context: TContext, args: TArgs): this;

  fire(...args: TArgs): this;

  fired(): boolean;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default function createCallback<TArgs extends any[]>(options?): Callback<TArgs>;
