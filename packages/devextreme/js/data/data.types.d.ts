export type KeySelector<T> = string | ((source: T) => string | number | Date | Object);

export type SelectionDescriptor<T> = {
    selector: KeySelector<T>;
};

export type OrderingDescriptor<T> = SelectionDescriptor<T> & {
    desc?: boolean;
};
