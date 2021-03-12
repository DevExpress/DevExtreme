// eslint-disable-next-line @typescript-eslint/no-type-alias
export type EventCallback<T = void> = T extends void ? () => void : (value: T) => void;
