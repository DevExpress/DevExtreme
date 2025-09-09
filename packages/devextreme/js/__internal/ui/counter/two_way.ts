export interface TwoWayConfig<TProps> {
  prop: keyof TProps & string;
  change: keyof TProps & string;
}

export function createTwoWayProps<
  TProps extends Record<string, unknown>,
  TValue = unknown,
>(
  widgetOption: (name: string, value: TValue) => void,
  propsFromOptions: Partial<TProps>,
  configs: TwoWayConfig<TProps>[],
): Partial<TProps> {
  const result: Partial<TProps> = { ...propsFromOptions };

  configs.forEach(({ prop, change }) => {
    const originalChange = (propsFromOptions as Record<string, unknown>)[change] as
      | ((v: TValue) => void)
      | undefined;

    (result as Record<string, unknown>)[change] = (val: TValue): void => {
      widgetOption(prop, val);
      originalChange?.(val);
    };
  });

  return result;
}
