type Extended<T, TExtension extends Extension<symbol, unknown>> = T & {
  [K in keyof TExtension]: TExtension[K]
};

type Split<
  TObj extends Extension<TSymbol, unknown>,
  TSymbol extends symbol,
> = TObj extends Extended<infer T, Extension<TSymbol, TObj[TSymbol]> >
  ? [T, TObj[TSymbol]]
  : never;

export type Extension<TSymbol extends symbol, TValue> = {
  [K in TSymbol]: TValue
};

export function detach<TExtended extends Extension<TSymbol, unknown>, TSymbol extends symbol>(
  value: TExtended,
  symbol: TSymbol,
): Split<TExtended, TSymbol> {
  const { [symbol]: extensionValue, ...rest } = value;
  return [rest, extensionValue] as Split<TExtended, TSymbol>;
}
