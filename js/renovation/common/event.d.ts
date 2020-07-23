type EventHandler<T = void> = T extends void ? () => void : (value: T) => void;
