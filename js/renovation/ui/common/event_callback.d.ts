// eslint-disable-next-line @typescript-eslint/no-type-alias
export type EventCallback<T = undefined> = T extends undefined ? () => void : (value: T) => void;
