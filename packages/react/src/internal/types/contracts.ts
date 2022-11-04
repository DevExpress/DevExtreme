type OutputProp<P extends string> = `${P}Change`;
type DefaultProp<P extends string> = `default${Capitalize<P>}`;

type WithOutputCallback<T> = { [P in keyof T & string as OutputProp<P>]?: (value: T[P]) => void };
type WithDefaultModels<T> = { [P in keyof T & string as DefaultProp<P>]?: T[P] };

type ReactCallbacks<TModel> = WithOutputCallback<TModel>;
type ReactContracts<TModel, TConfig, TTemplate> =
    Partial<TModel>
    & WithDefaultModels<TModel>
    & ReactCallbacks<TModel>
    & Partial<TConfig>
    & Partial<TTemplate>;

export type {
    ReactCallbacks,
    ReactContracts
};
