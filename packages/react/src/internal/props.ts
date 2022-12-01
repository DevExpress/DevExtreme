type HandlerProp<P extends string> = `${P}Change`;
type DefaultProp<P extends string> = `default${Capitalize<P>}`;

type WithHandlerProps<T> = { [P in keyof T & string as HandlerProp<P>]?: (value: T[P]) => void };
type WithDefaultProps<T> = { [P in keyof T & string as DefaultProp<P>]?: T[P] };

export type Props<
  TValues,
  TReadonly,
  TTemplate,
  > =
  Partial<TValues>
  & WithDefaultProps<TValues>
  & WithHandlerProps<TValues>
  & Partial<TReadonly>
  & Partial<TTemplate>;
